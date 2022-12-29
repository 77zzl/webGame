class Choose {
    constructor(menu) {
        this.menu = menu
        this.selected = 1

        this.$choose = $(`
            <div class="ac-game-menu-choose">
                <div class="ac-game-menu-choose-nums">
                    <div class="ac-game-menu-choose-nums-items ac-game-menu-choose-nums-items-one">1 v 1</div>
                    <div class="ac-game-menu-choose-nums-items ac-game-menu-choose-nums-items-three">1 v 3</div>
                    <div class="ac-game-menu-choose-nums-items ac-game-menu-choose-nums-items-five">1 v 5</div>
                    </div>
                <div class="ac-game-menu-choose-hero">
                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-fire" style="background-color: #c7828d"></div>
                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-snow" style="background-color: #c7bfd1"></div>
                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-ocean" style="background-color: #566791"></div>
                </div>
                <div class="ac-game-menu-choose-hero">
                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-soil" style="background-color: #a0847a"></div>
                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-forest" style="background-color: #7c9386"></div>
                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-light" style="background-color: #f6ca89"></div>
                </div>
            </div>
            `)
        this.menu.$menu.append(this.$choose)
        this.$one = this.$choose.find('.ac-game-menu-choose-nums-items-one')
        this.$three = this.$choose.find('.ac-game-menu-choose-nums-items-three')
        this.$five = this.$choose.find('.ac-game-menu-choose-nums-items-five')
        this.$fire = this.$choose.find('.ac-game-menu-choose-hero-items-fire')
        this.$snow = this.$choose.find('.ac-game-menu-choose-hero-items-snow')
        this.$ocean = this.$choose.find('.ac-game-menu-choose-hero-items-ocean')
        this.$soil = this.$choose.find('.ac-game-menu-choose-hero-items-soil')
        this.$forest = this.$choose.find('.ac-game-menu-choose-hero-items-forest')
        this.$light = this.$choose.find('.ac-game-menu-choose-hero-items-light')

        this.hide()
        this.start()
    }

    start() {
        this.add_listening_events()
    }

    add_listening_events() {
        let outer = this
        this.$one.click(function() {
            if (outer.selected === 3)
                outer.$three.removeClass("selected")
            else if (outer.selected === 5)
                outer.$five.removeClass("selected")
            outer.$one.addClass("selected")
            outer.selected = 1
        })
        this.$three.click(function() {
            if (outer.selected === 1)
                outer.$one.removeClass("selected")
            else if (outer.selected === 5)
                outer.$five.removeClass("selected")
            outer.$three.addClass("selected")
            outer.selected = 3
        })
        this.$five.click(function() {
            if (outer.selected === 3)
                outer.$three.removeClass("selected")
            else if (outer.selected === 1)
                outer.$one.removeClass("selected")
            outer.$five.addClass("selected")
            outer.selected = 5
        })
        this.$fire.click(function() {
            outer.hide()
            outer.menu.hide()
            outer.menu.showChoose = false
            outer.menu.root.playground.show("single mode", 0, outer.selected)
        })
        this.$snow.click(function() {
            outer.hide()
            outer.menu.hide()
            outer.menu.showChoose = false
            outer.menu.root.playground.show("single mode", 1, outer.selected)
        })
        this.$ocean.click(function() {
            outer.hide()
            outer.menu.hide()
            outer.menu.showChoose = false
            outer.menu.root.playground.show("single mode", 2, outer.selected)
        })
        this.$soil.click(function() {
            outer.hide()
            outer.menu.hide()
            outer.menu.showChoose = false
            outer.menu.root.playground.show("single mode", 3, outer.selected)
        })
        this.$forest.click(function() {
            outer.hide()
            outer.menu.hide()
            outer.menu.showChoose = false
            outer.menu.root.playground.show("single mode", 4, outer.selected)
        })
        this.$light.click(function() {
            outer.hide()
            outer.menu.hide()
            outer.menu.showChoose = false
            outer.menu.root.playground.show("single mode", 5, outer.selected)
        })
    }

    show() {
        this.$choose.show()
    }

    hide() {
        this.$choose.hide()
    }
}
