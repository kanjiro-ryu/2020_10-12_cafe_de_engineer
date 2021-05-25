<template>
  <div>
    <Header />
    <v-container>
      <Back-button />
      <v-row>
        <v-col cols="8">
          <v-card color="brown lighten-5" height="710">
            <v-toolbar color="brown lighten-2" dark height="50%">
              <v-toolbar-title>{{ setDetailTitle }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon
                @click.stop="switchFavorite()"
                :class="isFavorite(this.$store.state.uploadContentDetail)"
                >mdi-heart</v-icon
              >
            </v-toolbar>
            <v-card-text>
              <v-chip small dark color="blue-grey darken-1"
                >投稿者 - {{ getUploadDetails.uploadUserName }}</v-chip
              >&nbsp;
              <v-chip small dark color="blue-grey darken-1"
                >場所 - {{ getUploadDetails.place }}</v-chip
              >&nbsp;
              <v-chip small dark color="blue-grey darken-1"
                >時間帯 - {{ getUploadDetails.timeZone }}</v-chip
              >&nbsp;
              <v-chip small dark color="blue-grey darken-1"
                >価格 -
                {{ getUploadDetails.totalPrice.toLocaleString() }}円</v-chip
              >&nbsp;
            </v-card-text>
            <v-col>
              <v-divider></v-divider>
            </v-col>
            <v-row dense>
              <v-col cols="6">
                <v-col>
                  <v-card height="300" color="grey lighten-5">
                    <v-img
                      height="200px"
                      src="https://www.kifunosato.com/wp/wp-content/uploads/2017/06/DSC3888_n1200.jpg"
                    >
                      <v-card-title class="white--text">ドリンク</v-card-title>
                    </v-img>
                    <v-card-text align="center" style="white-space: pre">{{
                      drinkMenu
                    }}</v-card-text>
                  </v-card>
                </v-col>
              </v-col>
              <v-col cols="6">
                <v-col>
                  <v-card height="300" color="grey lighten-5">
                    <v-img
                      height="200"
                      src="https://s3.ap-northeast-1.amazonaws.com/statics.pen-online.jp/image/upload/news/sweets5/sweets5_MSMCJCg.jpg"
                    >
                      <v-card-title class="white--text">フード</v-card-title>
                    </v-img>
                    <v-card-text align="center" style="white-space: pre">{{
                      foodMenu
                    }}</v-card-text>
                  </v-card>
                </v-col>
              </v-col>
              <v-col>
                <v-col>
                  <v-divider></v-divider>
                  <v-card-text
                    class="always-show-scrollbar"
                    style="white-space: pre"
                    >{{ setDetailComment }}</v-card-text
                  >
                  <v-divider></v-divider>
                </v-col>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1" offset-sm="9">
                <v-btn
                  min-width="0"
                  width="60"
                  max-width="100"
                  v-if="uploadUserIsLoginUser"
                  dark
                  color="red lighten-1"
                  small
                  @click.stop="setDeleteDialog"
                  >削除</v-btn
                >
              </v-col>
              <v-col cols="1">
                <v-btn
                  min-width="0"
                  width="60"
                  max-width="100"
                  v-if="uploadUserIsLoginUser"
                  color="blue-grey"
                  dark
                  small
                  @click.stop="setUpdateDialog"
                  >編集</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <!--       コメントリスト-->
        <v-col cols="4">
          <v-card
            class="mx-auto"
            color="brown lighten-5"
            max-height="750"
            height="710"
          >
            <v-toolbar color="brown lighten-2" dark height="50%">
              <v-toolbar-title style="font-size: 100%"
                >コメント一覧</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <!--              <v-col>-->
              <v-btn
                icon
                min-width="0"
                width="60"
                max-width="100"
                dark
                small
                @click.stop="setCommentDialog"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <!--              </v-col>-->
              <v-btn icon>
                <v-icon @click.stop="commentDeleteDialog = true"
                  >mdi-trash-can-outline</v-icon
                >
              </v-btn>
            </v-toolbar>
            <v-row dense justify="center">
              <v-col v-show="commentListStatus">
                <v-data-table
                  class="font-size"
                  :headers="headers"
                  :items="commentTable"
                  height="655"
                  hide-default-footer
                  hide-default-header
                  disable-pagination
                >
                  <template v-slot:[`item.dateTime`]="{ item }">
                    <v-col>
                      <v-chip color="blue-grey darken-1" dark small>{{
                        item.fromUserName
                      }}</v-chip
                      >&nbsp; -->&nbsp;
                      <v-chip color="blue-grey darken-1" dark small>{{
                        item.toUserName
                      }}</v-chip
                      >&nbsp;
                      <span style="font-size: x-small"
                        >&nbsp;{{ item.dateTime }}</span
                      ><br />
                      <v-card-text class="commentList-style">{{
                        item.content
                      }}</v-card-text>
                    </v-col>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <!--   投稿内容削除確認のダイアログ-->
      <v-row>
        <v-col cols="2"> </v-col>
        <!--更新フォームを表示するダイアログ-->
        <v-col cols="1">
          <UpdateDialog
            @update="update"
            :title="this.$store.state.uploadContentDetail.title"
            :comment="this.$store.state.uploadContentDetail.comment"
            @comment="$store.state.uploadContentDetail.comment = $event"
          />
        </v-col>
        <CommentDialog @sendMessage="sendMessage" />
        <SnackBar />
      </v-row>
    </v-container>
    <!--   コメントリストの削除-->
    <v-container v-show="commentListStatus">
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-dialog v-model="commentDeleteDialog" max-width="740px">
            <v-card
              max-height="700"
              color="brown lighten-5"
              height="600"
              v-show="loginUserCommentIsNotEmpty"
            >
              <v-toolbar color="brown lighten-2" dark height="50%">
                <v-toolbar-title> コメントの削除</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon text @click.stop="commentDeleteDialog = false"
                  >mdi-close</v-icon
                >
              </v-toolbar>
              <v-row justify="center" align="center">
                <v-col class="font-size">
                  <v-data-table
                    :headers="commentDeleteHeaders"
                    :items="loginUserCommentTable"
                    hide-default-footer
                    hide-default-header
                    height="555"
                    disable-pagination
                  >
                    <template v-slot:[`item.dateTime`]="{ item }">
                      <v-col>
                        <v-chip color="blue-grey darken-1" dark small>{{
                          item.fromUserName
                        }}</v-chip>
                        -->
                        <v-chip color="blue-grey darken-1" dark small>{{
                          item.toUserName
                        }}</v-chip
                        >&nbsp;
                        <span style="font-size: small"
                          >&nbsp;{{ item.dateTime }}</span
                        ><br />
                        <span class="commentList-style">{{
                          item.content
                        }}</span>
                      </v-col>
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                      <v-icon @click.stop="deleteCommentCheck(item)">
                        mdi-trash-can-outline
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card>
            <v-card
              height="220"
              v-show="loginUserCommentIsEmpty"
              color="brown lighten-5"
            >
              <v-toolbar color="brown lighten-2" dark height="50%">
                <v-toolbar-title> コメントの削除</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon text @click.stop="commentDeleteDialog = false"
                  >mdi-close</v-icon
                >
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-row justify="center">
                      <v-col cols="12">
                        <v-list color="brown lighten-5">
                          <v-list-item>
                            <v-card-text class="font" align="center">
                              {{ userName }}
                              さんのコメントはありません</v-card-text
                            >
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>
        <DeleteDialog
          @deleteUploadData="deleteUploadData"
          @deleteComment="deleteComment"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import BackButton from "../components/BackButton.vue";
import SnackBar from "@/components/SnackBar";
import UpdateDialog from "@/components/UpdateDialog";
import CommentDialog from "@/components/CommentDialog";
import DeleteDialog from "@/components/DeleteDialog";
export default {
  name: "Detail",
  created() {
    if (this.isEmpty(this.$store.state.uploadContentDetail)) {
      this.$router.push("/top");
    }
    console.log();
  },
  components: {
    DeleteDialog,
    CommentDialog,
    UpdateDialog,
    SnackBar,
    Header,
    BackButton,
  },
  data() {
    return {
      itemDetails: {},
      headers: [{ text: "コメント一覧", value: "dateTime" }],
      commentDeleteHeaders: [
        { text: "時間", value: "dateTime" },
        { text: "削除", value: "action" },
      ],
      loginUserCommentId: "",
      deleteUploadId: "",
      commentDeleteDialog: false,
      rules: {
        titleCheck: (v) => {
          if (v) {
            return v.length <= 20 || "20文字以内で入力してください";
          } else {
            return !!v || "必須項目です";
          }
        },
        commentCheck: (v) => {
          return v.length <= 100 || "100文字以内で入力してください";
        },
      },
    };
  },
  beforeDestroy() {
    this.$store.commit("switchDeletedSnackbarStatus");
    this.$store.commit("switchUpdatedSnackbarStatus");
    this.$store.commit("switchCommentedSnackbarStatus");
    this.$store.commit("switchCommentDeletedSnackbarStatus");
    this.$store.commit("switchCancelSnackbarStatus");
  },
  watch: {
    //投稿削除時にスナックバーで完了メッセージを表示させ、それが消えた瞬間に遷移する
    deletedSnackbar: function () {
      if (this.$store.state.deletedSnackbarStatus == false) {
        this.$store.dispatch("deleteMyUploadContent", {
          docId: this.deleteUploadId,
        });
        this.$store.commit("setDeletedSnackbarStatus");
        //topからdetail画面に遷移して削除した時
        if (this.$store.state.uploadContentDetail.fromTopPageAccess) {
          this.$router.push("/top");
        }
        //rankingからdetail画面に遷移して削除した時
        else if (this.$store.state.uploadContentDetail.fromRankingPageAccess) {
          this.$router.push("/ranking");
        }
        //myPageからdetail画面に遷移して削除した時
        else if (this.$store.state.uploadContentDetail.fromMyPageAccess) {
          this.$router.push("/mypage");
        }
        //通知一覧から削除した時の場合、一律Top画面（初期画面）に戻す
        else {
          this.$router.push("/top");
        }
      }
    },
  },
  methods: {
    //削除ボタンを押下
    setDeleteDialog() {
      this.$store.commit("setDeleteCheckDialogStatus");
    },
    //編集ボタンを押下
    setUpdateDialog() {
      this.$store.commit("setUpdateDialogStatus");
    },
    //コメントボタンを押下
    setCommentDialog() {
      if (
        this.$store.state.loginUser.displayName ===
          this.$store.state.uploadContentDetail.uploadUserName &&
        this.commentTable.length === 0
      ) {
        // console.log("コメントを送る相手がいません。");
        this.$store.commit("setCommentAlertDialog");
      } else {
        this.$store.commit("setCommentDialogStatus");
      }
    },
    //削除完了ダイアログを表示させる
    deleteUploadData(...args) {
      this.deleteUploadId = args[0];
      this.$store.commit("switchDeleteCheckDialogStatus");
      this.$store.commit("setDeletedSnackbarStatus");
    },
    //更新する
    update(...args) {
      this.$store.dispatch("updateMyUploadContent", {
        docId: this.getUploadDetails.id,
        title: args[0],
        comment: args[1],
      });
      this.$store.commit("switchUpdateCheckDialogStatus");
      this.$store.commit("setUpdatedSnackbarStatus");
    },
    //コメントする
    sendMessage(...args) {
      let commentId;
      let commentName;
      //コメントリストが空の時...投稿した人のIDと名前をセット（コメントがなかったら投稿主しか選べないから）
      if (this.$store.state.uploadContentDetail.commentList.length === 0) {
        commentId = this.$store.state.uploadContentDetail.uploadUserId;
        commentName = this.$store.state.uploadContentDetail.uploadUserName;
      }
      //コメントリストが空ではない時...コメントする相手のIDをコメントリストから探してくる
      else {
        commentName = args[1]; //確認時に取得した名前をセット
        //コメント相手が投稿者だった場合
        if (
          commentName === this.$store.state.uploadContentDetail.uploadUserName
        ) {
          commentId = this.$store.state.uploadContentDetail.uploadUserId;
        } //コメント相手が第三者だった場合
        else {
          //既にコメントを送った人達の名前からコメント相手を探す
          const index = this.$store.state.uploadContentDetail.commentList.findIndex(
            (v) => v.fromUserName === commentName
          );
          // console.log(index);
          commentId = this.$store.state.uploadContentDetail.commentList[index]
            .fromUserId;
          // console.log(commentId);
        }
      }
      let date = new Date();
      const commentData = {
        content: args[2],
        dateTime: date,
        fromUserId: this.$store.state.loginUser.uid,
        fromUserName: args[0],
        read: false,
        commentRead: false,
        toUserId: commentId,
        toUserName: commentName,
      };
      this.$store.dispatch("addTalk", {
        docId: this.$store.state.uploadContentDetail.id,
        commentData: commentData,
      });
      this.$store.commit("switchCommentCheckDialogStatus");
      this.$store.commit("setCommentedSnackbarStatus");
    },
    //コメント削除確認ダイアログを表示させる
    deleteCommentCheck(value) {
      this.loginUserCommentId = value.id;
      this.commentDeleteDialog = false;
      this.$store.commit("setDeleteCommentCheckDialogStatus");
      // this.deleteCommentCheckDialog = true;
    },
    //コメントを削除する
    deleteComment() {
      const docId = this.$store.state.uploadContentDetail.id;
      this.$store.dispatch("deleteTalk", {
        id: docId,
        deleteTargetId: this.loginUserCommentId,
      });
      this.$store.commit("setCommentDeletedSnackbarStatus");
    },
    //いいね機能
    async switchFavorite() {
      const map = {
        userId: this.uid,
        date: new Date(),
        userName: this.userName,
        read: false,
      };
      const id = this.$store.state.uploadContentDetail.id;
      let count = 0;
      for (var fav of this.$store.state.uploadContentDetail.favorites) {
        if (fav.userId === this.uid) {
          count += 1;
          break;
        }
      }
      if (count === 0) {
        this.$store.state.uploadContentDetail.favorites.push(map);
        this.$store.dispatch("addFavorite", { contentId: id, favorite: map });
      } else {
        const index = this.$store.state.uploadContentDetail.favorites.findIndex(
          ({ userId }) => userId === this.uid
        );
        await this.$store.dispatch("deleteFavorite", {
          contentId: id,
          userId: this.uid,
        });
        this.$store.state.uploadContentDetail.favorites.splice(index, 1);
      }
    },
    //いいねされてるかどうかの評価
    isFavorite(item) {
      if (this.isEmpty(item) === false) {
        for (var fav of item.favorites) {
          if (fav.userId === this.uid) {
            return "favorite";
          }
        }
      }
      return "";
    },
    isEmpty(obj) {
      return !Object.keys(obj).length;
    },
  },
  computed: {
    deletedSnackbar() {
      return this.$store.state.deletedSnackbarStatus;
    },
    //取得したドリンクの情報からリスト風に並べた文字列を生成する
    drinkMenu() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) === false) {
        const drinkList = this.$store.state.uploadContentDetail.drinkList;
        let drinkMenu = "";
        for (let i = 0; i < drinkList.length - 1; i++) {
          const drinkName = drinkList[i].name;
          drinkMenu = drinkMenu + drinkName + "\n";
        }
        drinkMenu = drinkMenu + drinkList[drinkList.length - 1].name;
        return drinkMenu;
      }
      return "";
    },
    //取得したフードの情報からリスト風に並べた文字列を生成する
    foodMenu() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) === false) {
        const otherList = this.$store.state.uploadContentDetail.otherList;
        let otherMenu = "";
        for (let i = 0; i < otherList.length - 1; i++) {
          const otherName = otherList[i].name;
          otherMenu = otherMenu + otherName + "\n";
        }
        otherMenu = otherMenu + otherList[otherList.length - 1].name;
        return otherMenu;
      }
      return "";
    },
    //受け取った投稿内容の投稿主がログインユーザーかチェック...ture:false = 編集/削除ボタンを表示：編集/削除ボタンを非表示
    uploadUserIsLoginUser() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) === false) {
        if (
          this.$store.state.uploadContentDetail.uploadUserId ===
          this.$store.state.loginUser.uid
        ) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    //投稿に対して、コメント内容を取得し、リアクティブに反映させる
    commentTable() {
      let commentList = new Array();
      if (this.isEmpty(this.$store.state.uploadContentDetail) === false) {
        commentList = this.$store.state.uploadContentDetail.commentList;
        for (let i = 0; i < commentList.length; i++) {
          if (typeof commentList[i].dateTime == "string") {
            console.log();
          } else {
            let date = new Date(commentList[i].dateTime);
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();
            month < 10 ? (month = "0" + month) : "";
            day < 10 ? (day = "0" + day) : "";
            hour < 10 ? (hour = "0" + hour) : "";
            minute < 10 ? (minute = "0" + minute) : "";
            commentList[i].dateTime =
              year + "/" + month + "/" + day + " (" + hour + ":" + minute + ")";
          }
        }
        return commentList;
      }
      return commentList;
    },
    uid() {
      if (this.$store.state.loginUser !== null) {
        return this.$store.getters.uid;
      } else {
        return "";
      }
    },
    userName() {
      if (this.$store.state.loginUser !== null) {
        return this.$store.getters.userName;
      } else {
        return "a";
      }
    },
    getUploadDetails() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) === false) {
        return this.$store.state.uploadContentDetail;
      } else {
        return "";
      }
    },
    //投稿に対してコメントがあるかどうかの評価
    commentListStatus() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) === false) {
        return !this.isEmpty(this.$store.state.uploadContentDetail.commentList);
      }
      return false;
    },
    //ログインユーザーのコメントのみを取得...削除時に使用
    loginUserCommentTable() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) === false) {
        const commentList = this.$store.state.uploadContentDetail.commentList;
        const index = commentList.filter(
          (v) => v.fromUserId === this.$store.state.loginUser.uid
        );
        return index;
      }
      return "";
    },
    //投稿に対してユーザーがコメントしているかどうかの評価
    loginUserCommentIsNotEmpty() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) === false) {
        const commentList = this.$store.state.uploadContentDetail.commentList;
        const index = commentList.filter(
          (v) => v.fromUserId === this.$store.state.loginUser.uid
        );
        const status = this.isEmpty(index);
        //空だったら
        if (status == true) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    loginUserCommentIsEmpty() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) == false) {
        const commentList = this.$store.state.uploadContentDetail.commentList;
        const index = commentList.filter(
          (v) => v.fromUserId === this.$store.state.loginUser.uid
        );
        const status = this.isEmpty(index);
        //空だったら
        if (status == true) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    setDetailTitle() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) == false) {
        return this.$store.state.uploadContentDetail.title;
      }
      return "a";
    },
    setDetailComment() {
      if (this.isEmpty(this.$store.state.uploadContentDetail) == false) {
        return this.$store.state.uploadContentDetail.comment;
      }
      return "a";
    },
  },
};
</script>

<style scoped>
.favorite {
  color: pink;
}
.dividerWidth {
  width: 300px;
}
.font-size {
  color: dimgray;
  overflow-y: auto;
}
.commentList-style {
  white-space: pre-wrap;
  /*font-size: 1vw;*/
  /*font-size: 1vh;*/
  color: dimgray;
}
.mgr-10 {
  margin-right: 10px;
}
.mgr-100 {
  margin-right: 200px;
}
.always-show-scrollbar {
  height: 150px;
  overflow-y: auto;
  color: dimgray;
}
</style>
