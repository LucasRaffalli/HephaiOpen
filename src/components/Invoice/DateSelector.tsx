import { Flex, Box, Button, Text, Tooltip } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DateSelectorProps {
    selectedDate: string;
    handleCustomDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isAutoDate: boolean;
    setIsAutoDate: (value: boolean) => void;
    setSelectedDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, handleCustomDate, isAutoDate, setIsAutoDate, setSelectedDate }) => {
    const { t } = useTranslation();

    const handleAutoDate = () => {
        setIsAutoDate(true);
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    useEffect(() => {
        if (isAutoDate) {
            const updateDate = () => {
                setSelectedDate(new Date().toISOString().split('T')[0]);
            };
            updateDate();
            const intervalId = setInterval(updateDate, 1000);
            return () => clearInterval(intervalId);
        }
    }, [isAutoDate, setSelectedDate]);

    return (
        <Flex direction="column" width="100%">
            <Flex mb="4" position="relative" display="flex" justify="between" overflow="hidden" className="button__date__container" p="1">
                <Tooltip content={t('utils.tooltips.date.today')}>
                    <Flex justify="center" onClick={handleAutoDate} className={`button__date ${isAutoDate ? "active" : ""}`} p="1">
                        <Text>
                            {t("features.invoice.date.today")}
                        </Text>
                    </Flex>
                </Tooltip>
                <Tooltip content={t('utils.tooltips.date.other')}>

                    <Flex justify="center" onClick={() => setIsAutoDate(false)} className={`button__date ${!isAutoDate ? "active" : ""}`} p="1">
                        <Text>
                            {t("features.invoice.date.otherDay")}
                        </Text>
                    </Flex>
                </Tooltip>
                <Box className="button__date__indicator" />
            </Flex>
            <Box width="100%">
                {isAutoDate ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
                        <Button disabled style={{ width: "100%" }}>{selectedDate}</Button>
                    </motion.div>
                ) : (
                    <motion.input type="date" value={selectedDate} onChange={handleCustomDate} className="datepicker" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }} />
                )}
            </Box>
        </Flex>
    );
};

export default DateSelector;
