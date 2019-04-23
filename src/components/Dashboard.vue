<template>
    <div class="dashboard">
        <sui-grid :columns="16" stackable>
            <sui-grid-row stretched>
                <sui-grid-column :width="1"></sui-grid-column>
                <sui-grid-column centered :width="14">
                   <img src="../assets/logo-my-review.png" class="logo">
                </sui-grid-column>
                <sui-grid-column :width="1"></sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="12">
                    <sui-header>
                        Willkommen zurück, {{ username }}!
                    </sui-header>
                </sui-grid-column>
                <sui-grid-column :width="2"></sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="12">
                    <sui-message
                            :class="hideSuccessMessage"
                            :header="successMessage"
                    ></sui-message>
                </sui-grid-column>
                <sui-grid-column :width="2"></sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="11">
                    <sui-header size="huge">Dein Dashboard</sui-header>
                </sui-grid-column>
                <sui-grid-column :width="1">
                    <sui-icon class="help-icon" name="question circle" size="big" color="blue" fitted
                              @click="toggleHelp"></sui-icon>
                </sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="3">
                    <dashboard-nav></dashboard-nav>

                </sui-grid-column>
                <sui-grid-column :width="9">
                    <div v-if="repos.length < 1">
                        <sui-message
                                icon="circle notched loading black"
                                header="Einen Moment bitte"
                                content="Der Inhalt wird gerade geladen."
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
                                    description="Dein Projekt wurde bewertet."
                                    icon="sync alternate">
                            </sui-step>
                            <sui-step
                                    :class="stateReviewRated"
                                    title="Bewertung des Reviews"
                                    description="Bewerte dein erhaltenes Review"
                                    icon="sync alternate">
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
                    <sui-header>Was passiert nachdem ich mein Projekt freigegeben habe?</sui-header>
                    <p>
                        Dein Projekt wird einem anderen Nutzer zugewiesen, der dein Projekt zum Reviewen erhält. Den aktuellen Status kannst du jederzeit bei deinen freigegebenen Projekten unter "Status" einsehen.</p>
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

    let octokitHelper = new OctokitHelper(),
        firebaseHelper = new FirebaseHelper(),
        myLocalStorageHelper = new LocalStorageHelper();


    export default {
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
                hideSuccessMessage: 'successMessage',
                username: myLocalStorageHelper.getUsername()
            };
        },
        components: {
            'dashboard-nav': dashboardNav
        },
        mounted: function () {
            let self = this;
            this.uid = myLocalStorageHelper.getUserId();
            let myRepoFetcherTask = new RepositoriesFetcherTask(firebaseHelper, octokitHelper, self.uid, function (repos) {
                self.repos = repos;
            });
            myRepoFetcherTask.run();
            EventBus.$on('onDashboardItemClick', category => {
                let self = this;
                switch (category) {
                    case 'not published':
                        this.setButton('Freigeben', 'add');
                        this.setRepos(myRepoFetcherTask.unpublishedRepos);
                        break;
                    case 'published':
                        this.setButton('Status', 'eye');
                        this.setRepos(myRepoFetcherTask.currentFirebaseRepos);
                        break;
                    case 'not reviewed':
                        firebaseHelper.getAssignedReviews(self.uid, function (reviews) {
                            self.setRepos(reviews);
                        });
                        this.setButton('Review erstellen', 'add');
                        break;
                    case 'reviewed':
                        firebaseHelper.getCompletedReviewsFromUser(self.uid, function (reviews) {
                            self.repos = reviews;
                        });
                        this.setButton('Review ansehen', 'eye');
                        break;
                }
            });
        },
        created() {
            this.onProjectShared();

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
                        firebaseHelper.getUid(this.currUserName).then(function (uid) {
                            octokitHelper.getMasterBranchSha(self.currRepoName, function (sha) {
                                firebaseHelper.setReviewBranchSha(self.currRepoName, uid, myLocalStorageHelper.getUserId(), sha);
                                self.$router.replace({
                                    name: 'createReview', params: {
                                        repoTitle: self.currRepoName,
                                        repoAuthor: self.currUserName,
                                        reviewerAvatar: item.profilePicture,
                                        prevRoute: 'dashboard',
                                        branchSha: sha
                                    }
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
                firebaseHelper.checkRepoForStatus(this.uid, repoName, firebaseHelper, function (status) {
                    console.log('Hello');

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
                octokitHelper.isSubmitted(repo, function (isSubmitted) {
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
                EventBus.$on('onProjectShared', this.controllSuccessMessage);
            },
            controllSuccessMessage () {
                this.hideSuccessMessage = '';
                setTimeout(function () {
                    //self.hideSuccessMessage = !self.hideSuccessMessage;
                    this.hideSuccessMessage = 'successMessage';
                }, 5000);
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

    .successMessage {
        display: none;
    }

    .repo-card-image {
        padding-bottom: 0.5em !important;
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