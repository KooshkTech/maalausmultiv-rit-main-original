import {
  conditionMultipliers,
  plannerPricing,
  plannerSurfaces,
  preparationPrices,
  qualityMultipliers,
  type PaintQuality,
  type SurfaceCondition,
} from '@/data/paintPlanner';

export type SurfaceSelection = {
  id?: string;
  surfaceKey: string;
  amount: number;
  colorHex: string;
  condition: SurfaceCondition;
  quality: PaintQuality;
  coats: 1 | 2;
  difficultAccess: boolean;
  preparations: Array<keyof typeof preparationPrices>;
  polygon?: Array<{ x: number; y: number }>;
};

export type Estimate = {
  low: number;
  high: number;
  subtotal: number;
  workUnits: number;
  currency: string;
  pricingVersion: string;
};

const round10 = (n: number) => Math.max(0, Math.round(n / 10) * 10);

export function calculatePlannerEstimate(selections: SurfaceSelection[]): Estimate {
  let subtotal = 0;
  let workUnits = 0;

  for (const selection of selections) {
    const definition = plannerSurfaces.find((item) => item.key === selection.surfaceKey);
    if (!definition) continue;

    const amount = Math.max(0, Number.isFinite(selection.amount) ? selection.amount : 0);
    workUnits += amount;

    let line = amount * definition.baseRate;
    line *= conditionMultipliers[selection.condition] ?? 1;
    line *= qualityMultipliers[selection.quality] ?? 1;
    if (selection.coats === 2) line *= plannerPricing.secondCoatMultiplier;
    if (selection.difficultAccess) line *= plannerPricing.difficultAccessMultiplier;

    if (definition.unit === 'm2') {
      const prepPerUnit = selection.preparations.reduce(
        (sum, preparation) => sum + (preparationPrices[preparation] ?? 0),
        0,
      );
      line += amount * prepPerUnit;
    } else {
      const prepFactor = selection.preparations.length * 0.08;
      line *= 1 + prepFactor;
    }

    subtotal += line;
  }

  subtotal = Math.max(plannerPricing.minimumJob, subtotal);
  return {
    subtotal: round10(subtotal),
    low: round10(subtotal * plannerPricing.estimateLowMultiplier),
    high: round10(subtotal * plannerPricing.estimateHighMultiplier),
    workUnits: Math.round(workUnits * 10) / 10,
    currency: plannerPricing.currency,
    pricingVersion: plannerPricing.pricingVersion,
  };
}

function pdfEscape(text: string) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/([\\()])/g, '\\$1');
}

export function downloadSimpleProjectPdf({
  projectTitle,
  city,
  estimate,
  selections,
}: {
  projectTitle: string;
  city: string;
  estimate: Estimate;
  selections: SurfaceSelection[];
}) {
  const lines = [
    'MAALAUS MULTIVARI - MAALAUSSUUNNITELMA',
    '',
    `Projekti: ${projectTitle || 'Oma maalaussuunnitelma'}`,
    `Sijainti: ${city || 'Ei annettu'}`,
    `Alustava hinta-arvio: ${estimate.low}-${estimate.high} EUR`,
    '',
    'Valitut pinnat:',
    ...selections.map((selection) => {
      const def = plannerSurfaces.find((surface) => surface.key === selection.surfaceKey);
      return `- ${def?.label ?? selection.surfaceKey}: ${selection.amount} ${def?.unit === 'piece' ? 'kpl' : 'm2'}, vari ${selection.colorHex}`;
    }),
    '',
    'Arvio on suuntaa-antava. Lopullinen tarjous vahvistetaan kohteen,',
    'pintojen kunnon, materiaalien ja tyon todellisen laajuuden perusteella.',
    '',
    'maalausmultivari.fi | info@maalausmultivari.fi | 040 242 9650',
  ];

  const stream = lines
    .map((line, index) => `BT /F1 ${index === 0 ? 16 : 10} Tf 50 ${800 - index * 20} Td (${pdfEscape(line)}) Tj ET`)
    .join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `maalaussuunnitelma-${Date.now()}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
