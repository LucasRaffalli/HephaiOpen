import React, { useState } from "react";
import { Eye, EyeClosedIcon, EyeOff } from "lucide-react";
import { Flex, Box, Separator, Button, Tooltip } from "@radix-ui/themes";
import { t } from "i18next";

interface InvoiceModalityProps {
    text1: string;
    text2: string;
    updateText: (field: "text1" | "text2", value: string) => void;
    onClick: () => void;
}

const InvoiceModality: React.FC<InvoiceModalityProps> = ({ text1, text2, updateText, onClick }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const handleIconClick = () => { setIsActive((prev) => !prev); onClick(); };
    return (
        <Flex direction="column" width="100%" gap="3">
            <Flex overflow={"hidden"} className={`packModalitis ${isFocused ? "focused" : ""}`} >

                <Tooltip content={t('utils.tooltips.modalities')}>
                    <textarea value={text1} onChange={(e) => updateText("text1", e.target.value)} placeholder={t('utils.tooltips.modalities')} rows={4} className="textAreaCustom" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
                </Tooltip>
                <Box className="iconTextArea" onClick={() => handleIconClick()}>
                    <Button style={{ background: "none" }}  variant="soft" className='btncursor'>
                        {isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                </Box>
            </Flex>
            <Flex width={"100%"} align={"center"}>
                <Separator orientation="horizontal" size={"4"} />
            </Flex>
            <Flex overflow={"hidden"} className={`packModalitis ${isFocused2 ? "focused" : ""}`}>
                <Tooltip content={t('utils.tooltips.modalities')}>
                    <textarea value={text2} onChange={(e) => updateText("text2", e.target.value)} placeholder={t('utils.tooltips.modalities')} className="textAreaCustom" onFocus={() => setIsFocused2(true)} onBlur={() => setIsFocused2(false)} />
                </Tooltip>
                <Box className="iconTextArea" onClick={() => handleIconClick()}>
                    <Button style={{ background: "none" }}  variant="soft" className='btncursor'>
                        {isActive ? <EyeClosedIcon size={18} /> : <Eye size={18} />}
                    </Button>
                </Box>
            </Flex>
        </Flex>
    );
};

export default InvoiceModality;
