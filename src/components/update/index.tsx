import { useCallback, useEffect, useState } from 'react';
import { Button, Badge, Flex, Progress, Text, Separator } from '@radix-ui/themes';
import { UpdateIcon, DownloadIcon } from '@radix-ui/react-icons';
import type { ProgressInfo } from 'electron-updater';
import type { VersionInfo } from '../../types/hephai';
import Modal from './Modal';
import ContainerInterface from '../template/ContainerInterface';
import { t } from 'i18next';


const UpdatePage = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [updateInfo, setUpdateInfo] = useState({
        available: false,
        version: '',
        newVersion: '',
        releaseNotes: '',
        error: '',
        progress: 0,
        isDownloading: false,
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
            setShowModal(true);
        } catch (error) {
            setUpdateInfo(prev => ({ ...prev, error: 'Erreur lors de la vérification' }));
        } finally {
            setIsChecking(false);
        }
    };

    const startDownload = async () => {
        if (!confirm(t("update.confirmDownload"))) {
            return;
        }

        setUpdateInfo(prev => ({ ...prev, isDownloading: true, progress: 0 }));
        try {
            await window.ipcRenderer.invoke('start-download');
        } catch (error) {
            setUpdateInfo(prev => ({
                ...prev,
                error: 'Erreur lors du téléchargement2',
                isDownloading: false
            }));
        }
    };

    const onUpdateAvailable = useCallback((_event: Electron.IpcRendererEvent, arg: VersionInfo) => {
        setUpdateInfo(prev => ({
            ...prev,
            available: arg.update,
            version: arg.version,
            newVersion: arg.newVersion,
            releaseNotes: arg.releaseNotes || '',
            error: ''
        }));
    }, []);

    const onProgress = useCallback((_event: Electron.IpcRendererEvent, arg: ProgressInfo) => {
        setUpdateInfo(prev => ({
            ...prev,
            progress: arg.percent || 0,
            isDownloading: true
        }));
    }, []);

    const onUpdateDownloaded = useCallback(() => {
        setUpdateInfo(prev => ({
            ...prev,
            isDownloaded: true,
            isDownloading: false,
            progress: 100
        }));
        setTimeout(() => {
            window.ipcRenderer.invoke('quit-and-install');
        }, 1500);
    }, []);

    useEffect(() => {
        window.ipcRenderer.on('update-can-available', onUpdateAvailable);
        window.ipcRenderer.on('download-progress', onProgress);
        window.ipcRenderer.on('update-downloaded', onUpdateDownloaded);
        window.ipcRenderer.on('update-error', (_event, error) => {
            setUpdateInfo(prev => ({
                ...prev,
                error: error.message || 'Erreur inconnue',
                isDownloading: false
            }));
        });

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
                <Text size="2" color="gray">{t("update.changeUpdate")}: </Text>
                <Flex direction="column" gap="2">
                    <Text as="p" size="2">
                        {updateInfo.releaseNotes || "• Nouvelles améliorations et 2corrections de bugs"}
                    </Text>
                </Flex>
            </Flex>
        );
    };

    return (
        <ContainerInterface height='100%' padding='4' justify='center' align='center'>
            <Modal open={showModal} cancelText={t("buttons.close")} onCancel={() => setShowModal(false)} title={updateInfo.error ? t("update.error") : t("update.title")}>
                {updateInfo.error ? (
                    <Badge color="red">{updateInfo.error}</Badge>
                ) : updateInfo.available ? (
                    <Flex direction="column" gap="3" width="100%">
                        <Flex gap="2" align="center">
                            <Badge variant="soft" color="red" size={"3"}>{updateInfo.version}</Badge>
                            →
                            <Badge variant="soft" size={"3"}>{updateInfo.newVersion}</Badge>
                        </Flex>

                        {getChangeDescription()}
                        <Separator size={"4"} mt={"2"} />
                        {(updateInfo.isDownloading || updateInfo.progress > 0) && (
                            <Flex direction="column" gap="2">
                                <Text size="2" color="gray">
                                    {t("buttons.download.download")} {Math.round(updateInfo.progress)}%
                                </Text>
                                <Progress value={updateInfo.progress} radius="full" />
                            </Flex>
                        )}
                        {updateInfo.isDownloaded ? (
                            <Flex direction="column" gap="2">
                                <Badge color="green" size="3">{t("update.downloaded")}</Badge>
                                <Text size="2" color="gray">{t("update.restartMessage")}</Text>
                            </Flex>
                        ) : !updateInfo.isDownloading && (
                            <Flex direction="column" gap="3">
                                <Text size="2" color="gray">{t("update.availableMessage")}</Text>
                                <Flex>
                                    <Button onClick={startDownload} disabled={updateInfo.isDownloading}>
                                        <DownloadIcon />
                                        {t("buttons.download.update.button")}
                                    </Button>
                                </Flex>
                            </Flex>
                        )}
                    </Flex>
                ) : (
                    <Badge color="amber" size="3">{t("update.currentVersion")}</Badge>
                )}
            </Modal>

            <Button size="3" disabled={isChecking || updateInfo.isDownloading} onClick={checkUpdate}>
                <UpdateIcon width={16} height={16} />
                {isChecking ? t("update.checking") : t("update.checkUpdate")}
            </Button>
        </ContainerInterface>
    );
};

export default UpdatePage;