/**
 * Created by Alicia on 03.03.2019.
 */
import firebase from 'firebase';


export function

        socialLogin() {
            const provider = new firebase.auth.GithubAuthProvider();
            const database = firebase.database(),
                dbRefObj = database.ref('users/');

            firebase.auth().signInWithPopup(provider).then((result) => {

                let user = result.user,
                    token = result.credential.accessToken,
                    uid = user.uid,
                    isRegistered = false;

                dbRefObj.once('value').then(function (snapshot) {
                    snapshot.forEach((child) => {
                        if (child.val().uid === uid) {
                            isRegistered = true;
                        }
                    });

                    if (isRegistered === false) {
                        dbRefObj.push({
                            uid: uid,
                            username: "",
                            gitHubToken: token,
                            profile_picture: "",
                            projects: "",
                            ratings: "",
                        });
                    }
                });
                this.$router.replace('home');
            }).catch((err) => {
                alert('Oops. ' + err.message);
            });
        }
