# webGame

- 启动redis-server`sudo redis-server /etc/redis/redis.conf`
    - 重启redis`sudo /etc/init.d/redis-server restart`
- 启动nginx`sudo /etc/init.d/nginx start`
    - 重启nginx`sudo nginx -s reload`
- 启动wsgi`uwsgi --ini scripts/uwsgi.ini`
- 启动django_channel`daphne -b 0.0.0.0 -p 5015 acapp.asgi:application`
- 启动匹配服务match_system`~/webGame/match_system/src/main.py`
<br>
django详细笔记参考：https://github.com/77zzl/noteKnight/blob/main/code/Django.md
