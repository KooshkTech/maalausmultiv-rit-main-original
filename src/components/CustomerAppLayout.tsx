import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LogOut, PaintRoller, Palette, UserRound } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export function CustomerAppLayout() {
  const { session, signOut } = useCustomerAuth();
  const location = useLocation();
  const authenticated = Boolean(session);

  return (
    <div className="min-h-screen bg-navy-50/60">
      <Seo
        title="Maalaussuunnittelija"
        description="Maalaus Multivärin asiakassovellus maalaussuunnitelmien tallentamiseen."
        path={location.pathname}
        indexable={false}
      />
      <header className="border-b border-navy-100 bg-white">
        <div className="container-base flex min-h-16 items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Maalaus Multiväri etusivu">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-white"><PaintRoller className="h-5 w-5" /></span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-extrabold text-navy-900 sm:text-base">Maalaus Multiväri</span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-orange-600">Suunnittelija</span>
            </span>
          </Link>

          {authenticated ? (
            <div className="flex items-center gap-2">
              <NavLink to="/app/dashboard" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50 sm:block">Omat suunnitelmat</NavLink>
              <NavLink to="/app/profile" className="flex h-10 w-10 items-center justify-center rounded-xl text-navy-700 hover:bg-navy-50" aria-label="Profiili"><UserRound className="h-5 w-5" /></NavLink>
              <button type="button" onClick={signOut} className="flex h-10 w-10 items-center justify-center rounded-xl text-navy-700 hover:bg-navy-50" aria-label="Kirjaudu ulos"><LogOut className="h-5 w-5" /></button>
            </div>
          ) : (
            <Link to="/paint-studio" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600"><Palette className="h-4 w-4" />Tietoa työkalusta</Link>
          )}
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}

export function CustomerAppGuard() {
  const { session, configured } = useCustomerAuth();
  const location = useLocation();
  if (!configured) return <Navigate to="/app/login?setup=1" replace state={{ from: location.pathname }} />;
  if (!session) return <Navigate to="/app/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
