<template>
    <v-dialog max-width="600px" v-model="$store.state.isOpenRankingDailog">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-row justify="center">
                      <v-col cols="12">
                        <v-list>
                          <v-list-item>
                            <v-list-item-content id="title"><p>ランキングとは</p></v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content id="word"><br>
                                ・毎日深夜0時にいいねの数を集計してTOP5を表示します。<br><br>
                                ・集計対象は30日前から前日に投稿されたものです。<br><br>
                                ・いいねが0個の投稿はランキングに載りません。
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-row>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" small text @click.stop="switchRankingDialog">閉じる</v-btn>
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
</template>
<script>
export default {
    methods:{
        switchRankingDialog(){
          this.$store.commit('switchRankingDialog');
        },
    }
}
</script>
<style scoped>
  #title{
    text-align: center;
  }
  #word{
    font-family:"Yu Gothic", "游ゴシック", YuGothic, "游ゴシック体";
  }
</style>