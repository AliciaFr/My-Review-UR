<template>
    <div class="create-review-overview">
        <sui-segment aligned="left">
            <sui-segment vertical padded="very">
                <div class="ui medium header">Aufgabenstellung</div>
                <p>{{ taskDescription }}</p>
            </sui-segment>
            <sui-segment vertical padded="very">
                <sui-header size="medium">Erweiterungen der Aufgabenstellung</sui-header>
                <p>{{ extensions }}</p>
            </sui-segment>
            <sui-segment vertical padded="very">
                <sui-header size="medium">Testing-Fehler</sui-header>
                <p>{{ testingErrors }}</p>
            </sui-segment>
        </sui-segment>
    </div>
</template>

<script>
    import FirebaseHelper from '../javascript/FirebaseHelper';
    import OctokitHelper from '../javascript/github/OctokitHelper';

    let myFirebaseHelper = new FirebaseHelper();
    let myOctokitHelper = new OctokitHelper();

    export default {
        props: {
            repoName: String,
            repoAuthor: String
        },
        data() {
            return {
                taskDescription: '',
                testingErrors: '',
                noTestingErrors: 'Die Anwendung funktioniert fehlerfrei./Es wurden keine Testing-Fehler gefunden.',
                extensions: '',
                noExtensions: 'Es wurden keine Erweiterungen implementiert.'
            }
        },
        mounted() {
            let self = this;
            myOctokitHelper.getProjectTask(this.repoName, function (task) {
                self.taskDescription = task;
            });
            myFirebaseHelper.getTestingErrors(this.repoName, this.repoAuthor, function (testingErrors) {
                if (testingErrors === '') {
                    self.testingErrors = self.noTestingErrors;
                } else {
                    self.testingErrors = testingErrors;
                }
            });
            myFirebaseHelper.getExtensions(this.repoName, this.repoAuthor, function (extensions) {
                if (extensions === '') {
                    self.extensions = self.noExtensions;
                } else {
                    self.extensions = extensions;
                }
            });
        }
    }
</script>

<style>
    .create-review-overview {
        padding-top: 2em;
    }

    .ui.padded.segment {
        margin-left: 2em;
        margin-right: 2em;
    }
</style>