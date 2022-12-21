#! /usr/bin/env python3

import glob
import sys
sys.path.insert(0, glob.glob('../../')[0])

from match_server.match_service import Match

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from queue import Queue
from time import sleep
from threading import Thread

from webGame.asgi import channel_layer
from asgiref.sync import async_to_sync
from django.core.cache import cache


# 消息队列
queue = Queue()

class Player:
    def __init__(self, score, uuid, username, photo, channel_name):
        self.score = score
        self.uuid = uuid
        self.username = username
        self.photo = photo
        self.channel_name = channel_name
        # 等待时间
        self.waiting_time = 0

# 匹配池
class Pool:
    def __init__(self):
        self.players = []
        # 房间人数可改
        self.room_capacity = 3

    # 添加到匹配池
    def add_player(self, player):
        self.players.append(player)

    # 检验是否匹配
    # TODO参数为列表
    def check_match(self, a, b):
        dt = abs(a.score - b.score)
        a_max_dif = a.waiting_time * 50
        b_max_dif = b.waiting_time * 50
        return dt <= a_max_dif and dt <= b_max_dif

    # 匹配成功
    # TODO修改内容
    def match_success(self, ps):
        print("Match Success: %s %s %s" % (ps[0].username, ps[1].username, ps[2].username))
        room_name = "room-%s-%s-%s" % (ps[0].uuid, ps[1].uuid, ps[2].uuid)
        players = []
        for p in ps:
            # 加入到组里
            async_to_sync(channel_layer.group_add)(room_name, p.channel_name)
            players.append({
                'uuid': p.uuid,
                'username': p.username,
                'photo': p.photo,
                'hp': 100,
            })
        cache.set(room_name, players, 3600)  # 有效时间：1小时
        for p in ps:
            # 广播创建玩家信息
            # 调用了consumer/multiplayer/index的函数
            async_to_sync(channel_layer.group_send)(
                room_name,
                {
                    'type': "group_send_event",
                    'event': "create_player",
                    'uuid': p.uuid,
                    'username': p.username,
                    'photo': p.photo,
                }
            )

    # 等待时间递增
    def increase_waiting_time(self):
        for player in self.players:
            player.waiting_time += 1

    # 在匹配池中进行匹配(贪心)，匹配入口
    def match(self):
        # 匹配池中人数到位就一直匹配，除非匹配池中均无法匹配成功
        while len(self.players) >= 3:
            # 贪心
            self.players = sorted(self.players, key=lambda p: p.score)
            flag = False
            # 滑动窗口
            for i in range(len(self.players) - 2):
                a, b, c = self.players[i], self.players[i + 1], self.players[i + 2]
                # 匹配成功
                if self.check_match(a, b) and self.check_match(a, c) and self.check_match(b, c):
                    self.match_success([a, b, c])
                    self.players = self.players[:i] + self.players[i + 3:]
                    flag = True
                    break
            if not flag:
                break
        self.increase_waiting_time()
'''
        while len(self.players) >= self.room_capacity:
            self.players = sorted(self.palyers, key=lambda p: p.score)
            flg = False

            # 滑动窗口，一个窗口内一个房间
            for l in range(len(self.players) - self.capacity):
                room = [self.players[i] for i in range(l, l + self.capacity)]
                # 匹配成功
                if self.check_match(room):
                    self.match_success(room)
                    flg = True
                    break
            if not flg:
                break
'''


class MatchHandler:
    def add_player(self, score, uuid, username, photo, channel_name):
        print("Add Player: %s %d" % (username, score))
        player = Player(score, uuid, username, photo, channel_name)
        queue.put(player)
        return 0

# 从信息队列中取元素
def get_player_from_queue():
    try:
        return queue.get_nowait()
    except:
        return None

# 消费者
def worker():
    pool = Pool()
    # 直接将所有玩家加入到匹配池里
    while True:
        player = get_player_from_queue()
        if player:
            pool.add_player(player)
        else:
            pool.match()
            sleep(1)



if __name__ == '__main__':
    handler = MatchHandler()
    processor = Match.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    # 每一个请求都开一个线程处理
    server = TServer.TThreadedServer(
        processor, transport, tfactory, pfactory)

    '''
    开一个线程
    target：执行函数
    daemon=True：杀死主线程后其他线程也被杀死
    '''
    Thread(target=worker, daemon=True).start()

    print('Starting the server...')
    server.serve()
    print('done.')

