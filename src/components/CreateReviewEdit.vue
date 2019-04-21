<template>
    <div class="create-review-editor">
        <sui-menu attached="top">
            <sui-menu-item icon="sidebar" @click="toggleMenu" color="black" :active="menuIsActive"></sui-menu-item>
            <sui-menu-item ref="fileName">{{ fileName }}</sui-menu-item>
            <sui-menu-menu position="right">
                <sui-menu-item :class="{ hidden: checkListIsHidden }" icon="tasks" @click="toggleChecklist"
                               :active="checklistIsActive">
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

    const CODE_ADDITION_LINE_NUMBER_COLOR = "#156615",
        CODE_ADDITION_LINE_COLOR = "#bef5cb",
        CODE_ADDITION_CLASS = "styled-background";

    let octokitHelper = new OctokitHelper(),
        localStorageHelper = new LocalStorageHelper(),
        myFileFetcherTask,
        codemirror;

    export default {
        props: {
            repoName: String,
            prevRoute: String,
            branchSha: String,
            beforeReviewSha: String
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
                    styleActiveLine: {nonEmpty: true},
                    styleActiveSelected: true,
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
                    },
                    highlightDifferences: true,
                    gutters: ["CodeMirror-linenumbers", "add", "delete"]
                }

            }
        },
        mounted() {
            let self = this;
            this.getTree();
            if (this.prevRoute === 'reviews') {
                this.cmOption.readOnly = 'nocursor';
                this.getDifference();
            }
            this.initCodeMirror();
            this.handleOnFileClicked();

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
            setData: function (fileInfo) {
                this.visibleMenu = false;
                this.fileName = fileInfo.name;
                this.fileSha = fileInfo.sha;
                this.filePath = fileInfo.path;
            },
            initCodeMirror: function () {
                codemirror = new CodeMirror(this.$refs.codeEditor, this.cmOption);
            },
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
            },
            handleOnFileClicked: function () {
                let self = this;
                EventBus.$on('onFileClick', fileInfo => {
                    let changedFiles = localStorageHelper.getCommitDiff();
                    myFileFetcherTask = new FileFetcherTask(octokitHelper, self.repoName, fileInfo.sha, function (file) {
                        if (localStorageHelper.getFile(fileInfo.name) !== null) {
                            codemirror.setValue(localStorageHelper.getFile(fileInfo.name).content);
                        } else {
                            codemirror.setValue(file);
                        }
                        if (changedFiles !== null) {
                            self.markChangedLines(changedFiles, fileInfo.name);
                        }
                    });
                    myFileFetcherTask.run();
                    self.setData(fileInfo);
                });
            },
            getDifference: function () {
                octokitHelper.getCommitDiff('Android-UE-03-AliciaFr', this.beforeReviewSha, this.branchSha, function (changedFiles) {
                    localStorageHelper.addCommitDiff(changedFiles);
                });

            },
            markChangedLines: function (changedFiles, currFile) {
                for (let i = 0; i < changedFiles.length; i++) {
                    if (currFile === changedFiles[i].file) {
                        let additions = changedFiles[i].additions;
                        for (let i = 0; i < additions.length; i++) {
                            codemirror.getDoc().addLineClass(additions[i].line - 1, "background", CODE_ADDITION_CLASS);
                            let info = codemirror.getDoc().lineInfo(additions[i].line - 1);
                            codemirror.getDoc().setGutterMarker(additions[i].line - 1, "add", info.gutterMarkers ? null : this.makeMarker());

                        }
                    }
                }
            },
            makeMarker: function () {
                let marker = document.createElement("div");
                marker.style.color = CODE_ADDITION_LINE_NUMBER_COLOR;
                marker.style.background = CODE_ADDITION_LINE_NUMBER_COLOR;
                marker.style.opacity = "0.5";
                marker.style.marginLeft = "-2.3em";
                marker.style.fontWeight = "bold";
                marker.style.textAlign = "center";
                marker.innerHTML = "+";
                return marker;
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
        display: none !important;
    }

    .styled-background {
        background-color: #e6ffed;
    }
</style>