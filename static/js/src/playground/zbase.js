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
