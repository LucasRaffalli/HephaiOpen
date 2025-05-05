import { app, BrowserWindow, ipcMain, nativeImage } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'
import { registerWindowIPC } from '../win/ipcEvents'
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))


// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}
let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')
console.log('Loading file:', indexHtml)
async function createWindow() {
  const icon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'favicon.ico'))
  icon.setTemplateImage(true)

  const resizedIcon = icon.resize({
    width: 256,
    height: 256,
    quality: 'better'
  })

  win = new BrowserWindow({
    title: 'Main window',
    height: 860,
    backgroundColor: '#1c1c1c',
    frame: false,
    titleBarStyle: 'hiddenInset',
    maximizable: true,
    resizable: true,
    width: 1260,
    minHeight: 860,
    minWidth: 1260,
    icon: resizedIcon,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      // devTools: false
    },
  })
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {

    win.loadFile(indexHtml)
  }

  win.webContents.openDevTools()

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Erreur de chargement:', errorCode, errorDescription);
  });

  win.webContents.on('did-finish-load', () => {
  });

  // Register all window IPC handlers
  registerWindowIPC(win)

  // Auto update
  // update(win)

  win.on('maximize', () => {
    win?.webContents.send('window-maximized-change', true)
  })

  win.on('unmaximize', () => {
    win?.webContents.send('window-maximized-change', false)
  })
}

app.whenReady().then(async () => {
  await createWindow()

});

app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'Nouvelle fenêtre',
    description: 'Créer une nouvelle fenêtre'
  }
])
app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
