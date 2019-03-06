/**
 * Created by Alicia on 03.03.2019.
 */
import Octokit from '@octokit/rest'
import _ from 'underscore'

let octokit;

export function initOctokit(token) {

}

export function getRepos(token, dbRefObject) {
    const octokit = new Octokit({
        auth: 'token ' + token
    });
    const login = 'UniRegensburg';
    octokit.repos.list({
        //visibility: "private"
    }).then(result => {
        for (let i = 0; i < result.data.length; i++) {
            if (_.isMatch(result.data[i]["owner"], {login: login})) {
                dbRefObject.set({
                    owner: result.data[i]["owner"].login,
                    name: result.data[i].name
                });
            }
        }
    })
}





