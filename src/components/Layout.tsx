import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingButtons } from './FloatingButtons';
import { CookieConsent } from './CookieConsent';
import { LeadPopups } from './LeadPopups';
import { Analytics } from './Analytics';
import { initializeAnalytics } from '@/lib/analytics';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Analytics />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
      <CookieConsent />
      <LeadPopups />
    </div>
  );
}
