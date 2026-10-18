const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

const APP_NAME = "محاسب";

let backend;

function startBackend() {

    const backendExe = app.isPackaged
        ? path.join(
            process.resourcesPath,
            "backend",
            "StoreManagementBackend.exe"
        )
        : path.join(
            __dirname,
            "../backend/StoreManagementBackend.exe"
        );

    console.log("Backend Path:", backendExe);
    console.log("Exists:", fs.existsSync(backendExe));

    backend = spawn(
        backendExe,
        [],
        {
            windowsHide: true,
            cwd: path.dirname(backendExe)
        }
    );

    backend.stdout.on("data", data => {
        console.log("[BACKEND]", data.toString());
    });

    backend.stderr.on("data", data => {
        console.error("[BACKEND ERROR]", data.toString());
    });

    backend.on("error", err => {
        console.error("Backend start error:", err);
    });

    backend.on("exit", code => {
        console.log("Backend exited:", code);
    });
}

function createWindow() {

    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        title: APP_NAME,
        icon: path.join(__dirname, "../build/icon.ico"),
    });

    if (app.isPackaged) {

        const indexPath = path.join(
            process.resourcesPath,
            "app.asar",
            "dist",
            "index.html"
        );

        console.log("Loading:", indexPath);

        win.loadFile(indexPath);

    } else {

        win.loadURL(
            "http://localhost:5173"
        );
    }
}

app.whenReady().then(() => {

    startBackend();

    createWindow();

});

app.on("window-all-closed", () => {

    if (backend) {
        backend.kill();
    }

    if (process.platform !== "darwin") {
        app.quit();
    }
});