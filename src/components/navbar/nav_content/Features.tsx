import { Box, Flex, Card, Text } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import "../../../css/feature.css";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

export default function Features() {
    const { t } = useTranslation();
    const location = useLocation();

    const cardVariants = {
        hidden: {
            y: 20,
            opacity: 0,
            scale: 0.95
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: '100%', display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <motion.div variants={cardVariants}>
                <Box className="invoice">
                    <Link to="/navigation/factures" style={{ textDecoration: 'none' }}>
                        <Card className={`glow ${isActive('/navigation/factures') ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
                            <Flex gap="3" justify={'between'} align="center" height={'5vh'} className=''>
                                <Box>
                                    <Text size="2" weight="bold">
                                        {t('features.invoice.title')}
                                    </Text>
                                </Box>
                                <Flex direction={'row'} justify={'end'} className='card__container__grid'>
                                    <Box style={{ 'zIndex': 22 }}>
                                        <div className={`filter__paper ${isActive('/chart') ? 'active' : ''}`}></div>
                                        <img src="/img/invoiceImg.png" alt="InvoiceImg" />
                                    </Box>
                                </Flex>
                            </Flex>
                        </Card>
                    </Link>
                </Box>
            </motion.div>

            <motion.div variants={cardVariants}>
                <Box className="premium">
                    <Link to="/navigation/premium" style={{ textDecoration: 'none' }}>
                        <Card className={`glow btnCursor premium ${isActive('/navigation/premium') ? 'active__premium' : ''}`} >
                            <Flex gap="3" justify={'between'} align="center" height={'5vh'}>
                                <Box>
                                    <Text as="div" size="2" weight="bold">
                                        {t('features.premium.title')}
                                    </Text>
                                </Box>
                                <Flex direction={'row'} justify={'end'} className='card__container__grid__premium '>
                                    <Box style={{ 'zIndex': 22 }}>
                                        <div className={` ${isActive('/navigation/premium') ? 'active' : ''}`}></div>
                                        <img src="/img/premium.svg" alt="premiumImg" />
                                    </Box>
                                </Flex>
                            </Flex>
                        </Card>
                    </Link>
                </Box>
            </motion.div>
            {/* </Flex> */}
        </motion.div>
    );
}
