export class AcGame {
    constructor(id, access, refresh) {
        this.id = id;
        this.access = access;
        this.refresh = refresh;
        if (access && refresh) {
            window.localStorage.setItem("access", access)
            window.localStorage.setItem("refresh", refresh)
        }
        this.$ac_game = $('#' + id);

        // 添加设置、菜单、游戏界面，随后分别在三个界面的构建函数中初始化
        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {
    }
}

