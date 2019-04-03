<template>
    <div class="create-review">
        <sui-grid :columns="16" stackable>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="12">
                    <sui-header size="huge">
                        Repo Name
                        <sui-header-subheader>
                            Username
                        </sui-header-subheader>
                    </sui-header>
                </sui-grid-column>
                <sui-grid-column :width="2"></sui-grid-column>
            </sui-grid-row>
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
                        <sui-button icon="right arrow" label-position="right" floated="right" @click="createReview()">Weiter</sui-button>
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
                                <sui-button positive @click.native="goBack()">
                                    OK
                                </sui-button>
                            </sui-modal-actions>
                        </sui-modal>
                        <sui-modal v-model="openWarning" animation="fly up" :closable="false">
                            <sui-modal-header>Achtung</sui-modal-header>
                            <sui-modal-content>
                                <sui-modal-description>
                                    <sui-header>Keine Kommentare vorgenommen</sui-header>
                                    <p>
                                        Du musst erst Kommentare hinzufügen, bevor du dein Review abschicken kannst. </p>
                                </sui-modal-description>
                            </sui-modal-content>
                            <sui-modal-actions>
                                <sui-button positive @click.native="toggleWarning">
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
    import createReviewOverview from '../components/CreateReviewOverview.vue';
    import createReviewEditor from '../components/CreateReviewEdit.vue';
    import {EventBus} from '../main';
    import OctokitHelper from '../javascript/github/OctokitHelper';
    import LocalStorageHelper from '../javascript/LocalStorageHelper';

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

    let octokitHelper = new OctokitHelper();
    let localStorageHelper = new LocalStorageHelper();

    export default {
        data() {
            return {
                tabs: tabs,
                currentTab: tabs[0],
                open: false,
                openWarning: false
            };
        },
        methods: {
            toggle() {
                this.open = !this.open;
            },
            toggleWarning() {
                this.openWarning = !this.openWarning
            },
            allStorage: function () {
                let values = [],
                    keys = Object.keys(localStorage),
                    i = keys.length;

                while (i--) {
                    values.push(localStorage.getItem(keys[i]));
                }
                return values;
            },
            createReview: function () {
                let editedFiles = localStorageHelper.getAllFiles();
                let repo = 'u03-birdingapp-ws-2017-18-AliciaFr';
                let reviewer = 'userY';
                let masterSha = 'c58806081b5f14e95e1eeaa52b98603a3d30803f';
                if (editedFiles !== null) {
                    octokitHelper.createBranch(repo, reviewer, masterSha, editedFiles);
                    localStorageHelper.deleteAllFiles();
                    // implement: change review status in database
                } else {
                    this.openWarning = !this.openWarning;
                }
            },
            goBack() {
                this.$router.replace('home');
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