<template>
    <div class="messages">
        <nav-bar></nav-bar>
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