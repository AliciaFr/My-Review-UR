<template>
    <div class="create-review">
        <sui-grid :columns="16" stackable>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="12">
                    <sui-header size="huge">
                        {{ repoTitle }}
                        <sui-header-subheader>{{ repoAuthor }}</sui-header-subheader>
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
                               @click="changeTab(tab)">
                            </a>
                        </sui-menu>
                    </div>
                    <keep-alive>
                        <component v-bind:is="currentTab.component"
                                   class="tab"
                        :repoName="repoTitle"
                        :repoAuthor="repoAuthor">

                        </component>
                    </keep-alive>
                    <div class="create-review-buttons">
                        <sui-button @click.native="toggle" icon="cancel" label-position="left" floated="left"
                                    color="black">{{ backButton }}</sui-button>
                        <sui-button icon="right arrow" label-position="right" floated="right" @click="handleForwardButton(forwardButton)">{{ forwardButton }}</sui-button>
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
    import FirebaseHelper from '../javascript/FirebaseHelper';

    let tabs = [
        {
            title: 'Overview',
            component: createReviewOverview,
            id: 1
        },
        {
            title: 'Editor',
            component: createReviewEditor,
            id: 2
        }];

    let octokitHelper = new OctokitHelper();
    let localStorageHelper = new LocalStorageHelper();
    let myFirebaseHelper = new FirebaseHelper();

    export default {
        data() {
            return {
                tabs: tabs,
                currentTab: tabs[0],
                open: false,
                openWarning: false,
                repoTitle: '',
                repoAuthor: '',
                prevRoute: '',
                forwardButton: 'Weiter zum Code',
                backButton: '',
                reviewer: '',
                commitSha: ''
            };
        },
        mounted() {
        },
        created() {
            this.repoTitle = this.$route.params.repoTitle;
            this.repoAuthor = this.$route.params.repoAuthor;
            this.prevRoute = this.$route.params.prevRoute;
            if (this.prevRoute === 'reviews') {
                tabs.push({
                    title: 'Bewertung des Reviews',
                    component: createReviewOverview
                });
                this.setBackButtonTitle('Zurück');
            } else if (this.prevRoute === 'dashboard') {
                this.setBackButtonTitle('Abbrechen');
            }
        },
        methods: {
            toggle() {
                this.open = !this.open;
            },
            toggleWarning() {
                this.openWarning = !this.openWarning
            },
            createReview: function () {
                let self = this;
                let editedFiles = localStorageHelper.getAllFiles();
                let repo = this.repoTitle;
                let repoOwner = this.repoAuthor;
                let reviewer = localStorageHelper.getUserId();
                if (editedFiles !== null) {
                    myFirebaseHelper.getReviewBranchSha(repo, repoOwner, reviewer, function (commitSha) {
                        repoOwner = repoOwner.replace(/\s/g, '-');
                        //octokitHelper.createBranch(repo, repoOwner, commitSha, editedFiles);
                    });
                    myFirebaseHelper.setReviewStatus(repo, repoOwner, "completed");
                    self.goToHome();
                    localStorageHelper.deleteAllFiles();
                    // implement: change review status in database
                } else {
                    this.openWarning = !this.openWarning;
                }
            },
            goBack() {
                this.$router.replace('home');
            },
            changeTab (tab) {
                this.currentTab = tab;
                this.setForwardButtonTitle(tab);
            },
            setForwardButtonTitle (tab) {
                if (tab.id === 1) {
                    this.forwardButton = 'Weiter zum Code';
                } else if (tab.id === 2) {
                    this.forwardButton = 'Review abschicken';
                } else if (tab.id === 3) {
                    console.log(tab);
                }
            },
            setBackButtonTitle (buttonTitle) {
                this.backButton = buttonTitle;
            },
            handleForwardButton (buttonTitle) {
                if (this.prevRoute === 'dashboard') {
                    if (buttonTitle === 'Weiter zum Code') {
                        this.changeTab(tabs[1]);
                    } else if (buttonTitle === 'Review abschicken') {
                        this.createReview();
                    }
                }
            },
            goToHome () {
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