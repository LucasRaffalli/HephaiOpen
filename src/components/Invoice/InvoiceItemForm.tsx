import { Box, Button, Flex, TextField, Text, Tooltip } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface InvoiceItemFormProps {
    dynamicColumns: { dataKey: string; header: string }[];
    priceUnit: string;
    addRowToTable: (formData: Record<string, string>) => void;
    boxWidth?: string;
}

const InvoiceItemForm: React.FC<InvoiceItemFormProps> = ({ dynamicColumns, priceUnit, addRowToTable, boxWidth = '230px' }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Record<string, string>>({ product: "", total: "", });

    const [error, setError] = useState<string>("");

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        setError("");
    };

    const handleAddRow = () => {
        if (!formData.product || !formData.total) {
            setError(t("features.invoice.notProductError"));
            return;
        }

        const totalValue = formData.total.replace(',', '.');

        if (isNaN(parseFloat(totalValue)) || parseFloat(totalValue) <= 0) {
            setError(t("features.invoice.totalError"));
            return;
        }

        addRowToTable(formData);
        setFormData({ product: "", total: "" });
    };

    return (
        <Box width={boxWidth}>
            <Flex direction="column" gap="2" width="100%">
                <TextField.Root placeholder={t("features.invoice.tableItem.product")} value={formData.product} onChange={(e) => handleChange("product", e.target.value)} />
                {dynamicColumns.map((col) => (
                    <TextField.Root key={col.dataKey} placeholder={col.header} value={formData[col.dataKey] || ""} onChange={(e) => handleChange(col.dataKey, e.target.value)} />
                ))}
                <TextField.Root placeholder={`${t("features.invoice.tableItem.total")} (${priceUnit})`} value={formData.total} onChange={(e) => handleChange("total", e.target.value)} />

                {error && <Text color="red" style={{ marginTop: "8px" }}>{error}</Text>}
                <Tooltip content={t('utils.tooltips.addProduct')}>
                    <Button className='btncursor' variant="soft" onClick={handleAddRow} style={{ width: "100%" }} disabled={!formData.product || !formData.total || !!error}>
                        <PlusIcon size={16} />
                        <Text>{t("buttons.addProduct")}</Text>
                    </Button>
                </Tooltip>
            </Flex>
        </Box>
    );
};

export default InvoiceItemForm;
