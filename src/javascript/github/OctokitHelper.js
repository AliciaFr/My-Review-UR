/**
 * Created by Alicia on 10.03.2019.
 */

import Octokit from '@octokit/rest';
import _ from 'underscore';
import Base64 from 'base-64';

import UserRepositoriesFetcherTask from './UseRepositoriesFetcherTask';

const organization = 'uniregensburgreview';

let octokit = new Octokit({auth: 'token ' + '2983d2539996337ea1f69a320d2a60911bdffa76'});

function OctokitHelper() {
    this.octokit = octokit;
}

OctokitHelper.prototype.getUserRepos = function (gitHubLogin, username, callback) {
 // Creates task to get all repos from "organization" to which "user" has contributed
 // Last parameter is a callback function, called when task is completed
 let task = new UserRepositoriesFetcherTask(octokit, organization, gitHubLogin, function(repos) {
     let userRepos = [];
     for (let i = 0; i < repos.length; i++) {
         userRepos.push({
             name: repos[i],
             userName: username
         });
     }
    callback(userRepos);
 });
 task.run();
};



/**
 * Gets the file structure of a repository (async), transforms the flat structure into a
 * tree structures and returns the results through a passed callback
 */
OctokitHelper.prototype.getRepoTree = function (repoName, callback) {
    getTree(this.octokit, repoName, function (tree) {
        let structuredTree = buildStructuredTree(tree);
        callback(structuredTree);
    });
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
function buildStructuredTree(tree) {
    let arr = [];
    let structuredTree = {};

    for (let i = 0; i < tree.length; i++) {
        arr.push(tree[i]);
    }

    function addnode(obj) {
        let splitpath = obj.path.replace(/^\/|\/$/g, "").split('/');
        let pointer = structuredTree;
        for (let i = 0; i < splitpath.length; i++) {
            let node = {
                name: splitpath[i],
                type: 'directory',
                path: obj.path
            };
            if (i === splitpath.length - 1) {
                node.sha = obj.sha;
                node.type = obj.type;
            }
            pointer[splitpath[i]] = pointer[splitpath[i]] || node;
            pointer[splitpath[i]].children = pointer[splitpath[i]].children || {};
            pointer = pointer[splitpath[i]].children;
        }
    }

    arr.map(addnode);
    _.toArray(structuredTree);
    return structuredTree;
}

OctokitHelper.prototype.getFile = function (repo, sha, callback) {
    getBlob(this.octokit, repo, sha, function (blob) {
        let decodedFile = decodeBlob(blob);
        callback(decodedFile);
    });
};

function getBlob(octokit, repo, sha, callback) {
    octokit.git.getBlob({
        owner: organization,
        repo: repo,
        file_sha: sha
    }).then(result => {
        callback(result.data.content);
    });
}

function decodeBlob(blob) {
    return Base64.decode(blob);
}

OctokitHelper.prototype.createBranch = function (repo, reviewer, repoSha, editedFiles) {
    let ref = 'refs/heads/ur-review-' + reviewer;
    this.octokit.git.createRef({
        owner: organization,
        repo: repo,
        ref: ref,
        sha: repoSha
    }).then(result => {
        if (editedFiles !== null) {
            return myFunction(editedFiles, repo, reviewer);
        }
    });
};

async function myFunction(editedFiles, repo, reviewer) {
    for (let i = 0; i < editedFiles.length; i++) {
        await createCommit(editedFiles[i].content, repo, editedFiles[i].path, editedFiles[i].sha, reviewer);
    }
}

// commits a file into the repo
function createCommit(fileContent, repo, filePath, fileSha, reviewer) {
    return new Promise((resolve) => {
        setTimeout(() => {
            octokit.repos.updateFile({
                owner: organization,
                repo: repo,
                path: filePath,
                message: "Review Uni Regensburg",
                content: encodeBlob(fileContent),
                sha: fileSha,
                branch: 'refs/heads/uni-regensburg-review-' + reviewer,
            }).then();
            resolve();
        }, 3000);
    });
}

function encodeBlob(file) {
    return Base64.encode(file);
}

/* checks if the deadline of a repo is already over. If it is over the repo can be submitted. */
OctokitHelper.prototype.isSubmitted = function (repo, callback) {
    getDeadline(repo, function (deadline) {
        let isSubmitted = isLater(deadline);
        callback(isSubmitted);
    });
};

function getDeadline(repo, callback) {
    octokit.repos.getContents({
        owner: organization,
        repo: repo,
        path: 'deadline.json'
    }).then(result => {
        let deadlineFile = JSON.parse(Base64.decode(result.data.content));
        callback(deadlineFile.deadline);
    });
}

function isLater(deadline) {
    let now = new Date();
    if (now > new Date(deadline)) {
        return true;
    } else {
        return false;
    }
}

/* gets the task description of a repo */
OctokitHelper.prototype.getProjectTask = function (repo, callback) {
    octokit.repos.getContents({
        owner: organization,
        repo: repo,
        path: 'task.txt'
    }).then(result => {
        let task = Base64.decode(result.data.content);
        callback(task);
    });
};

OctokitHelper.prototype.getMasterBranchSha = function (repo, callback) {
    octokit.repos.getBranch({
        owner: organization,
        repo: repo,
        branch: 'master'
    }).then(result => {
       callback(result.data.commit.sha);
    });
};

export default OctokitHelper;
