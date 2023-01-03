class Player extends AcGameObject {
    // 父类，坐标，半径，颜色，速度，角色，昵称，头像
    constructor(playground, x, y, radius, color, speed, character, hero) {
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
        this.hero = hero

        this.shield_radius = radius * 1.8
        this.fireballs = [];
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;
        this.cur_skill = null;

        this.cd = [1, 1.5, 2, 2, 1.5, 3]
        this.BlinkCD = 3

        if (this.character === "me") {
            // 准备火球图标
            this.attack_coldtime = this.cd[this.hero]
            this.attack_img = new Image()
            this.attack_img.src = "https://www.77zzl.top/static/image/menu/fire.png"
            // 准备闪现图标
            this.blink_coldtime = this.BlinkCD
            this.blink_img = new Image()
            this.blink_img.src = "https://www.77zzl.top/static/image/menu/blink.png"
        }
        if (this.character === "robot" && this.hero > 2)
            this.attack_coldtime = this.cd[this.hero]
    }

    start() {
        this.playground.player_count ++;
        this.playground.notice_board.write("匹配中")

        if (this.playground.mode === "multi mode" && this.playground.player_count >= 3) {
            this.playground.state = "fighting"
            this.playground.notice_board.write("Fighting")
        }
        if (this.playground.mode === "single mode" && this.playground.player_count > this.playground.num) {
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
        // 监听鼠标
        this.playground.game_map.$canvas.mousedown(function(e) {
            if (e.which === 1)
                outer.playground.quit_board.hide()
            if (outer.playground.state !== "fighting")
                return true;

            const rect = outer.ctx.canvas.getBoundingClientRect();
            let tx = (e.clientX - rect.left) / outer.playground.scale
            let ty = (e.clientY - rect.top) / outer.playground.scale

            if (e.which === 3) {    // 右键
                if (outer.cur_skill === "blink") {
                    if (outer.blink_coldtime > outer.eps)
                        return false;
                    outer.blink(tx, ty)
                    // 如果是联机模式则同步
                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_blink(tx, ty)
                    }
                } else {
                    outer.move_to(tx, ty);
                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_move_to(tx, ty)
                    }
                }
            } else if (e.which === 1) { // 左键
                outer.playground.quit_board.hide()
                if (outer.attack_coldtime > outer.eps)
                    return false
                if (outer.hero < 3) {
                    let fireball = outer.shoot_fireball(tx, ty)
                } else {
                    outer.activate_shield()
                }

                // 如果是联机模式则同步
                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid)
                }
            }
            outer.cur_skill = null;
        });

        // 监听键盘
        this.playground.game_map.$canvas.keydown(function(e) {
            // 监听聊天框
            if (e.which === 13) {   // enter打开聊天框
                if (outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.show_input()
                    return false;
                }
            } else if (e.which === 27) {    // esc游戏内退出
                outer.playground.quit_board.show()
                return false
            }

            // 战斗开始后监听技能
            if (outer.playground.state !== "fighting")
                return true;

            // 空格闪现
            if (e.which === 32) {
                if (outer.blink_coldtime > outer.eps)
                    return true;

                outer.cur_skill = "blink";
                return false;
            }
        });
    }

    activate_shield() {
        let radius = this.shield_radius
        if (this.hero === 4) {
            radius = this.radius * 1.3
        } else if (this.hero === 5) {
            radius *= 2.5
        }
        new Shield(this.playground, this, radius, this.color, 1, 0.01)
        this.attack_coldtime = this.cd[this.hero]
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = this.color;
        let speed = 0.8;
        let move_length = 3;
        if (this.hero === 1) {
            speed += 0.2
            radius *= 0.6
        } else if (this.hero === 2) {
            speed -= 0.2
            radius *= 1.4
        }
        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01)
        this.fireballs.push(fireball);
        this.attack_coldtime = this.cd[this.hero]

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

    is_attacked(angle, damage, attacker) {
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
        if (attacker === 0) {
            this.damage_x = Math.cos(angle)
            this.damage_y = Math.sin(angle)
            this.damage_speed = damage * 100
        } else if (attacker === 1) {
            this.damage_x = 0
            this.damage_y = 0
            this.damage_speed = damage * 100
        } else if (attacker === 2) {
            this.damage_x = Math.cos(angle)
            this.damage_y = Math.sin(angle)
            this.damage_speed = damage * 200
        } else {
            this.damage_x = Math.cos(angle)
            this.damage_y = Math.sin(angle)
            this.damage_speed = damage * 100
        }
        if (this.hero < 3)
            this.speed *= 0.9
        else
            this.speed *= 1.1
    }

    receive_attack(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid)
        this.x = x
        this.y = y
        this.is_attacked(angle, damage, 0)
    }

    update() {
        this.spent_time += this.timedelta / 1000
        this.update_win()
        if (this.character === "me" && this.playground.state === "fighting") {
            this.update_coldtime()
        } else if (this.character === "robot" && this.hero > 2) {
            this.update_coldtime()
        }
        this.update_move()
        this.render()
    }

    // 如果自己赢了则刷新界面
    update_win() {
        if (this.playground.state === 'fighting' && this.character === 'me' && this.playground.players.length === 1) {
            this.playground.state = 'over'
            this.update_score(2)
            this.playground.score_board.win()
        }
    }

    // 更新得分
    update_score(score) {
        let outer = this
        let username = this.playground.root.menu.username
        $.ajax({
            url: "https://www.77zzl.top/playground/score/",
            type: "post",
            headers: {
                'Authorization': "Bearer " + this.playground.root.access,
            },
            data: {
                username,
                score
            }
        })
    }

    // 更新技能时间
    update_coldtime() {
        // 火球
        this.attack_coldtime -= this.timedelta / 1000;
        this.attack_coldtime = Math.max(0, this.attack_coldtime);
        // 闪现
        this.blink_coldtime -= this.timedelta / 1000;
        this.blink_coldtime = Math.max(0, this.blink_coldtime);
    }

    update_move() {  // 更新玩家移动
        if (this.character === "robot" && this.hero < 3 &&this.spent_time > 3 && Math.random() < 1 / 100.0) {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)]
            if (player === this)
                return
            this.shoot_fireball(player.x, player.y)
        }
        if (this.character === "robot" && this.hero > 2 && this.spent_time > 3 && this.attack_coldtime < this.eps && Math.random() < 3 / 100.0) {
            this.activate_shield()
        }

        // 处于击退状态
        if (this.damage_speed > this.eps) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            let dx = this.x + this.damage_x * this.damage_speed * this.timedelta / 1000;
            let dy = this.y + this.damage_y * this.damage_speed * this.timedelta / 1000;

            if (0 < dx && dx < this.playground.width / this.playground.scale && 0 < dy && dy < this.playground.height / this.playground.scale) {
                this.x = dx
                this.y = dy
            }
            this.damage_speed *= this.friction;
        } else {
            // 处于自由移动状态且即将停止
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.character === "robot") {
                    let tx = Math.random() * this.playground.width / this.playground.scale
                    let ty = Math.random() * this.playground.height / this.playground.scale
                    if (this.hero > 2 && Math.random() < 0.9) {
                        let i = Math.floor(Math.random() * this.playground.players.length)
                        let player = this.playground.players[i]
                        if (player === this) {
                            player = this.playground.players[(i + 1) % this.playground.players.length]
                        }
                        tx = player.x
                        ty = player.y
                    }
                    this.move_to(tx, ty)
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
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

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
        this.ctx.drawImage(this.attack_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();
        if (this.attack_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.attack_coldtime / this.cd[this.hero]) - Math.PI / 2, true);
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
        if (this.character === "me" && this.playground.state === "fighting") {
            this.playground.state = "over"
            this.update_score(-1)
            this.playground.score_board.lose()
        }

        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                break
            }
        }
    }
}
