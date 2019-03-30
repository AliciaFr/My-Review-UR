<template>
    <div class="create-review-editor">


        <sui-menu attached="top">
            <sui-menu-item icon="sidebar" @click="toggleMenu">
            </sui-menu-item>
        </sui-menu>
        <sui-segment attached="bottom" style="height: 300px; padding: 0">
            <sui-sidebar-pushable>
                <sui-sidebar animation="overlay" width="wide" class="inverted" :visible="visible">
                        <tree v-for="file in getTree()" :tree-data="file"></tree>
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
    import Tree from '../components/CreateReviewFileStructure.vue';
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
            Tree
        },
        methods: {
            toggleMenu: function (event) {
                event.cancelBubble = true;
                this.visible = !this.visible;
            },
            getTree: function () {
                console.log(myRepoTreeFetchTask.currTree);
                return myRepoTreeFetchTask.currTree;
            }
        },
    }
</script>

<style>
    .create-review-editor {
        padding-top: 2em;
    }
</style>