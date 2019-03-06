/**
 * Created by Alicia on 05.03.2019.
 */
import firebase from 'firebase'
import _ from 'underscore'

import AnimalAvatars from '../vendors/animal-avatars'

//var myAvatar = new AnimalAvatars.Avatar();

let userName,
    profilePicture;

export function createAccount(uid, token) {
    const database = firebase.database(),
        dbRef = database.ref("users/");

    if (checkUser(dbRef, uid) === false) {
        dbRef.child(uid).set({
            username: "",
            gitHubToken: token,
            profile_picture: "",
            repos: "",
            ratings: "",
        })
    }
}

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

export function getRepos(octokit, dbRef) {
    let login = 'UniRegensburg',
        repos = [];

    octokit.repos.list().then(result => {
        for (let i = 0; i < result.data.length; i++) {
            let repoInfo = {};
            if(_.isMatch(result.data[i]["owner"], {login: login})) {
                repoInfo.owner = result.data[i]["owner"].login;
                repoInfo.name = result.data[i].name;
                repos.push(repoInfo);
            }
        }
        dbRef.set(repos);
    })
}

/*function createUsername() {
    userName = myAvatar.getAvatarName();
    return userName;
}

function createProfilePicture() {
    profilePicture = myAvatar.getAvatarUrl();
    return profilePicture;
}*/