import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Flex, Text, Dialog, Tooltip, Callout } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import PdfMetadataDialog from '@/components/template/PdfMetadataDialog';
import { useTranslation } from 'react-i18next';
import { Progress } from '@radix-ui/themes';
import { DownloadIcon } from '@/components/design/IconsAnimate';
import { motion } from "framer-motion";
import InputFileName from "./InputFileName";
import { usePDF } from '@/context/PDFContext';

const DOWNLOAD_INTERVAL = 50;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

interface InvoicePdfViewerProps {
  pdfUrl: string;
  downloadPDF?: () => void;
  isLoading?: boolean;

}

const InvoicePdfViewer: React.FC<InvoicePdfViewerProps> = ({ pdfUrl, downloadPDF, isLoading, }) => {
  const { t } = useTranslation();
  const { currentPage, setCurrentPage, pdfDoc, setPdfDoc } = usePDF();
  const [warningInvoice, setWarningInvoice] = useState(true);
  const [loadingState, setLoadingState] = useState({
    isCanvasLoading: true,
    isPdfLoading: true,
  });

  const [downloadState, setDownloadState] = useState({
    showDialog: false,
    progress: 0,
    downloadedSize: 0,
    fileSize: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const renderTask = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    const loadPdf = async () => {
      setLoadingState({ ...loadingState, isPdfLoading: true });
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      setPdfDoc(pdf);
      if (currentPage > pdf.numPages) {
        setCurrentPage(1);
      }
      setLoadingState({ ...loadingState, isPdfLoading: false });
    };
    loadPdf();
  }, [pdfUrl, setPdfDoc, currentPage, setCurrentPage]);

  useEffect(() => {
    const getFileSize = async () => {
      try {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        setDownloadState({ ...downloadState, fileSize: blob.size });
      } catch (error) {
        console.error('Erreur lors de la récupération de la taille du fichier:', error);
        setDownloadState({ ...downloadState, fileSize: 0 });
      }
    };
    getFileSize();
  }, [pdfUrl]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const updateLoadingState = (updates: Partial<typeof loadingState>) => {
    setLoadingState(prev => ({ ...prev, ...updates }));
  };

  const updateDownloadState = (updates: Partial<typeof downloadState>) => {
    setDownloadState(prev => ({ ...prev, ...updates }));
  };


  const handleDownload = async () => {
    updateDownloadState({ showDialog: true, progress: 0, downloadedSize: 0 });

    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setDownloadState(prev => {
          const newProgress = prev.progress + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(async () => {
              if (downloadPDF) {
                await downloadPDF();
                setTimeout(() => {
                  updateDownloadState({
                    showDialog: false,
                    progress: 0,
                    downloadedSize: 0
                  });
                }, 2000);
              }
              resolve();
            }, 1000);
            return { ...prev, progress: 100 };
          }
          return {
            ...prev,
            progress: newProgress,
            downloadedSize: (prev.fileSize * newProgress) / 100
          };
        });
      }, DOWNLOAD_INTERVAL);
    });
  };

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    if (renderTask.current) {
      try {
        await renderTask.current.cancel();
        renderTask.current = null;
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (error) {
        console.warn('Erreur lors de l\'annulation de la tâche de rendu précédente:', error);
      }
    }

    updateLoadingState({ isCanvasLoading: true });

    try {
      const dpiScale = window.devicePixelRatio || 1;
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: dpiScale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpiScale}px`;
      canvas.style.height = `${viewport.height / dpiScale}px`;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const newRenderTask = page.render({
        canvasContext: context,
        viewport: viewport,
        intent: 'display',

      });

      renderTask.current = newRenderTask;

      try {
        await newRenderTask.promise;
      } catch (error: any) {
        if (error.name !== 'RenderingCancelledException') {
          console.error('Erreur de rendu:', error);
        }
      } finally {
        if (renderTask.current === newRenderTask) {
          renderTask.current = null;
        }
      }
    } catch (error) {
      console.error('Erreur lors du rendu de la page:', error);
    } finally {
      updateLoadingState({ isCanvasLoading: false });
    }
  }, [pdfDoc, currentPage]);

  useEffect(() => {
    return () => {
      if (renderTask.current) {
        renderTask.current.cancel();
        renderTask.current = null;
      }
    };
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      renderPage();
    }, 100);
    return () => clearTimeout(timeout);
  }, [renderPage]);

  return (
    <Flex direction="column" align="center" justify="center" gap="4" className="InvoicePdfViewerContent">
      {warningInvoice && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }} onAnimationComplete={() => { setTimeout(() => setWarningInvoice(false), 3000); }}>
          <Callout.Root color="orange" role="alert" size={"1"}>
            <Callout.Icon>
              <TriangleAlert />
            </Callout.Icon>
            <Callout.Text>
              {t('features.invoice.warning')}
            </Callout.Text>
          </Callout.Root>
        </motion.div>
      )}

      <motion.canvas ref={canvasRef} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: loadingState.isCanvasLoading ? 0 : 1, scale: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", opacity: { duration: 0.4 } }} className="canvaPdf" />

      <Dialog.Root open={downloadState.showDialog}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Flex direction="column" gap="3">
            <Dialog.Title>{t('download.title')}</Dialog.Title>
            <Dialog.Description>
              <Text size="2">
                {downloadState.progress < 100 ? t('download.message') : t('download.complete')}
              </Text>
            </Dialog.Description>
            <Flex justify="between" align="center">
              <Progress value={downloadState.progress} style={{ flex: 1 }} />
              <Text size="2" style={{ marginLeft: '12px', minWidth: '100px', textAlign: 'right' }}>
                {formatFileSize(downloadState.downloadedSize)} / {formatFileSize(downloadState.fileSize)}
              </Text>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="InvoicePdfViewerButtons">
        <Flex align="center" justify="center" gap="4">
          <motion.div variants={buttonVariants}>
            <Flex align="center" gap="3">
              <Button className='btnCursor' variant="soft" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
                <ChevronLeft size={18} />
              </Button>
              <Text size="2">{currentPage} / {pdfDoc?.numPages}</Text>
              <Button className='btnCursor' variant="soft" onClick={() => setCurrentPage(Math.min(currentPage + 1, pdfDoc?.numPages ?? 1))} disabled={currentPage === pdfDoc?.numPages}>
                <ChevronRight size={18} />
              </Button>
            </Flex>
          </motion.div>

          <motion.div variants={buttonVariants}>
            <PdfMetadataDialog pdfDoc={pdfDoc || undefined} />
          </motion.div>

          <motion.div variants={buttonVariants}>
            <InputFileName />
          </motion.div>

          {downloadPDF && (
            <motion.div variants={buttonVariants}>
              <Tooltip content={t('utils.tooltips.download.pdf')} side="bottom">
                <Button variant="soft" className='btnCursor' onClick={handleDownload} disabled={isLoading}>
                  <Flex align={"center"} gap={"2"}>
                    <DownloadIcon />
                    {t('buttons.download.download')}
                  </Flex>
                </Button>
              </Tooltip>
            </motion.div>
          )}
        </Flex>
      </motion.div>
    </Flex >
  );
};

export default InvoicePdfViewer;
