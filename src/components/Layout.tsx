import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingButtons } from './FloatingButtons';
import { CookieConsent } from './CookieConsent';
import { LeadPopups } from './LeadPopups';
import { Analytics } from './Analytics';
import { initializeAnalytics, trackPageView } from '@/lib/analytics';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      trackPageView(pathname, document.title);
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Analytics />
      <Navbar />
      {/* Navbar is fixed, so every public page needs a reliable top offset.
          On mobile we also reserve space for the sticky call/WhatsApp bar so
          the last controls and footer links are never hidden underneath it. */}
      <main className="flex-1 pt-16 pb-20 sm:pb-0 lg:pt-20">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
      <CookieConsent />
      <LeadPopups />
    </div>
  );
}
