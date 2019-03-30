<template>
    <div class="messages">
        <list-messages></list-messages>
    </div>
</template>

<script>
    import listMessages from '../components/ListMessages.vue';

    export default {
        components: {
            'list-messages': listMessages
        }
    }
</script>