import { Flex, Box, Button, TextField, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { Lock, PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDynamicTableContext } from "@/context/DynamicTableContext";

const DynamicColumnEditor = () => {
    const { t } = useTranslation();
    const {
        columns: dynamicColumns,
        handleEditColumn,
        removeColumn,
        addColumn,
        maxColumns
    } = useDynamicTableContext();

    return (
        <Flex direction="column" width="100%" gap="3">
            <TextField.Root placeholder={t('features.invoice.tableItem.product')} size="2" disabled>
                <TextField.Slot side="right">
                    <Lock size={14} />
                </TextField.Slot>
            </TextField.Root>

            {dynamicColumns.map((col, index) => (
                <Box key={col.dataKey} width="100%">
                    <Tooltip content={t('utils.tooltips.editColumns')} side="left">
                        <TextField.Root placeholder={t('features.invoice.tableItem.columnPlaceholder')} size="2" value={col.header} onChange={(e) => handleEditColumn(index, e.target.value)}>
                            <TextField.Slot side="right">
                                <Tooltip content={t('utils.tooltips.deleteColumns')} side="left">
                                    <IconButton onClick={() => removeColumn(index)} variant="ghost" size="1" className="btnCursor">
                                        <Trash2Icon size={14} />
                                    </IconButton>
                                </Tooltip>
                            </TextField.Slot>
                        </TextField.Root>
                    </Tooltip>
                </Box>
            ))}
            <TextField.Root placeholder={t('features.invoice.tableItem.total')} size="2" disabled>
                <TextField.Slot side="right">
                    <Lock size={14} />
                </TextField.Slot>
            </TextField.Root>

            <Tooltip content={t('utils.tooltips.addColumns')} side="left">
                <Button className="btnCursor" variant="soft" onClick={addColumn} disabled={dynamicColumns.length >= maxColumns}>
                    <PlusIcon size={16} />
                    <Text size="2">
                        {t('buttons.addColumns')} ({dynamicColumns.length}/{maxColumns})
                    </Text>
                </Button>
            </Tooltip>
        </Flex>
    );
};

export default DynamicColumnEditor;
