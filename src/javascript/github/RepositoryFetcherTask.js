/**
 * Created by Alicia on 04.04.2019.
 */

import _ from 'underscore';
import LocalStorageHelper from '../LocalStorageHelper';

let that,
    localStorageHelper = new LocalStorageHelper(),
    gitHubLogin = localStorageHelper.getGitHubLogin(),
    username = localStorageHelper.getUsername(),
    profilePicture = localStorageHelper.getProfilePicture();

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
    that.currentFirebaseRepos = repos;
    that.octokitHelper.getUserRepos(gitHubLogin, username, that.onGitHubReposAvailable);
};

RepositoryFetcherTask.prototype.onGitHubReposAvailable = function (repos) {
    that.currentGitHubRepos = repos;
    _.uniq(that.currentGitHubRepos);
    that.mergeRepositories();
};

RepositoryFetcherTask.prototype.mergeRepositories = function () {
    let result = [];
    that.unpublishedRepos = [];
    if (that.currentFirebaseRepos.length < 1) {
        that.unpublishedRepos = that.currentGitHubRepos;
    } else {
        let pluckGitHubRepos = _.pluck(that.currentGitHubRepos, 'name');
        let pluckFirebaseRepos = _.pluck(that.currentFirebaseRepos, 'name');
        result = _.difference(pluckGitHubRepos, pluckFirebaseRepos);
        for (let i = 0; i < result.length; i++) {
            that.unpublishedRepos.push({
                name: result[i],
                userName: username,
                profilePicture: profilePicture
            });

        }
    }
    that.callback(that.unpublishedRepos);
};

export default RepositoryFetcherTask;