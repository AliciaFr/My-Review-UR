/**
 * Created by Alicia on 04.04.2019.
 */

import _ from 'underscore';

function RepositoryFetcherTask(firebaseHelper, octokitHelper, callback) {
    this.callback = callback;
    this.firebaseHelper = firebaseHelper;
    this.octokitHelper = octokitHelper;
}

RepositoryFetcherTask.prototype.run = function () {
    this.firebaseHelper.getUserRepos('dUTeGpNEk0gHhavOYUgoWxYVkUr2', this.onFirebaseReposAvailable.bind(this));
};

RepositoryFetcherTask.prototype.onFirebaseReposAvailable = function (repos) {
    this.currentFirebaseRepos = repos;
    this.octokitHelper.getUserRepos(this.onGitHubReposAvailable.bind(this));
};

RepositoryFetcherTask.prototype.onGitHubReposAvailable = function (repos) {
    this.currentGitHubRepos = repos;
    this.mergeRepositories();
};

RepositoryFetcherTask.prototype.mergeRepositories = function () {
    let notPublishedRepos = [];

    for (let i = 0; i < this.currentFirebaseRepos.length; i++) {
        let test = _.where(this.currentGitHubRepos, this.currentFirebaseRepos[i].name);
        console.log(test);
    }

    this.callback(notPublishedRepos);
};

export default RepositoryFetcherTask;