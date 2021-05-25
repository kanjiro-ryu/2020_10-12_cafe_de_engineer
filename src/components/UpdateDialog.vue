<template>
  <v-col>
    <!--更新フォームを表示するダイアログ-->
    <v-dialog max-width="600px" v-model="$store.state.updateDialogStatus">
      <v-card color="grey lighten-5">
        <v-card-title class="blue-grey lighten-3">編集</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  dense
                  v-model="getUpdateTitle"
                  label="Title"
                  :rules="[rules.titleCheck]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  dense
                  v-model="getUpdateComment"
                  label="Comment"
                  :rules="[rules.commentCheck]"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue" small text @click.stop="updateCheck"
                >Update</v-btn
              >
              <v-btn color="red" small text @click.stop="close">Close</v-btn>
            </v-card-actions>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- 更新確認を表示するダイアログ-->
    <v-dialog max-width="500px" v-model="$store.state.updateCheckDialogStatus">
      <v-card color="grey lighten-5">
        <v-card-title class="blue-grey lighten-3">編集</v-card-title>
        <v-card-text align="center">
          <v-list color="grey lighten-5">
            <v-card-text class="grey--text text--darken-2"
              >以下の内容で更新してもよろしいですか？</v-card-text
            >
            <div>- Title -</div>
            <div class="grey--text text--darken-2">
              {{ justUpdateTitle }}
            </div>
            <v-divider class="dividerWidth"></v-divider><br />
            <div>- Comment -</div>
            <div style="white-space: pre" class="grey--text text--darken-2">
              {{ justUpdateComment }}
            </div>
            <v-divider class="dividerWidth"></v-divider><br />
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" small text @click.stop="update">YES</v-btn>
            <v-btn color="red" small text @click.stop="cancelUpdate">NO</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  name: "UpdateDialog",
  props: {
    title: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  data() {
    return {
      updateTitle: this.$store.state.uploadContentDetail.title,
      updateComment: this.$props.comment,
      justUpdateTitle: this.$store.state.uploadContentDetail.title,
      justUpdateComment: this.$store.state.uploadContentDetail.comment,
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
  methods: {
    //更新確認ダイアログを表示させる
    updateCheck() {
      this.$store.commit("switchUpdateDialogStatus");
      this.$store.commit("setUpdateCheckDialogStatus");
    },
    close() {
      this.$store.commit("switchUpdateDialogStatus");
    },
    update() {
      this.$emit("update", this.justUpdateTitle, this.justUpdateComment);
    },
    cancelUpdate() {
      this.$store.commit("switchUpdateCheckDialogStatus");
      this.$store.commit("setCancelSnackbarStatus");
    },
  },
  computed: {
    getUpdateTitle: {
      get() {
        return this.updateTitle;
      },
      set(v) {
        this.justUpdateTitle = v;
      },
    },
    getUpdateComment: {
      get() {
        return this.updateComment;
      },
      set(v) {
        this.justUpdateComment = v;
      },
    },
  },
};
</script>

<style scoped></style>
