import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brush,
  Calculator,
  FileText,
  FolderOpen,
  Loader2,
  PaintRoller,
  Plus,
  Sparkles,
} from 'lucide-react';
import { listProjects, listQuoteRequests, type PaintProjectRecord } from '@/lib/customerAppApi';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export function KamuStudioDashboardPage() {
  const { session } = useCustomerAuth();
  const [projects, setProjects] = useState<PaintProjectRecord[]>([]);
  const [quoteCount, setQuoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([listProjects(), listQuoteRequests()])
      .then(([projectRows, quoteRows]) => {
        if (!active) return;
        setProjects(projectRows);
        setQuoteCount(quoteRows.length);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Kamu Studion tietojen lataus epäonnistui.');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const firstName = useMemo(() => {
    const email = session?.user.email;
    if (!email) return '';
    const local = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim();
    return local ? local.split(/\s+/)[0] : '';
  }, [session]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_32%),linear-gradient(to_bottom,#f8fafc,#ffffff_42%)] px-4 py-7 sm:px-5 sm:py-10">
      <div className="container-base">
        <div className="overflow-hidden rounded-[2rem] bg-navy-950 text-white shadow-lift">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                <Sparkles className="h-4 w-4" /> Kamu Studio
              </div>
              <h1 className="mt-5 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">
                {firstName ? `Hei ${firstName}, mitä suunnitellaan tänään?` : 'Mitä suunnitellaan tänään?'}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-navy-200 sm:text-lg">
                VäriKamu ja SiivousKamu ovat nyt samassa asiakassovelluksessa. Valitse tehtävä, käytä omaa kuvaa ja jatka tarjouspyyntöön yhdestä paikasta.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/app/varikamu" className="btn-primary"><PaintRoller className="h-4 w-4" />Avaa VäriKamu</Link>
                <Link to="/app/siivouskamu" className="btn-ghost-light"><Sparkles className="h-4 w-4" />Avaa SiivousKamu</Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatCard value={projects.length} label="Projektia" />
              <StatCard value={quoteCount} label="Tarjousta" />
              <StatCard value="2" label="Työkalua" />
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <Link to="/app/varikamu" className="group relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift sm:p-8">
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-orange-100/70 blur-2xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-soft"><Brush className="h-7 w-7" /></span>
                <ArrowRight className="h-6 w-6 text-navy-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
              </div>
              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-600">Maalaussuunnittelu</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-navy-950">VäriKamu</h2>
              <p className="mt-3 max-w-xl leading-7 text-navy-600">Lataa tai ota kuva, suojaa reunat, kokeile värejä ja tee visuaalinen maalaussuunnitelma ennen oikeaa työtä.</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-navy-700">
                {['Kuva / kamera', 'Suojaa', 'Smart Paint', '3 maalikerrosta', 'Ennen / jälkeen'].map((item) => <span key={item} className="rounded-full bg-orange-50 px-3 py-1.5">{item}</span>)}
              </div>
              <div className="mt-7 inline-flex items-center gap-2 font-bold text-orange-600">Aloita VäriKamulla <ArrowRight className="h-4 w-4" /></div>
            </div>
          </Link>

          <Link to="/app/siivouskamu" className="group relative overflow-hidden rounded-[2rem] border border-sky-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift sm:p-8">
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-sky-100/80 blur-2xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-white shadow-soft"><Sparkles className="h-7 w-7" /></span>
                <ArrowRight className="h-6 w-6 text-navy-300 transition group-hover:translate-x-1 group-hover:text-navy-800" />
              </div>
              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-navy-500">Siivoussuunnittelu</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-navy-950">SiivousKamu</h2>
              <p className="mt-3 max-w-xl leading-7 text-navy-600">Näytä kuvasta puhdistettava pinta, valitse sopiva työkalu ja tee visuaalinen siivoussuunnitelma samaan asiakastiliin.</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-navy-700">
                {['Kuva / kamera', 'Sieni', 'Harja', 'Suihke', 'Smart Clean'].map((item) => <span key={item} className="rounded-full bg-navy-50 px-3 py-1.5">{item}</span>)}
              </div>
              <div className="mt-7 inline-flex items-center gap-2 font-bold text-navy-800">Aloita SiivousKamulla <ArrowRight className="h-4 w-4" /></div>
            </div>
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <QuickLink to="/app/design/new" icon={Plus} title="Uusi suunnitelma" text="Aloita uusi asiakasprojekti." />
          <QuickLink to="/app/estimates" icon={Calculator} title="Hinta-arviot" text="Tarkista tallennetut arviot." />
          <QuickLink to="/app/quotes" icon={FileText} title="Tarjouspyynnöt" text="Seuraa lähetettyjä pyyntöjä." />
        </div>

        <div className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-600">Omat työt</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-950">Tallennetut projektit</h2>
            </div>
            <Link to="/app/design/new" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700">Luo uusi <Plus className="h-4 w-4" /></Link>
          </div>

          {loading ? (
            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white p-6 text-sm text-navy-500 shadow-soft"><Loader2 className="h-4 w-4 animate-spin" />Ladataan Kamu Studioa…</div>
          ) : error ? (
            <div className="mt-5 rounded-2xl bg-red-50 p-5 text-sm text-red-700">{error}</div>
          ) : projects.length === 0 ? (
            <div className="mt-5 rounded-[2rem] border border-dashed border-navy-200 bg-white p-8 text-center shadow-soft">
              <FolderOpen className="mx-auto h-10 w-10 text-navy-300" />
              <h3 className="mt-4 font-display text-xl font-bold text-navy-900">Ei vielä tallennettuja projekteja</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-navy-500">Valitse VäriKamu tai SiivousKamu yllä ja aloita ensimmäinen suunnitelma omalla kuvallasi.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"><div className="font-display text-2xl font-extrabold text-white sm:text-3xl">{value}</div><div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-navy-300">{label}</div></div>;
}

function QuickLink({ to, icon: Icon, title, text }: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <Link to={to} className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-800"><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block font-bold text-navy-900">{title}</span><span className="block text-xs text-navy-500">{text}</span></span><ArrowRight className="ml-auto h-4 w-4 text-navy-300 transition group-hover:translate-x-1 group-hover:text-orange-500" /></Link>;
}

function ProjectCard({ project }: { project: PaintProjectRecord }) {
  const categoryLabel: Record<string, string> = { interior: 'Sisätilat', exterior: 'Ulkopinnat', roof: 'Katto', other: 'Muu kohde' };
  return <Link to={`/app/design/${project.id}`} className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"><div className="bg-navy-950 p-5 text-white"><span className="text-xs font-bold uppercase tracking-wider text-orange-400">{categoryLabel[project.category] || project.category}</span><h3 className="mt-2 font-display text-lg font-bold">{project.title}</h3><p className="mt-1 text-xs text-navy-300">{project.city || 'Sijainti ei annettu'}</p></div><div className="p-5"><div className="flex items-center justify-between gap-3">{project.estimate_low !== null ? <span className="font-bold text-orange-600">{project.estimate_low}–{project.estimate_high} €</span> : <span className="text-sm text-navy-500">Ei hinta-arviota</span>}<ArrowRight className="h-4 w-4 text-navy-300 transition group-hover:translate-x-1 group-hover:text-orange-500" /></div><p className="mt-3 text-xs text-navy-400">Muokattu {new Date(project.updated_at).toLocaleDateString('fi-FI')}</p></div></Link>;
}
