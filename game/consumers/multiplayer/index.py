from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

from match_system.src.match_server.match_service import Match
from game.models.player.player import Player
from channels.db import database_sync_to_async

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        # 后端同意连接则调用accept
        if user.is_authenticated:
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_name') and self.room_name:
            await self.channel_layer.group_discard(self.room_name, self.channel_name)

    # 将用户添加进房间
    async def create_player(self, data):
        self.room_name = None
        self.uuid = data['uuid']

        # Make socket
        transport = TSocket.TSocket('127.0.0.1', 9090)

        # Buffering is critical. Raw sockets are very slow
        transport = TTransport.TBufferedTransport(transport)

        # Wrap in a protocol
        protocol = TBinaryProtocol.TBinaryProtocol(transport)

        # Create a client to use the protocol encoder
        client = Match.Client(protocol)

        # 在同步中调用数据库必须封装成函数
        def db_get_player():
            return Player.objects.get(user__username=data['username'])

        player = await database_sync_to_async(db_get_player)()

        # Connect!
        transport.open()

        # 将用户数据传给thrift匹配服务
        client.add_player(player.score, data['uuid'], data['username'], data['photo'], self.channel_name)

        # Close!
        transport.close()

    # 将消息群发到组
    async def group_send_event(self, data):
        if not self.room_name:
            keys = cache.keys('*%s*' % (self.uuid))
            if keys:
                self.room_name = keys[0]
        await self.send(text_data=json.dumps(data))

    # 移动事件
    async def move_to(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_send_event',
                'event': 'move_to',
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty']
            }
        )

    # 发送火焰事件
    async def shoot_fireball(self, data):
        await self.channel_layer.group_send(
                self.room_name,
                {
                    'type': 'group_send_event',
                    'event': 'shoot_fireball',
                    'uuid': data['uuid'],
                    'tx': data['tx'],
                    'ty': data['ty'],
                    'ball_uuid': data['ball_uuid']
                }
        )

    # 发送收击信息
    async def attack(self, data):
        if not self.room_name:
            return
        players = cache.get(self.room_name)
        if not players:
            return

        # 减血
        for player in players:
            if player['uuid'] == data['attackee_uuid']:
                player['hp'] -= 25

        # 统计剩余人数并刷新redis
        remain_cnt = 0
        for player in players:
            if player['hp'] > 0:
                remain_cnt += 1
        # 对局存在且还有人
        if remain_cnt > 1:
            if self.room_name:
                cache.set(self.room_name, players, 3600)
        else:
            def db_update_player_score(username, score):
                player = Player.objects.get(user__username = username)
                player.score += score
                player.save()
            for player in players:
                if player['hp'] <= 0:
                    await database_sync_to_async(db_update_player_score)(player['username'], -2)
                else:
                    await database_sync_to_async(db_update_player_score)(player['username'], 3)

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_send_event',
                'event': 'attack',
                'uuid': data['uuid'],
                'attackee_uuid': data['attackee_uuid'],
                'x': data['x'],
                'y': data['y'],
                'angle': data['angle'],
                'damage': data['damage'],
                'ball_uuid': data['ball_uuid']
            }
        )

    # 发送闪现信息
    async def blink(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "blink",
                "uuid": data["uuid"],
                'tx': data['tx'],
                'ty': data['ty']
            }
        )

    # 发送聊天消息
    async def message(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "message",
                'uuid': data['uuid'],
                'username': data['username'],
                'text': data['text']
            }
        )

    # 接受前端发来的信息，起路由作用
    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        # 前端申请创建用户事件
        if event == "create_player":
            await self.create_player(data)
        elif event == "move_to":
            await self.move_to(data)
        elif event == "shoot_fireball":
            await self.shoot_fireball(data)
        elif event == "attack":
            await self.attack(data)
        elif event == "blink":
            await self.blink(data)
        elif event == "message":
            await self.message(data)
