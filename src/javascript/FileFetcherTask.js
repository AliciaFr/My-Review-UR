/**
 * Created by Alicia on 31.03.2019.
 */

function FileFetcherTask(octokitHelper, repo, sha, callback ) {
    this.callback = callback;
    this.repo = repo;
    this.sha = sha;
    this.octokitHelper = octokitHelper;
}

FileFetcherTask.prototype.run = function () {
    this.octokitHelper.getFile(this.repo, this.sha, this.onFileAvailable.bind(this));
};

FileFetcherTask.prototype.onFileAvailable = function (file) {
    this.currFile = file;
    this.callback(this.currFile);
};

export default FileFetcherTask;