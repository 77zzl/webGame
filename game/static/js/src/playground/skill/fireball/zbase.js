class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super()
        this.playground = playground
        this.player = player
        this.ctx = this.playground.game_map.ctx
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.radius = radius
        this.color = color
        this.speed = speed
        this.move_length = move_length
        this.damage = damage
        this.eps = 0.01
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
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000)
        this.x += this.vx * moved
        this.y += this.vy * moved
        this.move_length -= moved
    }

    // 更新受击，如果不是自己发射的技能且命中目标则受击
    update_attack() {
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i]
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player)
                break
            }
        }
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y)
        if (distance < this.radius + player.radius)
            return true
        return false
    }

    attack(attackee) {
        let angle = Math.atan2(attackee.y - this.y, attackee.x - this.x)
        attackee.is_attacked(angle, this.damage, this.player.hero)

        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_attack(attackee.uuid, attackee.x, attackee.y, angle, this.damage, this.uuid)
        }

        this.destroy()
    }

    render() {
        let scale = this.playground.scale
        this.ctx.beginPath()
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false)
        this.ctx.fillStyle = this.color
        this.ctx.fill()
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
