from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache


# 生成8位随机码
def get_state():
    res = ""
    for i in range(8):
        res += str(randint(0, 9))
    return res

# 发送授权码code
def apply_code(request):
    apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"
    appid = "4230"
    redirect_uri = quote("https://www.77zzl.top/settings/acwing/web/receive_code")
    scope = "userinfo"
    state = get_state()

    # 将随机码存入redis，有效期两小时
    cache.set(state, True, 7200)
    # 向acwing发送授权申请
    return JsonResponse({
        'result': 'success',
        'apply_code_url': apply_code_url + "?appid=%s&redirect_uri=%s&scope=%s&state=%s" % (appid, redirect_uri, scope, state)
        })
