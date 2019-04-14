/*
 * Creates new task to get list of all repositories (their names) from an organization
 * which include contributions from a given user
 * 
 * Needs: octokit (api object), orga (name of the organiation), user (name of the user) and
 * callback (callback to publish results)
 */

let that;

function UserRepositoriesFetcherTask(octokit, orga, user, callback) {
    this.callback = callback;
    this.orga = orga;
    this.user = user;
    this.octokit = octokit;
}

// Starts the task
UserRepositoriesFetcherTask.prototype.run = function() {
    // Fetches repo list (async) and processes results in checkReposForUser-method
    this.getOrgRepositories(this.checkReposForUser);
};

// Gets a list of all repos in the given organization
UserRepositoriesFetcherTask.prototype.getOrgRepositories = function(callback) {
    that = this;
    this.octokit.repos.listForOrg({
        org: this.orga
    }).then(result => {
        callback(result.data, this);
    });
};

// Gets contributors for each repository and checks for each of them if a given user
// contributed to the repository
UserRepositoriesFetcherTask.prototype.checkReposForUser = function(repos, that) {
    let resultPromises = [];
    for (let i = 0; i < repos.length; i++) {

        // Stores all Promises (for each repo) in one array
        resultPromises.push(that.getContributorsFromRepo(repos[i].name));
    }
    // Syncs the following action by providing a callback (here filterReposForUserContribution)
    // to be called when ALL Promises have been resolved
    Promise.all(resultPromises).then(that.filterReposForUserContribution);
};

// Returns a Promise which is resolved when octokit returned a list of all contributors for a given repo
UserRepositoriesFetcherTask.prototype.getContributorsFromRepo = function (repo) {
    // Creates a new Promise, the async action is wrapped inside the function passed as a parameter
    let myPromise = new Promise(function(resolve, reject) {
        // Everything inside this function will run async
        that.octokit.repos.listContributors({
            owner: that.orga,
            repo: repo
        }).then(result => {
            // Resolves Promise with an object containing name and contributors
            // for this repo
            resolve({
                name: repo,
                contributors: result.data
            });
        });
    });
    return myPromise;
};

// Checks contributor list of all repos for a given user and calls original callback (see constructor)
// with a list of all repository (names) to which the given user has contributed
UserRepositoriesFetcherTask.prototype.filterReposForUserContribution = function (repos) {
    let reposWithUserContribution = [];
    for(let i = 0; i < repos.length; i++) {
        for(let j = 0; j < repos[i].contributors.length; j++) {
            let contributor = repos[i].contributors[j].login;
            if(contributor === that.user) {
                reposWithUserContribution.push(repos[i].name);
            }
        }
    }
    // Calls the original callback passed to the task's constructor
    that.callback(reposWithUserContribution);
};


export default UserRepositoriesFetcherTask;