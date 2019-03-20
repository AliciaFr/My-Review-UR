<template>
    <div class="ratings">
        <sui-segment>
            <p class="info">
                Bewertungen werden im Anschluss an ein erhaltenes Review verfasst. Die Bewertungen, die du erhalten hast sind nicht für andere sichtbar.</p>
            <sui-item-group divided>
                <sui-item id="single-review">
                    <sui-item-image size="mini" src="https://api.adorable.io/avatars/285/abott@adorable.png"/>
                    <sui-item-content>
                        <sui-item-header>Projektname</sui-item-header>
                        <sui-item-meta>
                            <span>username</span>
                        </sui-item-meta>
                        <sui-item-meta>
                            <span class="helpful positive">Dein Review wurde als hilfreich bewertet</span>
                        </sui-item-meta>
                        <sui-item-description>
                            <p>
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                            </p>
                        </sui-item-description>
                        <sui-item-extra>
                            <span>24.03.2019</span>
                        </sui-item-extra>
                    </sui-item-content>
                </sui-item>
                <sui-item  id="single-review">
                    <sui-item-image size="mini" src="https://api.adorable.io/avatars/285/abott@adorable.png"/>
                    <sui-item-content>
                        <sui-item-header>Projektname</sui-item-header>
                        <sui-item-meta>
                            <span>username</span>
                        </sui-item-meta>
                        <sui-item-meta>
                            <span class="helpful negative">Dein Review wurde als nicht hilfreich bewertet</span>
                        </sui-item-meta>
                        <sui-item-description>
                            <p>
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                            </p>
                        </sui-item-description>
                        <sui-item-extra>
                            <span>24.03.2019</span>
                        </sui-item-extra>
                    </sui-item-content>
                </sui-item>
            </sui-item-group>
        </sui-segment>
    </div>
</template>

<style>
    .info {
        padding-top: 2em;
        margin-bottom: 4em;
        padding-left: 2em;
    }

    .ratings {
        padding-top: 2em;
    }

    #single-review {
        padding-left: 2em;
    }

    .helpful.positive {
        color: green;
    }

    .helpful.negative {
        color: red;
    }
</style>