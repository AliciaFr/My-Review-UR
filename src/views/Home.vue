<template>
    <div class="home">
        <dashboard></dashboard>
        <write-rating></write-rating>
    </div>
</template>

<script>
    import 'semantic-ui-css/semantic.min.css';
    import dashboardMixin from '../mixins/dashboardMixin';
    import dashboard from '../components/Dashboard.vue';
    import writeRating from '../components/WriteRating.vue';

    export default {
        name: 'home',
        components: {
            'dashboard': dashboard,
            'write-rating': writeRating
        },
        methods: {},
        mixins: [dashboardMixin]
    }
</script>
