const { app, BrowserWindow, ipcMain, ipcRenderer, Menu } = require('electron');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;
let imageWindow;
let settingsWindow;

const prodUrl = url.format({
  pathname: path.join(__dirname, '../build/index.html'),
  protocol: 'file',
  slashes: true,
});

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680, webPreferences: {webSecurity: false}});
  imageWindow = new BrowserWindow({width: 600, height: 600, parent: mainWindow, show: false});
  settingsWindow = new BrowserWindow({width: 600, height: 600, parent: mainWindow, show: false});

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : prodUrl);
  imageWindow.loadURL(isDev ? 'http://localhost:3000/image' : prodUrl);
  settingsWindow.loadURL(isDev ? 'http://localhost:3000/settings' : prodUrl);

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => mainWindow = null);

  imageWindow.on('close', e => {
    e.preventDefault();
    imageWindow.hide();
  });
  settingsWindow.on('close', e => {
    e.preventDefault();
    settingsWindow.hide();
  });
}

app.on('ready', () => {
  createWindow();
  generateMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('toggle-image', (event, arg) => {
  imageWindow.show();
  imageWindow.webContents.send('image', arg);
});

ipcMain.on('toggle-settings', () => {
  settingsWindow.isVisible() ? settingsWindow.hide() : settingsWindow.show();
});

function generateMenu() {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        {
          label: 'Settings',
          accelerator: "CmdOrCtrl+,",
          click: () => mainWindow.webContents.send('toggle-settings'),
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    );

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}