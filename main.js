// Chaiwala Tycoon — desktop shell (Electron).
// All game code lives in www/index.html. This file only opens a window around it,
// so the same www/ folder can later be wrapped for Android/iPhone (Capacitor).
const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,           // the layout is responsive: one column on phones, two columns on wide windows
    height: 860,
    minWidth: 360,
    minHeight: 560,
    backgroundColor: "#fff4de",
    title: "Chaiwala Tycoon",
    icon: path.join(__dirname, "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,   // the game is plain web code and needs no Node access
      sandbox: true,
    },
  });
  win.loadFile(path.join(__dirname, "www", "index.html"));
  // F11 toggles full screen (the menu bar is hidden, so give it a key); maximise/fullscreen buttons work as usual
  win.webContents.on("before-input-event", (e, input) => {
    if (input.type === "keyDown" && input.key === "F11") { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });

  // never navigate away from the game; open any external link in the real browser
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", e => e.preventDefault());
}

Menu.setApplicationMenu(null);
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
