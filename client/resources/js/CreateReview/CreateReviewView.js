/* global CreateReview */
/* global CodeMirror */
/* global $ */

const descriptionTabButton = document.querySelector("#createReviewDescriptionTab"),
    descriptionBox = document.querySelector(".createReviewDescriptionBox"),
    codeEditorTabButton = document.querySelector("#createReviewCodeTab"),
    codeEditorBox = document.querySelector(".createReviewCodeBox"),
    codeEditorElement = document.querySelector("#createReviewEditor");

var CreateReview = CreateReview || {};
CreateReview.CreateReviewView = function () {
    "use strict";

    let that = {},
        myCodeMirror;

    function changeToCodeEditor(element) {
        element.classList.add("active");
        descriptionTabButton.classList.remove("active");
        descriptionBox.style.display="none";
        codeEditorBox.style.display="";
        
    }

    function changeToDescription(element) {
        element.classList.add("active");
        codeEditorTabButton.classList.remove("active");
        codeEditorBox.style.display="none";
        descriptionBox.style.display="";
    }

    function initCodeEditor() {
        myCodeMirror = CodeMirror(codeEditorElement, {
            value: "function myScript(){return 100;}\n",  mode:  "javascript",
            lineNumbers: true
        });
    }

    function init() {
        $('.createReviewCodeBox .ui.sidebar')
            .sidebar({
                context: $('.createReviewCodeBox .bottom.segment')
            })
            .sidebar('attach events', '.createReviewCodeBox .menu .item')
        ;
        initCodeEditor();
    }

    init();

    that.changeToCodeEditor = changeToCodeEditor;
    that.changeToDescription = changeToDescription;
    return that;
};