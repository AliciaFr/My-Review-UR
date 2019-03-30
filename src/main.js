import Vue from 'vue';
import firebase from 'firebase';
import App from './App.vue';
import router from './router';
import SuiVue from 'semantic-ui-vue';
import VueTreeNavigation from 'vue-tree-navigation';

Vue.config.productionTip = false;
Vue.use(SuiVue, VueTreeNavigation);

let app = '';
const config = {
    apiKey: "AIzaSyA6imO5xdyJam5OhrbFfg3J5--ncU9y3Ac",
    authDomain: "my-review-ur.firebaseapp.com",
    databaseURL: "https://my-review-ur.firebaseio.com",
    projectId: "my-review-ur",
    storageBucket: "my-review-ur.appspot.com",
    messagingSenderId: "931678872403"
};

firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});
