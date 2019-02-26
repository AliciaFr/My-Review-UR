/* global MyReviewApp */
/* global _ */

/** 
 * DashboardView: Representation of all projects and actualisation of the dashboard when a filter is applied.
 */

 var MyReviewApp = MyReviewApp || {};
 MyReviewApp.DashboardView = function (dashboardEl, dashboardItemTemplate) {
    "use strict";
    let that = {}, 
        filteredListArray;

    function showAllEntries(projectList) {
        let entryTemplateContent = dashboardItemTemplate.innerHTML,
            createEntryTemplate = _.template(entryTemplateContent),
            entryNode = document.createElement("div");
        for(let i = 0; i < projectList.length; i++) {
            entryNode.innerHTML = createEntryTemplate(projectList[i]);
            dashboardEl.appendChild(entryNode.children[0]);
        }
    }

    function hideFilteredEntries(projectList) {
        for(let i = 0; i < projectList.length; i++) {
            let projectID = i + 1,
                projectEl = dashboardEl.querySelector('[project-id="' + projectID + '"]');
            if(_.contains(filteredListArray, projectList[i])) {
                projectEl.style.display = "";
            } else {
                projectEl.style.display = "none";
            }
          }
      }

    function getFilteredList(filteredList) {
        filteredListArray = filteredList;
    }

    that.hideFilteredEntries = hideFilteredEntries;
    that.getFilteredList = getFilteredList;
    that.showAllEntries = showAllEntries;
    return that;
 };