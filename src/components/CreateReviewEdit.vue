<template>
    <div class="create-review-editor">
        <sui-menu attached="top">
            <a class="item" @click="visible = true">
                <i class="sidebar icon"></i>
                Ordnerstruktur
            </a>
        </sui-menu>
        <sui-sidebar-pushable>
            <sui-sidebar animation="overlay" :visible="visible">
                <file-structure></file-structure>
            </sui-sidebar>

        </sui-sidebar-pushable>
    </div>

</template>

<script>
    import 'semantic-ui-css/semantic.min.css';
    import fileStructure from '../components/CreateReviewFileStructure.vue'
    export default {
        data: () => ({
            visible: false
        }),
        components: {
            'file-structure': fileStructure
        }
    }
</script>

<style>
    .create-review-editor {
        padding-top: 2em;
    }
</style>