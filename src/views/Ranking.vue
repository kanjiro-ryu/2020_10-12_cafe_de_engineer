<template>
  <div>
    <Header />
    <v-container fluid>
      <v-row v-if="isRankingTable">
        <v-col offset="5" cols="4" id="week">
          {{ getDay(30) }} ～ {{ getDay(1) }} のランキング
          <v-btn
            id="guidance_icon"
            icon
            dense
            outlined
            @click="switchRankingDialog"
          >
            <v-icon>mdi-comment-question-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="this.loading"> <br /><br /><Loading /> </v-col>
        <v-col
          class="top-data"
          offset="1"
          cols="10"
          id="data-table"
          v-if="readyToShow"
        >
          <v-data-table
            hide-default-footer
            :headers="rankingHeaders"
            :items="this.$store.getters.rankings"
            @click:row="toDetail"
          >
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
            <template v-slot:[`item.genreName`]="{ item }">
              <span v-for="genre in item.genreName" :key="genre">
                <v-chip dark x-small color="orange">{{ genre }}</v-chip>
              </span>
            </template>
            <template v-slot:[`item.rank`]="{ item }">
              <img
                v-if="item.rank === '1'"
                src="../assets/f3-1.png"
                class="rank"
              />
              <img
                v-if="item.rank === '2'"
                src="../assets/f3-2.png"
                class="rank"
              />
              <img
                v-if="item.rank === '3'"
                src="../assets/f3-3.png"
                class="rank"
              />
              <span class="rank-4-5" v-if="item.rank === '4'"
                >{{ item.rank }}<span style="font-size:20px">th</span></span
              >
              <span class="rank-4-5" v-if="item.rank === '5'"
                >{{ item.rank }}<span style="font-size:20px">th</span></span
              >
            </template>
            <template v-slot:[`item.uploadDate`]="{ item }">
              {{ item.uploadDate | formatDate }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <Not-exist-dialog />
        <Ranking-guidance-dialog />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Loading from "../components/Loading.vue";
import NotExistDialog from "../components/NotExistDialog.vue";
import RankingGuidanceDialog from "../components/RankingGuidanceDialog";
export default {
  components: {
    Header,
    Loading,
    NotExistDialog,
    RankingGuidanceDialog,
  },
  async created() {
    await this.$store.dispatch("getRankingContents");
    this.loading = false;
    this.readyToShow = true;
  },
  data() {
    return {
      pageCount: 0,
      itemsPerPage: 10,
      loading: true,
      readyToShow: false,
      isRankingTable: true,
      rankingHeaders: [
        { text: "", value: "rank", width: "1%" },
        { text: "タグ", value: "genreName", width: "10%" },
        { text: "投稿日", value: "uploadDate", width: "12%" },
        { text: "ユーザー", value: "uploadUserName", width: "15%" },
        { text: "タイトル", value: "title", width: "23%" },
        { text: "ドリンク", value: "drinkName", width: "30%" },
        { text: "いいね数", value: "favoriteCounts", width: "9%" },
      ],
    };
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
      const fromRankingPageAccess = true;
      this.$store.dispatch("setUploadContentDetail", {
        selected,
        fromRankingPageAccess,
      });
      this.$store.subscribe((mutation) => {
        if (mutation.type === "setUploadContentDetail") {
          this.$router.push("/detail", () => {});
        }
      });
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
.rank-4-5 {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 200%;
  margin-left: 17px;
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
