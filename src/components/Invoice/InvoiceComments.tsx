import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Flex, Box, Button, Tooltip } from "@radix-ui/themes";
import { t } from "i18next";
import { useComments } from "@/context/CommentsContext";

const InvoiceComments: React.FC = () => {
    const { text, isEnabled, updateText, toggleComments } = useComments();
    const [isFocused, setIsFocused] = useState(false);
    const [isActive, setIsActive] = useState(!isEnabled);

    useEffect(() => {
        setIsActive(!isEnabled);
    }, [isEnabled]);

    const handleIconClick = () => {
        setIsActive((prev) => !prev);
        toggleComments();
    };

    return (
        <Flex direction="column" width="100%" gap="3">
            <Flex overflow={"hidden"} className={`packModalitis ${isFocused ? "focused" : ""}`} >
                <Tooltip content={t('utils.tooltips.comment')} side="left">
                    <textarea value={text} onChange={(e) => updateText(e.target.value)} placeholder={t('utils.tooltips.comment')} rows={4} className="textAreaCustom" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
                </Tooltip>
                <Box className="iconTextArea" onClick={handleIconClick}>
                    <Button style={{ background: "none" }} variant="soft" className='btnCursor'>
                        {isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                </Box>
            </Flex>
        </Flex>
    );
};

export default InvoiceComments;
