class Player extends AcGameObject {
    // 传入引擎本身、坐标、半径、颜色、速度、是否是自己
    constructor(id, playground, x, y, radius, color, speed, is_me) {
        super();
        this.id = id;
        this.playground = playground;
        // 画布
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.vy = 1;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.friction = 0.9;
        this.spent_time = 0;
        this.end_time = 1;
        this.cur_skill = null;
    }

    start() {
        // 是自己的话才可以控制
        if (this.is_me) {
            this.add_listening_events();
        }
        else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    // 监听键鼠
    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which === 3) {
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            }
            else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                }

                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e) {
            if (e.which === 81) {
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    // 火球技能参数
    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = this.color;
        let speed = this.playground.height * 0.7;
        let move_length = this.playground.height * 3;
        new FireBall(this.playground, this, x, y, radius, vx, vy , color, speed, move_length, this.playground.height * 0.01);
    }

    // 两点间的直线距离
    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 计算当前位置到目标位置的偏移角度和x轴y轴上的偏移距离
    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    // 被攻击后的反应
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
        if (this.radius < 10) {
            this.destroy();
            if (this.playground.players.length === 1) {
                console.log("Game over");
                this.end_time = 3;
            }

            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 300;
        this.speed *= this.friction;
    }

    // 每帧更新
    update() {
        if (this.playground.players.length === 1) {
            this.end_time -= this.timedelta / 1000;
        }
        if (this.end_time <= 0 && this.is_me) {
            console.log("Victory");
            run_game = false;
        }
        else if (this.end_time <= 0 && !this.is_me) {
            console.log("Defeat");
            run_game = false;
        }

        this.spent_time += this.timedelta / 1000;
        if (this.spent_time > 4 && Math.random() < 1 / 300.0 && !this.is_me) {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            if (player.id !== this.id) {
                let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
                let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
                this.shoot_fireball(tx, ty);
            }
        }

        if (this.damage_speed > 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            let damage_moved = this.damage_speed * this.timedelta / 1000;
            this.x += this.damage_x * damage_moved;
            this.y += this.damage_y * damage_moved;
            this.damage_speed *= this.friction;
        }
        else {
            // 如果移动距离过小则停止
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            }
            // 否则继续朝指定方向前进
            else {
                // 每帧移动的距离
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                // x轴y轴方向上每帧的移动距离
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    render() {
        this.ctx.beginPath();
        // 坐标、半径、起始角度、终止角度、顺时针
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i++ ) {
            if (this.playground.players[i] == this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}

