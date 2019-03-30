<template>
    <div class="tree-menu">
        <li>
            <div
                    :class="{ bold: isFolder() }"
                    @click="toggle"
            >
                {{ item.path }}
                <span v-if="isFolder()">[{{ isOpen ? '-' : '+' }}]</span>
            </div>
            <ul v-show="isOpen" v-if="isFolder()">
                <div
                        class="item"
                        v-for="(child, index) in item.children"
                        :key="index"
                        :item="child"
                >{{ child.path }}</div>
            </ul>
        </li>
    </div>

</template>
<script>
    export default {
        props: {
            item: Object
        },
        data: function () {
            return {
                isOpen: false,
            }
        },
        name: 'tree-menu',
        computed: {

        },
        methods: {
            isFolder: function () {
                return this.item.children && this.item.children.length;
            },
            toggle: function () {
                if (this.isFolder()) {
                    this.isOpen = !this.isOpen
                }
            }
        }
    }
</script>

<style>

</style>