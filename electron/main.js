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


ipcMain.on(channels.Extract_Data, (event, arg) => {
  const { fileData } = arg;
  let pyExtract = new PythonShell("./extract_data.py");
  pyExtract.send(fileData);
  pyExtract.on("message", function (message) {
    mainWindow.webContents.send(channels.Extract_Data_IsDone, message);
  });

  pyExtract.end(function (err) {
    if (err) {
      throw err;
    }
    console.log("finished");
  });
});

ipcMain.on(channels.Compare_Data, (event, arg) => {
  const { new_version_data } = arg;
  let pyCompare = new PythonShell("./compare_data.py");
  pyCompare.send(new_version_data);
  pyCompare.on("message", function (message) {
    mainWindow.webContents.send(channels.Compare_Data_IsDone, message);
  });

  pyCompare.end(function (err) {
    if (err) {
      throw err;
    }
    console.log("finished");
  });
});
ipcMain.on(channels.Covert_Data_to_svg, (event, arg) => {
  const { dxf_file } = arg;
  let pyCompare = new PythonShell("./convert_svg.py");
  pyCompare.send(dxf_file);
  pyCompare.on("message", function (message) {
    mainWindow.webContents.send(channels.Covert_Data_to_svg_IsDone, message);
  });

  pyCompare.end(function (err) {
    if (err) {
      throw err;
    }
    console.log("finished");
  });
});
ipcMain.on(channels.Get_Details, (event, arg) => {
  const { file_dxf } = arg;
  console.log(file_dxf);
  let pyDetails = new PythonShell("./get_details.py");
  pyDetails.send(file_dxf);
  pyDetails.on("message", function (message) {
    mainWindow.webContents.send(channels.Get_Details_IsDone, message);
  });

  pyDetails.end(function (err) {
    if (err) {
      throw err;
    }
    console.log("finished");
  });
});
