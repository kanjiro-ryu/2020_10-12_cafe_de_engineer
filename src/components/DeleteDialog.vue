<template>
  <v-col>
    <!--   投稿内容削除確認のダイアログ-->
    <v-dialog max-width="600px" v-model="$store.state.deleteCheckDialogStatus">
      <v-card color="grey lighten-5">
        <v-card-title class="red lighten-3">削除</v-card-title>
        <v-card-text>
          <v-list color="grey lighten-5">
            <v-list-item>
              <v-list-item-content>本当に削除しますか？</v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue"
              small
              text
              @click.stop="
                deleteUploadData($store.state.uploadContentDetail.id)
              "
              >YES</v-btn
            >
            <v-btn color="red" small text @click.stop="cancelDelete">NO</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--   投稿内容削除確認のダイアログ-->
    <v-dialog
      max-width="500px"
      v-model="$store.state.deleteCommentCheckDialogStatus"
    >
      <v-card color="grey lighten-5">
        <v-card-title class="red lighten-3">削除</v-card-title>
        <v-card-text>
          <v-list color="grey lighten-5">
            <v-list-item>
              <v-list-item-content>本当に削除しますか？</v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" small text @click.stop="deleteComment"
              >YES</v-btn
            >
            <v-btn color="red" small text @click.stop="cancelDeleteComment"
              >NO</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  name: "DeleteDialog",
  methods: {
    //削除処理...削除する投稿のidを渡して削除完了スナックバーを表示させる
    deleteUploadData(id) {
      this.$emit("deleteUploadData", id);
      // this.$store.commit("setDeletedSnackbarStatus");
      // this.$store.commit("switchDeleteCheckDialogStatus");
    },
    //投稿の削除をキャンセル
    cancelDelete() {
      this.$store.commit("switchDeleteCheckDialogStatus");
      this.$store.commit("setCancelSnackbarStatus");
    },
    //コメントを削除
    deleteComment() {
      this.$emit("deleteComment");
      // this.$store.commit("switchDeleteCommentCheckDialogStatus");
      // this.$store.commit("setCommentDeletedSnackbarStatus");
    },
    //コメントの削除をキャンセル
    cancelDeleteComment() {
      this.$store.commit("switchDeleteCommentCheckDialogStatus");
      this.$store.commit("setCancelSnackbarStatus");
    },
  },
};
</script>

<style scoped></style>
