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
                        <nav-menu></nav-menu>
                        <reviews></reviews>
                        <ratings></ratings>
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

    export default {
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