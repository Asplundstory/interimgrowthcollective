import jsPDF from "jspdf";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface SignedDocumentData {
  title: string;
  content: string;
  signed_at: string | null;
  signed_by: string | null;
  signer_ip?: string | null;
}

export function generateSignedDocumentPdf(doc: SignedDocumentData): void {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(doc.title, margin, yPosition);
  yPosition += 12;

  // Divider line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Document content
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  // Clean content from HTML tags and split into lines
  const cleanContent = doc.content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

  const lines = pdf.splitTextToSize(cleanContent, contentWidth);

  for (const line of lines) {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.text(line, margin, yPosition);
    yPosition += 6;
  }

  // Signature section at the bottom
  yPosition = Math.max(yPosition + 20, pageHeight - 50);
  
  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = pageHeight - 50;
  }

  // Signature box
  pdf.setDrawColor(0, 150, 0);
  pdf.setFillColor(240, 255, 240);
  pdf.roundedRect(margin, yPosition - 5, contentWidth, 40, 3, 3, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(0, 100, 0);
  pdf.text("DIGITALT SIGNERAT", margin + 5, yPosition + 3);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(50, 50, 50);

  if (doc.signed_by) {
    pdf.text(`Signerat av: ${doc.signed_by}`, margin + 5, yPosition + 11);
  }

  if (doc.signed_at) {
    const signedDate = new Date(doc.signed_at);
    const formattedDate = format(signedDate, "d MMMM yyyy 'kl.' HH:mm:ss", { locale: sv });
    pdf.text(`Tidsstämpel: ${formattedDate}`, margin + 5, yPosition + 18);
    pdf.text(`UTC: ${signedDate.toISOString()}`, margin + 5, yPosition + 25);
  }

  if (doc.signer_ip) {
    pdf.text(`IP-adress: ${doc.signer_ip}`, margin + 5, yPosition + 32);
  }

  // Footer with verification notice
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    "Detta dokument har signerats digitalt via IGC:s dokumentsystem.",
    margin,
    pageHeight - 10
  );

  // Download the PDF
  const filename = `${doc.title.replace(/[^a-zA-Z0-9åäöÅÄÖ\s-]/g, "").replace(/\s+/g, "-")}_signerat.pdf`;
  pdf.save(filename);
}
