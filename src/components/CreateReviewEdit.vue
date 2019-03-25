<template>
    <div class="create-review-editor">


        <sui-menu attached="top">
            <sui-menu-item icon="sidebar" @click="toggleMenu">
            </sui-menu-item>
        </sui-menu>
        <sui-segment attached="bottom" style="height: 300px; padding: 0">
            <sui-sidebar-pushable>
                <sui-sidebar animation="overlay" class="inverted" width="wide" :visible="visible">
                    <file-structure></file-structure>
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
    import fileStructure from '../components/CreateReviewFileStructure.vue';
    export default {
        data: () => ({
            visible: true
        }),
        components: {
            'file-structure': fileStructure
        },
        methods: {
            toggleMenu: function (event) {
                event.cancelBubble = true;
                this.visible = !this.visible;
            }
        }
    }
</script>

<style>
    .create-review-editor {
        padding-top: 2em;
    }
</style>