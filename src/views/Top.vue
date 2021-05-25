<template>
  <div>
    <Header />
    <v-container fluid v-if="this.completeLogin">
      <v-row>
        <v-col cols="2">
          <Search-card @search="search" />
        </v-col>
        <v-col v-if="loading"> <br /><br /><Loading /> </v-col>
        <v-col class="top-data" cols="9" id="data-table" v-if="readyToShow">
          <v-data-table
            class="my-awesome-table"
            :headers="headers"
            :items="this.$store.state.uploadContents"
            @click:row="toDetail"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="pageCount = $event"
          >
            <template v-slot:[`item.genreName`]="{ item }">
              <span v-for="genre in item.genreName" :key="genre">
                <v-chip dark small color="orange">
                  {{ genre }}
                </v-chip>
              </span>
            </template>
            <template v-slot:[`item.uploadDate`]="{ item }">
              {{ item.uploadDate | formatDate }}
            </template>
            <template v-slot:[`item.uploadUserName`]="{ item }">
              <a
                href="#"
                class="userLink"
                @click.stop.prevent="selected(item)"
                >{{ item.uploadUserName }}</a
              >
            </template>
            <template v-slot:[`item.drinkName`]="{ item }">
              <div v-for="drink in item.drinkName" :key="drink">
                {{ drink }}
              </div>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <nobr>
                <v-icon
                  @click.stop="switchFavorite(item)"
                  :class="isFavorite(item)"
                >
                  mdi-heart
                </v-icon>
                {{ item.favorites.length }}
              </nobr>
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination
              v-if="readyToShow && this.$store.state.uploadContents.length > 10"
              color="orange"
              v-model="page"
              :length="pageCount"
            ></v-pagination
            ><br />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-container> </v-container>
      <v-row>
        <Not-exist-dialog />
        <Ranking-guidance-dialog />
      </v-row> </v-container
    ><br /><br /><br /><br />
    <Footer />
  </div>
</template>

