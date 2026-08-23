import { trackBookingClick } from '@/lib/analytics';

/** Dispatch a portfolio lightbox open event. Kept outside component modules so React Fast Refresh remains reliable. */
export function trackPortfolioView() {
  window.dispatchEvent(new Event('lightbox-open'));
}

/** Dispatch a calculator completion event and record the conversion interaction. */
export function trackCalcComplete() {
  trackBookingClick('cost_calculator', { interaction: 'calculator_complete' });
  window.dispatchEvent(new Event('calc-complete'));
}
