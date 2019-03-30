<template>
    <div class="create-review-editor">


        <sui-menu attached="top">
            <sui-menu-item icon="sidebar" @click="toggleMenu">
            </sui-menu-item>
        </sui-menu>
        <sui-segment attached="bottom" style="height: 300px; padding: 0">
            <sui-sidebar-pushable>
                <sui-sidebar animation="overlay" class="inverted" width="wide" :visible="visible">
                    <!--<tree-menu :label="tree.label" :nodes="tree.nodes" :depth="0">

                    </tree-menu>-->

                    <sui-list>
                        <tree-menu  v-for="file in getTree()"
                                class="item"
                                :item="file"
                        ></tree-menu>
                    </sui-list>
                </sui-sidebar>
                <sui-sidebar-pusher @click="visible = false">
                    <div class="ui container">
                    </div>
                </sui-sidebar-pusher>
            </sui-sidebar-pushable>
        </sui-segment>

    </div>

</template>

<script>
    import 'semantic-ui-css/semantic.min.css';
    import TreeMenu from '../components/CreateReviewFileStructure.vue';
    import RepoTreeFetcherTask from '../javascript/github/RepoTreeFetcherTask';
    import OctokitHelper from '../javascript/github/OctokitHelper';

    let octokitHelper = new OctokitHelper();

    let myRepoTreeFetchTask = new RepoTreeFetcherTask(octokitHelper, function (tree) {
            return tree;
        }
    );
    myRepoTreeFetchTask.run();
    export default {
        data: () => ({
            files: [],
            visible: true
        }),
        components: {
            TreeMenu
        },
        methods: {
            toggleMenu: function (event) {
                event.cancelBubble = true;
                this.visible = !this.visible;
            },
            getTree: function () {
                console.log(myRepoTreeFetchTask.currTree);
                /*let obj = {};
                for (let key in myRepoTreeFetchTask.currTree) {
                    if (myRepoTreeFetchTask.currTree.hasOwnProperty(key)) {
                        obj.name = key.value;
                    }
                }
                console.log(obj);*/
                return myRepoTreeFetchTask.currTree;
            }
        },
    }
</script>

<style>
    .create-review-editor {
        padding-top: 2em;
    }

    .item {
        cursor: pointer;
        text-align: left;
    }

    .bold {
        font-weight: bold;
    }

    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }
</style>