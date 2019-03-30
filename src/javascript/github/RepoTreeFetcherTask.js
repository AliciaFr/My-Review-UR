/**
 * Created by Alicia on 25.03.2019.
 */

function RepoTreeFetcherTask(octokitHelper, callback) {
    this.callback = callback;
    this.octokitHelper = octokitHelper;
}

RepoTreeFetcherTask.prototype.run = function () {
    this.octokitHelper.getRepoTree(this.onTreeAvailable.bind(this));
};

RepoTreeFetcherTask.prototype.onTreeAvailable = function (tree) {
    this.currTree = tree;
    this.callback(this.currTree);

};

export default RepoTreeFetcherTask;
