class Preferences {
    constructor(menu) {
        this.menu = menu

        this.$preferences = $(`
<div class="ac-game-menu-preferences">
    <div class="ac-game-menu-preferences-help">
        <div class="ac-game-menu-preferences-help-head">Tutorials</div>
        <div class="ac-game-menu-preferences-help-skill">
            <div class="ac-game-menu-preferences-help-skill-items">
                <div class="ac-game-menu-preferences-help-skill-img">
                    <img src="https://www.77zzl.top/static/image/menu/left.png"/>
                    鼠标左键
                </div>
                <text>攻击</text>
            </div>
            <div class="ac-game-menu-preferences-help-skill-items">
                <div class="ac-game-menu-preferences-help-skill-img">
                    <img src="https://www.77zzl.top/static/image/menu/right.png"/>
                    鼠标右键
                </div>
                <text>移动</text>
            </div>
            <div class="ac-game-menu-preferences-help-skill-items">
                <div class="ac-game-menu-preferences-help-skill-img">
                    <img src="https://www.77zzl.top/static/image/menu/space.png"/>
                    键盘空格
                </div>
                <div class="ac-game-menu-preferences-help-skill-img" style="margin:0vh;">
                    <img src="https://www.77zzl.top/static/image/menu/plus.png" style="width:2vh;height:2vh;"/>
                    &nbsp;
                </div>
                <div class="ac-game-menu-preferences-help-skill-img">
                    <img src="https://www.77zzl.top/static/image/menu/right.png"/>
                    鼠标右键
                </div>
                <text>闪现</text>
            </div>
        </div>
    </div>
    <div class="ac-game-menu-preferences-button">LOGOUT</div>
</div>
            `)
        this.menu.$menu.append(this.$preferences)
        this.$logout = this.$preferences.find('.ac-game-menu-preferences-button')

        this.hide()
        this.start()
    }

    start() {
        this.add_listening_events()
    }

    add_listening_events() {
        let outer = this
        this.$logout.click(function() {
            outer.menu.root.settings.logout_on_remote()
        })
    }

    show() {
        this.$preferences.show()
    }

    hide() {
        this.$preferences.hide()
    }
}
