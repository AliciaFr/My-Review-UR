/** MyReviewApp: Communication between the modules */

var MyReviewApp = MyReviewApp || (function(){
    "use strict";

    let that = {},
        dashboardView,
        dashboardController,
        dashboardElController,
        dashboardModel,
        database,
        projectList,
        list,
        dashboardEl = document.querySelector("#dashboard");

    function init() {
        initController();
        initUI();
        initFirebase();
    }

    function initController() {
        initDashboardController();
        dashboardElController = new MyReviewApp.DashboardElController();
        dashboardElController.addEventListener("onProjectClicked", onProjectButtonClicked);
    }

    function initDashboardController() {
        dashboardController = new MyReviewApp.DashboardController();
        dashboardController.addEventListener("onReleasedProjectsClicked", onReleasedProjectsButtonClicked);
        dashboardController.addEventListener("onNotReleasedProjectsClicked", onNotReleasedProjectsButtonClicked);
        dashboardController.addEventListener("onReviewedProjectsClicked", onReviewedProjectsButtonClicked);
        dashboardController.addEventListener("onNotReviewedProjectsClicked", onNotReviewedProjectsButtonClicked);
    }
 
    function initUI() {
        dashboardView = new MyReviewApp.DashboardView(dashboardEl);
    }

    function initDashboardModel() {
        dashboardModel = new MyReviewApp.DashboardModel(projectList);
        dashboardModel.addEventListener("projectsFiltered", onDashboardFiltered);
    }

    function onDashboardFiltered(event) {
        dashboardView.getFilteredList(event.data);
    }

    function onReleasedProjectsButtonClicked(event) {
        dashboardModel.applyFilter(event.data);
        dashboardView.createContentForEntries(event.data);
        dashboardElController.init();
    }

    function onNotReleasedProjectsButtonClicked(event) {
        dashboardModel.applyFilter(event.data);
        dashboardView.createContentForEntries(event.data);
        dashboardElController.init();
    }

    function onReviewedProjectsButtonClicked(event) {
        dashboardModel.applyFilter(event.data);
        dashboardView.createContentForEntries(event.data);
        dashboardElController.init();
    }

    function onNotReviewedProjectsButtonClicked(event) {
        dashboardModel.applyFilter(event.data);
        dashboardView.createContentForEntries(event.data);
        dashboardElController.init();
    }

    function onProjectButtonClicked() {
        window.location.href = "create-review.html";
    }

    function initFirebase() {
        database = new MyReviewApp.Firebase();
        database.initDatabase();
        database.loadAllData();
        database.addEventListener("onDataAvailable", onDataAvailable);
        onDataAvailable();
    }

    function onDataAvailable(data){
        if (data !== undefined) {
            projectList = data.data;
        }
        initDashboardModel();
        dashboardModel.applyFilter("not released");
        dashboardView.createContentForEntries("not released");
        dashboardElController.init();
    }

    that.init = init;
    return that;
}());