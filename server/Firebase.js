/* global firebase */
/* global EventPublisher*/

/**
* Firebase: establishing connetion to the database
*/
var CookingAssistant = CookingAssistant || {};
CookingAssistant.Firebase = function () {
  "use strict";

    var that = new EventPublisher(),
        ref,
        config = {
            apiKey: "AIzaSyA6imO5xdyJam5OhrbFfg3J5--ncU9y3Ac",
            authDomain: "my-review-ur.firebaseapp.com",
            databaseURL: "https://my-review-ur.firebaseio.com",
            projectId: "my-review-ur",
            storageBucket: "my-review-ur.appspot.com",
            messagingSenderId: "931678872403",
        };

    function initDatabase(){
        firebase.initializeApp(config);
        ref = firebase.database().ref();
        }
    /* get all data from database and notify a listener when all data is loaded*/
    function loadAllData(){
        ref.on("value", function(snapshot) {
        that.notifyAll("onDataAvailable", snapshot.val());
        }, function (error) {
        console.log("Error: " + error.code);
        });
    }

  that.initDatabase = initDatabase;
  that.loadAllData = loadAllData;
  return that;
};
