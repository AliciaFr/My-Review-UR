<template>
    <div class="messenger">
        <div class="back-to-messages">
            <sui-header size="small">
                <sui-icon name="left arrow" color="grey" />
                <sui-header-content>Nachrichten</sui-header-content>
            </sui-header>
        </div>
        <div class="enter-new-message">
            <sui-grid :columns="16">
                <sui-grid-row>
                    <sui-grid-column :width="4">
                    </sui-grid-column>
                    <sui-grid-column :width="10">
                        <sui-segment emphasis="secondary" id="sent-message">
                            <sui-form>
                                <sui-form-field>
                                    <textarea placeholder="Schreibe eine neue Nachricht."></textarea>
                                </sui-form-field>
                                <sui-button basic color="black">Nachricht senden</sui-button>
                            </sui-form>
                        </sui-segment>
                    </sui-grid-column>
                    <sui-grid-column :width="2">
                        <sui-image src="https://api.adorable.io/avatars/285/abott@adorable.png" circular size="tiny"/>
                    </sui-grid-column>
                </sui-grid-row>
            </sui-grid>
        </div>
        <message-divider></message-divider>
        <div class="messages">
            <message-sender></message-sender>
            <message-receiver></message-receiver>
        </div>
    </div>
</template>

<script>
    import messageSender from './ChatMessageSender.vue'
    import messageReceiver from './ChatMessageReceiver.vue'
    import messageDivider from './ChatMessageDivider.vue'

    export default {
        components: {
            'message-sender': messageSender,
            'message-receiver': messageReceiver,
            'message-divider': messageDivider
        }
    }
</script>

<style>
    .enter-new-message {
        padding-top: 5em;
    }
</style>