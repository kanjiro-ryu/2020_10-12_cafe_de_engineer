<template>
  <div>
    <Header />
    <v-row justify="center">
      <v-col cols="8" class="compact-form">
        <v-card color="brown lighten-5" height="1100">
          <v-img
            height="100px"
            src="../assets/コーヒー投稿フォームヘッダー用.jpg"
          >
            <v-card-title class="white--text text--darken-2"
              >投稿フォーム</v-card-title
            >
            <v-card-text class="white--text text--darken-2"
              >こちらに必要な情報を記入してください</v-card-text
            >
          </v-img>
          <!-- 投稿フォーム-->
          <v-form ref="upload_form">
            <v-row justify="center" class="compact-form">
              <!-- タイトルと価格フォームを一行で-->
              <v-col cols="6" class="compact-form">
                <v-card height="70" class="compact-form">
                  <v-text-field
                    dense
                    :rules="[rules.titleCheck]"
                    v-model="title"
                    filled
                    label="タイトル"
                    clearable
                    :counter="20"
                    color="brown"
                  >
                  </v-text-field>
                </v-card>
              </v-col>
              <v-col cols="6" class="compact-form">
                <v-card height="70" class="compact-form" width="475">
                  <v-text-field
                    dense
                    :rules="[rules.totalPriceCheck, rules.onlyNum]"
                    v-model="totalPrice"
                    filled
                    label="価格"
                    clearable
                    :counter="4"
                    color="brown"
                  >
                  </v-text-field>
                </v-card>
              </v-col>
              <!-- ジャンル-->
              <v-col cols="6" class="compact-form">
                <v-row>
                  <v-col>
                    <v-card color="grey lighten-4" class="compact-form">
                      <v-col align="center">
                        <v-select
                          dense
                          small-chips
                          append-outer-icon="mdi-shape-plus"
                          label="ジャンル : 最大3つまで"
                          clearable
                          multiple
                          v-model="genreSelectCheck"
                          :items="getGenres"
                          item-text="name"
                          item-value="genres"
                          color="brown"
                        >
                          <template #selection="{ item }">
                            <v-chip small color="#ffa500" dark>{{
                              item.name
                            }}</v-chip>
                          </template>
                        </v-select>
                      </v-col>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <!-- 場所-->
              <v-col cols="6" class="compact-form">
                <v-row>
                  <v-col class="compact-form">
                    <v-card
                      color="grey lighten-4"
                      class="compact-form"
                      width="225"
                    >
                      <v-col align="center">
                        <v-select
                          dense
                          append-outer-icon="mdi-home-city"
                          label="場所"
                          clearable
                          v-model="placeSelect"
                          :items="place"
                          item-text="name"
                          item-value="place"
                          :rules="[rules.required]"
                          color="brown"
                        >
                          <template #selection="{ item }">
                            <v-chip small color="#ffa500" dark>{{
                              item.name
                            }}</v-chip>
                          </template>
                        </v-select>
                      </v-col>
                    </v-card>
                  </v-col>
                  <!-- 時間帯-->
                  <v-col cols="6" class="compact-form">
                    <v-card
                      color="grey lighten-4"
                      class="compact-form"
                      width="225"
                    >
                      <v-col align="center">
                        <v-select
                          dense
                          small-chips
                          append-outer-icon="mdi-clock"
                          label="時間帯"
                          clearable
                          v-model="timeSelect"
                          :items="timeZone"
                          item-text="name"
                          item-value="timeZone"
                          :rules="[rules.required]"
                        >
                          <template #selection="{ item }">
                            <v-chip small color="#ffa500" dark>{{
                              item.name
                            }}</v-chip>
                          </template>
                        </v-select>
                      </v-col>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <!-- ドリンク-->
              <v-col align="center" cols="12">
                <v-card width="95%" color="grey lighten-4">
                  <v-img height="60px" src="../assets/ドリンク用コーヒー.jpg">
                    <v-card-title class="white--text text--darken-2"
                      >ドリンク</v-card-title
                    >
                  </v-img>
                  <v-container>
                    <v-row justify="center" dense>
                      <v-col cols="6" class="compact-form">
                        <v-select
                          dense
                          outlined
                          small-chips
                          label="大カテゴリ"
                          clearable
                          v-model="bigDrinkCategorySelect"
                          :items="bigDrinkCategory"
                          item-text="name"
                          item-value="id"
                          @change="bigDrinkCategoryChanged"
                          class="index1500"
                          :rules="[rules.required]"
                          color="brown"
                        >
                          <template #selection="{ item }">
                            <v-chip small color="#ffa500" dark>{{
                              item.name
                            }}</v-chip>
                          </template>
                        </v-select>
                      </v-col>
                      <v-col cols="6" class="compact-form">
                        <v-select
                          dense
                          outlined
                          small-chips
                          label="小カテゴリ"
                          clearable
                          v-model="middleDrinkCategorySelect"
                          :items="middleDrinkCategory"
                          item-text="name"
                          item-value="id"
                          @change="middleDrinkCategoryChanged"
                          class="index1250"
                          :rules="[rules.required]"
                          color="brown"
                        >
                          <template #selection="{ item }">
                            <v-chip small color="#ffa500" dark>{{
                              item.name
                            }}</v-chip>
                          </template>
                        </v-select>
                      </v-col>
                      <v-col cols="12" class="register_multi">
                        <multiselect
                          class="compact-form"
                          :multiple="true"
                          :clear-on-select="true"
                          :close-on-select="false"
                          :searchable="false"
                          track-by="name"
                          v-model="drinkSelectCheck"
                          :options="drinkList"
                          label="name"
                          :selectLabel="settings.selectLabel"
                          :deselectLabel="settings.deselectLabel"
                          :selectedLabel="settings.selectedLabel"
                          :placeholder="settings.placeholder"
                          :rules="[rules.required]"
                        ></multiselect>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
              <!--            フード-->
              <v-col align="center" cols="12">
                <v-card width="95%" color="grey lighten-4">
                  <v-img height="60px" src="../assets/八天堂抹茶クリーム.jpg">
                    <v-card-title class="white--text text--darken-2"
                      >フード</v-card-title
                    >
                  </v-img>
                  <v-row justify="center" dense>
                    <v-col cols="12"> </v-col>
                    <v-col cols="12" class="compact-form">
                      <v-text-field
                        label="記入欄 1"
                        v-model="foodAndToppingName1"
                        dense
                        clearable
                        :counter="20"
                        outlined
                        color="brown"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" class="compact-form">
                      <v-text-field
                        label="記入欄 2"
                        v-model="foodAndToppingName2"
                        dense
                        clearable
                        :counter="20"
                        outlined
                        color="brown"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" class="compact-form">
                      <v-text-field
                        label="記入欄 3"
                        v-model="foodAndToppingName3"
                        dense
                        clearable
                        :counter="20"
                        outlined
                        color="brown"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <!--            コメント-->
              <v-col align="center" class="compact-form_title-price">
                <v-col cols="12" align="center">
                  <v-card color="grey lighten-5">
                    <v-textarea
                      align="center"
                      dense
                      full-width
                      height="100"
                      style="white-space: pre"
                      filled
                      v-model="comment"
                      counter="100"
                      label="コメント"
                      :rules="[rules.commentCheck]"
                      clearable
                      class="index500"
                      color="brown"
                    ></v-textarea>
                  </v-card>
                </v-col>
                <v-col>
                  <v-btn
                    width="200"
                    max-width="200"
                    large
                    @click.stop="uploadCheck"
                    >投 稿</v-btn
                  >
                </v-col>
              </v-col>
            </v-row>
            <v-row>
              <!--        投稿内容確認ダイアログ-->
              <UploadCheckDialog
                @cancelUpload="cancelUpload"
                @upload="upload"
              />
            </v-row>

            <v-row>
              <!--        投稿完了確認ダイアログ-->
              <UploadCompletedDialog @OK="OK" />
            </v-row>

            <v-row>
              <!--投稿警告ダイアログ-->
              <UploadErrorDialog />
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <link
      rel="stylesheet"
      href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css"
    />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Multiselect from "vue-multiselect";
