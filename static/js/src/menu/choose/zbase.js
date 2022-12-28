class Choose {
    constructor(menu) {
        this.menu = menu
        this.$choose = $(`
            <div class="ac-game-menu-choose">
                <div class="ac-game-menu-choose-nums">
                    <div class="ac-game-menu-choose-nums-items">1 v 1</div>
                    <div class="ac-game-menu-choose-nums-items">1 v 3</div>
                    <div class="ac-game-menu-choose-nums-items">1 v 5</div>
                    </div>
                <div class="ac-game-menu-choose-hero">
                    <div class="ac-game-menu-choose-hero-items" style="background-color: #c7828d"></div>
                    <div class="ac-game-menu-choose-hero-items" style="background-color: #c7bfd1"></div>
                    <div class="ac-game-menu-choose-hero-items" style="background-color: #566791"></div>
                </div>
                <div class="ac-game-menu-choose-hero">
                    <div class="ac-game-menu-choose-hero-items" style="background-color: #a0847a"></div>
                    <div class="ac-game-menu-choose-hero-items" style="background-color: #7c9386"></div>
                    <div class="ac-game-menu-choose-hero-items" style="background-color: #f6ca89"></div>
                </div>
            </div>
            `)
        this.menu.$menu.append(this.$choose)
    }
}
