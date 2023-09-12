const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");
const { PythonShell } = require("python-shell");
const { channels } = require("../frontend/src/shared/constants");

const isMac = process.platform === "darwin";

process.env.NODE_ENV = "dev";

const isDev = process.env.NODE_ENV !== "production";

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    title: "ProjectHub",
    width: width,
    height: height,
    webPreferences: {
      contextIsolation: true,
      nodeIntegrationL: true,
      sandbox: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadURL("http://localhost:3000/");
}

app.whenReady().then(() => {
  createMainWindow();

  mainWindow.on("closed", () => (mainWindow = null));

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

let pyshell = new PythonShell("./main.py");

pyshell.on("message", function (message) {
  console.log(message);
});

pyshell.end(function (err) {
  if (err) {
    throw err;
  }
  console.log("finished");
});

ipcMain.on(channels.GET_DATA, (event, arg) => {
  const { product } = arg;
  console.log(product);
});
