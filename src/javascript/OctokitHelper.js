/**
 * Created by Alicia on 10.03.2019.
 */

import Octokit from '@octokit/rest';

const organization = 'uniregensburgreview';

let userRepos = [],
    octokit = new Octokit({auth: 'token ' + '2983d2539996337ea1f69a320d2a60911bdffa76'});


function OctokitHelper() {
    this.octokit = octokit;
}

// gets all repos of the organization uniregensburgreview in which the user is contributor
OctokitHelper.prototype.getUserRepos = function (gitHubLogin) {
    getOrgRepos (this.octokit, onOrgReposAvailable, gitHubLogin);
};

// 2: Octokit gets the repos of the organization
function getOrgRepos (octokit, callback, gitHubLogin) {
    octokit.repos.listForOrg({
        org: organization
    }).then(result => {
        callback(octokit, result.data, gitHubLogin);
    });
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
        owner: organization,
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

// gets the file structure of a repository and saves it into
OctokitHelper.prototype.getRepoTree = function (callback) {
    callback(getTree(this.octokit, 'u03-birdingapp-ws-2017-18-AliciaFr', onRepoTreeAvailable));
};

function getTree(octokit, repo, callback) {
    octokit.git.getTree({
        owner: organization,
        repo: repo,
        tree_sha: "master",
        recursive: 1
    }).then(result => {
        callback(result.data.tree);
    });
}

// Quelle: https://stackoverflow.com/questions/19531453/transform-file-directory-structure-into-tree-in-javascript
function onRepoTreeAvailable (tree) {
    let arr = []; //your array;
    let structuredTree = {};

    for(let i = 0;i < tree.length; i++) {
        arr.push(tree[i]);
    }

    function addnode(obj){
        let splitpath = obj.path.replace(/^\/|\/$/g, "").split('/');
        let pointer = structuredTree;
        for (let i = 0;i < splitpath.length; i++)
        {
            let node = { name: splitpath[i],
                type: 'directory'};
            if(i === splitpath.length - 1) {
                node.sha = obj.sha;
                node.type = obj.type;
            }
            pointer[splitpath[i]] = pointer[splitpath[i]] || node;
            pointer[splitpath[i]].children = pointer[splitpath[i]].children || {};
            pointer = pointer[splitpath[i]].children;
        }
    }
    arr.map(addnode);
    console.log(structuredTree);
}

// commits a file into the repo
OctokitHelper.prototype.createCommit = function (encodedBlob) {
    this.octokit.repos.updateFile({
        owner: "uniregensburgreview",
        repo: "u03-birdingapp-ws-2017-18-AliciaFr",
        path: "vendors/underscore/underscore-min.js",
        message: "Review",
        content: encodedBlob,
        sha: "f01025b7bcaab18e6b698141c854f95669a5975c"
    }).then();
};



export default OctokitHelper;
