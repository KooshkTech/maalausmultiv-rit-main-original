import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from '@/components/Layout';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('@/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })));
const ServiceLocationPage = lazy(() => import('@/pages/ServiceLocationPage').then((m) => ({ default: m.ServiceLocationPage })));
const CleaningServicesPage = lazy(() => import('@/pages/CleaningServicesPage').then((m) => ({ default: m.CleaningServicesPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage').then((m) => ({ default: m.ReviewsPage })));
const BlogPage = lazy(() => import('@/pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const CostCalculatorPage = lazy(() => import('@/pages/CostCalculatorPage').then((m) => ({ default: m.CostCalculatorPage })));
const CitiesIndexPage = lazy(() => import('@/pages/CitiesIndexPage').then((m) => ({ default: m.CitiesIndexPage })));
const CityPage = lazy(() => import('@/pages/CityPage').then((m) => ({ default: m.CityPage })));
const IndustriesIndexPage = lazy(() => import('@/pages/IndustriesIndexPage').then((m) => ({ default: m.IndustriesIndexPage })));
const IndustryPage = lazy(() => import('@/pages/IndustryPage').then((m) => ({ default: m.IndustryPage })));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const CookiePolicyPage = lazy(() => import('@/pages/CookiePolicyPage').then((m) => ({ default: m.CookiePolicyPage })));
const TermsOfUsePage = lazy(() => import('@/pages/TermsOfUsePage').then((m) => ({ default: m.TermsOfUsePage })));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-orange-500" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
        <Route path="palvelut" element={<Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>} />
        <Route path="palvelut/siivous" element={<Suspense fallback={<PageLoader />}><CleaningServicesPage /></Suspense>} />
        <Route path="palvelut/:serviceSlug/:citySlug" element={<Suspense fallback={<PageLoader />}><ServiceLocationPage /></Suspense>} />
        <Route path="palvelut/:slug" element={<Suspense fallback={<PageLoader />}><ServiceDetailPage /></Suspense>} />
        <Route path="palvelualueet" element={<Suspense fallback={<PageLoader />}><CitiesIndexPage /></Suspense>} />
        <Route path="palvelualueet/:slug" element={<Suspense fallback={<PageLoader />}><CityPage /></Suspense>} />
        <Route path="toimialat" element={<Suspense fallback={<PageLoader />}><IndustriesIndexPage /></Suspense>} />
        <Route path="toimialat/:slug" element={<Suspense fallback={<PageLoader />}><IndustryPage /></Suspense>} />
        <Route path="kustannuslaskuri" element={<Suspense fallback={<PageLoader />}><CostCalculatorPage /></Suspense>} />
        <Route path="yhteistyossa" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
        <Route path="projektit" element={<Suspense fallback={<PageLoader />}><ProjectsPage /></Suspense>} />
        <Route path="arvostelut" element={<Suspense fallback={<PageLoader />}><ReviewsPage /></Suspense>} />
        <Route path="blogi" element={<Suspense fallback={<PageLoader />}><BlogPage /></Suspense>} />
        <Route path="blogi/:slug" element={<Suspense fallback={<PageLoader />}><BlogPostPage /></Suspense>} />
        <Route path="yhteystiedot" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
        <Route path="tietosuojaseloste" element={<Suspense fallback={<PageLoader />}><PrivacyPolicyPage /></Suspense>} />
        <Route path="evastekaytanto" element={<Suspense fallback={<PageLoader />}><CookiePolicyPage /></Suspense>} />
        <Route path="kayttoehdot" element={<Suspense fallback={<PageLoader />}><TermsOfUsePage /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />
      </Route>
    </Routes>
  );
}
