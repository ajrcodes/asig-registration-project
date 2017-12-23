var fs = require('fs');
// global variables set from checkin-portal
const remote = require('electron').remote; 
let round = remote.getGlobal('sharedObject').selectedCheckinRound;
let event = remote.getGlobal('sharedObject').selectedCheckinEvent;
let absoluteURL = 'data/event-attendance/round' + round + '/round' + round + '-event' + event + '-attendance.json';

function setupPage() {
    // dictionary for title
    var numToString = {
        "1": "First",
        "2": "Second",
        "3": "Third"
    }

    // update HTML elements
    document.getElementById('round').innerHTML = numToString[round] + " Round";
    document.getElementById('event').innerHTML = "- Event " + event;
}

function buttonClicked() {
    var email = document.getElementById('email').value;
    console.log("clicked here " + email);
    rusheeCheckin(email);
}

function rusheeCheckin(email) {
    getEventJSON(email, function(attendanceJSON){
        attendanceJSON.rushees.push(email);
        var attendanceString = JSON.stringify(attendanceJSON);  //reserialize to JSON
        fs.writeFile(absoluteURL, attendanceString, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    });
}

function getEventJSON(email, onDoneLoading) {
    fs.readFile(absoluteURL, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        onDoneLoading(JSON.parse(data));
    });
}
