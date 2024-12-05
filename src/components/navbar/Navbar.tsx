import { Avatar, Box, Card, Flex, TabNav, Tabs, Text } from '@radix-ui/themes';
import "../../css/navbar.css";
import Clients from './nav_content/Clients';
import Features from '@/components/navbar/nav_content/Features';
import { useEffect, useState } from 'react';
import { getAccentColorHex } from '../../utils/getAccentColorHex';
import { SettingsGearIcon } from '../design/IconsAnimate';
import { NavLink, Outlet, useLocation } from 'react-router-dom';



export default function Navbar() {
    const [mainTab, setMainTab] = useState<'navigation' | 'clients'>('navigation');
    const location = useLocation();
    const colorHexTheme = getAccentColorHex();

    const borderRadius = mainTab === 'navigation' ? '0 var(--radius-4) 0 0' : 'var(--radius-4) 0 0 0';

    const tabs = [
        { id: 'navigation', title: 'Navigation' },
        { id: 'clients', title: 'Clients' },
    ];

    return (
        <Flex justify={'between'} direction={'column'} height={'100%'} gap={'4'}>
            <Box className="navbar" height={'100%'} >
                <Flex direction={"column"} justify={"between"} maxWidth='240px' height={"100%"}>
                    <Flex width="28vw" maxWidth="240px" direction="column" gap="2">
                        <Flex className="tabs" width="100%" justify="between" align="center">
                            {tabs.map((tab) => (
                                <div key={tab.id} className={`tab ${mainTab === tab.id ? 'active' : ''}`} onClick={() => setMainTab(tab.id as 'navigation' | 'clients')}>
                                    <Text className="tab-title" style={{ zIndex: 69 }}>{tab.title}</Text>
                                </div>
                            ))}
                            <Box className="tab-indicator" style={{ width: `${100 / tabs.length}%`, left: `${tabs.findIndex((t) => t.id === mainTab) * (100 / tabs.length)}%`, }} />
                        </Flex>
                    </Flex>

                    <Flex className="tab__content" p={'2'} width="100%" height="100%" direction={'column'} gap={"2"} style={{ borderRadius }}>
                        {mainTab === 'navigation' && <Features />}
                        {mainTab === 'clients' && <Clients />}
                    </Flex>
                </Flex>
            </Box >
            <Box maxWidth="100%">
                <NavLink to="/settings" >
                    <Card>
                        <Flex gap="3" align="center">
                            <Avatar
                                size="3"
                                src="hephai_pp.png"
                                radius="small"
                                fallback="heph"
                            />
                            <Flex direction="row" gap="2" align="center" justify="between" width="100%">
                                <Box>
                                    <Text as="div" size="2" weight="bold">
                                        Hephai
                                    </Text>
                                    <Text as="div" size="1" weight="light">
                                        Version 0.0.5
                                    </Text>
                                </Box>
                                <SettingsGearIcon size={20} />
                            </Flex>
                        </Flex>
                    </Card>
                </NavLink>
            </Box>


        </Flex >
    );
}
