<template>
    <div class="chat-message-sender">
        <sui-grid :columns="16">
            <sui-grid-row>
                <sui-grid-column :width="4">
                </sui-grid-column>
                <sui-grid-column :width="10">
                    <sui-segment emphasis="secondary" id="sent-message">
                        <sui-item-group>
                            <sui-item>

                                <sui-item-content>
                                    <sui-item-meta>
                                        <span>Du</span>
                                    </sui-item-meta>
                                    <sui-item-description>
                                        <p>
                                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                                            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                                        </p>
                                    </sui-item-description>
                                    <sui-item-extra>
                                        27.04.2019
                                    </sui-item-extra>
                                </sui-item-content>
                            </sui-item>
                        </sui-item-group>
                    </sui-segment>
                </sui-grid-column>
                <sui-grid-column :width="2">
                    <sui-image src="https://api.adorable.io/avatars/285/abott@adorable.png" circular size="tiny"/>
                </sui-grid-column>
            </sui-grid-row>
        </sui-grid>
    </div>
</template>

<style>
    #sent-message {
        color: #2c3e50;
    }
</style>