<template>
  <div id="app">
    <v-app>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import firebase from "firebase";
export default {
  name: "App",
  components: {},
  methods: {
    ...mapActions([
      "logout",
      "setLoginUser",
      "deleteLoginUser",
      "getMyUploadContents",
    ]),
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setLoginUser(user);
      } else {
        this.deleteLoginUser();
        this.$router.push({ name: "Login" });
      }
    });
    this.getMyUploadContents();
  },
  data() {
    return {
      drawer: false,
      myContents: [],
    };
  },
};
</script>

<style>
.title {
  color: darkorange;
  font-size: 50px;
}
.v-data-table td {
  background: #f0f8ff;
}
.v-data-table tr:nth-child(odd) td {
  background: #fff;
}
.v-data-table-header tr {
  background: #ffa825;
}
.v-data-table tr:hover td {
  background-color: #eee;
  cursor: pointer;
}
.userLink {
  text-decoration: none;
  color: #ff9800;
  padding: 5px 10px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 50%,
    rgba(255, 152, 0, 1) 50%
  );
  background-position: 0 0;
  background-size: 200% auto;
  transition: 0.3s;
}
.userLink:hover {
  background-position: -100% 0;
  color: #fff;
  background-color: #ff9800;
  border-radius: 15px;
}
</style>
