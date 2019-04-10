/**
 * Created by Alicia on 08.04.2019.
 */

function RepoStatusFetcherTask(repoName, firebaseHelper, callback) {
    this.callback = callback;
    this.repoName = repoName;
    this.firebaseHelper = firebaseHelper;
}

RepoStatusFetcherTask.prototype.run = function () {
    this.firebaseHelper.getRepoId(this.repoName, this.onRepoIdAvailable.bind(this));
};

RepoStatusFetcherTask.prototype.onRepoIdAvailable = function (repoId) {
    this.repoId = repoId;
    this.firebaseHelper.getRepoStatus(this.repoId, this.onRepoStatusAvailable.bind(this));
};

RepoStatusFetcherTask.prototype.onRepoStatusAvailable = function (status) {
    this.status = status;
    this.callback(this.status);
};

export default RepoStatusFetcherTask;