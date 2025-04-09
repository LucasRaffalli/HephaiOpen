import '../css/invoice.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Button, DropdownMenu, Flex, Heading, IconButton, Progress, ScrollArea, Skeleton, Text, TextField, Tooltip } from '@radix-ui/themes';
import { Client, CompanyInfo } from '@/types/hephai';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { motion } from "motion/react"
import UserInformation from '@/components/Settings/UserInformation';
import PaymentSelection from '@/components/Invoice/PaymentSelection';
import { useClientContext } from '@/components/Clients/ClientContext';
import ClientForm from '@/components/Clients/ClientForm';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useDynamicTable } from '@/hooks/useDynamicTable';
import { useInvoicePDF } from '@/hooks/useInvoicePDF';
import ContainerFeature from '@/components/template/ContainerFeature';
import InvoiceItemForm from '@/components/Invoice/InvoiceItemForm';
import ProductSelector from '@/components/Invoice/ProductSelector';
import DateSelector from '@/components/Invoice/DateSelector';
import DynamicColumnEditor from '@/components/Invoice/DynamicColumnEditor';
import InvoicePdfViewer from '@/components/Invoice/InvoicePdfViewer';
import InvoiceModality from '@/components/Invoice/InvoiceModality';
import InvoiceComments from '@/components/Invoice/InvoiceComments';
import ContainerInterface from '@/components/template/ContainerInterface';

