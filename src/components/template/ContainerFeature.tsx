import React from 'react';
import { Button, Flex, Box, Text, ScrollArea, ContextMenu } from '@radix-ui/themes';
import { X } from 'lucide-react';
import { t } from 'i18next';
interface ContainerFeatures {
    title: string
    children?: React.ReactNode;
}
const ContainerFeature: React.FC<ContainerFeatures> = ({ children, title }) => {

    return (
        <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
            <Text size={"2"} weight="bold">{t(`${title}`)}</Text>
            <Flex direction="column" justify={'center'} align={'center'} width={"100%"}>
                {children}
            </Flex>
        </Flex>
    )
}
export default ContainerFeature;
