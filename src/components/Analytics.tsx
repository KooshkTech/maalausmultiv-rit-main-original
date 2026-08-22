import { useEffect } from 'react';

/**
 * Analytics integration layer.
 *
 * GA4 is loaded directly from index.html.
 * This component:
 *
 * - Synchronizes GDPR Consent Mode v2 with the GA4 tag
 * - Optionally loads Google Tag Manager
 * - Optionally loads Meta Pixel
 * - Optionally loads Microsoft Clarity
 *
 * GA4 Measurement ID:
 * G-J9TBS9HKFD
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    __mmConsent?: {
      analytics: boolean;
      marketing: boolean;
    };
  }
}

/**
 * Synchronize website cookie consent with Google Consent Mode v2.
 *
 * GA4 itself is initialized in index.html with all storage denied
 * by default. When the user changes cookie preferences, this function
 * updates Google's consent state.
 */
function syncConsentToGtag() {
  if (typeof window.gtag !== 'function') {
    return;
  }

  if (!window.__mmConsent) {
    return;
  }

  const granted = (ok: boolean) => (ok ? 'granted' : 'denied');

  window.gtag('consent', 'update', {
    analytics_storage: granted(window.__mmConsent.analytics),
    ad_storage: granted(window.__mmConsent.marketing),
    ad_user_data: granted(window.__mmConsent.marketing),
    ad_personalization: granted(window.__mmConsent.marketing),
  });
}

export function Analytics() {
  // GA4 is intentionally NOT loaded here.
  // It is loaded directly from index.html.

  const gtmId = import.meta.env.VITE_GTM_ID as string | undefined;
  const pixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
  const clarityId = import.meta.env.VITE_CLARITY_ID as string | undefined;

  /**
   * Sync consent when Analytics mounts and whenever the
   * CookieConsent component dispatches mm-consent-update.
   */
  useEffect(() => {
    syncConsentToGtag();

    const handler = () => {
      syncConsentToGtag();
    };

    window.addEventListener('mm-consent-update', handler);

    return () => {
      window.removeEventListener('mm-consent-update', handler);
    };
  }, []);

  const hasOtherAnalytics = gtmId || pixelId || clarityId;

  if (!hasOtherAnalytics) {
    return null;
  }

  return (
    <>
      {/* ========================================================= */}
      {/* Google Tag Manager                                       */}
      {/* ========================================================= */}

      {gtmId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({
                  'gtm.start': new Date().getTime(),
                  event:'gtm.js'
                });

                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer' ? '&l='+l : '';

                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;

                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}

      {/* ========================================================= */}
      {/* Meta Pixel                                                */}
      {/* ========================================================= */}

      {pixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {
                if(f.fbq)return;

                n=f.fbq=function(){
                  n.callMethod ?
                  n.callMethod.apply(n,arguments) :
                  n.queue.push(arguments)
                };

                if(!f._fbq)f._fbq=n;

                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];

                t=b.createElement(e);
                t.async=!0;
                t.src=v;

                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }
              (window, document, 'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* ========================================================= */}
      {/* Microsoft Clarity                                          */}
      {/* ========================================================= */}

      {clarityId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){
                  (c[a].q=c[a].q||[]).push(arguments)
                };

                t=l.createElement(r);
                t.async=1;
                t.src="https://www.clarity.ms/tag/"+i;

                y=l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t,y);
              })
              (window,document,"clarity","script","${clarityId}");
            `,
          }}
        />
      )}
    </>
  );
}