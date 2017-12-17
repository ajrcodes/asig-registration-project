// Modules
var fs = require('fs');
var path = require('path');


// CAMERA FUNCTIONS

// Check that there's an email input before taking picture
// (We store images on capture under the user's email--not optimal, but it works)
function checkEmail() {
    if(document.getElementById("email").value == "") {
        return false;
    } else {
        take_snapshot();
    }
};

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

function take_snapshot() {
    WebCamera.snap( function(data_uri) {
        // display snapshot
        document.getElementById('my_result').innerHTML = '<img id="screenshot" src="'+data_uri+'"/>';
        // upload image
        var data = data_uri;
        var imageBuffer = decodeBase64Image(data);

        var email = document.getElementById("email").value;
        var fileLocation = path.join('data/rushee-images/', email + '.jpeg');
        
        fs.writeFile(fileLocation, imageBuffer.data, function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 
    });
};


// FORM HANDLING

function submitForm(event) {
    event.preventDefault();

    // Store data as rushee JSON 
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let year = $('input[name=radio]:checked').val();
    let address = document.getElementById("address").value;
    let telephone = document.getElementById("telephone").value;
    let email = document.getElementById("email").value;
    
    let rusheeJSON = {
        'firstname': firstname,
        'lastname': lastname,
        'year': year,
        'address': address,
        'telephone': telephone,
        'email': email
    };

    // Backup on machine
    var fileLocation = path.join('data/rushee-profiles/', rusheeJSON.email + '.json');
    var data = JSON.stringify(rusheeJSON);
    fs.writeFile(fileLocation, data, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 

}