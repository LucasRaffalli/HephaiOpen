import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { useTheme } from '../../utils/ThemeContext';
import { AspectRatio, Avatar, Box, Button, Flex, Heading, IconButton, Select, Separator, Skeleton, Text, TextField, Tooltip } from '@radix-ui/themes';
import { AccentColor, CompanyInfo } from '@/type/hephai'
import { useTranslation } from 'react-i18next';
import '@/css/setting.css'
import themeLight from '/img/themeLight.png'
import themeDark from '/img/themeDark.png'
import themeSystem from '/img/themeSystem.png'
import { exportData } from '../../utils/exportData';
import { importData } from '../../utils/importData';
import i18n from '@/i18n';
import { ToastContainer, toast } from 'react-toastify';
import { DotsHorizontalIcon, EyeClosedIcon, EyeOpenIcon, MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { getAccentColorHex, colorMap } from '../../utils/getAccentColorHex';


export default function Settings() {

  const loadVisibilityPreferences = () => {
    const savedVisibility = localStorage.getItem('visibilityPreferences');
    return savedVisibility ? JSON.parse(savedVisibility) : {
      companyName: true,
      authorAddress: false,
      authorPhone: false,
      authorEmail: false,
      siret: false
    };
  };
  const [visibility, setVisibility] = useState(loadVisibilityPreferences);

  const { toggleTheme, accentColor, setAccentColor } = useTheme();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => { const savedMode = localStorage.getItem('isDarkMode'); return savedMode ? JSON.parse(savedMode) : false; });
  const firstJoinDate = localStorage.getItem("dateJoins");
  const [imageSrc, setImageSrc] = useState<string | null>(localStorage.getItem('profileImage') || null);

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    authorCompanyName: '',
    authorAddress: '',
    authorPhone: '',
    authorEmail: '',
    siret: '',
  });

  const colorHexTheme = getAccentColorHex();
  const gradientBackground = isDarkMode
    ? `linear-gradient(180deg, ${colorHexTheme}, transparent 92%)` // Dégradé sombre
    : `linear-gradient(180deg, ${colorHexTheme}, transparent)`; // Dégradé clair


  const handleExportJson = () => {
    try {
      const settingsData = {
        theme: isDarkMode ? 'true' : 'false',
        accentColor: accentColor,
        companyInfo: companyInfo,
        language: localStorage.getItem('language') || 'en',
        dateJoins: localStorage.getItem('dateJoins'),
        profileImage: localStorage.getItem('profileImage'),
        visibilityPreferences: visibility
      };

      exportData([settingsData], 'json');

      toast.success(t('toast.export.success'), {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? 'dark' : 'light',
      });
    } catch (error) {
      console.error('Erreur lors de l\'exportation des données:', error);
      toast.error(t('toast.export.error'), {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? 'dark' : 'light',
      });
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
          localStorage.setItem('isDarkMode', settings.theme === 'dark' ? 'true' : 'false');
          localStorage.setItem('accentColor', settings.accentColor);
          localStorage.setItem('language', settings.language);
          toast.success(t('toast.import.success'), {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDarkMode ? 'dark' : 'light',
          });
        } else {
          console.error('Le fichier importé n\'est pas au format attendu.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'importation du fichier JSON:', error);
        toast.error(t('toast.import.error'), {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? 'dark' : 'light',
        });
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
    toast.success(t('toast.saveInfo.success'), {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode ? 'dark' : 'light',
    });
  };

  if (!localStorage.getItem("dateJoins")) {
    if (!localStorage.getItem("dateJoins")) {
      const today = new Date();

      // Utilise i18n pour obtenir le mois et le transformer en majuscules
      const day = String(today.getDate()).padStart(2, "0");
      const month = i18n.t(`date.months_short.${today.getMonth()}`).toUpperCase();
      const year = today.getFullYear();

      // Formate la date au format "YYYY-MMM-DD"
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
        localStorage.setItem('profileImage', imageUrl); // Stocke l'image dans le localStorage
      };
      reader.readAsDataURL(file);
    }
  };


  const saveVisibilityPreferences = (newVisibility: typeof visibility) => {
    localStorage.setItem('visibilityPreferences', JSON.stringify(newVisibility));
  };

  const toggleVisibility = (field: keyof typeof visibility) => {
    setVisibility((prev: any) => {
      const newVisibility = { ...prev, [field]: !prev[field] };
      saveVisibilityPreferences(newVisibility);
      return newVisibility;
    });
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    const maskedLocalPart = localPart.replace(/./g, '*');
    return `${maskedLocalPart}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    const phoneNumber = phone.replace(/\D/g, '');
    const visiblePart = phoneNumber.slice(-4);
    const maskedPart = phoneNumber.slice(0, -4).replace(/\d/g, '*');

    return `${maskedPart}${visiblePart}`;
  };


  return (
    <Flex width={'100%'} className='test2' height={'100%'}>
      <Box>


        <Heading mb={'9'} >{t('setting.title')}</Heading>
        <Flex direction={'row'} className='test'>
          <Flex direction={'column'} gap={'9'} ml={'2'}>

            <Flex direction={'row'} gap={"9"} >
              <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                <Text size={'5'} weight={'medium'}>{t('setting.informationUser.title')}</Text>
                <Text color="gray" size="2" weight={'regular'}>{t('setting.informationUser.subtitle')}</Text>
              </Flex>
              <Flex direction={'row'} gap={'4'} width={'100%'} height={'fit-content'} wrap={'wrap'}>
                <Flex gap="2">
                  <Avatar size={'8'} variant={"soft"} fallback="heph" src={imageSrc || ''} />
                </Flex>
                <Tooltip content={t('utils.tooltips.btnimg')}>
                  <Button color={AccentColor as any} variant="soft" className='btncursor' size={'3'} onClick={() => imageFileInputRef.current?.click()}>
                    <Text size="2" weight={'regular'}>{t('utils.img.btn')}</Text>
                    <input key="inputForImage" type="file" accept="image/*" ref={imageFileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>

            <Flex direction={'row'} gap={"9"} >
              <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                <Text size={'5'} weight={'medium'}>{t('setting.informationUser.title')}</Text>
                <Text color="gray" size="2" weight={'regular'}>{t('setting.informationUser.subtitle')}</Text>
              </Flex>

              <Flex direction="row" gap="4" width="50%" height="fit-content" wrap="wrap">
                <Box maxWidth="250px">
                  <TextField.Root placeholder="CompanyName" name="authorCompanyName" onChange={handleChange} value={companyInfo.authorCompanyName} size="2" type={visibility.companyName ? 'text' : 'password'}>
                    <TextField.Slot side={'right'}>
                      <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('companyName')}>
                        {visibility.companyName ? (
                          <EyeOpenIcon height="14" width="14" />
                        ) : (
                          <EyeClosedIcon height="14" width="14" />
                        )}
                      </IconButton>
                    </TextField.Slot>
                  </TextField.Root>
                </Box>
                <Box maxWidth="250px">
                  <TextField.Root placeholder="Adress" name="authorAddress" onChange={handleChange} value={companyInfo.authorAddress} size="2" type={visibility.authorAddress ? 'text' : 'password'}>
                    <TextField.Slot side={'right'}>
                      <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('authorAddress')}>
                        {visibility.authorAddress ? (
                          <EyeOpenIcon height="14" width="14" />
                        ) : (
                          <EyeClosedIcon height="14" width="14" />
                        )}
                      </IconButton>
                    </TextField.Slot>
                  </TextField.Root>
                </Box>
                <Box maxWidth="250px">
                  <TextField.Root placeholder="Phone" name="authorPhone" onChange={handleChange} value={visibility.authorPhone ? companyInfo.authorPhone : maskPhone(companyInfo.authorPhone)} size="2" type="tel">
                    <TextField.Slot side={'right'}>
                      <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('authorPhone')}>
                        {visibility.authorPhone ? (
                          <EyeOpenIcon height="14" width="14" />
                        ) : (
                          <EyeClosedIcon height="14" width="14" />
                        )}
                      </IconButton>
                    </TextField.Slot>
                  </TextField.Root>
                </Box>
                <Box maxWidth="250px">
                  <TextField.Root placeholder="Email" name="authorEmail" onChange={handleChange} value={visibility.authorEmail ? companyInfo.authorEmail : maskEmail(companyInfo.authorEmail)} size="2" type="email">
                    <TextField.Slot side={'right'}>
                      <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('authorEmail')}>
                        {visibility.authorEmail ? (
                          <EyeOpenIcon height="14" width="14" />
                        ) : (
                          <EyeClosedIcon height="14" width="14" />
                        )}
                      </IconButton>
                    </TextField.Slot>
                  </TextField.Root>
                </Box>
                <Box maxWidth="250px">
                  <TextField.Root placeholder="Siret" name="siret" onChange={handleChange} value={companyInfo.siret} size="2" type={visibility.siret ? 'text' : 'password'}>
                    <TextField.Slot side={'right'}>
                      <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('siret')}>
                        {visibility.siret ? (
                          <EyeOpenIcon height="14" width="14" />
                        ) : (
                          <EyeClosedIcon height="14" width="14" />
                        )}
                      </IconButton>
                    </TextField.Slot>
                  </TextField.Root>
                </Box>
                <Tooltip content={t('utils.tooltips.savedata')}>
                  <Button color={AccentColor as any} variant="soft" className='btncursor' size={'3'} onClick={handleSave}>
                    <Text size="2" weight={'regular'}>{t('utils.savedata')}</Text>
                  </Button>
                </Tooltip>
              </Flex>

            </Flex>
            <Flex direction={'row'} gap={"9"} >
              <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                <Text size={'5'} weight={'medium'}>{t('setting.accentColor.title')}</Text>
                <Text color="gray" size="2" weight={'regular'}>{t('setting.accentColor.subtitle')}</Text>
              </Flex>
              <Flex direction={'row'} gap={'4'} minWidth={'20%'} maxWidth={'50%'} height={'fit-content'} wrap={'wrap'}>
                {Object.entries(colorMap).map(([name, colorCode]) => (
                  <Tooltip content={t(`utils.tooltips.colors.${name}`)} key={name}>
                    <Box height={'32px'} width={'32px'} key={name} onClick={() => setAccentColor(name as AccentColor)} className={`${'accentColor__btn'} ${accentColor === name ? 'selected' : ''}`} style={{ '--color-bg': '#' + colorCode, } as React.CSSProperties} aria-label={name} />
                  </Tooltip>
                ))}
              </Flex>

            </Flex>
            <Flex direction={'row'} gap={"9"} >
              <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                <Text size={'5'} weight={'medium'}>{t('setting.themeColor.title')}</Text>
                <Text color="gray" size="2" weight={'regular'}>{t('setting.themeColor.subtitle')}</Text>
              </Flex>
              <Flex direction={'row'} gap={'4'} width={'100%'} height={'fit-content'} wrap={'wrap'}>
                <Flex direction={'column'} gap={'2'}>
                  <Tooltip content={t('utils.tooltips.themeL')}>
                    <Box className={`themeColor ${!isDarkMode ? 'selected' : ''}`} style={{ '--color-bg': '' + colorHexTheme } as React.CSSProperties} onClick={() => toggleTheme('light')}>
                      <img src={themeLight} alt="Light Theme" />
                    </Box>
                  </Tooltip>
                  <Text color="gray" size="2" weight={'regular'} as={'label'}>{t('setting.themeColor.light')}</Text>

                </Flex>
                <Flex direction={'column'} gap={'2'}>
                  <Tooltip content={t('utils.tooltips.themeD')}>
                    <Box className={`themeColor ${isDarkMode ? 'selected' : ''}`} style={{ '--color-bg': '' + colorHexTheme } as React.CSSProperties} onClick={() => toggleTheme('dark')}>
                      <img src={themeDark} alt="Dark Theme" />
                    </Box>
                  </Tooltip>
                  <Text color="gray" size="2" weight={'regular'}>{t('setting.themeColor.dark')}</Text>

                </Flex>
              </Flex>
            </Flex>
            <Flex direction={'row'} gap={"9"} >
              <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                <Text size={'5'} weight={'medium'}>{t('setting.language.title')}</Text>
                <Text color="gray" size="2" weight={'regular'}>{t('setting.language.subtitle')}</Text>
              </Flex>

              <Tooltip content={t('utils.tooltips.lang')}>
                <Select.Root defaultValue={i18n.language} onValueChange={handleChangeLanguage} size={"2"}>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item className='btncursor' value="en">{t('setting.language.lang.en')}</Select.Item>
                    <Select.Item className='btncursor' value="fr">{t('setting.language.lang.fr')}</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Tooltip>
            </Flex>
            <Flex direction={'row'} gap={"9"} >
              <Flex direction={"column"} minWidth={'250px'} maxWidth={'250px'}>
                <Text size={'5'} weight={'medium'}>{t('setting.hephai.title')}</Text>
                <Text color="gray" size="2" weight={'regular'}>{t('setting.hephai.subtitle')}</Text>
              </Flex>
              <Flex direction={'row'} gap={'4'} width={'100%'} height={'fit-content'} wrap={'wrap'}>
                <Tooltip content={t('utils.tooltips.exportjson')}>
                  <Button color={AccentColor as any} variant="soft" size={'3'} className='btncursor' onClick={handleExportJson}>
                    <Text size="2" weight={'regular'}>{t('setting.hephai.export.json')}</Text>
                  </Button>
                </Tooltip>
                <Tooltip content={t('utils.tooltips.importjson')}>
                  <Button color={'green'} variant="soft" size={'3'} className='btncursor' onClick={() => fileInputRef.current?.click()}>
                    <input key="inputForFile" ref={fileInputRef} type="file" accept=".json" onChange={handleImportSettings} style={{ display: 'none' }} />
                    <Text size="2" weight={'regular'}>{t('setting.hephai.import.title')}</Text>
                  </Button>
                </Tooltip>

              </Flex>
            </Flex>
          </Flex>
          {/* CARD */}
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
          <Text size={'8'} weight={'bold'} className={visibility.companyName ? 'visible-field' : 'password-field'}>{companyInfo.authorCompanyName}</Text>
          <Text size={'5'} className={visibility.authorAddress ? 'visible-field' : 'password-field'}>{companyInfo.authorAddress}</Text>
          <Text size={'5'} className={visibility.authorPhone ? 'visible-field' : 'password-field'}>{companyInfo.authorPhone}</Text>
          <Text size={'5'} className={visibility.authorEmail ? 'visible-field' : 'password-field'}>{companyInfo.authorEmail}</Text>
          <Text size={'5'} highContrast className={visibility.siret ? 'visible-field' : 'password-field'}>{companyInfo.siret}</Text>
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
