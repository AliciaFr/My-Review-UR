<template>
    <div class="reviews">
        <sui-grid :columns="16" stackable textAlign="left">
            <sui-grid-row>
                <sui-grid-column :width="4"></sui-grid-column>
                <sui-grid-column :width="8">
                    <sui-header size="huge">Deine Bewertungen</sui-header>
                </sui-grid-column>
                <sui-grid-column :width="4"></sui-grid-column>
            </sui-grid-row>
            <sui-grid-row stretched>
                <sui-grid-column :width="4"></sui-grid-column>
                <sui-grid-column :width="8">
                    <div class="all-reviews-nav">
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
                </sui-grid-column>
                <sui-grid-column :width="4"></sui-grid-column>
            </sui-grid-row>
        </sui-grid>
    </div>
</template>

<script>
    import reviewsForReviewer from '../components/ReviewsForReviewer.vue';
    import reviewsForProjects from '../components/ReviewsForProjects.vue';

    let tabs = [
        {
            title: 'Bewertungen für deine Projekte',
            component: reviewsForProjects
        },
        {
            title: 'Bewertungen für deine Reviews',
            component: reviewsForReviewer
        }];

    export default {
        data() {
            return {
                tabs: tabs,
                currentTab: tabs[0]
            }
        },
        mounted () {
            if (this.$route.params.prevRoute === 'dashboard') {
                this.currentTab = tabs[1];
            }
        },
        components: {
            "reviewsForReviewer": reviewsForReviewer,
            'reviewsForProjects': reviewsForProjects
        }
    }
</script>

<style>
    .reviews {
        padding-top: 5em;
    }
    .list-messages {
        padding-bottom: 15em;
    }
</style>