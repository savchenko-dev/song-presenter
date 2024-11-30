const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let displayWindow;

function createWindows() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false, // for security
    },
  });

  displayWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load html files
  mainWindow.loadFile("index.html");
  displayWindow.loadFile("display.html");

  // Optional: Open the DevTools.
  // mainWindow.webContents.openDevTools();
  // displayWindow.webContents.openDevTools();

  // Handle window close
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  displayWindow.on("closed", function () {
    displayWindow = null;
  });
}

ipcMain.on("text-entered", (event, text) => {
  if (displayWindow) {
    displayWindow.webContents.send("display-text", text);
  }
});

ipcMain.on("send-colors", (event, colors) => {
  if (displayWindow) {
    displayWindow.webContents.send("update-colors", colors);
  }
});

ipcMain.on("send-image", (event, imageData) => {
  if (displayWindow) {
    displayWindow.webContents.send("update-image", imageData);
  }
});

app.whenReady().then(createWindows);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindows();
});
