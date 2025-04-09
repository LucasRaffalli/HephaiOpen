import { ipcRenderer } from 'electron'

const validChannels = ['window-maximized-change']

const api = {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args)
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => func(...args))
  },
  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },
  on: (channel: string, callback: (...args: any[]) => void) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args))
    }
  },
  removeListener: (channel: string, callback: (...args: any[]) => void) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, (_event, ...args) => callback(...args))
    }
  },
}

export default api
