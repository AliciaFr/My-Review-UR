<template>
    <div class="home">
        <app-header></app-header>
        <dashboard></dashboard>
        <write-rating></write-rating>
    </div>
</template>

<script>
    import 'semantic-ui-css/semantic.min.css';
    import dashboardMixin from '../mixins/dashboardMixin';
    import navBar from '../components/NavBar.vue';
    import dashboard from '../components/Dashboard.vue';
    import shareProject from '../components/ShareProject.vue';
    import createReview from '../components/CreateReview.vue';
    import allRatings from '../components/RatingsAndReviews.vue';
    import writeRating from '../components/WriteRating.vue';

    export default {
        name: 'home',
        components: {
            'app-header': navBar,
            'dashboard': dashboard,
            'share-project': shareProject,
            'create-review': createReview,
            'ratings': allRatings,
            'write-rating': writeRating
        },
        methods: {},
        mixins: [dashboardMixin]
    }
</script>
