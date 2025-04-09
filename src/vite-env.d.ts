/// <reference types="vite/client" />

interface Window {
  ipcRenderer: import('electron').IpcRenderer;
  electron: {
    [x: string]: any;
    lireFactures: () => Promise<any>;
    ajouterFacture: (factureData: any) => Promise<any>;
  };
}