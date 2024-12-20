// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import '../css/invoice.css';
// import { Avatar, Box, Button, Flex, Heading, IconButton, Progress, ScrollArea, Skeleton, Text, TextField, Tooltip } from '@radix-ui/themes';
// import { AccentColor, Client, CompanyInfo } from '@/type/hephai';
// import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';
// import jsPDF from 'jspdf';
// import { motion } from "motion/react"
// import UserInformation from '@/components/UserInformation';
// import PaymentSelection from '@/components/Invoice/PaymentSelection';
// import ClientsList from '@/components/ClientsList';
// import { useClientContext } from '@/components/ClientContext';
// import Popup from '@/components/Popup';
// import ClientForm from '@/components/ClientForm';
// import autoTable from 'jspdf-autotable';
// import { Lock, Trash, Trash2Icon } from 'lucide-react';


// export const Invoice = () => {
//     const { t } = useTranslation();
//     const { selectedClient, setSelectedClient } = useClientContext();
//     const [selectedDate, setSelectedDate] = useState<string>('');
//     const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
//     const [isDarkMode, setIsDarkMode] = useState<boolean>(() => { const savedMode = localStorage.getItem('isDarkMode'); return savedMode ? JSON.parse(savedMode) : false; });
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [refreshKey, setRefreshKey] = useState(0);
//     const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
//     const [paymentInfo, setPaymentInfo] = useState({ type: '', details: '', });
//     const [isLoading, setIsLoading] = useState(false);
//     const [imageSrc, setImageSrc] = useState<string | null>(localStorage.getItem('profileImage') || null);
//     const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ authorCompanyName: '', authorAddress: '', authorPhone: '', authorEmail: '', siret: '', });
//     const [clientInfo, setClientInfo] = useState<Client>({ companyName: '', address: '', phone: '', email: '', bookmarks: false, id: '' });
//     const [clients, setClients] = useState<Client[]>(() => { const storedClients = localStorage.getItem('clients'); return storedClients ? JSON.parse(storedClients) : []; });


//     useEffect(() => {
//         const storedInfo = localStorage.getItem('companyInfos');
//         if (storedInfo) {
//             try {
//                 const parsedInfo = JSON.parse(storedInfo);
//                 if (Array.isArray(parsedInfo) && parsedInfo.length > 0) {
//                     setCompanyInfo(parsedInfo[0]);
//                 }
//             } catch (error) {
//                 console.error('Erreur lors du parsing de companyInfos depuis localStorage:', error);
//             }
//         }
//     }, []);

