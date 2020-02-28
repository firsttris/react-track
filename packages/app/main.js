'use strict';

// Import parts of electron to use
const { app, BrowserWindow } = require('electron'),
  path = require('path'),
  url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;
if (process.argv.indexOf('--dev') > 0) {
  dev = true;
}

function onReady() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false
  });

  // and load the index.html of the app.
  let indexPath;
  if (dev) {
    console.log('Development Mode');
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8081',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    console.log('Production');
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist-electron', 'index.html'),
      slashes: true
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if (dev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
        REDUX_DEVTOOLS
      } = require('electron-devtools-installer');
      [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
        installExtension(extension)
          .then(name => console.log(`Added Extension: ${name}`))
          .catch(err => console.log('An error occurred: ', err));
      });
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('close', () => app.quit());
}

app.on('ready', () => onReady());
app.on('window-all-closed', () => app.quit());
console.log(`Electron Version ${app.getVersion()}`);
