class QuitBoard {
    constructor(playground) {
        this.playground = playground
        this.$quit_board = $(`
            <div class="ac-game-quit">
                <div class="ac-game-quit-item">退出游戏</div>
            </div>
            `)
        this.playground.$playground.append(this.$quit_board)
        this.$quit = this.$quit_board.find('.ac-game-quit-item')
        this.hide()
        this.start()
    }

    start() {
        this.add_listening_events()
    }

    add_listening_events() {
        let outer = this
        this.$quit.click(function() {
            outer.hide()
            outer.playground.hide()
            outer.playground.root.menu.show()
        })
    }

    show() {
        this.$quit_board.show()
    }

    hide() {
        this.$quit_board.hide()
    }
}
