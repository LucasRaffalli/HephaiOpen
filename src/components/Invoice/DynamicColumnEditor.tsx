import { Flex, Box, Button, TextField, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { Lock, PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Column {
    dataKey: string;
    header: string;
}

interface DynamicColumnEditorProps {
    dynamicColumns: Column[];
    handleEditColumn: (index: number, value: string) => void;
    removeColumn: (index: number) => void;
    addDynamicColumn: () => void;
    maxColumns: number;
}

const DynamicColumnEditor: React.FC<DynamicColumnEditorProps> = ({ dynamicColumns, handleEditColumn, removeColumn, addDynamicColumn, maxColumns }) => {
    const { t } = useTranslation();

    return (
        <Flex direction="column" width="100%" gap="3">
            <TextField.Root placeholder={t('features.invoice.tableItem.product')} size="2" disabled>
                <TextField.Slot side="right">
                    <Lock size={14} />
                </TextField.Slot>
            </TextField.Root>

            {dynamicColumns.map((col, index) => (
                <Box key={col.dataKey} width="100%">
                    <TextField.Root placeholder="" size="2" value={col.header} onChange={(e) => handleEditColumn(index, e.target.value)}>
                        <TextField.Slot side="right">
                            <IconButton onClick={() => removeColumn(index)} variant="ghost" size="1" >
                                <Trash2Icon size={14} />
                            </IconButton>
                        </TextField.Slot>
                    </TextField.Root>
                </Box>
            ))}

            <TextField.Root placeholder={t('features.invoice.tableItem.total')} size="2" disabled>
                <TextField.Slot side="right">
                    <Lock size={14} />
                </TextField.Slot>
            </TextField.Root>
            <Tooltip content={t('utils.tooltips.addColumns')}>
                <Button className="btncursor" variant="soft" onClick={addDynamicColumn} disabled={dynamicColumns.length >= maxColumns}>
                    <PlusIcon size={16} />
                    <Text size="2" >{t('buttons.addColumns')} ( {dynamicColumns.length + 2}/{maxColumns + 2} )</Text>
                </Button>
            </Tooltip>
        </Flex>
    );
};

export default DynamicColumnEditor;
