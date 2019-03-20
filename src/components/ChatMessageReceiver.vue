<template>
    <div class="chat-message-receiver">
        <sui-grid :columns="16">
            <sui-grid-row>
                <sui-grid-column :width="2">
                    <sui-image src="https://api.adorable.io/avatars/50/short-lived-seal" circular size="tiny"/>
                </sui-grid-column>
                <sui-grid-column :width="10">
                    <sui-segment id="sent-message">
                        <sui-item-group>
                            <sui-item>
                                <sui-item-content>
                                    <sui-item-meta>
                                        <span>short lived seal</span>
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
                <sui-grid-column :width="10">
                </sui-grid-column>
            </sui-grid-row>
        </sui-grid>
    </div>
</template>

<style>
</style>