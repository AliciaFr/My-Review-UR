<template>
    <div class="create-review">
        <sui-grid :columns="16" stackable>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="11">
                    <sui-header size="huge">
                        {{ repoTitle }}
                        <sui-header-subheader>
                            <div>
                                <sui-image :src="reviewerAvatar" avatar></sui-image>
                                <span>{{ repoAuthor }}</span>
                            </div>
                        </sui-header-subheader>
                    </sui-header>

                </sui-grid-column>
                <sui-grid-column :width="1">
                    <sui-icon :class="['help-icon', { hidden: hideHelp }]" name="question circle" size="big" color="blue" fitted
                              @click="toggleHelp"></sui-icon>
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
                                   :repoTitle="repoTitle"
                                   :repoName="repoTitle"
                                   :completeRepoName="completeRepoName"
                                   :repoAuthor="repoAuthor"
                                   :reviewer="reviewer"
                                   :beforeReviewSha="beforeReviewSha"
                                   :reviewId="reviewId">

                        </component>
                    </keep-alive>
                    <div class="create-review-buttons">
                        <sui-button @click.native="toggleCancel()" icon="cancel" label-position="left" floated="left">
                            {{ backButton }}
                        </sui-button>
                        <sui-button :class="{ hidden: lastTab }" icon="right arrow" label-position="right"
                                    floated="right" color="black"
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
                        <sui-modal v-model="openWarning" animation="fly up" :closable="true">
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
                        <sui-modal v-model="openHelp" animation="scale" :closable="true">
                            <sui-modal-header>Wichtige Hinweise</sui-modal-header>
                            <sui-modal-content>
                                <sui-modal-description>
                                    <sui-header>Wie erstelle ich ein Review?</sui-header>
                                    <p>Du musst erst Kommentare hinzufügen, bevor du dein Review abschicken kannst.</p>
                                </sui-modal-description>
                                <sui-message warning icon="warning circle">
                                    <sui-message-header>Achtung!</sui-message-header>
                                    <sui-message-content>
                                        Bitte verändere nichts am Code, sondern kommentiere deine Anmerkungen stattdessen aus.
                                    </sui-message-content>
                                </sui-message>
                            </sui-modal-content>
                            <sui-modal-actions>
                                <sui-button positive @click.native="toggleHelp">OK</sui-button>
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
                openHelp: true,
                hideHelp: false,
                branchSha: '',
                beforeReviewSha: '',
                repoTitle: '',
                completeRepoName: this.repoTitle,
                repoAuthor: '',
                reviewerAvatar: '',
                prevRoute: '',
                forwardButton: 'Weiter zum Code',
                backButton: '',
                reviewSha: '',
                reviewId: '',
                reviewer: '',
                lastTab: false
            };
        },
        created() {
            this.repoTitle = this.$route.params.repoTitle;
            this.repoAuthor = this.$route.params.repoAuthor;
            console.log(this.repoAuthor);
            this.reviewerAvatar = this.$route.params.reviewerAvatar;
            this.prevRoute = this.$route.params.prevRoute;
            this.branchSha = this.$route.params.branchSha;
            this.completeRepoName = this.repoTitle + '-' + localStorageHelper.getGitHubLogin();


            if (this.prevRoute === 'reviews') {
                this.setAvatar(localStorageHelper.getUserId());
                this.openHelp = false;
                this.hideHelp = true;
                this.reviewId = this.$route.params.id;
                this.beforeReviewSha = this.$route.params.beforeReviewSha;
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
            toggleHelp () {
                this.openHelp = !this.openHelp
            },
            createReview: function () {
                let self = this;
                let editedFiles = localStorageHelper.getAllFiles();
                let repo = this.repoTitle;
                let repoOwner = this.repoAuthor;
                let reviewer = localStorageHelper.getUserId();
                if (editedFiles !== null) {
                    myFirebaseHelper.getReviewBranchSha(repo, repoOwner, reviewer, function (reviewSha) {
                        repoOwner = repoOwner.replace(/\s/g, '-');
                        let fullRepoName = self.repoTitle + '-' + localStorageHelper.getGitHubLogin();
                        octokitHelper.createBranch(fullRepoName, repoOwner, reviewSha, editedFiles);
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
            },
            setAvatar (uid) {
                let self = this;
                myFirebaseHelper.getProfilePicture(uid, function (imgUrl) {
                    self.reviewerAvatar = imgUrl;
                });
            }
        }
    }

</script>

<style>
    .help-icon {
        cursor: pointer;
    }

    .create-review {
        padding-top: 5em;
        padding-bottom: 10em;
    }

    .create-review-buttons {
        padding-top: 1em;
    }

    .hidden {
        display: none;
    }
</style>