/* global MyReviewApp */
/* global EventPublisher */

const dashboardEntry = document.getElementsByClassName("card"),
    dashboardEntryButton = document.querySelector("dashboardEntryActionButton");

var MyReviewApp = MyReviewApp || {};
MyReviewApp.DashboardElController = function() {
    "use strict";
    
    let that = new EventPublisher(),
        i;

    return that;
};