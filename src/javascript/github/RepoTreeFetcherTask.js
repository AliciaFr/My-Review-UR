/**
 * Created by Alicia on 25.03.2019.
 */

function RepoTreeFetcherTask(octokitHelper, callback) {
    this.callback = callback;
    this.octokitHelper = octokitHelper;
}

RepoTreeFetcherTask.prototype.run = function () {
    this.octokitHelper.getRepoTree(this.onTreeAvailable);
};

RepoTreeFetcherTask.prototype.onTreeAvailable = function (tree) {
    this.tree = tree;
    this.callback(this.tree);
    console.log(tree);
};

export default RepoTreeFetcherTask;
