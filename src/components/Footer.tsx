import { Link } from 'react-router-dom';
import {
  PaintRoller,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { company } from '@/data/company';
import { getPaintingServices, getCleaningServices } from '@/data/services';
import { trackPhoneClick, trackEmailClick, trackWhatsAppClick } from '@/lib/analytics';

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-base py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                <PaintRoller className="h-5 w-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-display text-base font-extrabold">{company.name}</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-400">
                  Maalaus ja siivous
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-200">
              {company.name} tarjoaa laadukkaita maalaus- ja siivouspalveluja
              yksityisille ja yrityksille Uudellamaalla. Kilpailukykyiset hinnat ja
              takuu työjäljestä 2 vuotta.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={company.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('footer_icon')}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-[#25D366]"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href={company.phoneHref}
                onClick={() => trackPhoneClick('footer_icon')}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-orange-500"
                aria-label="Soita"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href={company.emailHref}
                onClick={() => trackEmailClick('footer_icon')}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-orange-500"
                aria-label="Sähköposti"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange-400">
              Maalaus
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {getPaintingServices().map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/palvelut/${s.slug}`}
                    className="text-navy-200 transition hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange-400">
              Siivous
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {getCleaningServices().map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/palvelut/${s.slug}`}
                    className="text-navy-200 transition hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange-400">
              Sivut
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li><Link to="/" className="text-navy-200 transition hover:text-white">Etusivu</Link></li>
              <li><Link to="/palvelut" className="text-navy-200 transition hover:text-white">Palvelut</Link></li>
              <li><Link to="/palvelut/siivous" className="text-navy-200 transition hover:text-white">Siivouspalvelut</Link></li>
              <li><Link to="/toimialat" className="text-navy-200 transition hover:text-white">Toimialat</Link></li>
              <li><Link to="/kustannuslaskuri" className="text-navy-200 transition hover:text-white">Kustannuslaskuri</Link></li>
              <li><Link to="/projektit" className="text-navy-200 transition hover:text-white">Projektit</Link></li>
              <li><Link to="/arvostelut" className="text-navy-200 transition hover:text-white">Arvostelut</Link></li>
              <li><Link to="/blogi" className="text-navy-200 transition hover:text-white">Blogi</Link></li>
              <li><Link to="/yhteystiedot" className="text-navy-200 transition hover:text-white">Yhteystiedot</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange-400">
              Alueet
            </h3>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li><Link to="/palvelualueet/helsinki" className="text-navy-200 transition hover:text-white">Helsinki</Link></li>
              <li><Link to="/palvelualueet/espoo" className="text-navy-200 transition hover:text-white">Espoo</Link></li>
              <li><Link to="/palvelualueet/vantaa" className="text-navy-200 transition hover:text-white">Vantaa</Link></li>
              <li><Link to="/palvelualueet/kauniainen" className="text-navy-200 transition hover:text-white">Kauniainen</Link></li>
              <li><Link to="/palvelualueet" className="text-navy-200 transition hover:text-white">Kaikki alueet</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange-400">
              Yhteystiedot
            </h3>
            <ul className="mt-5 flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                <span className="text-navy-200">{company.city}, {company.region}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                <a href={company.phoneHref} onClick={() => trackPhoneClick('footer_contact_info')} className="text-navy-200 transition hover:text-white">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                <a href={company.emailHref} onClick={() => trackEmailClick('footer_contact_info')} className="text-navy-200 transition hover:text-white break-all">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                <span className="text-navy-200">
                  {company.hours.map((h) => (
                    <span key={h.day} className="block">
                      <span className="font-medium text-white">{h.day}:</span> {h.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
            <Link to="/yhteystiedot" className="btn-primary mt-6">
              Pyydä tarjous
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-navy-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. Kaikki oikeudet pidätetään.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/tietosuojaseloste" className="transition hover:text-white">Tietosuojaseloste</Link>
            <Link to="/evastekaytanto" className="transition hover:text-white">Evästekäytäntö</Link>
            <Link to="/kayttoehdot" className="transition hover:text-white">Käyttöehdot</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
