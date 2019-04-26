<template>
    <div class="list-messages">
        <div class="messages">
            <sui-grid :columns="16" stackable textAlign="left">
                <sui-grid-row>
                    <sui-grid-column :width="3"></sui-grid-column>
                    <sui-grid-column :width="10">
                        <sui-header size="huge">Deine Nachrichten</sui-header>
                    </sui-grid-column>
                    <sui-grid-column :width="3"></sui-grid-column>
                </sui-grid-row>
                <sui-grid-row stretched>
                    <sui-grid-column :width="3"></sui-grid-column>
                    <sui-grid-column :width="10">
                        <sui-segment>
                            <single-message></single-message>
                            <single-message></single-message>
                            <single-message></single-message>
                            <single-message></single-message>
                        </sui-segment>
                    </sui-grid-column>
                    <sui-grid-column :width="3"></sui-grid-column>
                </sui-grid-row>
            </sui-grid>
        </div>
    </div>
</template>

<script>
    import singleMessage from './MessagesListEntry.vue'
    import messenger from './SingleChat.vue'
    export default {
        components: {
            'single-message': singleMessage,
            'messenger': messenger
        }
    }
</script>

<style>
    .list-messages {
        padding-bottom: 15em;
    }
</style>