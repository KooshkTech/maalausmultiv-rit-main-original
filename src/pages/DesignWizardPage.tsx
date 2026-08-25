import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, ImagePlus, Loader2, Save, Send } from 'lucide-react';
import { PhotoColorEditor } from '@/components/PhotoColorEditor';
import { commonColors, plannerCategories, plannerSurfaces, preparationPrices, type PlannerCategory } from '@/data/paintPlanner';
import { calculatePlannerEstimate, downloadSimpleProjectPdf, type SurfaceSelection } from '@/lib/paintPlannerEngine';
import { createProject, createQuoteRequest, getProject, updateProject, uploadProjectImage, type PaintProjectRecord } from '@/lib/customerAppApi';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

const cities = ['Helsinki', 'Espoo', 'Vantaa', 'Kauniainen', 'Kirkkonummi', 'Kerava', 'Järvenpää', 'Hyvinkää', 'Nurmijärvi', 'Sipoo', 'Muu'];
const preparationLabels: Record<keyof typeof preparationPrices, string> = {
  washing: 'Pesu', scraping: 'Kaavinta', sanding: 'Hionta', repairs: 'Korjaukset', primer: 'Pohjustus', mouldTreatment: 'Home-/leväkäsittely', rustTreatment: 'Ruostekäsittely',
};
const inputClass = 'w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-navy-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200';

