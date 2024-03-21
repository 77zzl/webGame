class ScoreBoard extends AcGameObject {
    constructor(playground) {
        super()
        this.playground = playground
        this.ctx = this.playground.game_map.ctx
        this.state = null
        this.win_img = new Image()
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png"
        this.lose_img = new Image()
        this.lose_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png"
    }

    start() {
    }

    add_listening_events() {
        let outer = this
        if (!this.playground.game_map)
            return
        let $canvas = this.playground.game_map.$canvas

        // 点击后返回菜单界面
        $canvas.on('click', function() {
            outer.playground.hide()
            outer.playground.root.menu.show()
            outer.playground.root.menu.choose.show()
            outer.playground.root.menu.showChoose = true
        })
    }

    win() {
        this.state = 'win'
        let outer = this
        setTimeout(function() {
            outer.add_listening_events()
        }, 1000)
    }

    lose() {
        this.state = 'lose'
        let outer = this
        setTimeout(function() {
            outer.add_listening_events()
        }, 1000)
    }

    // 在最后一帧更新
    late_update() {
        this.render()
    }

    // 渲染胜负界面
    render() {
        let len = this.playground.height / 2
        if (this.state === 'win') {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len)
        } else if (this.state === 'lose') {
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len)
        }
    }
}
