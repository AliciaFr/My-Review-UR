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
        currentList = [],
        filteredList;

    /* Callback --> provides the results of all applied filters */
    function provideFilteredProjects() {
        that.notifyAll("projectsFiltered", currentList);
    }

    function showAllEntries() {
        clearFilter();
        currentList = projectList;
        provideFilteredProjects();
    }

    function filterByReviewedProjects() {
        clearFilter();
        filteredList = _.where(projectList, {status: "reviewed"});
        currentList = filteredList;
        provideFilteredProjects();
    } 

    function filterByNotReviewedProjects() { 
        clearFilter();   
        filteredList = _.where(projectList, {status: "noch nicht reviewed"});
        currentList = filteredList;
        provideFilteredProjects();
    }

    function filterByReleasedProjects() {
        clearFilter();
        filteredList = _.where(projectList, {status: "freigegeben"});
        currentList = filteredList;
        provideFilteredProjects();
    }

    function filterByNotReleasedProjects() {
        clearFilter();
        filteredList = _.where(projectList, {status: "noch nicht freigegeben"});
        currentList = filteredList;
        provideFilteredProjects();;
    }

    function clearFilter() {
        currentList = [];
    }
 
    that.filterByReviewedProjects = filterByReviewedProjects;
    that.filterByNotReviewedProjects = filterByNotReviewedProjects;
    that.filterByReleasedProjects = filterByReleasedProjects;
    that.filterByNotReleasedProjects = filterByNotReleasedProjects;
    return that;
};