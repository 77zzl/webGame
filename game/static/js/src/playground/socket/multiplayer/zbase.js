class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        // 建立连接
        this.ws = new WebSocket("wss://app4230.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start() {
        this.receive();
    }

    // 接受后端数据
    receive () {
        let outer = this;
        // 获取信息
        this.ws.onmessage = function(e) {
            // 将json解析
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;

            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            }
        };
    }

    // 向后端发送创建用户请求
    send_create_player(username, photo) {
        let outer = this;
        // 向后端发送字符串
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5, 0.05, "white", 0.15, "enemy", username, photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }
}

