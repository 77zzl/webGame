// 菜单界面
class AcGameMenu {
    constructor(root) {
        this.root = root
        this.username = ""
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            退出
        </div>
    </div>
    <div class="ac-game-menu-score"></div>
    <div class="ac-game-menu-footer">
        <a href="https://beian.miit.gov.cn">icp</a>
    </div>
</div>
`);
        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');
        this.$score = this.$menu.find('.ac-game-menu-score')

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    update_score() {
        this.root.access = window.localStorage.getItem("access")
        $.ajax({
            url:"https://app4230.acapp.acwing.com.cn/settings/getinfo/",
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
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function(){
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$settings.click(function(){
            outer.root.settings.logout_on_remote()
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

