/**
 * Created by Alicia on 14.04.2019.
 */
import firebase from 'firebase';

let that;

function ReviewsForUserFetcherTask(uid, callback) {
    this.callback = callback;
    this.uid = uid;
}

ReviewsForUserFetcherTask.prototype.run = function () {
    that = this;
    this.filterReviewsForUser(that.checkReposForName.bind(that));
};

ReviewsForUserFetcherTask.prototype.filterReviewsForUser = function (callback) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    reviewEntries.on('value', snap => {
        let repos = [];
        snap.forEach(function (child) {
            if (child.val().status === 'completed') {
                let repo = child.val().repo;
                repos.push({
                    id: child.key,
                    name: repo,
                    commitSha: child.val().commit_sha,
                    author: that.uid,
                    reviewer: child.val().reviewer,
                    date: child.val().reviewDate
                });
            }
        });
        callback(repos);
    });
};

ReviewsForUserFetcherTask.prototype.checkReposForName = function (repos) {
    let resultPromises = [];
    for (let i = 0; i < repos.length; i++) {
        resultPromises.push(this.getRepoName(repos[i]));
    }
    console.log(resultPromises);
    Promise.all(resultPromises).then(that.findUsernameForReviewer);
};

/*ReviewsForUserFetcherTask.prototype.findUsernameForRepoAuthor = function (repos, callback) {
 let resultPromises = [];
 let resultReviews = [];
 for (let i = 0; i < repos.length; i++) {
 resultPromises.push(that.getUserName(repos[i].author));
 }
 Promise.all(resultPromises).then(function (users) {
 for (let i = 0; i < repos.length; i++) {
 repos[i].author = users[i];
 resultReviews.push(repos[i]);
 }
 callback(resultReviews);
 });
 };*/

ReviewsForUserFetcherTask.prototype.findUsernameForReviewer = function (repos) {
    let resultPromises = [];
    that.resultReviews = [];
    for (let i = 0; i < repos.length; i++) {
        resultPromises.push(that.getUserName(repos[i].reviewer));
    }
    Promise.all(resultPromises).then(function (users) {
        for (let i = 0; i < repos.length; i++) {
            if (repos[i].author === that.uid) {
                repos[i].reviewerName = users[i];
                that.resultReviews.push(repos[i]);
            }
        }
        that.callback(that.resultReviews);
    });
};

ReviewsForUserFetcherTask.prototype.getRepoName = function (repo) {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('repositories');
    let myPromise = new Promise(function (resolve, reject) {
        reviewEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (repo.name === child.key) {
                    resolve({
                        id: repo.id,
                        commitSha: repo.commitSha,
                        repo: child.val().name,
                        author: child.val().owner,
                        reviewer: repo.reviewer,
                        date: repo.date
                    });
                }
            });
        });
    });
    return myPromise;
};

ReviewsForUserFetcherTask.prototype.getUserName = function (uid) {
    let dbRef = firebase.database();
    console.log('Hello');
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

ReviewsForUserFetcherTask.prototype.resolveUsername = function (repos, users) {

};

export default ReviewsForUserFetcherTask;