export const Invoice = () => {
    const { t } = useTranslation();
    const { selectedClient } = useClientContext();
    const [isDarkMode] = useDarkMode();
    const { rows, setRows } = useDynamicTable();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [paymentInfo, setPaymentInfo] = useState({ type: '', details: '', amountPaid: "" });
    const [imageSrc] = useState<string | null>(localStorage.getItem('profileImage') || null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ authorCompanyName: '', authorAddress: '', authorPhone: '', authorEmail: '', siret: '', });
    const [clientInfo, setClientInfo] = useState<Client>({ companyName: '', address: '', phone: '', email: '', bookmarks: false, id: '' });
    const [dynamicColumns, setDynamicColumns] = useState(() => { const savedColumns = localStorage.getItem("invoiceColumns"); return savedColumns ? JSON.parse(savedColumns) : []; });
    const [priceUnit] = useState(localStorage.getItem('priceUnit') || '€');
    const [modalitiesText1, setModalitiesText1] = useState<string>("");
    const [modalitiesText2, setModalitiesText2] = useState<string>("");
    const [commentsText, setCommentsText] = useState<string>("");
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(true);
    const [isModalitiesEnabled, setIsModalitiesEnabled] = useState(true);
    const [isFooterEnabled, setIsFooterEnabled] = useState(true);
    const { generatePDF, downloadPDF, isLoading, printPDF, togglePreviewMode, isPreviewMode, showFinalVersion } = useInvoicePDF({
        clientInfo, companyInfo, paymentInfo, rows,
        columns: dynamicColumns, selectedDate, imageSrc, priceUnit,
        modalitiesText1, modalitiesText2, commentsText, isCommentsEnabled, isModalitiesEnabled, isFooterEnabled
    });
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
    }, [clientInfo, companyInfo, paymentInfo, selectedDate, dynamicColumns, rows, commentsText, modalitiesText1, modalitiesText2, isCommentsEnabled, isModalitiesEnabled]);

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
        setIsAutoDate(false);
        setSelectedDate(e?.target.value);

    }
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
    const addRowToTable = (newRow: any) => {
        setRows([...rows, newRow]);
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
    const handleClearAllProducts = () => {
        setRows([]);
    };
    const handlePaymentChange = (type: string, value: string) => {
        setPaymentInfo(prev => ({
            ...prev,
            type,
            details: type !== prev.type ? "" : value,
        }));
    };

    const handleCommentsText = (value: string) => {
        setCommentsText(value);
    };
    const handleModalitiesText = (field: "text1" | "text2", value: string) => {
        if (field === "text1") {
            setModalitiesText1(value);
        } else {
            setModalitiesText2(value);
        }
    };
    const toggleComments = () => {
        setIsCommentsEnabled((prev) => !prev);
    };
    const toggleModalities = () => {
        setIsModalitiesEnabled((prev) => !prev);
    };

    const containerLeftVariants = {
        hidden: {
            x: -500,
            opacity: 0,
            scale: 0.95,
            skew: 2
        },
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            skew: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const containerRightVariants = {
        hidden: {
            x: 500,  // Changé pour partir de la droite
            opacity: 0,
            scale: 0.95,
            skew: -2
        },
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            skew: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                when: "beforeChildren",
                staggerChildren: 0.05,
                delayChildren: 0.2
            }
        }
    };

    const featureVariants = {
        hidden: {
            x: -30,
            opacity: 0,
            scale: 0.95
        },
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
                mass: 0.8
            }
        }
    };

    const featureRightVariants = {
        hidden: {
            x: -20,
            opacity: 0,
            scale: 0.95
        },
        visible: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
                mass: 0.8
            }
        }
    };

    return (
        <>
            <Flex direction={'column'} height={"100%"}>
                <ContainerInterface height='100%' padding='4' justify='between'>
                    <Flex height={"100%"} direction="column" align={'center'} gap={'2'} className='' >
                        <motion.div
                            variants={containerLeftVariants}
                            initial="hidden"
                            animate="visible"
                            className='scrollMbox actionbar full-height'
                        >
                            <Flex direction="column" align={'center'} gap={'4'} >


                                <motion.div variants={featureVariants}>
                                    <ContainerFeature title="features.invoice.date.title">
                                        <DateSelector selectedDate={selectedDate} handleCustomDate={handleCustomDate} isAutoDate={isAutoDate} setIsAutoDate={setIsAutoDate} setSelectedDate={setSelectedDate} />
                                    </ContainerFeature>
                                </motion.div>

                                <motion.div variants={featureVariants}>
                                    <ContainerFeature title="features.invoice.payment">
                                        <PaymentSelection onPaymentChange={handlePaymentChange} />
                                    </ContainerFeature>
                                </motion.div>

                                <motion.div variants={featureVariants}>
                                    <ContainerFeature title="features.invoice.customer">
                                        <ClientForm clientInfo={selectedClient} handleChange={handleChange} handleSave={handleSave} />
                                    </ContainerFeature>
                                </motion.div>
                                <motion.div variants={featureVariants}>
                                    <ContainerFeature title="features.invoice.modalitiesAndConditions">
                                        <InvoiceModality text1={modalitiesText1} text2={modalitiesText2} updateText={handleModalitiesText} onClick={toggleModalities} />
                                    </ContainerFeature>
                                </motion.div>
                            </Flex>
                        </motion.div>
                    </Flex>

                    {pdfPreviewUrl &&
                        <InvoicePdfViewer pdfUrl={pdfPreviewUrl} downloadPDF={downloadPDF} isLoading={isLoading} />
                    }

                    <Flex height={"100%"} direction="column" align={'center'} gap={'4'} className='' >
                        <motion.div
                            variants={containerRightVariants}
                            initial="hidden"
                            animate="visible"
                            className='scrollMbox actionbar full-height'
                        >
                            <Flex direction="column" align={'center'} gap={'6'} >
                                <motion.div variants={featureVariants}>
                                    <ContainerFeature title="features.invoice.table">
                                        <DynamicColumnEditor dynamicColumns={dynamicColumns} handleEditColumn={handleEditColumn} removeColumn={removeColumn} addDynamicColumn={addDynamicColumn} maxColumns={4} />
                                    </ContainerFeature>
                                </motion.div>

                                <motion.div variants={featureVariants}>
                                    <ContainerFeature title="features.invoice.product">
                                        <InvoiceItemForm addRowToTable={addRowToTable} dynamicColumns={dynamicColumns} priceUnit={priceUnit} />
                                    </ContainerFeature>
                                </motion.div>

                                <motion.div variants={featureVariants}>
                                    <ContainerFeature title="features.invoice.selectorProduct">
                                        <ProductSelector dynamicColumns={dynamicColumns} handleDeleteProduct={handleDeleteProduct} handleEditProduct={handleEditProduct} handleClearAllProducts={handleClearAllProducts} priceUnit={priceUnit} rows={rows} />
                                    </ContainerFeature>
                                </motion.div>

                                <motion.div variants={featureVariants}>
                                    <ContainerFeature title="features.invoice.additionalComments">
                                        <InvoiceComments commentsText={commentsText} onClick={toggleComments} updateText={handleCommentsText} />
                                    </ContainerFeature>
                                </motion.div>
                            </Flex>
                        </motion.div>
                    </Flex>
                </ContainerInterface>
            </Flex>
        </>
    );
}