export function DesignWizardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useCustomerAuth();
  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState<string | null>(id && id !== 'new' ? id : null);
  const [title, setTitle] = useState('Oma maalaussuunnitelma');
  const [category, setCategory] = useState<PlannerCategory>('exterior');
  const [city, setCity] = useState('Vantaa');
  const [selections, setSelections] = useState<SurfaceSelection[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [existingPhotoPath, setExistingPhotoPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(projectId));
  const [message, setMessage] = useState<string | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let active = true;
    getProject(projectId).then((project) => {
      if (!active || !project) return;
      setTitle(project.title);
      setCategory((project.category || 'exterior') as PlannerCategory);
      setCity(project.city || 'Vantaa');
      setExistingPhotoPath(project.photo_path);
      const data = project.design_data as { selections?: SurfaceSelection[] };
      setSelections(Array.isArray(data?.selections) ? data.selections : []);
    }).catch((err) => active && setMessage(err instanceof Error ? err.message : 'Projektia ei voitu ladata.')).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [projectId]);

  const estimate = useMemo(() => calculatePlannerEstimate(selections), [selections]);
  const availableSurfaces = plannerSurfaces.filter((surface) => surface.category === category);

  const toggleSurface = (surfaceKey: string) => {
    const exists = selections.some((selection) => selection.surfaceKey === surfaceKey);
    if (exists) setSelections((current) => current.filter((selection) => selection.surfaceKey !== surfaceKey));
    else setSelections((current) => [...current, { surfaceKey, amount: 10, colorHex: commonColors[0].hex, condition: 'unknown', quality: 'standard', coats: 2, difficultAccess: false, preparations: [] }]);
  };

  const patchSelection = (surfaceKey: string, patch: Partial<SurfaceSelection>) => {
    setSelections((current) => current.map((selection) => selection.surfaceKey === surfaceKey ? { ...selection, ...patch } : selection));
  };

  const save = async () => {
    if (!session) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload: Partial<PaintProjectRecord> = {
        title: title.trim() || 'Oma maalaussuunnitelma',
        category,
        city,
        status: 'draft',
        design_data: { selections, version: 1 },
        estimate_low: estimate.low,
        estimate_high: estimate.high,
        pricing_version: estimate.pricingVersion,
      };
      let saved: PaintProjectRecord;
      if (projectId) saved = await updateProject(projectId, payload);
      else {
        saved = await createProject(payload);
        setProjectId(saved.id);
        navigate(`/app/design/${saved.id}`, { replace: true });
      }
      if (photo) {
        const path = await uploadProjectImage(saved.id, photo);
        await updateProject(saved.id, { photo_path: path });
        setExistingPhotoPath(path);
      }
      setMessage('Suunnitelma tallennettu.');
      return saved;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Tallennus epäonnistui.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const next = async () => {
    if (step === 2 && selections.length === 0) return setMessage('Valitse vähintään yksi maalattava pinta.');
    if (step === 5) await save();
    setMessage(null);
    setStep((current) => Math.min(6, current + 1));
  };

  if (loading) return <section className="px-5 py-16"><div className="container-base flex items-center justify-center gap-2 text-navy-500"><Loader2 className="h-5 w-5 animate-spin" />Ladataan suunnitelmaa…</div></section>;

  return (
    <section className="px-5 py-8 sm:py-10">
      <div className="container-base max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><Link to="/app/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-orange-600"><ArrowLeft className="h-4 w-4" />Omat suunnitelmat</Link><button type="button" onClick={save} disabled={saving} className="btn-outline !px-4 !py-2 disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Tallenna</button></div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <div className="card p-5 sm:p-7">
              <Progress step={step} />
              {message && <p className={`mt-5 rounded-xl p-3 text-sm ${message.includes('tallennettu') ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-navy-700'}`}>{message}</p>}

              <div className="mt-7">
                {step === 1 && <ProjectBasics title={title} setTitle={setTitle} category={category} setCategory={(nextCategory) => { setCategory(nextCategory); setSelections([]); }} city={city} setCity={setCity} />}
                {step === 2 && <SurfacePicker available={availableSurfaces} selections={selections} toggleSurface={toggleSurface} />}
                {step === 3 && <SurfaceDetails selections={selections} patchSelection={patchSelection} />}
                {step === 4 && <PhotoStep photo={photo} setPhoto={setPhoto} existingPhotoPath={existingPhotoPath} selections={selections} setSelections={setSelections} />}
                {step === 5 && <EstimateStep estimate={estimate} selections={selections} />}
                {step === 6 && <ResultStep title={title} city={city} estimate={estimate} selections={selections} onDownloadPdf={() => downloadSimpleProjectPdf({ projectTitle: title, city, estimate, selections })} onQuote={() => setQuoteOpen(true)} />}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-between">
                <button type="button" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))} className="btn-outline disabled:cursor-not-allowed disabled:opacity-40">Takaisin</button>
                {step < 6 && <button type="button" onClick={next} className="btn-primary">Jatka <ArrowRight className="h-4 w-4" /></button>}
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl bg-navy-950 p-6 text-white"><p className="text-xs font-bold uppercase tracking-wider text-orange-400">Alustava hinta-arvio</p><p className="mt-3 font-display text-3xl font-extrabold">{estimate.low}–{estimate.high} €</p><p className="mt-2 text-xs leading-relaxed text-navy-200">Hinta ei ole sitova tarjous. Lopullinen hinta tarkistetaan kohteen ja työn todellisen laajuuden perusteella.</p></div>
            <div className="card p-5"><p className="font-bold text-navy-900">{title}</p><p className="mt-1 text-sm text-navy-500">{city}</p><p className="mt-4 text-xs font-bold uppercase tracking-wider text-navy-400">Valitut pinnat</p><div className="mt-2 space-y-2">{selections.length === 0 ? <p className="text-sm text-navy-400">Ei vielä valintoja.</p> : selections.map((selection) => { const def = plannerSurfaces.find((s) => s.key === selection.surfaceKey); return <div key={selection.surfaceKey} className="flex items-center gap-2 text-sm text-navy-700"><span className="h-4 w-4 rounded-full border" style={{ backgroundColor: selection.colorHex }} />{def?.label}</div>; })}</div></div>
          </aside>
        </div>
      </div>
      {quoteOpen && <QuoteDialog projectId={projectId} title={title} city={city} estimateLow={estimate.low} estimateHigh={estimate.high} onClose={() => setQuoteOpen(false)} />}
    </section>
  );
}

