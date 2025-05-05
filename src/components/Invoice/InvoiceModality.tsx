import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Flex, Box, Separator, Button, Tooltip } from "@radix-ui/themes";
import { t } from "i18next";
import { useModalities } from "@/context/ModalitiesContext";

const InvoiceModality: React.FC = () => {
    const { text1, text2, isEnabled, updateText, toggleModalities } = useModalities();
    const [isFocused, setIsFocused] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isActive, setIsActive] = useState(!isEnabled);

    useEffect(() => {
        setIsActive(!isEnabled);
    }, [isEnabled]);

    const handleIconClick = () => {
        setIsActive((prev) => !prev);
        toggleModalities();
    };

    return (
        <Flex direction="column" width="100%" gap="3">
            <Flex overflow={"hidden"} className={`packModalitis ${isFocused ? "focused" : ""}`} >
                <Tooltip content={t('utils.tooltips.modalities')} side="right">
                    <textarea value={text1} onChange={(e) => updateText("text1", e.target.value)} placeholder={t('utils.tooltips.modalities')} rows={4} className="textAreaCustom" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
                </Tooltip>
                <Box className="iconTextArea" onClick={handleIconClick}>
                    <Button style={{ background: "none" }} variant="soft" className='btnCursor'>
                        {isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                </Box>
            </Flex>
            <Flex width={"100%"} align={"center"}>
                <Separator orientation="horizontal" size={"4"} />
            </Flex>
            <Flex overflow={"hidden"} className={`packModalitis ${isFocused2 ? "focused" : ""}`}>
                <Tooltip content={t('utils.tooltips.modalities')} side="right">
                    <textarea value={text2} onChange={(e) => updateText("text2", e.target.value)} placeholder={t('utils.tooltips.modalities')} className="textAreaCustom" onFocus={() => setIsFocused2(true)} onBlur={() => setIsFocused2(false)} />
                </Tooltip>
                <Box className="iconTextArea" onClick={handleIconClick}>
                    <Button style={{ background: "none" }} variant="soft" className='btnCursor'>
                        {isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                </Box>
            </Flex>
        </Flex>
    );
};

export default InvoiceModality;
