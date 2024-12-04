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

export const Invoice = () => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => { const savedMode = localStorage.getItem('isDarkMode'); return savedMode ? JSON.parse(savedMode) : false; });
    const [isLoadingPDF, setIsLoadingPDF] = useState(true);

    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
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

            // Obtenir les dimensions de la page
            const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
            const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm

            // 1. En-tête (Bandeau supérieur)
            doc.setFillColor("F2F2F2"); // Couleur gris clair
            doc.rect(0, 0, pageWidth, 60, "F"); // Bandeau en haut
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.text("Facture", pageWidth - 10, 20, { align: "right" }); // Titre aligné à droite
            doc.setFontSize(10);
            doc.text("N° de facture : #0000", pageWidth - 10, 30, { align: "right" });
            doc.text(`${selectedDate}`, pageWidth - 10, 35, { align: "right" });

            // Logo de l'auteur
            if (imageSrc) {
                doc.addImage(imageSrc, "PNG", 10, 10, 40, 40); // Logo en haut à gauche
            } else {
                doc.setFillColor("150"); // Gris foncé
                doc.rect(10, 10, 40, 40, "F");
            }

            // 2. Section client et auteur
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);

            // Informations du client (à gauche)
            doc.text("Facturé à :", 10, 75);
            doc.text("Entreprise Client\nAdresse Client\nTel client\nEmail", 10, 80);

            // Informations de l'auteur (à droite)
            doc.text("Facture de :", pageWidth - 20, 75, { align: "right" });
            doc.text(
                `${companyInfo.authorCompanyName}\n${companyInfo.authorAddress}\n${companyInfo.authorPhone}\n${companyInfo.authorEmail}\nSIRET: ${companyInfo.siret}`,
                pageWidth - 20, 80, { align: "right" }
            );
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

    // useEffect(() => {
    //     const fetchPDF = async () => {
    //         setIsLoadingPDF(true);
    //         const pdfBytes = await generateInvoicePDF();
    //         const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    //         const blobUrl = URL.createObjectURL(pdfBlob);
    //         localStorage.setItem('pdfPreviewUrl', blobUrl);
    //         setPdfPreviewUrl(blobUrl);
    //         setIsLoadingPDF(false);
    //     };
    //     const timeout = setTimeout(() => {
    //         fetchPDF();
    //     }, 100);

    //     return () => clearTimeout(timeout);
    // }, [companyInfo]);

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

    const toggleDateMode = () => {
        setIsAutoDate(!isAutoDate);
    };
    const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e?.target.value);
    }
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Décalage entre chaque animation des enfants
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
    };

    return (
        <>

            <Flex direction={'column'} className='invoice__container' height={"100%"} >
                <Flex className='invoice__navigation' height={'40px'} width={'fit-content'}>
                    <Box>Invoice, nav</Box>
                </Flex >
                <Flex p={'8'} direction={'row'} justify={'between'} gap={'4'} align={'center'} className='invoice__content' height={"100%"}>

                    <motion.div variants={itemVariants}>
                        <Box className='actionbar_left' height={'80%'} width={'14vw'}>
                            <ScrollArea className='scrollbox'>
                                <Flex direction="column" align={'center'} gap={'8'} >

                                    <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                        <Text size={"2"} weight="bold">Logo</Text>
                                        <Flex direction="column" justify={'center'} align={'center'} p={'2'} className='actionbar_left__logo'>
                                            <Avatar size={'8'} variant={"soft"} fallback="heph" src={imageSrc || ''} className='card__img' />
                                        </Flex>
                                    </Flex>
                                    {/* Date */}
                                    <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>

                                        <motion.div variants={itemVariants}>

                                            <Text size={"2"} weight="bold">Date</Text>
                                        </motion.div>
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
                                    {/* auteur */}
                                    <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                        <Text size={"2"} weight="bold">
                                            author
                                        </Text>
                                        <Flex direction="column" justify={'center'} align={'center'} p={'2'} className='actionbar_left__author'>
                                            {isLoading ? (
                                                <>
                                                    <Skeleton width="100px" height="20px" />
                                                    <Skeleton width="200px" height="16px" />
                                                    <Skeleton width="150px" height="16px" />
                                                    <Skeleton width="180px" height="16px" />
                                                    <Skeleton width="120px" height="16px" />
                                                </>
                                            ) : companyInfo ? (
                                                <>
                                                    <motion.div
                                                        initial="hidden"
                                                        animate="visible"
                                                        variants={containerVariants}
                                                        className="form-container"
                                                    >
                                                        <Flex direction="row" gap="4" justify={'center'} width="100%" height="fit-content" wrap="wrap">
                                                            <Box width="100%" >
                                                                <motion.div variants={itemVariants}>

                                                                    <TextField.Root placeholder="CompanyName" name="authorCompanyName" onChange={handleChange} value={companyInfo.authorCompanyName} size="2" type={visibility.companyName ? 'text' : 'password'}>
                                                                        <TextField.Slot side={'right'}>
                                                                            <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('companyName')}>
                                                                                {visibility.companyName ? (
                                                                                    <EyeOpenIcon height="14" width="14" />
                                                                                ) : (
                                                                                    <EyeClosedIcon height="14" width="14" />
                                                                                )}
                                                                            </IconButton>
                                                                        </TextField.Slot>
                                                                    </TextField.Root>
                                                                </motion.div>
                                                            </Box>
                                                            <Box width="100%" >
                                                                <motion.div variants={itemVariants}>

                                                                    <TextField.Root placeholder="Adress" name="authorAddress" onChange={handleChange} value={companyInfo.authorAddress} size="2" type={visibility.authorAddress ? 'text' : 'password'}>
                                                                        <TextField.Slot side={'right'}>
                                                                            <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('authorAddress')}>
                                                                                {visibility.authorAddress ? (
                                                                                    <EyeOpenIcon height="14" width="14" />
                                                                                ) : (
                                                                                    <EyeClosedIcon height="14" width="14" />
                                                                                )}
                                                                            </IconButton>
                                                                        </TextField.Slot>
                                                                    </TextField.Root>
                                                                </motion.div>
                                                            </Box>
                                                            <Box width="100%">
                                                                <motion.div variants={itemVariants}>

                                                                    <TextField.Root placeholder="Phone" name="authorPhone" onChange={handleChange} value={visibility.authorPhone ? companyInfo.authorPhone : maskPhone(companyInfo.authorPhone)} size="2" type="tel">
                                                                        <TextField.Slot side={'right'}>
                                                                            <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('authorPhone')}>
                                                                                {visibility.authorPhone ? (
                                                                                    <EyeOpenIcon height="14" width="14" />
                                                                                ) : (
                                                                                    <EyeClosedIcon height="14" width="14" />
                                                                                )}
                                                                            </IconButton>
                                                                        </TextField.Slot>
                                                                    </TextField.Root>
                                                                </motion.div>
                                                            </Box>
                                                            <Box width="100%">
                                                                <motion.div variants={itemVariants}>

                                                                    <TextField.Root placeholder="Email" name="authorEmail" onChange={handleChange} value={visibility.authorEmail ? companyInfo.authorEmail : maskEmail(companyInfo.authorEmail)} size="2" type="email">
                                                                        <TextField.Slot side={'right'}>
                                                                            <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('authorEmail')}>
                                                                                {visibility.authorEmail ? (
                                                                                    <EyeOpenIcon height="14" width="14" />
                                                                                ) : (
                                                                                    <EyeClosedIcon height="14" width="14" />
                                                                                )}
                                                                            </IconButton>
                                                                        </TextField.Slot>
                                                                    </TextField.Root>
                                                                </motion.div>
                                                            </Box>
                                                            <Box width="100%">
                                                                <motion.div variants={itemVariants}>

                                                                    <TextField.Root placeholder="Siret" name="siret" onChange={handleChange} value={companyInfo.siret} size="2" type={visibility.siret ? 'text' : 'password'}>
                                                                        <TextField.Slot side={'right'}>
                                                                            <IconButton size="1" variant="ghost" onClick={() => toggleVisibility('siret')}>
                                                                                {visibility.siret ? (
                                                                                    <EyeOpenIcon height="14" width="14" />
                                                                                ) : (
                                                                                    <EyeClosedIcon height="14" width="14" />
                                                                                )}
                                                                            </IconButton>
                                                                        </TextField.Slot>
                                                                    </TextField.Root>
                                                                </motion.div>
                                                            </Box>
                                                            <motion.div variants={itemVariants}>
                                                                <Tooltip content={t('utils.tooltips.savedata')}>
                                                                    <Button color={AccentColor as any} variant="soft" className='btncursor' size={'3'} onClick={handleSave} >
                                                                        <Text size="2" weight={'regular'}>{t('utils.savedata')}</Text>
                                                                    </Button>
                                                                </Tooltip>
                                                            </motion.div>
                                                        </Flex>
                                                    </motion.div>
                                                </>
                                            ) : (
                                                <Text size="2" color="gray">Aucune information trouvée</Text>
                                            )}
                                        </Flex>
                                    </Flex>


                                    {/* Fin */}
                                </Flex>
                            </ScrollArea>
                        </Box >
                    </motion.div>
                    <Flex className='invoice__paper' direction={'column'} justify={'center'} align={'center'} gap={'4'}>
                        <Box height={'840px'} width={'595px'} style={{ "backgroundColor": "aliceblue" }}>
                            {/* {isLoadingPDF ? (
                            <Skeleton>
                                <Box height={'840px'} width={'595px'} className='invoice__paper__content pdf-preview-container' ></Box>
                            </Skeleton>
                        ) : (

                            <Box height={'840px'} width={'595px'} className='invoice__paper__content pdf-preview-container' >
                                {pdfPreviewUrl && (

                                    <>
                                        <iframe src={`${pdfPreviewUrl}#toolbar=0&zoom=73.6`} width="100%" height="100%" />
                                    </>
                                )}
                            </Box>
                        )} */}
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
