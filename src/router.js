import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Messages from './views/Messages.vue';
import CreateReview from './views/CreateReview.vue';
import ShareProject from './components/ShareProject.vue';
import Reviews from './views/Reviews.vue';

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
            props: true,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: 'messages',
            name: 'messages',
            alias: '/messages',
            component: Messages,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: 'createReview',
            name: 'createReview',
            alias: '/createReview',
            component: CreateReview,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: 'publishRepo',
            name: 'publishRepo',
            alias: '/publishRepo',
            component: ShareProject,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: 'reviews',
            name: 'reviews',
            alias: '/reviews',
            component: Reviews,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: 'reviews/:id',
            name: 'viewReview',
            alias: '/reviews/:id',
            component: CreateReview,
            meta: {
                requiresAuth: true
            },
            props: true
        }
    ],
    mode: "history"
});

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !currentUser) next('login');
    else if (!requiresAuth && currentUser) next('home');
    else if (!requiresAuth && currentUser) next('createReview');
    else if (!requiresAuth && currentUser) next('messages');
    else if (!requiresAuth && currentUser) next('viewReview');
    else next();
});

export default router;
