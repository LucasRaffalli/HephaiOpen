import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import type { 
  ProgressInfo, 
  UpdateDownloadedEvent, 
  UpdateInfo, 
  UpdateCheckResult 
} from 'electron-updater'
import { mockUpdate } from './update.mock'
import log from 'electron-log'

const { autoUpdater } = createRequire(import.meta.url)('electron-updater')

let isDownloading = false

export function update(win: BrowserWindow) {
  // Configuration de base de l'auto-updater
  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false
  
  // Ajout de logs détaillés
  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'debug'
  console.log('Version actuelle:', app.getVersion())

  // En mode dev, utiliser le mock
  if (!app.isPackaged) {
    ipcMain.handle('check-update', async () => {
      mockUpdate(win)
      return { update: true, message: 'Mode développement : simulation de mise à jour' }
    })

    ipcMain.handle('quit-and-install', () => {
      console.log("🚀 [DEV] Simulation de l'installation de la mise à jour...")
      app.quit()
    })
    return
  }
  // Configuration pour GitHub
  const options = {
    provider: 'github',
    owner: 'LucasRaffalli',
    repo: 'HephaiOpen'
  }
  
  console.log('Configuration auto-updater:', options)
  Object.assign(autoUpdater, options)

  // Événements d'auto-updater pour le logging
  autoUpdater.on('checking-for-update', () => {
    console.log('Vérification des mises à jour...')
  })

  autoUpdater.on('update-available', (info: UpdateInfo) => {
    console.log('Mise à jour disponible:', info)
  })

  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    console.log('Pas de mise à jour disponible:', info)
  })

  autoUpdater.on('error', (error: Error) => {
    console.error('Erreur de l\'auto-updater:', error)
  })

  // 🔎 Vérification des mises à jour
  ipcMain.handle('check-update', async (): Promise<UpdateCheckResult | { message: string; error: Error; currentVersion: string }> => {
    try {
      console.log("🔎 Vérification des mises à jour...")
      console.log("URL du feed:", autoUpdater.getFeedURL())
      
      const updateCheck = await autoUpdater.checkForUpdates()
      console.log("Résultat de la vérification:", updateCheck)
      
      if (updateCheck?.updateInfo) {
        console.log("Nouvelle version disponible:", updateCheck.updateInfo.version)
        win.webContents.send('update-can-available', {
          update: true,
          version: app.getVersion(),
          newVersion: updateCheck.updateInfo.version
        })
      } else {
        console.log("Pas de nouvelle version disponible")
        win.webContents.send('update-can-available', { 
          update: false,
          version: app.getVersion()
        })
      }
      return updateCheck
    } catch (error) {
      console.error("❌ Erreur lors de la vérification des mises à jour:", error)
      const err = error instanceof Error ? error : new Error('Unknown error')
      return { 
        message: `Erreur réseau: ${err.message}`, 
        error: err,
        currentVersion: app.getVersion()
      }
    }
  })

  // 📥 Lancement du téléchargement
  ipcMain.handle('start-download', (event) => {
    if (isDownloading) {
      console.warn("⚠️ Téléchargement déjà en cours...")
      return
    }
    isDownloading = true

    autoUpdater.downloadUpdate()

    autoUpdater.on('download-progress', (progress: ProgressInfo) => {
      console.log(`📊 Progression du téléchargement : ${progress.percent.toFixed(2)}%`)
      event.sender.send('download-progress', progress)
    })

    autoUpdater.on('error', (error: any) => {
      console.error("❌ Erreur lors du téléchargement :", error)
      event.sender.send('update-error', { message: error.message, error })
      isDownloading = false
    })

    autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
      console.log("✅ Mise à jour téléchargée.")
      win.webContents.send('update-downloaded')
      isDownloading = false
    })
  })

  // ⚡ Installation de la mise à jour
  ipcMain.handle('quit-and-install', () => {
    console.log("🚀 Installation de la mise à jour...")
    setImmediate(() => autoUpdater.quitAndInstall(false, true))
  })
}
