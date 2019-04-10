/**
 * Created by Alicia on 10.03.2019.
 */

import Octokit from '@octokit/rest';
import _ from 'underscore';
import Base64 from 'base-64';
const organization = 'uniregensburgreview';

let userRepos = [],
    octokit = new Octokit({auth: 'token ' + '2983d2539996337ea1f69a320d2a60911bdffa76'});

function OctokitHelper() {
    this.octokit = octokit;
}

// gets all repos of the organization uniregensburgreview in which the user is contributor
OctokitHelper.prototype.getOrgRepos = function (callback) {
    getOrgRepos(this.octokit, function (repos) {
        let orgrepos = onOrgReposAvailable(repos);
        callback(orgrepos);
    });
};

// 2: Octokit gets the repos of the organization
function getOrgRepos(octokit, callback) {
    octokit.repos.listForOrg({
        org: organization
    }).then(result => {
        callback(result.data);
    });
}

// 3: callback of getORgRepos
function onOrgReposAvailable(repos) {
    let orgRepos = [];
    for (let i = 0; i < repos.length; i++) {
        orgRepos.push(repos[i]);
    }
    return orgRepos;
}

OctokitHelper.prototype.getContributors = function (callback) {
    let octokit = this.octokit;
    this.getOrgRepos(function (repos) {
        for (let i = 0; i < repos.length; i++) {
            listRepoContributors(octokit, repos[i].name, function (contributors) {
                callback(contributors, repos[i].name);
            });
        }
    });

};

OctokitHelper.prototype.getUserRepos = function (callback) {
  /*this.getContributors(function (contributors, repo) {
     let userRepos = onContributorsAvailable(contributors, repo);
     callback(userRepos);
     console.log(userRepos);
  });*/
  let userRepos = ["u03-birdingapp-ws-2017-18-AliciaFr", "My-Review-UR"];
  callback(userRepos);
};

function onContributorsAvailable (contributors, repo) {
    let userRepos = [];
    for (let i = 0; i < contributors.length; i++) {
        if (contributors[i]["login"] === 'AliciaFr') {
            userRepos.push(repo);
        }
    }
    return userRepos;
}


//5: gets the contributors of a repo
function listRepoContributors(octokit, repo, callback) {
    octokit.repos.listContributors({
        owner: organization,
        repo: repo
    }).then(result => {
        callback(result.data);
    })
}

// 6: callback of listRepoContributors


/**
 * Gets the file structure of a repository (async), transforms the flat structure into a
 * tree structures and returns the results through a passed callback
 */
OctokitHelper.prototype.getRepoTree = function (callback) {
    getTree(this.octokit, 'u03-birdingapp-ws-2017-18-AliciaFr', function (tree) {
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
    console.log(ref);
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
                branch: 'refs/heads/ur-review-' + reviewer,
            }).then();
            resolve();
        }, 3000);
    });
}

function encodeBlob(file) {
    return Base64.encode(file);
}

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

export default OctokitHelper;