function Progress({ step }: { step: number }) {
  const labels = ['Kohde', 'Pinnat', 'Työ', 'Kuva & värit', 'Hinta', 'Valmis'];
  return <div className="overflow-x-auto"><div className="flex min-w-[620px] items-center gap-2">{labels.map((label, index) => { const number = index + 1; const active = number === step; const done = number < step; return <div key={label} className="flex flex-1 items-center gap-2"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active || done ? 'bg-orange-500 text-white' : 'bg-navy-100 text-navy-500'}`}>{done ? '✓' : number}</span><span className={`text-xs font-semibold ${active ? 'text-navy-900' : 'text-navy-500'}`}>{label}</span>{number < labels.length && <span className="h-px flex-1 bg-navy-200" />}</div>; })}</div></div>;
}

function ProjectBasics({ title, setTitle, category, setCategory, city, setCity }: { title: string; setTitle: (v: string) => void; category: PlannerCategory; setCategory: (v: PlannerCategory) => void; city: string; setCity: (v: string) => void }) {
  return <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Mitä haluat suunnitella?</h1><p className="mt-2 text-sm text-navy-600">Anna projektille nimi, valitse pääkohde ja sijainti.</p><div className="mt-6 space-y-5"><label className="block text-sm font-semibold text-navy-800">Projektin nimi<input value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} mt-1.5`} /></label><div><p className="mb-2 text-sm font-semibold text-navy-800">Kohde</p><div className="grid gap-3 sm:grid-cols-2">{plannerCategories.map((item) => <button key={item.id} type="button" onClick={() => setCategory(item.id)} className={`rounded-2xl border p-4 text-left transition ${category === item.id ? 'border-orange-300 bg-orange-50' : 'border-navy-200 bg-white hover:border-orange-200'}`}><span className="block font-bold text-navy-900">{item.label}</span><span className="mt-1 block text-xs leading-relaxed text-navy-500">{item.description}</span></button>)}</div></div><label className="block text-sm font-semibold text-navy-800">Kaupunki<select value={city} onChange={(e) => setCity(e.target.value)} className={`${inputClass} mt-1.5`}>{cities.map((item) => <option key={item}>{item}</option>)}</select></label></div></div>;
}

function SurfacePicker({ available, selections, toggleSurface }: { available: typeof plannerSurfaces; selections: SurfaceSelection[]; toggleSurface: (key: string) => void }) {
  return <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Valitse maalattavat pinnat</h1><p className="mt-2 text-sm text-navy-600">Voit valita useita pintoja ja antaa jokaiselle oman värin ja työmäärän.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{available.map((surface) => { const selected = selections.some((s) => s.surfaceKey === surface.key); return <button key={surface.key} type="button" onClick={() => toggleSurface(surface.key)} className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${selected ? 'border-orange-300 bg-orange-50' : 'border-navy-200 bg-white'}`}><span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-orange-500 bg-orange-500 text-white' : 'border-navy-300 text-transparent'}`}>✓</span><span><span className="block font-bold text-navy-900">{surface.label}</span><span className="mt-1 block text-xs leading-relaxed text-navy-500">{surface.description}</span></span></button>; })}</div></div>;
}

