const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");
const { PythonShell } = require("python-shell");
const { channels } = require("../frontend/src/shared/constants");
const fs = require("fs");

let mainWindow;

const isMac = process.platform === "darwin";

process.env.NODE_ENV = "dev";

const isDev = process.env.NODE_ENV !== "production";

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    title: "ProjectHub",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#0F8EEA",
      symbolColor: "#FAFAFA",
    },
    width: width,
    height: height,
    icon: path.join(__dirname, "./logos/logo.ico"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegrationL: true,
      sandbox: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setMenu(null);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadURL("http://localhost:3000");
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

ipcMain.on("reload-window", () => {
  console.log("reload");
  mainWindow.reload();
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
  const { new_version_data, old_version_path } = arg;
  const tempFilePath = path.join(__dirname, "data", "tempfile.dxf");
  // const tempFilePath = "tempfile.dxf";
  fs.writeFileSync(tempFilePath, new_version_data);
  let pyCompare = new PythonShell("./compare_data.py", {
    args: [tempFilePath, old_version_path],
  });
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
ipcMain.on(channels.Compare_Main_Data, (event, arg) => {
  console.log("here");
  const { main_file_path, local_file_path } = arg;
  console.log(main_file_path);
  console.log(local_file_path);
  let pyCompareMain = new PythonShell("./compare_main.py", {
    args: [local_file_path, main_file_path],
  });
  pyCompareMain.on("message", function (message) {
    mainWindow.webContents.send(channels.Compare_Main_Data_IsDone, message);
  });

  pyCompareMain.end(function (err) {
    if (err) {
      throw err;
    }
    console.log("finished here");
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
