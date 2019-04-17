<template>
    <div class="review-rating">
        <sui-segment :class="{ hidden: isNotReviewed }">
            <sui-item-group>
            <sui-item id="single-review">
                <sui-item-content>
                    <sui-item-header>Deine Bewertung für das Review</sui-item-header>
                    <sui-item-meta>
                        <sui-icon :name="setHelpfulIcon" :color="setHelpfulIconColor"></sui-icon>
                        <span v-bind:class="setHelpfulColor">{{ reviewWasHelpful }}</span>
                    </sui-item-meta>
                    <sui-item-description>
                        <p>{{ reviewComment }}</p>
                    </sui-item-description>
                    <sui-item-extra>
                        <span>24.03.2019</span>
                    </sui-item-extra>
                </sui-item-content>
            </sui-item>
            </sui-item-group>
        </sui-segment>
        <write-rating :class="{ hidden: !isNotReviewed }" :reviewer="reviewer" :reviewId="reviewId"></write-rating>
    </div>
</template>

<script>
    import FirebaseHelper from '../javascript/FirebaseHelper';
    import writeRating from '../components/WriteRating.vue';

    export default {
        props: {
            reviewId: String,
            reviewer: String
        },
        data() {
            return {
                reviewComment: '',
                reviewWasHelpful: '',
                helpfulReview: 'Du hast dieses Review als hilfreich bewertet.',
                notHelpfulReview: 'Du hast dieses Review als nicht hilfreich bewertet.',
                helpfulStyle: '',
                notReviewed: false,
                helpful: false,
                helpfulIcon: ''
            }
        },
        mounted () {
            let firebaseHelper = new FirebaseHelper();
            let self = this;
            firebaseHelper.getReviewForReviewer(self.reviewId).then(function (review) {
                self.reviewComment = review.rating;
                self.reviewWasHelpful = review.helpful;
                self.isHelpfulReview(self.reviewWasHelpful);
            });
        },
        components: {
            'write-rating': writeRating
        },
        computed: {
            isNotReviewed () {
                if (this.reviewComment === '') {
                    return this.notReviewed = !this.notReviewed;
                }
            },
            setHelpfulIcon () {
                if (this.helpful === false) {
                    return 'thumbs down outline';
                } else {
                    return 'thumbs up outline';
                }
            },
            setHelpfulIconColor () {
                if (this.helpful === false) {
                    return 'red';
                } else {
                    return 'green';
                }
            },
            setHelpfulColor () {
                if (this.helpful === false) {
                    return 'review-not-helpful';
                } else {
                    return 'review-helpful';
                }
            }
        },
        methods: {
            isHelpfulReview (helpful) {
                if (helpful === "ja") {
                    this.helpful = !this.helpful;
                    this.reviewWasHelpful = this.helpfulReview;
                } else if (helpful === 'nein') {
                    this.reviewWasHelpful = this.notHelpfulReview;
                }
            },
        }
    }
</script>

<style>
    .review-rating {
        padding-top: 2em;
    }

    .hidden {
        display: none;
    }

    .ui.padded.segment {
        margin-left: 2em;
        margin-right: 2em;
    }

    .review-not-helpful {
        color: crimson;
    }

    .review-helpful {
        color: seagreen;
    }
</style>