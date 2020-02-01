const electron = require("electron");
const ipMain = electron.ipMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

let mainWindow;
let settingsWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    nodeIntegration: true,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  settingsWindow = new BrowserWindow({
    width: 600,
    height: 600,
    parent: mainWindow,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  settingsWindow.loadURL(
    isDev
      ? "http://localhost:3000/settings"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("closed", () => (mainWindow = null));

  settingsWindow.on("close", (e) => {
    e.preventDefault();
    settingsWindow.hide();
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipMain.on("toggle-settings", (event, arg) => {
  settingsWindow.show();
});
