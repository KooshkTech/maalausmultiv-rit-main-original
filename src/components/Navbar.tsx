import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, PaintRoller, Sparkles } from 'lucide-react';
import { company } from '@/data/company';
import { trackPhoneClick } from '@/lib/analytics';

const navLinks = [
  { to: '/palvelut', label: 'Maalaus' },
  { to: '/palvelut/siivous', label: 'Siivous' },
  { to: '/hinnat', label: 'Hinnat' },
  { to: '/projektit', label: 'Referenssit' },
  { to: '/palvelualueet', label: 'Alueet' },
  { to: '/yhteistyossa', label: 'Meistä' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/palvelut'}
                className={({ isActive }) => `rounded-full px-3.5 py-2 text-sm font-medium transition ${isActive ? 'bg-navy-50 text-navy-900' : 'text-navy-700 hover:bg-navy-50 hover:text-navy-900'}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/kamu" className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100">
            <Sparkles className="h-4 w-4" />Kamu Studio
          </Link>
          <a href={company.phoneHref} onClick={() => trackPhoneClick('navbar_desktop')} className="flex items-center gap-2 text-sm font-semibold text-navy-800 hover:text-orange-600">
            <Phone className="h-4 w-4" />{company.phone}
          </a>
          <Link to="/yhteystiedot" className="btn-primary">Pyydä tarjous</Link>
        </div>

        <button type="button" onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-lg text-navy-800 lg:hidden" aria-label="Valikko" aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy-100 bg-white shadow-lift lg:hidden">
          <div className="container-base max-h-[calc(100vh-4rem)] overflow-y-auto px-5 py-4">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <Link to="/palvelut" className="rounded-xl bg-navy-900 px-4 py-3 text-center text-sm font-extrabold text-white">Maalaus</Link>
              <Link to="/palvelut/siivous" className="rounded-xl bg-navy-50 px-4 py-3 text-center text-sm font-extrabold text-navy-900">Siivous</Link>
            </div>
            <Link to="/kamu" className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-orange-50 py-3 text-sm font-extrabold text-orange-700"><Sparkles className="h-5 w-5" />Avaa Kamu Studio</Link>
            <div className="mb-4 grid grid-cols-2 gap-2">
              <a href={company.phoneHref} onClick={() => trackPhoneClick('navbar_mobile')} className="flex items-center justify-center gap-2 rounded-xl bg-navy-50 py-3 text-sm font-bold text-navy-800"><Phone className="h-4 w-4" />Soita</a>
              <Link to="/yhteystiedot" className="btn-primary justify-center">Pyydä tarjous</Link>
            </div>
            <ul className="flex flex-col gap-1">
              {navLinks.slice(2).map((link) => (
                <li key={link.to}><NavLink to={link.to} className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">{link.label}</NavLink></li>
              ))}
              <li><Link to="/varikamu" className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">VäriKamu</Link></li>
              <li><Link to="/maalauslaskuri" className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">Maalauslaskuri</Link></li>
              <li><Link to="/app/login" className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">Oma tili / Kirjaudu</Link></li>
              <li><Link to="/arvostelut" className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">Arvostelut</Link></li>
              <li><Link to="/blogi" className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50">Oppaat ja blogi</Link></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
