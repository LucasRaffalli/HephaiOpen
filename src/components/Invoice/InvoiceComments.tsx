import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Flex, Box, Button, Tooltip } from "@radix-ui/themes";
import { t } from "i18next";

interface InvoiceCommentsProps {
    commentsText: string;
    updateText: (text: any) => void;
    onClick: () => void;
}

const InvoiceComments: React.FC<InvoiceCommentsProps> = ({ commentsText, updateText, onClick }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const handleIconClick = () => { setIsActive((prev) => !prev); onClick(); };
    return (
        <Flex direction="column" width="100%" gap="3">
            <Flex overflow={"hidden"} className={`packModalitis ${isFocused ? "focused" : ""}`} >
                <Tooltip content={t('utils.tooltips.comment')}>
                    <textarea value={commentsText} onChange={(e) => updateText(e.target.value)} placeholder={t('utils.tooltips.comment')} rows={4} className="textAreaCustom" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
                </Tooltip>
                <Box className="iconTextArea" onClick={() => handleIconClick()}>
                    <Button style={{ background: "none" }} variant="soft" className='btncursor'>
                        {isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                </Box>
            </Flex>

        </Flex>
    );
};

export default InvoiceComments;
