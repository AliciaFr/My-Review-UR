/** The page is opened when clicking on the Dashboard on one of the cards with the button "Review Code" */

var CreateReview = CreateReview || (function () {
    "use strict";

    let that = {},
        createReviewController,
        createReviewView;

    function init() {
        initController();
        initUI();
    }

    function initController() {
        createReviewController = new CreateReview.CreateReviewController();
        createReviewController.addEventListener("onCancelDescription", onCancelDescription);
        createReviewController.addEventListener("onContinueDescription", onContinueDescription);
        createReviewController.addEventListener("onDescriptionTab", onDescriptionTab);
        createReviewController.addEventListener("onCodeEditorTab", onCodeEditorTab);
    }

    function initUI() {
        createReviewView = new CreateReview.CreateReviewView();
    }

    function onCancelDescription() {
        // --> DialogBox: Fragen, ob man wirklich das Review beenden möchte
    }

    function onContinueDescription(event) {
        createReviewView.changeToCodeEditor(event.data);
    }

    function onDescriptionTab(event) {
        createReviewView.changeToDescription(event.data);
    }

    function onCodeEditorTab(event) {
        createReviewView.changeToCodeEditor(event.data);
    }

    that.init = init;
    return that;
}());