import UploadErrorDialog from "@/components/UploadErrorDialog";
import UploadCheckDialog from "@/components/UploadCheckDialog";
import UploadCompletedDialog from "@/components/UploadCompletedDialog";
const defaultSettings = {
  placeholder: "最大3つまで選択できます",
  selectLabel: "",
  deselectLabel: "",
  selectedLabel: "",
  noDataLabel: "対象データがありません",
};
export default {
  name: "Register",
  created() {
    this.settings = Object.assign({}, defaultSettings, this.settings);
    this.place = this.$store.state.place;
    this.timeZone = this.$store.state.doTime;
    this.$store.dispatch("getGenres");
    this.$store.dispatch("getBigDrinkCategory");
    this.bigDrinkCategory = this.$store.state.bigDrinkCategory;
  },
  data() {
    return {
      title: "",
      totalPrice: "",
      genre: [],
      genreSelect: "",
      genreSelectData: [],
      upGenreNameList: "",
      place: [],
      placeSelect: "",
      pickedPlaceName: "",
      timeZone: [],
      timeSelect: "",
      pickedTimezoneName: "",

      bigDrinkCategory: [],
      middleDrinkCategory: [],
      drinkList: [{ id: "", name: "", parentId: "" }],
      bigDrinkCategorySelect: "",
      middleDrinkCategorySelect: "",
      drinkSelect: "",
      drinkSelectData: [],

      foodAndToppingName1: "",
      foodAndToppingName2: "",
      foodAndToppingName3: "",
      comment: "",
      upDrinkList: [],
      upOtherList: [],

      settings: undefined,
      rules: {
        required: (v) => {
          return !!v || "必須項目です";
        },
        onlyNum: (v) => {
          const pattern = /^[0-9]*$/;
          return pattern.test(v) || "数字を入力してください";
        },
        titleCheck: (v) => {
          if (v) {
            return v.length <= 20 || "20文字以内で入力してください";
          } else {
            return !!v || "必須項目です";
          }
        },
        totalPriceCheck: (v) => {
          if (v) {
            return v.length <= 4 || "4桁以内で入力してください";
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
  computed: {
    drinkSelectCheck: {
      get() {
        return this.drinkSelect;
      },
      set(value) {
        if (value.length > 3) {
          value.pop();
        }
        this.drinkSelectData = new Array();
        for (let i = 0; i < value.length; i++) {
          this.drinkSelectData.push(value[i]);
        }
        this.drinkSelect = value;
      },
    },
    genreSelectCheck: {
      get() {
        return this.genreSelect;
      },
      set(value) {
        this.genreSelectData = [];
        for (let i = 0; i < value.length; i++) {
          const index = this.$store.state.genres.findIndex(
            (v) => v.name == value[i]
          );
          this.genreSelectData.push(this.$store.state.genres[index]);
        }
        if (value.length > 3) {
          this.genreSelectData.splice(3, 1);
          value.pop();
        }
        this.genreSelect = value;
      },
    },
    getGenres() {
      return this.$store.state.genres;
    },
  },
  methods: {
    bigDrinkCategoryChanged() {
      if (this.bigDrinkCategorySelect) {
        const id = this.bigDrinkCategorySelect;
        this.$store.commit("resetMiddleDrinkCategory");
        this.$store.dispatch("getMiddleDrinkCategory", { id: id });
        this.middleDrinkCategory = this.$store.state.middleDrinkCategory;
      }
    },
    middleDrinkCategoryChanged() {
      if (this.middleDrinkCategorySelect) {
        const id = this.middleDrinkCategorySelect;
        this.$store.commit("resetDrinks");
        this.$store.dispatch("getDrinks", { id: id });
        this.drinkList = this.$store.state.drinks;
      }
    },
    async uploadCheck() {
      if (this.$refs.upload_form.validate()) {
        if (this.drinkSelect !== "") {
          let uploadGenreList = "";
          if (this.genreSelectData.length === 0) {
            uploadGenreList = "未登録";
          } else {
            for (let i = 0; i < this.genreSelectData.length; i++) {
              const genreName = this.genreSelectData[i].name;
              if (i === this.genreSelectData.length - 1) {
                uploadGenreList += genreName;
              } else {
                uploadGenreList += genreName + "\n";
              }
            }
          }
          this.upGenreNameList = uploadGenreList;
          const placeIndex = this.$store.state.place.findIndex(
            (v) => v.name === this.placeSelect
          );
          this.pickedPlaceName = this.$store.state.place[placeIndex].name;
          const doTimeIndex = this.$store.state.doTime.findIndex(
            (v) => v.name === this.timeSelect
          );
          this.pickedTimezoneName = this.$store.state.doTime[doTimeIndex].name;
          for (let i = 0; i < this.drinkSelectData.length; i++) {
            const drinkName = this.drinkSelectData[i].name;
            this.upDrinkList.push(drinkName);
          }
          if (
            this.foodAndToppingName1 !== "" &&
            this.foodAndToppingName1 !== null
          ) {
            this.upOtherList.push(this.foodAndToppingName1);
          } else {
            this.foodAndToppingName1 = "未登録";
            this.upOtherList.push(this.foodAndToppingName1);
          }
          if (
            this.foodAndToppingName2 !== "" &&
            this.foodAndToppingName2 !== null
          ) {
            this.upOtherList.push(this.foodAndToppingName2);
          }
          if (
            this.foodAndToppingName3 !== "" &&
            this.foodAndToppingName3 !== null
          ) {
            this.upOtherList.push(this.foodAndToppingName3);
          }
          if (this.comment !== "" && this.comment !== null) {
            console.log();
          } else {
            this.comment = "未登録";
          }
          //投稿時に、入力した時確認データをリセット
          this.$store.commit("resetUploadCheckData");
          //投稿時に、入力した時確認データをセット
          let uploadCheckData = {
            title: this.title,
            genreNameList: this.upGenreNameList,
            totalPrice: this.totalPrice,
            placeName: this.pickedPlaceName,
            timeZoneName: this.pickedTimezoneName,
            drinkNameList: this.upDrinkList,
            foodAndToppingNameList: this.upOtherList,
            comment: this.comment,
          };
          this.$store.commit("setUploadCheckData", uploadCheckData);
          //投稿確認ダイアログを表示させる
          this.$store.commit("setUploadCheckDialogStatus");
        } else {
          //投稿エラー警告ダイアログを表示させる
          this.$store.commit("setUploadErrorDialogStatus");
        }
      } else {
        //投稿エラー警告ダイアログを表示させる
        this.$store.commit("setUploadErrorDialogStatus");
      }
    },
    cancelUpload() {
      //投稿確認ダイアログを閉じる
      this.$store.commit("switchUploadCheckDialogStatus");
      this.upDrinkList = [];
      this.upOtherList = [];
    },
    upload() {
      //投稿確認ダイアログを閉じる
      this.$store.commit("switchUploadCheckDialogStatus");
      const placeIndex = this.$store.state.place.findIndex(
        (v) => v.name === this.placeSelect
      );
      const doTimeIndex = this.$store.state.doTime.findIndex(
        (v) => v.name === this.timeSelect
      );
      //v-selectから選択されたデータをリスト化
      if (this.comment === "未登録") {
        this.comment = "";
      }
      const drinkIdArray = new Array();
      const otherNameArray = new Array();
      const genreIdArray = new Array();
      for (let i = 0; i < this.drinkSelectData.length; i++) {
        drinkIdArray.push(this.drinkSelectData[i].id);
      }

      const foodAndToppingArray = new Array();
      foodAndToppingArray.push({ name: this.foodAndToppingName1 });
      if (
        this.foodAndToppingName2 !== "" &&
        this.foodAndToppingName2 !== null
      ) {
        foodAndToppingArray.push({ name: this.foodAndToppingName2 });
      }
      if (
        this.foodAndToppingName3 !== "" &&
        this.foodAndToppingName3 !== null
      ) {
        foodAndToppingArray.push({ name: this.foodAndToppingName3 });
      }

      for (let i = 0; i < foodAndToppingArray.length; i++) {
        otherNameArray.push(foodAndToppingArray[i].name);
      }
      for (let i = 0; i < this.genreSelectData.length; i++) {
        genreIdArray.push(this.genreSelectData[i].id);
      }
      //文字列を数字型に変換
      const totalPrice = Number(this.totalPrice);
      const placeId = Number(placeIndex);
      const doTimeId = Number(doTimeIndex);

      this.$store.dispatch("uploadContent", {
        comment: this.comment,
        doTimeId: doTimeId,
        drinkId: drinkIdArray,
        favorites: [],
        genreId: genreIdArray,
        otherList: otherNameArray,
        placeId: placeId,
        talks: [],
        title: this.title,
        totalPrice: totalPrice,
        uploadDate: new Date(),
        uploadUserId: this.$store.state.loginUser.uid,
        uploadUserName: this.$store.state.loginUser.displayName,
      });
      //投稿完了ダイアログを表示
      this.$store.commit("setUploadCompletedDialogStatus");
    },
    OK() {
      //投稿完了ダイアログを非表示
      this.$store.commit("switchUploadCompletedDialogStatus");
      this.$store.state.uploadContents = [];
      this.$router.push("/top");
    },
  },
  components: {
    UploadCompletedDialog,
    UploadCheckDialog,
    UploadErrorDialog,
    Header,
    Multiselect,
  },
};
</script>

<style>
.register_multi .multiselect--active {
  z-index: 1000;
  transform: scale(0.95);
}
.register_multi .multiselect__content-wrapper {
  font-size: 15px;
}
.register_multi .multiselect__tag {
  background: orange;
}
.register_multi .multiselect__option--highlight {
  background: orange;
}
.register_multi .multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
  background: orange;
}
.register_multi .multiselect__tag-icon:after {
  color: red;
}

/*.multiselect__content-wrapper {*/
/*  z-index: 1000;*/
/*}*/
</style>
<style scoped>
.compact-form {
  transform: scale(0.95);
  /*transform-Origin: left;*/
}
.compact-form_title-price {
  transform: scale(0.9);
  /*transform-Origin: left;*/
}
.index1500 {
  z-index: 1500;
}
.index1250 {
  z-index: 1250;
}
.index500 {
  z-index: 500;
}
.dividerWidth {
  width: 300px;
}
</style>
