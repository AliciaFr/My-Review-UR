<template>
    <div class="share-project">
        <sui-grid :columns="16" stackable textAlign="left">
            <sui-grid-row stretched>
                <sui-grid-column :width="4"></sui-grid-column>
                <sui-grid-column :width="8">
                    <div>
                        <sui-message attached>
                            <sui-message-header>Freigabe Deines Projekts</sui-message-header>
                            <p>
                                Um ein Review für dein Projekt zu erhalten, musst du zunächst dieses Formular ausfüllen und absenden.
                            </p>
                        </sui-message>
                        <sui-segment attached>
                            <sui-form>
                                <sui-form-field>
                                    <label>Testing-Fehler</label>
                                    <textarea placeholder="Beschreibe bitte kurz eventuelle Fehler, die beim Testen deines Projekts aufgetreten sind."></textarea>
                                </sui-form-field>
                                <sui-form-field>
                                    <label>Zusätzliche, von dir implementierte Erweiterungen</label>
                                    <textarea
                                            placeholder="Bechreibe eventuelle funktionale Erweiterungen deines Projekts, die über die Mindestanforderungen hinaus gehen"></textarea>
                                </sui-form-field>
                            </sui-form>
                            <sui-message warning icon="warning circle">
                                <sui-message-header>Achtung!</sui-message-header>
                                <sui-message-content>Mit Absenden des Formulars erklärst du dich damit einverstanden, dass dein Code von deinen Kommilitonen eingesehen werden darf. Du, sowie dein Reviewer, bleibt dabei allerdings anonym.</sui-message-content>
                            </sui-message>
                        </sui-segment>
                        <sui-message attached>
                            <sui-button color="black">Projekt freigeben</sui-button>

                        </sui-message>
                    </div>
                </sui-grid-column>
                <sui-grid-column :width="4"></sui-grid-column>
            </sui-grid-row>
        </sui-grid>
    </div>
</template>

<style>
    .share-project {
        padding-top: 5em;
    }
</style>













