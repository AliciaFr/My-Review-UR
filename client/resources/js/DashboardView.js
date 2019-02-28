/* global MyReviewApp */
/* global _ */

/** 
 * DashboardView: Representation of all projects and actualisation of the dashboard when a filter is applied.
 */

 const dashboardItemTemplateReleased = document.querySelector("#dashboard-entry-released"),
    dashboardItemTemplateNotReleased = document.querySelector("#dashboard-entry-not-released"),
    dashboardItemTemplateReviewed = document.querySelector("#dashboard-entry-reviewed"),
    dashboardItemTemplateNotReviewed = document.querySelector("#dashboard-entry-not-reviewed");

 var MyReviewApp = MyReviewApp || {};
 MyReviewApp.DashboardView = function (dashboardEl) {
    "use strict";
    let that = {}, 
        filteredListArray;

    function createProjectCard(dashboardItemTemplate) {
        let entryTemplateContent = dashboardItemTemplate.innerHTML,
            createEntryTemplate = _.template(entryTemplateContent),
            entryNode = document.createElement("div");
        clearList();
        for(let i = 0; i < filteredListArray.length; i++) {
            entryNode.innerHTML = createEntryTemplate(filteredListArray[i]);
            dashboardEl.appendChild(entryNode.children[0]);
        }
    }

    function createContentForEntries(data) {
        switch (data) {
            case "released":
                createProjectCard(dashboardItemTemplateReleased);
                break;
            case "not released":
                createProjectCard(dashboardItemTemplateNotReleased);
                break;
            case "reviewed":
                createProjectCard(dashboardItemTemplateReviewed);
                break;
            case "not reviewed":
                createProjectCard(dashboardItemTemplateNotReviewed);
                break;
        }
    }

    function clearList() {
        dashboardEl.innerHTML = "";
    }

    function getFilteredList(filteredList) {
        filteredListArray = filteredList;
    }

    that.createContentForEntries = createContentForEntries;
    that.getFilteredList = getFilteredList;
    return that;
 };