import { BrowserWindow, app } from 'electron'
import { log } from 'electron-log'

export function mockUpdate(win: BrowserWindow) {
  setTimeout(() => {
    win.webContents.send('update-can-available', {
      update: true,
      version: '0.0.7',
      newVersion: '0.0.8'
    })
  }, 1000)

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
      win.webContents.send('update-downloaded')
      console.log("Mock update downloaded");
    }
  }, 1000)
}