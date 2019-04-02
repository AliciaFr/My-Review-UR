/**
 * Created by Alicia on 30.03.2019.
 */

import OctokitHelper from './github/OctokitHelper';
import FileFetcherTask from './FileFetcherTask';

let myOctokitHelper = new OctokitHelper();

function CodeMirrorHelper() {
    //myOctokitHelper.getFile("u03-birdingapp-ws-2017-18-AliciaFr", '3ea3a10b6e8c6a06e687731ad4fe21e4b51619f1');
}

CodeMirrorHelper.prototype.setEditorValue = function () {

};

CodeMirrorHelper.prototype.switchMode = function (file) {
    let fileEnding = file.split('.').pop();
    console.log(fileEnding);
    switch (fileEnding) {
        case 'js':
            return 'text/javascript';
        case 'html':
            return 'htmlmixed';
        case 'css':
            return 'text/css';
        case 'php':
            return 'application/x-httpd-php';
        default:
            return 'text/javascript';
    }
};

CodeMirrorHelper.prototype.setLocalStorage = function(codemirror, fileName) {
    codemirror.on("change", function(cm, change) {
        console.log(change);
        localStorage.setItem(fileName, codemirror.getValue());
    });
};

export default CodeMirrorHelper;
