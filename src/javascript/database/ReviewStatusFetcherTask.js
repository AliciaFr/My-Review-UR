/**
 * Created by Alicia on 12.04.2019.
 */
import firebase from 'firebase';

let that;

function ReviewStatusFetcherTask(uid, status, callback) {
    this.callback = callback;
    this.status = status;
    this.uid = uid;
}

ReviewStatusFetcherTask.prototype.run = function () {
    that = this;
    this.filterReviewsForStatus(that.uid, that.status, that.checkReposForName.bind(that));
};

ReviewStatusFetcherTask.prototype.filterReviewsForStatus = function (uid, status, callback) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.on('value', snap => {
        let repos = [];
        snap.forEach(function (child) {
            if (uid === child.val().reviewer) {
                if (child.val().status === status) {
                    let repo = child.val().repo;
                    repos.push(repo);
                }
            }
        });
        callback(repos);
    });
};

ReviewStatusFetcherTask.prototype.checkReposForName = function (repos) {
    let resultPromises = [];
    for (let i = 0; i < repos.length; i++) {
        resultPromises.push(this.getRepoName(repos[i]));
    }
    Promise.all(resultPromises).then(that.findUsernameForRepo);
};

ReviewStatusFetcherTask.prototype.findUsernameForRepo = function (repos) {
    let resultPromises = [];
    let resultReviews = [];
    for (let i = 0; i < repos.length; i++) {
        resultPromises.push(that.getUserName(repos[i].userName));
    }
    Promise.all(resultPromises).then(function (users) {
        for (let i = 0; i < repos.length; i++) {
            repos[i].userName = users[i];
            resultReviews.push(repos[i]);
        }
        that.callback(resultReviews);
    });
};

ReviewStatusFetcherTask.prototype.getRepoName = function (repoId) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('repositories');
    let myPromise = new Promise(function (resolve, reject) {
        reviewEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (repoId === child.key) {
                    resolve({
                        name: child.val().name,
                        userName: child.val().owner
                    });
                }
            });
        });
    });
    return myPromise;
};

ReviewStatusFetcherTask.prototype.getUserName = function (uid) {
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

export default ReviewStatusFetcherTask;