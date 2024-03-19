// 菜单界面
class AcGameMenu {
    constructor(root) {
        this.root = root
        this.username = ""

        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单机模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            联机模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            更多
        </div>
    </div>
    <div class="ac-game-menu-score"></div>
    <div class="ac-game-menu-footer">
        <a href="https://beian.miit.gov.cn">粤ICP备2022156726号-1</a>
    </div>
</div>
`);
        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');
        this.$score = this.$menu.find('.ac-game-menu-score')

        this.choose = new Choose(this)
        this.preferences = new Preferences(this)
        this.preferences.show()
        this.showPreferences = true
        this.showChoose = false

        this.start();
    }

    start() {
        this.add_listening_events()
        document.oncontextmenu = function(){
            return false;
        }
    }

    update_score() {
        this.root.access = window.localStorage.getItem("access")
        $.ajax({
            url:"https://www.77zzl.top/settings/getinfo/",
            type: "get",
            headers: {
                'Authorization': "Bearer " + this.root.access,
            },
            success: resp => {
                if (resp.result == "success") {
                    this.username = resp.username
                    this.$score.empty()
                    this.$score.append('My Score: ' + resp.score)
                }
            }
        })

    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function(){
            outer.showPreferences = false
            outer.preferences.hide()
            if (outer.showChoose)
                outer.choose.hide()
            else
                outer.choose.show()
            outer.showChoose = !outer.showChoose
        });
        this.$multi_mode.click(function(){
            outer.hide();
            outer.root.playground.show("multi mode", 0, 3);
        });
        this.$settings.click(function(){
            outer.showChoose = false
            outer.choose.hide()
            if (outer.showPreferences)
                outer.preferences.hide()
            else
                outer.preferences.show()
            outer.showPreferences = !outer.showPreferences
        });
    }

    show() {  // 显示menu界面
        this.$menu.show();
        this.update_score()
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}

