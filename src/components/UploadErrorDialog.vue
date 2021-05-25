<template>
  <v-dialog max-width="600px" v-model="$store.state.uploadErrorDialogStatus">
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
                      投稿に必要な情報が足りません</v-list-item-content
                    >
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content
                      >申し訳ありませんが、最初からやり直してください</v-list-item-content
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
</template>

<script>
export default {
  name: "uploadErrorDialog",
  methods: {
    closeAlertDialog() {
      this.$store.commit("switchUploadErrorDialogStatus");
    },
  },
};
</script>

<style scoped></style>
