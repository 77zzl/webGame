class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground"></div>
`);

        this.hide();

        this.start();
    }

    get_color(i) {
        let colors = ["#9b95c9", "#78cdd1", "#9d9087", "#ac6767", "#73b9a2"];
        return colors[i];
    }


    start() {
    }

    show() {  // 打开playground界面
        this.$playground.show();
        this.root.$ac_game.append(this.$playground);
        // 拿到页面长宽
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        // 创建地图
        this.game_map = new GameMap(this);
        // 创建玩家和自己
        this.players = [];
        // 初始位置在画面正中间、半径为高度的百分之五，速度为高度的百分之十五
        this.players.push(new Player(0, this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        for (let i = 0; i < 5; i ++ ) {
            this.players.push(new Player(i, this, this.width / 2, this.height / 2, this.height * 0.05, this.get_color(i), this.height * 0.15, false));
        }

    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}


