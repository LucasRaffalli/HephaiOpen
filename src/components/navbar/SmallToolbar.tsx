import React, { useRef, useState, useEffect } from 'react';
import { Flex, Tooltip, Box, Progress } from '@radix-ui/themes';
import { Calendar, Package, Table, UserPen, FileText, MessageCircle, Download, WalletCards, ChevronLeft, ChevronRight, Stamp } from 'lucide-react';
import { ToolbarProvider, useToolbar, PopupType } from './toolbar/ToolbarContext';
import '../../css/component/toolbar.css';
import DateSelector from '../Invoice/DateSelector';
import PaymentSelection from '../Invoice/PaymentSelection';
import { useDateContext } from '../../context/DateContext';
import { usePaymentContext } from '../../context/PaymentContext';
import ClientForm from '../Clients/ClientForm';
import DynamicColumnEditor from '../Invoice/DynamicColumnEditor';
import InvoiceModality from '../Invoice/InvoiceModality';
import InvoiceComments from '../Invoice/InvoiceComments';
import PopupDynamique from './toolbar/PopupDynamique';
import { useInvoicePDF } from '../../hooks/useInvoicePDF';
import { useDynamicTableContext } from '../../context/DynamicTableContext';
import { useComments } from '../../context/CommentsContext';
import { useModalities } from '../../context/ModalitiesContext';
import type { CompanyInfo } from '../../types/hephai';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from 'i18next';
import { usePDF } from '@/context/PDFContext';
import InputFileName from '../Invoice/InputFileName';
import { useClientContext } from '../Clients/ClientContext';
import { useFooter } from '@/context/FooterContext';
import StampOff from '../design/icons/StampOff';
import InvoiceItemEditor from '../Invoice/InvoiceItemEditor';

