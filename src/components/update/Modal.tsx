import React from 'react';
import { Theme, Button, Dialog, Flex } from '@radix-ui/themes';
import { t } from 'i18next';


interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    cancelText?: string;
    okText?: string;
    onCancel?: () => void;
    title?: string;
    description?: string;
}

const Modal: React.FC<ModalProps> = ({
    open,
    children,
    cancelText = `${t('buttons.cancel')}`,
    onCancel,
    title,
    description
}) => {
    return (
        <Theme>
            <Dialog.Root open={open} onOpenChange={() => onCancel?.()}>
                <Dialog.Content>                    {title && <Dialog.Title mb="2">{title}</Dialog.Title>}
                    {description && (
                        <Dialog.Description size="2" mb="4">
                            <div dangerouslySetInnerHTML={{ __html: description }} />
                        </Dialog.Description>
                    )}

                    <Flex>
                        {children}
                    </Flex>
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="red" onClick={onCancel} className='btnCursor'>
                                {cancelText}
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </Theme>
    );
};

export default Modal;
