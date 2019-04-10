<template>
    <div class="dashboard">
        <sui-grid :columns="16" stackable>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="12">
                    <sui-header size="huge">Dein Dashboard</sui-header>
                </sui-grid-column>
                <sui-grid-column :width="2"></sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="3">
                    <dashboard-nav></dashboard-nav>

                </sui-grid-column>
                <sui-grid-column :width="9">
                    <div>
                        <sui-card-group :items-per-row="3">
                            <sui-card v-for="repo in repos">
                                <sui-card-content>
                                    <sui-card-header>{{ repo.name }}</sui-card-header>
                                    <sui-card-meta>{{ repo.userName }}</sui-card-meta>
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
                    <p>Du kannst dein Projekt erst abgeben, wenn der Abgabetermin vorbei ist. Probiere es dann noch einmal.</p>
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
                                    v-bind:class="{ statusClass }"
                                    title="Zuweisung"
                                    description="Dein Projekt wird einem anderen Nutzer zugewiesen."
                                    icon="check">
                            </sui-step>
                            <sui-step
                                    title="Review erstellen"
                                    description="Dein Projekt wurde bewertet."
                                    icon="sync alternate">
                            </sui-step>
                            <sui-step
                                    disabled
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
    </div>
</template>

<script>
    import 'semantic-ui-css/semantic.min.css';
    import dashboardMixin from '../mixins/dashboardMixin';
    import dashboardNav from '../components/DashboardNav.vue';
    import { EventBus } from '../main';
    import FirebaseHelper from '../javascript/FirebaseHelper';
    import OctokitHelper from '../javascript/github/OctokitHelper';
    import RepositoriesFetcherTask from '../javascript/github/RepositoryFetcherTask';
    import RepoStatusFetcherTask from '../javascript/database/RepoStatusFetcherTask';

    let octokitHelper = new OctokitHelper(),
        firebaseHelper = new FirebaseHelper();


    export default {
        props: {

        },
        data: function() {
            return {
                currRepoName: '',
                currUserName: '',
                repos: [
                    {
                        name: 'OOP-UE-01',
                        userName: 'Funky Giraffe',
                    },
                    {
                        name: 'OOP-UE-02',
                        userName: 'Funky Giraffe',
                    },
                    {
                        name: 'MME-UE-03',
                        userName: 'Funky Giraffe',
                    },
                    {
                        name: 'MME-UE-03',
                        userName: 'Funky Giraffe',
                    },
                    {
                        name: 'MME-UE-03',
                        userName: 'Funky Giraffe',
                    },
                    {
                        name: 'MME-UE-03',
                        userName: 'Funky Giraffe',
                    }
                ],
                buttonTitle: 'Freigeben',
                buttonIcon: 'add',
                //repos: [],
                repoName: '',
                userName: '',
                statusIcon: '',
                statusClass: '',
                openRepoStatus: false,
                openNotSubmitted: false
            };
        },
        components: {
            'dashboard-nav': dashboardNav
        },
        mounted: function () {
            let myRepoFetcherTask = new RepositoriesFetcherTask(firebaseHelper, octokitHelper, function (repos) {
            });
            myRepoFetcherTask.run();
            EventBus.$on('onDashboardItemClick', category => {
                let self = this;
                switch (category) {
                    case 'not published':
                        this.setButton('Freigeben', 'add');
                        this.setRepos([
                            {
                                name: 'OOP-UE-01',
                                userName: 'Funky Giraffe',
                            },
                            {
                                name: 'OOP-UE-02',
                                userName: 'Funky Giraffe',
                            },
                            {
                                name: 'MME-UE-03',
                                userName: 'Funky Giraffe',
                            },
                            {
                                name: 'MME-UE-03',
                                userName: 'Funky Giraffe',
                            },
                            {
                                name: 'MME-UE-03',
                                userName: 'Funky Giraffe',
                            },
                            {
                                name: 'MME-UE-03',
                                userName: 'Funky Giraffe',
                            }
                        ]);
                        break;
                    case 'published':
                        this.setButton('Status', 'eye');
                        this.setRepos(myRepoFetcherTask.currentFirebaseRepos);
                        break;
                    case 'not reviewed':
                        firebaseHelper.getAssignedReviews('dUTeGpNEk0gHhavOYUgoWxYVkUr2',function (repos) {
                            self.setRepos(repos);
                        });
                        this.setButton('Review erstellen', 'add');
                        break;
                    case 'reviewed':
                        this.setButton('Review ansehen', 'eye');
                        break;
                }
            });
        },
        computed: {

        },
        methods: {
            onDashboardItemClicked: function (item) {
                this.currRepoName = item.name;
                this.currUserName = item.userName;
                EventBus.$emit('onDashboardCardClicked', [this.currRepoName, this.currUserName]);
                switch (this.buttonTitle) {
                    case 'Freigeben':
                        this.publishRepo(this.currRepoName);
                        break;
                    case 'Status':
                        this.toggleRepoStatus();
                        break;
                    case 'Review erstellen':
                        this.$router.replace('createReview');
                        break;
                    case 'Review ansehen':
                        this.$router.replace('reviews');
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
            toggleRepoStatus() {
                this.openRepoStatus = !this.openRepoStatus;
                let myRepoStatusFetcherTask = new RepoStatusFetcherTask(this.currRepoName, firebaseHelper, this.onStatusAvailable);
                myRepoStatusFetcherTask.run();
            },
            toggleNotSubmitted() {
                this.openNotSubmitted = !this.openNotSubmitted;
            },
            onStatusAvailable(status) {
            },
            publishRepo(repo) {
                self = this;
                octokitHelper.isSubmitted(repo, function (isSubmitted) {
                    if (isSubmitted) {
                        self.$router.replace({ name: 'publishRepo', params: { repoTitle: self.currRepoName,
                        uid: 'dUTeGpNEk0gHhavOYUgoWxYVkUr2'}});
                    } else {
                        self.toggleNotSubmitted();
                    }
                });
            }
        },
        mixins: [dashboardMixin]
    }
</script>

<style>
    .dashboard {
        padding-top: 5em;
    }
</style>