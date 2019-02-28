/* global MyReviewApp */
/* global EventPublisher */
/* global _ */

/** 
 * DashboardModel: Responsible for saving the current state of the dashboard on the main page.
 * This includes saving a filtered list of each applied filter (freigegebene/nicht freigebegeben Projekte etc.),
 * pushing them into the current list where all results from all applied filters are stored and comparing those filtered list
 * with the current list. 
 */

var MyReviewApp = MyReviewApp || {};
MyReviewApp.DashboardModel = function (projectList) {
    "use strict";

    let that = new EventPublisher(),
        filteredList;

    /* Callback --> provides the results of all applied filters */
    function provideFilteredProjects() {
        that.notifyAll("projectsFiltered", filteredList);
    }

    function applyFilter(data) {
        filteredList = [];
        filterProjects(data);
        provideFilteredProjects();
    }

    function filterProjects(category) {
        switch (category) {
            case "released":
                filteredList = _.where(projectList, {status: "freigegeben"});
                break;
            case "not released":
                filteredList = _.where(projectList, {status: "noch nicht freigegeben"});
                break;
            case "reviewed":
                filteredList = _.where(projectList, {status: "reviewed"});
                break;
            case "not reviewed":
                filteredList = _.where(projectList, {status: "noch nicht reviewed"});
                break;
        }
    } 
 
    that.applyFilter = applyFilter;
    return that;
};