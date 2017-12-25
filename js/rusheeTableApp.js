/**
 *  Table backend
 * 
 *  Uses a jquery plugin DataTables, sets up the dataset
 */

// Modules
var fs = require('fs');
var path = require('path');

/**
 *  returns array of rushee table objects
 *  @param1: name of directory containing rushee JSON objects
 *  @param2: callback function to handle rushee JSON object 
 */
function readFiles(dirname, onFileContent) {
    var dataset = new Array();

    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            console.log(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(path.resolve(dirname, filename), 'utf-8', function(err, content) {
                if (err) {
                    console.log(err);
                    return;
                }
                var rusheeTableObject = onFileContent(JSON.parse(content));
                dataset.push(rusheeTableObject);
            });
        });
    });

    return dataset;
}

/**
 *  returns array of rushee table objects from locally stored 
 */
function loadRushees() {
    return readFiles(path.resolve(__dirname, '../data/rushee-profiles'), formatRushee);
}

/**
 *  returns individual rushee table object
 *  @param1: file name (email)
 *  @param2: rushee JSON
 */
function formatRushee(rusheeJSON) {
    var rusheeTableObject = new Array(
        rusheeJSON.rusheeProfile.firstname,
        rusheeJSON.rusheeProfile.lastname,
        rusheeJSON.rusheeProfile.year,
        rusheeJSON.rusheeProfile.address,
        rusheeJSON.rusheeProfile.email
    );

    return rusheeTableObject;
}