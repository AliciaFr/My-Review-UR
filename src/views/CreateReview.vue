<template>
    <div class="create-review">
        <sui-grid :columns="16" stackable>
            <sui-grid-row stretched>
                <sui-grid-column :width="3"></sui-grid-column>
                <sui-grid-column :width="7">
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
                <sui-grid-column :width="6">
                    <sui-icon :class="['help-icon', { hidden: hideHelp }]" name="question circle" size="big" color="blue" fitted
                              @click="toggleHelp"></sui-icon>
                </sui-grid-column>
                <sui-grid-column :width="2"></sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="3"></sui-grid-column>
                <sui-grid-column :width="10">
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
                                   :repoAuthorId="repoAuthorId"
                                   :authorGitHubLogin="authorGitHubLogin"
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
                                <sui-button positive @click.native="toggleWarning">OK</sui-button>
                            </sui-modal-actions>
                        </sui-modal>
                        <sui-modal v-model="openHelp" animation="scale" dimmer="inverted" :closable="true">
                            <sui-modal-header>Wichtiger Hinweis zur Erstellung von Reviews</sui-modal-header>
                            <sui-modal-content  :scrolling="true">
                                <sui-modal-description>
                                    <sui-header>Wie gehe ich bei der Erstellung eines Reviews vor?</sui-header>
                                    <span><p>Um einen Überblick zu bekommen, solltest du dir die zunächst Aufgabenstellung, Testing-Fehler, die der Autor des Codes angegeben hat und seine Erweiterungen der Aufgabenstellung durchlesen.</p>
                                    <p>Dann solltest du dir einen groben Überblick über den Code verschaffen, indem du alle relevanten Dateien ansiehst.</p>
                                    <p>Nun bist du bereit, um mit dem Erstellen des Reviews zu beginnen.</p></span>
                                    <sui-header>Wie erstelle ich ein Review?</sui-header>
                                    <sui-message warning icon="warning circle">
                                        <sui-message-header>Achtung!</sui-message-header>
                                        <sui-message-content>
                                            Bitte lösche oder verändere den Code nicht, sondern kommentiere deine Anmerkungen stattdessen aus.
                                        </sui-message-content>
                                    </sui-message>
                                    <p>Fällt dir im Code etwas auf, was du anmerken möchtest, kannst du dies durch einen Kommentar machen. (siehe Abbildung)</p>
                                    <p>Damit du im Blick behälst, auf welche Aspekte du beim Erstellen des Reviews achten solltest, steht dir in dem Code-Editor im Menü rechts oben ein Checkliste zur Verfügung.</p>
                                    <img wrapped size="medium" src="../assets/code-review-example.png">
                                </sui-modal-description>

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
                repoAuthorId: '',
                reviewerAvatar: '',
                prevRoute: '',
                forwardButton: 'Weiter zum Code',
                backButton: '',
                reviewSha: '',
                reviewId: '',
                reviewer: '',
                lastTab: false,
                authorGitHubLogin: ''
            };
        },
        created() {
            this.setData();
            if (this.prevRoute === 'reviews') {
                this.setupReviewView();
            } else if (this.prevRoute === 'dashboard') {
                for (let i = 0; i < this.tabs.length; i++) {
                    if (this.tabs[i].title === 'Bewertung des Reviews') {
                        this.tabs.pop();
                    }
                }
                this.setBackButtonTitle('Abbrechen');
                this.reviewer = localStorageHelper.getUserId();
            }
        },
        methods: {
            setData () {
                this.repoTitle = this.$route.params.repoTitle;
                this.repoAuthor = this.$route.params.repoAuthor;
                this.repoAuthorId = this.$route.params.repoAuthorId;
                this.authorGitHubLogin = this.$route.params.authorGitHubLogin;
                this.reviewerAvatar = this.$route.params.reviewerAvatar;
                this.prevRoute = this.$route.params.prevRoute;
                this.branchSha = this.$route.params.branchSha;
                this.completeRepoName = this.repoTitle + '-' + this.authorGitHubLogin;
            },
            setupReviewView () {
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
            },
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
                if (editedFiles !== null) {
                    myFirebaseHelper.getReviewBranchSha(this.repoTitle, this.repoAuthorId, this.reviewer, function (reviewSha) {
                        let repoOwner = self.repoAuthor.replace(/\s/g, '-');
                        console.log(repoOwner);
                        let fullRepoName = self.repoTitle + '-' + localStorageHelper.getGitHubLogin();
                        octokitHelper.createBranch(fullRepoName, repoOwner, reviewSha, editedFiles);
                    });
                    myFirebaseHelper.setReviewStatus(this.repoTitle, this.repoAuthorId, "completed", self.getTodaysDate());
                    EventBus.$emit('onProjectReviewed', this.repoTitle);
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
                console.log(buttonTitle);
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