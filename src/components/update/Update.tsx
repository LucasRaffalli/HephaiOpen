import type { ProgressInfo } from 'electron-updater'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Heading, Text } from '@radix-ui/themes'
import './update.css'
import ContainerInterface from '../template/ContainerInterface'
import CardStylized from '../design/CardStylized'
import SmokeEffect from '../design/SmokeEffect'

const Update = () => {
  const { t } = useTranslation()
  const [checking, setChecking] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [versionInfo, setVersionInfo] = useState<VersionInfo>()
  const [updateError, setUpdateError] = useState<ErrorType>()
  const [progressInfo, setProgressInfo] = useState<Partial<ProgressInfo>>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalBtn, setModalBtn] = useState<{
    cancelText?: string
    okText?: string
    onCancel?: () => void
    onOk?: () => void
  }>({
    cancelText: t('buttons.cancel'),
    okText: t('buttons.update'),
    onCancel: () => setModalOpen(false),
    onOk: () => window.ipcRenderer.invoke('start-download'),
  })

  const checkUpdate = async () => {
    setChecking(true)
    /**
     * @type {import('electron-updater').UpdateCheckResult | null | { message: string, error: Error }}
     */
    const result = await window.ipcRenderer.invoke('check-update')
    setProgressInfo({ percent: 0 })
    setChecking(false)
    setModalOpen(true)
    if (result?.error) {
      setUpdateAvailable(false)
      setUpdateError(result?.error)
    }
  }

  const onUpdateCanAvailable = useCallback((_event: Electron.IpcRendererEvent, arg1: VersionInfo) => {
    setVersionInfo(arg1)
    setUpdateError(undefined)
    // Can be update
    if (arg1.update) {
      setModalBtn(state => ({
        ...state,
        cancelText: t('buttons.cancel'),
        okText: t('buttons.update'),
        onOk: () => window.ipcRenderer.invoke('start-download'),
      }))
      setUpdateAvailable(true)
    } else {
      setUpdateAvailable(false)
    }
  }, [])

  const onUpdateError = useCallback((_event: Electron.IpcRendererEvent, arg1: ErrorType) => {
    setUpdateAvailable(false)
    setUpdateError(arg1)
  }, [])

  const onDownloadProgress = useCallback((_event: Electron.IpcRendererEvent, arg1: ProgressInfo) => {
    setProgressInfo(arg1)
  }, [])

  const onUpdateDownloaded = useCallback((_event: Electron.IpcRendererEvent, ...args: any[]) => {
    setProgressInfo({ percent: 100 })
    setModalBtn(state => ({
      ...state,
      cancelText: t('buttons.later'),
      okText: t('buttons.installNow'),
      onOk: () => window.ipcRenderer.invoke('quit-and-install'),
    }))
  }, [])

  useEffect(() => {
    window.ipcRenderer.on('update-can-available', onUpdateCanAvailable)
    window.ipcRenderer.on('update-error', onUpdateError)
    window.ipcRenderer.on('download-progress', onDownloadProgress)
    window.ipcRenderer.on('update-downloaded', onUpdateDownloaded)

    return () => {
      window.ipcRenderer.off('update-can-available', onUpdateCanAvailable)
      window.ipcRenderer.off('update-error', onUpdateError)
      window.ipcRenderer.off('download-progress', onDownloadProgress)
      window.ipcRenderer.off('update-downloaded', onUpdateDownloaded)
    }
  }, [])

  return (
    <ContainerInterface height='100%' padding='4' justify='center' align='center' direction='column' >

      <div className='modal-slot'>
        {updateError
          ? (
            <div>
              <Text color="red" size="3">{t('errors.update.downloadError')}</Text>
              <Text color="red" size="2"></Text>
            </div>
          ) : updateAvailable
            ? (
              <Flex direction="column" gap="3">
                <Text size="3">{t('update.latestVersion')}: v{versionInfo?.newVersion}</Text>
                <Text size="2" color="gray">v{versionInfo?.version} -&gt; v{versionInfo?.newVersion}</Text>
                <Flex direction="column" gap="2">
                  <Text size="2">{t('update.progress')}:</Text>
                </Flex>
              </Flex>
            )
            : (
              <Text>{JSON.stringify(versionInfo ?? null, null, 2)}</Text>
            )}
      </div>

      <CardStylized onClick={checkUpdate} effectVariant='update' isGrayTop sizeTextSmall="3" uppercase sizeText='4' weight='bold' contentTop="HephaiOpen Update" topSmallText="Update available! Get the latest improvements and enhancements." bottomTitle="hephai Update" bottomDescription={<SmokeEffect text="Available now" size='2' uppercase weight='medium' color='gray' />} />
      {/* <Box className='shadowCard' /> */}


    </ContainerInterface>

  )
}

export default Update
