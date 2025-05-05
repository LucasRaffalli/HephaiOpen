import { Avatar, Button, Flex, Tooltip, Text } from '@radix-ui/themes';
import { t } from 'i18next';
import React, { useRef, useState } from 'react';

interface ProfileImageProps {
    imageSrc: string | null;
    handleImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageDelete?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ imageSrc, handleImageChange, handleImageDelete }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const validateAndHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.includes('png')) {
                setErrorMsg(t('errors.png_only'));
                event.target.value = '';
                return;
            }

            const img = new Image();
            img.onload = () => {
                if (img.width < 512 || img.height < 512) {
                    setErrorMsg(t('errors.image_size_min', { size: '512x512' }));
                    event.target.value = '';
                } else {
                    setErrorMsg('');
                    handleImageChange?.(event);
                }
            };
            img.src = URL.createObjectURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Flex direction={'column'} gap={'2'} width={'100%'}>
            <Flex direction={'row'} gap={'4'} width={'100%'} height={'fit-content'} align={'center'}>
                <Avatar size={'8'} variant={"soft"} fallback="heph" src={imageSrc || ''} alt="Profile" style={{ background: "var(--gray-a8)", padding: "0.25rem" }} />
                <Flex direction={'column'} gap={'2'}>
                    <Tooltip content={t('utils.tooltips.btnimg')}>
                        <Button variant="soft" className='btnCursor' size={'3'} onClick={handleButtonClick}>
                            <Text size="2" weight={'regular'}>{t('buttons.upload.image')}</Text>
                            <input ref={fileInputRef} type="file" accept="image/png" onChange={validateAndHandleChange} style={{ display: 'none' }} />
                        </Button>
                    </Tooltip>
                    {imageSrc && handleImageDelete && (
                        <Tooltip content={t('utils.tooltips.deletebtnimg')} >
                            <Button variant="soft" color="red" className='btnCursor' size={'3'} onClick={handleImageDelete}>
                                <Text size="2" weight={'regular'}>{t('buttons.delete.image')}</Text>
                            </Button>
                        </Tooltip>
                    )}
                </Flex>
            </Flex>
            {errorMsg && <Text size="2" color="red">{errorMsg}</Text>}
        </Flex>
    );
};

export default ProfileImage;
