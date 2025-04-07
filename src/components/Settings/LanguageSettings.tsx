import { Flex, Select, Tooltip } from '@radix-ui/themes';
import { t } from 'i18next';
import React from 'react';

interface LanguageSettingsProps {
    currentLanguage: string;
    handleChangeLanguage: (language: string) => void;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({ currentLanguage, handleChangeLanguage }) => {
    return (
        <Flex direction={'row'} gap={'4'} width={'100%'} height={'fit-content'} wrap={'wrap'} >
            <Tooltip content={t('utils.tooltips.language')}>
                <Select.Root value={currentLanguage} onValueChange={handleChangeLanguage} size={"2"}>
                    <Select.Trigger />
                    <Select.Content position="popper">
                        <Select.Item className='btncursor' value="en">{t('settings.language.lang.en')}</Select.Item>
                        <Select.Item className='btncursor' value="fr">{t('settings.language.lang.fr')}</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Tooltip>
        </Flex>
    );
};

export default LanguageSettings;