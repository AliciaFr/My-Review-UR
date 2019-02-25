const express = require("express");
const app = express();
const PORT = process.env.PORT || 9292;

const path = require("path");

let config = require("./config.js");

let githubOAuth = require('github-oauth')({
    githubClient: config.GITHUB_KEY,
    githubSecret: config.GITHUB_SECRET,
    baseURL: 'http://localhost:' + PORT,
    loginURI: '/auth/github',
    callbackURI: '/auth/github/callback'
});
let usserToken;

// Login Page of the app
app.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "login.html"));
    app.use(express.static(path.resolve(__dirname, "../client", "login.html")));
});

// Sending request to Login with GitHub
app.get("/auth/github", function(req, res){
    console.log("started oauth");
    return githubOAuth.login(req, res);
});

// Page where the user is directed to after accepting authorization
app.get("/auth/github/callback", function(req, res){
    console.log("received callback");
    res.redirect("/home");
    return githubOAuth.callback(req, res);
});

app.get("/home", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "index.html"));
    app.use(express.static("client"));
});

githubOAuth.on('error', function(err) {
    console.error('there was a login error', err)
});

githubOAuth.on('token', function(token, serverResponse) {
    serverResponse.end(JSON.stringify(token));
    console.log(JSON.stringify(token.access_token));
    //app.use(express.static("client"));

});

let server = app.listen(PORT, function() {
    console.log('Listening on port %d', server.address().port);
});