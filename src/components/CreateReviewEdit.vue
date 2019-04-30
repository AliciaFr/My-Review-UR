<template>
    <div class="create-review-editor">
        <sui-menu attached="top">
            <sui-menu-item icon="sidebar" @click="toggleMenu" color="black" :active="menuIsActive"></sui-menu-item>
            <sui-menu-item ref="fileName">
                {{ fileName }}
            </sui-menu-item>
            <sui-menu-menu position="right">
                <sui-menu-item :class="{ hidden: checkListIsHidden }" icon="tasks" @click="toggleChecklist"
                               :active="checklistIsActive">
                    Checkliste
                </sui-menu-item>
            </sui-menu-menu>
        </sui-menu>
        <sui-segment class="editor" attached="bottom" style="height: 500px; padding: 0">

            <sui-sidebar-pushable>
                <sui-sidebar animation="push" width="very wide" class="navigation" :visible="visibleChecklist"
                             direction="right">
                    <sui-header>Hast du an alles gedacht?</sui-header>
                    <sui-form>
                        <sui-form-fields grouped>
                            <sui-form-field>
                                <sui-checkbox label="Duplikate vermeiden"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Einhaltung von Coding Konventionen"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Verwendung von Coding Best Practices"></sui-checkbox>
                            </sui-form-field>
                             <sui-form-field>
                                <sui-checkbox label="Verständlichkeit des Codes"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Sinnvolle Bezeichner für Methoden, Variablen, etc."></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Architektur"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Documentation: Ist alles kommentiert? Ergeben die Kommentare Sinn?"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Performanz"></sui-checkbox>
                            </sui-form-field>
                            <sui-form-field>
                                <sui-checkbox label="Logische Fehler, Bugs"></sui-checkbox>
                            </sui-form-field>    
                        </sui-form-fields>
                    </sui-form>
                </sui-sidebar>
                <sui-sidebar-pusher @click="visibleChecklist = false; checklistIsActive = false">
                    <sui-sidebar-pushable>
                        <sui-sidebar animation="push" width="wide"
                                     class="inverted navigation"
                                     :visible="visibleMenu">
                            <sui-header inverted>{{ repoTitle }}</sui-header>
                            <div v-if="files.length < 1">
                                <sui-icon name="circle notched inverted" loading size="big"></sui-icon>
                                <span class="loading-project">Das Projekt wird geladen.</span>
                            </div>
                            <div v-else>
                            <tree v-for="file in files" :tree-data="file" :changedFiles="changedFilePath"></tree>
                            </div>
                        </sui-sidebar>
                        <sui-sidebar-pusher @click="visibleMenu = false; menuIsActive = false">
                            <div :class="{ ui: true, container: true, emptyEditor: isEmptyEditor }">
                                <div :class="{emptyEditor: isEmptyEditor }" ref="codeEditor" v-on:keyup="setLocalStorage()"></div>
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
    import _ from 'underscore';
    import CodeMirror from 'codemirror';

    import 'codemirror/lib/codemirror.css';
    import 'codemirror/mode/javascript/javascript.js';
    import 'codemirror/mode/clike/clike.js';
    import 'codemirror/mode/htmlmixed/htmlmixed';
    import 'codemirror/mode/css/css';
    import 'codemirror/theme/idea.css';
    import 'codemirror/theme/base16-light.css';
    import 'codemirror/theme/neo.css';

    const CODE_ADDITION_LINE_NUMBER_COLOR = "#156615",
        CODE_ADDITION_CLASS = "styled-background";

    let octokitHelper = new OctokitHelper(),
        localStorageHelper = new LocalStorageHelper(),
        myFileFetcherTask,
        codemirror,
        codemirrorHelper = new CodeMirrorHelper();

    export default {
        props: {
            completeRepoName: String,
            repoTitle: String,
            prevRoute: String,
            branchSha: String,
            beforeReviewSha: String
        },
        data: function () {
            return {
                files: [],
                tree: {},
                changedFilePath: [],
                visibleMenu: true,
                menuIsActive: true,
                visibleChecklist: false,
                checklistIsActive: false,
                code: '',
                fileName: '',
                fileSha: '',
                filePath: '',
                isEmptyEditor: false,
                repoName: this.completeRepoName,
                cmOption: {
                    addModeClass: true,
                    tabSize: 4,
                    styleActiveLine: {nonEmpty: true},
                    styleActiveSelected: true,
                    lineNumbers: true,
                    line: true,
                    foldGutter: true,
                    styleSelectedText: true,
                    matchBrackets: true,
                    showCursorWhenSelecting: true,
                    theme: "neo",
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
            if (this.prevRoute === 'reviews') {
                this.cmOption.readOnly = 'nocursor';
                this.getDifference();
                this.getTreeForReviewReader();
            } else {
                this.getTreeForReviewer();
            }
            this.initCodeMirror();
            if (codemirror.getValue() === "") {
                this.isEmptyEditor = true;
            }
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
            getTreeForReviewer: function () {
                let self = this;
                let myRepoTreeFetcherTask = new RepoTreeFetcherTask(self.completeRepoName, self.branchSha, octokitHelper, function (tree) {
                    self.files = tree;
                });
                myRepoTreeFetcherTask.run();
            },
            getTreeForReviewReader: function () {
                let self = this;
                console.log(this.beforeReviewSha);
                octokitHelper.getRepoTreeWithMarkedChanges(this.completeRepoName, this.beforeReviewSha, this.branchSha, function (tree) {
                    self.files = tree;
                });
            },
            toggleMenu: function (event) {
                if (this.visibleChecklist === true) {
                    this.visibleChecklist = false;
                    this.checklistIsActive = false;
                }
                event.cancelBubble = true;
                this.visibleMenu = !this.visibleMenu;
                this.menuIsActive = !this.menuIsActive;
            },
            toggleChecklist: function () {
            if (this.visibleMenu === true) {
                    this.visibleMenu = false;
                    this.menuIsActive = false;
                }
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
                this.isEmptyEditor = false;
                let self = this;
                EventBus.$on('onFileClick', fileInfo => {
                    let changedFiles = localStorageHelper.getCommitDiff();
                    console.log(changedFiles);
                    codemirror.setOption("mode", codemirrorHelper.switchMode(fileInfo.name));
                    console.log(codemirror.mode);
                    myFileFetcherTask = new FileFetcherTask(octokitHelper, self.repoName, fileInfo.sha, function (file) {
                        if (localStorageHelper.getFile(fileInfo.name) !== null) {
                            codemirror.setValue(localStorageHelper.getFile(fileInfo.name).content);
                        } else {
                            codemirror.setValue(file);
                        }
                        if (self.prevRoute === "reviews") {
                            self.markChangedLines(changedFiles, fileInfo.name);
                        }
                    });
                    myFileFetcherTask.run();
                    self.setData(fileInfo);
                    this.menuIsActive = false;
                });
            },
            getDifference: function () {
                let completeRepoName = this.repoName;
                console.log(completeRepoName);
                octokitHelper.getCommitDiff(completeRepoName,'20021e233f33f44b317720abf4267650d2da78b9', '30f347b96ff1ec23b05fa8d135114e5ea79c6745', function (changedFiles) {
                    localStorageHelper.addCommitDiff(changedFiles);
                });

            },
            markChangedLines: function (changedFiles, currFile) {
                let testChangedFiles = [
                    {
                        additions: [
                            {
                                content: "",
                                line: "1"
                            },
                            {
                                content: "",
                                line: "15"
                            },
                            {
                                content: "",
                                line: "16"
                            },
                            {
                                content: "",
                                line: "17"
                            },
                            {
                                content: "",
                                line: "18"
                            },
                            {
                                content: "",
                                line: "19"
                            },
                            {
                                content: "",
                                line: "20"
                            },
                            {
                                content: "",
                                line: "21"
                            },
                            {
                                content: "",
                                line: "22"
                            },
                            {
                                content: "",
                                line: "23"
                            },
                            {
                                content: "",
                                line: "33"
                            },
                            {
                                content: "",
                                line: "38"
                            },
                            {
                                content: "",
                                line: "43"
                            },
                            {
                                content: "",
                                line: "93"
                            },
                            {
                                content: "",
                                line: "94"
                            },
                            {
                                content: "",
                                line: "95"
                            },
                            {
                                content: "",
                                line: "96"
                            },
                            {
                                content: "",
                                line: "97"
                            },
                            {
                                content: "",
                                line: "98"
                            },
                            {
                                content: "",
                                line: "99"
                            },
                            {
                                content: "",
                                line: "100"
                            },
                            {
                                content: "",
                                line: "101"
                            },
                            {
                                content: "",
                                line: "102"
                            },
                            {
                                content: "",
                                line: "103"
                            },
                            {
                                content: "",
                                line: "104"
                            },
                            {
                                content: "",
                                line: "105"
                            },
                            {
                                content: "",
                                line: "106"
                            }
                        ],
                        file: "PitManager.java",
                        filePath: "PitManager.java"
                    },
                    {
                        additions: [
                            {
                                content: "",
                                line: "1"
                            },
                            {
                                content: "",
                                line: "12"
                            },
                            {
                                content: "",
                                line: "13"
                            },
                            {
                                content: "",
                                line: "18"
                            },
                            {
                                content: "",
                                line: "48"
                            },
                            {
                                content: "",
                                line: "84"
                            }
                        ],
                        file: "Player.java",
                        filePath: "Player.java"
                    }
                ]
                for (let i = 0; i < testChangedFiles.length; i++) {
                    if (currFile === testChangedFiles[i].file) {
                        let additions = testChangedFiles[i].additions;
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

    body ::-webkit-scrollbar-track {
        background: white;
    }

    .CodeMirror {
        height: auto;
        width: 100%;
    }
    
    .CodeMirror-scroll {
        min-height: 500px;
    }
    
    .emptyEditor {
        height: 500px !important;
    }

    .hidden {
        display: none !important;
    }

    .styled-background {
        background-color: #e6ffed;
    }

    .loading-project {
        color: #fff;
    }
</style>