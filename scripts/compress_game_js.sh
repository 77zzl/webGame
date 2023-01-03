#! /bin/bash

BASE=/home/developer/webGame/
JS_PATH=/home/developer/webGame/game/static/js/
JS_PATH_DIST=${JS_PATH}dist
JS_PATH_SRC=${JS_PATH}src

find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat | terser -c -m > ${JS_PATH_DIST}/game.js

echo yes | python3 ${BASE}manage.py collectstatic
