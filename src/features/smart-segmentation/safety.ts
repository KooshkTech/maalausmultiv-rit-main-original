export type MaskSafetyResult = { safe: boolean; coverage: number; reason?: string };

export function validateGeneratedMask(mask: Uint8Array, maxCoverage = 0.72, minPixels = 80): MaskSafetyResult {
  if (!mask.length) return { safe: false, coverage: 0, reason: 'empty-mask' };
  let selected = 0;
  for (const value of mask) if (value) selected += 1;
  const coverage = selected / mask.length;
  if (selected < minPixels) return { safe: false, coverage, reason: 'mask-too-small' };
  if (coverage > maxCoverage) return { safe: false, coverage, reason: 'mask-too-large' };
  return { safe: true, coverage };
}
