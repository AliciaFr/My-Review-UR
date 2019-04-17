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
                                   :prevRoute="prevRoute"
                                   :branchSha="branchSha"
                                   :repoName="repoTitle"
                                   :repoAuthor="repoAuthor"
                                   :reviewer="reviewer"
                        :reviewId="reviewId">

                        </component>
                    </keep-alive>
                    <div class="create-review-buttons">
                        <sui-button @click.native="toggleCancel()" icon="cancel" label-position="left" floated="left">{{ backButton }}
                        </sui-button>
                        <sui-button :class="{ hidden: lastTab }" icon="right arrow" label-position="right" floated="right" color="black"
                                    @click="handleForwardButton(forwardButton)">{{ forwardButton }}
                        </sui-button>
                        <sui-modal v-model="openCancel" animation="fly up" :closable="false">
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
    import reviewRating from '../components/ReviewRating.vue';
    import {EventBus} from '../main';
    import OctokitHelper from '../javascript/github/OctokitHelper';
    import LocalStorageHelper from '../javascript/LocalStorageHelper';
    import FirebaseHelper from '../javascript/FirebaseHelper';

    let tabs = [
        {
            title: 'Übersicht',
            component: createReviewOverview,
            id: 1
        },
        {
            title: 'Code Editor',
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
                openCancel: false,
                openWarning: false,
                branchSha: '',
                repoTitle: '',
                repoAuthor: '',
                prevRoute: '',
                forwardButton: 'Weiter zum Code',
                backButton: '',
                commitSha: '',
                reviewId: '',
                reviewer: '',
                lastTab: false
            };
        },
        created() {
            this.repoTitle = this.$route.params.repoTitle;
            this.repoAuthor = this.$route.params.repoAuthor;
            this.prevRoute = this.$route.params.prevRoute;
            this.branchSha = this.$route.params.branchSha;
            if (this.prevRoute === 'reviews') {
                this.reviewId = this.$route.params.id;
                this.getReviewer();
                if (this.tabs[this.tabs.length - 1].title !== 'Bewertung des Reviews') {
                    this.tabs.push({
                        title: 'Bewertung des Reviews',
                        component: reviewRating,
                        id: 3
                    });
                }

                this.setBackButtonTitle('Schließen');
            } else if (this.prevRoute === 'dashboard') {
                for (let i = 0; i < this.tabs.length; i++) {
                    if (this.tabs[i].title === 'Bewertung des Reviews') {
                        this.tabs.pop();
                    }
                }
                this.setBackButtonTitle('Abbrechen');
            }
        },
        methods: {
            toggleCancel() {
                if (this.prevRoute === 'dashboard') {
                    this.openCancel = !this.openCancel;
                } else {
                    this.goToAllReviews();
                }
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
                        octokitHelper.createBranch(repo, repoOwner, commitSha, editedFiles);
                    });
                    myFirebaseHelper.setReviewStatus(repo, repoOwner, "completed", self.getTodaysDate());
                    self.goToHome();
                    localStorageHelper.deleteAllFiles();
                } else {
                    this.openWarning = !this.openWarning;
                }
            },
            goBack() {
                this.$router.replace('/home');
            },
            changeTab (tab) {
                this.currentTab = tab;
                this.setForwardButtonTitle(tab);
            },
            setForwardButtonTitle (tab) {
                if (tab.id === 1) {
                    this.forwardButton = 'Weiter zum Code';
                } else if (tab.id === 2) {
                    if (this.prevRoute === 'dashboard') {
                        this.forwardButton = 'Review abschicken';
                    } else if (this.prevRoute === 'reviews') {
                        this.forwardButton = 'Zur Bewertung des Reviews'
                    }
                } else if (tab.id === 3) {
                    this.forwardButton = 'Zurück zu Reviews'
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
                } else if (this.prevRoute === 'reviews') {
                    if (buttonTitle === 'Weiter zum Code') {
                        this.changeTab(tabs[1]);
                    } else if (buttonTitle === 'Zur Bewertung des Reviews') {
                        this.changeTab(tabs[2]);
                    } else if (buttonTitle === 'Zurück zu Reviews') {
                        this.goToAllReviews();
                    }
                }
            },
            goToHome () {
                this.$router.replace('/home');
            },
            goToAllReviews () {
                this.$router.replace('/reviews');
            },
            getReviewer () {
                this.reviewer = this.$route.params.reviewerName;
            },
            getTodaysDate () {
                return new Date().toLocaleDateString();
            }
        }
    }

</script>

<style>
    .create-review {
        padding-top: 5em;
        padding-bottom: 10em;
    }

    .create-review-buttons {
        padding-top: 1em;
    }
</style>