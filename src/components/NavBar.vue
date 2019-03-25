<template>
    <div id="nav-bar">
        <sui-menu borderless attached="top">
            <sui-menu-item>Logo</sui-menu-item>
            <sui-menu-menu position="right">
                <sui-menu-item>
                    <router-link to="/messages">Add a new blog</router-link>
                </sui-menu-item>
                <sui-menu-item>Bewertungen</sui-menu-item>
                <sui-dropdown item>
                    <sui-dropdown-header>
<p>dfds</p>
                    </sui-dropdown-header>
                    <sui-dropdown-menu>
                        <sui-dropdown-item>Hilfe</sui-dropdown-item>
                        <sui-dropdown-item v-on:click="logout">Abmelden</sui-dropdown-item>
                    </sui-dropdown-menu>
                </sui-dropdown>
            </sui-menu-menu>
        </sui-menu>
    </div>
</template>

<script>
    import firebase from 'firebase';
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

</style>
