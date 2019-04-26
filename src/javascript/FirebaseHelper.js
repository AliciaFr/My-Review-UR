/**
 * Created by Alicia on 10.03.2019.
 */

import firebase from 'firebase';
import RepositoryFetcherTask from './github/RepositoryFetcherTask';
import ReviewStatusFetcherTask from './database/ReviewStatusFetcherTask';
import RepoStatusFetcherTask from './database/RepoStatusFetcherTask';
import AssignRepoFetcherTask from './database/AssignRepoFetcherTask';
import ReviewsForUserFetcherTask from './database/ReviewsForUserFetcherTask';

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
    let that = this;
    checkForUserRepos(uid, function (userRepos) {
        that.getProfilePicture(uid, function (imgUrl) {
           for (let i = 0; i < userRepos.length; i++) {
               userRepos[i].profilePicture = imgUrl;
           }
        });
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
                if (child.val().rating !== '') {
                    callback('reviewRated');
                } else {
                    callback(child.val().status);

                }
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

FirebaseHelper.prototype.getReviewsForUser = function (uid) {
    let myPromise = new Promise(function (resolve, reject) {
        let task = new ReviewsForUserFetcherTask(uid, function (reviews) {
            resolve(reviews);
        });
        task.run();
    });
    return myPromise;
};

FirebaseHelper.prototype.getAssignedReviews = function (uid, callback) {
    let that = this;
    let task = new ReviewStatusFetcherTask(uid, 'assigned', function (reviews) {
        if (reviews.length > 0) {
            for (let i = 0; i < reviews.length; i++) {
                console.log(reviews[i]);
                that.getProfilePicture(reviews[i].author, function (imgUrl) {
                    reviews[i].profilePicture = imgUrl;
                    callback(reviews);

                });
            }
        } else {
            callback(reviews);
        }
    });
    task.run();
};

FirebaseHelper.prototype.getReviewsForReviewer = function (uid, callback) {
    let task = new ReviewStatusFetcherTask(uid, 'completed', function (reviews) {
        let filteredReviews = [];
        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].rating !== '') {
                filteredReviews.push(reviews[i]);
            }
        }
        callback(filteredReviews);
    });
    task.run();
};

FirebaseHelper.prototype.checkRepoForStatus = function (uid, repoName, firebaseHelper, callback) {
    let task = new RepoStatusFetcherTask(repoName, uid, firebaseHelper, function (repo) {
        callback(repo);
    });
    task.run();
};

/* Gets all Reviews with the status "completed" in which the current user is the reviewer of the assigned repository */
FirebaseHelper.prototype.getCompletedReviewsFromUser = function (uid, callback) {
    let that = this;
    let task = new ReviewStatusFetcherTask(uid, 'completed', function (reviews) {
        if (reviews.length > 0) {
            for (let i = 0; i < reviews.length; i++) {
                that.getProfilePicture(reviews[i].author, function (imgUrl) {
                    reviews[i].profilePicture = imgUrl;
                    callback(reviews);

                });
            }
        } else {
            callback(reviews);
        }
    });
    task.run();
};


/* Gets all Reviews with the status "completed" in which the current user is the author of the published repository */


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
        publishing_date: Date.now(),
        testing_errors: testingErrors,
        extensions: extensions
    });
};

FirebaseHelper.prototype.getRepoForAssigning = function (uid, repoName, callback) {
    let task = new AssignRepoFetcherTask(uid, repoName, function (repos) {
        console.log(repos);
        let currPublishingDate = repos[0].publishingDate;
        let currRepo = repos[0];
        for (let i = 0; i < repos.length; i++) {
            if (repos[i].publishingDate < currPublishingDate) {
                currPublishingDate = repos[i].publishingDate;
                currRepo = repos[i];
            }
        }
        callback(currRepo);
    });
    task.run();
};

FirebaseHelper.prototype.fetchUserRepos = function (firebaseHelper, octokitHelper, uid, callback) {
    let self = this;
    let myRepoFetcherTask = new RepositoryFetcherTask(firebaseHelper, octokitHelper, uid, function (repos) {
        console.log(repos);
        if (repos.length > 0) {
            self.getProfilePicture(uid, function (imgUrl) {
                for (let i = 0; i < repos.length; i++) {
                    repos[i].profilePicture = imgUrl;
                    callback(repos);
                }
            });
        } else {
            callback(repos);
        }
    });
    myRepoFetcherTask.run();
};

FirebaseHelper.prototype.setReview = function (repoName, reviewerUid, assignDate) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.push({
        repo: repoName,
        reviewer: reviewerUid,
        helpful: '',
        rating: '',
        assignDate: assignDate,
        reviewDate: '',
        status: 'assigned'
    });
};

FirebaseHelper.prototype.setReviewBranchSha = function (repoName, repoOwnerId, reviewerUid, reviewSha) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    let getRepoId = this.getRepoId(repoName, repoOwnerId);
    getRepoId.then(function (repoId) {
        reviewEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (repoId === child.val().repo && reviewerUid === child.val().reviewer) {
                    reviewEntries.child(child.key).update({
                        "review_sha": reviewSha
                    });

                }
            });
        });
    });
};

FirebaseHelper.prototype.getReviewBranchSha = function (repoName, repoOwner, reviewerUid, callback) {
    console.log("Hello World");
    let self = this;
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');

        self.getRepoId(repoName, repoOwner).then(function (repoId) {
            console.log(repoId);
            reviewEntries.on('value', snap => {
                snap.forEach(function (child) {
                    if (repoId === child.val().repo && reviewerUid === child.val().reviewer) {
                        console.log(child.val().review_sha);
                        callback(child.val().review_sha);
                    }
                });
            });
        });

};

FirebaseHelper.prototype.setReviewStatus = function (repoName, repoAuthorId, status, date) {
    let self = this;
    let getRepoId = self.getRepoId(repoName, repoAuthorId);
        getRepoId.then(function (repoId) {
            getReviewByRepoId(repoId, status, date);
        });

};

function getReviewByRepoId(repoId, status, date) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.on('value', snap => {
        snap.forEach(function (child) {
            if (repoId === child.val().repo) {
                reviewEntries.child(child.key).update({
                    'status': status,
                    'reviewDate': date
                });
            }
        });
    });
}

FirebaseHelper.prototype.getReviewForReviewer = function (reviewId) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    let myPromise = new Promise(function (resolve, reject) {
        reviewEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (child.key === reviewId) {
                    resolve({
                        helpful: child.val().helpful,
                        rating: child.val().rating
                    });
                }
            });
        });
    });
    console.log(myPromise);
    return myPromise;
};

FirebaseHelper.prototype.setReviewForReviewer = function (reviewId, helpful, rating) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.on('value', snap => {
        snap.forEach(function (child) {
            if (child.key === reviewId) {
                reviewEntries.child(child.key).update({
                    helpful: helpful,
                    rating: rating
                });
            }
        });
    });
};

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