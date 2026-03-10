import pdfParse from "pdf-parse";

export async function parseResumePdfToText(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  return (data?.text || "").trim();
}

