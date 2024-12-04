// import React from 'react';
// import { Box, Flex, Card, Text } from '@radix-ui/themes';
// import "../../../css/feature.css";
// import { useTranslation } from 'react-i18next';
// interface FeaturesProps {
//     activeTab: 'factures' | 'graphique' | 'settings';
//     setActiveTab: (tab: 'factures' | 'graphique' | 'settings') => void;
// }

// export default function Features({ activeTab, setActiveTab }: FeaturesProps) {
//     const { t } = useTranslation();
//     return (
//         <>

//             {/* Carte Facture */}
//             <Box maxWidth="100%" onClick={() => setActiveTab('factures')} className="invoice ">
//                 <Card className={`glow ${activeTab === 'factures' ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
//                     <Flex gap="3" justify={'between'} align="center" height={'5vh'} className=''>
//                         <Box>
//                             <Text size="2" weight="bold">
//                                 {t('features.invoice.title')}
//                             </Text>
//                         </Box>
//                         <Flex direction={'row'} justify={'end'} className='card__container__grid'>
//                             <Box style={{ 'zIndex': 22 }}>
//                                 <div className={`filter__paper ${activeTab === 'factures' ? 'active' : ''}`}></div>
//                                 <img src="/img/invoiceImg.png" alt="InvoiceImg" />
//                             </Box>

//                         </Flex>
//                     </Flex>
//                 </Card>
//             </Box>

//             {/* Carte Graphique */}
//             <Box maxWidth="100%" onClick={() => setActiveTab('graphique')} className="graph">
//                 <Card className={`glow ${activeTab === 'graphique' ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
//                     <Flex gap="3" justify={'between'} align="center" height={'5vh'}>
//                         <Box>
//                             <Text as="div" size="2" weight="bold">
//                                 {t('features.chart')}
//                             </Text>
//                         </Box>
//                         <Flex direction={'row'} justify={'end'} className='card__container__grid'>
//                             <Box style={{ 'zIndex': 22 }}>
//                                 <div className={`filter__paper ${activeTab === 'graphique' ? 'active' : ''}`}></div>
//                                 <img src="/img/GraphImg.png" alt="InvoiceImg" />
//                             </Box>

//                         </Flex>
//                     </Flex>
//                 </Card>
//             </Box>
//         </>
//     );
// }


import React from 'react';
import { Box, Flex, Card, Text } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import "../../../css/feature.css";
import { useTranslation } from 'react-i18next';

export default function Features() {
    const { t } = useTranslation();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Carte Facture */}
            <Box maxWidth="100%" className="invoice">
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

            {/* Carte Graphique */}
            <Box maxWidth="100%" className="graph">
                <Link to="/navigation/graphique" style={{ textDecoration: 'none' }}>
                    <Card className={`glow ${isActive('/navigation/graphique') ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
                        <Flex gap="3" justify={'between'} align="center" height={'5vh'}>
                            <Box>
                                <Text as="div" size="2" weight="bold">
                                    {t('features.chart')}
                                </Text>
                            </Box>
                            <Flex direction={'row'} justify={'end'} className='card__container__grid'>
                                <Box style={{ 'zIndex': 22 }}>
                                    <div className={`filter__paper ${isActive('/navigation/graphique') ? 'active' : ''}`}></div>
                                    <img src="/img/GraphImg.png" alt="GraphImg" />
                                </Box>
                            </Flex>
                        </Flex>
                    </Card>
                </Link>
            </Box>
        </>
    );
}
