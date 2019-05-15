<template>
    <div class="dashboard">
        <sui-grid :columns="16" stackable>
            <sui-grid-row stretched>
                <sui-grid-column :width="4"></sui-grid-column>
                <sui-grid-column :width="10">
                    <sui-header>
                        Willkommen zurück, {{ username }}!
                    </sui-header>
                </sui-grid-column>
                <sui-grid-column :width="4"></sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="4"></sui-grid-column>
                <sui-grid-column :width="10">
                    <sui-message
                            :class="{ successNotActive: hideSuccessMessage}"
                            :header="successMessage"
                    ></sui-message>
                </sui-grid-column>
                <sui-grid-column :width="4"></sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="4"></sui-grid-column>
                <sui-grid-column :width="4">
                    <sui-header size="huge">Dein Dashboard</sui-header>
                </sui-grid-column>
                <sui-grid-column :width="8">
                    <sui-icon class="help-icon" name="question circle" size="big" color="blue" fitted
                              @click="toggleHelp"></sui-icon>
                </sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="4"></sui-grid-column>
                <sui-grid-column :width="2">
                    <dashboard-nav></dashboard-nav>

                </sui-grid-column>
                <sui-grid-column :width="6">
                    <div v-if="reposNotLoaded">
                        <sui-message
                                icon="circle notched loading black"
                                header="Einen Moment bitte"
                                content="Der Inhalt wird gerade geladen."
                        >
                        </sui-message>
                    </div>
                    <div v-else-if="noRepos">
                        <sui-message

                                header="Du hast noch keine Projekte"
                                content="Falls du denkst, dass es sich um einen Irrtum handelt, kontaktiere bitte den Support."
                        >
                        </sui-message>
                    </div>
                    <div v-else>
                        <sui-card-group :items-per-row="3">
                            <sui-card v-for="repo in repos">
                                <sui-card-content>
                                    <sui-image :src="repo.profilePicture" class="right floated" size="mini"></sui-image>
                                    <sui-card-header>{{ repo.name }}</sui-card-header>
                                    <sui-card-meta>
                                        {{ repo.userName }}
                                    </sui-card-meta>

                                </sui-card-content>
                                <sui-button attached="bottom" @click="onDashboardItemClicked(repo)">
                                    <sui-icon :name="buttonIcon"></sui-icon>
                                    {{ buttonTitle }}
                                </sui-button>
                            </sui-card>
                        </sui-card-group>
                    </div>
                </sui-grid-column>
                <sui-grid-column :width="2"></sui-grid-column>
            </sui-grid-row>
        </sui-grid>
        <sui-modal v-model="openNotSubmitted" animation="fly up">
            <sui-modal-header>Abgabetermin</sui-modal-header>
            <sui-modal-content>
                <sui-modal-description>
                    <sui-header>Der Abgabetermin für dein Projekt ist noch nicht vorbei.</sui-header>
                    <p>
                        Du kannst dein Projekt erst abgeben, wenn der Abgabetermin vorbei ist. Probiere es dann noch einmal.</p>
                </sui-modal-description>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button color="black" @click.native="toggleNotSubmitted()">
                    OK
                </sui-button>
            </sui-modal-actions>
        </sui-modal>
        <sui-modal v-model="openRepoStatus" animation="scale">
            <sui-modal-header>Der aktuelle Fortschritt zu deinem freigegebenen Projekt.</sui-modal-header>
            <sui-modal-content>
                <sui-modal-description>
                    <sui-header>Title</sui-header>
                    <div>
                        <sui-step-group step-number="three">
                            <sui-step
                                    :class="stateAssigned"
                                    title="Zuweisung"
                                    description="Dein Projekt wird einem anderen Nutzer zugewiesen."
                                    icon="sync alternate">
                            </sui-step>
                            <sui-step
                                    :class="stateCompleted"
                                    title="Review erstellen"
                                    description="Dein Projekt wird von einem anderen Nutzer bewertet."
                                    icon="sync alternate">
                            </sui-step>
                            <sui-step
                                    :class="stateReviewRated"
                                    id="rateReview"
                                    title="Bewertung des Reviews"
                                    description="Bewerte dein erhaltenes Review."
                                    icon="sync alternate"
                                    @click="goToReviews()">
                            </sui-step>
                        </sui-step-group>
                    </div>
                </sui-modal-description>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button color="black" @click.native="toggleRepoStatus()">
                    Schließen
                </sui-button>
            </sui-modal-actions>
        </sui-modal>
        <sui-modal v-model="openHelp" animation="scale" :closable="true">
            <sui-modal-header>Hilfe</sui-modal-header>
            <sui-modal-content scrolling>
                <sui-segment vertical :padded="true">
                    <sui-header>Wie kann ich mein Projekt an meine Kommilitonen schicken?</sui-header>
                    <p>
                        Dazu gehst du auf den Reiter "Noch nicht freigegeben" und wählst das gewünschte Projekt aus, indem du auf "Freigeben" klickst.</p>
                </sui-segment>
                <sui-segment vertical :padded="true">
                    <sui-header>Was passiert nachdem ich mein Projekt freigegeben habe?</sui-header>
                    <p>
                        Dein Projekt wird einem anderen Nutzer zugewiesen, der dein Projekt zum Reviewen erhält. Den aktuellen Status kannst du jederzeit bei deinen freigegebenen Projekten unter "Status" einsehen.</p>
                </sui-segment>
                <sui-segment vertical :padded="true">
                    <sui-header>Wie funktioniert die Zuweisung des Projekts?</sui-header>
                    <p>Sobald du dein Projekt freigegeben hast, wird überprüft welche Nutzer dasselbe Projekt freigegeben haben.
                    Danach wird daraus ein Reviewer für dich vom System ermittelt.</p>
                </sui-segment>
                <sui-segment vertical :padded="true">
                    <sui-header>Kann ich Projekte von meinen Freunden reviewen?</sui-header>
                    <p>
                       Leider nein. Da alle Nutzer anonym sind, ist dies nicht möglich.</p>
                </sui-segment>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button positive @click.native="toggleHelp">OK</sui-button>
            </sui-modal-actions>
        </sui-modal>
    </div>
