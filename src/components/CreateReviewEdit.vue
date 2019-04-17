<template>
    <div class="create-review-editor">
        <sui-menu attached="top">
            <sui-menu-item icon="sidebar" @click="toggleMenu" color="black" :active="menuIsActive"></sui-menu-item>
            <sui-menu-item ref="fileName">{{ fileName }}</sui-menu-item>
            <sui-menu-menu position="right">
                <sui-menu-item :class="{ hidden: checkListIsHidden }" icon="tasks" @click="toggleChecklist" :active="checklistIsActive">
                    Checkliste
                </sui-menu-item>
            </sui-menu-menu>
        </sui-menu>
        <sui-segment class="editor" attached="bottom" style="height: 500px; padding: 0">

            <sui-sidebar-pushable>
                <sui-sidebar animation="overlay" width="very wide" class="navigation" :visible="visibleChecklist"
                             direction="right">
                    <sui-header>Hast du an alles gedacht?</sui-header>
                    <sui-form>
                        <sui-form-fields grouped>
                            <label inverted>How often do you use checkboxes?</label>
                            <sui-form-field>
                                <sui-checkbox label="Once a week"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Once a week"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Once a week"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Once a week"></sui-checkbox>
                            </sui-form-field>
                        </sui-form-fields>
                        <sui-form-fields grouped>
                            <label>How often do you use checkboxes?</label>
                            <sui-form-field>
                                <sui-checkbox label="Once a week"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Once a week"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Once a week"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Once a week"></sui-checkbox>
                            </sui-form-field>
                        </sui-form-fields>
                    </sui-form>
                </sui-sidebar>
                <sui-sidebar-pusher @click="visibleChecklist = false; checklistIsActive = false">
                    <sui-sidebar-pushable>
                        <sui-sidebar animation="overlay" style="height: 500px!important;" width="wide"
                                     class="inverted navigation"
                                     :visible="visibleMenu">
                            <sui-header inverted>{{ repoName }}</sui-header>
                            <tree v-for="file in files" :tree-data="file"></tree>
                        </sui-sidebar>
                        <sui-sidebar-pusher @click="visibleMenu = false; menuIsActive = false">
                            <div class="ui container">
                                <div class="code-editor" ref="codeEditor" v-on:keyup="setLocalStorage()"></div>
                            </div>
                        </sui-sidebar-pusher>
                    </sui-sidebar-pushable>

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

    export default {
        props: {
            repoName: String,
            prevRoute: String,
            branchSha: String
        },
        data: function () {
            return {
                files: [],
                visibleMenu: true,
                menuIsActive: true,
                visibleChecklist: false,
                checklistIsActive: false,
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
            let self = this;
            this.getTree();
            if (this.prevRoute === 'reviews') {
                this.cmOption.readOnly = 'nocursor';
            }

            codemirror = new CodeMirror(this.$refs.codeEditor, this.cmOption);
            EventBus.$on('onFileClick', fileInfo => {
                myFileFetcherTask = new FileFetcherTask(octokitHelper, self.repoName, fileInfo.sha, function (file) {
                    if (localStorageHelper.getFile(fileInfo.name) !== null) {
                        codemirror.setValue(localStorageHelper.getFile(fileInfo.name).content);
                    } else {
                        codemirror.setValue(file);
                    }
                });
                myFileFetcherTask.run();
                this.visibleMenu = false;
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
            checkListIsHidden: function () {
                if (this.prevRoute === 'reviews') {
                    return true;
                }
                return false;
            }
        },
        methods: {
            getTree: function () {
                let self = this;
                let myRepoTreeFetcherTask = new RepoTreeFetcherTask(self.repoName, self.branchSha, octokitHelper, function (tree) {
                        self.files = tree;
                    }
                );
                myRepoTreeFetcherTask.run();
            },
            toggleMenu: function (event) {
                event.cancelBubble = true;
                this.visibleMenu = !this.visibleMenu;
                this.menuIsActive = !this.menuIsActive;
            },
            toggleChecklist: function () {
                event.cancelBubble = false;
                this.visibleChecklist = !this.visibleChecklist;
                this.checklistIsActive = !this.checklistIsActive;
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

    .navigation {
        padding-left: 2em;
        padding-right: 2em;
        padding-top: 1em;
    }

    body ::-webkit-scrollbar {
        height: 500px;
    }

    body ::-webkit-scrollbar-track {
        background: white;
    }

    .CodeMirror {
        height: auto;
        width: 100%;
    }

    .hidden {
        display: none!important;
    }

</style>