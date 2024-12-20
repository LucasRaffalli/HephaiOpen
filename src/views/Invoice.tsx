import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../css/invoice.css';
import { Avatar, Box, Button, DropdownMenu, Flex, Heading, IconButton, Progress, ScrollArea, Skeleton, Text, TextField, Tooltip } from '@radix-ui/themes';
import { AccentColor, Client, CompanyInfo } from '@/type/hephai';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import { motion } from "motion/react"
import UserInformation from '@/components/UserInformation';
import PaymentSelection from '@/components/Invoice/PaymentSelection';
import ClientsList from '@/components/ClientsList';
import { useClientContext } from '@/components/ClientContext';
import Popup from '@/components/Popup';
import ClientForm from '@/components/ClientForm';
import autoTable from 'jspdf-autotable';
import { Lock, Trash, Trash2Icon } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useDynamicTable } from '@/hooks/useDynamicTable';
import { useInvoicePDF } from '@/hooks/useInvoicePDF';
import { setupPDFHeader, setupPDFTable } from '@/utils/pdfUtils';
import ContainerFeature from '@/components/template/ContainerFeature';

export const Invoice = () => {
    const { t } = useTranslation();
    const { selectedClient, setSelectedClient } = useClientContext();
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const { columns, rows, setRows, addColumn } = useDynamicTable();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [paymentInfo, setPaymentInfo] = useState({ type: '', details: '', });
    const [imageSrc, setImageSrc] = useState<string | null>(localStorage.getItem('profileImage') || null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ authorCompanyName: '', authorAddress: '', authorPhone: '', authorEmail: '', siret: '', });
    const [clientInfo, setClientInfo] = useState<Client>({ companyName: '', address: '', phone: '', email: '', bookmarks: false, id: '' });
    const [clients, setClients] = useState<Client[]>(() => { const storedClients = localStorage.getItem('clients'); return storedClients ? JSON.parse(storedClients) : []; });
    const [formData, setFormData] = useState<{ [key: string]: string }>({ product: "", total: "", });
    const [dynamicColumns, setDynamicColumns] = useState(() => { const savedColumns = localStorage.getItem("invoiceColumns"); return savedColumns ? JSON.parse(savedColumns) : []; });
    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
    const [priceUnit, setPriceUnit] = useState(localStorage.getItem('priceUnit') || '€');

    const { downloadPDF, isLoading, generatePDF, generatePreview } = useInvoicePDF({ clientInfo, companyInfo, paymentInfo, rows, columns: dynamicColumns, selectedDate, imageSrc, priceUnit });

    useEffect(() => {
        const storedInfo = localStorage.getItem('companyInfos');
        if (storedInfo) {
            try {
                const parsedInfo = JSON.parse(storedInfo);
                if (Array.isArray(parsedInfo) && parsedInfo.length > 0) {
                    setCompanyInfo(parsedInfo[0]);
                }
            } catch (error) {
                console.error('Erreur lors du parsing de companyInfos depuis localStorage:', error);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('companyInfos', JSON.stringify([companyInfo]));
        toast.success(t('toast.saveInfo.success'), { autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: isDarkMode ? 'dark' : 'light', });
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleInsertClient = (client: Client) => {
        setClientInfo(client);
        toast.success(`Client "${client.companyName}" inséré avec succès !`, {
            autoClose: 3000,
        });
    };

    useEffect(() => {
        localStorage.setItem("invoiceColumns", JSON.stringify(dynamicColumns));
        localStorage.setItem("invoiceRows", JSON.stringify(rows));
    }, [dynamicColumns, rows]);

    const addDynamicColumn = () => {
        if (dynamicColumns.length >= 4) {
            toast.error("Vous ne pouvez pas ajouter plus de 4 colonnes.", { theme: isDarkMode ? 'dark' : 'light' });
            return;
        }
        const newColumn = {
            header: `Colonne ${dynamicColumns.length + 1}`,
            dataKey: `col${dynamicColumns.length + 1}`,
        };
        setDynamicColumns([...dynamicColumns, newColumn]);
        setRows(rows.map((row: { [x: string]: any; }) => ({ ...row, [newColumn.dataKey]: "" })));
    };

    const handleEditColumn = (index: any, newHeader: any) => {
        const updatedColumns = [...dynamicColumns];
        updatedColumns[index].header = newHeader;
        setDynamicColumns(updatedColumns);
    };

    useEffect(() => {
        const timeout = setTimeout(async () => {
            try {
                const pdfBytes = await generatePDF();
                const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(pdfBlob);

                setPdfPreviewUrl(blobUrl);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du PDF :', error);
            }
        }, 2000);
        return () => clearTimeout(timeout);
    }, [clientInfo, companyInfo, paymentInfo, selectedDate, dynamicColumns, rows]);

    useEffect(() => {
        if (isAutoDate) {
            const updateDate = () => {
                const today = new Date();
                setSelectedDate(today.toISOString().split('T')[0]);
            };
            updateDate();
            const intervalId = setInterval(updateDate, 1000);
            return () => clearInterval(intervalId);
        }
    }, [isAutoDate]);
    useEffect(() => {
        setClientInfo(selectedClient || clientInfo);
    }, [selectedClient]);

    const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e?.target.value);
    }

    const handleDeleteClient = (email: string) => {
        const updatedClients = clients.filter((client) => client.email !== email);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        setClients(updatedClients);
    };
    const handleEditClient = (updatedClient: Client) => {
        const savedClients = JSON.parse(localStorage.getItem('clients') || '[]') as Client[];
        const updatedClients = savedClients.map(client =>
            client.email === updatedClient.email ? updatedClient : client
        );
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        setClients(updatedClients); // Met à jour l'état si nécessaire
    };


    const removeColumn = (indexToRemove: number) => {
        const columnToRemove = dynamicColumns[indexToRemove].dataKey;
        const updatedColumns = dynamicColumns.filter((_: any, index: number) => index !== indexToRemove);
        setDynamicColumns(updatedColumns);
        const updatedRows = rows.map((row: { [x: string]: any; }) => {
            const { [columnToRemove]: _, ...rest } = row;
            return rest;
        });
        setRows(updatedRows);
    };
    const addRowToTable = () => {
        if (!formData.product || !formData.total) {
            toast.error(("Les champs Produit et Total sont obligatoires."), { theme: isDarkMode ? 'dark' : 'light', });
            return;
        }

        const newRow = {
            product: formData.product,
            total: formData.total,
            ...dynamicColumns.reduce((acc: { [x: string]: string; }, col: { dataKey: string | number; }) => {
                acc[col.dataKey] = formData[col.dataKey] || "";
                return acc;
            }, {}),
        };

        setRows([...rows, newRow]);
        setFormData({ product: "", total: "" });
    };

    const handleEditProduct = (index: number, key: string, value: string) => {
        const updatedRows = [...rows];
        updatedRows[index][key] = value;
        setRows(updatedRows);
    };

    const handleDeleteProduct = (index: number) => {
        const updatedRows = rows.filter((_: any, i: number) => i !== index);
        setRows(updatedRows);
    };

    return (
        <>

            <Flex direction={'column'} height={"100%"}>
                {/* <Flex className='invoice__navigation' height={'40px'} width={'fit-content'}>
                    <Box>Invoice, nav</Box>
                </Flex > */}
                <Flex p={'4'} direction={'row'} justify={'between'} gap={'0'} align={'center'} className='invoice__content' height={"100%"}>
                    <Flex height={"100%"} direction="column" align={'center'} gap={'2'} className='' >

                        <ScrollArea className='scrollbox actionbar full-height' scrollbars={"vertical"} >
                            <Flex direction="column" align={'center'} gap={'8'} >

                                <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                    <Text size={"2"} weight="bold">{t('features.invoice.logo')}</Text>
                                    <Flex direction="column" justify={'center'} align={'center'} p={'2'} className='actionbar_left__logo'>
                                        <Avatar size={'8'} variant={"soft"} fallback="heph" src={imageSrc || ''} className='card__img' style={{ width: "100%" }} />
                                    </Flex>
                                </Flex>
                                {/* Date */}
                                <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>


                                    <Text size={"2"} weight="bold">{t('features.invoice.date.title')}</Text>
                                    <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
                                        <Flex direction="column" width="100%">
                                            <Flex mb={'4'} position="relative" display="flex" justify="between" overflow="hidden" className='button__date__container' p={"1"}>
                                                <Flex justify={'center'} onClick={() => setIsAutoDate(true)} className={`button__date ${isAutoDate ? "active" : ""}`} p={"1"}>{t('features.invoice.date.today')}</Flex>
                                                <Flex justify={'center'} onClick={() => setIsAutoDate(false)} className={`button__date ${!isAutoDate ? "active" : ""}`} p={"1"}>{t('features.invoice.date.otherDay')}</Flex>
                                                <Box className="button__date__indicator" style={{}}></Box>
                                            </Flex>
                                            <Box width={"100%"}>

                                                {isAutoDate ? (
                                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
                                                        <Button disabled style={{ width: "100%" }}>
                                                            {selectedDate}
                                                        </Button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.input type="date" value={selectedDate} onChange={handleCustomDate} className="datepicker" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }} />
                                                )}

                                            </Box>
                                        </Flex>

                                    </Flex>
                                </Flex>
                                {/* payement */}
                                <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                    <Text size={"2"} weight="bold">{t('features.invoice.payment')}</Text>
                                    <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
                                        <Flex direction="column" width="100%">
                                            <PaymentSelection onPaymentChange={(type, value) => setPaymentInfo({ type, details: value })} />
                                        </Flex>

                                    </Flex>
                                </Flex>
                                {/* auteur */}
                                <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                    <Text size={"2"} weight="bold">{t('features.invoice.author')}</Text>
                                    <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__author'>
                                        <UserInformation companyInfo={companyInfo} handleChange={handleChange} handleSave={handleSave} boxWidth='100%' flexJustify='center' />

                                    </Flex>
                                </Flex>
                                {/* client */}
                                <Flex direction="column" align="center" gap="4" width="100%">
                                    <Text size="2" weight="bold">{t('features.invoice.customer')}</Text>
                                    <Flex direction="column" gap="2" width="100%">
                                        <ClientForm clientInfo={selectedClient} handleChange={handleChange} handleSave={handleSave} boxWidth='100%' />
                                    </Flex>
                                </Flex>
                            </Flex>
                        </ScrollArea>
                    </Flex>

                    <Flex className='invoice__paper' direction={'column'} justify={'center'} align={'center'} gap={'4'}>
                        <Box height={'840px'} width={'595px'} style={{ "backgroundColor": "aliceblue" }}>
                            <Box height={'840px'} width={'595px'} className='invoice__paper__content pdf-preview-container'>
                                {pdfPreviewUrl && (
                                    <iframe src={`${pdfPreviewUrl}#toolbar=0&zoom=73.6`} width="100%" height="100%" />
                                )}
                            </Box>
                        </Box>
                    </Flex>
                    <Flex direction="column" align={'center'} gap={'2'} className='' height={"100%"}>

                        <ScrollArea className='scrollbox actionbar full-height' scrollbars={"vertical"} >
                            <Flex direction="column" align={'center'} gap={'8'} width={"100%"} >

                                {/* colonne */}
                                <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                    <Text size={"2"} weight="bold">{t('features.invoice.table')}</Text>
                                    <Flex direction="column" justify={'center'} align={'center'} width={"100%"}>
                                        <Flex direction="column" width="100%" gap="3">
                                            <TextField.Root placeholder="Produit" size="2" disabled>
                                                <TextField.Slot side={"right"}>
                                                    <Lock size={14} />
                                                </TextField.Slot>
                                            </TextField.Root>
                                            {dynamicColumns.map((col: any, index: number) => (
                                                <Box key={col.dataKey} width={"100%"} >
                                                    <TextField.Root placeholder="" size="2" value={col.header} onChange={(e) => handleEditColumn(index, e.target.value)}>
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
                                            <Button variant="soft" onClick={addDynamicColumn}>
                                                <Text size="2" weight="regular">{t('buttons.addColumns')}</Text>
                                            </Button>

                                        </Flex>

                                    </Flex>
                                </Flex>
                                <ContainerFeature title="features.invoice.product">
                                    <Flex direction="column" gap="2" width="100%">
                                        <TextField.Root placeholder={t('features.invoice.tableItem.product')} value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} />
                                        {dynamicColumns.map((col: any) => (<TextField.Root key={col.dataKey} placeholder={col.header} value={formData[col.dataKey] || ""} onChange={(e) => setFormData({ ...formData, [col.dataKey]: e.target.value })} />))}
                                        <TextField.Root placeholder={`${t('features.invoice.tableItem.total')} (${priceUnit})`} value={formData.total} onChange={(e) => setFormData({ ...formData, total: e.target.value })} />
                                        <Button variant="soft" onClick={() => addRowToTable()}>{t('buttons.addProduct')}</Button>
                                    </Flex>
                                </ContainerFeature>

                                <ContainerFeature title="features.invoice.product">
                                    <Flex direction="column" gap="2" width="100%">
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger>
                                                <Button variant="soft">{selectedProductIndex !== null && rows[selectedProductIndex] ? rows[selectedProductIndex].product : 'Sélectionner un produit'}</Button>
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Content>
                                                {rows.length > 0 ? rows.map((row: any, index: number) => (
                                                    <DropdownMenu.Item key={index} onSelect={() => setSelectedProductIndex(index)}>
                                                        {row.product}
                                                    </DropdownMenu.Item>
                                                )) : (
                                                    <DropdownMenu.Item disabled>Aucun produit disponible</DropdownMenu.Item>
                                                )}
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Root>
                                        {selectedProductIndex !== null && rows[selectedProductIndex] && (
                                            <Flex direction="column" gap="2" width="100%">
                                                <TextField.Root value={rows[selectedProductIndex].product} onChange={(e) => handleEditProduct(selectedProductIndex, 'product', e.target.value)} />
                                                {dynamicColumns.map((col: any) => (
                                                    <TextField.Root key={col.dataKey} value={rows[selectedProductIndex][col.dataKey]} onChange={(e) => handleEditProduct(selectedProductIndex, col.dataKey, e.target.value)} />
                                                ))}
                                                <TextField.Root value={rows[selectedProductIndex].total} placeholder={`Total (${priceUnit})`} onChange={(e) => handleEditProduct(selectedProductIndex, 'total', e.target.value)} />
                                                <Flex gap="2">
                                                    <Button variant="soft" color="red" onClick={() => handleDeleteProduct(selectedProductIndex)}>{t('buttons.delete')}</Button>
                                                    <Button variant="soft" onClick={() => setSelectedProductIndex(null)}>{t('buttons.save')}</Button>
                                                </Flex>
                                            </Flex>
                                        )}
                                    </Flex>
                                </ContainerFeature>

                                {/* template */}
                                <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                    <Text size={"2"} weight="bold">{t('features.invoice.payment')}</Text>
                                    <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
                                        <Flex direction="column" width="100%">
                                            <PaymentSelection onPaymentChange={(type, value) => setPaymentInfo({ type, details: value })} />
                                        </Flex>

                                    </Flex>
                                </Flex>
                            </Flex>

                        </ScrollArea>
                        <Flex className='actionbar ' width={"100%"} minHeight={"10%"}>
                            <Tooltip content={t('utils.tooltips.downloadpdf')}>
                                <Button color="blue" variant="soft" className='btncursor' size={'3'} onClick={downloadPDF}>
                                    <Text size="2" weight="regular">{t('buttons.download.pdf')}</Text>
                                </Button>
                            </Tooltip>
                        </Flex>
                    </Flex>

                </Flex >
            </Flex >
        </>
    );
}