<script>
import firebase from "firebase";
import Header from "../components/Header.vue";
import SearchCard from "../components/SearchCard.vue";
import Loading from "../components/Loading.vue";
import NotExistDialog from "../components/NotExistDialog.vue";
import RankingGuidanceDialog from "../components/RankingGuidanceDialog";
import Footer from "../components/Footer.vue";
export default {
  components: {
    Header,
    Loading,
    NotExistDialog,
    RankingGuidanceDialog,
    SearchCard,
    Footer,
  },
  data() {
    return {
      a: null,
      image: "",
      completeLogin: false,
      disable: false,
      pageCount: 0,
      itemsPerPage: 10,
      loading: true,
      readyToShow: false,
      headers: [
        { text: "", value: "genreName", width: "25%" },
        { text: "投稿日時", value: "uploadDate", width: "10%" },
        { text: "ユーザー名", value: "uploadUserName", width: "13%" },
        { text: "タイトル", value: "title", width: "20%" },
        { text: "ドリンク", value: "drinkName", width: "30%" },
        { text: "", value: "action", width: "2%" },
      ],
      submittedArticle: {
        title: "",
        description: "",
        image: null,
      },
    };
  },
  mounted() {},
  async created() {
    await firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const myFavoriteGenreIds = await this.$store.dispatch(
          "getMyFavoriteGenreId",
          user.uid
        );
        this.completeLogin = true;
        if (this.$store.state.uploadContents.length === 0) {
          if (myFavoriteGenreIds.length > 0) {
            this.$store.state.keywordType = "4";
            await this.$store.dispatch(
              "getRecommendedUploadContents",
              myFavoriteGenreIds
            );
          } else {
            await this.$store.dispatch("getThisWeekUploadContents");
          }
        }
      } else {
        this.deleteLoginUser();
      }
      this.loading = false;
      this.readyToShow = true;
    });
  },
  methods: {
    selected(item) {
      this.$store.state.selectedUser.uid = item.uploadUserId;
      if (localStorage.userName) {
        localStorage.userName = "";
        localStorage.userName = item.uploadUserName;
      } else {
        localStorage.userName = item.uploadUserName;
      }
      if (this.$store.state.loginUser.uid === item.uploadUserId) {
        this.$router.push({ name: "Mypage" });
      } else if (this.$store.state.loginUser.uid != item.uploadUserId) {
        this.$router.push({
          name: "Userpage",
          query: { uid: item.uploadUserId },
        });
      }
    },
    switchRankingDialog() {
      this.$store.commit("switchRankingDialog");
    },
    getDay(beforeDay) {
      let date = new Date();
      date.setDate(date.getDate() - beforeDay);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let dayOfWeek = date.getDay();
      if (dayOfWeek === 0) {
        dayOfWeek = "日";
      } else if (dayOfWeek === 1) {
        dayOfWeek = "月";
      } else if (dayOfWeek === 2) {
        dayOfWeek = "火";
      } else if (dayOfWeek === 3) {
        dayOfWeek = "水";
      } else if (dayOfWeek === 4) {
        dayOfWeek = "木";
      } else if (dayOfWeek === 5) {
        dayOfWeek = "金";
      } else if (dayOfWeek === 6) {
        dayOfWeek = "土";
      }
      month < 10 ? (month = "0" + month) : "";
      day < 10 ? (day = "0" + day) : "";
      return `${month}/${day} (${dayOfWeek})`;
    },
    async toDetail(row) {
      await this.$store.dispatch("getItems");
      const selected = row;
      const fromTopPageAccess = true;
      this.$store.dispatch("setUploadContentDetail", {
        selected,
        fromTopPageAccess,
      });
      this.$store.subscribe((mutation) => {
        if (mutation.type === "setUploadContentDetail") {
          this.$router.push("/detail", () => {});
        }
      });
    },

    async search() {
      this.loading = true;
      this.readyToShow = false;

      if (this.type === "-1") {
        await this.$store.dispatch("getThisWeekUploadContents");
      } else if (this.type === "0" && this.drinkIds.length === 1) {
        let ids = [this.drinkIds[0].id];
        await this.$store.dispatch("searchUploadContentsWith1ItemId", {
          itemIds: ids,
        });
      } else if (this.type === "0" && this.drinkIds.length === 2) {
        let ids = [this.drinkIds[0].id, this.drinkIds[1].id];
        await this.$store.dispatch("searchUploadContentsWith2ItemId", {
          itemIds: ids,
        });
      } else if (this.type === "0" && this.drinkIds.length === 3) {
        let ids = [
          this.drinkIds[0].id,
          this.drinkIds[1].id,
          this.drinkIds[2].id,
        ];
        await this.$store.dispatch("searchUploadContentsWith3ItemId", {
          itemIds: ids,
        });
      } else if (this.type === "1") {
        await this.$store.dispatch("searchUploadContentsWithUserName", {
          userName: this.$store.state.keywordOfUserName,
        });
      } else if (this.type === "2") {
        const startDate = new Date(this.startDate);
        let endDate;
        this.endDate === null
          ? (endDate = new Date())
          : (endDate = new Date(this.endDate));
        await this.$store.dispatch("searchUploadContentsWithDate", {
          startDate: startDate,
          endDate: endDate,
        });
      } else if (this.type === "3") {
        await this.$store.dispatch("searchUploadContentsWithTitle", {
          keyword: this.$store.state.keyword,
        });
      } else if (this.type === "4") {
        let myFavoriteGenreId = new Array();
        for (let genre of this.$store.state.myFavoriteGenreIds) {
          myFavoriteGenreId.push(genre.id);
        }
        await this.$store.dispatch(
          "getRecommendedUploadContents",
          myFavoriteGenreId
        );
      } else if (this.type === "5") {
        let genreIds = [];
        if (this.$store.state.genreForSearch.length > 0) {
          for (let genre of this.$store.state.genreForSearch) {
            genreIds.push(genre.id);
          }
          await this.$store.dispatch("getUploadContentsWithGenreId", genreIds);
        } else {
          await this.$store.dispatch("searchUploadContentsWithTitle", {
            keyword: this.$store.state.keyword,
          });
        }
      }
      this.loading = false;
      this.readyToShow = true;
    },
    async switchFavorite(item) {
      const map = {
        userId: this.uid,
        date: new Date(),
        userName: this.userName,
        read: false,
      };
      const id = item.contentId;
      let count = 0;
      for (var fav of item.favorites) {
        if (fav.userId === this.uid) {
          count += 1;
          break;
        }
      }
      if (count === 0) {
        item.favorites.push(map);
        this.$store.dispatch("addFavorite", { contentId: id, favorite: map });
      } else {
        var index = item.favorites.findIndex(
          ({ userId }) => userId === this.uid
        );
        await this.$store.dispatch("deleteFavorite", {
          contentId: id,
          userId: this.uid,
        });
        item.favorites.splice(index, 1);
      }
    },
    isFavorite(item) {
      for (var fav of item.favorites) {
        if (fav.userId === this.uid) {
          return "favorite";
        }
      }
      return "";
    },
  },
  filters: {
    formatDate(value) {
      const date = new Date(value);
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      month < 10 ? (month = "0" + month) : "";
      day < 10 ? (day = "0" + day) : "";
      hour < 10 ? (hour = "0" + hour) : "";
      minute < 10 ? (minute = "0" + minute) : "";
      return `${year}/${month}/${day} (${hour}:${minute})`;
    },
    formatPrice(value) {
      return value.toLocaleString();
    },
  },
  computed: {
    uid() {
      return this.$store.getters.uid;
    },
    userName() {
      return this.$store.getters.userName;
    },
    type() {
      return this.$store.state.keywordType;
    },
    drinkIds() {
      return this.$store.state.itemId;
    },
    startDate() {
      return this.$store.state.startDate;
    },
    endDate() {
      return this.$store.state.endDate;
    },
    page: {
      get() {
        return this.$store.state.page;
      },
      set(page) {
        this.$store.dispatch("switchPage", page);
      },
    },
  },
};
</script>
<style>
#guidance_icon {
  position: relative;
  bottom: 5px;
}
.rank {
  margin-top: 5px;
  width: 60px;
  height: 45px;
}
.top-data .v-data-table-header tr {
  background: #d8b57f !important;
}
.multiselect__content {
  display: none;
}
.my-awesome-table {
  table-layout: fixed;
}
</style>
<style scoped>
#data-table {
  background-color: beige;
}
.favorite {
  color: pink;
}
#week {
  font-family: "Yu Gothic", "游ゴシック", YuGothic, "游ゴシック体";
  font-weight: bold;
}
</style>
<style></style>