function SurfaceDetails({ selections, patchSelection }: { selections: SurfaceSelection[]; patchSelection: (key: string, patch: Partial<SurfaceSelection>) => void }) {
  return <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Mitat, kunto ja esityöt</h1><p className="mt-2 text-sm text-navy-600">Mitä tarkemmat tiedot annat, sitä hyödyllisempi alustava hinta-arvio on.</p><div className="mt-6 space-y-5">{selections.map((selection) => { const def = plannerSurfaces.find((surface) => surface.key === selection.surfaceKey)!; return <div key={selection.surfaceKey} className="rounded-2xl border border-navy-100 p-5"><div className="flex items-center gap-3"><span className="h-8 w-8 rounded-full border border-navy-200" style={{ backgroundColor: selection.colorHex }} /><h2 className="font-display text-lg font-bold text-navy-900">{def.label}</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-navy-800">{def.unit === 'piece' ? 'Määrä (kpl)' : 'Arvioitu pinta-ala (m²)'}<input type="number" min="0" step={def.unit === 'piece' ? '1' : '0.5'} value={selection.amount} onChange={(e) => patchSelection(selection.surfaceKey, { amount: Math.max(0, Number(e.target.value)) })} className={`${inputClass} mt-1.5`} /></label><label className="text-sm font-semibold text-navy-800">Pinnan kunto<select value={selection.condition} onChange={(e) => patchSelection(selection.surfaceKey, { condition: e.target.value as SurfaceSelection['condition'] })} className={`${inputClass} mt-1.5`}><option value="good">Hyvä</option><option value="fair">Kohtalainen</option><option value="poor">Huono</option><option value="unknown">En tiedä</option></select></label><label className="text-sm font-semibold text-navy-800">Maalin laatutaso<select value={selection.quality} onChange={(e) => patchSelection(selection.surfaceKey, { quality: e.target.value as SurfaceSelection['quality'] })} className={`${inputClass} mt-1.5`}><option value="standard">Vakio</option><option value="premium">Premium</option></select></label><label className="text-sm font-semibold text-navy-800">Maalauskerrat<select value={selection.coats} onChange={(e) => patchSelection(selection.surfaceKey, { coats: Number(e.target.value) as 1 | 2 })} className={`${inputClass} mt-1.5`}><option value={1}>1 kerros</option><option value={2}>2 kerrosta</option></select></label></div><div className="mt-5"><p className="text-sm font-semibold text-navy-800">Esikäsittelyt</p><div className="mt-2 flex flex-wrap gap-2">{(Object.keys(preparationPrices) as Array<keyof typeof preparationPrices>).map((prep) => { const checked = selection.preparations.includes(prep); return <label key={prep} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${checked ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-600'}`}><input type="checkbox" checked={checked} onChange={() => patchSelection(selection.surfaceKey, { preparations: checked ? selection.preparations.filter((item) => item !== prep) : [...selection.preparations, prep] })} className="accent-orange-500" />{preparationLabels[prep]}</label>; })}</div></div><label className="mt-4 flex items-center gap-3 rounded-xl bg-navy-50 p-3 text-sm text-navy-700"><input type="checkbox" checked={selection.difficultAccess} onChange={(e) => patchSelection(selection.surfaceKey, { difficultAccess: e.target.checked })} className="h-4 w-4 accent-orange-500" />Korkeus tai vaikea työskentelypääsy</label></div>; })}</div></div>;
}

function PhotoStep({ photo, setPhoto, existingPhotoPath, selections, setSelections }: { photo: File | null; setPhoto: (f: File | null) => void; existingPhotoPath: string | null; selections: SurfaceSelection[]; setSelections: (v: SurfaceSelection[]) => void }) {
  return <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Lataa kuva ja kokeile värejä</h1><p className="mt-2 text-sm text-navy-600">Kuva on vapaaehtoinen, mutta se auttaa suunnittelussa ja tarjouspyynnössä. Älä lataa kuvia, joissa näkyy tarpeettomia henkilötietoja tai tunnistettavia henkilöitä ilman lupaa.</p><label className="mt-6 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/40 p-6 text-center"><ImagePlus className="h-7 w-7 text-orange-500" /><span className="font-bold text-navy-900">{photo ? photo.name : existingPhotoPath ? 'Projektissa on jo tallennettu kuva — valitse uusi korvataksesi sen' : 'Valitse kuva laitteeltasi'}</span><span className="text-xs text-navy-500">JPG, PNG tai WebP. Suositus alle 10 Mt.</span><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const file = e.target.files?.[0] || null; if (file && file.size <= 10 * 1024 * 1024) setPhoto(file); }} /></label><div className="mt-6"><PhotoColorEditor file={photo} selections={selections} onChange={setSelections} /></div></div>;
}

function EstimateStep({ estimate, selections }: { estimate: ReturnType<typeof calculatePlannerEstimate>; selections: SurfaceSelection[] }) {
  return <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Alustava hinta-arvio</h1><p className="mt-2 text-sm text-navy-600">Arvio perustuu antamiisi tietoihin ja V17-laskentamallin määritettyihin hintoihin. Tarkka tarjous vaatii kohteen ja työmäärän varmistamisen.</p><div className="mt-6 rounded-3xl bg-navy-950 p-7 text-white"><p className="text-xs font-bold uppercase tracking-wider text-orange-400">Arvio</p><p className="mt-2 font-display text-4xl font-extrabold">{estimate.low}–{estimate.high} €</p><p className="mt-2 text-sm text-navy-200">{selections.length} maalattavaa pintaa · laskentaversio {estimate.pricingVersion}</p></div><div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm leading-relaxed text-navy-700"><strong>Ei sitova tarjous:</strong> sää, korkeus, suojaus, todelliset pinta-alat, pintamateriaali, korjaukset, telineet, tuotteet ja muut kohdekohtaiset tekijät voivat muuttaa lopullista hintaa.</div></div>;
}

function ResultStep({ title, city, estimate, selections, onDownloadPdf, onQuote }: { title: string; city: string; estimate: ReturnType<typeof calculatePlannerEstimate>; selections: SurfaceSelection[]; onDownloadPdf: () => void; onQuote: () => void }) {
  return <div><div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600"><CheckCircle2 className="h-7 w-7" /></div><h1 className="mt-4 font-display text-3xl font-extrabold text-navy-900">Suunnitelma on valmis</h1><p className="mt-2 text-navy-600">Tallenna projekti, lataa PDF-yhteenveto tai lähetä sama suunnitelma tarjouspyyntönä.</p><div className="mt-6 card p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-navy-900">{title}</p><p className="text-sm text-navy-500">{city} · {selections.length} pintaa</p></div><span className="font-display text-2xl font-extrabold text-orange-600">{estimate.low}–{estimate.high} €</span></div></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={onDownloadPdf} className="btn-outline"><Download className="h-4 w-4" />Lataa PDF</button><button type="button" onClick={onQuote} className="btn-primary"><Send className="h-4 w-4" />Pyydä tarkka tarjous</button></div></div>;
}

function QuoteDialog({ projectId, title, city, estimateLow, estimateHigh, onClose }: { projectId: string | null; title: string; city: string; estimateLow: number; estimateHigh: number; onClose: () => void }) {
  const { session } = useCustomerAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true); setError(null);
    try {
      let effectiveProjectId = projectId;
      if (!effectiveProjectId) throw new Error('Tallenna projekti ennen tarjouspyyntöä.');
      await createQuoteRequest({ project_id: effectiveProjectId, project_title: title, city, estimate_low: estimateLow, estimate_high: estimateHigh, name, email: session?.user.email || '', phone, message, status: 'received' });
      await fetch('/send-mail.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ formType: 'quote', name, email: session?.user.email || '', phone, city, service: 'Maalaussuunnittelija', message: `${title}\nHinta-arvio ${estimateLow}–${estimateHigh} €\n${message}` }) }).catch(() => undefined);
      setSent(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Tarjouspyyntö epäonnistui.'); }
    finally { setSending(false); }
  };

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/70 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift sm:p-8">{sent ? <div className="text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-green-500" /><h2 className="mt-4 font-display text-2xl font-bold text-navy-900">Tarjouspyyntö lähetetty</h2><p className="mt-2 text-sm text-navy-600">Projektisi on tallennettu tarjouspyyntöihin.</p><button type="button" onClick={onClose} className="btn-primary mt-5">Sulje</button></div> : <><h2 className="font-display text-2xl font-bold text-navy-900">Pyydä tarkka tarjous</h2><p className="mt-2 text-sm text-navy-600">Lähetämme suunnitelman tiedot Maalaus Multivärille. Lopullinen hinta vahvistetaan erikseen.</p>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<form onSubmit={submit} className="mt-5 space-y-4"><label className="block text-sm font-semibold text-navy-800">Nimi<input required value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} mt-1.5`} /></label><label className="block text-sm font-semibold text-navy-800">Puhelin<input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputClass} mt-1.5`} /></label><label className="block text-sm font-semibold text-navy-800">Lisätiedot<textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputClass} mt-1.5`} placeholder="Esim. toivottu aikataulu tai kohteen erityispiirteet" /></label><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="btn-outline">Peruuta</button><button disabled={sending} className="btn-primary disabled:opacity-50">{sending ? 'Lähetetään…' : 'Lähetä tarjouspyyntö'}</button></div></form></>}</div></div>;
}
