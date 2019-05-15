/**
 * Created by Alicia on 03.03.2019.
 */
import firebase from 'firebase';
import DatabaseHelper from '../javascript/FirebaseHelper';
import LocalStorageHelper from '../javascript/LocalStorageHelper';
import AnimalAvatar from 'animal-avatars.js';

let animalAvatar = new AnimalAvatar();
let myLocalStorageHelper = new LocalStorageHelper();

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
                    dbRef = database.ref("users/"),
                    username = createUserName(),
                    profilePicture = createProfilePicture();
                if (checkUser(dbRef, uid) === false) {
                    databaseHelper.createAccount(dbRef, uid, username, profilePicture, gitHubLogin);
                }
                myLocalStorageHelper.addUserId(uid);
                myLocalStorageHelper.addGitHubLogin(gitHubLogin);
                myLocalStorageHelper.addUsername(username);
                myLocalStorageHelper.addProfilePicture(profilePicture);
                this.$router.replace('home');
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
