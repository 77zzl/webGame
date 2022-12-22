export class AcGame {
    constructor(id, access, refresh) {
        this.id = id;
        this.access = access;
        this.refresh = refresh;
        this.$ac_game = $('#' + id);

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {
    }
}

