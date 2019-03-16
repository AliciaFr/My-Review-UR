/**
 * Created by Alicia on 10.03.2019.
 */

import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyA6imO5xdyJam5OhrbFfg3J5--ncU9y3Ac",
    authDomain: "my-review-ur.firebaseapp.com",
    databaseURL: "https://my-review-ur.firebaseio.com",
    projectId: "my-review-ur",
    storageBucket: "my-review-ur.appspot.com",
    messagingSenderId: "931678872403"
};

function DatabaseHelper() {
}



DatabaseHelper.prototype.initFirebase = function () {
    firebase.initializeApp(config);
};


/* creates a database entry for the user */
DatabaseHelper.prototype.createAccount = function (dbRef, uid, username, profilePicture, gitHubName) {
    dbRef.child(uid).set({
        username: username,
        profile_picture: profilePicture,
        gitHubName: gitHubName
    })
};

/* Creates an entry for the repos */
DatabaseHelper.prototype.createRepo = function (dbRef, repoName, userUid, deadline) {
    dbRef.push({
        name: repoName,
        user: userUid,
        release_date: Date.now(),
        deadline: deadline
    })
};

export default DatabaseHelper;