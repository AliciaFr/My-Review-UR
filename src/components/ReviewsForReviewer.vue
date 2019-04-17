<template>
    <div class="reviews-for-reviewer">
        <sui-segment>
            <p class="info">Bewertungen werden im Anschluss an ein erhaltenes Review verfasst. Die Bewertungen, die du erhalten hast sind nicht für andere sichtbar.</p>
            <sui-header :class="hasNoReviews" size="medium">Ups! Du hast noch keine Bewertungen bekommen.</sui-header>
            <sui-item-group divided>
                <sui-item v-for="review in reviews" id="single-review">
                    <sui-item-image size="mini" :src="setProfilePicture(review.author)"></sui-item-image>
                    <sui-item-content>
                        <sui-item-header>{{ review.name }}</sui-item-header>
                        <sui-item-meta>
                            <span>{{ review.userName }}</span>
                        </sui-item-meta>
                        <sui-item-meta>
                            <sui-icon :name="setHelpfulIcon(review.helpful)" :color="setHelpfulIconColor(review.helpful)"></sui-icon>
                            <span :class="setHelpfulColor(review.helpful)" v-html="setHelpfulText(review.helpful)"></span>
                        </sui-item-meta>
                        <sui-item-description>
                            <p>{{ review.rating }}</p>
                        </sui-item-description>
                        <sui-item-extra>
                            <span>{{ review.reviewDate }}</span>
                        </sui-item-extra>
                    </sui-item-content>
                </sui-item>
            </sui-item-group>
        </sui-segment>
    </div>
</template>

<script>
    import FirebaseHelper from '../javascript/FirebaseHelper';
    import LocalStorageHelper from '../javascript/LocalStorageHelper';

    let myFirebaseHelper = new FirebaseHelper();
    let myLocalStorageHelper = new LocalStorageHelper();

    export default {
        data() {
            return {
                reviews: [],
                reviewText: '',
                isHelpful: 'Dein Review wurde als hilfreich bewertet',
                isNotHelpful: 'Dein Review wurde als nicht hilfreich bewertet',
                noReviews: false
            }
        },
        mounted () {
            let self = this;
            myFirebaseHelper.getReviewsForReviewer(myLocalStorageHelper.getUserId(), function (reviews) {
               self.reviews = reviews;
            });
        },
        computed: {
            hasNoReviews: function () {
                if (this.reviews.length === 0) {
                    return 'no-reviews';
                } else {
                    return 'has-reviews';
                }
            }
        },
        methods: {
            setProfilePicture: function (reviewerId) {
                let self = this;
                myFirebaseHelper.getProfilePicture(reviewerId, function (path) {
                    self.profilePicture = path;
                });
                return this.profilePicture;
            },
            setHelpfulIcon (helpful) {
                if (helpful === 'nein') {
                    return 'thumbs down outline';
                } else {
                    return 'thumbs up outline';
                }
            },
            setHelpfulIconColor (helpful) {
                if (helpful === 'nein') {
                    return 'red';
                } else {
                    return 'green';
                }
            },
            setHelpfulColor (helpful) {
                if (helpful === 'nein') {
                    //this.reviewText = this.isNotHelpful;
                    return 'helpful negative';
                } else {
                    //this.reviewText = this.isHelpful;
                    return 'helpful positive';
                }
            },
            setHelpfulText (helpful) {
                if (helpful === 'nein') {
                    return this.isNotHelpful;
                } else {
                    return this.isHelpful;
                }
            }
        }
    }
</script>

<style>
    .info {
        padding-top: 2em;
        margin-bottom: 4em;
        padding-left: 2em;
    }

    .reviews-for-reviewer {
        padding-top: 2em;
    }

    #single-review {
        cursor: default;
        padding-left: 2em;
    }

    .helpful.positive {
        color: green;
    }

    .helpful.negative {
        color: red;
    }

    .no-reviews {
        padding-left: 2em!important;
        padding-bottom: 5em!important;
    }

    .has-reviews {
        display: none;
    }
</style>