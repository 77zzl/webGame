let AC_GAME_OBJECTS = [];
let run_game = true;

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false;  // 是否调用过start函数
        this.timedelta = 0;             // 当前帧距离上一帧的时间间隔
    }

    start() {   // 只在第一帧执行一次

    }

    update() {  // 每一帧均会执行一次

    }

    on_destroy() {  // 在销毁前执行一次

    }

    destroy() {     // 处理需销毁的玩家数据并销毁
        this.on_destroy();

        // 找到需要被删除的玩家
        for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

// 以下内容一直在后台挂着跑，作用于全局
// 以此结构实现递归，实现每一帧调用一次AC_GAME_ANIMATION函数
// 传入时间戳表示在哪个时间调用该函数
let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++) {
        if (!run_game)
            return;
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

// 在下一帧调用该函数，并执行AC_GAME_ANIMATION
requestAnimationFrame(AC_GAME_ANIMATION);
