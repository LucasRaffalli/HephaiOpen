import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import type { ProgressInfo, UpdateDownloadedEvent, UpdateInfo } from 'electron-updater'
import { mockUpdate } from './update.mock'

const { autoUpdater } = createRequire(import.meta.url)('electron-updater')

let isDownloading = false

export function update(win: BrowserWindow) {
  // En mode dev, utiliser le mock
  // if (!app.isPackaged) {
  //   ipcMain.handle('check-update', async () => {
  //     mockUpdate(win)
  //     return { update: true, message: 'Mode développement : simulation de mise à jour' }
  //   })
  //   return
  // }

  // Mode production : vraie logique de mise à jour
  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false

  // 🔎 Vérification des mises à jour
  ipcMain.handle('check-update', async () => {
    if (!app.isPackaged) {
      console.warn("Mise à jour non disponible en mode dev.")
      return { update: false, message: 'L’update fonctionne seulement en version packagée.' }
    }

    try {
      console.log("🔎 Vérification des mises à jour...")
      const updateCheck = await autoUpdater.checkForUpdates()
      if (updateCheck?.updateInfo) {
        win.webContents.send('update-can-available', {
          update: true,
          version: app.getVersion(),
          newVersion: updateCheck.updateInfo.version
        })
      } else {
        win.webContents.send('update-can-available', { update: false })
      }
      return updateCheck
    } catch (error) {
      console.error("❌ Erreur lors de la vérification des mises à jour :", error)
      return { update: false, message: 'Erreur réseau', error }
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
    autoUpdater.quitAndInstall(false, true)
  })
}
