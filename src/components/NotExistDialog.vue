<template>
    <v-dialog max-width="600px" v-model="$store.state.docExistsStatus">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-row justify="center">
                      <v-col cols="12">
                        <v-list>
                          <v-list-item>
                            <v-list-item-content></v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>クリックした投稿は削除されました</v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>申し訳ありませんが、最初からやり直してください</v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-row>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" small text @click.stop="switchAlertStatus">閉じる</v-btn>
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
</template>
<script>
export default {
    computed:{
        msg(){
            return this.$store.state.docExistsStatus
        }
    },
    methods:{
        switchAlertStatus(){
          this.$store.commit('switchAlertStatus');
        },
    }
}
</script>