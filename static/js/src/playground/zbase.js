class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide();
        this.root.$ac_game.append(this.$playground);

        this.heros = ['#c7828d', '#c7bfd1', '#566791', '#a0847a', '#7c9386', '#f6ca89']

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

    show(mode, hero, num) {  // 打开playground界面
        let outer = this;

        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.game_map.$canvas.focus()

        // 记录当前模式
        this.mode = mode
        // 记录所选英雄
        this.hero = hero
        // 记录对战人数
        this.num = num

        // 记录当前游戏状态
        // waiting -> fighting -> over
        this.state = "waiting"
        this.notice_board = new NoticeBoard(this)
        this.score_board = new ScoreBoard(this)
        this.player_count = 0

        this.resize();
        // 创建用户列表
        this.players = []
        // 先添加自己
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.heros[hero], 0.15, "me"));
        this.quit_board = new QuitBoard(this)

        if (mode === "single mode") { // 针对单人模式生成人机
            this.create_robot(this.num, this.hero)
        } else if (mode === "multi mode") { // 针对多人模式开启会话
            this.chat_field = new ChatField(this)
            this.mps = new MultiPlayerSocket(this)
            this.mps.uuid = this.players[0].uuid

            // 连接成功后将调用onopen
            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.settings.username, "")
            }
        }
    }

    create_robot(num, myHero) {
        let i = Math.floor(Math.random() * 6)
        let n = 0
        while (n < num) {
            console.log('i start:', i)
            if (i === myHero)
                i = (i + 1) % this.heros.length
            if (i >= this.heros.length)
                i = 0
            console.log('i end:', i)
            this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.heros[i], 0.15, "robot"))
            n ++
            i ++
        }
    }

    hide() {  // 关闭playground界面
        //  清除所有玩家
        while (this.players && this.players.length > 0) {
            this.players[0].destroy()
        }

        // 删除地图
        if (this.game_map) {
            this.game_map.destroy()
            this.game_map = null
        }

        // 删除游戏状态板
        if (this.notice_board) {
            this.notice_board.destroy()
            this.notice_board = null
        }

        // 删除胜负提示框
        if (this.score_board) {
            this.score_board.destroy()
            this.score_borad = null
        }

        // 清空所有html标签
        this.$playground.empty()

        this.$playground.hide()
    }
}
