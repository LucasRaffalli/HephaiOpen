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
let downloadTimeout: NodeJS.Timeout | null = null

export function update(win: BrowserWindow) {
  // Configuration de base de l'auto-updater avec timeouts
  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false
  autoUpdater.autoInstallOnAppQuit = true
  
  // Ajout de logs détaillés
  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'debug'
  log.info('Version actuelle:', app.getVersion())

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

  // Configuration pour GitHub avec timeout
  const options = {
    provider: 'github',
    owner: 'LucasRaffalli',
    repo: 'HephaiOpen',
    requestHeaders: {
      'User-Agent': `HephaiOpen/${app.getVersion()}`
    }
  }
  
  log.info('Configuration auto-updater:', options)
  Object.assign(autoUpdater, options)

  // Événements d'auto-updater avec gestion améliorée
  autoUpdater.on('checking-for-update', () => {
    log.info('Vérification des mises à jour...')
  })

  autoUpdater.on('update-available', (info: UpdateInfo) => {
    log.info('Mise à jour disponible:', info)
    if (downloadTimeout) {
      clearTimeout(downloadTimeout)
      downloadTimeout = null
    }
  })

  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    log.info('Pas de mise à jour disponible:', info)
  })

  autoUpdater.on('error', (error: Error) => {
    log.error('Erreur de l\'auto-updater:', error)
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

  // 📥 Lancement du téléchargement avec gestion du timeout
  ipcMain.handle('start-download', (event) => {
    if (isDownloading) {
      log.warn("⚠️ Téléchargement déjà en cours...")
      return
    }

    // Reset du statut de téléchargement
    isDownloading = true
    
    // Définir un timeout de 5 minutes pour le téléchargement
    downloadTimeout = setTimeout(() => {
      if (isDownloading) {
        log.error("❌ Timeout du téléchargement")
        isDownloading = false
        event.sender.send('update-error', { 
          message: 'Le téléchargement a pris trop de temps', 
          error: new Error('Download timeout') 
        })
        autoUpdater.removeAllListeners('download-progress')
        autoUpdater.removeAllListeners('update-downloaded')
      }
    }, 5 * 60 * 1000)

    autoUpdater.downloadUpdate().catch((error: Error) => {
      log.error("❌ Erreur lors du démarrage du téléchargement:", error)
      if (downloadTimeout) {
        clearTimeout(downloadTimeout)
        downloadTimeout = null
      }
      isDownloading = false
      event.sender.send('update-error', { message: error.message, error })
    })

    autoUpdater.on('download-progress', (progress: ProgressInfo) => {
      log.info(`📊 Progression : ${progress.percent.toFixed(2)}% à ${progress.bytesPerSecond} octets/s`)
      event.sender.send('download-progress', progress)
    })

    autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
      log.info("✅ Mise à jour téléchargée")
      if (downloadTimeout) {
        clearTimeout(downloadTimeout)
        downloadTimeout = null
      }
      isDownloading = false
      win.webContents.send('update-downloaded', { 
        version: event.version,
        files: event.files,
        path: event.path
      })
    })
  })

  // ⚡ Installation de la mise à jour avec vérification
  ipcMain.handle('quit-and-install', () => {
    log.info("🚀 Installation de la mise à jour...")
    try {
      setImmediate(() => {
        autoUpdater.quitAndInstall(true, true)
      })
    } catch (error) {
      log.error("❌ Erreur lors de l'installation:", error)
      win.webContents.send('update-error', { 
        message: 'Erreur lors de l\'installation', 
        error 
      })
    }
  })
}
