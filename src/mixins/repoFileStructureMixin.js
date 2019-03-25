/**
 * Created by Alicia on 25.03.2019.
 */

import RepoTreeFetcherTask from '../javascript/RepoTreeFetcherTask';
import OctokitHelper from '../javascript/OctokitHelper';

let octokitHelper = new OctokitHelper();

export default {
    methods: {
        getRepoFileStructure: function () {
            let myRepoTreeFetchTask = new RepoTreeFetcherTask(octokitHelper, onTreeAvailable);
            myRepoTreeFetchTask.run();
        }
    }
}


function onTreeAvailable(tree) {
    console.log(tree);
}

