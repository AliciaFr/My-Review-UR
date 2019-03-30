<template>
    <sui-segment>
        <sui-list link relaxed>
            <sui-list-item>
                    <p><sui-list-header>Deine Projekte</sui-list-header></p>
                    <p><a is="sui-list-item">Noch nicht freigegeben</a></p>
                    <p><a is="sui-list-item">Von Dir freigegeben</a></p>
            </sui-list-item>
            <sui-list-item>
                <p><sui-list-header>Dir zugewiesene Projekte</sui-list-header></p>
                <p><a is="sui-list-item">Noch nicht reviewt</a></p>
                <p><a is="sui-list-item">Von Dir reviewt</a></p>
            </sui-list-item>
        </sui-list>
    </sui-segment>
</template>

<script>
    import 'semantic-ui-css/semantic.min.css';

    export default {
        name: 'app',

        methods: {
            logout: function () {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('login');
                })
            }
        }
    }
</script>

<style>
    .ui.list .list>.item, .ui.list>.item, ol.ui.list li, ul.ui.list li {
        text-align: left;
        margin: 10px;
    }
</style>
