class Choose{constructor(t){this.menu=t,this.selected=1,this.$choose=$('\n            <div class="ac-game-menu-choose">\n                <div class="ac-game-menu-choose-nums">\n                    <div class="ac-game-menu-choose-nums-items ac-game-menu-choose-nums-items-one">1 v 1</div>\n                    <div class="ac-game-menu-choose-nums-items ac-game-menu-choose-nums-items-three">1 v 3</div>\n                    <div class="ac-game-menu-choose-nums-items ac-game-menu-choose-nums-items-five">1 v 5</div>\n                    </div>\n                <div class="ac-game-menu-choose-hero">\n                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-fire" style="background-color: #c7828d"></div>\n                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-snow" style="background-color: #c7bfd1"></div>\n                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-ocean" style="background-color: #566791"></div>\n                </div>\n                <div class="ac-game-menu-choose-hero">\n                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-soil" style="background-color: #a0847a"></div>\n                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-forest" style="background-color: #7c9386"></div>\n                    <div class="ac-game-menu-choose-hero-items ac-game-menu-choose-hero-items-light" style="background-color: #f6ca89"></div>\n                </div>\n            </div>\n            '),this.menu.$menu.append(this.$choose),this.$one=this.$choose.find(".ac-game-menu-choose-nums-items-one"),this.$three=this.$choose.find(".ac-game-menu-choose-nums-items-three"),this.$five=this.$choose.find(".ac-game-menu-choose-nums-items-five"),this.$fire=this.$choose.find(".ac-game-menu-choose-hero-items-fire"),this.$snow=this.$choose.find(".ac-game-menu-choose-hero-items-snow"),this.$ocean=this.$choose.find(".ac-game-menu-choose-hero-items-ocean"),this.$soil=this.$choose.find(".ac-game-menu-choose-hero-items-soil"),this.$forest=this.$choose.find(".ac-game-menu-choose-hero-items-forest"),this.$light=this.$choose.find(".ac-game-menu-choose-hero-items-light"),this.hide(),this.start()}start(){this.add_listening_events()}add_listening_events(){let t=this;this.$one.click((function(){3===t.selected?t.$three.removeClass("selected"):5===t.selected&&t.$five.removeClass("selected"),t.$one.addClass("selected"),t.selected=1})),this.$three.click((function(){1===t.selected?t.$one.removeClass("selected"):5===t.selected&&t.$five.removeClass("selected"),t.$three.addClass("selected"),t.selected=3})),this.$five.click((function(){3===t.selected?t.$three.removeClass("selected"):1===t.selected&&t.$one.removeClass("selected"),t.$five.addClass("selected"),t.selected=5})),this.$fire.click((function(){t.hide(),t.menu.hide(),t.menu.showChoose=!1,t.menu.root.playground.show("single mode",0,t.selected)})),this.$snow.click((function(){t.hide(),t.menu.hide(),t.menu.showChoose=!1,t.menu.root.playground.show("single mode",1,t.selected)})),this.$ocean.click((function(){t.hide(),t.menu.hide(),t.menu.showChoose=!1,t.menu.root.playground.show("single mode",2,t.selected)})),this.$soil.click((function(){t.hide(),t.menu.hide(),t.menu.showChoose=!1,t.menu.root.playground.show("single mode",3,t.selected)})),this.$forest.click((function(){t.hide(),t.menu.hide(),t.menu.showChoose=!1,t.menu.root.playground.show("single mode",4,t.selected)})),this.$light.click((function(){t.hide(),t.menu.hide(),t.menu.showChoose=!1,t.menu.root.playground.show("single mode",5,t.selected)}))}show(){this.$choose.show()}hide(){this.$choose.hide()}}class Preferences{constructor(t){this.menu=t,this.$preferences=$('\n<div class="ac-game-menu-preferences">\n    <div class="ac-game-menu-preferences-help">\n        <div class="ac-game-menu-preferences-help-head">Tutorials</div>\n        <div class="ac-game-menu-preferences-help-skill">\n            <div class="ac-game-menu-preferences-help-skill-items">\n                <div class="ac-game-menu-preferences-help-skill-img">\n                    <img src="https://www.77zzl.top/static/image/menu/left.png"/>\n                    鼠标左键\n                </div>\n                <text>攻击</text>\n            </div>\n            <div class="ac-game-menu-preferences-help-skill-items">\n                <div class="ac-game-menu-preferences-help-skill-img">\n                    <img src="https://www.77zzl.top/static/image/menu/right.png"/>\n                    鼠标右键\n                </div>\n                <text>移动</text>\n            </div>\n            <div class="ac-game-menu-preferences-help-skill-items">\n                <div class="ac-game-menu-preferences-help-skill-img">\n                    <img src="https://www.77zzl.top/static/image/menu/space.png"/>\n                    键盘空格\n                </div>\n                <div class="ac-game-menu-preferences-help-skill-img" style="margin:0vh;">\n                    <img src="https://www.77zzl.top/static/image/menu/plus.png" style="width:2vh;height:2vh;"/>\n                    &nbsp;\n                </div>\n                <div class="ac-game-menu-preferences-help-skill-img">\n                    <img src="https://www.77zzl.top/static/image/menu/right.png"/>\n                    鼠标右键\n                </div>\n                <text>闪现</text>\n            </div>\n        </div>\n    </div>\n    <div class="ac-game-menu-preferences-button">LOGOUT</div>\n</div>\n            '),this.menu.$menu.append(this.$preferences),this.$logout=this.$preferences.find(".ac-game-menu-preferences-button"),this.$logout.hide(),this.hide(),this.start()}start(){}add_listening_events(){let t=this;this.$logout.click((function(){t.menu.root.settings.logout_on_remote()}))}show(){let t=this;this.$preferences.show(),setTimeout((function(){t.menu.root.access&&(t.$logout.show(),t.add_listening_events())}),500)}hide(){this.$preferences.hide()}}class AcGameMenu{constructor(t){this.root=t,this.username="",this.$menu=$('\n<div class="ac-game-menu">\n    <div class="ac-game-menu-field">\n        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">\n            单机模式\n        </div>\n        <br>\n        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">\n            联机模式\n        </div>\n        <br>\n        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">\n            更多\n        </div>\n    </div>\n    <div class="ac-game-menu-score"></div>\n    <div class="ac-game-menu-footer">\n        <a href="https://beian.miit.gov.cn">粤ICP备2022156726号-1</a>\n    </div>\n</div>\n'),this.root.$ac_game.append(this.$menu),this.$single_mode=this.$menu.find(".ac-game-menu-field-item-single-mode"),this.$multi_mode=this.$menu.find(".ac-game-menu-field-item-multi-mode"),this.$settings=this.$menu.find(".ac-game-menu-field-item-settings"),this.$score=this.$menu.find(".ac-game-menu-score"),this.$score.hide(),this.choose=new Choose(this),this.preferences=new Preferences(this),this.preferences.show(),this.showPreferences=!0,this.showChoose=!1,this.start()}start(){this.add_listening_events(),document.oncontextmenu=function(){return!1}}update_score(){this.root.access=window.localStorage.getItem("access"),this.root.access&&(this.$score.show(),$.ajax({url:"https://www.77zzl.top/settings/getinfo/",type:"get",headers:{Authorization:"Bearer "+this.root.access},success:t=>{"success"==t.result&&(this.username=t.username,this.$score.empty(),this.$score.append("My Score: "+t.score))}}))}add_listening_events(){let t=this;this.$single_mode.click((function(){t.showPreferences=!1,t.preferences.hide(),t.showChoose?t.choose.hide():t.choose.show(),t.showChoose=!t.showChoose})),this.$multi_mode.click((function(){t.root.access?(t.hide(),t.root.playground.show("multi mode",0,3)):(t.hide(),t.root.settings.show())})),this.$settings.click((function(){t.showChoose=!1,t.choose.hide(),t.showPreferences?t.preferences.hide():t.preferences.show(),t.showPreferences=!t.showPreferences}))}show(){this.$menu.show(),this.update_score()}hide(){this.$menu.hide()}}let last_timestamp,AC_GAME_OBJECTS=[];class AcGameObject{constructor(){AC_GAME_OBJECTS.push(this),this.has_called_start=!1,this.timedelta=0,this.uuid=this.create_uuid()}create_uuid(){let t="";for(let e=0;e<8;e++){t+=parseInt(Math.floor(10*Math.random()))}return t}start(){}update(){}late_update(){}on_destroy(){}destroy(){this.on_destroy();for(let t=0;t<AC_GAME_OBJECTS.length;t++)if(AC_GAME_OBJECTS[t]===this){AC_GAME_OBJECTS.splice(t,1);break}}}let AC_GAME_ANIMATION=function(t){for(let e=0;e<AC_GAME_OBJECTS.length;e++){let s=AC_GAME_OBJECTS[e];s.has_called_start?(s.timedelta=t-last_timestamp,s.update()):(s.start(),s.has_called_start=!0)}for(let t=0;t<AC_GAME_OBJECTS.length;t++){AC_GAME_OBJECTS[t].late_update()}last_timestamp=t,requestAnimationFrame(AC_GAME_ANIMATION)};requestAnimationFrame(AC_GAME_ANIMATION);class ChatField{constructor(t){this.playground=t,this.$history=$('<div class="ac-game-chat-field-history"></div>'),this.$input=$('<input type="text" class="ac-game-chat-field-input">'),this.$history.hide(),this.$input.hide(),this.func_id=null,this.playground.$playground.append(this.$history),this.playground.$playground.append(this.$input),this.start()}start(){this.add_listening_events()}add_listening_events(){let t=this;this.$input.keydown((function(e){if(27===e.which)return t.hide_input(),!1;if(13===e.which){let e=t.playground.root.settings.username,s=t.$input.val();return s&&(t.$input.val(""),t.add_message(e,s),t.playground.mps.send_message(e,s)),!1}}))}render_message(t){return $(`<div>${t}</div>`)}add_message(t,e){this.show_history();let s=`[${t}] ${e}`;this.$history.append(this.render_message(s)),this.$history.scrollTop(this.$history[0].scrollHeight)}show_history(){let t=this;this.$history.fadeIn(),this.func_id&&clearTimeout(this.func_id),this.func_id=setTimeout((function(){t.$history.fadeOut(),t.func_id=null}),6e3)}show_input(){this.show_history(),this.$input.show(),this.$input.focus()}hide_input(){this.$input.hide(),this.playground.game_map.$canvas.focus()}}class GameMap extends AcGameObject{constructor(t){super(),this.playground=t,this.$canvas=$("<canvas tabindex=0></canvas>"),this.ctx=this.$canvas[0].getContext("2d"),this.ctx.canvas.width=this.playground.width,this.ctx.canvas.height=this.playground.height,this.playground.$playground.append(this.$canvas)}start(){}resize(){this.ctx.canvas.width=this.playground.width,this.ctx.canvas.height=this.playground.height,this.ctx.fillStyle="rgba(0, 0, 0, 1)",this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}update(){this.render()}render(){this.ctx.fillStyle="rgba(0, 0, 0)",this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}}class NoticeBoard extends AcGameObject{constructor(t){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.text="匹配中"}start(){}write(t){this.text=t}update(){this.render()}render(){this.ctx.font="20px serif",this.ctx.fillStyle="white",this.ctx.textAlign="center",this.ctx.fillText(this.text,this.playground.width/2,20)}}class Particle extends AcGameObject{constructor(t,e,s,i,a,h,n,o,r){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.x=e,this.y=s,this.radius=i,this.vx=a,this.vy=h,this.color=n,this.speed=o,this.move_length=r,this.friction=.9,this.eps=.01}start(){}update(){if(this.move_length<this.eps||this.speed<this.eps)return this.destroy(),!1;let t=Math.min(this.move_length,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.speed*=this.friction,this.move_length-=t,this.render()}render(){let t=this.playground.scale;this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()}}class Player extends AcGameObject{constructor(t,e,s,i,a,h,n,o){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.x=e,this.y=s,this.vx=0,this.vy=0,this.damage_x=0,this.damage_y=0,this.damage_speed=0,this.move_length=0,this.radius=i,this.color=a,this.speed=h,this.character=n,this.hero=o,this.shield_radius=1.8*i,this.fireballs=[],this.eps=.01,this.friction=.9,this.spent_time=0,this.cur_skill=null,this.cd=[1,1.5,1.5,2,1.5,3],this.BlinkCD=3,this.unmatched=["lpq"],this.is_unmatched=!1;for(let t=0;t<this.unmatched.length;t++)this.playground.root.settings.username===this.unmatched[t]&&"me"===this.character&&(this.is_unmatched=!0);"me"===this.character&&(this.attack_coldtime=this.cd[this.hero],this.attack_img=new Image,this.attack_img.src="https://www.77zzl.top/static/image/menu/fire.png",this.blink_coldtime=this.BlinkCD,this.blink_img=new Image,this.blink_img.src="https://www.77zzl.top/static/image/menu/blink.png"),"robot"===this.character&&this.hero>2&&(this.attack_coldtime=this.cd[this.hero])}start(){if(this.playground.player_count++,this.playground.notice_board.write("匹配中"),"multi mode"===this.playground.mode&&this.playground.player_count>=3&&(this.playground.state="fighting",this.playground.notice_board.write("Fighting")),"single mode"===this.playground.mode&&this.playground.player_count>this.playground.num&&(this.playground.state="fighting",this.playground.notice_board.write("Fighting")),"me"===this.character)this.add_listening_events();else if("robot"===this.character){let t=Math.random()*this.playground.width/this.playground.scale,e=Math.random()*this.playground.height/this.playground.scale;this.move_to(t,e)}}add_listening_events(){let t=this;this.playground.game_map.$canvas.on("contextmenu",(function(){return!1})),this.playground.game_map.$canvas.mousedown((function(e){if(1===e.which&&t.playground.quit_board.hide(),"fighting"!==t.playground.state)return!0;const s=t.ctx.canvas.getBoundingClientRect();let i=(e.clientX-s.left)/t.playground.scale,a=(e.clientY-s.top)/t.playground.scale;if(3===e.which)if("blink"===t.cur_skill){if(t.blink_coldtime>t.eps)return!1;t.blink(i,a),"multi mode"===t.playground.mode&&t.playground.mps.send_blink(i,a)}else t.move_to(i,a),"multi mode"===t.playground.mode&&t.playground.mps.send_move_to(i,a);else if(1===e.which){if(t.playground.quit_board.hide(),t.attack_coldtime>t.eps)return!1;if(t.hero<3){t.shoot_fireball(i,a)}else t.activate_shield();"multi mode"===t.playground.mode&&t.playground.mps.send_shoot_fireball(i,a,fireball.uuid)}t.cur_skill=null})),this.playground.game_map.$canvas.keydown((function(e){if(13===e.which){if("multi mode"===t.playground.mode)return t.playground.chat_field.show_input(),!1}else if(27===e.which)return t.playground.quit_board.show(),!1;return"fighting"!==t.playground.state||(32===e.which?t.blink_coldtime>t.eps||(t.cur_skill="blink",!1):void 0)}))}activate_shield(){let t=this.shield_radius;4===this.hero?t=1.3*this.radius:5===this.hero&&(t*=2.5),new Shield(this.playground,this,t,this.color,1,.01),this.attack_coldtime=this.cd[this.hero]}shoot_fireball(t,e){let s=this.x,i=this.y,a=.01,h=Math.atan2(e-this.y,t-this.x),n=Math.cos(h),o=Math.sin(h),r=this.color,l=.8;1===this.hero?(l+=.2,a*=.6):2===this.hero&&(l-=.2,a*=1.4);let c=new FireBall(this.playground,this,s,i,a,n,o,r,l,3,.01);return this.fireballs.push(c),this.attack_coldtime=this.cd[this.hero],c}destroy_fireball(t){for(let e=0;e<this.fireballs.length;e++){let s=this.fireballs[e];if(s.uuid===t){s.destroy();break}}}blink(t,e){let s=Math.min(this.get_dist(this.x,this.y,t,e),.3),i=Math.atan2(e-this.y,t-this.x);this.x+=s*Math.cos(i),this.y+=s*Math.sin(i),this.blink_coldtime=this.BlinkCD,this.move_length=0}get_dist(t,e,s,i){let a=t-s,h=e-i;return Math.sqrt(a*a+h*h)}move_to(t,e){this.move_length=this.get_dist(this.x,this.y,t,e);let s=Math.atan2(e-this.y,t-this.x);this.vx=Math.cos(s),this.vy=Math.sin(s)}is_attacked(t,e,s){for(let t=0;t<20+10*Math.random();t++){let t=this.x,e=this.y,s=this.radius*Math.random()*.1,i=2*Math.PI*Math.random(),a=Math.cos(i),h=Math.sin(i),n=this.color,o=10*this.speed,r=this.radius*Math.random()*5;new Particle(this.playground,t,e,s,a,h,n,o,r)}if(this.is_unmatched||(this.radius-=e),this.radius<this.eps)return this.destroy(),!1;0===s?(this.damage_x=Math.cos(t),this.damage_y=Math.sin(t),this.damage_speed=100*e):1===s?(this.damage_x=0,this.damage_y=0,this.damage_speed=100*e):2===s?(this.damage_x=Math.cos(t),this.damage_y=Math.sin(t),this.damage_speed=200*e):(this.damage_x=Math.cos(t),this.damage_y=Math.sin(t),this.damage_speed=100*e),this.hero<3?this.speed*=.9:this.speed*=1.1}receive_attack(t,e,s,i,a,h){h.destroy_fireball(a),this.x=t,this.y=e,this.is_attacked(s,i,0)}update(){this.spent_time+=this.timedelta/1e3,this.update_win(),("me"===this.character&&"fighting"===this.playground.state||"robot"===this.character&&this.hero>2)&&this.update_coldtime(),this.update_move(),this.render()}update_win(){"fighting"===this.playground.state&&"me"===this.character&&1===this.playground.players.length&&(this.playground.state="over",this.update_score(2),this.playground.score_board.win())}update_score(t){if(!this.playground.root.access)return;let e=this.playground.root.menu.username;$.ajax({url:"https://www.77zzl.top/playground/score/",type:"post",headers:{Authorization:"Bearer "+this.playground.root.access},data:{username:e,score:t}})}update_coldtime(){this.attack_coldtime-=this.timedelta/1e3,this.attack_coldtime=Math.max(0,this.attack_coldtime),this.blink_coldtime-=this.timedelta/1e3,this.blink_coldtime=Math.max(0,this.blink_coldtime)}update_move(){if("robot"===this.character&&this.hero<3&&this.spent_time>3&&Math.random()<.01){let t=this.playground.players[Math.floor(Math.random()*this.playground.players.length)];if(t===this)return;this.shoot_fireball(t.x,t.y)}if("robot"===this.character&&this.hero>2&&this.spent_time>3&&this.attack_coldtime<this.eps&&Math.random()<.05&&this.activate_shield(),this.damage_speed>this.eps){this.vx=this.vy=0,this.move_length=0;let t=this.x+this.damage_x*this.damage_speed*this.timedelta/1e3,e=this.y+this.damage_y*this.damage_speed*this.timedelta/1e3;0<t&&t<this.playground.width/this.playground.scale&&0<e&&e<this.playground.height/this.playground.scale&&(this.x=t,this.y=e),this.damage_speed*=this.friction}else if(this.move_length<this.eps){if(this.move_length=0,this.vx=this.vy=0,"robot"===this.character){let t=Math.random()*this.playground.width/this.playground.scale,e=Math.random()*this.playground.height/this.playground.scale;if(this.hero>2&&Math.random()<.9){let s=Math.floor(Math.random()*this.playground.players.length),i=this.playground.players[s];i===this&&(i=this.playground.players[(s+1)%this.playground.players.length]),t=i.x,e=i.y}this.move_to(t,e)}}else{let t=Math.min(this.move_length,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.move_length-=t}}render(){let t=this.playground.scale;this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill(),"me"===this.character&&"fighting"===this.playground.state&&this.render_skill_coldtime()}render_skill_coldtime(){let t=this.playground.scale,e=1.5,s=.9,i=.04;this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(e*t,s*t,i*t,0,2*Math.PI,!1),this.ctx.stroke(),this.ctx.clip(),this.ctx.drawImage(this.attack_img,(e-i)*t,(s-i)*t,2*i*t,2*i*t),this.ctx.restore(),this.attack_coldtime>0&&(this.ctx.beginPath(),this.ctx.moveTo(e*t,s*t),this.ctx.arc(e*t,s*t,i*t,0-Math.PI/2,2*Math.PI*(1-this.attack_coldtime/this.cd[this.hero])-Math.PI/2,!0),this.ctx.lineTo(e*t,s*t),this.ctx.fillStyle="rgba(255, 250, 244, 0.6)",this.ctx.fill()),e=1.62,s=.9,i=.04,this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(e*t,s*t,i*t,0,2*Math.PI,!1),this.ctx.stroke(),this.ctx.clip(),this.ctx.drawImage(this.blink_img,(e-i)*t,(s-i)*t,2*i*t,2*i*t),this.ctx.restore(),this.blink_coldtime>0&&(this.ctx.beginPath(),this.ctx.moveTo(e*t,s*t),this.ctx.arc(e*t,s*t,i*t,0-Math.PI/2,2*Math.PI*(1-this.blink_coldtime/this.BlinkCD)-Math.PI/2,!0),this.ctx.lineTo(e*t,s*t),this.ctx.fillStyle="rgba(255, 250, 244, 0.6)",this.ctx.fill())}on_destroy(){"me"===this.character&&"fighting"===this.playground.state&&(this.playground.state="over",this.update_score(-1),this.playground.score_board.lose());for(let t=0;t<this.playground.players.length;t++)if(this.playground.players[t]===this){this.playground.players.splice(t,1);break}}}class QuitBoard{constructor(t){this.playground=t,this.$quit_board=$('\n            <div class="ac-game-quit">\n                <div class="ac-game-quit-item">退出游戏</div>\n            </div>\n            '),this.playground.$playground.append(this.$quit_board),this.$quit=this.$quit_board.find(".ac-game-quit-item"),this.hide(),this.start()}start(){this.add_listening_events()}add_listening_events(){let t=this;this.$quit.click((function(){t.hide(),t.playground.hide(),t.playground.root.menu.show(),t.playground.root.menu.choose.show(),t.playground.root.menu.showChoose=!0,t.playground.root.menu.preferences.hide(),t.playground.root.menu.showPreferences=!1}))}show(){this.$quit_board.show()}hide(){this.$quit_board.hide()}}class ScoreBoard extends AcGameObject{constructor(t){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.state=null,this.win_img=new Image,this.win_img.src="https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png",this.lose_img=new Image,this.lose_img.src="https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png"}start(){}add_listening_events(){let t=this;this.playground.game_map&&this.playground.game_map.$canvas.on("click",(function(){t.playground.hide(),t.playground.root.menu.show(),t.playground.root.menu.choose.show(),t.playground.root.menu.showChoose=!0}))}win(){this.state="win";let t=this;setTimeout((function(){t.add_listening_events()}),1e3)}lose(){this.state="lose";let t=this;setTimeout((function(){t.add_listening_events()}),1e3)}late_update(){this.render()}render(){let t=this.playground.height/2;"win"===this.state?this.ctx.drawImage(this.win_img,this.playground.width/2-t/2,this.playground.height/2-t/2,t,t):"lose"===this.state&&this.ctx.drawImage(this.lose_img,this.playground.width/2-t/2,this.playground.height/2-t/2,t,t)}}class FireBall extends AcGameObject{constructor(t,e,s,i,a,h,n,o,r,l,c){super(),this.playground=t,this.player=e,this.ctx=this.playground.game_map.ctx,this.x=s,this.y=i,this.vx=h,this.vy=n,this.radius=a,this.color=o,this.speed=r,this.move_length=l,this.damage=c,this.eps=.01}update(){if(this.move_length<this.eps)return this.destroy(),!1;this.update_move(),"enemy"!==this.player.character&&this.update_attack(),this.render()}get_dist(t,e,s,i){let a=t-s,h=e-i;return Math.sqrt(a*a+h*h)}update_move(){let t=Math.min(this.move_length,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.move_length-=t}update_attack(){for(let t=0;t<this.playground.players.length;t++){let e=this.playground.players[t];if(this.player!==e&&this.is_collision(e)){this.attack(e);break}}}is_collision(t){return this.get_dist(this.x,this.y,t.x,t.y)<this.radius+t.radius}attack(t){let e=Math.atan2(t.y-this.y,t.x-this.x);t.is_attacked(e,this.damage,this.player.hero),"multi mode"===this.playground.mode&&this.playground.mps.send_attack(t.uuid,t.x,t.y,e,this.damage,this.uuid),this.destroy()}render(){let t=this.playground.scale;this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()}on_destroy(){let t=this.player.fireballs;for(let e=0;e<t.length;e++)if(t[e]==this){t.splice(e,1);break}}}class Shield extends AcGameObject{constructor(t,e,s,i,a,h){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.player=e,this.radius=s,this.color=i,this.period=a,this.damage=h,this.eps=.01}update(){if(this.period<this.eps)return this.destroy(),!1;this.period-=this.timedelta/1e3,"enemy"!==this.player.character&&this.update_attack(),this.render()}update_attack(){for(let t=0;t<this.playground.players.length;t++){let e=this.playground.players[t];if(this.player===e)continue;let s=null;for(let t=0;e.hero<3&&t<e.fireballs.length;t++){let i=e.fireballs[t];if(this.is_collision_fireball(i)){s=i;break}}if(s&&s.destroy(),this.is_collision(e)){this.attack(e);break}}}is_collision_fireball(t){return this.get_dist(this.player.x,this.player.y,t.x,t.y)<this.radius+t.radius}is_collision(t){return this.get_dist(this.player.x,this.player.y,t.x,t.y)<this.radius+t.radius}get_dist(t,e,s,i){let a=t-s,h=e-i;return Math.sqrt(a*a+h*h)}attack(t){let e=Math.atan2(t.y-this.player.y,t.x-this.player.x);t.is_attacked(e,this.damage,this.player.hero),this.destroy()}render(){let t=this.playground.scale;this.ctx.beginPath(),this.ctx.arc(this.player.x*t,this.player.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.strokeStyle=this.color,this.ctx.stroke()}}class MultiPlayerSocket{constructor(t){this.playground=t,this.ws=new WebSocket("wss://www.77zzl.top/wss/multiplayer/?token="+t.root.access),this.start()}start(){this.receive()}receive(){let t=this;this.ws.onmessage=function(e){let s=JSON.parse(e.data),i=s.uuid;if(i===t.uuid)return!1;let a=s.event;"create_player"===a?t.receive_create_player(i,s.username,""):"move_to"===a?t.receive_move_to(i,s.tx,s.ty):"shoot_fireball"==a?t.receive_shoot_fireball(i,s.tx,s.ty,s.ball_uuid):"attack"===a?t.receive_attack(i,s.attackee_uuid,s.x,s.y,s.angle,s.damage,s.ball_uuid):"blink"===a?t.receive_blink(i,s.tx,s.ty):"message"===a&&t.receive_message(i,s.username,s.text)}}get_player(t){let e=this.playground.players;for(let s=0;s<e.length;s++){let i=e[s];if(i.uuid===t)return i}return null}send_create_player(t,e){this.ws.send(JSON.stringify({event:"create_player",uuid:this.uuid,username:t,photo:""}))}receive_create_player(t,e,s){let i=new Player(this.playground,this.playground.width/2/this.playground.scale,.5,.05,"white",.15,"enemy",0);i.uuid=t,this.playground.players.push(i)}send_move_to(t,e){this.ws.send(JSON.stringify({event:"move_to",uuid:this.uuid,tx:t,ty:e}))}receive_move_to(t,e,s){let i=this.get_player(t);i&&i.move_to(e,s)}send_shoot_fireball(t,e,s){this.ws.send(JSON.stringify({event:"shoot_fireball",uuid:this.uuid,tx:t,ty:e,ball_uuid:s}))}receive_shoot_fireball(t,e,s,i){let a=this.get_player(t);if(a){a.shoot_fireball(e,s).uuid=i}}send_attack(t,e,s,i,a,h){this.ws.send(JSON.stringify({event:"attack",uuid:this.uuid,attackee_uuid:t,x:e,y:s,angle:i,damage:a,ball_uuid:h}))}receive_attack(t,e,s,i,a,h,n){let o=this.get_player(t),r=this.get_player(e);o&&r&&r.receive_attack(s,i,a,h,n,o)}send_blink(t,e){this.ws.send(JSON.stringify({event:"blink",uuid:this.uuid,tx:t,ty:e}))}receive_blink(t,e,s){let i=this.get_player(t);i&&i.blink(e,s)}send_message(t,e){this.ws.send(JSON.stringify({event:"message",uuid:this.uuid,username:t,text:e}))}receive_message(t,e,s){this.playground.chat_field.add_message(e,s)}}class AcGamePlayground{constructor(t){this.root=t,this.$playground=$('<div class="ac-game-playground"></div>'),this.hide(),this.root.$ac_game.append(this.$playground),this.heros=["#c7828d","#c7bfd1","#566791","#a0847a","#7c9386","#f6ca89"],this.heroSpeed=[.15,.15,.15,.2,.2,.13],this.start()}start(){let t=this;$(window).resize((function(){t.resize()}))}resize(){this.width=this.$playground.width(),this.height=this.$playground.height();let t=Math.min(this.width/16,this.height/9);this.width=16*t,this.height=9*t,this.scale=this.height,this.game_map&&this.game_map.resize()}show(t,e,s){let i=this;this.$playground.show(),this.width=this.$playground.width(),this.height=this.$playground.height(),this.game_map=new GameMap(this),this.game_map.$canvas.focus(),this.mode=t,this.hero=e,this.num=s,this.state="waiting",this.notice_board=new NoticeBoard(this),this.score_board=new ScoreBoard(this),this.player_count=0,this.resize(),this.players=[],this.players.push(new Player(this,this.width/2/this.scale,.5,.05,this.heros[e],this.heroSpeed[e],"me",e)),this.quit_board=new QuitBoard(this),"single mode"===t?this.create_robot(this.num,this.hero):"multi mode"===t&&(this.chat_field=new ChatField(this),this.mps=new MultiPlayerSocket(this),this.mps.uuid=this.players[0].uuid,this.mps.ws.onopen=function(){i.mps.send_create_player(i.root.settings.username,"")})}create_robot(t,e){let s=Math.floor(6*Math.random()),i=0;for(;i<t;)s>=this.heros.length&&(s%=this.heros.length),s===e&&(s=(s+1)%this.heros.length),this.players.push(new Player(this,this.width/2/this.scale,.5,.05,this.heros[s],this.heroSpeed[s],"robot",s)),i++,s++}hide(){for(;this.players&&this.players.length>0;)this.players[0].destroy();this.score_board&&(this.score_board.destroy(),this.score_board=null),this.game_map&&(this.game_map.destroy(),this.game_map=null),this.notice_board&&(this.notice_board.destroy(),this.notice_board=null),this.$playground.empty(),this.$playground.hide()}}class Settings{constructor(t){"app4230.acapp.acwing.com.cn"===window.location.host&&window.location.replace("https://www.77zzl.top"),this.root=t,this.username="",this.$settings=$('\n<div class="ac-game-settings">\n    <div class="ac-game-settings-login">\n        <div class="ac-game-settings-title">\n            登录\n        </div>\n        <div class="ac-game-settings-username">\n            <div class="ac-game-settings-item">\n                <input type="text" placeholder="用户名">\n            </div>\n        </div>\n        <div class="ac-game-settings-password">\n            <div class="ac-game-settings-item">\n                <input type="password" placeholder="密码">\n            </div>\n        </div>\n        <div class="ac-game-settings-submit">\n            <div class="ac-game-settings-item">\n                <button>登录</button>\n            </div>\n        </div>\n        <div class="ac-game-settings-error-message">\n        </div>\n        <div class="ac-game-settings-option">\n            注册\n        </div>\n        <br>\n        <div class="ac-game-settings-acwing">\n            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">\n            <div>\n                AcWing一键登录\n            </div>\n        </div>\n        <div class="ac-game-settings-single">\n            <img width="30" src="static/image/settings/single.png">\n            <div>单机</div>\n        </div>\n    </div>\n    <div class="ac-game-settings-register">\n        <div class="ac-game-settings-title">\n            注册\n        </div>\n        <div class="ac-game-settings-username">\n            <div class="ac-game-settings-item">\n                <input type="text" placeholder="用户名">\n            </div>\n        </div>\n        <div class="ac-game-settings-password ac-game-settings-password-first">\n            <div class="ac-game-settings-item">\n                <input type="password" placeholder="密码">\n            </div>\n        </div>\n        <div class="ac-game-settings-password ac-game-settings-password-second">\n            <div class="ac-game-settings-item">\n                <input type="password" placeholder="确认密码">\n            </div>\n        </div>\n        <div class="ac-game-settings-submit">\n            <div class="ac-game-settings-item">\n                <button>注册</button>\n            </div>\n        </div>\n        <div class="ac-game-settings-error-message">\n        </div>\n        <div class="ac-game-settings-option">\n            登录\n        </div>\n        <br>\n        <div class="ac-game-settings-acwing">\n            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">\n            <div>\n                AcWing一键登录\n            </div>\n        </div>\n        <div class="ac-game-settings-single">\n            <img width="30" src="static/image/settings/single.png">\n            <div>单机</div>\n        </div>\n    </div>\n    <div class="ac-game-settings-footer">\n        <a href="https://beian.miit.gov.cn">粤ICP备2022156726号-1</a>\n    </div>\n</div>\n            '),this.$settings.hide(),this.$login=this.$settings.find(".ac-game-settings-login"),this.$login_username=this.$login.find(".ac-game-settings-username input"),this.$login_password=this.$login.find(".ac-game-settings-password input"),this.$login_submit=this.$login.find(".ac-game-settings-submit button"),this.$login_error_message=this.$login.find(".ac-game-settings-error-message"),this.$login_register=this.$login.find(".ac-game-settings-option"),this.$login.hide(),this.$register=this.$settings.find(".ac-game-settings-register"),this.$register_username=this.$register.find(".ac-game-settings-username input"),this.$register_password=this.$register.find(".ac-game-settings-password-first input"),this.$register_password_confirm=this.$register.find(".ac-game-settings-password-second input"),this.$register_submit=this.$register.find(".ac-game-settings-submit button"),this.$register_error_message=this.$register.find(".ac-game-settings-error-message"),this.$register_login=this.$register.find(".ac-game-settings-option"),this.$register.hide(),this.$acwing_login=this.$settings.find(".ac-game-settings-acwing img"),this.$single=this.$settings.find(".ac-game-settings-single img"),this.root.$ac_game.append(this.$settings),this.start()}start(){this.root.refresh||(this.root.refresh=window.localStorage.getItem("refresh")),this.refresh_at_start(),this.access_update(),this.add_listening_events()}access_update(){setInterval((()=>{this.refresh_jwt_token()}),27e4)}refresh_jwt_token(){this.root.refresh?$.ajax({url:"https://www.77zzl.top/settings/token/refresh/",type:"post",data:{refresh:this.root.refresh},success:t=>{this.root.access=t.access,window.localStorage.setItem("access",t.access)},error:()=>{this.login()}}):this.login()}refresh_at_start(){this.root.refresh?$.ajax({url:"https://www.77zzl.top/settings/token/refresh/",type:"post",data:{refresh:this.root.refresh},success:t=>{this.root.access=t.access,window.localStorage.setItem("access",t.access),this.getinfo()},error:()=>{this.login()}}):this.login()}getinfo(){$.ajax({url:"https://www.77zzl.top/settings/getinfo/",type:"get",headers:{Authorization:"Bearer "+this.root.access},success:t=>{"success"==t.result?(this.username=t.username,this.score=t.score,this.hide(),this.root.menu.show()):this.login()},error:()=>{this.login()}})}login(){this.$register.hide(),this.$login.show()}register(){this.$login.hide(),this.$register.show()}hide(){this.$settings.hide()}show(){this.$settings.show()}add_listening_events(){let t=this;this.add_listening_events_login(),this.add_listening_events_register(),this.$acwing_login.click((function(){t.acwing_login()})),this.$single.click((function(){t.hide(),t.root.menu.show(),t.root.menu.preferences.show(),t.root.menu.showPreferences=!0,t.root.menu.choose.hide(),t.root.menu.showChoose=!1}))}add_listening_events_login(){let t=this;this.$login_register.click((function(){t.register()})),this.$login_submit.click((function(){t.login_on_remote()}))}add_listening_events_register(){let t=this;this.$register_login.click((function(){t.login()})),this.$register_submit.click((function(){t.register_on_remote()}))}acwing_login(){$.ajax({url:"https://www.77zzl.top/settings/acwing/web/apply_code",type:"GET",success:function(t){"success"===t.result&&window.location.replace(t.apply_code_url)}})}login_on_remote(t,e){let s=window.localStorage;t=t||this.$login_username.val(),e=e||this.$login_password.val(),this.$login_error_message.empty(),$.ajax({url:"https://www.77zzl.top/settings/token/",type:"post",data:{username:t,password:e},success:t=>{this.root.access=t.access,this.root.refresh=t.refresh,s.setItem("access",t.access),s.setItem("refresh",t.refresh),this.refresh_jwt_token(),this.getinfo()},error:()=>{this.$login_error_message.html("用户名或密码错误")}})}register_on_remote(){let t=this.$register_username.val(),e=this.$register_password.val(),s=this.$register_password_confirm.val();this.$register_error_message.empty(),$.ajax({url:"https://www.77zzl.top/settings/register/",type:"post",data:{username:t,password:e,password_confirm:s,access:"lpqsogood"},success:s=>{"success"==s.result?this.login_on_remote(t,e):this.$register_error_message.html(s.result)}})}logout_on_remote(){let t=window.localStorage;t.removeItem("access"),t.removeItem("refresh"),this.root.access="",this.root.refresh="",location.href="/"}}export class AcGame{constructor(t,e,s){this.id=t,this.access=e,this.refresh=s,e&&s&&(window.localStorage.setItem("access",e),window.localStorage.setItem("refresh",s)),this.$ac_game=$("#"+t),this.settings=new Settings(this),this.menu=new AcGameMenu(this),this.playground=new AcGamePlayground(this),this.start()}start(){}}
