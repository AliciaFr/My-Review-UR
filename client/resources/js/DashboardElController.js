/* global MyReviewApp */
/* global EventPublisher */

const dashboardEntry = document.getElementsByClassName("card"),
    dashboardProjectButton = document.getElementsByClassName("ui bottom attached button");

var MyReviewApp = MyReviewApp || {};
MyReviewApp.DashboardElController = function () {
    "use strict";

    let that = new EventPublisher(),
        i;

    function onProjectClicked(event) {
        let targetElement = event.target || event.srcElement,
            projectID,
            attributeValue = "card",
            clickedProject = targetElement.parentNode;

        while(clickedProject.className !== attributeValue) {
            clickedProject = clickedProject.parentNode;
        }
        projectID = clickedProject.getAttribute("project-id");
        that.notifyAll("onProjectClicked", (projectID-1));
    }

    function init() {
        for(i = 0; i < dashboardEntry.length; i++) {
            dashboardProjectButton[i].addEventListener("click", onProjectClicked);
        }
    }

    that.init = init;
    return that;
}


