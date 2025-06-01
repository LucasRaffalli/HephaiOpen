import { BrowserWindow } from 'electron'
import log from 'electron-log'

let downloadStarted = false;
let progressInterval: NodeJS.Timeout | null = null;

export function mockUpdate(win: BrowserWindow) {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }

  setTimeout(() => {
    win.webContents.send('update-can-available', {
      update: true,
      version: '0.0.7',
      newVersion: '0.0.8',
      releaseNotes: '• Nouvelles fonctionnalités\n• Corrections de bugs'
    })
  }, 1000)

  win.webContents.on('ipc-message', (event, channel) => {
    if (channel === 'start-download' && !downloadStarted) {
      downloadStarted = true;
      let progress = 0;

      progressInterval = setInterval(() => {
        progress += 10;
        
        if (progress <= 100) {
          win.webContents.send('download-progress', {
            percent: progress,
            bytesPerSecond: 1000,
            total: 1000000,
            transferred: progress * 10000
          });
        }

        if (progress >= 100) {
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          downloadStarted = false;
          win.webContents.send('update-downloaded');
          log.info("[DEV] Simulation du telechargement terminee");
        }
      }, 1000);
    }
  });
}