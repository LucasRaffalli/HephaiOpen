import { Box, Button, Flex, TextField, Text, Tooltip, Select, Separator, IconButton } from "@radix-ui/themes";
import { Delete, DeleteIcon, PlusIcon, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDynamicTableContext } from "@/context/DynamicTableContext";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceItemEditorProps {
    priceUnit: string;
    boxWidth?: string;
}

const InvoiceItemEditor: React.FC<InvoiceItemEditorProps> = ({ priceUnit, boxWidth = '230px' }) => {
    const { t } = useTranslation();
    const { columns: dynamicColumns, rows, addRow, editRow, removeRow, clearRows } = useDynamicTableContext();
    const [isSmall, setIsSmall] = useState(false);
    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>(() => {
        const initialData: Record<string, string> = { product: "", total: "" };
        dynamicColumns.forEach(col => {
            initialData[col.dataKey] = "";
        });
        return initialData;
    });
    const [error, setError] = useState<string>("");

    const handleChange = (key: string, value: string) => {
        if (selectedProductIndex !== null) {
            editRow(selectedProductIndex, key, value);
        } else {
            setFormData(prev => ({ ...prev, [key]: value }));
        }
        setError("");
    };

    const resetForm = () => {
        const resetData: Record<string, string> = { product: "", total: "" };
        dynamicColumns.forEach(col => {
            resetData[col.dataKey] = "";
        });
        setFormData(resetData);
        setSelectedProductIndex(null);
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

        addRow(formData);
        resetForm();
    };

    const handleProductSelect = (value: string) => {
        const index = Number(value);
        setSelectedProductIndex(index);
        if (!isNaN(index) && rows[index]) {
            setFormData(rows[index]);
        }
    };

    const handleDeleteRow = () => {
        if (selectedProductIndex !== null) {
            removeRow(selectedProductIndex);
            resetForm();
        }
    };

    const handleUpdateRow = () => {
        resetForm();
    };

    useEffect(() => {
        setFormData(prev => {
            const newData: Record<string, string> = { product: prev.product, total: prev.total };
            dynamicColumns.forEach(col => {
                newData[col.dataKey] = prev[col.dataKey] || "";
            });
            return newData;
        });
    }, [dynamicColumns]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmall(window.innerWidth < 121);
        };

        handleResize(); // call once on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <Box width={boxWidth}>
            <Flex direction="column" gap="2" width="100%">
                <Select.Root value={selectedProductIndex !== null ? String(selectedProductIndex) : ""} onValueChange={handleProductSelect}>
                    <Select.Trigger placeholder={t('features.invoice.notProduct')} className="btnCursor" />
                    <Select.Content position="popper" style={{ height: "10.5rem" }}>
                        {rows.length > 0 ? (
                            rows.map((row, index) => (
                                <Select.Item key={index} value={String(index)} className="btnCursor">
                                    {row.product}
                                </Select.Item>
                            ))
                        ) : (
                            <Select.Item value="none" disabled>
                                {t('features.invoice.noProducts')}
                            </Select.Item>
                        )}
                    </Select.Content>
                </Select.Root>

                <Separator orientation="horizontal" style={{ width: "100%" }} />

                <>
                    <TextField.Root placeholder={t("features.invoice.tableItem.product")} value={formData.product} onChange={(e) => handleChange("product", e.target.value)} />
                    {dynamicColumns.map((col) => (
                        <TextField.Root key={`form-${col.dataKey}`} placeholder={col.header} value={formData[col.dataKey] || ""} onChange={(e) => handleChange(col.dataKey, e.target.value)} />
                    ))}
                    <TextField.Root type="number" placeholder={`${t("features.invoice.tableItem.total")} (${priceUnit})`} value={formData.total} onChange={(e) => handleChange("total", e.target.value)} />

                    {error && <Text color="red" style={{ marginTop: "8px" }}>{error}</Text>}

                    <Flex gap="2">
                        <AnimatePresence mode="wait">
                            {selectedProductIndex !== null ? (
                                <motion.div key="edit" style={{ width: '100%', overflow: 'hidden', display: "flex", gap: "var(--space-2)" }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.1, type: "spring", stiffness: 600, damping: 25 }}>
                                    <Tooltip content={t('utils.tooltips.delete')}>
                                        <Box style={{ width: "100%" }}>
                                            <Button variant="soft" color="red" className="btnCursor btnCustom1" onClick={handleDeleteRow}>
                                                {t("buttons.delete.product")}
                                            </Button>
                                        </Box>
                                    </Tooltip>
                                    <Tooltip content={t('utils.tooltips.update')}>
                                        <Button variant="soft" className="btnCursor" onClick={handleUpdateRow}>
                                            {t("buttons.update")}
                                        </Button>
                                    </Tooltip>
                                </motion.div>
                            ) : (
                                <motion.div key="add" style={{ width: "100%", overflow: 'hidden', display: "flex", flexDirection: "column", gap: "var(--space-2)" }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.1, type: "spring", stiffness: 600, damping: 25 }}>
                                    <Tooltip content={t('utils.tooltips.addProduct')}>
                                        <Button variant="soft" onClick={handleAddRow} disabled={!formData.product || !formData.total || !!error} className='btnCursor' style={{ width: "100%" }}>
                                            <PlusIcon size={16} />
                                            <Text>{t("buttons.addProduct")}</Text>
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content={t('utils.tooltips.deleteAll')}>

                                        <Button variant="soft" className="btnCursor" color="red" onClick={() => { clearRows(); resetForm(); }} style={{ width: "100%" }}>
                                            <Trash2 size={16} />
                                            <Text>
                                                {t("buttons.clearAll")}

                                            </Text>
                                        </Button>
                                    </Tooltip>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Flex>
                </>
            </Flex>
        </Box>
    );
};

export default InvoiceItemEditor;
