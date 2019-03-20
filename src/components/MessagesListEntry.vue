<template>
    <sui-segment vertical :padded="true">
        <sui-grid :columns="16" stackable id="messages-list-entry">
            <sui-grid-row>
                <sui-grid-column :width="2">
                    <sui-image src="https://api.adorable.io/avatars/285/abott@adorable.png" circular size="mini"/>
                </sui-grid-column>
                <sui-grid-column :width="4">
                    <div>
                        <sui-header-subheader>caretaker chinchilla</sui-header-subheader>
                        <span>27.03.2019</span>
                    </div>
                </sui-grid-column>
                <sui-grid-column :width="10">
                    <p>Ich habe noch eine Frage zu dem Review. Und zwar, was meinst du </p>
                </sui-grid-column>
            </sui-grid-row>
        </sui-grid>
    </sui-segment>
</template>

<style>
    #messages-list-entry {
        margin-left: 1em;
        margin-right: 1em;
    }
</style>