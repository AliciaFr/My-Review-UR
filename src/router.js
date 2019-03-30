import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Messages from './views/Messages.vue';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '*',
            redirect: '/login'
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: 'messages',
                    name: 'messages',
                    alias: '/messages',
                    component: Messages
                }
            ]

        },
    ],
    mode: "history"
});

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !currentUser) next('login');
    else if (!requiresAuth && currentUser) next('home');
    else if (!requiresAuth && currentUser) next('messages');
    else next();
});

export default router;
