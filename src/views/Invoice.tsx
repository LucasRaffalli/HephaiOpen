import '../css/invoice.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Button, DropdownMenu, Flex, Heading, IconButton, Progress, ScrollArea, Skeleton, Text, TextField, Tooltip } from '@radix-ui/themes';
import { Client, CompanyInfo } from '@/types/hephai';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { motion } from "motion/react"
import PaymentSelection from '@/components/Invoice/PaymentSelection';
import { useClientContext } from '@/components/Clients/ClientContext';
import ClientForm from '@/components/Clients/ClientForm';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useInvoicePDF } from '@/hooks/useInvoicePDF';
import ContainerFeature from '@/components/template/ContainerFeature';
import DateSelector from '@/components/Invoice/DateSelector';
import DynamicColumnEditor from '@/components/Invoice/DynamicColumnEditor';
import InvoicePdfViewer from '@/components/Invoice/InvoicePdfViewer';
import InvoiceModality from '@/components/Invoice/InvoiceModality';
import InvoiceComments from '@/components/Invoice/InvoiceComments';
import ContainerInterface from '@/components/template/ContainerInterface';
import CreditHephai from '@/components/Invoice/CreditHephai';
import { useDateContext } from '@/context/DateContext';
import { usePaymentContext } from '@/context/PaymentContext';
import { useDynamicTableContext } from '@/context/DynamicTableContext';
import { useModalities } from '@/context/ModalitiesContext';
import { useComments } from '@/context/CommentsContext';
import { useFooter } from '@/context/FooterContext';
import InvoiceItemEditor from '@/components/Invoice/InvoiceItemEditor';

export const Invoice = () => {
    const { selectedClient } = useClientContext();
    const { selectedDate, isAutoDate, setIsAutoDate, setSelectedDate } = useDateContext();
    const { paymentData } = usePaymentContext();
    const { text1, text2, isEnabled } = useModalities();
    const { text: commentsText, isEnabled: isCommentsEnabled } = useComments();
    const { rows, columns: dynamicColumns } = useDynamicTableContext();
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [paymentInfo, setPaymentInfo] = useState({ type: '', details: '', amountPaid: "" });
    const [imageSrc] = useState<string | null>(localStorage.getItem('profileImage') || null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ authorCompanyName: '', authorAddress: '', authorPhone: '', authorEmail: '', siret: '', });
    const [clientInfo, setClientInfo] = useState<Client>({ companyName: '', address: '', phone: '', email: '', bookmarks: false, id: '' });
    const [priceUnit] = useState(localStorage.getItem('priceUnit') || '€');
    const [modalitiesText1, setModalitiesText1] = useState<string>("");
    const [modalitiesText2, setModalitiesText2] = useState<string>("");
    const [isModalitiesEnabled, setIsModalitiesEnabled] = useState(true);
    const { isFooterEnabled, setIsFooterEnabled } = useFooter();
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

    useEffect(() => {
        localStorage.setItem("invoiceColumns", JSON.stringify(dynamicColumns));
        localStorage.setItem("invoiceRows", JSON.stringify(rows));
    }, [dynamicColumns, rows]);

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
    }, [clientInfo, companyInfo, paymentInfo, selectedDate, dynamicColumns, rows, commentsText, modalitiesText1, modalitiesText2, isCommentsEnabled, isModalitiesEnabled, isFooterEnabled]);

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

    useEffect(() => {
        const activePayment = Object.entries(paymentData).find(([_, value]) => value !== '');
        if (activePayment) {
            setPaymentInfo({ type: activePayment[0], details: activePayment[1], amountPaid: "" });
        }
    }, [paymentData]);

    useEffect(() => {
        setModalitiesText1(text1);
        setModalitiesText2(text2);
        setIsModalitiesEnabled(isEnabled);
    }, [text1, text2, isEnabled]);

    const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAutoDate(false);
        setSelectedDate(e.target.value);
    };

    const handlePaymentChange = (type: string, value: string) => {
        setPaymentInfo(prev => ({
            ...prev,
            type,
            details: type !== prev.type ? "" : value,
        }));
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
        <Flex direction={'column'} height={"100%"}>
            <ContainerInterface height='100%' padding='4' justify='between'>
                <Flex height={"100%"} direction="column" align={'center'} gap={'2'} className='' >
                    <motion.div
                        variants={containerLeftVariants}
                        initial="hidden"
                        animate="visible"
                        className='scrollMbox actionbar actionBarFalse full-height'
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
                                    <ClientForm />
                                </ContainerFeature>
                            </motion.div>
                            <motion.div variants={featureVariants}>
                                <ContainerFeature title="features.invoice.modalitiesAndConditions">
                                    <InvoiceModality />
                                </ContainerFeature>
                            </motion.div>
                        </Flex>
                    </motion.div>
                </Flex>

                {pdfPreviewUrl &&
                    <InvoicePdfViewer pdfUrl={pdfPreviewUrl} downloadPDF={downloadPDF} isLoading={isLoading} />
                }

                <Flex height={"100%"} direction="column" align={'center'} gap={'4'} className='actionBar' >
                    <motion.div variants={containerRightVariants} initial="hidden" animate="visible" className='scrollMbox actionbar actionBarFalse full-height'>
                        <Flex direction="column" align={'center'} gap={'6'} >
                            <motion.div variants={featureVariants}>
                                <ContainerFeature title="features.invoice.table">
                                    <DynamicColumnEditor />
                                </ContainerFeature>
                            </motion.div>

                            <motion.div variants={featureVariants}>
                                <ContainerFeature title="features.invoice.product">
                                    <InvoiceItemEditor priceUnit={priceUnit} />
                                </ContainerFeature>
                            </motion.div>
                            <motion.div variants={featureVariants}>
                                <ContainerFeature title="features.invoice.additionalComments">
                                    <InvoiceComments />
                                </ContainerFeature>
                            </motion.div>
                            <motion.div variants={featureVariants}>
                                <ContainerFeature >
                                    <CreditHephai onClick={() => setIsFooterEnabled(!isFooterEnabled)} />
                                </ContainerFeature>
                            </motion.div>
                        </Flex>
                    </motion.div>
                </Flex>
            </ContainerInterface>
        </Flex>
    );
}

export default Invoice;