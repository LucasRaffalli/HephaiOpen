import { Button, Dialog, Flex, Table, Text } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { menuItems, TitlebarMenuItem } from '../../../electron/win/titlebarMenus'
import { t } from 'i18next'

export default function ShortcutsPanel() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key.toLowerCase() === 's') {
                setIsOpen(prev => !prev)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const getShortcutsByCategory = () => {
        const system = ['Window', 'File']
        const navigation = ['View']
        const tools = ['Credits']

        const shortcuts = {
            system: [] as any[],
            navigation: [] as any[],
            tools: [] as any[]
        }

        menuItems.forEach(menu => {
            menu.items.forEach(item => {
                if (item.shortcut && item.shortcut !== 'Toggle') {
                    const shortcut = {
                        name: item.name,
                        category: menu.name,
                        shortcut: item.shortcut
                    }

                    if (system.includes(menu.name)) shortcuts.system.push(shortcut)
                    else if (navigation.includes(menu.name)) shortcuts.navigation.push(shortcut)
                    else shortcuts.tools.push(shortcut)
                }
            })
        })
        return shortcuts
    }

    const TableSection = ({ title, items }: { title: string; items: any[] }) => (
        <div style={{ marginBottom: '2rem' }}>
            <Text size="3" weight="bold" mb="2">{title}</Text>
            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>{t('shortcutsPanel.action')}</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>{t('shortcutsPanel.shortcut')}</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {items.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                            <Table.Cell>{item.shortcut}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    )

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger style={{ display: 'none' }}>
                <Button>{t('shortcutsPanel.title')}</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="700px">
                <Dialog.Title>{t('shortcutsPanel.title')}</Dialog.Title>

                {(() => {
                    const shortcuts = getShortcutsByCategory()
                    return (
                        <>
                            <TableSection title={t('menu.window.title')} items={shortcuts.system} />
                            <TableSection title={t('menu.view.title')} items={shortcuts.navigation} />
                            <TableSection title={t('menu.credits.title')} items={shortcuts.tools} />
                        </>
                    )
                })()}

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="red">{t('buttons.close')}</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}
