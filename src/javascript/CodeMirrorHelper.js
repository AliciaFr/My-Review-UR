/**
 * Created by Alicia on 30.03.2019.
 */

import OctokitHelper from './github/OctokitHelper';
import FileFetcherTask from './FileFetcherTask';

function CodeMirrorHelper() {
}

CodeMirrorHelper.prototype.switchMode = function (file) {
    let fileEnding = file.split('.').pop();
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
        localStorage.setItem(fileName, codemirror.getValue());
    });
};

export default CodeMirrorHelper;
