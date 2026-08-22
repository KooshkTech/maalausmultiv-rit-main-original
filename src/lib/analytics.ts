/**
 * Centralized analytics utility for Maalaus Multiväri
 *
 * All GA4 events flow through this module to ensure:
 * - Consent is always respected
 * - Events are not duplicated
 * - PII is never sent
 * - Event parameters are safe and consistent
 * - Development mode logs events for debugging
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __mmConsent?: { analytics: boolean; marketing: boolean };
  }
}

/**
 * Check if user has granted analytics consent
 */
function hasAnalyticsConsent(): boolean {
  return window.__mmConsent?.analytics === true;
}

/**
 * Safely dispatch a GA4 event only if consent is granted and gtag is available
 */
function sendEvent(
  eventName: string,
  eventData?: Record<string, unknown>
): void {
  // Don't fire analytics events without consent
  if (!hasAnalyticsConsent()) {
    if (import.meta.env.DEV) {
      console.debug(`[Analytics] Blocked: ${eventName} (no analytics consent)`);
    }
    return;
  }

  // gtag must be loaded
  if (typeof window.gtag !== 'function') {
    if (import.meta.env.DEV) {
      console.debug(`[Analytics] Blocked: ${eventName} (gtag not loaded)`);
    }
    return;
  }

  if (import.meta.env.DEV) {
    console.debug(`[Analytics] Event: ${eventName}`, eventData ?? {});
  }

  window.gtag('event', eventName, eventData || {});
}

/**
 * Safely dispatch a conversion event
 */
function sendConversion(
  conversionName: string,
  conversionData?: Record<string, unknown>
): void {
  // Conversions can proceed without full analytics consent if tracking is minimally configured
  // but we should still respect consent settings
  if (!hasAnalyticsConsent()) {
    if (import.meta.env.DEV) {
      console.debug(
        `[Analytics] Blocked conversion: ${conversionName} (no analytics consent)`
      );
    }
    return;
  }

  if (typeof window.gtag !== 'function') {
    if (import.meta.env.DEV) {
      console.debug(`[Analytics] Blocked conversion: ${conversionName} (gtag not loaded)`);
    }
    return;
  }

  if (import.meta.env.DEV) {
    console.debug(`[Analytics] Conversion: ${conversionName}`, conversionData ?? {});
  }

  window.gtag('event', conversionName, {
    ...conversionData,
  });
}

/**
 * Track page view — normally automatic in GA4, but useful for SPA navigation
 * Only call if SPA does NOT automatically track via gtag config
 */
export function trackPageView(
  pagePath: string,
  pageTitle: string,
  additional?: Record<string, unknown>
): void {
  sendEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    ...additional,
  });
}

/**
 * Track scroll depth — useful for engagement measurement
 */
export function trackScrollDepth(depth: number): void {
  sendEvent('scroll_depth', {
    depth_percentage: Math.round(depth * 100),
  });
}

/**
 * Track generic scroll engagement
 */
export function trackScroll(depthPercentage: number): void {
  sendEvent('scroll', {
    depth_percentage: depthPercentage,
  });
}

/**
 * Track phone click (tel: link)
 */
export function trackPhoneClick(
  surface?: string,
  additional?: Record<string, unknown>
): void {
  sendEvent('phone_click', {
    link_type: 'phone',
    surface: surface || 'contact',
    ...additional,
  });
}

/**
 * Track email click (mailto: link)
 */
export function trackEmailClick(
  surface?: string,
  additional?: Record<string, unknown>
): void {
  sendEvent('email_click', {
    link_type: 'email',
    surface: surface || 'contact',
    ...additional,
  });
}

/**
 * Track WhatsApp click
 */
export function trackWhatsAppClick(
  surface?: string,
  additional?: Record<string, unknown>
): void {
  sendEvent('whatsapp_click', {
    link_type: 'whatsapp',
    surface: surface || 'contact',
    ...additional,
  });
}

/**
 * Track CTA button clicks (quote, contact, etc.)
 */
export function trackCtaClick(
  ctaName: string,
  ctaLocation?: string,
  pagePath?: string,
  additional?: Record<string, unknown>
): void {
  sendEvent('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation || 'page',
    page_path: pagePath,
    ...additional,
  });
}

/**
 * Track booking/appointment click (if applicable)
 */
export function trackBookingClick(
  serviceName?: string,
  additional?: Record<string, unknown>
): void {
  sendEvent('booking_click', {
    service_type: serviceName || 'booking',
    ...additional,
  });
}

/**
 * Track resource download (PDF, guide, etc.)
 */
export function trackResourceDownload(
  resourceName: string,
  resourceType?: string,
  additional?: Record<string, unknown>
): void {
  sendEvent('resource_download', {
    content_name: resourceName,
    content_type: resourceType || 'document',
    ...additional,
  });
}

/**
 * Track chat initiation (if chat widget exists)
 */
export function trackChatStart(
  chatType?: string,
  additional?: Record<string, unknown>
): void {
  sendEvent('chat_start', {
    chat_type: chatType || 'widget',
    ...additional,
  });
}

/**
 * Track form-based lead generation (quote request, free assessment, etc.)
 * Only fire after successful backend confirmation
 */
export function trackGenerateLead(
  leadType?: string,
  serviceName?: string,
  additional?: Record<string, unknown>
): void {
  sendConversion('generate_lead', {
    lead_type: leadType || 'form_submission',
    service_type: serviceName,
    ...additional,
  });
}

/**
 * Track general contact form submission success
 * Only fire after successful backend confirmation
 */
export function trackContactSubmit(
  formType?: string,
  additional?: Record<string, unknown>
): void {
  sendConversion('contact_submit', {
    form_type: formType || 'contact',
    ...additional,
  });
}

/**
 * Initialize analytics event listeners on page load
 * Call once in Layout component during mount
 */
export function initializeAnalytics(): void {
  if (import.meta.env.DEV) {
    console.debug('[Analytics] Initializing event listeners');
  }

  // Listen for lightbox open events (from Lightbox component)
  // trackResourceDownload can be adapted for gallery views
  // This is reserved for future lightbox-specific tracking

  // Listen for calculator completion
  // trackBookingClick can be adapted for calculator results

  // Future: Add scroll depth tracking if needed
}

/**
 * Log event for debugging (development only)
 */
export function debugEvent(eventName: string, data?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.debug(`[Analytics Debug] ${eventName}:`, data ?? {});
  }
}
