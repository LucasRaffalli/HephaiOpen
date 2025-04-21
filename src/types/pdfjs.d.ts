declare module "pdfjs-dist/build/pdf" {
  const pdfjsLib: any;
  export default pdfjsLib;
}

declare module "pdfjs-dist/build/pdf.worker.min?url" {
  const workerSrc: string;
  export default workerSrc;
}
