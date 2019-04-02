<template>
    <sui-list-item class="node-tree">
        <sui-icon :name="setIcon()" style="float:left;" @click="toggle"></sui-icon>
        <sui-list-content :class="{ bold: isFolder }">
            {{ node.name }}
        </sui-list-content>
        <sui-list v-show="open" v-if="isFolder">
            <node class="item" v-for="child in node.children" :node="child"></node>
        </sui-list>
    </sui-list-item>
</template>

<script>
    import { EventBus } from '../main';

    export default {
        name: "node",
        props: {
            node: Object
        },
        data: function() {
            return {
                open: false,
                fileInfo: {
                    name: this.node.name,
                    sha: this.node.sha,
                    path: this.node.path
                }
            };
        },
        computed: {
            isFolder: function () {
                return this.node.children && Object.keys(this.node.children).length;
            }
        },
        methods: {
            onFileClick: function () {
                if (!this.isFolder) {
                    EventBus.$emit('onFileClick', this.fileInfo);
                    console.log(this.node);
                }
            },
            toggle: function () {
                if (this.isFolder) {
                    this.open = !this.open;
                }
                this.onFileClick();
            },
            setIcon: function () {
                if (this.isFolder)  {
                    if (this.open) {
                        return 'folder open outline '
                    } else {
                        return 'folder outline';

                    }
                } else {
                    return 'file';
                }
            },
        }
    };
</script>

<style>
    .item {
        cursor: pointer;
    }
    .bold {
        font-weight: bold;
    }
</style>