<template>
    <sui-list-item class="node-tree">
        <div @click="toggle" :class="{ changedFile: node.changed }">
            <sui-icon :name="setIcon()" style="float:left;"></sui-icon>
            <sui-list-content :class="{ bold: isFolder }">
                {{ node.name }}
            </sui-list-content>
        </div>
        <sui-list class="subFolders" v-show="open" v-if="isFolder" :class="{  }">
            <node class="item nodeItem" v-for="child in node.children" :node="child"></node>
        </sui-list>
    </sui-list-item>
</template>

<script>
    import {EventBus} from '../main';

    export default {
        name: "node",
        props: {
            node: Object,
            changedFiles: Array
        },
        data: function () {
            return {
                open: false,
                fileInfo: {
                    name: this.node.name,
                    sha: this.node.sha,
                    path: this.node.path
                },
                didChange: false
            };
        },
        computed: {
            isFolder: function () {
                return this.node.children && Object.keys(this.node.children).length;
            }
        },
        methods: {
            /*isChangedFile: function () {
                    if (this.changedFiles.length !== 0) {
                        let stack = [], node, i;
                        stack.push(this.node);
                        while (stack.length > 0) {
                            node = stack.pop();
                            for (i = 0; i < this.changedFiles.length; i ++) {
                                if (node.name === this.changedFiles[i]) {
                                    this.didChange = true;
                                } else if (node.children && node.children.length) {
                                    for (i = 0; i < node.children.length; i ++) {
                                        stack.push(node.children[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            },*/
            onFileClick: function () {
                if (!this.isFolder) {
                    EventBus.$emit('onFileClick', this.fileInfo);
                }
            },
            toggle: function () {
                if (this.isFolder) {
                    this.open = !this.open;
                }
                this.onFileClick();
            },
            setIcon: function () {
                if (this.isFolder) {
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

    .subFolders {
        padding-top: 0 !important;
        padding-left: 1.5em !important;
    }

    .nodeItem {
        padding: 0 !important;
    }

    .changedFile {
        color: dodgerblue;
    }
</style>