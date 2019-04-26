/**
 * Created by Alicia on 08.04.2019.
 */

import firebase from 'firebase';

let that;

function RepoStatusFetcherTask(repoName, uid, firebaseHelper, callback) {
    this.callback = callback;
    this.uid = uid;
    this.repoName = repoName;
    this.firebaseHelper = firebaseHelper;
}

RepoStatusFetcherTask.prototype.run = function () {
    that = this;
    this.getRepoId(this.repoName, this.uid, this.onRepoIdAvailable.bind(this));
};

RepoStatusFetcherTask.prototype.getRepoId = function(repoName, repoOwner, callback) {
    let dbRef = firebase.database();
    let repoEntries = dbRef.ref('repositories');
        repoEntries.on('value', snap => {
            snap.forEach(function (child) {
                if (repoName === child.val().name && repoOwner === child.val().owner) {
                    callback(child.key);
                } else {
                    that.callback("not assigned");
                }
            });
        });
};

RepoStatusFetcherTask.prototype.onRepoIdAvailable = function (repoId) {
    this.repoId = repoId;
    this.firebaseHelper.getRepoStatus(this.repoId, function (status) {
        that.callback(status);
    });
};

RepoStatusFetcherTask.prototype.onRepoStatusAvailable = function (status) {
  console.log(status);
};


export default RepoStatusFetcherTask;