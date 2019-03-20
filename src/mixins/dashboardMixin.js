/**
 * Created by Alicia on 16.03.2019.
 */

/**
 * Created by Alicia on 03.03.2019.
 */
import firebase from 'firebase';
import DatabaseHelper from '../javascript/DatabaseHelper';
import OctokitHelper from '../javascript/OctokitHelper';

const databaseHelper = new DatabaseHelper(),
    octokitHelper = new OctokitHelper();

let dbRepos;


export default {
    methods: {
        userRepos: function () {
            console.log(databaseHelper.getAllRepos(firebase.database()));
            octokitHelper.getUserRepos("uniregensburgreview", localStorage.getItem("gitHubLogin"));
            console.log(JSON.parse(localStorage.getItem("repos")));
        }
    }
}

