<template>
  <div>
    <Header />
    <v-container fluid>
      <v-row>
        <v-col offset="5" cols="2" v-if="readyToShow">
          {{ userName }}さんの投稿
        </v-col>
      </v-row>
      <v-row>
        <v-col offset="2" cols="8" v-if="readyToShow">
          <v-data-table
            :headers="headers1"
            :items="itemData"
            @click:row="toDetail"
            :page.sync="uploadPage"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="uploadPageCount = $event"
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
                  >mdi-heart</v-icon
                >
                {{ item.favorites.length }}
              </nobr>
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination
              v-if="readyToShow"
              color="orange"
              v-model="uploadPage"
              :length="uploadPageCount"
            ></v-pagination
            ><br />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col offset="5" cols="2" v-if="readyToShow">
          {{ userName }}さんのいいね
        </v-col>
      </v-row>
      <v-row>
        <v-col offset="2" cols="8">
          <Loading v-if="loading"></Loading>
          <v-data-table
            v-if="readyToShow"
            :headers="headers2"
            :items="this.$store.getters.filteredOthersFavoriteContents"
            @click:row="toDetail"
            :page.sync="favoritePage"
            :items-per-page="itemsPerPage"
            hide-default-footer
            @page-count="favoritePageCount = $event"
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
                class="userLink"
                href="#"
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
                  >mdi-heart</v-icon
                >
                {{ item.favorites.length }}
              </nobr>
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination
              v-if="readyToShow"
              color="orange"
              v-model="favoritePage"
              :length="favoritePageCount"
            ></v-pagination
            ><br />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <Not-exist-dialog />
        <!--既に削除された投稿内容を押下した時に表示される警告文-->
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import { mapActions } from "vuex";
import Loading from "../components/Loading.vue";
import NotExistDialog from "../components/NotExistDialog";
export default {
  components: {
    Header,
    Loading,
    NotExistDialog,
  },
  data() {
    return {
      loading: true,
      readyToShow: false,
      itemData: [],
      favoriteData: [],
      headers1: [
        { text: "", value: "genreName" },
        { text: "投稿日時", value: "uploadDate" },
        { text: "タイトル", value: "title" },
        { text: "ドリンク", value: "drinkName" },
        { text: "いいね", value: "action" },
      ],
      headers2: [
        { text: "", value: "genreName", width: "25%" },
        { text: "投稿日時", value: "uploadDate", width: "10%" },
        { text: "ユーザー名", value: "uploadUserName", width: "13%" },
        { text: "タイトル", value: "title", width: "20%" },
        { text: "ドリンク", value: "drinkName", width: "30%" },        
        { text: "いいね", value: "action", width: "2%" },
      ],
      uid: this.$store.getters.othersUid,
      userName: "",
      name: "",
      favoritePageCount: 0,
      uploadPageCount: 0,
      itemsPerPage: 5,
    };
  },
  filters: {
    formatDate(dateTime) {
      const date = new Date(dateTime);
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
  },
  methods: {
    ...mapActions(["getOthersUploadContents", "getOthersFavoriteContents"]),
    async toDetail(data) {
      const selected = data;
      const fromA = false;
      this.$store.dispatch("setUploadContentDetail", { selected, fromA });
      this.$store.subscribe((mutation) => {
        if (mutation.type === "setUploadContentDetail") {
          this.$router.push("/detail", () => {});
        }
      });
      // this.$router.push('/detail')
    },
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
        this.$router.push(
          { name: "Userpage", query: { uid: item.uploadUserId } },
          () => {}
        );
      }
    },
    async switchFavorite(item) {
      const map = {
        userId: this.myUid,
        date: new Date(),
        userName: this.myUserName,
        read: false,
      };
      const id = item.contentId;
      let count = 0;
      for (var fav of item.favorites) {
        if (fav.userId === this.myUid) {
          count += 1;
          break;
        }
      }
      if (count === 0) {
        item.favorites.push(map);
        this.$store.dispatch("addFavorite", { contentId: id, favorite: map });
      } else {
        const index = item.favorites.findIndex(
          ({ userId }) => userId === this.myUid
        );
        await this.$store.dispatch("deleteFavorite", {
          contentId: id,
          userId: this.myUid,
        });
        item.favorites.splice(index, 1);
      }
    },
    isFavorite(item) {
      for (var fav of item.favorites) {
        if (fav.userId === this.myUid) {
          return "favorite";
        }
      }
      return "";
    },
  },
  async created() {
    this.$store.state.uploadPage = 1;
    this.$store.state.favoritePage = 1;
    this.$store.state.selectedUser.uid = this.$route.query.uid;
    await this.getOthersUploadContents(this.$route.query.uid);
    await this.getOthersFavoriteContents();
    this.itemData = this.$store.state.othersUploadContents;
    await this.$store.dispatch("getItems");
    this.userName = localStorage.userName;
    this.loading = false;
    this.readyToShow = true;
  },
  computed: {
    myUid() {
      return this.$store.getters.uid;
    },
    myUserName() {
      return this.$store.getters.userName;
    },
    uploadPage: {
      get() {
        return this.$store.state.uploadPage;
      },
      set(page) {
        this.$store.dispatch("switchMyPage", { isUploaded: true, num: page });
      },
    },
    favoritePage: {
      get() {
        return this.$store.state.favoritePage;
      },
      set(page) {
        this.$store.dispatch("switchMyPage", { isUploaded: false, num: page });
      },
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    async $route(to, from) {
      this.loading = true;
      this.readyToShow = false;
      this.$store.state.uploadPage = 1;
      this.$store.state.favoritePage = 1;
      this.$route.query.uid = to.query.uid;
      await this.getOthersUploadContents(this.$route.query.uid);
      await this.getOthersFavoriteContents();
      this.itemData = this.$store.state.othersUploadContents;
      await this.$store.dispatch("getItems");
      this.userName = localStorage.userName;
      this.loading = false;
      this.readyToShow = true;
    },
  },
};
</script>

<style scoped>
.favorite {
  color: pink;
}
</style>
