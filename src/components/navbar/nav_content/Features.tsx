import { Box, Flex, Card, Text } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import "../../../css/feature.css";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import InvoiceIcon from '/img/invoiceImg.png';
import StarsHephaiIcon from '/img/starsHephai.png';
import UpdateHephaiIcon from '/img/updateImg.webp';
import { useUpdate } from '@/context/UpdateContext';

export default function Features() {
    const { t } = useTranslation();
    const location = useLocation();
    const { updateAvailable } = useUpdate();

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

            {updateAvailable && (
                <motion.div variants={cardVariants}>
                    <Box className="update">
                        <Link to="/update" style={{ textDecoration: 'none' }}>
                            <Card className={`glow btnCursor update ${isActive('/update') ? 'active' : ''}`}>
                                <Flex gap="3" justify={'between'} align="center" height={'5vh'}>
                                    <Box>
                                        <Text as="div" size="2" weight="bold">{t('update.checkButton')}</Text>
                                    </Box>
                                    <Flex direction={'row'} justify={'end'} className='card__container__grid__update btnNotEvent'>
                                        <Flex style={{ 'zIndex': 0 }} direction={"row"} align={"center"} justify={"center"}>
                                            <div className={`filter__paper__update ${isActive('/update') ? 'active' : ''}`}></div>
                                            <img src={UpdateHephaiIcon} alt="premiumImg" />
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Link>
                    </Box>
                </motion.div>
            )}

            <motion.div variants={cardVariants}>
                <Box className="invoice">
                    <Link to="/navigation/factures" style={{ textDecoration: 'none' }}>
                        <Card className={`glow ${isActive('/navigation/factures') ? 'active' : ''} btnCursor`}>
                            <Flex gap="3" justify={'between'} align="center" height={'5vh'}>
                                <Box>
                                    <Text size="2" weight="bold">{t('features.invoice.title')}</Text>
                                </Box>
                                <Flex direction={'row'} justify={'end'} className='card__container__grid btnNotEvent'>
                                    <Box style={{ 'zIndex': 22 }}>
                                        <div className={`filter__paper ${isActive('/navigation/factures') ? 'active' : ''}`}></div>
                                        <img src={InvoiceIcon} alt="InvoiceImg" />
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
                        <Card className={`glow btnCursor premium ${isActive('/navigation/premium') ? 'active__premium' : ''}`}>
                            <Flex gap="3" justify={'between'} align="center" height={'5vh'}>
                                <Box>
                                    <Text as="div" size="2" weight="bold">{t('features.premium.title')}</Text>
                                </Box>
                                <Flex direction={'row'} justify={'end'} className='card__container__grid__premium btnNotEvent'>
                                    <Flex style={{ 'zIndex': 22 }} direction={"row"} align={"center"} justify={"center"}>
                                        <img src={StarsHephaiIcon} alt="premiumImg" className={`filter__paper__premium ${isActive('/navigation/premium') ? 'active' : ''}`} />
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Card>
                    </Link>
                </Box>
            </motion.div>


        </motion.div>
    );
}
