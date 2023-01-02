class Shield extends AcGameObject {
    constructor(playground, player, radius, color, period, damage) {
        super()
        this.playground = playground
        this.ctx = this.playground.game_map.ctx
        this.player = player
        this.radius = radius
        this.color = color
        this.period = period
        this.damage = damage
        this.eps = 0.01
    }

    update() {
        if (this.period < this.eps) {
            this.destroy()
            return false
        }
        this.period -= this.timedelta / 1000
        if (this.player.character !== "enemy")
            this.update_attack()
        this.render()
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i ++) {
            let player = this.playground.players[i]
            if (this.player === player)
                continue

            // 无敌
            let todel = null
            for (let i = 0; player.hero < 3 && i < player.fireballs.length; i ++) {
                let fireball = player.fireballs[i]
                if (this.is_collision_fireball(fireball)) {
                    todel = fireball
                    break
                }
            }
            if (todel)
                todel.destroy()

            // 命中敌人
            if (this.is_collision(player)) {
                this.attack(player)
                break
            }
        }
    }

    is_collision_fireball(fireball) {
        let dis = this.get_dist(this.player.x, this.player.y, fireball.x, fireball.y)
        if (dis < this.radius + fireball.radius)
            return true
        return false
    }

    is_collision(attackee) {
        let dis = this.get_dist(this.player.x, this.player.y, attackee.x, attackee.y)
        if (dis < this.radius + attackee.radius)
            return true
        return false
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    attack(attackee) {
        let angle = Math.atan2(attackee.y - this.player.y, attackee.x - this.player.x)
        attackee.is_attacked(angle, this.damage, this.player.hero)

        this.destroy()
    }

    render() {
        let scale = this.playground.scale
        this.ctx.beginPath()
        this.ctx.arc(this.player.x * scale, this.player.y * scale, this.radius * scale, 0, Math.PI * 2, false)
        this.ctx.strokeStyle = this.color
        this.ctx.stroke()
    }
}
