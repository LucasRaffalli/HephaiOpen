import { useState } from 'react';
import { Lock, PlusIcon, Trash2Icon } from 'lucide-react';
import { Box, Button, Flex, IconButton, Text, TextField } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

interface Column {
    dataKey: string;
    header: string;
}

const InvoiceTable: React.FC = () => {
    const { t } = useTranslation();
    const [dynamicColumns, setDynamicColumns] = useState<Column[]>([]);

    const addDynamicColumn = () => {
        // Utiliser Date.now() pour générer un identifiant unique
        setDynamicColumns([...dynamicColumns, { 
            dataKey: `col-${Date.now()}`, 
            header: '' 
        }]);
    };

    const handleEditColumn = (index: number, value: string) => {
        const updatedColumns = [...dynamicColumns];
        updatedColumns[index].header = value;
        setDynamicColumns(updatedColumns);
    };

    const removeColumn = (index: number) => {
        const updatedColumns = dynamicColumns.filter((_, i) => i !== index);
        setDynamicColumns(updatedColumns);
    };

    return (

        <Flex direction="column" justify={'center'} align={'center'} width={"100%"}>
            <Flex direction="column" width="100%" gap="3">
                <TextField.Root placeholder={t('features.invoice.tableItem.product')} size="2" disabled>
                    <TextField.Slot side={"right"}>
                        <Lock size={14} />
                    </TextField.Slot>
                </TextField.Root>

                {dynamicColumns.map((col, index) => (
                    <Box key={col.dataKey} width={"100%"}>
                        <TextField.Root
                            placeholder=""
                            size="2"
                            value={col.header}
                            onChange={(e) => handleEditColumn(index, e.target.value)}>
                            <TextField.Slot side={'right'}>
                                <IconButton onClick={() => removeColumn(index)} variant="ghost" size={"1"}>
                                    <Trash2Icon size={14} />
                                </IconButton>
                            </TextField.Slot>
                        </TextField.Root>
                    </Box>
                ))}

                <TextField.Root placeholder="Total" size="2" disabled>
                    <TextField.Slot side={"right"}>
                        <Lock size={14} />
                    </TextField.Slot>
                </TextField.Root>

                <Button className='btnCursor' variant="soft" onClick={addDynamicColumn}>
                    <PlusIcon size={16} />
                    <Text size="2" weight="regular">{t('buttons.addColumns')}2</Text>
                </Button>
            </Flex>
        </Flex>
    );
};

export default InvoiceTable;
