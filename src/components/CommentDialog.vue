<template>
  <!--コメントフォームを表示するダイアログ-->
  <v-col cols="2">
    <v-dialog max-width="500px" v-model="$store.state.commentDialogStatus">
      <v-card color="grey lighten-5">
        <v-card-title class="brown lighten-3"> コメント </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-row justify="center">
                <v-col cols="12">
                  <v-list color="grey lighten-5">
                    <v-list-item>
                      <v-list-item-content>
                        FromUserName :
                        {{ fromUserName }}</v-list-item-content
                      >
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
              <v-col cols="12">
                <v-select
                  dense
                  v-model="toUserSelect"
                  label="ToUser"
                  :items="getOptions"
                  item-value="text"
                  item-text="text"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  dense
                  v-model="getReply"
                  label="reply"
                  :rules="[rules.commentCheck, rules.required]"
                  counter="100"
                  style="white-space: pre"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue" small text @click.stop="commentCheck"
                >Comment</v-btn
              >
              <v-btn
                color="red"
                small
                text
                @click.stop="switchCommentDialogStatus"
                >Close</v-btn
              >
            </v-card-actions>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500px" v-model="$store.state.commentCheckDialogStatus">
      <v-card color="grey lighten-5">
        <v-card-title class="brown lighten-3">コメント</v-card-title>
        <v-card-text align="center">
          <v-list color="grey lighten-5">
            <v-card-text class="grey--text text--darken-2"
              >以下の内容でコメントしてもよろしいですか？</v-card-text
            >
            <div>- FromUser -</div>
            <div class="grey--text text--darken-2">
              {{ fromUserName }}
            </div>
            <v-divider class="dividerWidth"></v-divider><br />
            <div>- toUser -</div>
            <div class="grey--text text--darken-2">{{ toUserName }}</div>
            <v-divider class="dividerWidth"></v-divider><br />
            <div>- Comment -</div>
            <div class="grey--text text--darken-2" style="white-space: pre">
              {{ getReply }}
            </div>
            <v-divider class="dividerWidth"></v-divider><br />
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" small text @click.stop="sendMessage">YES</v-btn>
            <v-btn
              color="red"
              small
              text
              @click.stop="switchCommentCheckDialogStatus"
              >NO</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="600px" v-model="$store.state.commentAlertDialog">
      <v-card color="grey lighten-5">
        <v-card-text>
          <v-container>
            <v-row>
              <v-row justify="center">
                <v-col cols="12">
                  <v-list color="grey lighten-5">
                    <v-list-item>
                      <v-list-item-content>＜警告！＞</v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        コメントする相手がいません</v-list-item-content
                      >
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" small text @click.stop="closeAlertDialog"
                >閉じる</v-btn
              >
            </v-card-actions>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="600px" v-model="alertMessage">
      <v-card color="grey lighten-5">
        <v-card-text>
          <v-container>
            <v-row>
              <v-row justify="center">
                <v-col cols="12">
                  <v-list color="grey lighten-5">
                    <v-list-item>
                      <v-list-item-content>＜警告！＞</v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        コメントする相手の選択、もしくはコメント内容が記入されていません</v-list-item-content
                      >
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" small text @click.stop="alertMessage = false"
                >閉じる</v-btn
              >
            </v-card-actions>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  name: "CommentDialog",
  data() {
    return {
      alertMessage: false,
      toUserSelect: this.$store.state.uploadContentDetail.userName,
      toUserName: "demoComment",
      reply: "",
      rules: {
        required: (v) => {
          return !!v || "必須項目です";
        },
        titleCheck: (v) => {
          if (v) {
            return v.length <= 20 || "20文字以内で入力してください";
          } else {
            return !!v || "必須項目です";
          }
        },
        commentCheck: (v) => {
          if (v) {
            return v.length <= 100 || "100文字以内で入力してください";
          } else {
            return !!v || "必須項目です";
          }
        },
      },
    };
  },
  methods: {
    switchCommentDialogStatus() {
      this.$store.commit("switchCommentDialogStatus");
    },
    commentCheck() {
      this.$store.commit("switchCommentDialogStatus");
      if (
        typeof this.rules.required === "string" ||
        typeof this.rules.commentCheck === "string" ||
        this.toUserSelect === "" ||
        this.reply === ""
      ) {
        // console.log("バリデーションに引っかかりました");
        this.alertMessage = true;
      } else {
        this.$store.commit("setCommentCheckDialogStatus");
        this.toUserName = this.toUserSelect;
        if (this.reply.includes("\n")) {
          console.log();
        } else {
          for (let i = 0; i < this.reply.length; i++) {
            if (i === 20) {
              this.reply = this.reply.slice(0, i) + "\n" + this.reply.slice(i);
            }
            if (i === 41) {
              this.reply = this.reply.slice(0, i) + "\n" + this.reply.slice(i);
            }
            if (i === 62) {
              this.reply = this.reply.slice(0, i) + "\n" + this.reply.slice(i);
            }
            if (i === 83) {
              this.reply = this.reply.slice(0, i) + "\n" + this.reply.slice(i);
            }
          }
        }
      }
    },
    switchCommentCheckDialogStatus() {
      this.$store.commit("switchCommentCheckDialogStatus");
      this.$store.commit("setCancelSnackbarStatus");
    },
    //コメントする
    sendMessage() {
      this.$emit("sendMessage", this.fromUserName, this.toUserName, this.reply);
    },
    isEmpty(obj) {
      return !Object.keys(obj).length;
    },
    closeAlertDialog() {
      this.$store.commit("switchCommentAlertDialog");
    },
  },
  computed: {
    fromUserName() {
      if (this.$store.state.loginUser !== null) {
        return this.$store.state.loginUser.displayName;
      }
      return "a";
    },
    //投稿に対して、コメントしているユーザーを取得し、リアクティブに反映させる
    getOptions() {
      const array = [];
      if (this.isEmpty(this.$store.state.uploadContentDetail) === false) {
        const storeState = this.$store.state;
        //投稿者のidとログインユーザーのidが一緒ではない場合（投稿者が自分自身に送る場合）
        if (
          this.$store.state.uploadContentDetail.uploadUserId !==
          this.$store.state.loginUser.uid
        ) {
          //投稿者をコメント対象に選べるようにする処理
          array.push({
            text: storeState.uploadContentDetail.uploadUserName,
            value: storeState.uploadContentDetail.uploadUserId,
          });
        }
        //コメント対象をコメントリストから参照する処理
        for (
          let i = 0;
          i < storeState.uploadContentDetail.commentList.length;
          i++
        ) {
          const commentedUserName =
            storeState.uploadContentDetail.commentList[i].fromUserName;
          array.push({
            text: commentedUserName,
            value: storeState.uploadContentDetail.commentList[i].fromUserId,
          });
        }
        //コメント対象リストから自身のidを削除する->自身を選べなくする処理
        let filteredArray = array.filter(
          (v) => v.value !== this.$store.state.loginUser.uid
        );
        return filteredArray;
      }
      return array;
    },
    getReply: {
      get() {
        return this.reply;
      },
      set(v) {
        this.reply = v;
      },
    },
  },
};
</script>

<style scoped></style>
