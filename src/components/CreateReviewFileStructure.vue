<template>
    <div class="tree">
        <sui-list class="tree-list">
            <node-tree :node="treeData" :changedFiles="changedFiles"></node-tree>
        </sui-list>
    </div>
</template>

<script>
    import NodeTree from "./NodeTree";

    export default {
        props: {
            treeData: Object,
            changedFiles: Array
        },
        components: {
            NodeTree
        }
    };
</script>