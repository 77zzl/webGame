from django.shortcuts import redirect, reverse
from django.core.cache import cache
import requests
from django.contrib.auth.models import User
from game.models.player.player import Player
from django.contrib.auth import login
from random import randint
from rest_framework_simplejwt.tokens import RefreshToken


# 接受来自acwing的信息
def receive_code(request):
    # 获取授权码
    data = request.GET
    code = data.get('code')
    state = data.get('state')

    if not cache.get(state):
        return redirect("index")
    cache.delete(state)

    # 获取token令牌和openid
    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        'appid': '4230',
        'secret': '15a6a2172e794abb9c4d1a3f54f44535',
        'code': code
    }
    access_token_res = requests.get(apply_access_token_url, params=params).json()
    access_token = access_token_res['access_token']
    openid = access_token_res['openid']

    # 判断用户是否已通过授权渠道注册过
    players = Player.objects.filter(openid=openid)
    if players.exists():
        # 手动获取refresh
        refresh = RefreshToken.for_user(players[0].user)
        # reverse根据名称转换为完整链接
        return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))

    # 获取用户信息
    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
            'access_token': access_token,
            'openid': openid
            }
    userinfo_res = requests.get(get_userinfo_url, params=params).json()
    username = userinfo_res['username']

    # 如果授权用户与数据库已有的用户重名则为其随机更名
    while User.objects.filter(username = username).exists():
        username += str(randint(0, 9))

    # 注册授权用户并登录
    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, photo='', openid=openid)

    refresh = RefreshToken.for_user(user)
    return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))

