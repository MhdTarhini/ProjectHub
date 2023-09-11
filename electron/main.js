const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

const isMac = process.platform === "darwin";

process.env.NODE_ENV = "dev";

const isDev = process.env.NODE_ENV !== "production";

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    title: "ProjectHub",
    width: width,
    height: height,
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
