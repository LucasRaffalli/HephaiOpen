import { Avatar, Box, Card, Flex, Text, Tooltip } from '@radix-ui/themes';
import "../../css/navbar.css";
import Clients from './nav_content/Clients';
import Features from '@/components/navbar/nav_content/Features';
import { useState } from 'react';
import { SettingsGearIcon } from '../design/IconsAnimate';
import { NavLink } from 'react-router-dom';
import { version, name, } from '../../../package.json';
import { motion } from "framer-motion";
import { t } from 'i18next';
import HephaiIcon from '../design/icons/hephai';


export default function Navbar() {
    const [mainTab, setMainTab] = useState<'navigation' | 'clients'>('navigation');

    const borderRadius = mainTab === 'navigation' ? '0 var(--radius-4) 0 0' : 'var(--radius-4) 0 0 0';

    const tabs = [
        { id: 'navigation', title: 'Navigation' },
        { id: 'clients', title: 'Clients' },
    ];

    return (
        <Flex justify={'between'} direction={'column'} height={'100%'} gap={'4'}>
            <Box className="navbar" height={'100%'} >
                <Flex direction={"column"} justify={"between"} maxWidth='240px' height={"100%"}>
                    <Flex width="29vw" maxWidth="240px" direction="column" gap="2">
                        <Flex className="tabs" width="100%" justify="between" align="center">
                            {tabs.map((tab) => (
                                <div key={tab.id} className={`tab ${mainTab === tab.id ? 'active' : ''}`} onClick={() => setMainTab(tab.id as 'navigation' | 'clients')}>
                                    <Text className="tab-title" style={{ zIndex: 69 }}>{tab.title}</Text>
                                </div>
                            ))}
                            <Box className="tab-indicator" style={{ width: `${100 / tabs.length}%`, left: `${tabs.findIndex((t) => t.id === mainTab) * (100 / tabs.length)}%`, }} />
                        </Flex>
                    </Flex>

                    <Flex className="tab__content" height="100%" pt={'4'} pb="4" pl="4" pr="4" style={{ borderRadius }}>
                        {mainTab === 'navigation' &&
                            <Features />
                        }
                        {mainTab === 'clients' &&
                            <Clients />
                        }
                    </Flex>
                </Flex>
            </Box >
            <motion.div initial={{ y: 20, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.2, delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}>
                <Tooltip content={t('utils.tooltips.settings')}>
                    <Box maxWidth="100%">
                        <NavLink to="/settings" >
                            <Card className='card_hephai'>
                                <Flex gap="3" align="center">
                                    <Flex direction="row" gap="2" align="center" justify="start" width="100%">
                                        <HephaiIcon size={40} />
                                        <Box>
                                            <Text as="div" size="2" weight="bold">HephaiOpen</Text>
                                            <Text as="div" size="1" weight="light">{t('text.version')} {version}</Text>
                                        </Box>
                                    </Flex>
                                    <SettingsGearIcon size={20} />
                                </Flex>
                            </Card>
                        </NavLink>
                    </Box>
                </Tooltip>
            </motion.div>
        </Flex >
    );
}
