<template>
    <div class="home">
        <dashboard></dashboard>
    </div>
</template>

<script>
    import 'semantic-ui-css/semantic.min.css';
    import dashboardMixin from '../mixins/dashboardMixin';
    import dashboard from '../components/Dashboard.vue';

    export default {
        name: 'home',
        components: {
            'dashboard': dashboard
        },
        methods: {},
        mixins: [dashboardMixin]
    }
</script>
