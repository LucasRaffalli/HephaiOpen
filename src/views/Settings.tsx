import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { useTheme } from '@/utils/ThemeContext';
import { AspectRatio, Avatar, Box, Button, Flex, Heading, IconButton, Select, Separator, Skeleton, Text, TextField, Tooltip } from '@radix-ui/themes';
import { AccentColor, CompanyInfo, Client } from '@/types/hephai'
import { useTranslation } from 'react-i18next';
import '@/css/setting.css'
import { exportData } from '@/utils/exportData';
import i18n from '@/i18n';
import { ToastContainer, toast } from 'react-toastify';
import { getAccentColorHex, colorMap } from '@/utils/getAccentColorHex';
import LanguageSettings from '@/components/Settings/LanguageSettings';
import UserInformation from '@/components/Settings/UserInformation';
import ProfileImage from '@/components/Settings/ProfileImage';
import ThemeSettings from '@/components/Settings/ThemeSettings';
import { useDarkMode } from '@/hooks/useDarkMode';
import Tva from '@/components/Settings/Tva';
import { motion } from "motion/react"
import PriceUnit from '@/components/Settings/PriceUnit';

export default function Settings() {
    const { t } = useTranslation();

    const loadVisibilityPreferences = () => {
        const defaultVisibility = {
            authorCompanyName: true,
            authorAddress: false,
            authorPhone: false,
            authorEmail: false,
            siret: false
        };

        const savedVisibility = localStorage.getItem('visibilityPreferences');
        if (!savedVisibility) {
            localStorage.setItem('visibilityPreferences', JSON.stringify(defaultVisibility));
            return defaultVisibility;
        }

        return { ...defaultVisibility, ...JSON.parse(savedVisibility) };
    };

    const [visibility, setVisibility] = useState(loadVisibilityPreferences);
    const { toggleTheme, accentColor, setAccentColor } = useTheme();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const firstJoinDate = localStorage.getItem("dateJoins");
    const [imageSrc, setImageSrc] = useState<string | null>(localStorage.getItem('profileImage') || null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ authorCompanyName: '', authorAddress: '', authorPhone: '', authorEmail: '', siret: '', });
    const colorHexTheme = getAccentColorHex();
    const gradientBackground = isDarkMode ? `linear-gradient(180deg, ${colorHexTheme}, transparent 92%)` : `linear-gradient(180deg, ${colorHexTheme}, transparent)`;
    const [priceUnit, setPriceUnit] = useState(localStorage.getItem('priceUnit') || 'euro');
    const [tva, setTva] = useState(localStorage.getItem('tva') || '0');
    const [clients, setClients] = useState<Client[]>(() => {
        const storedClients = localStorage.getItem('clients');
        return storedClients ? JSON.parse(storedClients) : [];
    });

    const [settingsData, setSettingsData] = useState(() => ({
        theme: isDarkMode ? 'true' : 'false',
        accentColor: accentColor,
        companyInfo: companyInfo,
        language: localStorage.getItem('language') || 'en',
        dateJoins: localStorage.getItem('dateJoins'),
        visibilityPreferences: visibility,
        clients: clients,
        profileImage: localStorage.getItem('profileImage')
    }));

    useEffect(() => {
        setSettingsData({
            theme: isDarkMode ? 'true' : 'false',
            accentColor: accentColor,
            companyInfo: companyInfo,
            language: localStorage.getItem('language') || 'en',
            dateJoins: localStorage.getItem('dateJoins'),
            visibilityPreferences: visibility,
            clients: clients,
            profileImage: localStorage.getItem('profileImage')
        });
    }, [isDarkMode, accentColor, companyInfo, visibility, clients]);

    const handleExportJson = () => {
        try {
            exportData([settingsData], 'json');
            toast.success(t('toast.export.success'), { autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: isDarkMode ? 'dark' : 'light', });
        } catch (error) {
            console.error('Erreur lors de l\'exportation des données:', error);
            toast.error(t('toast.export.error'), { autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: isDarkMode ? 'dark' : 'light', });
        }
    };

    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
    };

    const handleImportSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const text = await file.text();
            try {
                const importedSettings = JSON.parse(text);
                if (Array.isArray(importedSettings) && importedSettings.length > 0) {
                    const settings = importedSettings[0];
                    if (settings.theme) {
                        toggleTheme(settings.theme === 'dark' ? 'dark' : 'light');
                    }
                    if (settings.accentColor) {
                        setAccentColor(settings.accentColor);
                    }
                    if (settings.language) {
                        i18n.changeLanguage(settings.language);
                    }
                    if (settings.profileImage) {
                        setImageSrc(settings.profileImage);
                        localStorage.setItem('profileImage', settings.profileImage);
                    }
                    if (settings.clients) {
                        setClients(settings.clients);
                        localStorage.setItem('clients', JSON.stringify(settings.clients));
                    }
                    localStorage.setItem('isDarkMode', settings.theme === 'dark' ? 'true' : 'false');
                    localStorage.setItem('accentColor', settings.accentColor);
                    localStorage.setItem('language', settings.language);
                    toast.success(t('toast.import.success'), { autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: isDarkMode ? 'dark' : 'light', });
                } else {
                    console.error('Le fichier importé n\'est pas au format attendu.');
                }
            } catch (error) {
                console.error('Erreur lors de l\'importation du fichier JSON:', error);
                toast.error(t('toast.import.error'), { autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: isDarkMode ? 'dark' : 'light', });
            }
        }
    };
    useEffect(() => {
        const savedCompanyInfos = localStorage.getItem('companyInfos');
        if (savedCompanyInfos) {
            const parsedCompanyInfos: CompanyInfo[] = JSON.parse(savedCompanyInfos);
            if (parsedCompanyInfos.length > 0) {
                setCompanyInfo(parsedCompanyInfos[parsedCompanyInfos.length - 1]);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSave = () => {
        localStorage.setItem('companyInfos', JSON.stringify([companyInfo]));
        toast.success(t('toast.saveInfo.success'), { autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: isDarkMode ? 'dark' : 'light', });
    };

    const handleSaveVisibility = (newVisibility: typeof visibility) => {
        setVisibility(newVisibility);
        localStorage.setItem('visibilityPreferences', JSON.stringify(newVisibility));
    };

    if (!localStorage.getItem("dateJoins")) {
        if (!localStorage.getItem("dateJoins")) {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, "0");
            const month = i18n.t(`date.months_short.${today.getMonth()}`).toUpperCase();
            const year = today.getFullYear();
            const formattedDate = `${month} ${day}, ${year}`;
            localStorage.setItem("dateJoins", formattedDate);
        }

    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setImageSrc(imageUrl);
                localStorage.setItem('profileImage', imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleVisibility = (field: string) => {
        const newVisibility = {
            ...visibility,
            [field]: !visibility[field]
        };
        setVisibility(newVisibility);
        localStorage.setItem('visibilityPreferences', JSON.stringify(newVisibility));
    };

    const maskEmail = (email: string) => {
        if (!email) return '••••••••••';
        const [localPart, domain] = email.split('@');
        if (!domain) return '••••••••••';
        const maskedLocalPart = '•'.repeat(Math.min(localPart.length, 6));
        return `${maskedLocalPart}@${domain}`;
    };

    const maskPhone = (phone: string) => {
        if (!phone) return '••••••••••';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length < 4) return '••••••••••';
        return '•'.repeat(cleaned.length - 4) + cleaned.slice(-4);
    };

    const maskSiret = (siret: string) => {
        if (!siret) return '••••••••••';
        const cleaned = siret.replace(/\D/g, '');
        if (cleaned.length < 5) return '••••••••••';
        return '•'.repeat(cleaned.length - 4) + cleaned.slice(-4);
    };

    const maskCompanyName = (name: string) => {
        if (!name || name.trim().length === 0) return '••••••••••';
        return '•'.repeat(10);
    };

    const handlePriceUnitChange = (unit: string) => {
        const symbol = unit === 'euro' ? '€' : unit === 'dollar' ? '$' : '£';
        setPriceUnit(symbol);
        localStorage.setItem('priceUnit', symbol);
    };


    useEffect(() => {
        const savedVisibility = localStorage.getItem('visibilityPreferences');
        if (savedVisibility) {
            setVisibility(JSON.parse(savedVisibility));
        }
    }, []);

    const containerLeftVariants = {
        hidden: {
            x: -500,
            opacity: 0,
            scale: 0.95,
            skew: 2
        },
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            skew: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const featureVariants = {
        hidden: {
            x: -30,
            opacity: 0,
            scale: 0.95
        },
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
                mass: 0.8
            }
        }
    };

    return (
        <Flex width={'100%'} className='test2' height={'100%'} style={{ overflow: 'hidden' }}>
            <Box width={'100%'} height={'100%'} style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <Heading mb={'9'} className="sticky-title">{t('settings.title')}</Heading>
                <Flex direction={'row'} className='test'>
                    <motion.div
                        variants={containerLeftVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Flex direction={'column'} gap={'9'} ml={'2'}>
                            <motion.div variants={featureVariants}>
                                <Flex direction={'row'} gap={"9"} >
                                    <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                                        <Text size={'5'} weight={'medium'}>{t('settings.informationUser.title')}</Text>
                                        <Text color="gray" size="2" weight={'regular'}>{t('settings.informationUser.subtitle')}</Text>
                                    </Flex>
                                    <ProfileImage imageSrc={imageSrc} handleImageChange={handleImageChange} />
                                </Flex>
                            </motion.div>

                            <motion.div variants={featureVariants}>
                                <Flex direction={'row'} gap={"9"} >
                                    <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                                        <Text size={'5'} weight={'medium'}>{t('settings.informationUser.title')}</Text>
                                        <Text color="gray" size="2" weight={'regular'}>{t('settings.informationUser.subtitle')}</Text>
                                    </Flex>
                                    <UserInformation companyInfo={companyInfo} handleChange={handleChange} handleSave={handleSave} buttonSize='140px' visibility={visibility} onToggleVisibility={toggleVisibility} />
                                </Flex>
                            </motion.div>

                            <motion.div variants={featureVariants}>
                                <Flex direction={'row'} gap={"9"} >
                                    <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                                        <Text size={'5'} weight={'medium'}>{t('settings.accentColor.title')}</Text>
                                        <Text color="gray" size="2" weight={'regular'}>{t('settings.accentColor.subtitle')}</Text>
                                    </Flex>
                                    <Flex direction={'row'} gap={'4'} minWidth={'20%'} maxWidth={'50%'} height={'fit-content'} wrap={'wrap'}>
                                        {Object.entries(colorMap).map(([name, colorCode]) => (
                                            <Tooltip content={t(`utils.tooltips.colors.${name}`)} key={name}>
                                                <Box height={'32px'} width={'32px'} key={name} onClick={() => setAccentColor(name as AccentColor)} className={`${'accentColor__btn'} ${accentColor === name ? 'selected' : ''}`} style={{ '--color-bg': '#' + colorCode, } as React.CSSProperties} aria-label={name} />
                                            </Tooltip>
                                        ))}
                                    </Flex>
                                </Flex>
                            </motion.div>

                            <motion.div variants={featureVariants}>
                                <Flex direction={'row'} gap={"9"} >
                                    <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                                        <Text size={'5'} weight={'medium'}>{t('settings.themeColor.title')}</Text>
                                        <Text color="gray" size="2" weight={'regular'}>{t('settings.themeColor.subtitle')}</Text>
                                    </Flex>
                                    <ThemeSettings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                                </Flex>
                            </motion.div>

                            <motion.div variants={featureVariants}>
                                <Flex direction={'row'} gap={"9"} >
                                    <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                                        <Text size={'5'} weight={'medium'}>{t('settings.language.title')}</Text>
                                        <Text color="gray" size="2" weight={'regular'}>{t('settings.language.subtitle')}</Text>
                                    </Flex>
                                    <LanguageSettings currentLanguage={i18n.language} handleChangeLanguage={handleChangeLanguage} />
                                </Flex>
                            </motion.div>

                            <motion.div variants={featureVariants}>
                                <Flex direction={'row'} gap={"9"} >
                                    <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                                        <Text size={'5'} weight={'medium'}>{t('settings.priceUnit.title')}</Text>
                                        <Text color="gray" size="2" weight={'regular'}>{t('settings.priceUnit.subtitle')}</Text>
                                    </Flex>
                                    <PriceUnit />
                                </Flex>
                            </motion.div>

                            <motion.div variants={featureVariants}>
                                <Flex direction={'row'} gap={"9"}>
                                    <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                                        <Text size={'5'} weight={'medium'}>{t('settings.tva.title')}</Text>
                                        <Text color="gray" size="2" weight={'regular'}>{t('settings.tva.subtitle')}</Text>
                                    </Flex>
                                    <Tva valueTva={tva} />
                                </Flex>
                            </motion.div>

                            <motion.div variants={featureVariants}>
                                <Flex direction={'row'} gap={"9"} >
                                    <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                                        <Text size={'5'} weight={'medium'}>{t('settings.hephai.title')}</Text>
                                        <Text color="gray" size="2" weight={'regular'}>{t('settings.hephai.subtitle')}</Text>
                                    </Flex>
                                    <Flex direction={'row'} gap={'4'} width={'100%'} height={'fit-content'} wrap={'wrap'}>
                                        <Tooltip content={t('utils.tooltips.exportjson')}>
                                            <Button color={AccentColor as any} variant="soft" size={'3'} className='btncursor' onClick={handleExportJson}>
                                                <Text size="2" weight={'regular'}>{t('buttons.export.json')}</Text>
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={t('utils.tooltips.importjson')}>
                                            <Button color={'green'} variant="soft" size={'3'} className='btncursor' onClick={() => fileInputRef.current?.click()}>
                                                <input key="inputForFile" ref={fileInputRef} type="file" accept=".json" onChange={handleImportSettings} style={{ display: 'none' }} />
                                                <Text size="2" weight={'regular'}>{t('buttons.import.json')}</Text>
                                            </Button>
                                        </Tooltip>
                                    </Flex>
                                </Flex>
                            </motion.div>
                        </Flex>
                    </motion.div>
                </Flex>
            </Box >
            <ToastContainer position="bottom-right" />
            <Flex className='card' direction={'column'} p={'3'} style={{ background: gradientBackground }} gap={"4"} >
                <Flex>
                    <Avatar size={'8'} variant={"soft"} fallback="heph" src={imageSrc || ''} className='card__img' />
                    <Skeleton>
                    </Skeleton>
                </Flex>
                <Flex direction={'column'} className='effect__color' style={{ color: colorHexTheme }}>
                    <Text size={'8'} weight={'bold'}>
                        {companyInfo.authorCompanyName && (visibility.authorCompanyName ? companyInfo.authorCompanyName : maskCompanyName(companyInfo.authorCompanyName))}
                    </Text>
                    <Text size={'5'}>
                        {visibility.authorAddress ? companyInfo.authorAddress : '••••••••••'}
                    </Text>
                    <Text size={'5'}>
                        {visibility.authorPhone ? companyInfo.authorPhone : maskPhone(companyInfo.authorPhone)}
                    </Text>
                    <Text size={'5'}>
                        {visibility.authorEmail ? companyInfo.authorEmail : maskEmail(companyInfo.authorEmail)}
                    </Text>
                    <Text size={'5'} highContrast>
                        {visibility.siret ? companyInfo.siret : maskSiret(companyInfo.siret)}
                    </Text>
                </Flex>
                <Flex className='effect__color footer__container' justify={'between'} style={{ color: colorHexTheme }} width={"100%"} align={'center'}>
                    <Flex gap={"2"} style={{ border: `2px solid ${colorHexTheme}` }} height={'fit-content'} className='footer__container' >
                        <Text size={'2'} ml={'2'} weight={'bold'}>HEPH</Text>
                        <Box width={"26px"} style={{ backgroundColor: colorHexTheme }}></Box>
                        <Text size={'2'} mr={'2'} weight={"bold"} >{firstJoinDate}</Text>
                    </Flex>
                    <Box width={'20%'}>
                        <Text size={'4'} weight={"bold"} >{t('utils.hephai1')}</Text>
                    </Box>
                </Flex>
            </Flex>
        </Flex >
    )
}
