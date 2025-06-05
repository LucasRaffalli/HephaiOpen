import { Box, Flex, Text } from '@radix-ui/themes';
import React from 'react';
import { motion } from 'framer-motion';
import '@/css/cardStylized.css';
import '@/css/premium.css';

interface CardStylized {
    children?: React.ReactNode;
    bottomTitle?: string;
    contentTop?: string;
    topSmallText?: string;
    bottomDescription?: any;
    sizeText?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    sizeTextSmall?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    uppercase?: boolean;
    weight?: "light" | "regular" | "medium" | "bold";
    isGrayTop?: boolean;
    isGrayBottom?: boolean;
    isItalicTopSmall?: boolean;
    isCursorPointer?: boolean;
    effectVariant?: "stars" | "bubbles" | "sparkles" | "none" | "update";
    onClick?: () => void;
    style?: ""
}

export default function CardStylized({ isCursorPointer, contentTop, topSmallText, bottomTitle, bottomDescription, sizeText, sizeTextSmall, weight, isGrayTop, isGrayBottom, effectVariant = "stars", onClick, style }: CardStylized) {
    const cardAnimation = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const textAnimation = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease: "easeOut" }
        })
    };

    return (
        <motion.div variants={cardAnimation} initial="hidden" animate="visible" onClick={onClick} className={isCursorPointer ? "btnCursor" : ""} style={{ border: 'none', }}>
            <Flex p="4" height="43vh" width="30vh" className='cardStylized__base'>
                <Box className='gradient' />
                {effectVariant !== "none" && <Box className={`${effectVariant}Effect`} />}
                <Flex height="100%" width="100%" direction="column" justify="center" align="center" className='cardStylized__content'>
                    <Flex height="100%" width="100%" direction="column" justify="center" align="center" className='cardStylized__content'>
                        <Flex direction="column" p="2" height="100%" width="100%" className='cardStylized__content__top'>
                            <Flex direction="column">
                                {contentTop?.split(',').map((text, index) => (
                                    <motion.div key={index} variants={textAnimation} initial="hidden" animate="visible" custom={index}>
                                        <Text size={sizeText} weight={weight}>{text.trim()}</Text>
                                    </motion.div>
                                ))}
                            </Flex>
                            <motion.div variants={textAnimation} initial="hidden" animate="visible" custom={3}>
                                <Text color={isGrayTop ? "gray" : undefined} size={sizeTextSmall} style={{ fontStyle: "italic" }}>
                                    {topSmallText}
                                </Text>
                            </motion.div>
                        </Flex>
                        <Flex direction="column" p="2" height="20%" width="100%" className='cardStylized__content__bottom'>
                            <motion.div variants={textAnimation} initial="hidden" animate="visible" custom={4}>
                                <Text size={sizeText} weight={weight} color={isGrayBottom ? "gray" : undefined} className="textGradient " data-text={bottomTitle}>
                                    {bottomTitle}
                                </Text>
                            </motion.div>
                            <motion.div variants={textAnimation} initial="hidden" animate="visible" custom={5}>
                                <Text weight={weight} color={isGrayBottom ? "gray" : undefined}>
                                    {bottomDescription}
                                </Text>
                            </motion.div>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </motion.div >
    );
}
