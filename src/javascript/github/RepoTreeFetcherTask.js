/**
 * Created by Alicia on 25.03.2019.
 */

function RepoTreeFetcherTask(repoName, treeSha, octokitHelper, callback) {
    this.callback = callback;
    this.octokitHelper = octokitHelper;
    this.repoName = repoName;
    this.treeSha = treeSha;
}

RepoTreeFetcherTask.prototype.run = function () {
    this.octokitHelper.getRepoTree(this.repoName, this.treeSha, this.onTreeAvailable.bind(this));
};

RepoTreeFetcherTask.prototype.onTreeAvailable = function (tree) {
    this.currTree = tree;
    this.callback(this.currTree);

};

export default RepoTreeFetcherTask;
