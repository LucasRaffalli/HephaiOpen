import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface UpdateContextProps {
    updateAvailable: boolean;
    checkForUpdates: () => Promise<void>;
}

const UpdateContext = createContext<UpdateContextProps | undefined>(undefined);

export const UpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const { t } = useTranslation();

    const checkForUpdates = async () => {
        const result = await window.ipcRenderer.invoke('check-update');
        if (!result?.error) {
            setUpdateAvailable(!!result?.updateInfo?.version);
        }
    };

    useEffect(() => {
        // Vérifier les mises à jour au démarrage
        checkForUpdates();

        // Écouter les événements de mise à jour
        window.ipcRenderer.on('update-can-available', (_, arg) => {
            setUpdateAvailable(!!arg?.update);
        });

        return () => {
            window.ipcRenderer.removeAllListeners('update-can-available');
        };
    }, []);

    return (
        <UpdateContext.Provider value={{ updateAvailable, checkForUpdates }}>
            {children}
        </UpdateContext.Provider>
    );
};

export const useUpdate = () => {
    const context = useContext(UpdateContext);
    if (!context) {
        throw new Error('useUpdate must be used within an UpdateProvider');
    }
    return context;
};