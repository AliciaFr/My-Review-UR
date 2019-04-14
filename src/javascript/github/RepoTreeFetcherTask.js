/**
 * Created by Alicia on 25.03.2019.
 */

function RepoTreeFetcherTask(repoName, octokitHelper, callback) {
    this.callback = callback;
    this.octokitHelper = octokitHelper;
    this.repoName = repoName;
}

RepoTreeFetcherTask.prototype.run = function () {
    this.octokitHelper.getRepoTree(this.repoName, this.onTreeAvailable.bind(this));
};

RepoTreeFetcherTask.prototype.onTreeAvailable = function (tree) {
    this.currTree = tree;
    this.callback(this.currTree);

};

export default RepoTreeFetcherTask;
