/**
 * Created by Alicia on 03.03.2019.
 */
import firebase from 'firebase';
import DatabaseHelper from '../javascript/DatabaseHelper';
import AnimalAvatar from 'animal-avatars.js';

let animalAvatar = new AnimalAvatar();

export default {
    methods: {
        gitHubLogin: function () {
            const loginProvider = new firebase.auth.GithubAuthProvider(),
                database = firebase.database(),
                databaseHelper = new DatabaseHelper();
            loginProvider.addScope('user');
            firebase.auth().signInWithPopup(loginProvider).then((result) => {
                let uid = result.user.uid,
                    gitHubLogin = result.additionalUserInfo.username,
                    dbRef = database.ref("users/");
                if (checkUser(dbRef, uid) === false) {
                    databaseHelper.createAccount(dbRef, uid, createUserName(), createProfilePicture(), gitHubLogin);
                }
                this.$router.replace('home');
                localStorage.setItem('gitHubLogin', gitHubLogin);
            }).catch((err) => {
                alert('Oops. ' + err.message)
            });
        }
    }
}

/* checks if the uid of the current user is already existing in the database */
function checkUser(dbRef, uid) {
    let registered = false;
    dbRef.once('value').then(function (snapshot) {
        snapshot.forEach((child) => {
            if (child.val().uid === uid) {
                registered = true;
            }
        });
    });
    return registered;
}

function createUserName () {
    return animalAvatar.getAvatarName();
}

function createProfilePicture () {
    return animalAvatar.getAvatarUrl(50);
}