</template>

<script>
    import 'semantic-ui-css/semantic.min.css';
    import dashboardMixin from '../mixins/dashboardMixin';
    import dashboardNav from '../components/DashboardNav.vue';
    import {EventBus} from '../main';
    import FirebaseHelper from '../javascript/FirebaseHelper';
    import OctokitHelper from '../javascript/github/OctokitHelper';
    import RepositoriesFetcherTask from '../javascript/github/RepositoryFetcherTask';
    import RepoStatusFetcherTask from '../javascript/database/RepoStatusFetcherTask';
    import LocalStorageHelper from '../javascript/LocalStorageHelper';

    const SUCCESS_MESSAGE_REVIEWED = 'Das Review wurde erfolgreich versendet.';
    const SUCCESS_MESSAGE_SHARED = 'Dein Projekt wurde erfolgreich freigegeben.';

    let octokitHelper = new OctokitHelper(),
        firebaseHelper = new FirebaseHelper(),
        myLocalStorageHelper = new LocalStorageHelper();


    export default {
        name: 'dashboard',
        props: {},
        data: function () {
            return {
                currRepoName: '',
                currUserName: '',
                buttonTitle: 'Freigeben',
                buttonIcon: 'add',
                repos: [],
                repoName: '',
                userName: '',
                statusIcon: '',
                statusClass: '',
                openHelp: false,
                openRepoStatus: false,
                openNotSubmitted: false,
                uid: '',
                stateAssigned: 'disabled',
                stateCompleted: 'disabled',
                stateReviewRated: 'disabled',
                successMessage: 'Dein Projekt wurde erfolgreich freigegeben.',
                hideSuccessMessage: true,
                username: myLocalStorageHelper.getUsername(),
                gitHubLogin: myLocalStorageHelper.getGitHubLogin(),
                noRepos: false,
                reposNotLoaded: true
            };
        },
        components: {
            'dashboard-nav': dashboardNav
        },
        mounted: function () {
            let self = this;
            this.uid = myLocalStorageHelper.getUserId();
            firebaseHelper.fetchUserRepos(firebaseHelper, octokitHelper, self.uid, function (repos) {
                console.log(repos);
                let currRepos = repos;
                if (self.hasNoRepos(currRepos)) {
                    self.handleNoRepos();
                    self.reposNotLoaded = false;
                } else {
                    self.repos = currRepos;
                    self.reposNotLoaded = false;
                }
            });
            EventBus.$on('onDashboardItemClick', category => {
                let self = this;
                switch (category) {
                    case 'not published':
                        self.resetCards();
                        console.log(this.reposNotLoaded);
                        firebaseHelper.fetchUserRepos(firebaseHelper, octokitHelper, self.uid, function (repos) {
                            if (self.hasNoRepos(repos)) {
                                self.handleNoRepos();
                                self.reposNotLoaded = false;
                            } else {
                                self.setRepos(repos);
                                self.setButton('Freigeben', 'add');
                                self.reposNotLoaded = false;
                            }
                        });
                        break;
                    case 'published':
                        self.resetCards();
                        firebaseHelper.getUserRepos(self.uid, function (repos) {
                            console.log(repos);
                            if (self.hasNoRepos(repos)) {
                                self.handleNoRepos();
                                self.reposNotLoaded = false;
                            } else {
                                self.repos = repos;
                                self.setButton('Status', 'eye');
                                self.reposNotLoaded = false;
                            }
                        });
                        break;
                    case 'not reviewed':
                        self.resetCards();
                        firebaseHelper.getAssignedReviews(self.uid, function (reviews) {
                            if (self.hasNoRepos(reviews)) {
                                self.handleNoRepos();
                                self.reposNotLoaded = false;
                            } else {
                                self.setRepos(reviews);
                                self.setButton('Review erstellen', 'add');
                                self.reposNotLoaded = false;
                            }
                        });
                        break;
                    case 'reviewed':
                        self.resetCards();
                        firebaseHelper.getCompletedReviewsFromUser(self.uid, function (reviews) {
                            if (self.hasNoRepos(reviews)) {
                                self.handleNoRepos();
                                self.reposNotLoaded = false;
                            } else {
                                self.setRepos(reviews);
                                self.setButton('Review ansehen', 'eye');
                                self.reposNotLoaded = false;
                            }
                        });

                        break;
                }
            });
        },
        created() {
            this.onProjectShared();
            this.onProjectReviewed();
        },
        computed: {},
        methods: {
            onDashboardItemClicked: function (item) {
                let self = this;
                this.currRepoName = item.name;
                this.currUserName = item.userName;
                EventBus.$emit('onDashboardCardClicked', [this.currRepoName, this.currUserName]);
                switch (this.buttonTitle) {
                    case 'Freigeben':
                        this.publishRepo(this.currRepoName);
                        break;
                    case 'Status':
                        this.toggleRepoStatus(item.name);
                        break;
                    case 'Review erstellen':
                        firebaseHelper.getUid(item.userName).then(function (uid) {
                            firebaseHelper.getGitHubLogin(uid).then(function (gitHubLogin) {
                                console.log(gitHubLogin);
                                let completeRepoName = self.currRepoName + '-' + gitHubLogin;
                                octokitHelper.getMasterBranchSha(completeRepoName, function (sha) {
                                    firebaseHelper.setReviewBranchSha(self.currRepoName, uid, myLocalStorageHelper.getUserId(), sha);
                                    self.$router.replace({
                                        name: 'createReview', params: {
                                            repoTitle: self.currRepoName,
                                            repoAuthor: self.currUserName,
                                            repoAuthorId: uid,
                                            reviewerAvatar: item.profilePicture,
                                            prevRoute: 'dashboard',
                                            branchSha: sha,
                                            authorGitHubLogin: gitHubLogin
                                        }
                                    });
                                });
                            });
                        });
                        break;
                    case 'Review ansehen':
                        this.$router.replace({
                            name: 'reviews',
                            params: {
                                prevRoute: 'dashboard'
                            }
                        });
                        break;
                }
            },
            setButton (title, icon) {
                this.buttonTitle = title;
                this.buttonIcon = icon;
            },
            setRepos (repos) {
                this.repos = repos;
            },
            goBack() {
                this.$router.replace(-1);
            },
            toggleHelp () {
                this.openHelp = !this.openHelp
            },
            toggleRepoStatus(repoName) {
                let self = this;
                this.openRepoStatus = !this.openRepoStatus;
                console.log(this.uid);
                firebaseHelper.checkRepoForStatus(this.uid, repoName, firebaseHelper, function (status) {
                    self.setRepoStatus(status);
                });
            },
            setRepoStatus (status) {
                switch (status) {
                    case "not assigned":
                        this.stateAssigned = 'active';
                        this.stateCompleted = 'disabled';
                        this.stateReviewRated = 'disabled';
                        break;
                    case "assigned":
                        this.stateAssigned = 'completed';
                        this.stateCompleted = 'active';
                        this.stateReviewRated = 'disabled';
                        break;
                    case "completed":
                        this.stateAssigned = 'completed';
                        this.stateCompleted = 'completed';
                        this.stateReviewRated = 'active';
                        break;
                    case "reviewRated":
                        this.stateAssigned = 'completed';
                        this.stateCompleted = 'completed';
                        this.stateReviewRated = 'competed';
                        break;
                }
            },
            toggleNotSubmitted() {
                this.openNotSubmitted = !this.openNotSubmitted;
            },
            publishRepo(repo) {
                let self = this;
                let completeRepoName = repo + '-' + this.gitHubLogin;
                octokitHelper.isSubmitted(completeRepoName, function (isSubmitted) {
                    if (isSubmitted) {
                        self.$router.replace({
                            name: 'publishRepo', params: {
                                repoTitle: self.currRepoName,
                                uid: self.uid
                            }
                        });
                    } else {
                        self.toggleNotSubmitted();
                    }
                });
            },
            onProjectShared () {
                EventBus.$on('onProjectShared', () => {
                    this.controllSuccessMessage();
                    this.successMessage = SUCCESS_MESSAGE_SHARED;
                });
            },
            onProjectReviewed () {
                EventBus.$on('onProjectReviewed', () => {
                    this.controllSuccessMessage();
                    this.successMessage = SUCCESS_MESSAGE_REVIEWED;
                });
            },
            controllSuccessMessage () {
                this.hideSuccessMessage = false;
                setTimeout(() => {
                    this.hideSuccessMessage = true;
                }, 3000);
            },
            hasNoRepos (repos) {
                return repos.length < 1;
            },
            handleNoRepos () {
                this.noRepos = !this.noRepos;
            },
            resetCards () {
                this.repos = [];
                this.reposNotLoaded = true;
                this.noRepos = false;
            },
            goToReviews () {
                this.$router.replace({
                            name: 'reviews'
                        });
            }
        },
        mixins: [dashboardMixin]
    }
</script>

<style>
    .dashboard {
        padding-top: 5em;
        padding-bottom: 10em;
    }

    .successNotActive {
        display: none;
    }

    .repo-card-image {
        padding-bottom: 0.5em !important;
    }
    
    #rateReview {
        cursor: pointer;
    }

    .logo {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 15%;
        height: auto;
        text-align: center;
    }
</style>