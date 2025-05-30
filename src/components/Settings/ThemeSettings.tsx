import { Flex, Tooltip, Text, Box } from '@radix-ui/themes';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import themeLight from '/img/themeLight.webp'
import themeDark from '/img/themeDark.webp'
import themeSystem from '/img/themeSystem.webp'
import { getAccentColorHex } from '@/utils/getAccentColorHex';

interface ThemeSettingsProps {
    isDarkMode: boolean;
    toggleTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ isDarkMode, toggleTheme }) => {
    const colorHexTheme = getAccentColorHex();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const [isSystemDark, setIsSystemDark] = React.useState(prefersDark.matches);
    const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark' | 'system'>(
        localStorage.getItem('themeMode') as 'light' | 'dark' | 'system' || 'light'
    );

    useEffect(() => {
        const handleChange = (e: MediaQueryListEvent) => {
            setIsSystemDark(e.matches);
        };
        prefersDark.addEventListener('change', handleChange);
        return () => prefersDark.removeEventListener('change', handleChange);
    }, []);

    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        setCurrentTheme(theme);
        toggleTheme(theme);
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <Flex direction={'row'} gap={'4'} width={'100%'} height={'fit-content'} wrap={'wrap'}>
            <Flex direction={'column'} gap={'2'}>
                <Tooltip content={t('utils.tooltips.themeL')}>
                    <Box onClick={() => handleThemeChange('light')} className={`themeColor ${currentTheme === 'light' ? 'selected' : ''}`} style={{ '--color-bg': '' + colorHexTheme } as React.CSSProperties}>
                        <img src={themeLight} alt="Light Theme" />
                    </Box>
                </Tooltip>
                <Text color="gray" size="2" weight={'regular'} as={'label'}>{t('settings.themeColor.light')}</Text>
            </Flex>
            <Flex direction={'column'} gap={'2'}>
                <Tooltip content={t('utils.tooltips.themeD')}>
                    <Box className={`themeColor ${currentTheme === 'dark' ? 'selected' : ''}`} style={{ '--color-bg': '' + colorHexTheme } as React.CSSProperties} onClick={() => handleThemeChange('dark')}>
                        <img src={themeDark} alt="Dark Theme" />
                    </Box>
                </Tooltip>
                <Text color="gray" size="2" weight={'regular'}>{t('settings.themeColor.dark')}</Text>
            </Flex>
            <Flex direction={'column'} gap={'2'}>
                <Tooltip content={t('utils.tooltips.themeS')}>
                    <Box className={`themeColor ${currentTheme === 'system' ? 'selected' : ''}`} style={{ '--color-bg': '' + colorHexTheme } as React.CSSProperties} onClick={() => handleThemeChange('system')}>
                        <img src={themeSystem} alt="System Theme" />
                    </Box>
                </Tooltip>
                <Text color="gray" size="2" weight={'regular'}>{t('settings.themeColor.system')}</Text>
            </Flex>
        </Flex>
    );
};

export default ThemeSettings;
