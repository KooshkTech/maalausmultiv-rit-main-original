type PdfImage = { bytes: Uint8Array; width: number; height: number };

export type PainterPdfInput = {
  title: string;
  customerLines: string[];
  colorLines: string[];
  coverageLines: string[];
  beforeDataUrl: string;
  afterDataUrl: string;
};

const encoder = new TextEncoder();

function ascii(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/[()\\]/g, (match) => `\\${match}`);
}

function dataUrlToBytes(dataUrl: string) {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function imageFromDataUrl(dataUrl: string, width: number, height: number): PdfImage {
  return { bytes: dataUrlToBytes(dataUrl), width, height };
}

function concat(parts: Uint8Array[]) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function imageObject(image: PdfImage) {
  return concat([
    encoder.encode(`<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`),
    image.bytes,
    encoder.encode('\nendstream'),
  ]);
}

export async function createPainterSummaryPdf(input: PainterPdfInput): Promise<Blob> {
  const beforeImage = new Image();
  const afterImage = new Image();
  await Promise.all([
    new Promise<void>((resolve, reject) => { beforeImage.onload = () => resolve(); beforeImage.onerror = reject; beforeImage.src = input.beforeDataUrl; }),
    new Promise<void>((resolve, reject) => { afterImage.onload = () => resolve(); afterImage.onerror = reject; afterImage.src = input.afterDataUrl; }),
  ]);

  const before = imageFromDataUrl(input.beforeDataUrl, beforeImage.naturalWidth, beforeImage.naturalHeight);
  const after = imageFromDataUrl(input.afterDataUrl, afterImage.naturalWidth, afterImage.naturalHeight);

  const textLines = [input.title, '', ...input.customerLines, '', 'Selected paint colors', ...input.colorLines, '', 'Coverage estimate', ...input.coverageLines];
  const textOps = textLines.slice(0, 24).map((line, index) => `BT /F1 ${index === 0 ? 18 : 9} Tf 36 ${558 - index * 16} Td (${ascii(line)}) Tj ET`).join('\n');
  const content = `${textOps}\nBT /F1 10 Tf 36 242 Td (Before) Tj ET\nBT /F1 10 Tf 430 242 Td (After) Tj ET\nq 360 0 0 220 36 16 cm /Im1 Do Q\nq 360 0 0 220 430 16 cm /Im2 Do Q`;
  const contentBytes = encoder.encode(content);

  const objects: Uint8Array[] = [
    encoder.encode('<< /Type /Catalog /Pages 2 0 R >>'),
    encoder.encode('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    encoder.encode('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R >> /XObject << /Im1 5 0 R /Im2 6 0 R >> >> /Contents 7 0 R >>'),
    encoder.encode('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'),
    imageObject(before),
    imageObject(after),
    concat([encoder.encode(`<< /Length ${contentBytes.length} >>\nstream\n`), contentBytes, encoder.encode('\nendstream')]),
  ];

  const parts: Uint8Array[] = [encoder.encode('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
  const offsets = [0];
  let cursor = parts[0].length;
  objects.forEach((object, index) => {
    offsets.push(cursor);
    const prefix = encoder.encode(`${index + 1} 0 obj\n`);
    const suffix = encoder.encode('\nendobj\n');
    parts.push(prefix, object, suffix);
    cursor += prefix.length + object.length + suffix.length;
  });

  const xrefOffset = cursor;
  const xref = ['xref', `0 ${objects.length + 1}`, '0000000000 65535 f '];
  for (let i = 1; i <= objects.length; i += 1) xref.push(`${String(offsets[i]).padStart(10, '0')} 00000 n `);
  xref.push('trailer', `<< /Size ${objects.length + 1} /Root 1 0 R >>`, 'startxref', String(xrefOffset), '%%EOF');
  parts.push(encoder.encode(`${xref.join('\n')}\n`));

  return new Blob([concat(parts)], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
