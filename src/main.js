import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'
import VModal from 'vue-js-modal'
Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: "cafe-de-engineer.firebaseapp.com",
  databaseURL: "https://cafe-de-engineer.firebaseio.com",
  projectId: "cafe-de-engineer",
  storageBucket: "cafe-de-engineer.appspot.com",
  messagingSenderId: "1090465040347",
  appId: "1:1090465040347:web:dd643307fbf677541009fe",
  measurementId: "G-90HEH3HLQ2"
};
firebase.initializeApp(firebaseConfig);
    firebase.analytics();

Vue.use(VModal);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
