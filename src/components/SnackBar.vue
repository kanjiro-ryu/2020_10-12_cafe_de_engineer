<template>
  <v-row>
    <!-- 削除完了時のスナックバー   -->
    <v-snackbar
      rounded="pill"
      color="red lighten-3"
      @input="switchDeletedSnackbar"
      v-model="$store.state.deletedSnackbarStatus"
      :timeout="1500"
      >削除しました
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click.stop="switchDeletedSnackbar"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
    <!-- 更新完了時のスナックバー   -->
    <v-snackbar
      rounded="pill"
      color="blue-grey accent-4"
      @input="switchUpdatedSnackbar"
      v-model="$store.state.updatedSnackbarStatus"
      :timeout="1500"
      >更新しました
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click.stop="switchUpdatedSnackbar"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
    <!-- コメント完了時のスナックバー   -->
    <v-snackbar
      rounded="pill"
      color="brown lighten-3"
      @input="switchCommentedSnackbar"
      v-model="$store.state.commentedSnackbarStatus"
      :timeout="1500"
      >コメントしました
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click.stop="switchCommentedSnackbar"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
    <!-- コメント削除完了時のスナックバー   -->
    <v-snackbar
      rounded="pill"
      color="red lighten-2"
      @input="switchCommentDeletedSnackbar"
      v-model="$store.state.commentDeletedSnackbarStatus"
      :timeout="1500"
      >削除しました
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click.stop="switchCommentDeletedSnackbar"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
    <!-- キャンセル時のスナックバー  -->
    <v-snackbar
      rounded="pill"
      color="grey"
      @input="switchCancelSnackbar"
      v-model="$store.state.cancelSnackbarStatus"
      :timeout="1500"
      >キャンセルしました
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click.stop="switchCancelSnackbar"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  name: "SnackBar",

  methods: {
    switchDeletedSnackbar() {
      //親のデータを直接変更してはいけないため
      // console.log("switchDeletedSnackbar");
      // this.$emit("switchDeletedSnackbar");
      this.$store.commit("switchDeletedSnackbarStatus");
    },
    switchUpdatedSnackbar() {
      //親のデータを直接変更してはいけないため
      this.$store.commit("switchUpdatedSnackbarStatus");
      // this.$emit("switchUpdatedSnackbar");
    },
    switchCommentedSnackbar() {
      //親のデータを直接変更してはいけないため
      // console.log("switchCommentedSnackbar");
      // this.$emit("switchCommentedSnackbar");
      this.$store.commit("switchCommentedSnackbarStatus");
    },
    switchCommentDeletedSnackbar() {
      //親のデータを直接変更してはいけないため
      // console.log("switchCommentDeletedSnackbar");
      // this.$emit("switchCommentDeletedSnackbar");
      this.$store.commit("switchCommentDeletedSnackbarStatus");
    },
    switchCancelSnackbar() {
      //親のデータを直接変更してはいけないため
      // console.log("switchCancelSnackbar");
      this.$store.commit("switchCancelSnackbarStatus");
      // this.$emit("switchCancelSnackbar");
    },
  },
};
</script>

<style scoped></style>
