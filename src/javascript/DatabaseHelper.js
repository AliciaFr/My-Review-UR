/**
 * Created by Alicia on 10.03.2019.
 */

let repos = [];

function DatabaseHelper() {
}

/* creates a database entry for the user */
DatabaseHelper.prototype.createAccount = function (dbRef, uid, username, profilePicture, gitHubName) {
    dbRef.child(uid).set({
        username: username,
        profile_picture: profilePicture,
        gitHubName: gitHubName
    })
};

/* Creates an entry for the repos */
DatabaseHelper.prototype.createRepo = function (dbRef, repoName, userUid, deadline) {
    dbRef.push({
        name: repoName,
        user: userUid,
        release_date: Date.now(),
        deadline: deadline
    })
};

/* gets the stored repos of a user */
DatabaseHelper.prototype.getAllRepos = function (dbRef) {
    let repoEntries = dbRef.ref('users');
    repoEntries.on('value', snap =>
        repos.push(snap.val())
    );
    console.log(repos);
    return repos;
};

DatabaseHelper.prototype.getAllUsers = function (dbRef) {
    let userEntries = dbRef.ref('users');
    userEntries.on('value', snap => console.log(snap.val()));

};

export default DatabaseHelper;