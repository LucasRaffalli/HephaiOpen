import { AlertDialog, Button, Flex, Text } from '@radix-ui/themes'
import { t } from 'i18next'
import React from 'react'
import ConfirmDialog from '../template/ConfirmDialog'

export default function ButtonReset() {
    const handleReset = () => {
        localStorage.clear()
        window.location.reload()
    }
    return (
        <>
            <ConfirmDialog
                title={t('settings.reset.modal.title')}
                description={t('settings.reset.modal.description')}
                triggerLabel={t('buttons.reset')}
                confirmLabel={t('settings.reset.modal.confirm')}
                cancelLabel={t('buttons.cancel')}
                onConfirm={handleReset}
                color="red"
            />

        </>
    )
}
