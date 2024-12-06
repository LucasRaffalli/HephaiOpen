import { AccentColor } from '@/type/hephai';
import { Avatar, Button, Flex, Tooltip, Text } from '@radix-ui/themes';
import { t } from 'i18next';
import React, { useRef } from 'react';

interface ProfileImageProps {
    imageSrc: string | null;
    handleImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ imageSrc, handleImageChange }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    return (
        <Flex direction={'row'} gap={'4'} width={'100%'} height={'fit-content'} wrap={'wrap'}>
            <Avatar size={'8'} variant={"soft"} fallback="heph" src={imageSrc || 'placeholder.png'} alt="Profile" />
            <Tooltip content={t('utils.tooltips.btnimg')}>
                <Button variant="soft" className='btncursor' size={'3'} onClick={handleButtonClick}>
                    <Text size="2" weight={'regular'}>{t('utils.img.btn')}</Text>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </Button>
            </Tooltip>
        </Flex>
    );
};

export default ProfileImage;
