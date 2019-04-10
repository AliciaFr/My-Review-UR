/**
 * Created by Alicia on 10.03.2019.
 */

import firebase from 'firebase';

function FirebaseHelper() {
}

/* creates a database entry for the user */
FirebaseHelper.prototype.createAccount = function (dbRef, uid, username, profilePicture, gitHubName) {
    dbRef.child(uid).set({
        username: username,
        profile_picture: profilePicture,
        gitHubName: gitHubName
    });
};

FirebaseHelper.prototype.getUserRepos = function (uid, callback) {
    checkForUserRepos(uid, function (userRepos) {
        callback(userRepos);
    });
};

function checkForUserRepos(uid, callback) {
    let dbRef = firebase.database();
    let repoEntries = dbRef.ref('repositories');
    repoEntries.on('value', snap => {
        let userRepos = [];
        snap.forEach(function (child) {
            if (child.val().owner === uid) {
                getUserName(uid, function (username) {
                    let repo = {
                        name: child.val().name,
                        userName: username
                    };
                    userRepos.push(repo);
                });

            }
        });
        callback(userRepos);
    });
}

function getUserName(uid, callback) {
    let dbRef = firebase.database();
    let repoEntries = dbRef.ref('users');
    repoEntries.on('value', snap => {
        snap.forEach(function (child) {
            if (child.key === uid) {
                callback(child.val().username);
            }
        });
    });
}


// wenn kein Review-Eintrag für den repo vorhanden ist --> nicht zugewiesen
// wenn Review-Eintrag für den repo vorhanden ist --> Status checken
// zugewiesen, aber nicht reviewt
// abgeschlossen
FirebaseHelper.prototype.getRepoStatus = function (repoId, callback) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.on('value', snap => {
        snap.forEach(function (child) {
            if (repoId === child.val().repo) {
                callback(child.val().status);
            } else {
                callback('not published')
            }
        });
    });
};

FirebaseHelper.prototype.getRepoId = function (repoName, callback) {
    let dbRef = firebase.database();
    let repoEntries = dbRef.ref('repositories');
    repoEntries.on('value', snap => {
        snap.forEach(function (child) {
            if (repoName === child.val().name) {
                callback(child.key);
            }
        });
    });
};

FirebaseHelper.prototype.getCompletedReviews = function (uid) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.on('value', snap => {
        let repos = [];
        snap.forEach(function (child) {
           if (uid === child.val().reviewer) {
               if (child.val().status === 'completed') {
                   getRepoAuthor(child.val().repo, function (author) {
                       let repo = {
                           name: child.val().name,
                           userName: author
                       };
                       repos.push(repo);
                   });
               }
           }
        });
    })
};

FirebaseHelper.prototype.getAssignedReviews = function (uid, callback) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.on('value', snap => {
        let repos = [];
        snap.forEach(function (child) {
            if (uid === child.val().reviewer) {
                if (child.val().status === 'assigned') {
                    let username = '';
                    let repo = {
                        name: child.val().repo,
                        userName: ''
                    };
                    console.log(repo);
                    repos.push(repo);
                }
            }
            callback(repos);
        });

    })
};

function getRepoAuthor(repoId, callback) {
    let dbRef = firebase.database();
    let repoEntries = dbRef.ref('repositories');
    repoEntries.on('value', snap => {
        snap.forEach(function (child) {
            if (repoId === child.key) {
                callback(child.val().user);
            }
        });
    });
}

FirebaseHelper.prototype.getProfilePicture = function(uid, callback) {
    let dbRef = firebase.database();
    let userEntries = dbRef.ref('users');
    userEntries.on('value', snap => {
       snap.forEach(function (child) {
           if (uid === child.key) {
               callback(child.val().profile_picture);
           }
       })
    });
};

/* Creates an entry for the repos */
FirebaseHelper.prototype.setRepo = function (repoName, uid, testingErrors, extensions) {
    let dbRef = firebase.database();
    let repoEntries = dbRef.ref('repositories');
    repoEntries.push({
        name: repoName,
        owner: uid,
        releaseDate: new Date(),
        testing_errors: testingErrors,
        extensions: extensions
    });
};

FirebaseHelper.prototype.setReview = function (repoName, reviewerUid) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.push({
        repo: repoName,
        reviewer: reviewerUid,
        helpful: '',
        rating: '',
        assignDate: '',
        reviewDate: '',
        status: 'assigned',
        commit_sha: ''
    });
};

export default FirebaseHelper;