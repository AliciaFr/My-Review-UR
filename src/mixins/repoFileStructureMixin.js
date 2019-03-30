/**
 * Created by Alicia on 25.03.2019.
 */

import RepoTreeFetcherTask from '../javascript/github/RepoTreeFetcherTask';
import OctokitHelper from '../javascript/github/OctokitHelper';

let octokitHelper = new OctokitHelper();

export default {
    methods: {
        getRepoFileStructure: function () {
            let myRepoTreeFetchTask = new RepoTreeFetcherTask(octokitHelper, function (tree) {
                    console.log(tree);
                }
            );
            myRepoTreeFetchTask.run();
        }

    }
}




