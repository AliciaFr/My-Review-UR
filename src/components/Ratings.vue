<template>
    <div class="ratings">
        <sui-segment>
    <sui-item-group divided>

        <sui-item>
            <sui-item-image size="mini" src="https://api.adorable.io/avatars/285/abott@adorable.png" />
            <sui-item-content>
                <sui-item-header>Projektname</sui-item-header>
                <sui-item-meta>
                    <span>username</span>
                </sui-item-meta>
                <sui-item-meta>
                    <span class="helpful">Dein Review wurde als hilfreich bewertet</span>
                </sui-item-meta>
                <sui-item-description>
                    <p>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                    </p>
                </sui-item-description>
                <sui-item-extra>
                    <sui-button>Zum Review</sui-button>
                </sui-item-extra>
            </sui-item-content>
        </sui-item>
        <sui-item>
            <sui-item-image size="mini" src="https://api.adorable.io/avatars/285/abott@adorable.png" />
            <sui-item-content>
                <sui-item-header>Projektname</sui-item-header>
                <sui-item-meta>
                    <span>username</span>
                </sui-item-meta>
                <sui-item-meta>
                    <span class="helpful">Dein Review wurde als hilfreich bewertet</span>
                </sui-item-meta>
                <sui-item-description>
                    <p>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                    </p>
                </sui-item-description>
                <sui-item-extra>
                    <sui-button>Zum Review</sui-button>
                </sui-item-extra>
            </sui-item-content>
        </sui-item>
    </sui-item-group>
        </sui-segment>
    </div>
</template>

<style>
    .ratings {
        padding-top: 2em;
    }
    .helpful {
        color: green;
    }
</style>