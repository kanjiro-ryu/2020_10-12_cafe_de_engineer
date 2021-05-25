<template>
  <div>
    <v-app-bar prominent dense color="#663330">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="orange"></v-app-bar-nav-icon>
      <img class="header_logo" src="@/assets/header_logo.png" alt="logo" />
      <v-spacer></v-spacer>
      <v-menu bottom offset-y nudge-left="400" nudge-bottom="10" max-height="500">
        <template v-slot:activator="{ on }">
          <button v-on="on" class="bell">
            <notification-bell
              :size="40"
              icon-color="#FFFF00"
              :animated="true"
              :count="$store.state.notificationCount"
            ></notification-bell>
          </button>
        </template>
        <v-list v-click-outside="closeDialog">
          <v-list-item>通知</v-list-item>
          <hr />
          <v-list-item v-for="(item, index) in $store.state.activities" :key="index" class="news">
            <v-list-item-title v-if="item.type === 'othersComment'" @click="toDetail(item)">
              <v-icon class="reply" style="color: #ccff33">mdi-message-reply-text</v-icon>
              <div class="content">
                <p v-if="!item.commentRead" class="circle"></p>
                <v-list-item-content class="content">
                  {{
                  item.userName
                  }}さんがあなたに返信しました
                </v-list-item-content>
              </div>
            </v-list-item-title>
            <v-list-item-title v-else-if="item.type === 'comment'" @click="toDetail(item)">
              <v-icon class="comment" style="color: #3366ff">mdi-comment-account</v-icon>
              <div class="content">
                <p v-if="!item.read" class="circle"></p>
                <v-list-item-content class="content">
                  {{ item.userName }}さんが「{{
                  item.title
                  }}」にコメントしました
                </v-list-item-content>
              </div>
            </v-list-item-title>
            <v-list-item-title v-else @click="toDetail(item)">
              <v-icon class="heart" style="color: pink">mdi-heart-circle</v-icon>
              <div class="content">
                <p v-if="!item.read" class="circle"></p>
                <v-list-item-content class="content">
                  {{ item.userName }}さんが「{{
                  item.title
                  }}」にいいねしました
                </v-list-item-content>
              </div>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-avatar class="mt-9 mr-2">
        <img :src="photoUrl" />
      </v-avatar>
      <p class="userName">{{ userName }}さん</p>
      <v-btn class="mt-10" @click="userLogout" color="yellow">ログアウト</v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" fixed dark temporary color="#663330">
      <v-list-item>
        <v-list-item-title>
          <img class="drawer_logo" src="@/assets/header_logo.png" alt="logo" />
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="menu in menus" :key="menu.title" :to="menu.url">
          <v-list-item-icon>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ menu.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NotificationBell from "vue-notification-bell";
