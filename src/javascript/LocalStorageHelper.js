/**
 * Created by Alicia on 01.04.2019.
 */

function LocalStorageHelper () {}

LocalStorageHelper.prototype.addUserId = function (uid) {
    localStorage.setItem('uid', uid);
};

LocalStorageHelper.prototype.getUserId = function () {
    localStorage.getItem('uid');
};

LocalStorageHelper.prototype.addEntry = function (name, fileSha, filePath, content) {
    let file = {
        "name": name,
        "sha": fileSha,
        "path": filePath,
        "content": content
    };
    let existingFiles = this.getAllFiles();
    if(existingFiles === null) {
        existingFiles = [];
    }
    localStorage.setItem("file", JSON.stringify(file));
    existingFiles.push(file);
    localStorage.setItem("allFiles", JSON.stringify(existingFiles));
};

LocalStorageHelper.prototype.getAllFiles = function () {
    return JSON.parse(localStorage.getItem("allFiles"));
};

LocalStorageHelper.prototype.getFile = function (fileName) {
    let existingFiles = this.getAllFiles();
    if (existingFiles !== null) {
        for (let i = 0; i < existingFiles.length; i++) {
            if (existingFiles[i].name === fileName) {
                return existingFiles[i];
            }
        }
    }
    return null;
};

LocalStorageHelper.prototype.updateFileContent = function (fileName, content) {
    let existingFiles = this.getAllFiles();
    if (existingFiles !== null) {
        for (let i = 0; i < existingFiles.length; i++) {
            if (existingFiles[i].name === fileName) {
                existingFiles[i].content = content;
            }
        }
    }
    localStorage.setItem("allFiles", JSON.stringify(existingFiles));
};

LocalStorageHelper.prototype.deleteAllFiles = function () {
    localStorage.removeItem('allFiles');
    localStorage.removeItem('file');
};

export default LocalStorageHelper;