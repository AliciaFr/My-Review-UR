/** MyReviewApp: Communication between the modules */

var MyReviewApp = MyReviewApp || (function(){
    "use strict";

    let that = {},
        dashboardView,
        dashboardController,
        dashboardModel,
        database,
        projectList = [
            {
                "id": 1,
                "name": "MME-UE-01",
                "status": "freigegeben"
            },
            {
                "id": 2,
                "name": "MME-UE-02",
                "status": "freigegeben"
            },
            {
                "id": 3,
                "name": "MME-UE-03",
                "status": "freigegeben"
            },
            {
                "id": 4,
                "name": "MME-UE-04",
                "status": "noch nicht freigegeben"
            },
            {
                "id": 5,
                "name": "MME-UE-05",
                "status": "noch nicht freigegeben"
            },
            {
                "id": 6,
                "name": "MME-UE-01",
                "status": "reviewed"
            },
            {
                "id": 7,
                "name": "MME-UE-02",
                "status": "noch nicht reviewed"
            },
            {
                "id": 8,
                "name": "MME-UE-03",
                "status": "noch nicht reviewed"
            }
        ],
        list,
        dashboardEl = document.querySelector("#dashboard"),
        dashboardItemTemplate = document.querySelector("#dashboard-entry");

    function init() {
        initController();
        initUI();
        initFirebase();
    }

    function initController() {
        initDashboardController();
    }

    function initDashboardController() {
        dashboardController = new MyReviewApp.DashboardController();
        dashboardController.addEventListener("onReleasedProjectsClicked", onReleasedProjectsButtonClicked);
        dashboardController.addEventListener("onNotReleasedProjectsClicked", onNotReleasedProjectsButtonClicked);
        dashboardController.addEventListener("onReviewedProjectsClicked", onReviewedProjectsButtonClicked);
        dashboardController.addEventListener("onNotReviewedProjectsClicked", onNotReviewedProjectsButtonClicked);
    }
 
    function initUI() {
        dashboardView = new MyReviewApp.DashboardView(dashboardEl, dashboardItemTemplate);
    }

    function initDashboardModel() {
        dashboardModel = new MyReviewApp.DashboardModel(projectList);
        dashboardModel.addEventListener("projectsFiltered", onDashboardFiltered);
    }

    function onDashboardFiltered(event) {
        console.log(event.data);
        dashboardView.getFilteredList(event.data);
    }


    function onReleasedProjectsButtonClicked() {
        dashboardModel.filterByReleasedProjects();
        console.log("Freigegebene Projekte");
        dashboardView.hideFilteredEntries(projectList);
    }

    function onNotReleasedProjectsButtonClicked() {
        dashboardModel.filterByNotReleasedProjects();
        console.log("Nicht freigegebene Projekte");
        console.log(projectList);
        dashboardView.hideFilteredEntries(projectList);

    }

    function onReviewedProjectsButtonClicked() {
        dashboardModel.filterByReviewedProjects();
        console.log("Reviewte Projekte");
        console.log(projectList);
        dashboardView.hideFilteredEntries(projectList);
    }

    function onNotReviewedProjectsButtonClicked() {
        dashboardModel.filterByNotReviewedProjects();
        console.log("Nicht reviewte Projekte");
        console.log(projectList);
        dashboardView.hideFilteredEntries(projectList);
    }

    function initFirebase() {
        /*database = new MyReviewApp.Firebase();
        database.initDatabase();
        database.loadAllData();
        database.addEventListener("onDataAvailable", onDataAvailable); */
        onDataAvailable();
    }

    function onDataAvailable(data){
        /*let projectistArray = data.data;
        projectList = projectistArray;
        list = data;*/
        console.log(projectList);
        dashboardView.showAllEntries(projectList);        
        // dashboardController.init();
        
        initDashboardModel();
    }

    that.init = init;
    return that;
}());