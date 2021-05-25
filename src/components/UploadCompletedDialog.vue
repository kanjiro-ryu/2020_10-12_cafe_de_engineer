<template>
  <v-dialog
    max-width="600px"
    v-model="$store.state.uploadCompletedDialogStatus"
    :persistent="true"
  >
    <v-card color="grey lighten-5">
      <v-card-text>
        <v-container>
          <v-row>
            <v-row justify="center">
              <v-col cols="12">
                <v-list color="grey lighten-5">
                  <v-list-item>
                    <v-list-item-content>
                      投稿が完了しました</v-list-item-content
                    >
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" small text @click.stop="OK">OK</v-btn>
          </v-card-actions>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UploadCompletedDialog",
  methods: {
    OK() {
      this.$emit("OK");
    },
  },
};
</script>

<style scoped></style>
