import Vue from 'vue';
import firebase from 'firebase';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

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
/* Die uid wird in einer Variable gespeichert --> so weiß man, wer der aktuelle User der Anwendung ist
 * Wenn die uid noch nirgends in der Datenbank vorhanden ist, wird ein neuer Datenbank-Eintrag erzeugt --> erldigt
 *
 * Wenn die uid vorhanden ist, wird der entsprechende Datenbanken-Eintrag bereitgestellt und in einer Variablen gespeichert
 * --> so können die Daten dann in der Datenbank manipuliert/verändert werden
 * --> man kann Arrays erzeugen, in denen die relevanten Infos für das Dashboard stehen
 * --> Zugriff auf den Token für Octokit
 *
 * Sobald definitiv ein Eintrag für den User existier:
 * Octokit ruft alle Repos ab:
 * Es wird überprüft ob der Repo in der DB schon existiert, wenn nicht --> er wird hinzugefügt*/

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});

// checks if logged in user already exists in database, if not it creates a new database entry
