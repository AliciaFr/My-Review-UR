<template>
    <div class="messages">
        <list-messages></list-messages>
    </div>
</template>

<script>
    import listMessages from '../components/ListMessages.vue';
    import navBar from '../components/NavBar.vue';

    export default {
        components: {
            'nav-bar': navBar,
            'list-messages': listMessages
        }
    }
</script>

<style>
    .messages {
        padding-top: 5em;
        padding-bottom: 10em;
    }
</style>