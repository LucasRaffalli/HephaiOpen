import { Flex, Select, Tooltip } from '@radix-ui/themes';
import { t } from 'i18next';
import React from 'react';
import { getAvailableLanguages } from '@/utils/i18nUtils';
interface LanguageSettingsProps {
    currentLanguage: string;
    handleChangeLanguage: (language: string) => void;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({ currentLanguage, handleChangeLanguage }) => {
    const languages = getAvailableLanguages();

    return (
        <Flex direction="row" gap="4" width="100%" height="fit-content" wrap="wrap">
            <Tooltip content={t('utils.tooltips.language')}>
                <Select.Root value={currentLanguage} onValueChange={handleChangeLanguage} size="2">
                    <Select.Trigger />
                    <Select.Content position="popper">
                        {languages.map((langCode) => (
                            <Select.Item key={langCode} className="btnCursor" value={langCode}>
                                {t(`settings.language.lang.${langCode}`)}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </Tooltip>
        </Flex>
    );
};

export default LanguageSettings;