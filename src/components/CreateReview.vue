<template>
    <div class="create-review">
        <sui-grid :columns="16" stackable>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="12">
                    <div class="create-review-nav">
                        <sui-menu pointing secondary>
                            <a is="sui-menu-item"
                               v-for="tab in tabs"
                               :content="tab.title"
                               v-bind:key="tab.title"
                               v-bind:class="{ active: currentTab.title === tab.title }"
                               @click="currentTab = tab">
                            </a>
                        </sui-menu>
                    </div>
                    <keep-alive>
                        <component v-bind:is="currentTab.component"
                                   class="tab">

                        </component>
                    </keep-alive>
                    <div class="create-review-buttons">
                        <sui-button @click.native="toggle" icon="cancel" label-position="left" floated="left"
                                    color="black">Abbrechen
                        </sui-button>
                        <sui-button icon="right arrow" label-position="right" floated="right">Weiter</sui-button>
                        <sui-modal v-model="open" animation="fly up" :closable="false">
                            <sui-modal-header>Achtung</sui-modal-header>
                            <sui-modal-content>
                                <sui-modal-description>
                                    <sui-header>Dein Fortschritt wird nicht gespeichert.</sui-header>
                                    <p>
                                        Alle Deine Änderungen gehen verloren. Bist du Dir sicher, dass du fortfahren möchtest?</p>
                                </sui-modal-description>
                            </sui-modal-content>
                            <sui-modal-actions>
                                <sui-button negative floated="left" @click.native="toggle">
                                    Abbrechen
                                </sui-button>
                                <sui-button positive @click.native="toggle">
                                    OK
                                </sui-button>
                            </sui-modal-actions>
                        </sui-modal>
                    </div>
                </sui-grid-column>
                <sui-grid-column :width="2"></sui-grid-column>
            </sui-grid-row>
        </sui-grid>
    </div>
</template>

<script>
    import createReviewOverview from '../components/CreateReviewOverview.vue'
    import createReviewEditor from '../components/CreateReviewEdit.vue'




    let tabs = [
        {
            title: 'Overview',
            component: createReviewOverview
        },
        {
            title: 'Editor',
            component: createReviewEditor
        }, {
            title: 'Bewertung des Reviews',
            component: createReviewOverview
        }];

    export default {
        data() {
            return {
                tabs: tabs,
                currentTab: tabs[0],
                open: false
            };
        },
        methods: {
            toggle() {
                this.open = !this.open;
            }
        },
        components: {
            'review-overview': createReviewOverview,
            'review-editor': createReviewEditor
        }
    }

</script>

<style>
    .create-review {
        padding-top: 5em;
        padding-bottom: 10em;
    }

    .create-review-buttons {
        padding: 1em;
    }
</style>