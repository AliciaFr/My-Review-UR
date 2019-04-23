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
    that = this;
    for (let i = 0; i < repos.length; i++) {
        that.firebaseHelper.getProfilePicture(that.uid, function (imgUrl) {
            repos[i].profilePicture = imgUrl;
        });
    }
    that.currentFirebaseRepos = repos;
    this.firebaseHelper.getUserName(this.uid).then(this.onUserNameAvailable);
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
    _.uniq(that.currentGitHubRepos);
    that.mergeRepositories();
};

RepositoryFetcherTask.prototype.mergeRepositories = function () {
    let result = [];
    that.unpublishedRepos = [];
    if (that.currentFirebaseRepos.length === 0) {
        that.unpublishedRepos = that.currentGitHubRepos;
    } else {
        let pluckGitHubRepos = _.pluck(that.currentGitHubRepos, 'name');
        let pluckFirebaseRepos = _.pluck(that.currentFirebaseRepos, 'name');
        result = _.difference(pluckGitHubRepos, pluckFirebaseRepos);
        for (let i = 0; i < result.length; i++) {
            that.firebaseHelper.getUid(that.username).then(function (uid) {
                that.firebaseHelper.getProfilePicture(uid, function (imgUrl) {
                    that.unpublishedRepos.push({
                        name: result[i],
                        userName: that.username,
                        profilePicture: imgUrl
                    });
                });
            });
        }
    }
    that.callback(that.unpublishedRepos);
};

export default RepositoryFetcherTask;