/**
 * Created by Alicia on 10.03.2019.
 */

import firebase from 'firebase';
import ReviewStatusFetcherTask from './database/ReviewStatusFetcherTask';

let that;

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

FirebaseHelper.prototype.getRepoId = function (repoName, repoOwner) {
    let dbRef = firebase.database();
    let repoEntries = dbRef.ref('repositories');
    let myPromise = new Promise(function (resolve, reject) {
        repoEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (repoName === child.val().name && repoOwner === child.val().owner) {
                    resolve(child.key);
                }
            });
        });
    });
    return myPromise;
};

FirebaseHelper.prototype.getAssignedReviews = function (uid, callback) {
    let task = new ReviewStatusFetcherTask(uid, 'assigned', function (reviews) {
        callback(reviews);
    });
    task.run();
};

FirebaseHelper.prototype.getCompletedReviews = function (uid, callback) {
    let task = new ReviewStatusFetcherTask(uid, 'completed', function (reviews) {
        callback(reviews);
    });
    task.run();
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

FirebaseHelper.prototype.getProfilePicture = function (uid, callback) {
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

FirebaseHelper.prototype.getUserName = function (uid) {
    let dbRef = firebase.database();
    let userEntries = dbRef.ref('users');
    let myPromise = new Promise(function (resolve, reject) {
        userEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (uid === child.key) {
                    resolve(child.val().username);
                }
            })
        });
    });
    return myPromise;
};

FirebaseHelper.prototype.getUid = function (username) {
    let dbRef = firebase.database();
    let userEntries = dbRef.ref('users');
    let myPromise = new Promise(function (resolve, reject) {
        userEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (username === child.val().username) {

                    resolve(child.key);
                }
            })
        });
    });
    return myPromise;
};

FirebaseHelper.prototype.getGitHubLogin = function (uid) {
    let dbRef = firebase.database();
    let userEntries = dbRef.ref('users');
    let myPromise = new Promise(function (resolve, reject) {
        userEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (uid === child.key) {
                    resolve(child.val().gitHubName);
                }
            })
        });
    });
    return myPromise;
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

FirebaseHelper.prototype.setReview = function (repoName, reviewerUid, commitSha) {
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
        commit_sha: commitSha
    });
};

FirebaseHelper.prototype.setReviewBranchSha = function (repoName, repoOwnerId, reviewerUid, commitSha) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    let getRepoId = this.getRepoId(repoName, repoOwnerId);
    getRepoId.then(function (repoId) {

        reviewEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (repoId === child.val().repo && reviewerUid === child.val().reviewer) {
                    if (child.val().commit_sha === '') {
                        reviewEntries.child(child.key).update({
                            "commit_sha": commitSha
                        });
                    }
                }
            });
        });
    });
};

FirebaseHelper.prototype.getReviewBranchSha = function (repoName, repoOwner, reviewerUid, callback) {
    let self = this;
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    this.getUid(repoOwner).then(function (repoOwnerId) {
        self.getRepoId(repoName, repoOwnerId).then(function (repoId) {
            reviewEntries.on('value', snap => {
                snap.forEach(function (child) {
                    if (repoId === child.val().repo && reviewerUid === child.val().reviewer) {
                        callback(child.val().commit_sha);
                    }
                });
            });
        });
    });
};

FirebaseHelper.prototype.setReviewStatus = function (repoName, repoOwner, status) {
    let self = this;
    let getUid = this.getUid(repoOwner);
    getUid.then(function (repoOwnerId) {
        let getRepoId = self.getRepoId(repoName, repoOwnerId);
        getRepoId.then(function (repoId) {
            console.log(repoId);
            getReviewByRepoId(repoId, status);
        });
    });
};

function getReviewByRepoId(repoId, status) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.on('value', snap => {
        snap.forEach(function (child) {
            if (repoId === child.val().repo) {
                reviewEntries.child(child.key).update({
                   'status': status
                });
            }
        });
    });
}

FirebaseHelper.prototype.getExtensions = function (repoName, repoOwner, callback) {
    let dbRef = firebase.database();
    let repoEntries = dbRef.ref('repositories');
    let userId = this.getUid(repoOwner);
    userId.then(function (uid) {
        repoEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (repoName === child.val().name && uid === child.val().owner) {
                    callback(child.val().extensions);
                }
            })
        });
    });
};

FirebaseHelper.prototype.getTestingErrors = function (repoName, repoOwner, callback) {
    let dbRef = firebase.database();
    let repoEntries = dbRef.ref('repositories');
    let userId = this.getUid(repoOwner);
    userId.then(function (uid) {
        repoEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (repoName === child.val().name && uid === child.val().owner) {
                    callback(child.val().testing_errors);
                }
            })
        });
    });
};

export default FirebaseHelper;