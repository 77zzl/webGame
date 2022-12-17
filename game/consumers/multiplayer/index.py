from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache


class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        # 为每个用户分配房间
        self.room_name = None
        for i in range(1000):
            name = "room-%d" % (i)
            # 如果该房间为空或者房间未满则让用户进入
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                self.room_name = name
                break
        # 如果1000个房间都满了则不允许匹配了
        if not self.room_name:
            return
        # 如果房间为空则创建房间
        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600)

        # 后端同意连接则调用accept
        await self.accept()

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

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    # 将用户添加进房间
    async def create_player(self, data):
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
                'type': "group_create_player",
                'event': "create_player",
                'uuid': data['uuid'],
                'username': data['username'],
                'photo': data['photo']
            }
        )

    # 接受群发的信息
    async def group_create_player(self, data):
        await self.send(text_data=json.dumps(data))

    # 接受前端发来的信息
    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        # 前端申请创建用户事件
        if event == "create_player":
            await self.create_player(data)

