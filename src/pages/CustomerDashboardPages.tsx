import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, FileText, Loader2, Palette, Plus, UserRound } from 'lucide-react';
import { listProjects, listQuoteRequests, type PaintProjectRecord } from '@/lib/customerAppApi';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export function CustomerDashboardPage() {
  const [projects, setProjects] = useState<PaintProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listProjects().then((rows) => active && setProjects(rows)).catch((err) => active && setError(err instanceof Error ? err.message : 'Projektien lataus epäonnistui.')).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="container-base">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><span className="eyebrow-orange">Asiakassovellus</span><h1 className="mt-3 font-display text-3xl font-extrabold text-navy-900 sm:text-4xl">Omat maalaussuunnitelmat</h1><p className="mt-2 max-w-2xl text-navy-600">Jatka keskeneräistä suunnitelmaa, tarkista hinta-arvio tai aloita uusi sisä-, ulko- tai kattomaalausprojekti.</p></div>
          <Link to="/app/design/new" className="btn-primary shrink-0"><Plus className="h-4 w-4" />Uusi suunnitelma</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <QuickLink to="/app/design/new" icon={Palette} title="Uusi suunnitelma" text="Lataa kuva ja valitse värit." />
          <QuickLink to="/app/estimates" icon={Calculator} title="Hinta-arviot" text="Näe tallennetut hintahaarukat." />
          <QuickLink to="/app/quotes" icon={FileText} title="Tarjouspyynnöt" text="Seuraa lähetettyjä projekteja." />
        </div>

        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold text-navy-900">Tallennetut projektit</h2>
          {loading ? <div className="mt-6 flex items-center gap-2 text-sm text-navy-500"><Loader2 className="h-4 w-4 animate-spin" />Ladataan projekteja…</div> : error ? <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : projects.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-navy-200 bg-white p-8 text-center"><Palette className="mx-auto h-9 w-9 text-orange-500" /><h3 className="mt-3 font-bold text-navy-900">Ei vielä suunnitelmia</h3><p className="mt-1 text-sm text-navy-500">Ensimmäisen suunnitelman tekeminen kestää vain muutaman minuutin.</p><Link to="/app/design/new" className="btn-primary mt-5">Aloita suunnittelu</Link></div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
          )}
        </div>
      </div>
    </section>
  );
}

export function CustomerEstimatesPage() {
  const [projects, setProjects] = useState<PaintProjectRecord[]>([]);
  useEffect(() => { void listProjects().then(setProjects); }, []);
  return <section className="px-5 py-10"><div className="container-base max-w-5xl"><h1 className="font-display text-3xl font-extrabold text-navy-900">Hinta-arviot</h1><p className="mt-2 text-navy-600">Tallennettujen suunnitelmien suuntaa-antavat hintahaarukat. Lopullinen tarjous vahvistetaan aina erikseen.</p><div className="mt-7 space-y-3">{projects.filter((p) => p.estimate_low !== null).map((p) => <Link key={p.id} to={`/app/design/${p.id}`} className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-navy-900">{p.title}</p><p className="text-sm text-navy-500">{p.city || 'Sijainti ei annettu'}</p></div><span className="font-display text-xl font-extrabold text-orange-600">{p.estimate_low}–{p.estimate_high} €</span></Link>)}</div></div></section>;
}

export function CustomerQuotesPage() {
  const [quotes, setQuotes] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void listQuoteRequests().then(setQuotes).catch((err) => setError(err instanceof Error ? err.message : 'Tarjouspyyntöjen lataus epäonnistui.')); }, []);
  return <section className="px-5 py-10"><div className="container-base max-w-5xl"><h1 className="font-display text-3xl font-extrabold text-navy-900">Tarjouspyynnöt</h1><p className="mt-2 text-navy-600">Täällä näet sovelluksesta lähetetyt maalausprojektit.</p>{error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="mt-7 space-y-3">{quotes.length === 0 && !error ? <p className="rounded-2xl bg-white p-6 text-sm text-navy-500">Et ole vielä lähettänyt tarjouspyyntöä suunnittelijasta.</p> : quotes.map((quote) => <div key={String(quote.id)} className="card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold text-navy-900">{String(quote.project_title || 'Maalausprojekti')}</p><p className="mt-1 text-sm text-navy-500">{new Date(String(quote.created_at)).toLocaleDateString('fi-FI')}</p></div><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">{String(quote.status || 'vastaanotettu')}</span></div></div>)}</div></div></section>;
}

export function CustomerProfilePage() {
  const { session } = useCustomerAuth();
  return <section className="px-5 py-10"><div className="container-base max-w-3xl"><div className="card p-6 sm:p-8"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><UserRound className="h-6 w-6" /></span><h1 className="mt-4 font-display text-3xl font-extrabold text-navy-900">Profiili</h1><p className="mt-4 text-sm text-navy-500">Kirjautunut sähköposti</p><p className="mt-1 font-semibold text-navy-900">{session?.user.email || '—'}</p><p className="mt-7 text-sm leading-relaxed text-navy-600">Tilin henkilötietojen korjaamista tai poistamista koskevissa pyynnöissä voit ottaa yhteyttä Maalaus Multiväriin tietosuojaselosteen mukaisesti.</p><Link to="/tietosuojaseloste" className="btn-outline mt-5">Tietosuojaseloste</Link></div></div></section>;
}

function QuickLink({ to, icon: Icon, title, text }: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <Link to={to} className="card group flex items-center gap-4 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block font-bold text-navy-900">{title}</span><span className="block text-xs text-navy-500">{text}</span></span><ArrowRight className="ml-auto h-4 w-4 shrink-0 text-navy-300 transition group-hover:translate-x-1 group-hover:text-orange-500" /></Link>;
}

function ProjectCard({ project }: { project: PaintProjectRecord }) {
  const categoryLabel: Record<string, string> = { interior: 'Sisätilat', exterior: 'Ulkopinnat', roof: 'Katto', other: 'Muu kohde' };
  return <Link to={`/app/design/${project.id}`} className="card group overflow-hidden"><div className="bg-navy-950 p-5 text-white"><span className="text-xs font-semibold uppercase tracking-wider text-orange-400">{categoryLabel[project.category] || project.category}</span><h3 className="mt-2 font-display text-xl font-bold">{project.title}</h3><p className="mt-1 text-xs text-navy-200">{project.city || 'Sijainti ei annettu'}</p></div><div className="p-5"><div className="flex items-center justify-between gap-3">{project.estimate_low !== null ? <span className="font-bold text-orange-600">{project.estimate_low}–{project.estimate_high} €</span> : <span className="text-sm text-navy-500">Ei hinta-arviota</span>}<ArrowRight className="h-4 w-4 text-navy-300 transition group-hover:translate-x-1 group-hover:text-orange-500" /></div><p className="mt-3 text-xs text-navy-400">Muokattu {new Date(project.updated_at).toLocaleDateString('fi-FI')}</p></div></Link>;
}
