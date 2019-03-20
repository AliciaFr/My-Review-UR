/**
 * Created by Alicia on 10.03.2019.
 */

import Octokit from '@octokit/rest';

let userRepos = [];

function OctokitHelper() {
    this.octokit = new Octokit({auth: 'token ' + '2983d2539996337ea1f69a320d2a60911bdffa76'})
}

// 1
OctokitHelper.prototype.getUserRepos = function (organization, gitHubLogin) {
    getOrgRepos (this.octokit, organization, onOrgReposAvailable, gitHubLogin);
};

// 2: Octokit gets the repos of the organization
function getOrgRepos (octokit, organization, callback, gitHubLogin) {
    octokit.repos.listForOrg({
        org: organization
    }).then(result => {
        callback(octokit, result.data, gitHubLogin);
    })
}

// 3: callback of getORgRepos
function onOrgReposAvailable(octokit, repos, gitHubLogin) {
    for (let i = 0; i < repos.length; i++) {
        listRepoContributors(octokit, repos[i]["name"], gitHubLogin, onContributorsAvailable);
    }
}


//5: gets the contributors of a repo
function listRepoContributors (octokit, repo, gitHubLogin, callback) {
    octokit.repos.listContributors({
        owner: "uniregensburgreview",
        repo: repo
    }).then(result => {
        callback(gitHubLogin, result.data, repo);
    })
}

// 6: callback of listRepoContributors
function onContributorsAvailable (gitHubLogin, contributors, repo) {
    for (let i = 0; i < contributors.length; i++) {
        if (contributors[i]["login"] === gitHubLogin) {
            userRepos.push(repo);
        }
        localStorage.setItem("repos", JSON.stringify(userRepos));
    }

}


export default OctokitHelper;
