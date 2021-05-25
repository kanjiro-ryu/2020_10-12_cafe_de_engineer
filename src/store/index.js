import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: false,
    loginUser: null,
    uploadContentDetail: {},
    myUploadContents: [],
    myFavoriteContents: [],
    items: [{ drinks: [] }, { others: [] }],
    place: [
      { id: 0, name: "自宅" },
      { id: 1, name: "本社" },
      { id: 2, name: "現場" },
    ],
    doTime: [
      { id: 0, name: "始業前" },
      { id: 1, name: "昼食後" },
      { id: 2, name: "夕方" },
    ],
    //投稿確認用データ
    uploadCheckData: {},
    //投稿確認用ダイアログ
    uploadCheckDialogStatus: false,
    //投稿エラー警告用ダイアログ
    uploadErrorDialogStatus: false,
    //投稿完了ダイアログ
    uploadCompletedDialogStatus: false,
    //削除完了スナックバー
    deletedSnackbarStatus: false,
    //コメント削除完了スナックバー
    commentDeletedSnackbarStatus: false,
    //編集完了スナックバー
    updatedSnackbarStatus: false,
    //コメント完了スナックバー
    commentedSnackbarStatus: false,
    //キャンセルスナックバー
    cancelSnackbarStatus: false,
    //削除確認ダイアログ
    deleteCheckDialogStatus: false,
    //コメント削除確認ダイアログ
    deleteCommentCheckDialogStatus: false,
    //編集ダイアログ
    updateDialogStatus: false,
    //編集確認ダイアログ
    updateCheckDialogStatus: false,
    //コメントダイアログ
    commentDialogStatus: false,
    //コメント確認ダイアログ
    commentCheckDialogStatus: false,
    //コメント警告ダイアログ
    commentAlertDialog: false,
    docExistsStatus: false,
    selectedUser: { uid: "", displayName: "" },
    othersUploadContents: [],
    othersFavoriteContents: [],
    myActivities: [],
    commentList: [],
    favoriteList: [],
    notificationCount: 0,
    genres: [],
    // <top画面で使う>
    startDate: null,
    endDate: null,
    uploadContents: [],
    selectedOrder: "uploadDate",
    descOrAsc: "desc",
    bigDrinkCategory: [],
    middleDrinkCategory: [],
    drinks: [],
    bigOtherCategory: [],
    middleOtherCategory: [],
    others: [],
    keywordType: "-1",
    keyword: "",
    keywordOfUserName: "",
    bigDrinkCategoryId: null,
    middleDrinkCategoryId: null,
    itemId: [],
    myFavoriteGenreIds: [],
    genreForSearch: [],
    selectedOrders: { text: "新規順", value: "0" },
    page: 1,
    // </top画面で使う>
    commentListPage: 1, //詳細画面のコメントリストに使用
    delCommentListPage: 1, //詳細画面のコメントリストに使用
    // <ランキング画面で使う>
    rankings: [],
    isOpenRankingDailog: false,
    uploadPage: 1,
    favoritePage: 1,
    activities: [],
    othersCommentList: [],
  },
  mutations: {
    setLoginUser(state, user) {
      state.loginUser = user;
    },
    deleteLoginUser(state) {
      state.loginUser = null;
    },
    setUploadContents(state, content) {
      state.uploadContents = content;
    },
    cleanUploadContents(state) {
      state.uploadContents = [];
    },
    setMyFavoriteGenreIds(state, genreIds) {
      state.myFavoriteGenreIds = new Array();
      state.myFavoriteGenreIds = genreIds;
    },
    setBigDrinkCategory(state, category) {
      state.bigDrinkCategory.push(category);
    },
    resetBigDrinkCategory(state) {
      state.bigDrinkCategory = [];
    },
    setMiddleDrinkCategory(state, category) {
      state.middleDrinkCategory.push(category);
    },
    resetMiddleDrinkCategory(state) {
      state.middleDrinkCategory = [];
    },
    setDrinks(state, drink) {
      state.drinks.push(drink);
    },
    resetDrinks(state) {
      state.drinks = [];
    },
    setBigOtherCategory(state, category) {
      state.bigOtherCategory.push(category);
    },
    resetBigOtherCategory(state) {
      state.bigOtherCategory = [];
    },
    setMiddleOtherCategory(state, category) {
      state.middleOtherCategory.push(category);
    },
    resetMiddleOtherCategory(state) {
      state.middleOtherCategory = [];
    },
    setOthers(state, other) {
      state.others.push(other);
    },
    resetOthers(state) {
      state.others = [];
    },
    deleteMyUploadContent(state, payload) {
      const index = state.uploadContents.findIndex(
        (v) => v.contentId === payload.docId
      );
      state.uploadContents.splice(index, 1);
    },
    updateMyUploadContent(state, payload) {
      if (state.uploadContentDetail.length !== 0) {
        if (state.uploadContents.length !== 0) {
          const index = state.uploadContents.findIndex(
            (v) => v.contentId === payload.docId
          );
          //取得している投稿一覧の中に更新する投稿がある場合（おすすめとか検索とかで既に取得していた場合）
          if (index !== -1) {
            state.uploadContents[index].title = payload.title;
            state.uploadContents[index].comment = payload.comment;
          }
        }
        state.uploadContentDetail.title = payload.title;
        state.uploadContentDetail.comment = payload.comment;
      }
    },
    setUploadCheckData(state, uploadCheckData) {
      state.uploadCheckData = uploadCheckData;
    },
    resetUploadCheckData(state) {
      state.uploadCheckData = [];
    },
    setUploadCheckDialogStatus(state) {
      state.uploadCheckDialogStatus = true;
    },
    switchUploadCheckDialogStatus(state) {
      state.uploadCheckDialogStatus = false;
    },
    setUploadErrorDialogStatus(state) {
      state.uploadErrorDialogStatus = true;
    },
    switchUploadErrorDialogStatus(state) {
      state.uploadErrorDialogStatus = false;
    },
    setUploadCompletedDialogStatus(state) {
      state.uploadCompletedDialogStatus = true;
    },
    switchUploadCompletedDialogStatus(state) {
      state.uploadCompletedDialogStatus = false;
    },
    setDeleteCheckDialogStatus(state) {
      state.deleteCheckDialogStatus = true;
    },
    switchDeleteCheckDialogStatus(state) {
      state.deleteCheckDialogStatus = false;
    },
    setUpdateDialogStatus(state) {
      state.updateDialogStatus = true;
    },
    switchUpdateDialogStatus(state) {
      state.updateDialogStatus = false;
    },
    setUpdateCheckDialogStatus(state) {
      state.updateCheckDialogStatus = true;
    },
    switchUpdateCheckDialogStatus(state) {
      state.updateCheckDialogStatus = false;
    },
    setCommentDialogStatus(state) {
      state.commentDialogStatus = true;
    },
    switchCommentDialogStatus(state) {
      state.commentDialogStatus = false;
    },
    setCommentCheckDialogStatus(state) {
      state.commentCheckDialogStatus = true;
    },
    switchCommentCheckDialogStatus(state) {
      state.commentCheckDialogStatus = false;
    },
    setCommentAlertDialog(state) {
      state.commentAlertDialog = true;
    },
    switchCommentAlertDialog(state) {
      state.commentAlertDialog = false;
    },
    setDeleteCommentCheckDialogStatus(state) {
      state.deleteCommentCheckDialogStatus = true;
    },
    switchDeleteCommentCheckDialogStatus(state) {
      state.deleteCommentCheckDialogStatus = false;
    },
    switchSearchOrder(state, order) {
      state.selectedOrder = order.order;
      state.descOrAsc = order.descOrAsc;
    },
    setDocExistsStatus(state) {
      state.docExistsStatus = true;
    },
    switchAlertStatus(state) {
      state.docExistsStatus = false;
    },
    setGenres(state, genres) {
      state.genres = genres;
    },
    setUploadContentDetail(state, payload) {
      const index = state.place.findIndex(
        (v) => v.id === payload.selected.placeId
      );
      const index1 = state.doTime.findIndex(
        (v) => v.id === payload.selected.doTimeId
      );
      const drinkList = new Array();
      const otherList = new Array();
      for (let i = 0; i < payload.selected.drinkId.length; i++) {
        const index = state.items.drinks.findIndex(
          (v) => v.id === payload.selected.drinkId[i]
        );
        const drinkName = state.items.drinks[index].name;
        drinkList.push({ name: drinkName });
      }
      for (let i = 0; i < payload.selected.otherList.length; i++) {
        const otherName = payload.selected.otherList[i];
        otherList.push({ name: otherName });
      }
      state.uploadContentDetail = {
        id: payload.selected.contentId,
        title: payload.selected.title,
        drinkList: drinkList,
        favorites: payload.selected.favorites,
        otherList: otherList,
        place: state.place[index].name,
        timeZone: state.doTime[index1].name,
        comment: payload.selected.comment,
        totalPrice: payload.selected.totalPrice,
        commentList: payload.selected.talks,
        uploadUserId: payload.selected.uploadUserId,
        uploadUserName: payload.selected.uploadUserName,
        fromTopPageAccess: payload.fromTopPageAccess,
        fromRankingPageAccess: payload.fromRankingPageAccess,
        fromMyPageAccess: payload.fromMyPageAccess,
      };
    },
    addTalk(state, payload) {
      state.uploadContentDetail.commentList.push(payload.commentNewData);
    },
    deleteTalk(state, payload) {
      const index = state.uploadContentDetail.commentList.findIndex(
        (v) => v.id === payload.deleteTargetId
      );
      state.uploadContentDetail.commentList.splice(index, 1);
    },
    setDeletedSnackbarStatus(state) {
      state.deletedSnackbarStatus = true;
    },
    switchDeletedSnackbarStatus(state) {
      state.deletedSnackbarStatus = false;
    },
    setCommentDeletedSnackbarStatus(state) {
      state.commentDeletedSnackbarStatus = true;
    },
    switchCommentDeletedSnackbarStatus(state) {
      state.commentDeletedSnackbarStatus = false;
    },
    setUpdatedSnackbarStatus(state) {
      state.updatedSnackbarStatus = true;
    },
    switchUpdatedSnackbarStatus(state) {
      state.updatedSnackbarStatus = false;
    },
    setCommentedSnackbarStatus(state) {
      state.commentedSnackbarStatus = true;
    },
    switchCommentedSnackbarStatus(state) {
      state.commentedSnackbarStatus = false;
    },
    setCancelSnackbarStatus(state) {
      state.cancelSnackbarStatus = true;
    },
    switchCancelSnackbarStatus(state) {
      state.cancelSnackbarStatus = false;
    },
    resetMyUploadContents(state) {
      state.myUploadContents = [];
    },
    setMyUploadContents(state, uploadContents) {
      state.myActivities = [];
      state.favoriteList = [];
      state.commentList = [];
      state.myUploadContents = uploadContents;
    },
    resetMyFavoriteContents(state) {
      state.myFavoriteContents = [];
    },
    setMyFavoriteContents(state, myFavoriteContents) {
      state.myFavoriteContents = myFavoriteContents;
    },
    setRanking(state, con) {
      state.rankings.push(con);
    },
    cleanRanking(state) {
      state.rankings = [];
    },
    resetItemsDrinks(state) {
      state.items.drinks = [];
    },
    setItemsDrinks(state, payload) {
      state.items.drinks.push({
        id: payload.id,
        name: payload.name,
        parentId: payload.parentId,
      });
    },
    resetItemsOthers(state) {
      state.items.others = [];
    },
    setItemsOthers(state, payload) {
      state.items.others.push({
        id: payload.id,
        name: payload.name,
        parentId: payload.parentId,
      });
    },
    resetOthersUploadContents(state) {
      state.othersUploadContents = [];
    },
    setOthersUploadContents(state, { othersUploadContents }) {
      state.othersUploadContents = othersUploadContents;
    },
    resetOthersFavoriteContents(state) {
      state.othersFavoriteContents = [];
    },
    setOthersFavoriteContents(state, { othersFavoriteContents }) {
      state.othersFavoriteContents = othersFavoriteContents;
    },
    switchPage(state, num) {
      state.page = num;
    },
    switchMyPage(state, arg) {
      if (arg.isUploaded === true) {
        state.uploadPage = arg.num;
      } else {
        state.favoritePage = arg.num;
      }
    },
    switchCommentListPage(state, num) {
      state.commentListPage = num;
    },
    switchDelCommentListPage(state, num) {
      state.delCommentListPage = num;
    },
    switchRankingDialog(state) {
      state.isOpenRankingDailog = !state.isOpenRankingDailog;
    },
    setMyActivities(state, payload) {
      const activities = [];
      var activity = {};
      for (var content of payload.myContents) {
        for (var favorite of content.favorites) {
          activity = {};
          activity.day = favorite.date;
          activity.userName = favorite.userName;
          activity.userId = favorite.userId;
          activity.read = favorite.read;
          activity.type = "favorite";
          activity.contentId = content.contentId;
          activity.title = content.title;
          activity.contentUserId = content.uploadUserId;
          favorite.contentId = content.contentId;
          if (activity.userId != state.loginUser.uid) {
            activities.push(activity);
          }
          state.favoriteList.push(favorite);
        }
        for (let comment of content.talks) {
          activity = {};
          activity.day = comment.dateTime;
          activity.userName = comment.fromUserName;
          activity.userId = comment.fromUserId;
          activity.toUserId = comment.toUserId;
          activity.read = comment.read;
          activity.commentRead = comment.commentRead;
          activity.type = "comment";
          activity.contentId = content.contentId;
          activity.title = content.title;
          activity.contentUserId = content.uploadUserId;
          comment.contentId = content.contentId;
          if (activity.userId != state.loginUser.uid) {
            activities.push(activity);
          }
          state.commentList.push(comment);
        }
      }

      for (var othersContent of payload.othersContents) {
        for (let comment of othersContent.talks) {
          activity = {};
          activity.day = comment.dateTime;
          activity.userName = comment.fromUserName;
          activity.userId = comment.fromUserId;
          activity.toUserId = comment.toUserId;
          activity.read = comment.read;
          activity.commentRead = comment.commentRead;
          activity.type = "othersComment";
          activity.contentId = othersContent.contentId;
          activity.title = othersContent.title;
          activity.contentUserId = othersContent.uploadUserId;
          comment.contentId = othersContent.contentId;
          if (activity.toUserId === payload.uid) {
            activities.push(activity);
          }
          state.othersCommentList.push(comment);
        }
      }
      activities.sort(function(a, b) {
        if (a.day > b.day) {
          return -1;
        } else {
          return 1;
        }
      });
      state.notificationCount = 0;
      for (var act of activities) {
        if ((act.type === "comment" || act.type === "favorite") && !act.read) {
          state.notificationCount += 1;
        } else if (
          act.type === "othersComment" &&
          act.toUserId === state.loginUser.uid &&
          act.contentUserId != state.loginUser.uid &&
          !act.commentRead
        ) {
          state.notificationCount += 1;
        }
      }
      state.activities = activities;
    },
  },
  actions: {
    login() {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(google_auth_provider);
    },
    logout() {
      firebase.auth().signOut();
    },
    setLoginUser({ commit }, user) {
      commit("setLoginUser", user);
    },
    deleteLoginUser({ commit }) {
      commit("deleteLoginUser");
    },
    switchPage({ commit }, num) {
      commit("switchPage", num);
    },
    switchMyPage({ commit }, arg) {
      commit("switchMyPage", arg);
    },
    cleanUploadContents({ commit }) {
      commit("cleanUploadContents");
    },
    async getBigDrinkCategory({ commit }) {
      await firebase
        .firestore()
        .collection("sample-big-drink-category")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) =>
          snapshot.forEach((doc) => {
            let category = doc.data();
            category.id = doc.id;
            commit("setBigDrinkCategory", category);
          })
        );
    },
    async getMiddleDrinkCategory({ commit }, item) {
      await firebase
        .firestore()
        .collection("sample-middle-drink-category")
        .where("parentId", "==", item.id)
        .orderBy("name", "asc")
        .get()
        .then((snapshot) =>
          snapshot.forEach((doc) => {
            let category = doc.data();
            category.id = doc.id;
            commit("setMiddleDrinkCategory", category);
          })
        );
    },
    async getDrinks({ commit }, item) {
      await firebase
        .firestore()
        .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
        .where("parentId", "==", item.id)
        .orderBy("name", "asc")
        .get()
        .then((snapshot) =>
          snapshot.forEach((doc) => {
            let drink = doc.data();
            drink.id = doc.id;
            commit("setDrinks", drink);
          })
        );
    },
    async getThisWeekUploadContents({ commit }) {
      let uploadContent = [];
      const today = new Date();
      let lastWeekToday = new Date();
      lastWeekToday.setDate(lastWeekToday.getDate() - 7);
      await firebase
        .firestore()
        .collection("upload-contents")
        .where("uploadDate", ">=", lastWeekToday)
        .where("uploadDate", "<=", today)
        .orderBy("uploadDate", "desc")
        .limit(100)
        .get()
        .then((snapshot) =>
          snapshot.forEach((doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  content.drinkName.push(doc.data().name);
                });
              });
            if (content.genreId.length > 0) {
              firebase
                .firestore()
                .collection("genres")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.genreId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.genreName.push(doc.data().name);
                  });
                });
            }
            content = JSON.parse(JSON.stringify(content));
            uploadContent.push(content);
          })
        );
      commit("setUploadContents", uploadContent);
    },
    async getRecommendedUploadContents({ commit }, genreIds) {
      let uploadContent = new Array();
      await firebase
        .firestore()
        .collection("upload-contents")
        .where("genreId", "array-contains-any", genreIds)
        .orderBy("uploadDate", "desc")
        .limit(100)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  //content.drinkName += doc.data().name + '\n';
                  content.drinkName.push(doc.data().name);
                });
              });
            firebase
              .firestore()
              .collection("genres")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.genreId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  content.genreName.push(doc.data().name);
                });
              });
            content = JSON.parse(JSON.stringify(content));
            uploadContent.push(content);
          });
        });
      commit("setUploadContents", uploadContent);
    },
    async getMyFavoriteGenreId({ commit }, userId) {
      let myFavoriteGenreId = []; //nameありidあり
      let myFavoriteGenreIds = []; //idのみ
      await firebase
        .firestore()
        .collection("user-favorite-genre")
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            myFavoriteGenreId = doc.data().favoriteGenreIds;
            doc.data().favoriteGenreIds.forEach((id) => {
              let myFavoriteGenre = { id: id };
              firebase
                .firestore()
                .collection("genres")
                .doc(id)
                .get()
                .then((snapshot) => {
                  myFavoriteGenre.name = snapshot.data().name;
                });
              myFavoriteGenre = JSON.parse(JSON.stringify(myFavoriteGenre));
              myFavoriteGenreIds.push(myFavoriteGenre);
            });
          }
        });
      commit("setMyFavoriteGenreIds", myFavoriteGenreIds);
      return myFavoriteGenreId;
    },
    async getGenres({ commit }) {
      let genres = new Array();
      await firebase
        .firestore()
        .collection("genres")
        .orderBy("index", "asc")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let genre = doc.data();
            genre.id = doc.id;
            genres.push(genre);
          });
        });
      commit("setGenres", genres);
    },
    async getUploadContentsWithGenreId({ commit }, genreIds) {
      let uploadContent = new Array();
      await firebase
        .firestore()
        .collection("upload-contents")
        .where("genreId", "array-contains-any", genreIds)
        .orderBy("uploadDate", "desc")
        .limit(100)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  content.drinkName.push(doc.data().name);
                });
              });
            firebase
              .firestore()
              .collection("genres")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.genreId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  content.genreName.push(doc.data().name);
                });
              });
            content = JSON.parse(JSON.stringify(content));
            uploadContent.push(content);
          });
        });
      commit("setUploadContents", uploadContent);
    },
    async updateMyFavoriteGenres(dummy, arg) {
      await firebase
        .firestore()
        .collection("user-favorite-genre")
        .doc(arg.uid)
        .set({ favoriteGenreIds: arg.genreIds }, { merge: true });
    },
    async searchUploadContentsWith1ItemId({ commit, state }, item) {
      let uploadContent = [];
      let fieldName = "drinkId";
      const fire = firebase.firestore();

      await fire
        .collection("upload-contents")
        .where(fieldName, "array-contains", item.itemIds[0])
        .orderBy(state.selectedOrder, state.descOrAsc)
        .limit(100)
        .get()
        .then((snapshot) =>
          snapshot.forEach(async (doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  content.drinkName.push(doc.data().name);
                });
              });
            if (content.genreId.length > 0) {
              firebase
                .firestore()
                .collection("genres")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.genreId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.genreName.push(doc.data().name);
                  });
                });
            }
            content = JSON.parse(JSON.stringify(content));
            uploadContent.push(content);
          })
        );
      commit("setUploadContents", uploadContent);
    },
    async searchUploadContentsWith2ItemId({ commit, state }, item) {
      let uploadContent = [];
      let fieldName = "drinkId";
      const fire = firebase.firestore();

      await fire
        .collection("upload-contents")
        .where(fieldName, "array-contains", item.itemIds[0])
        .orderBy(state.selectedOrder, state.descOrAsc)
        .limit(100)
        .get()
        .then((snapshot) =>
          snapshot.forEach(async (doc) => {
            let content = doc.data();
            if (
              content.drinkId.indexOf(item.itemIds[1]) !== -1 ||
              content.otherId.indexOf(item.itemIds[1]) !== -1
            ) {
              content.contentId = doc.id;
              content.uploadDate = doc.data().uploadDate.toDate();
              content.drinkName = [];
              content.genreName = [];
              firebase
                .firestore()
                .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.drinkId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.drinkName.push(doc.data().name);
                  });
                });
              if (content.genreId.length > 0) {
                firebase
                  .firestore()
                  .collection("genres")
                  .where(
                    firebase.firestore.FieldPath.documentId(),
                    "in",
                    content.genreId
                  )
                  .get()
                  .then((snapshot) => {
                    snapshot.forEach((doc) => {
                      content.genreName.push(doc.data().name);
                    });
                  });
              }
              content = JSON.parse(JSON.stringify(content));
              uploadContent.push(content);
            }
          })
        );
      commit("setUploadContents", uploadContent);
    },
    async searchUploadContentsWith3ItemId({ commit, state }, item) {
      let uploadContent = [];
      let fieldName = "drinkId";
      const fire = firebase.firestore();

      await fire
        .collection("upload-contents")
        .where(fieldName, "array-contains", item.itemIds[0])
        .orderBy(state.selectedOrder, state.descOrAsc)
        .limit(100)
        .get()
        .then((snapshot) =>
          snapshot.forEach(async (doc) => {
            let content = doc.data();
            if (
              (content.drinkId.indexOf(item.itemIds[1]) !== -1 &&
                content.drinkId.indexOf(item.itemIds[2]) !== -1) ||
              (content.otherId.indexOf(item.itemIds[1]) !== -1 &&
                content.otherId.indexOf(item.itemIds[2]) !== -1)
            ) {
              content.contentId = doc.id;
              content.uploadDate = doc.data().uploadDate.toDate();
              content.drinkName = [];
              content.genreName = [];
              firebase
                .firestore()
                .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.drinkId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.drinkName.push(doc.data().name);
                  });
                });
              if (content.genreId.length > 0) {
                firebase
                  .firestore()
                  .collection("genres")
                  .where(
                    firebase.firestore.FieldPath.documentId(),
                    "in",
                    content.genreId
                  )
                  .get()
                  .then((snapshot) => {
                    snapshot.forEach((doc) => {
                      content.genreName.push(doc.data().name);
                    });
                  });
              }
              content = JSON.parse(JSON.stringify(content));
              uploadContent.push(content);
            }
          })
        );
      commit("setUploadContents", uploadContent);
    },
    async searchUploadContentsWithTitle({ commit }, item) {
      let uploadContent = [];
      const fire = firebase.firestore();
      await fire
        .collection("upload-contents")
        .orderBy("title")
        .startAt(item.keyword)
        .endAt(item.keyword + "\uf8ff")
        .limit(100)
        .get()
        .then((snapshot) => {
          snapshot.forEach(async (doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  content.drinkName.push(doc.data().name);
                });
              });
            if (content.genreId.length > 0) {
              firebase
                .firestore()
                .collection("genres")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.genreId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.genreName.push(doc.data().name);
                  });
                });
            }
            content = JSON.parse(JSON.stringify(content));
            uploadContent.push(content);
          });
          uploadContent.sort((a, b) => {
            if (a.uploadDate > b.uploadDate) return -1;
            if (a.uploadDate < b.uploadDate) return 1;
            return 0;
          });
        });
      commit("setUploadContents", uploadContent);
    },
    async searchUploadContentsWithUserName({ commit }, arg) {
      let uploadContent = [];
      const fire = firebase.firestore();
      await fire
        .collection("upload-contents")
        .orderBy("uploadUserName")
        .startAt(arg.userName)
        .endAt(arg.userName + "\uf8ff")
        .limit(100)
        .get()
        .then((snapshot) => {
          snapshot.forEach(async (doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  content.drinkName.push(doc.data().name);
                });
              });
            if (content.genreId.length > 0) {
              firebase
                .firestore()
                .collection("genres")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.genreId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.genreName.push(doc.data().name);
                  });
                });
            }
            content = JSON.parse(JSON.stringify(content));
            uploadContent.push(content);
          });
          uploadContent.sort((a, b) => {
            if (a.uploadDate > b.uploadDate) return -1;
            if (a.uploadDate < b.uploadDate) return 1;
            return 0;
          });
        });
      commit("setUploadContents", uploadContent);
    },
    async searchUploadContentsWithDate({ commit }, arg) {
      let uploadContent = [];
      const fire = firebase.firestore();
      await fire
        .collection("upload-contents")
        .where("uploadDate", ">=", arg.startDate)
        .where("uploadDate", "<=", arg.endDate)
        .orderBy("uploadDate")
        .limit(100)
        .get()
        .then((snapshot) => {
          snapshot.forEach(async (doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  content.drinkName.push(doc.data().name);
                });
              });
            if (content.genreId.length > 0) {
              firebase
                .firestore()
                .collection("genres")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.genreId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.genreName.push(doc.data().name);
                  });
                });
            }
            content = JSON.parse(JSON.stringify(content));
            uploadContent.push(content);
          });
          uploadContent.sort((a, b) => {
            if (a.uploadDate > b.uploadDate) return -1;
            if (a.uploadDate < b.uploadDate) return 1;
            return 0;
          });
        });
      commit("setUploadContents", uploadContent);
    },
    async setUploadContentDetail({ commit }, payload) {
      await firebase
        .firestore()
        .collection("upload-contents")
        .doc(payload.selected.contentId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            payload.selected.talks = [];
            let content = doc.data();
            for (let i = 0; i < content.talks.length; i++) {
              payload.selected.talks.push(content.talks[i]);
              payload.selected.talks[i].dateTime = content.talks[
                i
              ].dateTime.toDate();
            }
            commit("setUploadContentDetail", payload);
          } else {
            commit("setDocExistsStatus");
          }
        });
    },
    //投稿機能
    uploadContent(dummy, payload) {
      const upload = () => {
        firebase
          .firestore()
          .collection("upload-contents")
          .add({
            comment: payload.comment,
            doTimeId: payload.doTimeId,
            drinkId: payload.drinkId,
            favorites: payload.favorites,
            genreId: payload.genreId,
            otherList: payload.otherList,
            placeId: payload.placeId,
            talks: payload.talks,
            title: payload.title,
            totalPrice: payload.totalPrice,
            uploadDate: payload.uploadDate,
            uploadUserId: payload.uploadUserId,
            uploadUserName: payload.uploadUserName,
          });
      };
      upload();
    },
    async getMyUploadContents({ getters, commit }) {
      let myUploadContents = [];
      commit("resetMyUploadContents");
      await firebase
        .firestore()
        .collection("upload-contents")
        .where("uploadUserId", "==", getters.uid)
        .orderBy("uploadDate", "desc")
        .get()
        .then((snapshot) =>
          snapshot.forEach(async (doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  //content.drinkName += doc.data().name + '\n';
                  content.drinkName.push(doc.data().name);
                });
              });
            if (content.genreId.length > 0) {
              firebase
                .firestore()
                .collection("genres")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.genreId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.genreName.push(doc.data().name);
                  });
                });
            }
            for (var fav of content.favorites) {
              fav.date = fav.date.toDate();
            }
            for (var comment of content.talks) {
              comment.dateTime = comment.dateTime.toDate();
            }

            content = JSON.parse(JSON.stringify(content));
            myUploadContents.push(content);
            // commit("setMyUploadContents", myUploadContents);
          })
        );
      commit("setMyUploadContents", myUploadContents);
    },
    deleteMyUploadContent({ commit }, payload) {
      firebase
        .firestore()
        .collection("upload-contents")
        .doc(payload.docId)
        .delete()
        .then(() => {
          commit("deleteMyUploadContent", payload);
        });
    },
    async updateMyUploadContent({ commit }, payload) {
      await firebase
        .firestore()
        .collection("upload-contents")
        .doc(`${payload.docId}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            firebase
              .firestore()
              .collection("upload-contents")
              .doc(`${payload.docId}`)
              .update({
                comment: payload.comment,
                title: payload.title,
              });
            commit("updateMyUploadContent", payload);
          }
        });
    },
    async addFavorite(id, arg) {
      await firebase
        .firestore()
        .collection("upload-contents")
        .doc(arg.contentId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            arg.favorite.date = new Date(arg.favorite.date);
            firebase
              .firestore()
              .collection("upload-contents")
              .doc(arg.contentId)
              .update({
                favorites: firebase.firestore.FieldValue.arrayUnion(
                  arg.favorite
                ),
              });
          }
        });
    },
    async deleteFavorite(id, arg) {
      await firebase
        .firestore()
        .collection("upload-contents")
        .doc(arg.contentId)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            let content = doc.data();
            const index = content.favorites.findIndex(
              ({ userId }) => userId === arg.userId
            );
            let favorite = content.favorites[index];
            try {
              favorite.date = favorite.date.toDate();
              await firebase
                .firestore()
                .collection("upload-contents")
                .doc(arg.contentId)
                .update({
                  favorites: firebase.firestore.FieldValue.arrayRemove(
                    favorite
                  ),
                });
            } catch (error) {
              console.log(error);
            }
          }
        });
    },
    async addTalk({ commit }, payload) {
      await firebase
        .firestore()
        .collection("upload-contents")
        .doc(payload.docId)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            let commentNewData = {
              id: Math.random()
                .toString(36)
                .slice(-8),
              content: payload.commentData.content,
              dateTime: payload.commentData.dateTime,
              fromUserId: payload.commentData.fromUserId,
              fromUserName: payload.commentData.fromUserName,
              read: payload.commentData.read,
              toUserId: payload.commentData.toUserId,
              toUserName: payload.commentData.toUserName,
              commentRead: false,
            };
            await firebase
              .firestore()
              .collection("upload-contents")
              .doc(payload.docId)
              .update({
                talks: firebase.firestore.FieldValue.arrayUnion(commentNewData),
              });
            commit("addTalk", { commentNewData });
          }
        });
    },
    deleteTalk({ commit }, payload) {
      firebase
        .firestore()
        .collection("upload-contents")
        .doc(payload.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let uploadContentsDetail = doc.data();
            let index = uploadContentsDetail.talks.findIndex(
              ({ id }) => id === payload.deleteTargetId
            );
            let talk = uploadContentsDetail.talks[index];
            talk.dateTime = talk.dateTime.toDate();
            firebase
              .firestore()
              .collection("upload-contents")
              .doc(payload.id)
              .update({
                talks: firebase.firestore.FieldValue.arrayRemove(talk),
              });
          }
        })
        .then(() => {
          commit("deleteTalk", payload);
        });
    },
    async getMyFavoriteContents({ commit }) {
      let myFavoriteContents = [];
      commit("resetMyFavoriteContents");
      await firebase
        .firestore()
        .collection("upload-contents")
        .orderBy("uploadDate", "desc")
        .get()
        .then((snapshot) =>
          snapshot.forEach((doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  //content.drinkName += doc.data().name + '\n';
                  content.drinkName.push(doc.data().name);
                });
              });
            if (content.genreId.length > 0) {
              firebase
                .firestore()
                .collection("genres")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.genreId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.genreName.push(doc.data().name);
                  });
                });
            }
            content = JSON.parse(JSON.stringify(content));
            myFavoriteContents.push(content);
          })
        );
      commit("setMyFavoriteContents", myFavoriteContents);
    },
    removeMyFavoriteContents({ state }, id) {
      const index = state.myFavoriteContents.findIndex(
        ({ contentId }) => contentId === id
      );
      state.myFavoriteContents.splice(index, 1);
    },
    async getRankingContents({ commit }) {
      commit("cleanRanking");
      const fire = firebase.firestore();
      const rankingsDocId = ["1", "2", "3", "4", "5"];
      await fire
        .collection("rankings")
        .where(firebase.firestore.FieldPath.documentId(), "in", rankingsDocId)
        .get()
        .then((snapshot) =>
          snapshot.forEach((doc) => {
            doc.data().contents.forEach((content) => {
              fire
                .collection("upload-contents")
                .doc(content.contentId)
                .get()
                .then(async (snapshot) => {
                  if (snapshot.exists) {
                    let con = snapshot.data();
                    con.contentId = content.contentId;
                    con.uploadDate = snapshot.data().uploadDate.toDate();
                    con.favoriteCounts = content.favoriteCounts;
                    con.rank = String(content.rank);
                    con.drinkName = [];
                    con.genreName = [];
                    firebase
                      .firestore()
                      .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
                      .where(
                        firebase.firestore.FieldPath.documentId(),
                        "in",
                        con.drinkId
                      )
                      .get()
                      .then((snapshot) => {
                        snapshot.forEach((doc) => {
                          con.drinkName.push(doc.data().name);
                        });
                      });
                    if (con.genreId.length > 0) {
                      firebase
                        .firestore()
                        .collection("genres")
                        .where(
                          firebase.firestore.FieldPath.documentId(),
                          "in",
                          con.genreId
                        )
                        .get()
                        .then((snapshot) => {
                          snapshot.forEach((doc) => {
                            con.genreName.push(doc.data().name);
                          });
                        });
                    }
                    con = JSON.parse(JSON.stringify(con));
                    commit("setRanking", con);
                  }
                });
            });
          })
        );
    },
    async getItems({ commit }) {
      commit("resetItemsDrinks");
      commit("resetItemsOthers");
      await firebase
        .firestore()
        .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            commit("setItemsDrinks", {
              id: doc.id,
              name: doc.data().name,
              parentId: doc.data().parentId,
            });
          });
        });
      await firebase
        .firestore()
        .collection("items/N3bfi0q0sLc7hBavHt0B/others")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            commit("setItemsOthers", {
              id: doc.id,
              name: doc.data().name,
              parentId: doc.data().parentId,
            });
          });
        });
    },
    async getOthersUploadContents({ commit }, uid) {
      let othersUploadContents = [];
      commit("resetOthersUploadContents");
      await firebase
        .firestore()
        .collection("upload-contents")
        .where("uploadUserId", "==", uid)
        .orderBy("uploadDate", "desc")
        .get()
        .then((snapshot) =>
          snapshot.forEach((doc) => {
            // const date = change.doc.data().uploadDate.toDate();
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  //content.drinkName += doc.data().name + '\n';
                  content.drinkName.push(doc.data().name);
                });
              });
            if (content.genreId.length > 0) {
              firebase
                .firestore()
                .collection("genres")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.genreId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.genreName.push(doc.data().name);
                  });
                });
            }
            for (var fav of content.favorites) {
              fav.date = fav.date.toDate();
            }
            for (var comment of content.talks) {
              comment.dateTime = comment.dateTime.toDate();
            }
            content = JSON.parse(JSON.stringify(content));
            othersUploadContents.push(content);
          })
        );
      commit("setOthersUploadContents", {
        othersUploadContents: othersUploadContents,
      });
    },
    async getOthersFavoriteContents({ commit }) {
      let othersFavoriteContents = [];
      commit("resetOthersFavoriteContents");
      await firebase
        .firestore()
        .collection("upload-contents")
        .orderBy("uploadDate", "desc")
        .get()
        .then((snapshot) =>
          snapshot.forEach((doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = doc.data().uploadDate.toDate();
            content.drinkName = [];
            content.genreName = [];
            firebase
              .firestore()
              .collection("items/N3bfi0q0sLc7hBavHt0B/drinks")
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                content.drinkId
              )
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  //content.drinkName += doc.data().name + '\n';
                  content.drinkName.push(doc.data().name);
                });
              });
            if (content.genreId.length > 0) {
              firebase
                .firestore()
                .collection("genres")
                .where(
                  firebase.firestore.FieldPath.documentId(),
                  "in",
                  content.genreId
                )
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    content.genreName.push(doc.data().name);
                  });
                });
            }
            content = JSON.parse(JSON.stringify(content));
            othersFavoriteContents.push(content);
          })
        );
      commit("setOthersFavoriteContents", {
        othersFavoriteContents: othersFavoriteContents,
      });
    },
    changeFavoriteRead(dummy, payload) {
      // console.log("いいね");
      // console.log(payload.favorite);
      firebase
        .firestore()
        .collection("upload-contents")
        .doc(payload.docId)
        .set({ favorites: payload.favorite }, { merge: true });
    },
    changeCommentRead(dummy, payload) {
      // console.log("自分の投稿");
      // console.log(payload.comments);
      firebase
        .firestore()
        .collection("upload-contents")
        .doc(payload.docId)
        .set({ talks: payload.comments }, { merge: true });
    },
    changeCommentReadOfComment(dummy, payload) {
      // console.log("他の人の投稿");
      // console.log(payload.comments);
      firebase
        .firestore()
        .collection("upload-contents")
        .doc(payload.docId)
        .set({ talks: payload.comments }, { merge: true });
    },
    getUploadContentByDocId({ commit }, payload) {
      let contentId = payload.contentId;
      firebase
        .firestore()
        .collection("upload-contents")
        .doc(contentId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let selected = doc.data();
            for (var comment of selected.talks) {
              comment.dateTime = comment.dateTime.toDate();
            }
            //doc.dataにcontentIdを追加しました。
            selected.contentId = contentId;
            commit("setUploadContentDetail", { selected });
          } else {
            commit("setDocExistsStatus");
          }
        });
    },
    async getMyActivities({ commit }, user) {
      let myContents = [];
      let othersContents = [];
      await firebase
        .firestore()
        .collection("upload-contents")
        .where("uploadUserId", "!=", user.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = content.uploadDate.toDate();
            for (var fav of content.favorites) {
              fav.date = fav.date.toDate();
            }
            for (var comment of content.talks) {
              comment.dateTime = comment.dateTime.toDate();
            }
            othersContents.push(content);
          });
        });
      await firebase
        .firestore()
        .collection("upload-contents")
        .where("uploadUserId", "==", user.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let content = doc.data();
            content.contentId = doc.id;
            content.uploadDate = content.uploadDate.toDate();
            for (var fav of content.favorites) {
              fav.date = fav.date.toDate();
            }
            for (var comment of content.talks) {
              comment.dateTime = comment.dateTime.toDate();
            }
            myContents.push(content);
          });
        });
      commit("setMyActivities", {
        myContents: myContents,
        othersContents: othersContents,
        uid: user.uid,
      });
    },
  },
  modules: {},
  getters: {
    uid: (state) => (state.loginUser ? state.loginUser.uid : null),
    userName: (state) => (state.loginUser ? state.loginUser.displayName : null),
    photoUrl: (state) => (state.loginUser ? state.loginUser.photoURL : null),
    filteredMyFavoriteContents: (state) =>
      state.myFavoriteContents.filter((contents) =>
        contents.favorites.some((item) => item.userId === state.loginUser.uid)
      ),
    othersUid: (state) => (state.selectedUser ? state.selectedUser.uid : null),
    othersName: (state) =>
      state.selectedUser ? state.selectedUser.displayName : null,
    filteredOthersFavoriteContents: (state) =>
      state.othersFavoriteContents.filter((contents) =>
        contents.favorites.some(
          (item) => item.userId === state.selectedUser.uid
        )
      ),
    rankings: (state) =>
      state.rankings.sort((a, b) => {
        if (a.rank < b.rank) {
          return -1;
        }
        if (a.rank > b.rank) {
          return 1;
        }
        return 0;
      }),
    uploadContentDetail: (state) =>
      state.uploadContentDetail ? state.uploadContentDetail : null,
  },
});
