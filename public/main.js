// Modules to control application life and create native browser window
const { app, BrowserWindow, BrowserView, screen, ipcMain, session, Menu, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const isDev = require("electron-is-dev");
const { launchGstApp, handleGstVerify, handleGstPuppeteer, handleGstPortalFromList } = require('../helper/functions');
const { autoUpdater } = require("electron-updater");
const iconPath = isDev ? __dirname + "./assets/images/gst_utility_logo.png" : path.join(__dirname, "build", "gst_utility_logo.png");

let mainWindow = '';
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().bounds;

  mainWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().bounds.width,
    height: screen.getPrimaryDisplay().bounds.height,
    icon: iconPath,
    minWidth: width,
    minHeight: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: isDev ? true : false,
      // frame: false ,//Remove frame to hide default menu
      webviewTag: true
    }
  })

  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  ipcMain.handle('launchapp', async (e, redirectOn) => {
    await launchGstApp(redirectOn, BrowserView, mainWindow, screen)
  })

  ipcMain.handle('gstVerifyUser', async (e, userData) => {
    const image_url = await handleGstVerify(userData, BrowserView, mainWindow)
    return image_url
  })

  ipcMain.handle('openPortalFromListPage', async (e, userData) => {
    const image_url = await handleGstPortalFromList(userData, BrowserView, mainWindow, screen)
    return image_url
  })
  ipcMain.handle('portalLoginForFile', async (e, userData) => {
    const image_url = await handleGstPuppeteer(userData, BrowserView, mainWindow, screen)
    return image_url
  })
}

const navigationMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New File',
        accelerator: 'CommandOrControl+N',
        click() {
        }
      },
      {
        label: 'Open File',
        accelerator: 'CommandOrControl+O',
        click(item, focusedWindow) {
        },
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Mail: support@themunim.com',
        click() {
        },
      },
      {
        label: 'Call: 9898665536',
        click() {
        },
      },
      {
        label: 'About',
        click() {
        },
      },
    ],
  },
  {
    label: 'About',
    submenu: [
      {
        label: 'Reload APP',
        click() {
          mainWindow.reload();
        },
      },
      {
        label: 'Clear Cache',
        click() {
          clearCache();
        },
      },
    ],
  },
  {
    label: 'Update',
    click() {
      autoUpdater.checkForUpdates();
    }
  },
  {
    label: `v${app.getVersion()}`,
  }
];

setInterval(() => {
  autoUpdater.checkForUpdates();
}, 600000)

const clearCache = () => {
  const ses = session.defaultSession;
  ses.clearCache(() => {
  });
};

app.whenReady().then(() => {
  createWindow()
  const menu = Menu.buildFromTemplate(navigationMenu)
  Menu.setApplicationMenu(menu)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version is being downloaded.'
  }
  dialog.showMessageBox(dialogOpts, (response) => {
  });
})

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  };
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
});

// autoUpdater.on('update-not-available', (_event, releaseNotes, releaseName) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Ok'],
//     title: 'Application Update',
//     message: process.platform === 'win32' ? releaseNotes : releaseName,
//     detail: 'Update not available.'
//   }
//   dialog.showMessageBox(dialogOpts, (response) => {
//   });
// });

// autoUpdater.on('download-progress', (progressObj) => {
//   const percent = Math.floor(progressObj.percent);
//     dialog.showMessageBox({
//     type: 'info',
//     message: `Download Progress: ${percent}%`,
//     detail: 'Downloading update...',
//     buttons: [],
//   });
// });

app.on('open-url', (event, url) => {
  console.log('Received URL:', url);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.setAsDefaultProtocolClient('munim');
const store = new Store()
store.set('userSettings.theme', 'dark')
console.log('store: ', store.get('userSettings.theme'))