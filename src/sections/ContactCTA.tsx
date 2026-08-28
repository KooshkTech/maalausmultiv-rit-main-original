import { Phone, Mail, Clock, MapPin, ArrowRight, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/Reveal';
import { company } from '@/data/company';
import { ContactForm } from '@/components/ContactForm';
import { trackPhoneClick, trackEmailClick } from '@/lib/analytics';

export function ContactCTA() {
  return (
    <section className="section-pad bg-white">
      <div className="container-base">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow-orange">Ota yhteyttä</span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-900 sm:text-4xl lg:text-5xl">Pyydä ilmainen, sitoutumaton tarjous</h2>
            <p className="mt-5 text-base leading-relaxed text-navy-600 sm:text-lg">Täytä lomake niin palaamme asiaan 24 tunnin sisällä. Voit myös soittaa tai lähettää sähköpostia — vastaamme mielellämme kaikkiin kysymyksiisi.</p>

            <div className="mt-8 flex flex-col gap-5">
              <a href={company.phoneHref} onClick={() => trackPhoneClick('contact_cta')} className="group flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white"><Phone className="h-5 w-5" /></span><div><p className="text-xs font-medium uppercase tracking-wider text-navy-500">Soita</p><p className="font-display text-base font-bold text-navy-900">{company.phone}</p></div></a>
              <a href={company.emailHref} onClick={() => trackEmailClick('contact_cta')} className="group flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white"><Mail className="h-5 w-5" /></span><div><p className="text-xs font-medium uppercase tracking-wider text-navy-500">Sähköposti</p><p className="font-display text-base font-bold text-navy-900">{company.email}</p></div></a>
              <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><MapPin className="h-5 w-5" /></span><div><p className="text-xs font-medium uppercase tracking-wider text-navy-500">Osoite</p><p className="font-display text-base font-bold text-navy-900">{company.city}, {company.region}</p></div></div>
              <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Clock className="h-5 w-5" /></span><div><p className="text-xs font-medium uppercase tracking-wider text-navy-500">Aukioloajat</p><p className="font-display text-sm font-bold text-navy-900">Ma–Pe 07–18 · La 09–15 · Su suljettu</p></div></div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/paint-studio" className="btn-primary"><Palette className="h-4 w-4" />Kokeile värejä ja laske hinta</Link>
              <Link to="/projektit" className="btn-outline">Tutustu projekteihin <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-7"><ContactForm /></Reveal>
        </div>
      </div>
    </section>
  );
}
