/* global MyReviewApp */
/* global EventPublisher */

/* DashboardController: Controlls all buttons from the list to select a category */

const releasedProjectsButton = document.querySelector("#releasedButton"),
    notReleasedProjectsButton = document.querySelector("#notReleasedButton"),
    reviewedProjectsButton = document.querySelector("#reviewedButton"),
    notReviewedProjectsButton = document.querySelector("#notReviewedButton");

var MyReviewApp = MyReviewApp || {};
MyReviewApp.DashboardController = function() {
    "use strict";
    
    let that = new EventPublisher();

    function onReleasedProjetsClicked() {
        that.notifyAll("onReleasedProjectsClicked", "released");
    }

    function onNotReleasedProjectsClicked() {
        that.notifyAll("onNotReleasedProjectsClicked", "not released");
    }

    function onReviewedProjectsClicked() {
        that.notifyAll("onReviewedProjectsClicked", "reviewed");
    }

    function onNotReviewedProjectsClicked() {
        that.notifyAll("onNotReviewedProjectsClicked", "not reviewed");
    }

    function init() {
        releasedProjectsButton.addEventListener("click", onReleasedProjetsClicked);
        notReleasedProjectsButton.addEventListener("click", onNotReleasedProjectsClicked);
        reviewedProjectsButton.addEventListener("click", onReviewedProjectsClicked);
        notReviewedProjectsButton.addEventListener("click", onNotReviewedProjectsClicked);
    }

    init();
    return that;
};