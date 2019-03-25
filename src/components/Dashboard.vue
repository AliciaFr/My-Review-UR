<template>
    <div class="dashboard">
        <sui-grid :columns="16" stackable>
            <sui-grid-row stretched>
                <sui-grid-column :width="2"></sui-grid-column>
                <sui-grid-column :width="3">
                    <dashboard-nav></dashboard-nav>

                </sui-grid-column>
                <sui-grid-column :width="9">
                    <div>
                        <sui-card-group :items-per-row="3">
                            <sui-card>
                                <sui-card-content>
                                    <sui-card-header>MME-UE-03</sui-card-header>
                                    <sui-card-meta>Koala05</sui-card-meta>
                                </sui-card-content>
                                <sui-button attached="bottom">
                                    <sui-icon name="add"/>
                                    Freigeben
                                </sui-button>
                            </sui-card>
                        </sui-card-group>
                    </div>
                    <button @click="userRepos">userRepos</button>
                </sui-grid-column>
                <sui-grid-column :width="2"></sui-grid-column>
            </sui-grid-row>
        </sui-grid>
    </div>
</template>

<script>
    import 'semantic-ui-css/semantic.min.css';
    import dashboardMixin from '../mixins/dashboardMixin';
    import dashboardNav from '../components/DashboardNav.vue';

    export default {
        components: {

            'dashboard-nav': dashboardNav
        },
        methods: {},
        mixins: [dashboardMixin]
    }
</script>

<style>
    .dashboard {
        padding-top: 5em;
    }
</style>