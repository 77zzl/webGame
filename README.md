# webGame

- 启动redis-server`sudo redis-server /etc/redis/redis.conf`
    - 重启redis`/etc/init.d/redis-server restart`
- 启动nginx`sudo /etc/init.d/nginx start`
    - 重启nginx`sudo nginx -s reload`
- 启动wsgi`uwsgi --ini scripts/uwsgi.ini`
- 启动django_channel`daphne -b 0.0.0.0 -p 5015 acapp.asgi:application`
- 启动匹配服务match_system`/home/developer/webGame/match_system/src/main.py`
