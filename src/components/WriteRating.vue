<template>
    <div class="write-rating">
        <sui-grid :columns="16" stackable textAlign="left">
            <sui-grid-row stretched>
                <sui-grid-column :width="4"></sui-grid-column>
                <sui-grid-column :width="8">
                    <div>
                        <sui-message attached>
                            <sui-message-header>Schreibe eine Bewertung</sui-message-header>
                            <p>Gebe username Feedback zu dem Review und helfe ihr/ihm sich zu verbessern</p>
                        </sui-message>
                        <sui-segment attached>
                            <sui-form>
                                <sui-form-fields grouped>
                                <sui-form-field>
                                    <label>War das Review für dich hilfreich?</label>
                                    <sui-checkbox
                                            label="ja"
                                            radio
                                            value="1"
                                            v-model="value"
                                    />
                                    <sui-checkbox
                                            label="nein"
                                            radio
                                            value="0"
                                            v-model="value"
                                    />
                                </sui-form-field>

                                </sui-form-fields>
                                <sui-form-field>
                                    <label>Was möchtest du username mitteilen?</label>
                                    <textarea placeholder="Schreibe eine Bewertung."></textarea>
                                </sui-form-field>
                            </sui-form>
                        </sui-segment>
                        <sui-message attached>
                            <sui-button color="black">Bewerten</sui-button>

                        </sui-message>
                    </div>
                </sui-grid-column>
                <sui-grid-column :width="4"></sui-grid-column>
            </sui-grid-row>
        </sui-grid>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: '1',
            };
        }
    }
</script>

<style>
    .write-rating {
        padding-top: 5em;
    }
</style>













