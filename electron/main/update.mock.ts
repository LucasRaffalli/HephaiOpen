import { BrowserWindow } from 'electron'

export function mockUpdate(win: BrowserWindow) {
  // Simuler une nouvelle version disponible
  setTimeout(() => {
    win.webContents.send('update-can-available', {
      update: true,
      version: '0.0.7',
      newVersion: '0.0.8'
    })
  }, 1000)

  // Simuler le progrès du téléchargement
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    if (progress <= 100) {
      win.webContents.send('download-progress', {
        percent: progress,
        bytesPerSecond: 1000,
        total: 1000000,
        transferred: progress * 10000
      })
    }
    if (progress >= 100) {
      clearInterval(interval)
      // Simuler le téléchargement terminé
      win.webContents.send('update-downloaded')
    }
  }, 1000)
}