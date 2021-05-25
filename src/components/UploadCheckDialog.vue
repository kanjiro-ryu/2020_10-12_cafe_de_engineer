<template>
  <v-dialog max-width="500px" v-model="$store.state.uploadCheckDialogStatus">
    <v-card color="grey lighten-5">
      <v-card-title class="brown lighten-4">投稿</v-card-title>
      <v-card-text align="center">
        <v-container>
          <v-row>
            <v-row justify="center">
              <v-col cols="12" color="grey lighten-5">
                <v-list color="grey lighten-5">
                  <v-card-text class="grey--text text--darken-2"
                    >こちらの内容で投稿しますか？</v-card-text
                  >
                  <div>- タイトル -</div>
                  <div class="grey--text text--darken-2">
                    {{ this.$store.state.uploadCheckData.title }}
                  </div>
                  <v-divider class="dividerWidth"></v-divider><br />
                  <div>- ジャンル -</div>
                  <div
                    style="white-space: pre"
                    class="grey--text text--darken-2"
                  >
                    {{ this.$store.state.uploadCheckData.genreNameList }}
                  </div>
                  <v-divider class="dividerWidth"></v-divider><br />
                  <div>- 価格 -</div>
                  <div class="grey--text text--darken-2">
                    {{
                      this.$store.state.uploadCheckData.totalPrice | locale
                    }}円
                  </div>
                  <v-divider class="dividerWidth"></v-divider><br />
                  <div>- 場所 -</div>
                  <div class="grey--text text--darken-2">
                    {{ this.$store.state.uploadCheckData.placeName }}
                  </div>
                  <v-divider class="dividerWidth"></v-divider><br />
                  <div>- 時間帯 -</div>
                  <div class="grey--text text--darken-2">
                    {{ this.$store.state.uploadCheckData.timeZoneName }}
                  </div>
                  <v-divider class="dividerWidth"></v-divider><br />
                  <div>-ドリンク -</div>
                  <div
                    v-for="drink in this.$store.state.uploadCheckData
                      .drinkNameList"
                    :key="drink"
                  >
                    {{ drink }}
                  </div>
                  <v-divider class="dividerWidth"></v-divider><br />
                  <div>- フード -</div>
                  <div
                    v-for="other in this.$store.state.uploadCheckData
                      .foodAndToppingNameList"
                    :key="other"
                  >
                    {{ other }}
                  </div>
                  <v-divider class="dividerWidth"></v-divider><br />
                  <div>- コメント -</div>
                  <div
                    style="white-space: pre"
                    class="grey--text text--darken-2"
                  >
                    {{ this.$store.state.uploadCheckData.comment }}
                  </div>
                  <v-divider class="dividerWidth"></v-divider><br />
                </v-list>
              </v-col>
            </v-row>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" small text @click.stop="upload">投稿</v-btn>
            <v-btn color="red" small text @click.stop="cancelUpload"
              >キャンセル</v-btn
            >
          </v-card-actions>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "uploadCheck",
  methods: {
    cancelUpload() {
      this.$emit("cancelUpload");
    },
    upload() {
      this.$emit("upload");
    },
    isEmpty(obj) {
      return !Object.keys(obj).length;
    },
  },
  filters: {
    locale(value) {
      if (value) {
        value = Number(value);
        return value.toLocaleString();
      }
    },
  },
};
</script>

<style scoped></style>
