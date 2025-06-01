import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface UpdateContextProps {
    updateAvailable: boolean;
    checkForUpdates: () => Promise<void>;
    versionInfo?: {
        current: string;
        new?: string;
    };
}

const UpdateContext = createContext<UpdateContextProps | undefined>(undefined);

export const UpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [versionInfo, setVersionInfo] = useState<{ current: string; new?: string }>();
    const [hasCheckedInitially, setHasCheckedInitially] = useState(false);
    const { t } = useTranslation();

    const checkForUpdates = async () => {
        try {
            const result = await window.ipcRenderer.invoke('check-update');
            if (result?.error) {
                console.error('Erreur de vérification des mises à jour:', result.error);
                return;
            }

            // Mettre à jour les informations de version
            if (result?.updateInfo) {
                setVersionInfo({
                    current: result.updateInfo.version,
                    new: result.updateInfo.version
                });
            }
        } catch (error) {
            console.error('Erreur lors de la vérification des mises à jour:', error);
        }
    };

    useEffect(() => {
        // Vérification initiale unique au démarrage
        if (!hasCheckedInitially) {
            checkForUpdates();
            setHasCheckedInitially(true);
        }

        // Écouter les événements de mise à jour
        const handleUpdateAvailable = (_: any, arg: { update: boolean; version: string; newVersion?: string }) => {
            setUpdateAvailable(arg.update);
            if (arg.update) {
                setVersionInfo({
                    current: arg.version,
                    new: arg.newVersion
                });
            }
        };

        window.ipcRenderer.on('update-can-available', handleUpdateAvailable);

        // Nettoyage
        return () => {
            window.ipcRenderer.off('update-can-available', handleUpdateAvailable);
        };
    }, [hasCheckedInitially]);

    return (
        <UpdateContext.Provider value={{ updateAvailable, checkForUpdates, versionInfo }}>
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