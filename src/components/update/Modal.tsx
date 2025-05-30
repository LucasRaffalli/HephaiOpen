import React from 'react';
import { Theme, Button, Dialog, Flex } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Trash } from 'lucide-react';

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    cancelText?: string;
    okText?: string;
    onCancel?: () => void;
    onOk?: () => void;
    footer?: React.ReactNode;
    title?: string;
    description?: string;
}

const Modal: React.FC<ModalProps> = ({
    open,
    children,
    cancelText = 'Annuler',
    okText = 'OK',
    onCancel,
    onOk,
    footer,
    title,
    description
}) => {
    return (
        <Theme>
            <Dialog.Root open={open} onOpenChange={() => onCancel?.()}>
                <Dialog.Content>
                    {title && <Dialog.Title mb="2">{title}</Dialog.Title>}
                    {description && (
                        <Dialog.Description size="2" mb="4">
                            {description}
                        </Dialog.Description>
                    )}

                    <Flex>
                        {children}
                    </Flex>                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="red" onClick={onCancel}>
                                {cancelText}
                            </Button>
                        </Dialog.Close>
                        {okText && (
                            <Button variant="solid" color="blue" onClick={onOk}>
                                {okText}
                            </Button>
                        )}
                    </Flex>

                </Dialog.Content>
            </Dialog.Root>
        </Theme>
    );
};

export default Modal;
