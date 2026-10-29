const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: 420, height: 620, x: width - 440, y: height - 640,
    transparent: true, frame: false, alwaysOnTop: true, resizable: false,
    hasShadow: false, skipTaskbar: true, webPreferences: { contextIsolation: true }
  });
  win.loadFile(path.join(__dirname, '..', 'pet.html'), { query: { pet: '1' } });
});
app.on('window-all-closed', () => app.quit());
