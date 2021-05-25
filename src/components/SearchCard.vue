<template>
  <v-card color="brown lighten-5" width="340" class="top-page">
    <v-radio-group
      v-model="$store.state.keywordType"
      @change="changeCheckboxValue"
      v-if="$store.state.myFavoriteGenreIds.length > 0"
    >
      <v-radio
        v-for="op in keywordOption"
        :key="op.value"
        :label="op.text"
        :value="op.value"
        style="font-weight:bold"
      ></v-radio>
    </v-radio-group>
    <v-radio-group
      v-model="$store.state.keywordType"
      @change="changeCheckboxValue"
      v-if="$store.state.myFavoriteGenreIds.length === 0"
    >
      <v-radio
        v-for="op in keywordOptionWithoutReco"
        :key="op.value"
        :label="op.text"
        :value="op.value"
        style="font-weight:bold"
      ></v-radio>
    </v-radio-group>
    <multiselect
      v-if="this.type === '0'"
      placeholder="大カテゴリーを選択"
      :select-label="''"
      :selected-label="''"
      :deselect-label="''"
      :allow-empty="false"
      track-by="id"
      :searchable="false"
      :clear-on-select="true"
      :close-on-select="true"
      label="name"
      @input="getMiddleDrinkCategory"
      v-model="$store.state.bigDrinkCategoryId"
      :options="$store.state.bigDrinkCategory"
    />
    <multiselect
      v-if="this.type === '0' && $store.state.bigDrinkCategoryId !== null"
      placeholder="小カテゴリーを選択"
      :select-label="''"
      :selected-label="''"
      :deselect-label="''"
      track-by="id"
      :searchable="false"
      :clear-on-select="true"
      :close-on-select="true"
      label="name"
      :clearable="true"
      @input="getDrinks"
      v-model="$store.state.middleDrinkCategoryId"
      :options="$store.state.middleDrinkCategory"
    />
    <multiselect
      v-if="this.type === '0' && $store.state.middleDrinkCategoryId !== null"
      placeholder="ドリンクを選択"
      :select-label="''"
      :selected-label="''"
      :deselect-label="''"
      track-by="id"
      :multiple="true"
      clearable="true"
      :searchable="false"
      :clear-on-select="true"
      :close-on-select="false"
      label="name"
      :max="3"
      v-model="$store.state.itemId"
      :options="$store.state.drinks"
    />
    <v-text-field
      label="ユーザー名を入力"
      v-model="$store.state.keywordOfUserName"
      v-if="this.type === '1'"
      outlined
      dense
      background-color="white"
      color="brown"
    >
    </v-text-field>

    <v-menu
      v-if="this.type === '2'"
      offset-y
      nudge-right="30"
      min-width="0"
      :close-on-content-click="false"
      v-model="startDateMenu"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          label="この日付から"
          readonly
          :value="$store.state.startDate"
          v-on="on"
          clearable
          @click:clear="$store.state.startDate = null"
          background-color="white"
          color="brown"
        />
      </template>
      <v-date-picker
        no-title
        locale="ja-jp"
        :day-format="(d) => new Date(d).getDate()"
        v-model="$store.state.startDate"
        @input="startDateMenu = false"
      />
    </v-menu>

    <v-menu
      v-if="this.type === '2'"
      offset-y
      nudge-right="30"
      min-width="0"
      :close-on-content-click="false"
      v-model="endDateMenu"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          label="この日付まで"
          readonly
          :value="$store.state.endDate"
          v-on="on"
          clearable
          @click:clear="$store.state.endDate = null"
          background-color="white"
          color="brown"
        ></v-text-field>
      </template>
      <v-date-picker
        no-title
        locale="ja-jp"
        :day-format="(d) => new Date(d).getDate()"
        v-model="$store.state.endDate"
        @input="endDateMenu = false"
      ></v-date-picker>
    </v-menu>

    <v-text-field
      label="タイトルを入力"
      v-model="$store.state.keyword"
      v-if="this.type === '3'"
      outlined
      dense
      background-color="white"
      color="brown"
    ></v-text-field>

    <multiselect
      v-if="this.type === '5'"
      placeholder="ジャンルを選択"
      :select-label="''"
      :selected-label="''"
      :deselect-label="''"
      :allow-empty="true"
      track-by="id"
      :searchable="false"
      :clear-on-select="true"
      :close-on-select="false"
      label="name"
      v-model="$store.state.genreForSearch"
      :options="$store.state.genres"
      :multiple="true"
    />

    <v-btn @click="search">検索</v-btn>
  </v-card>
</template>
<script>
import multiselect from "vue-multiselect";
export default {
  components: {
    multiselect,
  },
  data() {
    return {
      startDateMenu: false,
      endDateMenu: false,
      radioGroup: "-1",
      keywordOption: [
        { text: "今週の投稿", value: "-1" },
        { text: "あなたへのオススメ", value: "4" },
        { text: "タイトル", value: "3" },
        { text: "投稿日", value: "2" },
        { text: "ユーザー名", value: "1" },
        { text: "材料ドリンク", value: "0" },
        { text: "ジャンル", value: "5" },
      ],
      keywordOptionWithoutReco: [
        { text: "今週の投稿", value: "-1" },
        { text: "タイトル", value: "3" },
        { text: "投稿日", value: "2" },
        { text: "ユーザー名", value: "1" },
        { text: "材料ドリンク", value: "0" },
        { text: "ジャンル", value: "5" },
      ],
    };
  },
  methods: {
    search() {
      this.$emit("search");
    },
    changeCheckboxValue() {
      this.$store.state.bigDrinkCategory = [];
      this.$store.state.middleDrinkCategory = [];
      this.$store.state.itemId = [];
      this.$store.state.keywordOfUserName = "";
      this.$store.state.startDate = null;
      this.$store.state.startDate = null;
      this.$store.state.keyword = "";
      this.$store.state.genreForSearch = [];
      if (this.type === "0") {
        this.$store.dispatch("getBigDrinkCategory");
      } else if (this.type === "5") {
        this.$store.dispatch("getGenres");
      }
    },
    getMiddleDrinkCategory() {
      this.$store.commit("resetMiddleDrinkCategory");
      this.$store.dispatch("getMiddleDrinkCategory", {
        id: this.$store.state.bigDrinkCategoryId.id,
      });
    },
    getDrinks() {
      this.$store.commit("resetDrinks");
      this.$store.dispatch("getDrinks", {
        id: this.$store.state.middleDrinkCategoryId.id,
      });
    },
  },
  computed: {
    type() {
      return this.$store.state.keywordType;
    },
  },
};
</script>
<style>
.top-page .multiselect__tag {
  background: orange;
}
.top-page .multiselect__option--highlight {
  background: orange;
}
.top-page .multiselect__tag-icon:focus,
.top-page .multiselect__tag-icon:hover {
  background: orange;
}
.top-page .multiselect__tag-icon:after {
  color: rgb(255, 68, 0);
}
.top-page {
  font-family: "Yu Gothic", "游ゴシック", YuGothic, "游ゴシック体";
}
</style>
