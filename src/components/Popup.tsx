import React from 'react';
import { Button, Flex, Box, Text, ScrollArea, ContextMenu } from '@radix-ui/themes';
import '../css/popup.css';
import { X } from 'lucide-react';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <Flex height="50vh" width="50vw" direction={'column'} className='popup__container' >
            <Flex direction={'row'} className='popup__topbar' pl={"4"} pr={"4"} pt={"2"} pb={'2'} justify={'between'} align={'center'} width={'100%'}>
                <Text size="2" weight="bold" style={{ backgroundColor: "test" }}>POPUP</Text>
                <Button variant={"soft"} color='red' onClick={onClose} style={{ cursor: "pointer" }}><X/></Button>
            </Flex>
            <Flex justify="between" align="center" p="4" width={'100%'} height={"100%"} style={{ "overflow": "hidden" }}>
                <ScrollArea scrollbars={"vertical"}>
                    {children}
                </ScrollArea>
            </Flex>

        </Flex>
    );
};

export default Popup;
