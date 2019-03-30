/**
 * Created by Alicia on 10.03.2019.
 */

import Octokit from '@octokit/rest';
import _ from 'underscore';
import dree from 'dree';

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

/**
 * Gets the file structure of a repository (async), transforms the flat structure into a
 * tree structures and returns the results through a passed callback
 */
OctokitHelper.prototype.getRepoTree = function (callback) {
    /**
     * Was hier getan werden soll:
     *
     * 1. Repositoriy mit getTree holen (async)
     * 2. Baum aus Dateistruktur erstellen mit onRepoTreeAvailable (sync)
     * 3. Die Stelle des Codes, die getRepoTree aufgerufen hat, über den 
     * übergebenen Callback (callback) über das Ergebnis informieren
     *
     * Dazu ist es notwendig, das:
     *
     * 1. onRepoTreeAvailable ausgeführt wird, wenn getTree vollständig durchlaufen wurde
     * 2. onRepoTreeAvailable mit den Daten arbeitet, die getTree von octokit erhalten hat
     * 3. Der übergebene Callback (callback) muss in onRepoTreeAvailable verfügbar sein, um
     * dort die aufrufende Stelle zu informieren oder das Ergebnis muss von der Methode, die
     * den Verzeichnisbaum baut, zurückgegeben werden um dann mit dem Callback verwendet 
     * werden.
     *
     * Zur Umsetzung wurden diese Änderungen am Code vorgenommen:  
     *
     * - onRepoTreeAvailable umbenannt in buildStructuredTree
     * - buildStructuredTree gibt jetzt den erzeugten Baum per return-Anweisung zurück
     *
     * Umsetzung des oben beschriebenen Ablaufs:
     *
     * Asynchrone Methode zum Beziehen des Github-Repos wird aufgerufen. Übergeben werden
     * die ocotokit-Anbindung (this.octokit), der Name des Repos ('u03-birdingapp-ws-2017-18-AliciaFr')
     * und ein (inline) Callback, der ausgeführt wird, wenn getTree die asynchrone Arbeit 
     * abgeschlossen hat.
     */
    getTree(this.octokit, 'u03-birdingapp-ws-2017-18-AliciaFr', function(tree) {
        /**
         * Dieser inline-Callback wird ausgeführt, wenn getTree das Repository bezogen hat
         */
        /**
         * buildTree wird aufgerufen, um den strukturierten Dateibaum zu erstellen, die
         * Rückgabe wird in der Variable structuredTree zwischengespeichert.
         */
        //let structuredTree = buildStructuredTree(tree);
        let structuredTree = treeify(tree);
        console.log(structuredTree);
        /**
         * Der ursprünglich an getRepoTree übergebene Callback wird jetzt aufgerufen um die bezogenen
         * und transformierten Daten an die aufrufgende Stelle zurückzugeben.
         */

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
function buildStructuredTree (tree) {
    let arr = [];
    let structuredTree = {};

    for(let i = 0; i < tree.length; i++) {
        arr.push(tree[i]);
    }

    function addnode(obj){
        let splitpath = obj.path.replace(/^\/|\/$/g, "").split('/');
        let pointer = structuredTree;
        for (let i = 0; i < splitpath.length; i++)
        {
            let node = {
                name: splitpath[i],
                type: 'directory'
            };
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
    _.toArray(structuredTree);
    console.log(structuredTree);
    return structuredTree;
}


function treeify (files) {
    let path = require('path'),
        arr = [];

    for(let i = 0; i < files.length; i++) {
        arr.push(files[i]);
    }

    files = files.reduce(function(tree, f) {
        let dir = path.dirname(f.path);

        if (tree[dir]) {
            tree[dir].children.push(f)
        } else {
            tree[dir] = { implied: true, children: [f] }
        }

        if (tree[f.path]) {
            f.children = tree[f.path].children
        } else {
            f.children = []
        }

        return (tree[f.path] = f), tree
    }, {});

    return Object.keys(files).reduce(function(tree, f) {
        if (files[f].implied) {
            return tree.concat(files[f].children)
        }

        return tree
    }, [])
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
