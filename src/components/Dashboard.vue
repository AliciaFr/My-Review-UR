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
                                <sui-button attached="bottom" @click="onDashboardItemClicked()">
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
        <sui-modal v-model="openAlert" animation="scale" :closable="false">
            <sui-modal-header>Der aktuelle Fortschritt zu deinem freigegebenen Projekt.</sui-modal-header>
            <sui-modal-content>
                <sui-modal-description>
                    <sui-header>Title</sui-header>
                    <div>
                        <sui-step-group step-number="three">
                            <sui-step
                                    title="Zuweisung"
                                    description="Dein Projekt wird einem anderen Nutzer zugewiesen."
                                    icon="check">
                                </sui-step>
                            <sui-step
                                    active
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
                <sui-button color="black" @click.native="toggleAlert()">
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

    export default {
        data: function() {
            return {
                repos: [
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
                openAlert: false
            };
        },
        components: {
            'dashboard-nav': dashboardNav
        },
        mounted: function () {
            EventBus.$on('onDashboardItemClick', category => {
                console.log(this);
                console.log(category);
                switch (category) {
                    case 'not published':
                        this.setButton('Freigeben', 'add');
                        break;
                    case 'published':
                        this.setButton('Status', 'eye');
                        break;
                    case 'not reviewed':
                        this.setButton('Review erstellen', 'add');
                        break;
                    case 'reviewed':
                        this.setButton('Review ansehen', 'eye');
                        break;
                }
            });
        },
        methods: {
            onDashboardItemClicked: function () {
                switch (this.buttonTitle) {
                    case 'Freigeben':
                        this.$router.replace('publishRepo');
                        break;
                    case 'Status':
                        this.toggleAlert();
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
            goBack() {
                this.$router.replace(-1);
            },
            toggleAlert() {
                this.openAlert = !this.openAlert;

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