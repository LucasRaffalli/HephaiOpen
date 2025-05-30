interface Window {
    electron?: {
        ipcRenderer: {
            on: (channel: string, func: (...args: any[]) => void) => void
            removeAllListeners: (channel: string) => void
        }
    }
}
