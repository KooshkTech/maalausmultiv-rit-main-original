import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { requestPasswordReset } from '@/lib/customerAppApi';

const inputClass = 'w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-navy-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200';

function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="card p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><LockKeyhole className="h-6 w-6" /></span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-navy-600">{description}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </section>
  );
}

function SetupNotice() {
  return (
    <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-relaxed text-navy-700">
      <strong className="text-navy-900">Ylläpitäjälle:</strong> asiakassovellus tarvitsee Supabase-yhteyden ennen tuotantokäyttöä. Lisää <code>VITE_SUPABASE_URL</code> ja <code>VITE_SUPABASE_ANON_KEY</code> deployment-ympäristöön ja suorita mukana toimitettu tietokantamigraatio.
    </div>
  );
}

export function AppLoginPage() {
  const { session, signIn, loading, configured } = useCustomerAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (session) return <Navigate to="/app/dashboard" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await signIn(email.trim(), password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || '/app/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kirjautuminen epäonnistui.');
    }
  };

  return (
    <AuthShell title="Kirjaudu suunnittelijaan" description="Jatka tallennettuja maalaussuunnitelmia, hinta-arvioita ja tarjouspyyntöjäsi.">
      {(!configured || searchParams.get('setup') === '1') && <SetupNotice />}
      {searchParams.get('reset') === '1' && <p className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">Avaa sähköpostiisi lähetetty palautuslinkki ja määritä uusi salasana Supabasen palautusnäkymässä.</p>}
      {error && <p className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-semibold text-navy-800">Sähköposti
          <span className="relative mt-1.5 block"><Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-navy-400" /><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} pl-10`} /></span>
        </label>
        <label className="block text-sm font-semibold text-navy-800">Salasana
          <input type="password" required minLength={8} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} mt-1.5`} />
        </label>
        <button type="submit" disabled={loading || !configured} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Kirjaudutaan…' : 'Kirjaudu sisään'}</button>
      </form>
      <div className="mt-5 flex flex-col gap-2 text-center text-sm">
        <Link to="/app/forgot-password" className="font-semibold text-navy-600 hover:text-orange-600">Unohditko salasanan?</Link>
        <p className="text-navy-500">Ei vielä tiliä? <Link to="/app/register" className="font-bold text-orange-600">Luo maksuton tili</Link></p>
      </div>
    </AuthShell>
  );
}

export function AppRegisterPage() {
  const { session, signUp, loading, configured } = useCustomerAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState(false);

  if (session) return <Navigate to="/app/dashboard" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!accept) return setError('Hyväksy käyttöehdot ja tietosuojaseloste jatkaaksesi.');
    setError(null);
    try {
      const result = await signUp(email.trim(), password, name.trim(), phone.trim());
      setConfirmation(result.needsEmailConfirmation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tilin luominen epäonnistui.');
    }
  };

  if (confirmation) return (
    <AuthShell title="Tarkista sähköpostisi" description="Lähetimme vahvistuslinkin antamaasi sähköpostiosoitteeseen. Vahvista tili ja kirjaudu sitten suunnittelijaan.">
      <div className="flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><span>Kun tili on vahvistettu, voit tallentaa omat kuvat, suunnitelmat ja hinta-arviot.</span></div>
      <Link to="/app/login" className="btn-primary mt-5 w-full">Siirry kirjautumiseen</Link>
    </AuthShell>
  );

  return (
    <AuthShell title="Luo maksuton käyttäjätili" description="Tallenna maalaussuunnitelmat, vertaile värejä, lataa tulokset ja lähetä valmis projekti tarjouspyyntönä.">
      {!configured && <SetupNotice />}
      {error && <p className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-semibold text-navy-800">Nimi<input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={`${inputClass} mt-1.5`} /></label>
        <label className="block text-sm font-semibold text-navy-800">Puhelin <span className="font-normal text-navy-400">(valinnainen)</span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={`${inputClass} mt-1.5`} /></label>
        <label className="block text-sm font-semibold text-navy-800">Sähköposti<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={`${inputClass} mt-1.5`} /></label>
        <label className="block text-sm font-semibold text-navy-800">Salasana<input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className={`${inputClass} mt-1.5`} /><span className="mt-1 block text-xs font-normal text-navy-500">Vähintään 8 merkkiä.</span></label>
        <label className="flex items-start gap-3 rounded-xl bg-navy-50 p-3 text-sm text-navy-700"><input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-1 h-4 w-4 accent-orange-500" /><span>Hyväksyn <Link to="/kayttoehdot" className="font-semibold text-orange-600">käyttöehdot</Link> ja olen tutustunut <Link to="/tietosuojaseloste" className="font-semibold text-orange-600">tietosuojaselosteeseen</Link>.</span></label>
        <button type="submit" disabled={loading || !configured} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Luodaan tiliä…' : 'Luo tili ja aloita'}</button>
      </form>
      <p className="mt-5 text-center text-sm text-navy-500">Onko sinulla jo tili? <Link to="/app/login" className="font-bold text-orange-600">Kirjaudu</Link></p>
    </AuthShell>
  );
}

export function AppForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { configured } = useCustomerAuth();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Palautuspyyntö epäonnistui.');
    }
  };

  return (
    <AuthShell title="Palauta salasana" description="Anna sähköpostiosoitteesi, niin lähetämme palautuslinkin.">
      {!configured && <SetupNotice />}
      {sent ? <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">Jos osoite löytyy järjestelmästä, saat palautusviestin sähköpostiisi.</div> : (
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <label className="block text-sm font-semibold text-navy-800">Sähköposti<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} mt-1.5`} /></label>
          <button disabled={!configured} className="btn-primary w-full disabled:opacity-50">Lähetä palautuslinkki</button>
        </form>
      )}
      <Link to="/app/login" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-navy-600"><UserRound className="h-4 w-4" />Takaisin kirjautumiseen</Link>
    </AuthShell>
  );
}
