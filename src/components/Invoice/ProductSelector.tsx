import { Box, Button, Flex, Select, TextField, Tooltip } from "@radix-ui/themes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // Import Framer Motion

interface ProductSelectorProps {
    rows: { product: string; total: string;[key: string]: any }[];
    dynamicColumns: { dataKey: string; header: string }[];
    priceUnit: string;
    handleEditProduct: (index: number, key: string, value: string) => void;
    handleDeleteProduct: (index: number) => void;
    handleClearAllProducts: () => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
    rows,
    dynamicColumns,
    priceUnit,
    handleEditProduct,
    handleDeleteProduct,
    handleClearAllProducts
}) => {
    const { t } = useTranslation();
    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

    return (
        <Flex direction="column" width="100%" gap="3">
            <Flex width="100%" direction="column">
                <Select.Root value={selectedProductIndex !== null ? String(selectedProductIndex) : ""} onValueChange={(value) => setSelectedProductIndex(Number(value))}>
                    <Select.Trigger placeholder={t('features.invoice.notProduct')} />
                    <Select.Content position="popper">
                        {rows.length > 0 ? (
                            rows.map((row, index) => (
                                <Select.Item key={index} value={String(index)}>
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
                <Tooltip content={t('utils.tooltips.deleteAll')}>

                    <Button variant="soft" className="btncursor" color="red" mt="2" onClick={() => { handleClearAllProducts(); setSelectedProductIndex(null); }}>
                        {t("buttons.clearAll")}
                    </Button>
                </Tooltip>
            </Flex>

            {selectedProductIndex !== null && rows[selectedProductIndex] && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                    <Flex direction="column" gap="2" width="100%">
                        <TextField.Root value={rows[selectedProductIndex].product} onChange={(e) => handleEditProduct(selectedProductIndex, "product", e.target.value)} placeholder={t("features.invoice.productName")}
                        />
                        {dynamicColumns.map((col) => (
                            <TextField.Root key={col.dataKey} value={rows[selectedProductIndex][col.dataKey]} onChange={(e) => handleEditProduct(selectedProductIndex, col.dataKey, e.target.value)} placeholder={col.header} />
                        ))}
                        <TextField.Root value={rows[selectedProductIndex].total} placeholder={`Total (${priceUnit})`} onChange={(e) => handleEditProduct(selectedProductIndex, "total", e.target.value)} />
                        <Flex gap="2">
                            <Tooltip content={t('utils.tooltips.delete')}>

                                <Button variant="soft" color="red" className="btncursor" onClick={() => { handleDeleteProduct(selectedProductIndex); setSelectedProductIndex(null); }}>
                                    {t("buttons.delete")}
                                </Button>
                            </Tooltip>
                            <Tooltip content={t('utils.tooltips.update')}>
                                <Button variant="soft" className="btncursor" onClick={() => setSelectedProductIndex(null)}>
                                    {t("buttons.update")}
                                </Button>
                            </Tooltip>
                        </Flex>
                    </Flex>
                </motion.div>
            )}
        </Flex>
    );
};

export default ProductSelector;
