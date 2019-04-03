<template>
    <div class="login">
        <h3>Anmeldung</h3>
        <p>
            <br>Bitte logge dich mit deinem GitHub Account ein um Zugriff auf My Review zu erhalten.<br/>
            <button v-on:click="gitHubLogin" class="social-button">
                <img alt="GitHub Logo" src="../assets/github_logo.png">
            </button>
        </p>
    </div>
</template>

<script>
    import oAuthMixin from '../mixins/oAuthMixin';
    export default {
        name: 'login',
        data() {
            return {}
        },
        methods: {
            gitHubLogin: oAuthMixin.methods.gitHubLogin
        }
    }
</script>


<style scoped>
    .login {
        padding: 40px;
        margin: 40px;
        box-sizing: border-box;
    }

    input {
        margin: 10px 0;
        width: 20%;
        padding: 15px;
    }

    button {
        margin-top: 20px;
        width: 10%;
        cursor: pointer;
    }

    p {
        margin-top: 40px;
        font-size: 13px;
    }

    p a {
        text-decoration: underline;
        cursor: pointer;
    }

    .social-button {
        width: 75px;
        background: white;
        padding: 10px;
        border-radius: 100%;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        outline: 0;
        border: 0;
    }

    .social-button:active {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    }

    .social-button img {
        width: 100%;
    }
</style>