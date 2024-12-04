/// <reference types="vite/client" />

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer;
  electron: {
    lireFactures: () => Promise<any>;
    ajouterFacture: (factureData: any) => Promise<any>;
  };
}