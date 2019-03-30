<template>
    <div class="reviews">
        <sui-segment>
            <sui-item-group divided>
                <sui-item id="single-review">
                    <sui-item-image size="mini" src="https://api.adorable.io/avatars/285/abott@adorable.png"/>
                    <sui-item-content>
                        <sui-item-header>Projektname</sui-item-header>
                        <sui-item-meta>
                            <span>username</span>
                        </sui-item-meta>
                        <sui-item-description>
                           <sui-button basic color="black">Zum Review</sui-button>
                        </sui-item-description>
                        <sui-item-extra>
                            <span>24.03.2019</span>
                        </sui-item-extra>
                    </sui-item-content>
                </sui-item>
                <sui-item id="single-review">
                    <sui-item-image size="mini" src="https://api.adorable.io/avatars/285/abott@adorable.png"/>
                    <sui-item-content>
                        <sui-item-header>Projektname</sui-item-header>
                        <sui-item-meta>
                            <span>username</span>
                        </sui-item-meta>
                        <sui-item-description>
                            <sui-button basic color="black">Zum Review</sui-button>
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
    .reviews {
        padding-top: 2em;
    }

    #single-review {
        padding-left: 2em;
        padding-bottom: 2em;
        padding-top: 2em;
    }

</style>