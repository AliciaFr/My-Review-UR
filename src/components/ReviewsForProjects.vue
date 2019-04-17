<template>
    <div class="project-reviews">
        <sui-segment>
            <p class="info">Bewertungen werden im Anschluss an ein erhaltenes Review verfasst. Die Bewertungen, die du erhalten hast sind nicht für andere sichtbar.</p>
            <sui-header :class="hasNoReviews" size="medium">Ups! Du hast noch keine Bewertungen bekommen.</sui-header>
            <sui-item-group divided padded="very">
                <sui-item id="single-review" v-for="review in reviews">
                    <sui-item-image size="mini" :src="setProfilePicture(review.author)"></sui-item-image>
                    <sui-item-content>
                        <sui-item-header>{{ review.repo }}</sui-item-header>
                        <sui-item-meta>
                            <span>{{ review.reviewerName }}</span>
                        </sui-item-meta>
                        <sui-item-extra>
                            <span>{{ review.date }}</span>
                        </sui-item-extra>
                    </sui-item-content>
                    <sui-item-description vertical-align="right">
                        <sui-button class="review-button" basic color="black" @click="viewReview(review)">Zum Review</sui-button>
                    </sui-item-description>
                </sui-item>
            </sui-item-group>
        </sui-segment>
    </div>
</template>

<script>
    import LocalStorageHelper from '../javascript/LocalStorageHelper';
    import FirebaseHelper from '../javascript/FirebaseHelper';
    import ReviewsForUserFetcherTask from '../javascript/database/ReviewsForUserFetcherTask';
    import OctokitHelper from '../javascript/github/OctokitHelper';

    let myLocalStorageHelper = new LocalStorageHelper();
    let myFirebaseHelper = new FirebaseHelper();
    let myOctokitHelper = new OctokitHelper();

    export default {
        props: {
            projectReviews: Array
        },
        data() {
            return {
                reviews: [],
                profilePicture: '',
                uid: myLocalStorageHelper.getUserId()
            }
        },
        mounted() {
            this.setReviews();
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
            viewReview (review) {
                let self = this;
                let reviewer = review.reviewerName.replace(/\s/g, '-');
                myOctokitHelper.getReviewBranchSha(review.repo, reviewer, function (branchSha) {
                    self.setRouteParams(review, branchSha);
                });

            },
            setReviews () {
                let self = this;
                let task = new ReviewsForUserFetcherTask(this.uid, function (reviews) {
                    console.log(reviews);
                    self.reviews = reviews;
                });
                task.run();

            },
            setRouteParams (review, branchSha) {
                this.$router.replace({
                    name: 'viewReview',
                    params: {
                        id: review.id,
                        repoTitle: review.repo,
                        repoAuthor: '',
                        reviewerName: review.reviewerName,
                        prevRoute: 'reviews',
                        branchSha: branchSha
                    }
                });
            }
        }
    }
</script>

<style>
    .project-reviews {
        padding-top: 2em;
    }

    #single-review {
        padding-left: 2em;
        padding-bottom: 2em;
        padding-top: 2em!important;
        margin-bottom: 1em
    }

    .ui.segment {
        padding-bottom: 2em;
    }

    .review-button {
        margin-right: 4em!important;
    }

    .no-reviews {
        padding-left: 2em!important;
        padding-bottom: 5em!important;
    }

    .has-reviews {
        display: none;
    }
</style>