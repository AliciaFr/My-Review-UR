/**
 * Created by Alicia on 01.04.2019.
 */

const UID = 'uid';
const GITHUB_LOGIN = 'gitHubLogin';
const USERNAME = 'username';
const PROFILE_PICTURE = 'profilePicture';
const ALL_FILES = 'allFiles';
const FILE = 'file';
const COMMIT_DIFF = 'commitDiff';

function LocalStorageHelper () {}

LocalStorageHelper.prototype.addUserId = function (uid) {
    localStorage.setItem(UID, uid);
};

LocalStorageHelper.prototype.getUserId = function () {
    return localStorage.getItem(UID);
};

LocalStorageHelper.prototype.addUsername = function (username) {
  localStorage.setItem(USERNAME, username);
};

LocalStorageHelper.prototype.getUsername = function () {
    return localStorage.getItem(USERNAME);
};

LocalStorageHelper.prototype.addProfilePicture = function (profilePicture) {
    localStorage.setItem(PROFILE_PICTURE, profilePicture);
};

LocalStorageHelper.prototype.getProfilePicture = function () {
    return localStorage.getItem(PROFILE_PICTURE);
};

LocalStorageHelper.prototype.addGitHubLogin = function (gitHubLogin) {
    localStorage.setItem(GITHUB_LOGIN, gitHubLogin);
};

LocalStorageHelper.prototype.getGitHubLogin = function () {
    return localStorage.getItem(GITHUB_LOGIN);
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
    localStorage.setItem(FILE, JSON.stringify(file));
    existingFiles.push(file);
    localStorage.setItem(ALL_FILES, JSON.stringify(existingFiles));
};

LocalStorageHelper.prototype.getAllFiles = function () {
    return JSON.parse(localStorage.getItem(ALL_FILES));
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
    localStorage.setItem(ALL_FILES, JSON.stringify(existingFiles));
};

LocalStorageHelper.prototype.deleteAllFiles = function () {
    localStorage.removeItem(ALL_FILES);
    localStorage.removeItem(FILE);
};

LocalStorageHelper.prototype.addCommitDiff = function (changedFiles) {
  localStorage.setItem(COMMIT_DIFF, JSON.stringify(changedFiles));
};

LocalStorageHelper.prototype.getCommitDiff = function () {
    return JSON.parse(localStorage.getItem(COMMIT_DIFF));
};

export default LocalStorageHelper;