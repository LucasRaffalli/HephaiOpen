import { AlertDialog, Button, Flex, Text } from '@radix-ui/themes'
import { t } from 'i18next'
import React from 'react'

type ConfirmDialogProps = {
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    triggerLabel: string
    onConfirm: () => void
    color?: 'red' | 'gray' | 'blue' | 'green';
}

export default function ConfirmDialog({ title, description, confirmLabel = `${t('buttons.yes')}`, cancelLabel = `${t('buttons.cancel')}`, triggerLabel, onConfirm, color }: ConfirmDialogProps) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button color={color} variant="soft" size="3" className="btnCursor">
                    <Text size="2">{triggerLabel}</Text>
                </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>{title}</AlertDialog.Title>
                <AlertDialog.Description size="2">{description}</AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray" className='btnCursor'>
                            {cancelLabel}
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" color={color} onClick={onConfirm} className='btnCursor'>
                            {confirmLabel}
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

