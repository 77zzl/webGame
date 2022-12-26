class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        // 建立连接
        this.ws = new WebSocket("wss://app4230.acapp.acwing.com.cn/wss/multiplayer/?token=" + playground.root.access);

        this.start();
    }

    start() {
        this.receive();
    }

    // 接受后端数据，充当路由作用
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
                outer.receive_create_player(uuid, data.username, "");
            } else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty)
            } else if (event == "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid)
            } else if (event === "attack") {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid)
            } else if (event === "blink") {
                outer.receive_blink(uuid, data.tx, data.ty)
            } else if (event === "message") {
                outer.receive_message(uuid, data.username, data.text)
            }
        };
    }

    // 判断用户
    get_player(uuid) {
        let players = this.playground.players
        for (let i = 0; i < players.length; i++) {
            let player = players[i]
            if (player.uuid === uuid)
                return player
        }
        return null
    }

    // 发送创建用户请求
    send_create_player(username, photo) {
        let outer = this;
        // 向后端发送字符串
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': "",
        }));
    }

    // 接受后端发送的创建用户请求并显示到前端
    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5, 0.05, "white", 0.15, "enemy"
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }

    // 发送移动信息
    send_move_to(tx, ty) {
        let outer = this
        this.ws.send(JSON.stringify({
            'event': 'move_to',
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty
        }))
    }

    // 接受移动信息
    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid)
        // 用户可能不存在
        if (player) {
            player.move_to(tx, ty)
        }
    }

    // 发送火焰技能信息
    send_shoot_fireball(tx, ty, ball_uuid) {
        let outer = this
        this.ws.send(JSON.stringify({
            'event': 'shoot_fireball',
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid
        }))
    }

    // 接受火焰技能信息
    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid)
        if (player) {
            let fireball = player.shoot_fireball(tx, ty)
            fireball.uuid = ball_uuid
        }
    }

    // 发送攻击信息
    // 攻击者的id、收击前的位置、收击的方向、伤害值、炮弹
    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this
        this.ws.send(JSON.stringify({
            'event': 'attack',
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x, 'y': y, 'angle': angle,
            'damage': damage, 'ball_uuid': ball_uuid
        }))
    }

    // 接受攻击信息
    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(uuid)
        let attackee = this.get_player(attackee_uuid)

        if (attacker && attackee) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker)
        }
    }

    // 发送闪现信息
    send_blink(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            "event": "blink",
            "uuid": outer.uuid,
            "tx": tx,
            "ty": ty
        }))
    }

    // 接受闪现信息
    receive_blink(uuid, tx, ty) {
        let player = this.get_player(uuid)
        if (player) {
            player.blink(tx, ty)
        }
    }

    // 发送聊天信息
    send_message(username, text) {
        let outer = this;
        this.ws.send(JSON.stringify({
            "event": "message",
            "uuid": outer.uuid,
            "username": username,
            "text": text
        }))
    }

    // 接受聊天信息
    receive_message(uuid, username, text) {
        this.playground.chat_field.add_message(username, text)
    }
}

