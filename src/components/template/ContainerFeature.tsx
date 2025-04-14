import React from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { motion } from 'framer-motion';
import { t } from 'i18next';

interface ContainerFeatures {
    title?: string;
    children?: React.ReactNode;
    widthSize?: string;
}

const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            delay: 1.2,
            ease: "easeOut"
        }
    }
};
const ContainerFeature: React.FC<ContainerFeatures> = ({ children, title, widthSize = "240px" }) => {
    return (
        <Flex direction="column" align={'center'} gap={'4'} width={widthSize} style={{ padding: "0.5rem" }}>
            <motion.div variants={titleVariants} initial="hidden" animate="visible">
                <Text size={"2"} weight="bold">{title ? t(title) : ''}</Text>
            </motion.div>
            <Flex direction="column" justify={'center'} align={'center'} width={"100%"}>
                {children}
            </Flex>
        </Flex>
    );
};

export default ContainerFeature;
