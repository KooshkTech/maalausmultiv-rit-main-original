import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, PaintRoller, ChevronDown, Brush, ArrowRight } from 'lucide-react';
import { company } from '@/data/company';
import { getPaintingServices, getCleaningServices } from '@/data/services';

const navLinks = [
  { to: '/palvelut', label: 'Palvelut', hasMega: true },
  { to: '/palvelualueet', label: 'Alueet' },
  { to: '/toimialat', label: 'Toimialat' },
  { to: '/projektit', label: 'Referenssit' },
  { to: '/yhteistyossa', label: 'Meistä' },
  { to: '/yhteystiedot', label: 'Yhteystiedot' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaMobileOpen, setMegaMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
    setMegaMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const popularPainting = getPaintingServices().slice(0, 4);
  const popularCleaning = getCleaningServices().slice(0, 4);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-soft backdrop-blur-md' : 'bg-white/90 backdrop-blur-sm'}`}>
      <nav className="container-base flex h-16 items-center justify-between lg:h-20">
        <Link to="/" className="flex items-center gap-2.5" aria-label={company.name}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-white shadow-soft"><PaintRoller className="h-5 w-5" /></span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-extrabold text-navy-900">Maalaus Multiväri</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">Maalaus · Siivous</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => link.hasMega ? (
            <li key={link.to} className="relative">
              <button type="button" onClick={() => setMegaOpen((v) => !v)} className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${megaOpen || location.pathname.startsWith('/palvelut') ? 'bg-navy-50 text-navy-900' : 'text-navy-700 hover:bg-navy-50 hover:text-navy-900'}`} aria-expanded={megaOpen}>
                {link.label}<ChevronDown className={`h-4 w-4 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
              {megaOpen && (
                <div className="absolute left-1/2 top-full mt-2 w-[600px] -translate-x-1/2 rounded-2xl border border-navy-100 bg-white p-5 shadow-lift">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Link to="/palvelut" onClick={() => setMegaOpen(false)} className="mb-2 flex items-center gap-2 font-bold text-navy-900"><PaintRoller className="h-4 w-4 text-orange-600" />Maalaus</Link>
                      {popularPainting.map((s) => <Link key={s.slug} to={`/palvelut/${s.slug}`} onClick={() => setMegaOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-navy-600 hover:bg-navy-50 hover:text-navy-900">{s.title}</Link>)}
                      <Link to="/palvelut" onClick={() => setMegaOpen(false)} className="mt-1 flex items-center gap-1 px-3 py-2 text-sm font-bold text-orange-600">Kaikki maalauspalvelut <ArrowRight className="h-3.5 w-3.5" /></Link>
                    </div>
                    <div>
                      <Link to="/palvelut/siivous" onClick={() => setMegaOpen(false)} className="mb-2 flex items-center gap-2 font-bold text-navy-900"><Brush className="h-4 w-4 text-orange-600" />Siivous</Link>
                      {popularCleaning.map((s) => <Link key={s.slug} to={`/palvelut/${s.slug}`} onClick={() => setMegaOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-navy-600 hover:bg-navy-50 hover:text-navy-900">{s.title}</Link>)}
                      <Link to="/palvelut/siivous" onClick={() => setMegaOpen(false)} className="mt-1 flex items-center gap-1 px-3 py-2 text-sm font-bold text-orange-600">Kaikki siivouspalvelut <ArrowRight className="h-3.5 w-3.5" /></Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ) : (
            <li key={link.to}><NavLink to={link.to} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-navy-50 text-navy-900' : 'text-navy-700 hover:bg-navy-50 hover:text-navy-900'}`}>{link.label}</NavLink></li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={company.phoneHref} className="flex items-center gap-2 text-sm font-semibold text-navy-800 hover:text-orange-600"><Phone className="h-4 w-4" />{company.phone}</a>
          <Link to="/yhteystiedot" className="btn-primary">Pyydä tarjous</Link>
        </div>

        <button type="button" onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-lg text-navy-800 lg:hidden" aria-label="Valikko" aria-expanded={open}>{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-navy-100 bg-white shadow-lift">
          <div className="container-base max-h-[calc(100vh-4rem)] overflow-y-auto px-5 py-4">
            <div className="mb-4 grid grid-cols-2 gap-2">
              <a href={company.phoneHref} className="flex items-center justify-center gap-2 rounded-xl bg-navy-50 py-3 text-sm font-bold text-navy-800"><Phone className="h-4 w-4" />Soita</a>
              <Link to="/yhteystiedot" className="btn-primary justify-center">Pyydä tarjous</Link>
            </div>
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => link.hasMega ? (
                <li key={link.to}>
                  <button type="button" onClick={() => setMegaMobileOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">Palvelut<ChevronDown className={`h-5 w-5 transition ${megaMobileOpen ? 'rotate-180' : ''}`} /></button>
                  {megaMobileOpen && <div className="grid gap-1 px-2 pb-2">
                    <Link to="/palvelut" className="rounded-lg bg-navy-50 px-4 py-3 text-sm font-bold text-navy-900">Kaikki palvelut</Link>
                    <Link to="/palvelut/siivous" className="rounded-lg px-4 py-3 text-sm font-semibold text-navy-700 hover:bg-navy-50">Siivouspalvelut</Link>
                    {popularPainting.slice(0, 3).map((s) => <Link key={s.slug} to={`/palvelut/${s.slug}`} className="rounded-lg px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50">{s.title}</Link>)}
                    {popularCleaning.slice(0, 3).map((s) => <Link key={s.slug} to={`/palvelut/${s.slug}`} className="rounded-lg px-4 py-2.5 text-sm text-navy-600 hover:bg-navy-50">{s.title}</Link>)}
                  </div>}
                </li>
              ) : <li key={link.to}><NavLink to={link.to} className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">{link.label}</NavLink></li>)}
              <li><Link to="/kustannuslaskuri" className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">Kustannuslaskuri</Link></li>
              <li><Link to="/arvostelut" className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">Arvostelut</Link></li>
              <li><Link to="/blogi" className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">Blogi</Link></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
