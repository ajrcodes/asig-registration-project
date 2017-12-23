const remote = require('electron').remote; 

function setRoundEventTo(round, event) {
    remote.getGlobal('sharedObject').selectedCheckinRound = round;
    remote.getGlobal('sharedObject').selectedCheckinEvent = event;
}

