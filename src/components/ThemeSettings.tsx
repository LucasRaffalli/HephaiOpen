import { Flex, Tooltip, Text, Button, Box } from '@radix-ui/themes';
import { t } from 'i18next';
import React from 'react';
import themeLight from '/img/themeLight.png'
import themeDark from '/img/themeDark.png'
import { getAccentColorHex } from '@/utils/getAccentColorHex';
interface ThemeSettingsProps {
    isDarkMode: boolean;
    toggleTheme: (theme: 'light' | 'dark') => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ isDarkMode, toggleTheme }) => {
    const colorHexTheme = getAccentColorHex();
    return (
        <Flex direction={'row'} gap={'4'} width={'100%'} height={'fit-content'} wrap={'wrap'}>
            <Flex direction={'column'} gap={'2'}>
                <Tooltip content={t('utils.tooltips.themeL')}>
                    <Box onClick={() => toggleTheme('light')} className={`themeColor ${!isDarkMode ? 'selected' : ''}`} style={{ '--color-bg': '' + colorHexTheme } as React.CSSProperties}>
                        <img src={themeLight} alt="Light Theme" />
                    </Box>
                </Tooltip>
                <Text color="gray" size="2" weight={'regular'} as={'label'}>{t('settings.themeColor.light')}</Text>
            </Flex>
            <Flex direction={'column'} gap={'2'}>
                <Tooltip content={t('utils.tooltips.themeD')}>
                    <Box className={`themeColor ${isDarkMode ? 'selected' : ''}`} style={{ '--color-bg': '' + colorHexTheme } as React.CSSProperties} onClick={() => toggleTheme('dark')}>
                        <img src={themeDark} alt="Dark Theme" />
                    </Box>
                </Tooltip>
                <Text color="gray" size="2" weight={'regular'}>{t('settings.themeColor.dark')}</Text>
            </Flex>
        </Flex>
    );
};

export default ThemeSettings;
