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
        try {
            const result = await window.ipcRenderer.invoke('check-update');
            if (result?.error) {
                console.error('Erreur de vérification des mises à jour:', result.error);
                return;
            }
            setUpdateAvailable(!!result?.updateInfo);
        } catch (error) {
            console.error('Erreur lors de la vérification des mises à jour:', error);
        }
    };

    useEffect(() => {
        // Vérifier les mises à jour au démarrage et toutes les heures
        checkForUpdates();
        const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

        // Écouter les événements de mise à jour
        const handleUpdateAvailable = (_: any, arg: { update: boolean }) => {
            setUpdateAvailable(!!arg?.update);
        };

        window.ipcRenderer.on('update-can-available', handleUpdateAvailable);

        // Nettoyage
        return () => {
            clearInterval(interval);
            window.ipcRenderer.removeListener('update-can-available', handleUpdateAvailable);
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