$(document).ready(function(){
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAEAjixzc4dTJV_TK6zWZdfhjWvvZGwrc8",
    authDomain: "train-time-62e45.firebaseapp.com",
    databaseURL: "https://train-time-62e45.firebaseio.com",
    projectId: "train-time-62e45",
    storageBucket: "",
    messagingSenderId: "337388906913"
  };
  firebase.initializeApp(config);

  var dataRef = firebase.database();

  //Click events to obtain user's input
  $("#train-added").on("click", function(event) {
      event.preventDefault();

    
      //Obtaining users' input
      var trainName = $("#train-name").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrainTime = $("#first-train-time").val().trim();
      var frequency = $("#frequency").val().trim();

      console.log(trainName);
      console.log(destination);
      console.log(firstTrainTime);
      console.log(frequency);

      //Pushing users' input into Firebase
      dataRef.ref().push({
          trainName: trainName,
          destination: destination,
          firstTrainTime: firstTrainTime,
          frequency: frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      //Clear the input on the form after pushing data to firebase
      $("#train-name").val("");
      $("#destination").val("");
      $("#first-train-time").val("");
      $("#frequency").val("");

  });
  //Creating Firebase event for adding trains to the database and a row in the html
  dataRef.ref().on("child_added", function(childSnapshot) {

      var firstTime = childSnapshot.val().firstTrainTime;
      var frequency = parseInt(childSnapshot.val().frequency);
      var firstTrain = moment(firstTime, "HH.mm");
      var currentTime = moment();
      var diffTime = moment(currentTime).diff(moment(firstTrain), "minutes");
      var remainder = diffTime%frequency;
      var minutesAway = frequency - remainder;
      var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm A");
      var firstTrainToNow = moment(firstTrain).diff(currentTime, "minutes");
      var minutesToFirstTrain = Math.ceil(moment.duration(firstTrainToNow).asMinutes());

      //log these above variables      
      console.log(firstTime);
      console.log(frequency);
      console.log(firstTrain);
      console.log(currentTime);
      console.log(diffTime);
      console.log(remainder);
      console.log(minutesAway);
      console.log(nextTrain);
      console.log(firstTrainToNow);
      console.log(minutesToFirstTrain);

      //
      if ((currentTime - firstTrain) < 0) {
        nextTrain = childSnapshot.val().firstTime;
        console.log("Before First Train");
        minutesAway = minutesToFirstTrain;
      }
      else {
        nextTrain = moment().add(minutesAway, "minutes").format("hh:mm A");
        minutesAway = frequency - remainder;
        console.log("Working");
        console.log(nextTrain);
      };

            //Creating new HTML rows
            var newRow = $("<tr>");
            var trainNameCell = $("<td>").text(childSnapshot.val().trainName);
            var destinationCell = $("<td>").text(childSnapshot.val().destination)
            var frequencyCell = $("<td>").text(childSnapshot.val().frequency);
            var arrivalCell = $("<td>").text(nextTrain);
            var minuteCell = $("<td>").text(minutesAway);
      
            //Appending Cells into row
            newRow.append(trainNameCell);
            newRow.append(destinationCell);
            newRow.append(frequencyCell);
            newRow.append(arrivalCell);
            newRow.append(minuteCell);
            console.log(newRow);
      
            
            $(".table-body").append(newRow);

            //Creating a remove button
            var removeButton = $("<button>").html("<span>Remove</span>").addClass("removeButton").attr("data-index", index).attr("data-key", childSnapshot.key);

      
  }), function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  };
});

