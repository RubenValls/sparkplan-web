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

export function usePDFPrint(): UsePDFPrintReturn {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ✅ Nueva función: Generar PDF como Blob usando jsPDF
  const generatePDFBlob = useCallback(async (element: HTMLElement): Promise<Blob> => {
    setIsGenerating(true);
    setError(null);

    try {
      const contentElement = element.querySelector('[class*="planResult__content"]');
      const footerElement = element.querySelector('[class*="planResult__footer"]');

      if (!contentElement) {
        throw new Error("Plan content not found");
      }

      // Crear contenedor temporal con todos los estilos
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '794px'; // A4 width in pixels (210mm)
      tempContainer.style.background = 'white';
      tempContainer.style.padding = '0';
      
      // Añadir header
      const header = document.createElement('div');
      header.style.cssText = `
        text-align: center;
        padding: 40px 20px;
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        color: white;
        margin: 0;
      `;
      header.innerHTML = `
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px; color: white;">SparkPlan</h1>
        <p style="font-size: 16px; opacity: 0.9; color: white;">Professional Business Plan Generator</p>
      `;
      tempContainer.appendChild(header);

      // Añadir contenido
      const content = document.createElement('div');
      content.style.cssText = 'padding: 40px 60px;';
      content.innerHTML = contentElement.innerHTML;
      tempContainer.appendChild(content);

      // Añadir footer
      if (footerElement) {
        const footer = footerElement.cloneNode(true) as HTMLElement;
        footer.style.cssText = 'padding: 20px 60px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e5e5e5; margin-top: 40px;';
        tempContainer.appendChild(footer);
      }

      document.body.appendChild(tempContainer);

      // Generar canvas con html2canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
      });

      // Eliminar contenedor temporal
      document.body.removeChild(tempContainer);

      // Crear PDF con jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Primera página
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const blob = pdf.output('blob');
      setIsGenerating(false);
      return blob;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to generate PDF");
      setError(error);
      setIsGenerating(false);
      throw error;
    }
  }, []);

  // ✅ Función existente: Imprimir PDF (descargar)
  const printToPDF = useCallback((element: HTMLElement) => {
    setIsPrinting(true);
    setError(null);

    try {
      const contentElement = element.querySelector('[class*="planResult__content"]');
      const footerElement = element.querySelector('[class*="planResult__footer"]');

      if (!contentElement) {
        throw new Error("Plan content not found");
      }

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Failed to open print window. Please allow popups.");
      }

      const styles = extractStyles();

      buildPrintDocument(printWindow, {
        styles,
        content: contentElement.innerHTML,
        footer: footerElement?.outerHTML || buildDefaultFooter(),
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

// ✅ Funciones auxiliares (sin cambios)
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
    <style>
      ${options.styles}
    </style>
    <style>
      ${getCustomPrintStyles()}
    </style>
  `;

  doc.body.innerHTML = `
    <div class="pdf-header">
      <h1>SparkPlan</h1>
      <p>Professional Business Plan Generator</p>
    </div>

    <div class="pdf-content">
      ${options.content}
    </div>

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

    html,
    body { 
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

      html,
      body { 
        margin: 0;
        padding: 0;
      }

      .pdf-header {
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        page-break-after: avoid;
        margin: 0; 
      }

      h1 {
        page-break-after: avoid;
        page-break-inside: avoid;
        margin-top: 0;
      }

      h2 {
        page-break-after: avoid;
        page-break-inside: avoid;
        margin-top: 60px;
      }

      h2:first-child {
        margin-top: 0;
      }

      h3 {
        page-break-after: avoid;
        page-break-inside: avoid;
        margin-top: 40px;
      }

      h4 {
        page-break-after: avoid;
        page-break-inside: avoid;
      }

      table, figure, img {
        page-break-inside: avoid;
      }

      p {
        orphans: 3;
        widows: 3;
      }

      ul, ol {
        page-break-inside: avoid;
      }
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