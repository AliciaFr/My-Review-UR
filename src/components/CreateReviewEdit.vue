<template>
    <div class="create-review-editor">
        <sui-menu attached="top">
            <sui-menu-item icon="sidebar" @click="toggleMenu"></sui-menu-item>
            <sui-menu-item ref="fileName">{{ fileName }}</sui-menu-item>
        </sui-menu>
        <sui-segment attached="bottom" style="height: 300px; padding: 0">
            <sui-sidebar-pushable>
                <sui-sidebar animation="overlay" width="wide" class="inverted" :visible="visible">
                    <tree v-for="file in getTree" :tree-data="file"></tree>
                </sui-sidebar>
                <sui-sidebar-pusher @click="visible = false">
                    <div class="ui container">
                        <div class="code-editor" ref="mirrorr" v-on:keyup="setLocalStorage()"></div>
                    </div>
                </sui-sidebar-pusher>
            </sui-sidebar-pushable>
        </sui-segment>
    </div>

</template>

<script>
    import {EventBus} from '../main';
    import 'semantic-ui-css/semantic.min.css';
    import Tree from '../components/CreateReviewFileStructure.vue';
    import RepoTreeFetcherTask from '../javascript/github/RepoTreeFetcherTask';
    import FileFetcherTask from '../javascript/FileFetcherTask';
    import OctokitHelper from '../javascript/github/OctokitHelper';
    import CodeMirrorHelper from '../javascript/CodeMirrorHelper';
    import LocalStorageHelper from '../javascript/LocalStorageHelper';
    import CodeMirror from 'codemirror';

    import 'codemirror/mode/javascript/javascript.js';
    import 'codemirror/mode/htmlmixed/htmlmixed';
    import 'codemirror/mode/css/css';
    import 'codemirror/theme/idea.css';
    import 'codemirror/lib/codemirror.css';

    let octokitHelper = new OctokitHelper(),
        codeMirrorHelper = new CodeMirrorHelper(),
        localStorageHelper = new LocalStorageHelper(),
        myFileFetcherTask,
        codemirror;

    let myRepoTreeFetchTask = new RepoTreeFetcherTask(octokitHelper, function (tree) {
            return tree;
        }
    );


    myRepoTreeFetchTask.run();

    export default {
        data: function () {
            return {
                files: [],
                visible: true,
                code: '',
                fileName: '',
                fileSha: '',
                filePath: '',
                cmOption: {
                    tabSize: 4,
                    styleActiveLine: true,
                    lineNumbers: true,
                    line: true,
                    foldGutter: true,
                    styleSelectedText: true,
                    matchBrackets: true,
                    showCursorWhenSelecting: true,
                    theme: "idea",
                    extraKeys: {"Ctrl": "autocomplete"},
                    hintOptions: {
                        completeSingle: false
                    }
                }

            }
        },
        mounted() {
            codemirror = new CodeMirror(this.$refs.mirrorr, this.cmOption);
            EventBus.$on('onFileClick', fileInfo => {
                myFileFetcherTask = new FileFetcherTask(octokitHelper, 'u03-birdingapp-ws-2017-18-AliciaFr', fileInfo.sha, function (file) {
                    if (localStorageHelper.getFile(fileInfo.name) !== null) {
                        codemirror.setValue(localStorageHelper.getFile(fileInfo.name).content);
                    } else {
                        codemirror.setValue(myFileFetcherTask.currFile);
                    }
                    //localStorageHelper.addEntry(fileInfo.name, fileInfo.sha, fileInfo.path, "Hallo :)");
                    console.log(localStorageHelper.getAllFiles());
                    //console.log(localStorageHelper.getFile(fileInfo.name))
                });
                myFileFetcherTask.run();
                this.visible = false;
                this.fileName = fileInfo.name;
                this.fileSha = fileInfo.sha;
                this.filePath = fileInfo.path;
                codemirror.setOption("mode", codeMirrorHelper.switchMode(fileInfo.name));
            });
        },
        components: {
            Tree
        },
        computed: {
            getTree: function () {
                return myRepoTreeFetchTask.currTree;
            },

        },
        methods: {
            toggleMenu: function (event) {
                event.cancelBubble = true;
                this.visible = !this.visible;
            },
            setLocalStorage: function () {
                if (localStorageHelper.getFile(this.fileName) !== null) {
                    localStorageHelper.updateFileContent(this.fileName, codemirror.getValue());
                } else {
                    localStorageHelper.addEntry(this.fileName, this.fileSha, this.filePath, codemirror.getValue());
                }
            }
        },
    }
</script>

<style>
    .create-review-editor {
        padding-top: 2em;
    }
    div.pushable {
        overflow: hidden;
    }
</style>