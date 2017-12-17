// Modules
const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;

// Listen for app to be ready
app.on('ready', function() {
    // Create new window
    mainWindow = new BrowserWindow({});
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/rushee-tables.html'),
        protocol:'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });
});
