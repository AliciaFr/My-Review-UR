<template>
    <div class="write-rating">
        <div>
            <sui-message attached>
                <sui-message-header>Schreibe eine Bewertung</sui-message-header>
                <p>Gebe {{ reviewer }} Feedback zu dem Review und helfe ihr/ihm dabei sich zu verbessern.</p>
            </sui-message>
            <sui-segment attached>
                <sui-form>
                    <sui-form-fields grouped>
                        <sui-form-field>
                            <label>War das Review für dich hilfreich?</label>
                            <sui-checkbox
                                    label="Ja"
                                    radio
                                    value="ja"
                                    v-model="value">
                            </sui-checkbox>
                            <sui-checkbox
                                    class="not-helpful"
                                    label="Nein"
                                    radio
                                    value="nein"
                                    v-model="value">
                            </sui-checkbox>
                        </sui-form-field>
                    </sui-form-fields>
                    <sui-form-field>
                        <label>Was möchtest du {{ reviewer }} mitteilen?</label>
                        <textarea v-model="rating" placeholder="Schreibe eine Bewertung."></textarea>
                    </sui-form-field>
                    <sui-form-field>
                        <sui-button basic color="black" @click="saveRating()">Bewerten</sui-button>
                    </sui-form-field>
                </sui-form>
            </sui-segment>
        </div>
    </div>
</template>

<script>
    import FirebaseHelper from '../javascript/FirebaseHelper';

    let myFirebaseHelper = new FirebaseHelper();

    export default {
        props: {
            reviewer: String,
            reviewId: String
        },
        data() {
            return {
                value: 'ja',
                rating: ''
            };
        },
        methods: {
            saveRating: function () {
                myFirebaseHelper.setReviewForReviewer(this.reviewId, this.value, this.rating);
            }
        }
    }
</script>

<style>
    .not-helpful {
        padding-left:2em;
    }
</style>













