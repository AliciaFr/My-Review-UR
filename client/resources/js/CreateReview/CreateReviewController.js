/* global CreateReview */
/* global EventPublisher */

/** CreateReviewController: Controlls all ui elements for the "Create a review"-Page */

const cancelButtonDescription = document.querySelector("#createReviewDescriptionCancel"),
    continueButtonDescription = document.querySelector("#createReviewDescriptionContinue"),
    descriptionTab = document.querySelector("#createReviewDescriptionTab"),
    codeEditorTab = document.querySelector("#createReviewCodeTab");

var CreateReview = CreateReview || {};
CreateReview.CreateReviewController = function () {
    "use strict";

    let that = new EventPublisher();

    /* Callback -> Cancel the Code Review Process */
    function onCancelButtonDescriptionClicked() {
        that.notifyAll("onCancelDescription");
    }

    /* Callback -> Continue to Code Editor */
    function onContinueButtonDescriptionClicked() {
        that.notifyAll("onContinueDescription", codeEditorTab);
    }

    /* Callback -> change to Description Tab */
    function onDescriptionTabClicked() {
        that.notifyAll("onDescriptionTab", descriptionTab);
    }

    /* Callback -> change to Code Editor Tab */
    function onCodeEditorClicked() {
        that.notifyAll("onCodeEditorTab", codeEditorTab);
    }

    function init() {
        cancelButtonDescription.addEventListener("click", onCancelButtonDescriptionClicked);    
        continueButtonDescription.addEventListener("click", onContinueButtonDescriptionClicked);
        descriptionTab.addEventListener("click", onDescriptionTabClicked);
        codeEditorTab.addEventListener("click", onCodeEditorClicked);
    }

    init();
    return that;
};