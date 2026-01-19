import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface UsePDFPrintReturn {
  printToPDF: (element: HTMLElement) => void;
  generatePDFBlob: (element: HTMLElement) => Promise<Blob>;
  isPrinting: boolean;
  isGenerating: boolean;
  error: Error | null;
}

const PDF_CONFIG = {
  A4_WIDTH_PX: 794,
  A4_WIDTH_MM: 210,
  A4_HEIGHT_MM: 297,
  SCALE: 2,
  IMAGE_QUALITY: 0.95,
  PADDING: {
    HEADER: "40px 20px",
    CONTENT: "40px 60px",
    FOOTER: "20px 60px",
  },
} as const;

const SELECTORS = {
  CONTENT: '[class*="planResult__content"]',
  FOOTER: '[class*="planResult__footer"]',
} as const;

export function usePDFPrint(): UsePDFPrintReturn {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePDFBlob = useCallback(
    async (element: HTMLElement): Promise<Blob> => {
      setIsGenerating(true);
      setError(null);

      try {
        const planContent = extractPlanContent(element);
        const tempContainer = createTempContainer(planContent);
        
        document.body.appendChild(tempContainer);
        const canvas = await renderToCanvas(tempContainer);
        document.body.removeChild(tempContainer);

        const blob = await createPDFFromCanvas(canvas);
        
        setIsGenerating(false);
        return blob;
      } catch (err) {
        const error = err instanceof Error 
          ? err 
          : new Error("Failed to generate PDF");
        setError(error);
        setIsGenerating(false);
        throw error;
      }
    },
    []
  );

  const printToPDF = useCallback((element: HTMLElement) => {
    setIsPrinting(true);
    setError(null);

    try {
      const planContent = extractPlanContent(element);
      const printWindow = openPrintWindow();
      const styles = extractStyles();

      buildPrintDocument(printWindow, {
        styles,
        content: planContent.content,
        footer: planContent.footer,
      });

      waitForDocumentReady(printWindow).then(() => {
        printWindow.print();
        printWindow.close();
        setIsPrinting(false);
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      setIsPrinting(false);
    }
  }, []);

  return {
    printToPDF,
    generatePDFBlob,
    isPrinting,
    isGenerating,
    error,
  };
}

function extractPlanContent(element: HTMLElement) {
  const contentElement = element.querySelector(SELECTORS.CONTENT);
  const footerElement = element.querySelector(SELECTORS.FOOTER);

  if (!contentElement) {
    throw new Error("Plan content not found");
  }

  return {
    content: contentElement.innerHTML,
    footer: footerElement?.outerHTML || buildDefaultFooter(),
  };
}

function createTempContainer(planContent: ReturnType<typeof extractPlanContent>) {
  const container = document.createElement("div");
  
  Object.assign(container.style, {
    position: "absolute",
    left: "-9999px",
    width: `${PDF_CONFIG.A4_WIDTH_PX}px`,
    background: "white",
    padding: "0",
  });

  container.appendChild(createHeader());
  container.appendChild(createContentSection(planContent.content));
  
  const footerElement = createFooterFromHTML(planContent.footer);
  if (footerElement) {
    container.appendChild(footerElement);
  }

  return container;
}

function createHeader() {
  const header = document.createElement("div");
  header.style.cssText = `
    text-align: center;
    padding: ${PDF_CONFIG.PADDING.HEADER};
    background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
    color: white;
    margin: 0;
  `;
  header.innerHTML = `
    <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px; color: white;">SparkPlan</h1>
    <p style="font-size: 16px; opacity: 0.9; color: white;">Professional Business Plan Generator</p>
  `;
  return header;
}

function createContentSection(htmlContent: string) {
  const content = document.createElement("div");
  content.style.cssText = `padding: ${PDF_CONFIG.PADDING.CONTENT};`;
  content.innerHTML = htmlContent;
  return content;
}

function createFooterFromHTML(footerHTML: string) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = footerHTML;
  const footer = tempDiv.firstElementChild as HTMLElement | null;
  
  if (footer) {
    footer.style.cssText = `
      padding: ${PDF_CONFIG.PADDING.FOOTER};
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e5e5e5;
      margin-top: 40px;
    `;
  }
  
  return footer;
}

async function renderToCanvas(element: HTMLElement) {
  return html2canvas(element, {
    scale: PDF_CONFIG.SCALE,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: PDF_CONFIG.A4_WIDTH_PX,
  });
}

async function createPDFFromCanvas(canvas: HTMLCanvasElement) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const imgData = canvas.toDataURL("image/jpeg", PDF_CONFIG.IMAGE_QUALITY);
  const dimensions = calculatePDFDimensions(pdf, canvas);

  addCanvasToPDF(pdf, imgData, dimensions);

  return pdf.output("blob");
}