import firebase from "firebase";
// import moment from 'moment'
export default {
  name: "App",
  components: {
    "notification-bell": NotificationBell,
  },
  data() {
    return {
      drawer: false,
      menus: [
        { title: "ホーム", icon: "mdi-home", url: "/top" },
        { title: "投稿", icon: "mdi-pencil", url: "/register" },
        { title: "ランキング", icon: "mdi-crown", url: "/ranking" },
        { title: "マイページ", icon: "mdi-account-circle", url: "/mypage" },
      ],
      dialog: false,
      myContents: [],
      isActive: false,
      notificationCount: 0,
      img: "/public/header_logo.png",
    };
  },
  methods: {
    ...mapActions(["logout", "setLoginUser", "deleteLoginUser"]),
    userLogout() {
      this.logout();
      this.deleteLoginUser();
      this.$router.push({ name: "Login" });
    },
    showNotification() {
      this.$modal.show("modal-area");
    },
    closeDialog() {
      const favoriteList = this.$store.state.favoriteList;
      const commentList = this.$store.state.commentList;
      const othersCommentList = this.$store.state.othersCommentList;
      const favList = [];
      var favorites = {};
      favorites.favs = [];
      for (var i = 0; i < favoriteList.length; i++) {
        if (i === 0) {
          const favs = {};
          favorites.docId = favoriteList[i].contentId;
          favs.date = new Date(favoriteList[i].date);
          favs.read = true;
          favs.userId = favoriteList[i].userId;
          favs.userName = favoriteList[i].userName;
          favorites.favs.push(favs);
          if (favoriteList.length === 1) {
            favList.push(favorites);
          }
          continue;
        }
        if (i === favoriteList.length - 1) {
          if (favoriteList[i].contentId === favoriteList[i - 1].contentId) {
            const favs = {};
            favs.date = new Date(favoriteList[i].date);
            favs.read = true;
            favs.userId = favoriteList[i].userId;
            favs.userName = favoriteList[i].userName;
            favorites.favs.push(favs);
            favList.push(favorites);
            continue;
          } else if (
            favoriteList[i].contentId != favoriteList[i - 1].contentId
          ) {
            favList.push(favorites);
            favorites = {};
            favorites.favs = [];
            const favs = {};
            favorites.docId = favoriteList[i].contentId;
            favs.date = new Date(favoriteList[i].date);
            favs.read = true;
            favs.userId = favoriteList[i].userId;
            favs.userName = favoriteList[i].userName;
            favorites.favs.push(favs);
            favList.push(favorites);
            continue;
          }
        }
        if (favoriteList[i].contentId == favoriteList[i - 1].contentId) {
          const favs = {};
          favs.date = new Date(favoriteList[i].date);
          favs.read = true;
          favs.userId = favoriteList[i].userId;
          favs.userName = favoriteList[i].userName;
          favorites.favs.push(favs);
          continue;
        } else if (favoriteList[i].contentId != favoriteList[i - 1].contentId) {
          favList.push(favorites);
          favorites = {};
          favorites.favs = [];
          const favs = {};
          favorites.docId = favoriteList[i].contentId;
          favs.date = new Date(favoriteList[i].date);
          favs.read = true;
          favs.userId = favoriteList[i].userId;
          favs.userName = favoriteList[i].userName;
          favorites.favs.push(favs);
          continue;
        }
      }

      for (var f of favList) {
        this.$store.dispatch("changeFavoriteRead", {
          docId: f.docId,
          favorite: f.favs,
        });
      }

      for (var item of this.$store.state.activities) {
        item.read = true;
        item.commentRead = true;
      }
      const comList = [];
      var comments = {};
      comments.coms = [];
      for (var j = 0; j < commentList.length; j++) {
        if (j === 0) {
          const coms = {};
          comments.docId = commentList[j].contentId;
          coms.content = commentList[j].content;
          coms.dateTime = new Date(commentList[j].dateTime);
          coms.fromUserId = commentList[j].fromUserId;
          coms.fromUserName = commentList[j].fromUserName;
          coms.id = commentList[j].id;
          coms.read = true;
          if (
            commentList[j].toUserId === this.$store.getters.uid ||
            commentList[j].contentUserId === this.$store.getters.uid
          ) {
            coms.commentRead = true;
          } else {
            coms.commentRead = commentList[j].commentRead;
          }
          coms.toUserId = commentList[j].toUserId;
          coms.toUserName = commentList[j].toUserName;
          comments.coms.push(coms);
          if (commentList.length === 1) {
            comList.push(comments);
          }
          continue;
        }
        if (j === commentList.length - 1) {
          if (commentList[j].contentId === commentList[j - 1].contentId) {
            const coms = {};
            comments.docId = commentList[j].contentId;
            coms.content = commentList[j].content;
            coms.dateTime = new Date(commentList[j].dateTime);
            coms.fromUserId = commentList[j].fromUserId;
            coms.fromUserName = commentList[j].fromUserName;
            coms.id = commentList[j].id;
            coms.read = true;
            if (
              commentList[j].toUserId === this.$store.getters.uid ||
              commentList[j].contentUserId === this.$store.getters.uid
            ) {
              coms.commentRead = true;
            } else {
              coms.commentRead = commentList[j].commentRead;
            }
            coms.toUserId = commentList[j].toUserId;
            coms.toUserName = commentList[j].toUserName;
            comments.coms.push(coms);
            comList.push(comments);
            continue;
          } else if (commentList[j].contentId != commentList[j - 1].contentId) {
            comList.push(comments);
            comments = {};
            comments.coms = [];
            const coms = {};
            comments.docId = commentList[j].contentId;
            coms.content = commentList[j].content;
            coms.dateTime = new Date(commentList[j].dateTime);
            coms.fromUserId = commentList[j].fromUserId;
            coms.fromUserName = commentList[j].fromUserName;
            coms.id = commentList[j].id;
            coms.read = true;
            if (
              commentList[j].toUserId === this.$store.getters.uid ||
              commentList[j].contentUserId === this.$store.getters.uid
            ) {
              coms.commentRead = true;
            } else {
              coms.commentRead = commentList[j].commentRead;
            }
            coms.toUserId = commentList[j].toUserId;
            coms.toUserName = commentList[j].toUserName;
            comments.coms.push(coms);
            comList.push(comments);
            continue;
          }
        }
        if (commentList[j].contentId === commentList[j - 1].contentId) {
          const coms = {};
          comments.docId = commentList[j].contentId;
          coms.content = commentList[j].content;
          coms.dateTime = new Date(commentList[j].dateTime);
          coms.fromUserId = commentList[j].fromUserId;
          coms.fromUserName = commentList[j].fromUserName;
          coms.id = commentList[j].id;
          coms.read = true;
          if (
            commentList[j].toUserId === this.$store.getters.uid ||
            commentList[j].contentUserId === this.$store.getters.uid
          ) {
            coms.commentRead = true;
          } else {
            coms.commentRead = commentList[j].commentRead;
          }
          coms.toUserId = commentList[j].toUserId;
          coms.toUserName = commentList[j].toUserName;
          comments.coms.push(coms);
          continue;
        } else if (commentList[j].contentId != commentList[j - 1].contentId) {
          comList.push(comments);
          comments = {};
          comments.coms = [];
          const coms = {};
          comments.docId = commentList[j].contentId;
          coms.content = commentList[j].content;
          coms.dateTime = new Date(commentList[j].dateTime);
          coms.fromUserId = commentList[j].fromUserId;
          coms.fromUserName = commentList[j].fromUserName;
          coms.id = commentList[j].id;
          coms.read = true;
          if (
            commentList[j].toUserId === this.$store.getters.uid ||
            commentList[j].contentUserId === this.$store.getters.uid
          ) {
            coms.commentRead = true;
          } else {
            coms.commentRead = commentList[j].commentRead;
          }
          coms.toUserId = commentList[j].toUserId;
          coms.toUserName = commentList[j].toUserName;
          comments.coms.push(coms);
          continue;
        }
      }
      for (var c of comList) {
        this.$store.dispatch("changeCommentRead", {
          docId: c.docId,
          comments: c.coms,
        });
      }

      const othersList = [];
      var othersComments = {};
      othersComments.ocoms = [];
      for (var k = 0; k < othersCommentList.length; k++) {
        if (k === 0) {
          const ocoms = {};
          othersComments.docId = othersCommentList[k].contentId;
          ocoms.content = othersCommentList[k].content;
          ocoms.dateTime = new Date(othersCommentList[k].dateTime);
          ocoms.fromUserId = othersCommentList[k].fromUserId;
          ocoms.fromUserName = othersCommentList[k].fromUserName;
          ocoms.id = othersCommentList[k].id;
          ocoms.read = othersCommentList[k].read;
          if (othersCommentList[k].toUserId === this.$store.getters.uid) {
            ocoms.commentRead = true;
          } else {
            ocoms.commentRead = othersCommentList[k].commentRead;
          }
          ocoms.toUserId = othersCommentList[k].toUserId;
          ocoms.toUserName = othersCommentList[k].toUserName;
          othersComments.ocoms.push(ocoms);
          if (othersCommentList.length === 1) {
            othersList.push(othersComments);
          }
          continue;
        }
        if (k === othersCommentList.length - 1) {
          if (
            othersCommentList[k].contentId ===
            othersCommentList[k - 1].contentId
          ) {
            const ocoms = {};
            othersComments.docId = othersCommentList[k].contentId;
            ocoms.content = othersCommentList[k].content;
            ocoms.dateTime = new Date(othersCommentList[k].dateTime);
            ocoms.fromUserId = othersCommentList[k].fromUserId;
            ocoms.fromUserName = othersCommentList[k].fromUserName;
            ocoms.id = othersCommentList[k].id;
            ocoms.read = othersCommentList[k].read;
            if (othersCommentList[k].toUserId === this.$store.getters.uid) {
              ocoms.commentRead = true;
            } else {
              ocoms.commentRead = othersCommentList[k].commentRead;
            }
            ocoms.toUserId = othersCommentList[k].toUserId;
            ocoms.toUserName = othersCommentList[k].toUserName;
            othersComments.ocoms.push(ocoms);
            othersList.push(othersComments);
            continue;
          } else if (
            othersCommentList[k].contentId != othersCommentList[k - 1].contentId
          ) {
            othersList.push(othersComments);
            othersComments = {};
            othersComments.ocoms = [];
            const ocoms = {};
            othersComments.docId = othersCommentList[k].contentId;
            ocoms.content = othersCommentList[k].content;
            ocoms.dateTime = new Date(othersCommentList[k].dateTime);
            ocoms.fromUserId = othersCommentList[k].fromUserId;
            ocoms.fromUserName = othersCommentList[k].fromUserName;
            ocoms.id = othersCommentList[k].id;
            ocoms.read = othersCommentList[k].read;
            if (othersCommentList[k].toUserId === this.$store.getters.uid) {
              ocoms.commentRead = true;
            } else {
              ocoms.commentRead = othersCommentList[k].commentRead;
            }
            ocoms.toUserId = othersCommentList[k].toUserId;
            ocoms.toUserName = othersCommentList[k].toUserName;
            othersComments.ocoms.push(ocoms);
            othersList.push(othersComments);
            continue;
          }
        }
        if (
          othersCommentList[k].contentId === othersCommentList[k - 1].contentId
        ) {
          const ocoms = {};
          othersComments.docId = othersCommentList[k].contentId;
          ocoms.content = othersCommentList[k].content;
          ocoms.dateTime = new Date(othersCommentList[k].dateTime);
          ocoms.fromUserId = othersCommentList[k].fromUserId;
          ocoms.fromUserName = othersCommentList[k].fromUserName;
          ocoms.id = othersCommentList[k].id;
          ocoms.read = othersCommentList[k].read;
          if (othersCommentList[k].toUserId === this.$store.getters.uid) {
            ocoms.commentRead = true;
          } else {
            ocoms.commentRead = othersCommentList[k].commentRead;
          }
          ocoms.toUserId = othersCommentList[k].toUserId;
          ocoms.toUserName = othersCommentList[k].toUserName;
          othersComments.ocoms.push(ocoms);
          continue;
        } else if (
          othersCommentList[k].contentId != othersCommentList[k - 1].contentId
        ) {
          othersList.push(othersComments);
          othersComments = {};
          othersComments.ocoms = [];
          const ocoms = {};
          othersComments.docId = othersCommentList[k].contentId;
          ocoms.content = othersCommentList[k].content;
          ocoms.dateTime = new Date(othersCommentList[k].dateTime);
          ocoms.fromUserId = othersCommentList[k].fromUserId;
          ocoms.fromUserName = othersCommentList[k].fromUserName;
          ocoms.id = othersCommentList[k].id;
          ocoms.read = othersCommentList[k].read;
          if (othersCommentList[k].toUserId === this.$store.getters.uid) {
            ocoms.commentRead = true;
          } else {
            ocoms.commentRead = othersCommentList[k].commentRead;
          }
          ocoms.toUserId = othersCommentList[k].toUserId;
          ocoms.toUserName = othersCommentList[k].toUserName;
          othersComments.ocoms.push(ocoms);
          continue;
        }
      }
      for (var other of othersList) {
        this.$store.dispatch("changeCommentReadOfComment", {
          docId: other.docId,
          comments: other.ocoms,
        });
      }
      this.$store.state.notificationCount = 0;
    },
    async toDetail(item) {
      this.$store.state.notificationCount = 0;
      this.closeDialog();
      await this.$store.dispatch("getItems");
      this.$store.dispatch("getUploadContentByDocId", item);
      this.$store.subscribe((mutation) => {
        if (mutation.type === "setUploadContentDetail") {
          this.$router.push("/detail", () => {});
        }
      });
    },
  },
  created() {
    this.$store.state.favoriteList = [];
    this.$store.state.commentList = [];
    this.$store.state.othersCommentList = [];
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setLoginUser(user);
        // this.$store.dispatch("getMyUploadContents");
        this.$store.dispatch("getMyActivities", user);
      } else {
        this.deleteLoginUser();
      }
    });
    this.$store.state.notificationCount = 0;
  },
  computed: {
    ...mapGetters(["uid", "userName", "photoUrl"]),
  },
};
</script>

<style scoped>
.modal-area-inner {
  z-index: 100;
}
.custom-dialog {
  align-items: flex-end;
  justify-content: flex-end;
}
.header_logo {
  width: 250px;
  padding-top: 20px;
  padding-left: 20px;
}
.drawer_logo {
  width: 200px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.news:hover {
  background: #ffff99;
  cursor: pointer;
}
.bell {
  padding-top: 40px;
  padding-right: 20px;
  outline: none;
}
.userName {
  padding-top: 40px;
  padding-right: 20px;
  color: #ffffff;
}
.drawer_title {
  color: orange;
  font-size: 20px;
}
.circle {
  width: 0rem;
  height: 0rem;
  border: solid 4px red;
  border-radius: 50%;
  float: right;
}
</style>
