<template>
    <div id="nav-bar">
       <!-- <sui-menu borderless attached="top">
            <sui-menu-item>Logo</sui-menu-item>
            <sui-menu>
            <sui-menu-menu >
                <sui-menu-item @click="toMessages">
                    Nachrichten
                </sui-menu-item>
                <sui-menu-item>Bewertungen</sui-menu-item>
                <sui-dropdown item>
                    <sui-dropdown-header>
                    </sui-dropdown-header>
                    <sui-dropdown-menu>
                        <sui-dropdown-item>Hilfe</sui-dropdown-item>
                        <sui-dropdown-item @click="logout">Abmelden</sui-dropdown-item>
                    </sui-dropdown-menu>
                </sui-dropdown>
            </sui-menu-menu>
            </sui-menu>
        </sui-menu> -->

        <sui-menu borderless inverted attached="top">
            <a
                    is="sui-menu-item"
                    :active="isActive('Home')"
                    content="Home"
                    @click="select('Home')">
            </a>
            <sui-menu-menu position="right">
                <a
                        is="sui-menu-item"
                        v-for="item in items"
                        :active="isActive(item)"
                        :key="item"
                        :content="item"
                        @click="select(item); toMessages()">
                </a>
                <sui-dropdown item
                              :active="isActive('Account')"
                              content="Account"
                              @click="select('Account')">
                    <sui-image src="https://api.adorable.io/avatars/285/abott@adorable.png" avatar></sui-image>
                    <sui-dropdown-menu>
                        <sui-dropdown-item>Hilfe</sui-dropdown-item>
                        <sui-dropdown-item @click="logout">Abmelden</sui-dropdown-item>
                    </sui-dropdown-menu>
                </sui-dropdown>
            </sui-menu-menu>
        </sui-menu>

    </div>
</template>

<script>
    import firebase from 'firebase';
    import 'semantic-ui-css/semantic.min.css';
    import listMessages from '../components/ListMessages.vue';

    export default {
        name: 'app',
        data() {
            return {
                active: 'Home',
                items: ['Bewertungen', 'Nachrichten'],
            };
        },

        methods: {
            logout: function () {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('login');
                })
            },
            toMessages: function () {
                this.$router.push({name: 'messages', component: listMessages});
            },
            isActive(name) {
                return this.active === name;
            },
            select(name) {
                this.active = name;
            },
        },
    }
</script>

<style>

    .dropdown.icon {
        display: none;
    }
</style>
