/**
 * Created by Alicia on 04.04.2019.
 */

import _ from 'underscore';

let that;

function RepositoryFetcherTask(firebaseHelper, octokitHelper, uid, callback) {
    this.callback = callback;
    this.firebaseHelper = firebaseHelper;
    this.octokitHelper = octokitHelper;
    this.uid = uid;
}

RepositoryFetcherTask.prototype.run = function () {
    this.firebaseHelper.getUserRepos(this.uid, this.onFirebaseReposAvailable.bind(this));
};

RepositoryFetcherTask.prototype.onFirebaseReposAvailable = function (repos) {
    this.currentFirebaseRepos = repos;
    this.firebaseHelper.getUserName(this.uid).then(this.onUserNameAvailable);
    that = this;
};

RepositoryFetcherTask.prototype.onUserNameAvailable = function (username) {
    that.username = username;
    that.firebaseHelper.getGitHubLogin(that.uid).then(that.onGitHubLoginAvailable);
};

RepositoryFetcherTask.prototype.onGitHubLoginAvailable = function (gitHubLogin) {
    that.gitHubLogin = gitHubLogin;
    that.octokitHelper.getUserRepos(that.gitHubLogin, that.username, that.onGitHubReposAvailable);
};

RepositoryFetcherTask.prototype.onGitHubReposAvailable = function (repos) {
    that.currentGitHubRepos = repos;
    that.mergeRepositories();
};

RepositoryFetcherTask.prototype.mergeRepositories = function () {
    let result = [];
    this.unpublishedRepos = [];
    result = _.difference(this.currentFirebaseRepos, this.currentGitHubRepos);
    for (let i = 0; i < this.currentGitHubRepos.length; i++) {
        for (let j = 0; j < result.length; j++) {
            if (this.currentGitHubRepos[i].name !== result[j].name) {
                this.unpublishedRepos.push(this.currentGitHubRepos[i]);
            }
        }
    }
    that.callback(this.unpublishedRepos);
};

export default RepositoryFetcherTask;