//     const handleSave = () => {
//         localStorage.setItem('companyInfos', JSON.stringify([companyInfo]));
//         toast.success(t('toast.saveInfo.success'), {
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: isDarkMode ? 'dark' : 'light',
//         });
//     };
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setCompanyInfo(prevState => ({
//             ...prevState,
//             [name]: value,
//         }));
//     };
//     const addLogoToPDF = async (doc: any, imageSrc: string | null, pageHeight: number) => {
//         if (!imageSrc) {
//             doc.setFillColor("150");
//             doc.rect(10, 10, 40, 40, "F");
//             return;
//         }
//         const img = new Image();
//         img.src = imageSrc;
//         try {
//             await img.decode();
//             // console.log("Image chargée :", img.width, img.height);

//             const scaleFactor1 = 7;
//             const scaleFactor2 = 4;
//             const scaleFactor = Math.max(img.width, img.height) >= 512 ? scaleFactor1 : scaleFactor2;

//             const imgWidth = pageHeight / scaleFactor;
//             const imgHeight = (img.height / img.width) * imgWidth;
//             doc.addImage(img, "PNG", 10, 10, imgWidth, imgHeight);
//         } catch (err) {
//             console.error("Erreur lors du chargement ou de l'ajout de l'image :", err);
//         }
//     };
//     const handleInsertClient = (client: Client) => {
//         setClientInfo(client);
//         toast.success(`Client "${client.companyName}" inséré avec succès !`, {
//             autoClose: 3000,
//         });
//     };
//     const generateInvoicePDF = async (): Promise<Uint8Array> => {

//         const doc = new jsPDF("portrait", "mm", "a4");
//         const paymentType = "Iban";
//         let paymentText = "";
//         if (paymentType === "Iban") {
//             paymentText = "Virement bancaire";
//         } else if (paymentType === "Paypal") {
//             paymentText = "PayPal";
//         } else if (paymentType === "Other") {
//             paymentText = "Autre";
//         }
//         const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
//         const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
//         const tableStartX = 10; // Position horizontale du texte à gauche
//         const tableEndX = pageWidth - 10; // Position horizontale du texte à droite
//         const tableWidth = tableEndX - tableStartX; // Largeur totale du tableau
//         // 1. En-tête (Bandeau supérieur)
//         doc.setFillColor("F2F2F2");
//         doc.rect(0, 0, pageWidth, 60, "F");
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(24);
//         doc.text("Facture", pageWidth - 10, 20, { align: "right" });
//         doc.setTextColor("#4D4D4D");
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(12);
//         doc.text("N° de facture : #0000", pageWidth - 10, 30, { align: "right" });
//         doc.text(`${selectedDate}`, pageWidth - 10, 35, { align: "right" });
//         doc.text(`Mode de paiement : ${paymentText}`, pageWidth - 10, 40, { align: "right" });
//         doc.text(` ${paymentInfo.type || 'Non défini'} : ${paymentInfo.details || 'Non renseigné'}`, pageWidth - 10, 45, { align: "right" });

//         await addLogoToPDF(doc, imageSrc, pageHeight);
//         doc.setTextColor("");
//         // 2. Section client et auteur
//         // Informations du client (à gauche)
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(16);
//         doc.text("Facturé à :", 10, 75);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(13);
//         doc.setTextColor("#4D4D4D");
//         doc.text(`${clientInfo.companyName}\n${clientInfo.address}\n${clientInfo.phone}\n${clientInfo.email}`, 10, 82);
//         doc.setTextColor("");

//         // Informations de l'auteur (à droite)
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(16);
//         doc.text("Facture de :", pageWidth - 10, 75, { align: "right" });
//         doc.setTextColor("#4D4D4D");
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(13);
//         doc.text(
//             `${companyInfo.authorCompanyName}\n${companyInfo.authorAddress}\n${companyInfo.authorPhone}\n${companyInfo.authorEmail}\nSIRET: ${companyInfo.siret}`,
//             pageWidth - 10, 82, { align: "right" }
//         );
//         doc.setTextColor("");

//         // En-tête du tableau
//         const fixedColumns = [
//             { header: 'Produit', dataKey: 'product' },
//             { header: 'Total', dataKey: 'total' }
//         ];

//         // Colonnes combinées (fixe + dynamique)
//         const columns = [
//             fixedColumns[0],
//             ...dynamicColumns,
//             fixedColumns[1]
//         ];
//         autoTable(doc, {
//             head: [columns.map(col => col.header)],
//             body: rows.map((row: { [x: string]: any; }) => columns.map(col => row[col.dataKey] || '')),
//             margin: { left: tableStartX, right: 10 },
//             startY: 110,
//             theme: 'grid', // Utilise un thème de base avec bordures
//             styles: {
//                 lineColor: [0, 0, 0], // Couleur des bordures en noir
//                 lineWidth: 0.5, // Épaisseur des bordures
//                 halign: 'center', // Centrer le texte dans les cellules
//             },
//             headStyles: {
//                 fillColor: [0, 0, 0], // Couleur de fond du bandeau (noir)
//                 textColor: [255, 255, 255], // Couleur du texte (blanc)
//                 fontStyle: 'bold', // Texte en gras
//             },
//             alternateRowStyles: {
//                 lineWidth: 0.5,
//                 fillColor: [255, 255, 255], // Couleur des lignes impaires (blanc)
//             },
//             tableLineColor: [0, 0, 0], // Bordure de tableau en noir
//             tableLineWidth: 0.5,
//         });
//         // FIN

//         const pdfBytes = doc.output("arraybuffer");
//         return new Uint8Array(pdfBytes);

//     }
//     const handleDownloadPDF = async () => {
//         try {
//             setIsLoading(true);
//             const pdfBytes = await generateInvoicePDF();
//             const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//             const link = document.createElement('a');
//             link.href = URL.createObjectURL(blob);
//             const date = new Date().toISOString().slice(0, 10);
//             link.download = `facture_${date}.pdf`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             setIsLoading(false);
//             toast.success(t('toast.downloadPDF.success'), {
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: isDarkMode ? 'dark' : 'light',
//             });
//         } catch (error) {
//             console.error('Erreur lors du téléchargement du PDF:', error);
//             setIsLoading(false);
//             toast.error(t('toast.downloadPDF.error'), {
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: isDarkMode ? 'dark' : 'light',
//             });
//         }
//     };
//     const [formData, setFormData] = useState<{ [key: string]: string }>({
//         product: "",
//         total: "",
//     });
//     const [dynamicColumns, setDynamicColumns] = useState(() => {
//         const savedColumns = localStorage.getItem("invoiceColumns");
//         return savedColumns ? JSON.parse(savedColumns) : [];
//     });

//     const [rows, setRows] = useState(() => {
//         const savedRows = localStorage.getItem("invoiceRows");
//         return savedRows ? JSON.parse(savedRows) : [
//             { product: "Produit A", total: "20€" },
//             { product: "Produit B", total: "15€" },
//         ];
//     });

//     useEffect(() => {
//         localStorage.setItem("invoiceColumns", JSON.stringify(dynamicColumns));
//         localStorage.setItem("invoiceRows", JSON.stringify(rows));
//     }, [dynamicColumns, rows]);

//     const addDynamicColumn = () => {
//         const newColumn = {
//             header: `Colonne ${dynamicColumns.length + 1}`,
//             dataKey: `col${dynamicColumns.length + 1}`,
//         };
//         setDynamicColumns([...dynamicColumns, newColumn]);
//         setRows(rows.map((row: { [x: string]: any; }) => ({ ...row, [newColumn.dataKey]: "" })));
//     };

//     const handleEditColumn = (index: any, newHeader: any) => {
//         const updatedColumns = [...dynamicColumns];
//         updatedColumns[index].header = newHeader;
//         setDynamicColumns(updatedColumns);
//     };

//     useEffect(() => {
//         const timeout = setTimeout(async () => {
//             try {
//                 const pdfBytes = await generateInvoicePDF();
//                 const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//                 const blobUrl = URL.createObjectURL(pdfBlob);

//                 setPdfPreviewUrl(blobUrl);
//             } catch (error) {
//                 console.error('Erreur lors de la mise à jour du PDF :', error);
//             }
//         }, 2000);
//         return () => clearTimeout(timeout);
//     }, [clientInfo, companyInfo, paymentInfo, selectedDate, dynamicColumns, rows]);

//     useEffect(() => {
//         if (isAutoDate) {
//             const updateDate = () => {
//                 const today = new Date();
//                 setSelectedDate(today.toISOString().split('T')[0]);
//             };
//             updateDate();
//             const intervalId = setInterval(updateDate, 1000);
//             return () => clearInterval(intervalId);
//         }
//     }, [isAutoDate]);
//     useEffect(() => {
//         setClientInfo(selectedClient || clientInfo);
//     }, [selectedClient]);

//     const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSelectedDate(e?.target.value);
//     }

//     const handleDeleteClient = (email: string) => {
//         const updatedClients = clients.filter((client) => client.email !== email);
//         localStorage.setItem('clients', JSON.stringify(updatedClients));
//         setClients(updatedClients);
//     };
//     const handleEditClient = (updatedClient: Client) => {
//         const savedClients = JSON.parse(localStorage.getItem('clients') || '[]') as Client[];
//         const updatedClients = savedClients.map(client =>
//             client.email === updatedClient.email ? updatedClient : client
//         );
//         localStorage.setItem('clients', JSON.stringify(updatedClients));
//         setClients(updatedClients); // Met à jour l'état si nécessaire
//     };


//     const removeColumn = (indexToRemove: number) => {
//         const columnToRemove = dynamicColumns[indexToRemove].dataKey;

//         // Met à jour les colonnes dynamiques
//         const updatedColumns = dynamicColumns.filter((_: any, index: number) => index !== indexToRemove);
//         setDynamicColumns(updatedColumns);

//         // Supprime les données de cette colonne dans chaque ligne
//         const updatedRows = rows.map((row: { [x: string]: any; }) => {
//             const { [columnToRemove]: _, ...rest } = row; // Supprime la clé correspondante
//             return rest;
//         });
//         setRows(updatedRows);
//     };
//     const addRowToTable = () => {
//         if (!formData.product || !formData.total) {
//             toast.error("Les champs Produit et Total sont obligatoires.");
//             return;
//         }

//         const newRow = {
//             product: formData.product,
//             total: formData.total,
//             ...dynamicColumns.reduce((acc: { [x: string]: string; }, col: { dataKey: string | number; }) => {
//                 acc[col.dataKey] = formData[col.dataKey] || "";
//                 return acc;
//             }, {}),
//         };

//         setRows([...rows, newRow]); // Ajoute la nouvelle ligne
//         setFormData({ product: "", total: "" }); // Réinitialise le formulaire
//     };


//     return (
//         <>

//             <Flex direction={'column'} className='invoice__container' height={"100%"}>
//                 {/* <Flex className='invoice__navigation' height={'40px'} width={'fit-content'}>
//                     <Box>Invoice, nav</Box>
//                 </Flex > */}
//                 <Flex p={'8'} direction={'row'} justify={'between'} gap={'4'} align={'center'} className='invoice__content' height={"100%"}>

//                     <ScrollArea className='scrollbox actionbar_left' scrollbars={"vertical"} >
//                         <Flex direction="column" align={'center'} gap={'8'} >

//                             <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
//                                 <Text size={"2"} weight="bold">Logo</Text>
//                                 <Flex direction="column" justify={'center'} align={'center'} p={'2'} className='actionbar_left__logo'>
//                                     <Avatar size={'8'} variant={"soft"} fallback="heph" src={imageSrc || ''} className='card__img' style={{ width: "100%" }} />
//                                 </Flex>
//                             </Flex>
//                             {/* Date */}
//                             <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>


//                                 <Text size={"2"} weight="bold">Date</Text>
//                                 <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
//                                     <Flex direction="column" width="100%">
//                                         <Flex mb={'4'} position="relative" display="flex" justify="between" overflow="hidden" className='button__date__container' p={"1"}>
//                                             <Flex justify={'center'} onClick={() => setIsAutoDate(true)} className={`button__date ${isAutoDate ? "active" : ""}`} p={"1"}> {t('features.invoice.date.today')}</Flex>
//                                             <Flex justify={'center'} onClick={() => setIsAutoDate(false)} className={`button__date ${!isAutoDate ? "active" : ""}`} p={"1"}>{t('features.invoice.date.otherDay')}</Flex>
//                                             <Box className="button__date__indicator" style={{}}></Box>
//                                         </Flex>
//                                         <Box width={"100%"}>

//                                             {isAutoDate ? (
//                                                 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
//                                                     <Button disabled style={{ width: "100%" }}>
//                                                         {selectedDate}
//                                                     </Button>
//                                                 </motion.div>
//                                             ) : (
//                                                 <motion.input type="date" value={selectedDate} onChange={handleCustomDate} className="datepicker" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }} />
//                                             )}

//                                         </Box>
//                                     </Flex>

//                                 </Flex>
//                             </Flex>
//                             {/* payement */}
//                             <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>


//                                 <Text size={"2"} weight="bold">payement</Text>
//                                 <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
//                                     <Flex direction="column" width="100%">
//                                         <PaymentSelection onPaymentChange={(type, value) => setPaymentInfo({ type, details: value })} />
//                                     </Flex>

//                                 </Flex>
//                             </Flex>
//                             {/* auteur */}
//                             <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
//                                 <Text size={"2"} weight="bold">
//                                     author
//                                 </Text>
//                                 <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__author'>
//                                     <UserInformation companyInfo={companyInfo} handleChange={handleChange} handleSave={handleSave} boxWidth='100%' flexJustify='center' />

//                                 </Flex>
//                             </Flex>
//                             {/* client */}
//                             <Flex direction="column" align="center" gap="4" width="100%">
//                                 <Text size="2" weight="bold">Informations Client</Text>
//                                 <Flex direction="column" gap="2" width="100%">
//                                     <ClientForm clientInfo={selectedClient} handleChange={handleChange} handleSave={handleSave} boxWidth='100%' />
//                                     {/* <Button onClick={() => setIsPopupOpen(true)}>{t('buttons.popup')}</Button> */}
//                                     <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
//                                         <ClientsList key={refreshKey} onInsertClient={handleInsertClient} onDeleteClient={handleDeleteClient} clients={clients} onEditClient={handleEditClient} />
//                                     </Popup>
//                                 </Flex>
//                             </Flex>
//                             {/* Fin */}
//                         </Flex>
//                     </ScrollArea>
//                     <Flex className='invoice__paper' direction={'column'} justify={'center'} align={'center'} gap={'4'}>
//                         <Box height={'840px'} width={'595px'} style={{ "backgroundColor": "aliceblue" }}>
//                             <Box height={'840px'} width={'595px'} className='invoice__paper__content pdf-preview-container'>
//                                 {pdfPreviewUrl && (
//                                     <iframe src={`${pdfPreviewUrl}#toolbar=0&zoom=73.6`} width="100%" height="100%" />
//                                 )}
//                             </Box>
//                         </Box>
//                         <Box>
//                             {/* test */}
//                         </Box>
//                     </Flex>

//                     <ScrollArea className='scrollbox actionbar_right' scrollbars={"vertical"}>
//                         <Flex direction="column" align={'center'} gap={'8'} width={"100%"} >

//                             {/* colonne */}
//                             <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
//                                 <Text size={"2"} weight="bold">Gestion produit</Text>
//                                 <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
//                                     <Flex direction="column" width="100%" gap="3">
//                                         <TextField.Root placeholder="Produit" size="2" disabled>
//                                             <TextField.Slot side={"right"}>
//                                                 <Lock size={14} />
//                                             </TextField.Slot>
//                                         </TextField.Root>
//                                         {dynamicColumns.map((col: any, index: number) => (
//                                             <Box key={col.dataKey} width={"100%"} >
//                                                 <TextField.Root placeholder="" size="2" value={col.header} onChange={(e) => handleEditColumn(index, e.target.value)}>
//                                                     <TextField.Slot side={'right'}>
//                                                         <IconButton onClick={() => removeColumn(index)} variant="ghost" size={"1"}>
//                                                             <Trash2Icon size={14} />
//                                                         </IconButton>
//                                                     </TextField.Slot>
//                                                 </TextField.Root>

//                                             </Box>
//                                         ))}
//                                         <TextField.Root placeholder="Total" size="2" disabled>
//                                             <TextField.Slot side={"right"}>
//                                                 <Lock size={14} />
//                                             </TextField.Slot>
//                                         </TextField.Root>
//                                         <Button variant="soft" onClick={addDynamicColumn}>
//                                             <Text size="2" weight="regular">Ajouter une colonne</Text>
//                                         </Button>

//                                     </Flex>
//                                     <Flex direction="column" gap="2" width="100%">
//                                         {/* Champ obligatoire : Produit */}
//                                         <TextField.Root placeholder="Produit" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} />
//                                         {/* Champs dynamiques pour les colonnes */}
//                                         {dynamicColumns.map((col) => (
//                                             <TextField.Root key={col.dataKey} placeholder={col.header} value={formData[col.dataKey] || ""} onChange={(e) => setFormData({ ...formData, [col.dataKey]: e.target.value })} />
//                                         ))}
//                                         {/* Champ obligatoire : Total */}
//                                         <TextField.Root placeholder="Total" value={formData.total} onChange={(e) => setFormData({ ...formData, total: e.target.value })} />
//                                         {/* Bouton Ajouter */}
//                                         <Button variant="soft" onClick={() => addRowToTable()}>
//                                             Ajouter un produit
//                                         </Button>
//                                     </Flex>
//                                     <Box>


//                                     </Box>
//                                 </Flex>
//                             </Flex>
//                             {/* template */}
//                             <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
//                                 <Text size={"2"} weight="bold">payement</Text>
//                                 <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
//                                     <Flex direction="column" width="100%">
//                                         <PaymentSelection onPaymentChange={(type, value) => setPaymentInfo({ type, details: value })} />
//                                     </Flex>

//                                 </Flex>
//                             </Flex>
//                             <Tooltip content={t('utils.tooltips.downloadpdf')}>
//                                 <Button color="blue" variant="soft" className='btncursor' size={'3'} onClick={handleDownloadPDF}>
//                                     <Text size="2" weight="regular">{t('utils.downloadpdf')}</Text>
//                                 </Button>
//                             </Tooltip>
//                         </Flex>
//                     </ScrollArea>
//                 </Flex >
//             </Flex >
//         </>
//     );
// }


//! update small version

import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../css/invoice.css';
import { Avatar, Box, Button, Flex, Heading, IconButton, Progress, ScrollArea, Skeleton, Text, TextField, Tooltip } from '@radix-ui/themes';
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


export const Invoice = () => {
    const defaultClient: Client = { companyName: '', address: '', phone: '', email: '', bookmarks: false, id: '', };
    const { columns, rows, setRows, addColumn, removeColumn } = useDynamicTable();
    const [dynamicColumns, setDynamicColumns] = useState(() => { const savedData = localStorage.getItem("invoiceData"); return savedData ? JSON.parse(savedData).dynamicColumns : []; });
    // const { pdfPreviewUrl, downloadPDF, isLoading } = useInvoicePDF({ clientInfo, companyInfo, paymentInfo, rows, columns: dynamicColumns, selectedDate, imageSrc });

    const { t } = useTranslation();
    const { selectedClient, setSelectedClient } = useClientContext();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [paymentInfo, setPaymentInfo] = useState({ type: '', details: '', });
    const [isLoading, setIsLoading] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(localStorage.getItem('profileImage') || null);
    const [clients, setClients] = useState<Client[]>(() => { const storedClients = localStorage.getItem('clients'); return storedClients ? JSON.parse(storedClients) : []; });
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ authorCompanyName: '', authorAddress: '', authorPhone: '', authorEmail: '', siret: '', });
    const [clientInfo, setClientInfo] = useState<Client>(() => selectedClient || defaultClient);
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
    const addLogoToPDF = async (doc: any, imageSrc: string | null, pageHeight: number) => {
        if (!imageSrc) {
            doc.setFillColor("150");
            doc.rect(10, 10, 40, 40, "F");
            return;
        }
        const img = new Image();
        img.src = imageSrc;
        try {
            await img.decode();
            // console.log("Image chargée :", img.width, img.height);

            const scaleFactor1 = 7;
            const scaleFactor2 = 4;
            const scaleFactor = Math.max(img.width, img.height) >= 512 ? scaleFactor1 : scaleFactor2;

            const imgWidth = pageHeight / scaleFactor;
            const imgHeight = (img.height / img.width) * imgWidth;
            doc.addImage(img, "PNG", 10, 10, imgWidth, imgHeight);
        } catch (err) {
            console.error("Erreur lors du chargement ou de l'ajout de l'image :", err);
        }
    };
    const handleInsertClient = (client: Client) => {
        setClientInfo(client);
        toast.success(`Client "${client.companyName}" inséré avec succès !`, {
            autoClose: 3000,
        });
    };
    const generateInvoicePDF = async (): Promise<Uint8Array> => {

        const doc = new jsPDF("portrait", "mm", "a4");
        const paymentType = "Iban";
        let paymentText = "";
        if (paymentType === "Iban") {
            paymentText = "Virement bancaire";
        } else if (paymentType === "Paypal") {
            paymentText = "PayPal";
        } else if (paymentType === "Other") {
            paymentText = "Autre";
        }
        const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
        const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
        const tableStartX = 10; // Position horizontale du texte à gauche
        const tableEndX = pageWidth - 10; // Position horizontale du texte à droite
        const tableWidth = tableEndX - tableStartX; // Largeur totale du tableau
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

        await addLogoToPDF(doc, imageSrc, pageHeight);
        doc.setTextColor("");
        // 2. Section client et auteur
        // Informations du client (à gauche)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Facturé à :", 10, 75);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(13);
        doc.setTextColor("#4D4D4D");
        doc.text(`${clientInfo.companyName}\n${clientInfo.address}\n${clientInfo.phone}\n${clientInfo.email}`, 10, 82);
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

        // En-tête du tableau
        const fixedColumns = [
            { header: 'Produit', dataKey: 'product' },
            { header: 'Total', dataKey: 'total' }
        ];

        // Colonnes combinées (fixe + dynamique)
        const columns = [
            fixedColumns[0],
            ...dynamicColumns,
            fixedColumns[1]
        ];
        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: rows.map((row: { [x: string]: any; }) => columns.map(col => row[col.dataKey] || '')),
            margin: { left: tableStartX, right: 10 },
            startY: 110,
            theme: 'grid', // Utilise un thème de base avec bordures
            styles: {
                lineColor: [0, 0, 0], // Couleur des bordures en noir
                lineWidth: 0.5, // Épaisseur des bordures
                halign: 'center', // Centrer le texte dans les cellules
            },
            headStyles: {
                fillColor: [0, 0, 0], // Couleur de fond du bandeau (noir)
                textColor: [255, 255, 255], // Couleur du texte (blanc)
                fontStyle: 'bold', // Texte en gras
            },
            alternateRowStyles: {
                lineWidth: 0.5,
                fillColor: [255, 255, 255], // Couleur des lignes impaires (blanc)
            },
            tableLineColor: [0, 0, 0], // Bordure de tableau en noir
            tableLineWidth: 0.5,
        });
        // FIN

        const pdfBytes = doc.output("arraybuffer");
        return new Uint8Array(pdfBytes);

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
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        product: "",
        total: "",
    });

    useEffect(() => {
        localStorage.setItem("invoiceData", JSON.stringify({ dynamicColumns, rows }));
    }, [dynamicColumns, rows]);

    const addDynamicColumn = () => {
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

    // useEffect(() => {
    //     const timeout = setTimeout(async () => {
    //         try {
    //             const pdfBytes = await generateInvoicePDF();
    //             const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    //             const blobUrl = URL.createObjectURL(pdfBlob);

    //             setPdfPreviewUrl(blobUrl);
    //         } catch (error) {
    //             console.error('Erreur lors de la mise à jour du PDF :', error);
    //         }
    //     }, 2000);
    //     return () => clearTimeout(timeout);
    // }, [clientInfo, companyInfo, paymentInfo, selectedDate, dynamicColumns, rows]);

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

    const addRowToTable = () => {
        if (!formData.product || !formData.total) {
            toast.error("Les champs Produit et Total sont obligatoires.");
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

        setRows([...rows, newRow]); // Ajoute la nouvelle ligne
        setFormData({ product: "", total: "" }); // Réinitialise le formulaire
    };

    return (
        <>

            <Flex direction={'column'} className='invoice__container' height={"100%"}>
                {/* <Flex className='invoice__navigation' height={'40px'} width={'fit-content'}>
                    <Box>Invoice, nav</Box>
                </Flex > */}
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
                                <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
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
                                <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
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
                                <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__author'>
                                    <UserInformation companyInfo={companyInfo} handleChange={handleChange} handleSave={handleSave} boxWidth='100%' flexJustify='center' />

                                </Flex>
                            </Flex>
                            {/* client */}
                            <Flex direction="column" align="center" gap="4" width="100%">
                                <Text size="2" weight="bold">Informations Client</Text>
                                <Flex direction="column" gap="2" width="100%">
                                    <ClientForm clientInfo={selectedClient} handleChange={handleChange} handleSave={handleSave} boxWidth='100%' />
                                    {/* <Button onClick={() => setIsPopupOpen(true)}>{t('buttons.popup')}</Button> */}
                                    <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                                        <ClientsList key={refreshKey} onInsertClient={handleInsertClient} onDeleteClient={handleDeleteClient} clients={clients} onEditClient={handleEditClient} />
                                    </Popup>
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
                    </Flex>

                    <ScrollArea className='scrollbox actionbar_right' scrollbars={"vertical"}>
                        <Flex direction="column" align={'center'} gap={'8'} width={"100%"} >
                            <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                <Text size={"2"} weight="bold">Gestion produit</Text>
                                <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
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
                                            <Text size="2" weight="regular">Ajouter une colonne</Text>
                                        </Button>

                                    </Flex>
                                    <Flex direction="column" gap="2" width="100%">
                                        {/* Champ obligatoire : Produit */}
                                        <TextField.Root placeholder="Produit" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} />
                                        {/* Champs dynamiques pour les colonnes */}
                                        {dynamicColumns.map((col: any) => (
                                            <TextField.Root key={col.dataKey} placeholder={col.header} value={formData[col.dataKey] || ""} onChange={(e) => setFormData({ ...formData, [col.dataKey]: e.target.value })} />
                                        ))}
                                        {/* Champ obligatoire : Total */}
                                        <TextField.Root placeholder="Total" value={formData.total} onChange={(e) => setFormData({ ...formData, total: e.target.value })} />
                                        {/* Bouton Ajouter */}
                                        <Button variant="soft" onClick={() => addRowToTable()}>
                                            Ajouter un produit
                                        </Button>
                                    </Flex>
                                    <Box>


                                    </Box>
                                </Flex>
                            </Flex>
                            {/* template */}
                            <Flex direction="column" align={'center'} gap={'4'} width={"100%"}>
                                <Text size={"2"} weight="bold">payement</Text>
                                <Flex direction="column" justify={'center'} align={'center'} className='actionbar_left__date' width={"100%"}>
                                    <Flex direction="column" width="100%">
                                        <PaymentSelection onPaymentChange={(type, value) => setPaymentInfo({ type, details: value })} />
                                    </Flex>

                                </Flex>
                            </Flex>
                            <Tooltip content={t('utils.tooltips.downloadpdf')}>
                                {/* <Button color="blue" variant="soft" className='btncursor' size={'3'} onClick={handleDownloadPDF}>
                                    <Text size="2" weight="regular">{t('utils.downloadpdf')}</Text>
                                </Button> */}
                            </Tooltip>
                        </Flex>
                    </ScrollArea>
                </Flex >
            </Flex >
        </>
    );
}
