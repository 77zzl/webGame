from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache


class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        # 后端同意连接则调用accept
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    # 将用户添加进房间
    async def create_player(self, data):
        # 为每个用户分配房间
        self.room_name = None
        for i in range(1000):
            name = "room-%d" % (i)
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                self.room_name = name
                break
        # 如果1000个房间都满了则不允许匹配了
        if not self.room_name:
            return
        # 如果房间为空则创建房间
        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600)

        # 将房间内所有已有玩家信息发送到前端
        for player in cache.get(self.room_name):
            await self.send(text_data=json.dumps({
                    'event': "create_player",
                    'uuid': player['uuid'],
                    'username': player['username'],
                    'photo': player['photo'],
                }))

        # 将不同的连接放到组内
        await self.channel_layer.group_add(self.room_name, self.channel_name)

        # 在redis中将用户加入到房间
        players = cache.get(self.room_name)
        players.append({
            'uuid': data['uuid'],
            'username': data['username'],
            'photo': data['photo']
        })
        cache.set(self.room_name, players, 3600)

        '''
        群发信息
        group_send接收两个参数：
            1、群组的名字
            2、群发的信息
        '''
        await self.channel_layer.group_send(
            self.room_name,
            {
                # type为接收群发消息的函数
                'type': "group_send_event",
                'event': "create_player",
                'uuid': data['uuid'],
                'username': data['username'],
                'photo': data['photo']
            }
        )

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

    # 将消息群发到组
    async def group_send_event(self, data):
        await self.send(text_data=json.dumps(data))

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
