<template>
  <div>
    <Header />
    <v-container fluid>
      <v-row>
        <v-snackbar
          rounded="pill"
          color="orange"
          top
          absolute
          v-model="addFavGenreSnackbar"
          :timeout="1500"
        >
          登録しました。
        </v-snackbar>
        <v-col offset="4" cols="5">
          <label class="typo__label word">お気に入りジャンル</label>
          <div class="favorite-genre">
            <multiselect
              v-model="$store.state.myFavoriteGenreIds"
              :options="$store.state.genres"
              placeholder="ジャンルを選択"
              label="name"
              :multiple="true"
              track-by="id"
              :select-label="''"
              :selected-label="''"
              :deselect-label="''"
              :max="3"
            >
            </multiselect>
          </div>
        </v-col>
        <v-col
          ><br />
          <v-btn
            color="orange"
            style="color: white"
            @click="updateFavoriteGenres"
            :disabled="isDisabe"
            >登録
          </v-btn>
        </v-col>
      </v-row>

      <!-- <v-select v-model="$store.state.myFavoriteGenreIds" multiple :items="this.$store.state.genres" item-text="name"
          item-value="id"></v-select> -->
      <v-row>
        <v-col offset="5" cols="2" v-if="readyToShow">
          {{ userName }}さんの投稿
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="readyToShow" offset="2" cols="8">
          <v-data-table
            :headers="headers1"
            :items="this.$store.state.myUploadContents"
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
        <v-col v-if="readyToShow" offset="5" cols="2">
          {{ userName }}さんのいいね
        </v-col>
      </v-row>
      <v-row>
        <v-col offset="2" cols="8">
          <Loading v-if="loading"></Loading>
          <v-data-table
            v-if="readyToShow"
            :headers="headers2"
            :items="this.myFavoriteContents"
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
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import Header from "../components/Header.vue";
import { mapActions } from "vuex";
import Loading from "../components/Loading.vue";
import NotExistDialog from "../components/NotExistDialog";
import multiselect from "vue-multiselect";

export default {
  components: {
    Header,
    NotExistDialog,
    Loading,
    multiselect,
  },
  data() {
    return {
      addFavGenreSnackbar: false,
      isDisabe: true,
      loading: true,
      readyToShow: false,
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
        { text: "", value: "action", width: "2%" },
      ],
      favoritePageCount: 0,
      uploadPageCount: 0,
      itemsPerPage: 5,
    };
  },
  async created() {
    let thisUser;
    await firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        thisUser = user;
        this.setLoginUser(user);
        await this.$store.dispatch("getMyUploadContents");
      } else {
        this.deleteLoginUser();
      }
    });
    this.$store.state.uploadPage = 1;
    this.$store.state.favoritePage = 1;
    await this.$store.dispatch("getMyFavoriteContents");
    this.loading = false;
    this.readyToShow = true;
    await this.$store.dispatch("getMyFavoriteGenreId", thisUser.uid);
    await this.$store.dispatch("getGenres");
    this.isDisabe = false;
  },
  methods: {
    ...mapActions([
      "getMyUploadContents",
      "getMyFavoriteContents",
      "setLoginUser",
    ]),
    async toDetail(data) {
      await this.$store.dispatch("getItems");
      const selected = data;
      const fromMyPageAccess = true;
      this.$store.dispatch("setUploadContentDetail", {
        selected,
        fromMyPageAccess,
      });
      this.$store.subscribe((mutation) => {
        if (mutation.type === "setUploadContentDetail") {
          this.$router.push("/detail", () => {});
        }
      });
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
        this.$router.push({ name: "Mypage" }).catch(() => {});
      } else if (this.$store.state.loginUser.uid != item.uploadUserId) {
        this.$router.push({
          name: "Userpage",
          query: { uid: item.uploadUserId },
        });
      }
    },
    async updateFavoriteGenres() {
      this.isDisabe = true;
      let favoriteGenreIds = [];
      const userId = this.uid;
      for (let genre of this.a) {
        favoriteGenreIds.push(genre.id);
      }
      await this.$store.dispatch("updateMyFavoriteGenres", {
        uid: userId,
        genreIds: favoriteGenreIds,
      });
      this.isDisabe = false;
      this.addFavGenreSnackbar = true;
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
        await this.$store.dispatch("addFavorite", {
          contentId: id,
          favorite: map,
        });
        this.$store.state.myFavoriteContents.unshift(item);
      } else {
        const index = item.favorites.findIndex(
          ({ userId }) => userId === this.uid
        );
        await this.$store.dispatch("deleteFavorite", {
          contentId: id,
          userId: this.uid,
        });
        item.favorites.splice(index, 1);
        this.$store.dispatch("removeMyFavoriteContents", item.contentId);
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
  computed: {
    a() {
      return this.$store.state.myFavoriteGenreIds;
    },
    userName() {
      return this.$store.getters.userName;
    },
    uid() {
      return this.$store.getters.uid;
    },
    myFavoriteContents() {
      return this.$store.getters.filteredMyFavoriteContents;
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
};
</script>

<style scoped>
.favorite {
  color: pink;
}
.word {
  font-family: "Yu Gothic", "游ゴシック", YuGothic, "游ゴシック体";
}
</style>
<style>
.favorite-genre .multiselect__tag {
  background: orange;
}
.favorite-genre .multiselect__option--highlight {
  background: orange;
}
.favorite-genre .multiselect__tag-icon:focus,
.favorite-genre .multiselect__tag-icon:hover {
  background: orange;
}
.favorite-genre .multiselect__tag-icon:after {
  color: rgb(255, 68, 0);
}
</style>