const ToolbarContent: React.FC = () => {
    const { currentPage, setCurrentPage, pdfDoc, refreshPDF } = usePDF();
    const { activePopup, setActivePopup } = useToolbar();
    const { selectedDate, isAutoDate, setIsAutoDate, setSelectedDate } = useDateContext();
    const [progress, setProgress] = useState(0);
    const [priceUnit] = useState(localStorage.getItem('priceUnit') || '€');
    const { rows, columns: dynamicColumns } = useDynamicTableContext();
    const { text: commentsText, isEnabled: isCommentsEnabled } = useComments();
    const { text1: modalitiesText1, text2: modalitiesText2, isEnabled: isModalitiesEnabled } = useModalities();
    const [imageSrc] = useState<string | null>(localStorage.getItem('profileImage') || null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ authorCompanyName: '', authorAddress: '', authorPhone: '', authorEmail: '', siret: '' });
    const { isFooterEnabled, setIsFooterEnabled } = useFooter();
    const { selectedClient } = useClientContext();
    const { paymentData } = usePaymentContext();
    const clientInfo = selectedClient || { companyName: '', address: '', phone: '', email: '', bookmarks: false, id: '' };
    const paymentInfo = { type: Object.entries(paymentData).find(([_, value]) => value !== '')?.[0] || '', details: Object.entries(paymentData).find(([_, value]) => value !== '')?.[1] || '', amountPaid: '' };
    const [showLeftBar, setShowLeftBar] = useState(true);

    const toggleCredit = () => {
        const newValue = !isFooterEnabled;
        setIsFooterEnabled(newValue);
        setTimeout(() => refreshPDF(), 0);
    };
    useEffect(() => {
        const storedInfo = localStorage.getItem('companyInfos');
        if (storedInfo) {
            try {
                const parsedInfo = JSON.parse(storedInfo);
                if (Array.isArray(parsedInfo) && parsedInfo.length > 0) {
                    setCompanyInfo(parsedInfo[0]);
                }
            } catch (error) {
                console.error('Erreur parsing companyInfos:', error);
            }
        }
    }, []);


    const { downloadPDF, isLoading } = useInvoicePDF({
        clientInfo,
        companyInfo,
        paymentInfo,
        rows,
        columns: dynamicColumns,
        selectedDate,
        imageSrc,
        priceUnit,
        modalitiesText1,
        modalitiesText2,
        commentsText,
        isCommentsEnabled,
        isModalitiesEnabled,
        isFooterEnabled,
    });

    useEffect(() => {
        if (isLoading) {
            setShowLeftBar(false);
            setProgress(0);
            const startTime = Date.now();
            const duration = 3300;

            const updateProgress = () => {
                const elapsed = Date.now() - startTime;
                const newProgress = Math.min((elapsed / duration) * 100, 100);
                setProgress(newProgress);

                if (elapsed < duration) {
                    requestAnimationFrame(updateProgress);
                }
            };

            requestAnimationFrame(updateProgress);
        } else {
            setTimeout(() => setShowLeftBar(true), 400);
            setProgress(0);
        }
    }, [isLoading]);

    const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAutoDate(false);
        setSelectedDate(e.target.value);
    };
    const btnRef = useRef(null);
    const inputFileNameRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activePopup === 'fileCustomName' &&
                inputFileNameRef.current &&
                !(inputFileNameRef.current as any).contains(event.target)) {
                setActivePopup(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activePopup, setActivePopup]);

    return (
        <>
            <Flex className="small-toolbar__all visible">
                <AnimatePresence>
                    {showLeftBar && (
                        <motion.div className="small-toolbar__1" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.5 }}>
                            <Flex gap={"2"} >
                                {[
                                    { key: 'datePicker' as PopupType, icon: <Calendar size={20} /> },
                                    { key: 'payment' as PopupType, icon: <WalletCards size={20} /> },
                                    { key: 'client' as PopupType, icon: <UserPen size={20} /> },
                                    { key: 'dynamicColumnEditor' as PopupType, icon: <Table size={20} /> },
                                    { key: 'InvoiceItemEditor' as PopupType, icon: <Package size={20} /> },
                                    { key: 'modalities' as PopupType, icon: <FileText size={20} /> },
                                    { key: 'comments' as PopupType, icon: <MessageCircle size={20} /> },
                                ].map(({ key, icon }) => (
                                    <Box key={key} className={`toolbar-button-container ${activePopup === key ? 'active' : ''}`} onClick={() => setActivePopup(key)}>
                                        <Box ref={btnRef} className="btnToolBar">
                                            {icon}
                                        </Box>
                                    </Box>
                                ))}
                                <Box className="toolbar-button-container">
                                    <Box className="btnToolBar" onClick={toggleCredit}>
                                        {isFooterEnabled ? <Stamp /> : <StampOff />}
                                    </Box>
                                </Box>
                            </Flex>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Flex gap={"2"} className="small-toolbar__2" >
                    <Flex>
                        <Box className={`toolbar-button-container ${activePopup === 'navigate' ? 'active' : ''}`} onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} >
                            <Box className="btnToolBar chevrontL" >
                                <ChevronLeft size={20} />
                            </Box>
                        </Box>
                        <Box className={`toolbar-button-container ${activePopup === 'navigate' ? 'active' : ''}`} onClick={() => setCurrentPage(Math.min(currentPage + 1, pdfDoc?.numPages || 1))} >
                            <Box className="btnToolBar chevrontR" >
                                <ChevronRight size={20} />
                            </Box>
                        </Box>

                    </Flex>
                    <Box className={`toolbar-button-container ${activePopup === 'fileCustomName' ? 'active' : ''}`}>
                        <motion.div initial={false} animate={{ width: activePopup === 'fileCustomName' ? '200px' : '20px' }} transition={{ duration: 0.3, ease: 'easeInOut' }} style={{ overflow: 'hidden' }} ref={inputFileNameRef}>
                            <Box className="btnToolBar inputFileName" onClick={(e) => { e.stopPropagation(); if (!activePopup) { setActivePopup('fileCustomName'); } }}>
                                <AnimatePresence mode="wait">
                                    {activePopup === 'fileCustomName' ? (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }} style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
                                            <InputFileName width={"100%"} height={"100%"} />
                                        </motion.div>
                                    ) : (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ cursor: 'text' }}>
                                            <FileText size={20} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Box>
                        </motion.div>
                    </Box>
                    <Flex gap={"2"} className="toolbar-button-container" style={{ width: isLoading ? '100%' : 'auto' }}>
                        <motion.div initial={{ width: '20px' }} animate={{ width: isLoading ? '25rem' : '20px' }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
                            {isLoading ? (
                                <Progress value={progress} max={100} size="1" />
                            ) : (
                                <Tooltip content={t('utils.tooltips.download.pdf')}>
                                    <Box
                                        ref={btnRef}
                                        className="btnToolBar"
                                        onClick={downloadPDF}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Download size={20} />
                                    </Box>
                                </Tooltip>
                            )}
                        </motion.div>
                    </Flex>
                </Flex >

            </Flex >

            <PopupDynamique isOpen={activePopup === 'comments'} onClose={() => setActivePopup(null)} anchorRef={btnRef} >
                <InvoiceComments />
            </PopupDynamique >
            <PopupDynamique isOpen={activePopup === 'datePicker'} onClose={() => setActivePopup(null)} anchorRef={btnRef}>
                <DateSelector selectedDate={selectedDate} handleCustomDate={handleCustomDate} isAutoDate={isAutoDate} setIsAutoDate={setIsAutoDate} setSelectedDate={setSelectedDate} />
            </PopupDynamique>
            <PopupDynamique isOpen={activePopup === 'payment'} onClose={() => setActivePopup(null)} anchorRef={btnRef}>
                <PaymentSelection />
            </PopupDynamique>
            <PopupDynamique isOpen={activePopup === 'client'} onClose={() => setActivePopup(null)} anchorRef={btnRef}>
                <ClientForm boxWidth="100%" />
            </PopupDynamique>
            <PopupDynamique isOpen={activePopup === 'dynamicColumnEditor'} onClose={() => setActivePopup(null)} anchorRef={btnRef}>
                <DynamicColumnEditor />
            </PopupDynamique>
            <PopupDynamique isOpen={activePopup === 'InvoiceItemEditor'} onClose={() => setActivePopup(null)} anchorRef={btnRef}>
                <InvoiceItemEditor priceUnit={priceUnit} boxWidth='100%' />
            </PopupDynamique>
            <PopupDynamique isOpen={activePopup === 'modalities'} onClose={() => setActivePopup(null)} anchorRef={btnRef}>
                <InvoiceModality />
            </PopupDynamique>
        </>
    );
};

const SmallToolbar: React.FC = () => (
    <ToolbarProvider>
        <ToolbarContent />
    </ToolbarProvider>
);

export default SmallToolbar;
