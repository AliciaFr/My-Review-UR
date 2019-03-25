<template>
    <div class="list-messages">
        <div class="messages">
            <sui-grid :columns="16" stackable textAlign="left">
                <sui-grid-row>
                    <sui-grid-column :width="3"></sui-grid-column>
                    <sui-grid-column :width="10">
                        <sui-header size="huge">Deine Bewertungen</sui-header>
                    </sui-grid-column>
                    <sui-grid-column :width="3"></sui-grid-column>
                </sui-grid-row>
                <sui-grid-row stretched>
                    <sui-grid-column :width="3"></sui-grid-column>
                    <sui-grid-column :width="10">
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
                    <sui-grid-column :width="3"></sui-grid-column>
                </sui-grid-row>
            </sui-grid>
        </div>
    </div>
</template>

<script>
    import navMenu from './RatingsAndReviewsNav.vue';
    import ratings from './Ratings.vue';
    import reviews from './Reviews.vue';

    let tabs = [
            {
                title: 'Erhaltene Reviews',
                component: reviews
            },
            {
                title: 'Vergebene Reviews',
                component: ratings
            }];

    export default {
        data() {
            return {
                tabs: tabs,
                currentTab: tabs[0]
            }
        },
        components: {
            'nav-menu': navMenu,
            'ratings': ratings,
            'reviews': reviews
        }
    }
</script>

<style>
    .list-messages {
        padding-bottom: 15em;
    }
</style>