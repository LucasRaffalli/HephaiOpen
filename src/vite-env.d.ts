/// <reference types="vite/client" />

interface Window {
  ipcRenderer: import('electron').IpcRenderer;
  electron: {
    lireFactures: () => Promise<any>;
    ajouterFacture: (factureData: any) => Promise<any>;
  };
}