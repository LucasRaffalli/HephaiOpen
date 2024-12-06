import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../css/invoice.css';
import { Avatar, Box, Button, Flex, Heading, IconButton, Progress, ScrollArea, Skeleton, Text, TextField, Tooltip } from '@radix-ui/themes';
import { AccentColor, CompanyInfo } from '@/type/hephai';
import { CalendarIcon, ClockIcon, EyeClosedIcon } from 'lucide-react';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import { motion } from "motion/react"
import UserInformation from '@/components/UserInformation';
import PaymentSelection from '@/components/Invoice/PaymentSelection';
import ProfileImage from '@/components/ProfileImage';

export const Invoice = () => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => { const savedMode = localStorage.getItem('isDarkMode'); return savedMode ? JSON.parse(savedMode) : false; });
    const [isLoadingPDF, setIsLoadingPDF] = useState(true);

    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [paymentInfo, setPaymentInfo] = useState({
        type: '',
        details: '',
    });
    const loadVisibilityPreferences = () => {
        const savedVisibility = localStorage.getItem('visibilityPreferences');
        return savedVisibility ? JSON.parse(savedVisibility) : {
            companyName: true,
            authorAddress: false,
            authorPhone: false,
            authorEmail: false,
            siret: false
        };
    };

    const [imageSrc, setImageSrc] = useState<string | null>(localStorage.getItem('profileImage') || null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
        authorCompanyName: '',
        authorAddress: '',
        authorPhone: '',
        authorEmail: '',
        siret: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [visibility, setVisibility] = useState(loadVisibilityPreferences);
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


    const toggleVisibility = (field: keyof typeof visibility) => {
        setVisibility((prev: any) => {
            const newVisibility = { ...prev, [field]: !prev[field] };
            return newVisibility;
        });
    };
    const maskEmail = (email: string) => {
        const [localPart, domain] = email.split('@');
        const maskedLocalPart = localPart.replace(/./g, '*');
        return `${maskedLocalPart}@${domain}`;
    };

    const maskPhone = (phone: string) => {
        const phoneNumber = phone.replace(/\D/g, '');
        const visiblePart = phoneNumber.slice(-4);
        const maskedPart = phoneNumber.slice(0, -4).replace(/\d/g, '*');

        return `${maskedPart}${visiblePart}`;
    };
    const handleSave = () => {
        localStorage.setItem('companyInfos', JSON.stringify([companyInfo]));
        toast.success(t('toast.saveInfo.success'), {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: isDarkMode ? 'dark' : 'light',
        });
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const generateInvoicePDF = (): Promise<Uint8Array> => {
        return new Promise<Uint8Array>((resolve, reject) => {
            const doc = new jsPDF("portrait", "mm", "a4");
            const paymentType = "Iban"; // Valeur dynamique : "iban", "paypal", ou "other"

            // Définir le texte en fonction du mode de paiement
            let paymentText = "";

            if (paymentType === "Iban") {
                paymentText = "Virement bancaire";
            } else if (paymentType === "Paypal") {
                paymentText = "PayPal";
            } else if (paymentType === "Other") {
                paymentText = "Autre";
            }
            // Obtenir les dimensions de la page
            const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
            const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm

            // 1. En-tête (Bandeau supérieur)
            doc.setFillColor("F2F2F2");
            doc.rect(0, 0, pageWidth, 60, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.text("Facture", pageWidth - 10, 20, { align: "right" });
            doc.setTextColor("#4D4D4D");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text("N° de facture : #0000", pageWidth - 10, 30, { align: "right" });
            doc.text(`${selectedDate}`, pageWidth - 10, 35, { align: "right" });
            doc.text(`Mode de paiement : ${paymentText}`, pageWidth - 10, 40, { align: "right" });
            doc.text(` ${paymentInfo.type || 'Non défini'} : ${paymentInfo.details || 'Non renseigné'}`, pageWidth - 10, 45, { align: "right" });
            if (imageSrc) {
                doc.addImage(imageSrc, "PNG", 10, 10, 50, 40);
            } else {
                doc.setFillColor("150"); // Gris foncé
                doc.rect(10, 10, 40, 40, "F");
            }
            doc.setTextColor("");
            // 2. Section client et auteur
            // Informations du client (à gauche)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Facturé à :", 10, 75);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(13);
            doc.setTextColor("#4D4D4D");
            doc.text("Entreprise Client\nAdresse Client\nTel client\nEmail", 10, 82);
            doc.setTextColor("");

            // Informations de l'auteur (à droite)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Facture de :", pageWidth - 10, 75, { align: "right" });
            doc.setTextColor("#4D4D4D");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(13);
            doc.text(
                `${companyInfo.authorCompanyName}\n${companyInfo.authorAddress}\n${companyInfo.authorPhone}\n${companyInfo.authorEmail}\nSIRET: ${companyInfo.siret}`,
                pageWidth - 10, 82, { align: "right" }
            );
            doc.setTextColor("");

            // 3. Tableau des lignes de facturation


            // Sauvegarde du PDF
            // const date = new Date().toISOString().slice(0, 10);
            // doc.save(`facture_${date}.pdf`);
            const pdfBytes = doc.output("arraybuffer");
            resolve(new Uint8Array(pdfBytes));
        })
    }
    const handleDownloadPDF = async () => {
        try {
            setIsLoading(true);
            const pdfBytes = await generateInvoicePDF();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const date = new Date().toISOString().slice(0, 10);
            link.download = `facture_${date}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsLoading(false);
            toast.success(t('toast.downloadPDF.success'), {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: isDarkMode ? 'dark' : 'light',
            });
        } catch (error) {
            console.error('Erreur lors du téléchargement du PDF:', error);
            setIsLoading(false);
            toast.error(t('toast.downloadPDF.error'), {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: isDarkMode ? 'dark' : 'light',
            });
        }
    };

    useEffect(() => {
        // Crée un délai (debounce) pour attendre avant de régénérer
        const timeout = setTimeout(async () => {
            try {
                const pdfBytes = await generateInvoicePDF(); // Regénère le PDF
                const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(pdfBlob);

                // Mets à jour l'iframe avec le nouveau PDF
                setPdfPreviewUrl(blobUrl);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du PDF :', error);
            }
        }, 2000); // Ajuste le délai selon tes besoins (ex. 2 secondes)

        // Nettoie le timeout précédent s'il y a un nouveau changement
        return () => clearTimeout(timeout);
    }, [companyInfo, paymentInfo, selectedDate]);

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

    const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e?.target.value);
    }

    return (
        <>

            <Flex direction={'column'} className='invoice__container' height={"100%"} >
                <Flex className='invoice__navigation' height={'40px'} width={'fit-content'}>
                    <Box>Invoice, nav</Box>
                </Flex >
                <Flex p={'8'} direction={'row'} justify={'between'} gap={'4'} align={'center'} className='invoice__content' height={"100%"}>

                    <ScrollArea className='scrollbox actionbar_left' scrollbars={"vertical"} >
                        <Flex direction="column" align={'center'} gap={'8'} >

                            <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                <Text size={"2"} weight="bold">Logo</Text>
                                <Flex direction="column" justify={'center'} align={'center'} p={'2'} className='actionbar_left__logo'>
                                    <Avatar size={'8'} variant={"soft"} fallback="heph" src={imageSrc || ''} className='card__img' style={{ width: "100%" }} />
                                </Flex>
                            </Flex>
                            {/* Date */}
                            <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>


                                <Text size={"2"} weight="bold">Date</Text>
                                <Flex direction="column" justify={'center'} align={'center'} p={'2'} className='actionbar_left__date' width={"100%"}>
                                    <Flex direction="column" width="100%">
                                        <Flex mb={'4'} position="relative" display="flex" justify="between" overflow="hidden" className='button__date__container' p={"1"}>
                                            <Flex justify={'center'} onClick={() => setIsAutoDate(true)} className={`button__date ${isAutoDate ? "active" : ""}`} p={"1"}> {t('features.invoice.date.today')}</Flex>
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


                                <Text size={"2"} weight="bold">payement</Text>
                                <Flex direction="column" justify={'center'} align={'center'} p={'2'} className='actionbar_left__date' width={"100%"}>
                                    <Flex direction="column" width="100%">
                                        <PaymentSelection onPaymentChange={(type, value) => setPaymentInfo({ type, details: value })} />
                                    </Flex>

                                </Flex>
                            </Flex>
                            {/* auteur */}
                            <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                <Text size={"2"} weight="bold">
                                    author
                                </Text>
                                <Flex direction="column" justify={'center'} align={'center'} p={'2'} className='actionbar_left__author'>
                                    <UserInformation companyInfo={companyInfo} handleChange={handleChange} handleSave={handleSave} boxWidth='100%' flexJustify='center' />

                                </Flex>
                            </Flex>


                            {/* Fin */}
                        </Flex>
                    </ScrollArea>
                    <Flex className='invoice__paper' direction={'column'} justify={'center'} align={'center'} gap={'4'}>
                        <Box height={'840px'} width={'595px'} style={{ "backgroundColor": "aliceblue" }}>
                            <Box height={'840px'} width={'595px'} className='invoice__paper__content pdf-preview-container'>
                                {pdfPreviewUrl && (
                                    <iframe src={`${pdfPreviewUrl}#toolbar=0&zoom=73.6`} width="100%" height="100%" />
                                )}
                            </Box>
                        </Box>
                        <Box>
                            test
                        </Box>
                    </Flex>
                    <Box className='actionbar_right' height={'80%'} width={'14vw'}>
                        <ScrollArea>
                            <Box mt="4" width="100%">
                                <Tooltip content={t('utils.tooltips.downloadpdf')}>
                                    <Button color="blue" variant="soft" className='btncursor' size={'3'} onClick={handleDownloadPDF}>
                                        <Text size="2" weight="regular">{t('utils.downloadpdf')}</Text>
                                    </Button>
                                </Tooltip>
                            </Box>


                        </ScrollArea>
                    </Box>
                </Flex >
            </Flex >
        </>
    );
}
