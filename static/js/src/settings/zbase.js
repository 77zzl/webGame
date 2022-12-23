class Settings {
    constructor(root) {
        this.root = root
        this.username = ""
        this.photo = ""

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    <div class="ac-game-settings-footer">
        <a href="https://beian.miit.gov.cn">icp</a>
    </div>
</div>
            `)
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');
        this.root.$ac_game.append(this.$settings);

        this.start();

    }

    start() {
        if (this.root.access) {
            this.getinfo()
            this.refresh_jwt_token()
        } else {
            this.login()
        }
        this.add_listening_events()
    }

    refresh_jwt_token() {
        setInterval(() => {
            $.ajax({
                url: "https://app4230.acapp.acwing.com.cn/settings/token/refresh/",
                type: "post",
                data: {
                    refresh: this.root.refresh,
                },
                success: resp => {
                    this.root.access = resp.access
                }
            })
        }, 4.5 * 60 * 1000)

        $.ajax({
            url: "https://app4230.acapp.acwing.com.cn/settings/ranklist/",
            type: "get",
            headers: {
                'Authorization': "Bearer " + this.root.access,
            },
            success: resp => {
                console.log(resp)
            }
        })
    }

    getinfo() {
        $.ajax({
            url:"https://app4230.acapp.acwing.com.cn/settings/getinfo/",
            type: "get",
            headers: {
                'Authorization': "Bearer " + this.root.access,
            },
            success: resp => {
                if (resp.result == "success") {
                    this.username = resp.username
                    this.photo = resp.photo
                    this.hide()
                    this.root.menu.show()
                } else {
                    this.login()
                }
            }
        })
    }

    login() {
        this.$register.hide()
        this.$login.show()
    }

    register() {
        this.$login.hide()
        this.$register.show()
    }

    hide() {
        this.$settings.hide()
    }

    show() {
        this.$settings.show()
    }

    add_listening_events() {
        this.add_listening_events_login()
        this.add_listening_events_register()
    }

    add_listening_events_login() {
        let outer = this
        this.$login_register.click(function() {
            outer.register()
        })
        this.$login_submit.click(function() {
            outer.login_on_remote()
        })
    }

    add_listening_events_register() {
        let outer = this
        this.$register_login.click(function() {
            outer.login()
        })
        this.$register_submit.click(function() {
            outer.register_on_remote()
        })
        this.$acwing_login.click(function() {
            outer.acwing_login();
        });
    }

    // 向服务器发起请求acwing授权登陆
    acwing_login() {
        $.ajax({
            url: "https://app4230.acapp.acwing.com.cn/settings/acwing/web/apply_code",
            type: "GET",
            success: function(resp) {
                // 重定向到服务器返回的网址
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url)
                }
            }
        })
    }

    login_on_remote(username, password) {
        username = username || this.$login_username.val()
        password = password || this.$login_password.val()
        this.$login_error_message.empty()

        $.ajax({
            url: "https://app4230.acapp.acwing.com.cn/settings/token/",
            type: "post",
            data: {
                username: username,
                password: password
            },
            success: resp => {
                this.root.access = resp.access
                this.root.refresh = resp.refresh
                this.refresh_jwt_token()
                this.getinfo()
            },
            error: () => {
                this.$login_error_message.html("用户名或密码错误")
            }
        })
    }

    register_on_remote() {
        let username = this.$register_username.val()
        let password = this.$register_password.val()
        let password_confirm = this.$register_password_confirm.val()
        this.$register_error_message.empty()

        $.ajax({
            url: "https://app4230.acapp.acwing.com.cn/settings/register/",
            type: "post",
            data: {
                username,
                password,
                password_confirm
            },
            success: resp => {
                if (resp.result == 'success') {
                    this.login_on_remote(username, password)
                } else {
                    this.$register_error_message.html(resp.result)
                }
            }
        })
    }


    logout_on_remote() {
        this.root.access = ""
        this.root.refresh = ""
        location.href = "/"
    }

}
