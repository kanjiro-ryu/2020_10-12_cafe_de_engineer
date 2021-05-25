<template>
  <v-app>
    <div class="top">
      <header class="header">
        <img class="logo" src="@/assets/header_logo.png" alt="logo" />
        <ul class="nav_list">
          <li class="nav_list_item">
            <a href="#" class="btn-social-long-twitter">
              <i class="fab fa-twitter"></i>
              <span class="followme">Follow Me</span>
            </a>
          </li>
          <li class="nav_list_item">
            <a href="#" class="btn-social-long-facebook">
              <i class="fab fa-facebook-f"></i>
              <span class="followme">Follow Me</span>
            </a>
          </li>
          <li class="nav_list_item">
            <a href="#" class="btn-social-long-insta">
              <i class="fab fa-instagram"></i>
              <span class="followme">Follow Me</span>
            </a>
          </li>
        </ul>
      </header>
      <div class="title">
        <img class="login_logo" src="@/assets/login_logo.png" />
      </div>
      <div class="login_btn">
        <v-btn
          class="fill-width text-capitalize caption btn"
          height="48px"
          width="250px"
          style="border-color:#979797;"
          shaped
          @click="googleLogin"
        >
          <img
            class="button-logo-img mr-4"
            src="https://madeby.google.com/static/images/google_g_logo.svg"
            style="height:24px;"
          />
          Googleアカウントでログイン
        </v-btn>
      </div>
      <!-- <v-card elevation="5" max-width="374" class="mx-auto card" height="500px" color="lime">
            
                <v-card-title class="text-center pa-8">
                    <h3 class="fill-width">Cafe de Engineer</h3>
                    <h4 class="fill-width">ログイン</h4>
                </v-card-title>
                <v-divider></v-divider>
                <div class="px-6 py-8">
                    <div style="max-width:400px" class="mx-auto">
                        <div>
                            <v-card-text class="fill-width">
                                <div>お持ちのGoogleアカウントでログインできます</div>
                            </v-card-text>
                            <v-btn class="fill-width text-capitalize caption" height="48px" outlined style="border-color:#979797;" tile @click="googleLogin">
                                <img class="button-logo-img mr-4" src="https://madeby.google.com/static/images/google_g_logo.svg" style="height:24px;">
                                Googleアカウントでログイン
                            </v-btn>
                        </div>
                        <div class="separator separator_login_page">
                        </div>
                    </div>
                </div>
            
        </v-card> -->
    </div>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["login"]),
    googleLogin() {
      this.login();
      this.$store.state.login = true;
      this.$router.push({ name: "Top" });
    },
  },
};
</script>

<style>
.top {
  background-image: url("~@/assets/login_photo.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;
}
.fill-width {
  width: 100%;
}
.card {
  margin-top: 100px;
}
.logo {
  float: left;
  padding-top: 10px;
  padding-left: 15px;
  width: 250px;
}
.title {
  text-align: center;
  padding-left: 80px;
  padding-top: 150px;
}
.login_logo {
  height: 100px;
}
.login_btn {
  text-align: center;
  padding-top: 20px;
  padding-left: 40px;
}
.btn {
  position: relative;
  z-index: 2;
  background-color: #fff;
  color: #333;
  overflow: hidden;
  text-decoration: none;
  border-radius: 30px;
}
.btn:hover {
  color: #fff;
}
.btn::before {
  outline: none;
}
.btn::after {
  top: 0;
  left: 0;
  width: 400%;
  height: 400%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}
.btn:hover::after {
  background: #333;
  -webkit-transform: scale(1);
  transform: scale(1);
}
.btn::before,
.btn::after {
  position: absolute;
  z-index: -1;
  display: block;
  content: "";
}
.btn,
.btn::before,
.btn::after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
.header {
  text-align: right;
}
.nav_list {
  list-style: none;
  padding-right: 30px;
  padding-top: 20px;
}
.nav_list_item {
  display: inline-block;
  margin: 15px 25px;
}
.followme {
  color: #fff;
}
.btn-social-long-twitter {
  color: #fff; /*文字・アイコン色*/
  border-radius: 7px; /*角丸に*/
  display: inline-block;
  height: 50px; /*高さ*/
  width: 130px; /*幅*/
  text-align: center; /*中身を中央寄せ*/
  font-size: 20px; /*文字のサイズ*/
  line-height: 50px; /*高さと合わせる*/
  background: #1da1f3;
  overflow: hidden; /*はみ出た部分を隠す*/
  text-decoration: none; /*下線は消す*/
}
.fa-twitter {
  color: #fff;
  padding-right: 3px;
}
.btn-social-long-twitter .fa-twitter {
  text-shadow: 2px 2px 0px #4287d6;
  font-size: 20px;
}

.btn-social-long-twitter span {
  display: inline-block;
  transition: 0.5s;
}
.btn-social-long-twitter:hover span {
  -webkit-transform: rotateX(360deg);
  transform: rotateX(360deg);
}
.btn-social-long-facebook {
  color: #fff; /*文字・アイコン色*/
  border-radius: 7px; /*角丸に*/
  display: inline-block;
  height: 50px; /*高さ*/
  width: 130px; /*幅*/
  text-align: center; /*中身を中央寄せ*/
  font-size: 20px; /*文字のサイズ*/
  line-height: 50px; /*高さと合わせる*/
  background: #4966a0;
  overflow: hidden; /*はみ出た部分を隠す*/
  text-decoration: none; /*下線は消す*/
}

.btn-social-long-facebook .fa-facebook {
  text-shadow: 2px 2px 1px #224282;
  font-size: 30px;
}

.btn-social-long-facebook span {
  /*テキスト*/
  display: inline-block;
  transition: 0.5s;
}

.btn-social-long-facebook:hover span {
  /*ホバーで一周回転*/
  -webkit-transform: rotateX(360deg);
  transform: rotateX(360deg);
}
.fa-facebook-f {
  color: #fff;
  padding-right: 3px;
}
.btn-social-long-insta {
  /*ボタンの下地*/
  color: #fff; /*文字・アイコン色*/
  border-radius: 7px; /*角丸に*/
  position: relative;
  display: inline-block;
  height: 50px; /*高さ*/
  width: 135px; /*幅*/
  text-align: center; /*中身を中央寄せ*/
  font-size: 20px; /*文字のサイズ*/
  line-height: 50px; /*高さと合わせる*/
  background: linear-gradient(135deg, #427eff 0%, #f13f79 70%) no-repeat; /*グラデーション①*/
  overflow: hidden; /*はみ出た部分を隠す*/
  text-decoration: none; /*下線は消す*/
}

.btn-social-long-insta:before {
  /*グラデーション②*/
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /*全体を覆う*/
  height: 100%; /*全体を覆う*/
  background: linear-gradient(
      15deg,
      #ffdb2c,
      rgb(249, 118, 76) 25%,
      rgba(255, 77, 64, 0) 50%
    )
    no-repeat;
}

.btn-social-long-insta .fa-instagram {
  /*アイコン*/
  font-size: 35px; /*アイコンサイズ*/
  position: relative;
  top: 4px; /*アイコン位置の微調整*/
}

.btn-social-long-insta span {
  /*テキスト*/
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.btn-social-long-insta:hover span {
  /*ホバーで一周回転*/
  -webkit-transform: rotateX(360deg);
  transform: rotateX(360deg);
}
.fa-instagram {
  color: #fff;
  padding-right: 3px;
}
</style>