function calculatePDFDimensions(pdf: jsPDF, canvas: HTMLCanvasElement) {
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  return { pdfWidth, pdfHeight, imgWidth, imgHeight };
}

function addCanvasToPDF(
  pdf: jsPDF,
  imgData: string,
  dimensions: ReturnType<typeof calculatePDFDimensions>
) {
  const { pdfHeight, imgWidth, imgHeight } = dimensions;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage({
    imageData: imgData,
    format: "JPEG",
    x: 0,
    y: position,
    width: imgWidth,
    height: imgHeight,
  });
  
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage({
      imageData: imgData,
      format: "JPEG",
      x: 0,
      y: position,
      width: imgWidth,
      height: imgHeight,
    });
    heightLeft -= pdfHeight;
  }
}

function openPrintWindow() {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Failed to open print window. Please allow popups.");
  }
  return printWindow;
}

function extractStyles(): string {
  return Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

function buildPrintDocument(
  printWindow: Window,
  options: { styles: string; content: string; footer: string }
) {
  const doc = printWindow.document;

  doc.open();
  doc.close();

  doc.head.innerHTML = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SparkPlan - Business Plan</title>
    <style>${options.styles}</style>
    <style>${getCustomPrintStyles()}</style>
  `;

  doc.body.innerHTML = `
    <div class="pdf-header">
      <h1>SparkPlan</h1>
      <p>Professional Business Plan Generator</p>
    </div>
    <div class="pdf-content">${options.content}</div>
    ${options.footer}
  `;
}

function getCustomPrintStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body { 
      margin: 0; 
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: white;
    }

    .pdf-header {
      text-align: center;
      padding: 40px 20px;
      background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
      color: white;
      margin: 0; 
      page-break-after: avoid;
    }

    .pdf-header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      color: white;
    }

    .pdf-header p {
      font-size: 16px;
      opacity: 0.9;
      color: white;
    }

    .pdf-content {
      padding: 0 60px 40px;
      max-width: 900px;
      margin: 40px auto 0;
    }

    .pdf-footer {
      padding: 20px 60px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e5e5e5;
      margin: 40px 60px 0;
      page-break-before: avoid;
    }

    @media print {
      @page :first {
        margin-top: 0;
        margin-bottom: 20mm;
      }

      @page {
        margin: 20mm 0;
        size: A4 portrait;
      }

      .pdf-header {
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        page-break-after: avoid;
        margin: 0; 
      }

      h1, h2, h3, h4 {
        page-break-after: avoid;
        page-break-inside: avoid;
      }

      h2 { margin-top: 60px; }
      h2:first-child { margin-top: 0; }
      h3 { margin-top: 40px; }

      table, figure, img { page-break-inside: avoid; }
      
      p {
        orphans: 3;
        widows: 3;
      }

      ul, ol { page-break-inside: avoid; }
    }
  `;
}

function buildDefaultFooter(): string {
  return `
    <div class="pdf-footer">
      <p>Generated with SparkPlan • ${new Date().toLocaleDateString()}</p>
    </div>
  `;
}

async function waitForDocumentReady(printWindow: Window): Promise<void> {
  const doc = printWindow.document;
  const images = Array.from(doc.images);

  if (images.length === 0) {
    return Promise.resolve();
  }

  const imagePromises = images.map(
    (img) =>
      new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.addEventListener("load", () => resolve());
          img.addEventListener("error", () => resolve());
        }
      })
  );

  await Promise.all(imagePromises);
}