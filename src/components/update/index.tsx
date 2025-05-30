import { useCallback, useEffect, useState } from 'react';
import { Button, Badge, Flex, Progress, Text } from '@radix-ui/themes';
import { UpdateIcon } from '@radix-ui/react-icons';
import type { ProgressInfo } from 'electron-updater';
import Modal from './Modal';
import ContainerInterface from '../template/ContainerInterface';
import './update.css';

interface VersionInfo {
    update: boolean;
    version: string;
    newVersion: string;
}

const UpdatePage = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [updateInfo, setUpdateInfo] = useState({
        available: false,
        version: '',
        newVersion: '',
        error: '',
        progress: 0,
        isDownloaded: false
    });
    const [showModal, setShowModal] = useState(false);

    const checkUpdate = async () => {
        setIsChecking(true);
        try {
            const result = await window.ipcRenderer.invoke('check-update');
            if (result?.error) {
                setUpdateInfo(prev => ({ ...prev, error: result.message }));
            }
        } catch (error) {
            setUpdateInfo(prev => ({ ...prev, error: 'Erreur lors de la vérification' }));
        } finally {
            setIsChecking(false);
        }
    };

    const onUpdateAvailable = useCallback((_event: Electron.IpcRendererEvent, arg: VersionInfo) => {
        setUpdateInfo(prev => ({
            ...prev,
            available: arg.update,
            version: arg.version,
            newVersion: arg.newVersion,
            error: ''
        }));
        setShowModal(true);
    }, []);

    const onProgress = useCallback((_event: Electron.IpcRendererEvent, arg: ProgressInfo) => {
        setUpdateInfo(prev => ({ ...prev, progress: arg.percent || 0 }));
    }, []);

    const onUpdateDownloaded = useCallback(() => {
        setUpdateInfo(prev => ({ ...prev, isDownloaded: true }));
        setTimeout(() => window.ipcRenderer.invoke('quit-and-install'), 2000);
    }, []);

    useEffect(() => {
        window.ipcRenderer.on('update-can-available', onUpdateAvailable);
        window.ipcRenderer.on('download-progress', onProgress);
        window.ipcRenderer.on('update-downloaded', onUpdateDownloaded);

        return () => {
            window.ipcRenderer.off('update-can-available', onUpdateAvailable);
            window.ipcRenderer.off('download-progress', onProgress);
            window.ipcRenderer.off('update-downloaded', onUpdateDownloaded);
        }
    }, [onUpdateAvailable, onProgress, onUpdateDownloaded]);

    const getChangeDescription = () => {
        if (!updateInfo.available) return null;
        
        return (
            <Flex direction="column" gap="3">
                <Text size="2" color="gray">Changements dans cette version :</Text>
                <Flex direction="column" gap="2">
                    <Text as="p" size="2">• Améliorations de performance</Text>
                    <Text as="p" size="2">• Nouvelles fonctionnalités</Text>
                    <Text as="p" size="2">• Corrections de bugs</Text>
                </Flex>
            </Flex>
        );
    };

    return (
        <ContainerInterface height='100%' padding='4' justify='center' align='center'>
            <Modal 
                open={showModal} 
                cancelText="Fermer" 
                okText={updateInfo.available && !updateInfo.isDownloaded ? "Télécharger" : undefined}
                onCancel={() => setShowModal(false)}
                onOk={() => window.ipcRenderer.invoke('start-download')}
                title={updateInfo.error ? "Erreur" : "Mise à jour"}
            >
                {updateInfo.error ? (
                    <Badge color="red">{updateInfo.error}</Badge>
                ) : updateInfo.available ? (
                    <Flex direction="column" gap="3">
                        <Flex gap="2" align="center">
                            <Badge variant="soft" color="red">{updateInfo.version}</Badge>
                            →
                            <Badge variant="soft" color="indigo">{updateInfo.newVersion}</Badge>
                        </Flex>
                        {getChangeDescription()}
                        {updateInfo.progress > 0 && (
                            <Progress value={updateInfo.progress} />
                        )}
                        {updateInfo.isDownloaded && (
                            <Badge color="green">Installation en cours...</Badge>
                        )}
                    </Flex>
                ) : (
                    <Badge color="green">Vous utilisez la dernière version</Badge>
                )}
            </Modal>

            <Button size="3" disabled={isChecking} onClick={checkUpdate}>
                <UpdateIcon width={16} height={16} />
                {isChecking ? 'Vérification...' : 'Vérifier les mises à jour'}
            </Button>
        </ContainerInterface>
    );
};

export default UpdatePage;