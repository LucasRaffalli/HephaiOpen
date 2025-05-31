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
import semver from 'semver'

const { autoUpdater } = createRequire(import.meta.url)('electron-updater')

let isDownloading = false
let downloadTimeout: NodeJS.Timeout | null = null

export function update(win: BrowserWindow) {
  // Configuration de l'auto-updater
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.allowDowngrade = false
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

  // Configuration pour GitHub
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

  // Événements d'auto-updater
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
    win.webContents.send('update-error', { message: error.message })
  })

  // Vérification des mises à jour
  ipcMain.handle('check-update', async (): Promise<UpdateCheckResult | { message: string; error: Error; currentVersion: string }> => {
    try {
      log.info("🔎 Vérification des mises à jour...")
      log.info("Version actuelle:", app.getVersion())
      
      const updateCheck = await autoUpdater.checkForUpdates()
      log.info("Résultat de la vérification:", updateCheck)
      
      if (updateCheck?.updateInfo) {
        const currentVersion = app.getVersion()
        const newVersion = updateCheck.updateInfo.version
        const hasUpdate = semver.gt(newVersion, currentVersion)
        
        log.info(`Comparaison des versions - Actuelle: ${currentVersion}, Nouvelle: ${newVersion}, Mise à jour disponible: ${hasUpdate}`)
        
        win.webContents.send('update-can-available', {
          update: hasUpdate,
          version: currentVersion,
          newVersion: newVersion
        })
      } else {
        log.info("Pas de nouvelle version disponible")
        win.webContents.send('update-can-available', { 
          update: false,
          version: app.getVersion()
        })
      }
      return updateCheck
    } catch (error) {
      log.error("❌ Erreur lors de la vérification des mises à jour:", error)
      const err = error instanceof Error ? error : new Error('Unknown error')
      return { 
        message: `Erreur réseau: ${err.message}`, 
        error: err,
        currentVersion: app.getVersion()
      }
    }
  })

  // Téléchargement
  ipcMain.handle('start-download', () => {
    return new Promise((resolve, reject) => {
      if (isDownloading) {
        log.warn("⚠️ Téléchargement déjà en cours...")
        return resolve(null)
      }

      isDownloading = true
      
      // Timeout de 5 minutes
      downloadTimeout = setTimeout(() => {
        if (isDownloading) {
          log.error("❌ Timeout du téléchargement")
          isDownloading = false
          win.webContents.send('update-error', { 
            message: 'Le téléchargement a pris trop de temps'
          })
          reject(new Error('Download timeout'))
        }
      }, 5 * 60 * 1000)

      // Gestion de la progression
      const onProgress = (progress: ProgressInfo) => {
        log.info(`📊 Progression : ${progress.percent.toFixed(2)}% à ${progress.bytesPerSecond} octets/s`)
        win.webContents.send('download-progress', progress)
      }

      // Gestion du téléchargement terminé
      const onDownloaded = (event: UpdateDownloadedEvent) => {
        log.info("✅ Mise à jour téléchargée", event.version)
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
        
        // Nettoyage des listeners
        autoUpdater.removeListener('download-progress', onProgress)
        autoUpdater.removeListener('update-downloaded', onDownloaded)
        autoUpdater.removeListener('error', onError)
        
        resolve(null)
      }

      // Gestion des erreurs
      const onError = (error: Error) => {
        log.error("❌ Erreur lors du téléchargement:", error)
        if (downloadTimeout) {
          clearTimeout(downloadTimeout)
          downloadTimeout = null
        }
        isDownloading = false
        win.webContents.send('update-error', { message: error.message })
        
        // Nettoyage des listeners
        autoUpdater.removeListener('download-progress', onProgress)
        autoUpdater.removeListener('update-downloaded', onDownloaded)
        autoUpdater.removeListener('error', onError)
        
        reject(error)
      }

      // Ajout des listeners
      autoUpdater.on('download-progress', onProgress)
      autoUpdater.on('update-downloaded', onDownloaded)
      autoUpdater.on('error', onError)

      // Démarrage du téléchargement
      autoUpdater.downloadUpdate().catch(onError)
    })
  })

  // Installation
  ipcMain.handle('quit-and-install', () => {
    log.info("🚀 Installation de la mise à jour...")
    try {
      autoUpdater.quitAndInstall(true, true)
    } catch (error) {
      log.error("❌ Erreur lors de l'installation:", error)
      win.webContents.send('update-error', { 
        message: 'Erreur lors de l\'installation'
      })
    }
  })
}
