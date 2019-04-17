/**
 * Created by Alicia on 16.04.2019.
 */

import firebase from 'firebase';
import _ from 'underscore';

let that;

function AssignRepoFetcherTask(uid, repoName, callback) {
    this.callback = callback;
    this.repoName = repoName;
    this.uid = uid;
}

AssignRepoFetcherTask.prototype.run = function () {
  that = this;
  this.filterReposForName(that.uid, that.repoName).then(function (repos) {
      that.checkRepoForReview(repos);
  });
};

AssignRepoFetcherTask.prototype.filterReposForName = function (uid, repoName) {
  let dbRef = firebase.database();
  let repoEntries = dbRef.ref('repositories');
  let myPromise = new Promise(function (resolve, reject) {
      repoEntries.on('value', snap => {
          let resultRepos = [];
          snap.forEach(function (child) {
              if (repoName === child.val().name && uid !== child.val().owner) {
                  resultRepos.push({
                      repoId: child.key,
                      repoName: child.val().name,
                      author: child.val().owner,
                      publishingDate: child.val().publishing_date
                  });
              }
          });
          if (resultRepos.length !== 0) {
              resolve(resultRepos);
          }
      });
  });
  return myPromise;

};

AssignRepoFetcherTask.prototype.checkRepoForReview = function (repos) {
    that.getAllReviews().then(function (reviews) {
        let reposWithoutReviews = [];
        for (let i = 0; i < repos.length; i++) {
             if (!_.contains(reviews, repos[i].owner)) {
                 reposWithoutReviews.push(repos[i]);
             }
         }
         that.callback(reposWithoutReviews);
    });
};

AssignRepoFetcherTask.prototype.getAllReviews = function () {
    let dbRef = firebase.database();
    let reviewEntries = dbRef.ref('reviews');
    let myPromise = new Promise(function (resolve, reject) {
       reviewEntries.on('value', snap => {
           let reviews = [];

           snap.forEach(function (child) {
             reviews.push(child.val().reviewer);
          });
           resolve(reviews);
       });
    });
    return myPromise;
};

export default AssignRepoFetcherTask;