// Modules
var fs = require('fs');
var path = require('path');

// Page details
const remote = require('electron').remote; 
var email = remote.getGlobal('sharedObject').selectedRusheeEmail;

// Event Attendance
var defaultNo = '<span class="glyphicon glyphicon-remove" style="color:#FF0000;"></span>';
var defaultYes = '<span class="glyphicon glyphicon-ok" style="color:#00FF00;"></span>';

var eventAttendance = {
    round1event1: defaultNo,
    round1event2: defaultNo,
    round1event3: defaultNo,
    round2event1: defaultNo,
    round2event2: defaultNo,
    round2event3: defaultNo,
    round3event1: defaultNo,
    round3event2: defaultNo,
};

var roundAttendance = {
    round1: defaultNo,
    round2: defaultNo,
    round3: defaultNo
};

// Round Attendance
var data = getRusheeProfile(email, function(data){
    profilePageSetup(data);
});

// returns rushee profile information
// param1: rushee email
// param2: callback function to handle rushee JSON object 
function getRusheeProfile(email, onDoneLoading) {
    var absoluteURL = 'data/rushee-profiles/' + email + '.json';
    fs.readFile(absoluteURL, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        console.log(data);
        onDoneLoading(JSON.parse(data));
    });
}

function getRusheeEventAttendance(email, rusheeEventRecord) {
    // first round
    fs.readdir('data/event-attendance/round1', function(err, filenames) {
        if (err) {
            console.log(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(path.resolve('data/event-attendance/round1', filename), 'utf-8', function(err, content) {
                if (err) {
                    console.log(err);
                    return;
                }
                // Add to list if they were registered
                var attendanceJSON = JSON.parse(content);
                var roundEventID = attendanceJSON.info;

                if (attendanceJSON.rushees.indexOf(email) > -1) {
                    rusheeEventRecord[roundEventID] = defaultYes;
                } else {
                    rusheeEventRecord[roundEventID] = defaultNo;
                }
            });
        });
    });

    // Second round
    fs.readdir('data/event-attendance/round2', function(err, filenames) {
        if (err) {
            console.log(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(path.resolve('data/event-attendance/round2', filename), 'utf-8', function(err, content) {
                if (err) {
                    console.log(err);
                    return;
                }
                // Add to list if they were registered
                var attendanceJSON = JSON.parse(content);
                var roundEventID = attendanceJSON.info;

                if (attendanceJSON.rushees.indexOf(email) > -1) {
                    rusheeEventRecord[roundEventID] = defaultYes;
                } else {
                    rusheeEventRecord[roundEventID] = defaultNo;
                }
            });
        });
    });

    // Third round
    fs.readdir('data/event-attendance/round3', function(err, filenames) {
        if (err) {
            console.log(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(path.resolve('data/event-attendance/round3', filename), 'utf-8', function(err, content) {
                if (err) {
                    console.log(err);
                    return;
                }
                // Add to list if they were registered
                var attendanceJSON = JSON.parse(content);
                var roundEventID = attendanceJSON.info;

                if (attendanceJSON.rushees.indexOf(email) > -1) {
                    rusheeEventRecord[roundEventID] = defaultYes;
                } else {
                    rusheeEventRecord[roundEventID] = defaultNo;
                }
            });
        });
    });

    return rusheeEventRecord;
}

function getRusheeRoundInvites() {
     fs.readdir('data/round-invites', function(err, filenames) {
        if (err) {
            console.log(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(path.resolve('data/round-invites', filename), 'utf-8', function(err, content) {
                if (err) {
                    console.log(err);
                    return;
                }
                // Add to list if they were registered
                var roundInvitesJSON = JSON.parse(content);
                var roundID = roundInvitesJSON.info;

                if (roundInvitesJSON.rushees.indexOf(email) > -1) {
                    roundAttendance[roundID] = defaultYes;
                } else {
                    roundAttendance[roundID] = defaultNo;
                }
            });
        });
    });
}

function getRoundJSON(roundNum, onDoneLoading) {
    var absoluteURL = 'data/round-invites/round' + roundNum + '.json';
    fs.readFile(absoluteURL, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        onDoneLoading(JSON.parse(data));
    });
}

function addRusheeRoundInvite(roundNum) {
    getRoundJSON(roundNum, function(roundJSON) {
        var absoluteURL = 'data/round-invites/round' + roundNum + '.json';

        if (roundJSON.rushees.indexOf(email) === -1) {
            roundJSON.rushees.push(email);
        }
        var roundData = JSON.stringify(roundJSON);

        fs.writeFile(absoluteURL, roundData, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 

        // God I'm so lazy
        if(roundNum == 1) {
            document.getElementById('rusheeFirstRound').innerHTML = defaultYes;
        }
        if(roundNum == 2) {
            document.getElementById('rusheeSecondRound').innerHTML = defaultYes;
        }
        if(roundNum == 3) {
            document.getElementById('rusheeThirdRound').innerHTML = defaultYes;
        }
        
    });
}

function removeRusheeRoundInvite(roundNum) {
    getRoundJSON(roundNum, function(roundJSON) {
        var absoluteURL = 'data/round-invites/round' + roundNum + '.json';

        // remove all occurances of email 
        roundJSON.rushees = roundJSON.rushees.filter(e => e !== email);
        var roundData = JSON.stringify(roundJSON);

        fs.writeFile(absoluteURL, roundData, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 

        // God I'm so lazy
        if(roundNum == 1) {
            document.getElementById('rusheeFirstRound').innerHTML = defaultNo;
        }
        if(roundNum == 2) {
            document.getElementById('rusheeSecondRound').innerHTML = defaultNo;
        }
        if(roundNum == 3) {
            document.getElementById('rusheeThirdRound').innerHTML = defaultNo;
        }
        
    });
}

function profilePageSetup(rusheeJSON) {
    // information
    document.getElementById('firstName').innerHTML = rusheeJSON.firstname;
    document.getElementById('lastName').innerHTML = rusheeJSON.lastname;
    document.getElementById('year').innerHTML = rusheeJSON.year;
    document.getElementById('address').innerHTML = rusheeJSON.address;
    document.getElementById('phoneNum').innerHTML = rusheeJSON.telephone;
    document.getElementById('uvaid').innerHTML = rusheeJSON.email;
    // image
    document.getElementById('rusheePic').src = '../data/rushee-images/' + rusheeJSON.email + '.jpeg';
}

// Back button script 
function back() {
    window.history.back();
}
