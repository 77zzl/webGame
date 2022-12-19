// 菜单界面
class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            退出
        </div>
    </div>
</div>
`);
        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function(){
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$settings.click(function(){
            outer.root.settings.logout_on_remote()
        });
    }

    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}

let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
        this.uuid = this.create_uuid();
    }

    // 为每个对象都创建唯一id
    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }

        return res;
    }

    start() {  // 只会在第一帧执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    on_destroy() {  // 在被销毁前执行一次
    }

    destroy() {  // 删掉该物体
        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}


requestAnimationFrame(AC_GAME_ANIMATION);
class ChatField {
    constructor(playground) {
        this.playground = playground

        this.$history = $(`<div class="ac-game-chat-field-history"></div>`)
        this.$input = $(`<input type="text" class="ac-game-chat-field-input">`)

        this.$history.hide()
        this.$input.hide()

        this.func_id = null

        this.playground.$playground.append(this.$history)
        this.playground.$playground.append(this.$input)
        this.start()
    }

    start() {
        this.add_listening_events()
    }

    add_listening_events() {
        let outer = this
        this.$input.keydown(function(e) {
            if (e.which === 27) {   // esc关闭聊天框
                outer.hide_input()
                return false
            } else if (e.which === 13) {    // enter发送信息
                let username = outer.playground.root.settings.username
                let text = outer.$input.val()
                if (text) {
                    outer.$input.val("")
                    outer.add_message(username, text)
                    outer.playground.mps.send_message(username, text)
                }
                return false
            }
        })
    }

    // 将文本内容渲染成html
    render_message(message) {
        return $(`<div>${message}</div>`)
    }

    // 将输入的信息添加进历史记录
    add_message(username, text) {
        this.show_history()
        let message = `[${username}] ${text}`
        this.$history.append(this.render_message(message))
        this.$history.scrollTop(this.$history[0].scrollHeight)
    }

    show_history() {
        let outer = this
        this.$history.fadeIn()

        if (this.func_id) clearTimeout(this.func_id)

        this.func_id = setTimeout(function() {
            outer.$history.fadeOut()
            outer.func_id = null
        }, 6000)
    }

    show_input() {
        this.show_history()
        this.$input.show()
        this.$input.focus()
    }

    hide_input() {
        this.$input.hide()
        this.playground.game_map.$canvas.focus()
    }
}
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class NoticeBoard extends AcGameObject {
    constructor(playground) {
        super()
        this.playground = playground
        this.ctx = this.playground.game_map.ctx
        this.text = "已就绪：0人"
    }

    start() {
    }

    write(text) {
        this.text = text
    }

    update() {
        this.render()
    }

    render() {
        this.ctx.font = "20px serif"
        this.ctx.fillStyle = "white"
        this.ctx.textAlign = "center"
        this.ctx.fillText(this.text, this.playground.width / 2, 20)
    }
}
class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        let scale = this.playground.scale;

        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends AcGameObject {
    // 父类，坐标，半径，颜色，速度，角色，昵称，头像
    constructor(playground, x, y, radius, color, speed, character, username, photo) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.character = character;
        this.username = username;
        this.photo = photo;

        this.fireballs = [];
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;
        this.cur_skill = null;

        this.FireballCD = 1;
        this.BlinkCD = 3;

        if (this.character === "me") {
            // 准备火球图标
            this.fireball_coldtime = this.FireballCD;
            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";
            // 准备闪现图标
            this.blink_coldtime = this.BlinkCD;
            this.blink_img = new Image();
            this.blink_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png"

        }
        if (this.character !== "robot") {
            this.img = new Image();
            this.img.src = this.photo;
        }
    }

    start() {
        this.playground.player_count ++;
        this.playground.notice_board.write("已就绪："+this.playground.player_count+ "人");

        if (this.playground.player_count >= 3) {
            this.playground.state = "fighting"
            this.playground.notice_board.write("Fighting")
        }

        if (this.character === "me") { // 只能操作自己
            this.add_listening_events();
        } else if (this.character === "robot") {
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if (outer.playground.state !== "fighting")
                return true;

            const rect = outer.ctx.canvas.getBoundingClientRect();
            let tx = (e.clientX - rect.left) / outer.playground.scale
            let ty = (e.clientY - rect.top) / outer.playground.scale
            if (e.which === 3) {
                outer.move_to(tx, ty);
                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_move_to(tx, ty)
                }
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    if (outer.fireball_coldtime > outer.eps)
                        return false;

                    let fireball = outer.shoot_fireball(tx, ty);
                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid)
                    }
                } else if (outer.cur_skill === "blink") {
                    if (outer.blink_coldtime > outer.eps)
                        return false;

                    outer.blink(tx, ty)
                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_blink(tx, ty)
                    }
                }
                outer.cur_skill = null;
            }
        });

        this.playground.game_map.$canvas.keydown(function(e) {
            // 监听聊天框
            if (e.which === 13) {   // enter打开聊天框
                if (outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.show_input()
                    return false;
                }
            } else if (e.which === 27) {    // esc关闭聊天框
                if (outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.hide_input()
                }
            }

            // 战斗开始后监听技能
            if (outer.playground.state !== "fighting")
                return true;
            if (e.which === 81) {   // q发射火球
                if (outer.fireball_coldtime > outer.eps)
                    return true;

                outer.cur_skill = "fireball";
                return false;
            } else if (e.which === 70) {    //  f闪现
                if (outer.blink_coldtime > outer.eps)
                    return true;

                outer.cur_skill = "blink";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = this.color;
        let speed = 0.8;
        let move_length = 3;
        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
        this.fireballs.push(fireball);
        this.fireball_coldtime = this.FireballCD;

        return fireball;
    }

    // 销毁火球技能
    destroy_fireball(uuid) {
        for (let i = 0; i < this.fireballs.length; i ++) {
            let fireball = this.fireballs[i]
            if (fireball.uuid === uuid) {
                fireball.destroy()
                break
            }
        }
    }

    blink(tx, ty) {
        let d = Math.min(this.get_dist(this.x, this.y, tx, ty), 0.3)
        let angle = Math.atan2(ty - this.y, tx - this.x)
        this.x += d * Math.cos(angle)
        this.y += d * Math.sin(angle)
        this.blink_coldtime = this.BlinkCD;
        this.move_length = 0
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        for (let i = 0; i < 20 + Math.random() * 10; i ++ ) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        this.radius -= damage;
        if (this.radius < this.eps) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.8;
    }

    receive_attack(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid)
        this.x = x
        this.y = y
        this.is_attacked(angle, damage)
    }

    update() {
        this.spent_time += this.timedelta / 1000;
        if (this.character === "me" && this.playground.state === "fighting") {
            this.update_coldtime();
        }
        this.update_move();
        this.render();
    }

    // 更新技能时间
    update_coldtime() {
        // 火球
        this.fireball_coldtime -= this.timedelta / 1000;
        this.fireball_coldtime = Math.max(0, this.fireball_coldtime);
        // 闪现
        this.blink_coldtime -= this.timedelta / 1000;
        this.blink_coldtime = Math.max(0, this.blink_coldtime);
    }

    update_move() {  // 更新玩家移动
        if (this.character === "robot" && this.spent_time > 4 && Math.random() < 1 / 100.0) {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            if (player === this)
                return ;
            this.shoot_fireball(player.x, player.y);
        }

        // 处于击退状态
        if (this.damage_speed > this.eps) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            // 处于自由移动状态且即将停止
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.character === "robot") {
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
    }

    render() {
        let scale = this.playground.scale;
        if (this.character !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }

        if (this.character === "me" && this.playground.state === "fighting")
            this.render_skill_coldtime()
    }

    // 绘画技能冷却图标
    render_skill_coldtime() {
        let scale = this.playground.scale;
        let x = 1.5, y = 0.9, r = 0.04;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();
        if (this.fireball_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.fireball_coldtime / this.FireballCD) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(255, 250, 244, 0.6)";
            this.ctx.fill();
        }

        x = 1.62, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.blink_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if (this.blink_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.blink_coldtime / this.BlinkCD) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(255, 250, 244, 0.6)";
            this.ctx.fill();
        }

    }

    on_destroy() {
        if (this.character === "me") {
            this.playground.state = "over";
            this.playground.notice_board.write("Game Over")
        }

        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                break
            }
        }
    }
}
class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        this.update_move()

        if (this.player.character !== "enemy") {
            this.update_attack()
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved
    }

    // 更新受击，如果不是自己发射的技能且命中目标则受击
    update_attack() {
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);

        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid)
        }

        this.destroy();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let fireballs = this.player.fireballs
        for (let i = 0; i < fireballs.length; i ++) {
            if (fireballs[i] == this) {
                fireballs.splice(i, 1)
                break
            }
        }
    }
}
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
                outer.receive_create_player(uuid, data.username, data.photo);
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
            'photo': photo,
        }));
    }

    // 接受后端发送的创建用户请求并显示到前端
    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5, 0.05, "white", 0.15, "enemy", username, photo,
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

class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide();
        this.root.$ac_game.append(this.$playground);

        this.start();
    }

    start() {
        let outer = this;
        $(window).resize(function() {
            outer.resize();
        });
    }

    // 按照窗口大小调整屏幕尺寸，保持长宽比例统一
    resize() {
        // 获取页面高宽
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        // 重设长宽
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        // 统一单位
        this.scale = this.height;

        // 调整地图
        if (this.game_map) this.game_map.resize();
    }

    show(mode) {  // 打开playground界面
        let outer = this;

        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        // 记录当前模式
        this.mode = mode;
        // 记录当前游戏状态
        // waiting -> fighting -> over
        this.state = "waiting"
        this.notice_board = new NoticeBoard(this)
        this.player_count = 0

        this.resize();
        // 创建用户列表
        this.players = []
        // 先添加自己
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo));

        if (mode === "single mode") { // 针对单人模式生成人机
            let colors = ["#9b95c9", "#78cdd1", "#9d9087", "#ac6767", "#73b9a2", "#656565"];
            for (let i = 1; i < 6; i ++ ) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, colors[i], 0.15, "robot"));
            }

        } else if (mode === "multi mode") { // 针对多人模式开启会话
            this.chat_field = new ChatField(this)
            this.mps = new MultiPlayerSocket(this)
            this.mps.uuid = this.players[0].uuid

            // 连接成功后将调用onopen
            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo)
            }
        }
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
class Settings {
    constructor(root) {
        this.root = root
        this.username = ""
        this.photo = ""

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
</div>
            `)
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');
        this.root.$ac_game.append(this.$settings);

        this.start();

    }

    start() {
        this.getinfo()
        this.add_listening_events()
    }

    getinfo() {
        let outer = this
        $.ajax({
            url:"https://app4230.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            success: function(resp) {
                if (resp.result == "success") {
                    outer.username = resp.username
                    outer.photo = resp.photo
                    outer.hide()
                    outer.root.menu.show()
                } else {
                    outer.login()
                }
            }
        })
    }

    login() {
        this.$register.hide()
        this.$login.show()
    }

    register() {
        this.$login.hide()
        this.$register.show()
    }

    hide() {
        this.$settings.hide()
    }

    show() {
        this.$settings.show()
    }

    add_listening_events() {
        this.add_listening_events_login()
        this.add_listening_events_register()
    }

    add_listening_events_login() {
        let outer = this
        this.$login_register.click(function() {
            outer.register()
        })
        this.$login_submit.click(function() {
            outer.login_on_remote()
        })
    }

    add_listening_events_register() {
        let outer = this
        this.$register_login.click(function() {
            outer.login()
        })
        this.$register_submit.click(function() {
            outer.register_on_remote()
        })
        this.$acwing_login.click(function() {
            outer.acwing_login();
        });
    }

    // 向服务器发起请求acwing授权登陆
    acwing_login() {
        $.ajax({
            url: "https://app4230.acapp.acwing.com.cn/settings/acwing/web/apply_code",
            type: "GET",
            success: function(resp) {
                // 重定向到服务器返回的网址
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url)
                }
            }
        })
    }

    login_on_remote() {
        let outer = this
        let username = this.$login_username.val()
        let password = this.$login_password.val()
        this.$login_error_message.empty()

        $.ajax({
            url: "https://app4230.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password
            },
            success: function(resp) {
                if (resp.result == 'success') {
                    location.reload()
                } else {
                    outer.$login_error_message.html(resp.result)
                }
            }
        })
    }

    register_on_remote() {
        let outer = this
        let username = this.$register_username.val()
        let password = this.$register_password.val()
        let password_confirm = this.$register_password_confirm.val()
        this.$register_error_message.empty()

        $.ajax({
            url: "https://app4230.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm
            },
            success: function(resp) {
                if (resp.result == 'success') {
                    location.reload()
                } else {
                    outer.$register_error_message.html(resp.result)
                }
            }
        })
    }


    logout_on_remote() {
        $.ajax({
            url: "https://app4230.acapp.acwing.com.cn/settings/logout/",
            type: "GET",
            success: function(resp) {
                if (resp.result == 'success') {
                    location.reload()
                }
            }
        })
    }

}
export class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {
    }
}

