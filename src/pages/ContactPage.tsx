import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { Reveal } from '@/components/Reveal';
import { QuoteForm } from '@/components/QuoteForm';
import { company } from '@/data/company';
import { images } from '@/config/images';

export function ContactPage() {
  return (
    <>
      <Seo
        title="Yhteystiedot"
        description="Ota yhteyttä Maalaus Multiväriin. Soita, lähetä WhatsApp-viesti tai täytä tarjouspyyntölomake. Pyydä ilmainen arvio maalaus- tai siivoustyöstä."
        path="/yhteystiedot"
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Yhteystiedot', path: '/yhteystiedot' },
        ]}
      />
      <PageHero
        eyebrow="Yhteystiedot"
        crumb="Yhteystiedot"
        title="Lähdetään tekemään yhdessä"
        description="Olemme täällä sinua varten. Soita, laita WhatsAppia tai täytä tarjouspyyntölomake — vastaamme 24 tunnin sisällä."
        image={images.pages.contact}
      />

      <section className="section-pad bg-white">
        <div className="container-base">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <Reveal className="lg:col-span-5">
              <h2 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
                Yhteystiedot
              </h2>
              <p className="mt-4 text-base leading-relaxed text-navy-600">
                Voit tavoittaa meitä usealla eri tavalla. Valitse sinulle sopivin
                yhteydenottotapa, niin autamme sinua eteenpäin.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <a href={company.phoneHref} className="card group flex items-center gap-4 p-5 hover:border-orange-200">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-navy-500">Puhelin</p>
                    <p className="font-display text-base font-bold text-navy-900">{company.phone}</p>
                  </div>
                </a>
                <a href={company.emailHref} className="card group flex items-center gap-4 p-5 hover:border-orange-200">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-navy-500">Sähköposti</p>
                    <p className="font-display text-base font-bold text-navy-900">{company.email}</p>
                  </div>
                </a>
                <a href={company.whatsappHref} target="_blank" rel="noopener noreferrer" className="card group flex items-center gap-4 p-5 hover:border-orange-200">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] transition group-hover:bg-[#25D366] group-hover:text-white">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-navy-500">WhatsApp</p>
                    <p className="font-display text-base font-bold text-navy-900">Laita viesti</p>
                  </div>
                </a>
                <div className="card flex items-center gap-4 p-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-navy-500">Toimialue</p>
                    <p className="font-display text-base font-bold text-navy-900">{company.city}, {company.region}</p>
                  </div>
                </div>
                <div className="card flex items-start gap-4 p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div className="w-full">
                    <p className="text-xs font-medium uppercase tracking-wider text-navy-500">Aukioloajat</p>
                    <ul className="mt-1 flex flex-col gap-0.5 text-sm text-navy-800">
                      {company.hours.map((h) => (
                        <li key={h.day} className="flex justify-between gap-4">
                          <span className="font-medium">{h.day}</span>
                          <span>{h.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150} className="lg:col-span-7">
              <QuoteForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
