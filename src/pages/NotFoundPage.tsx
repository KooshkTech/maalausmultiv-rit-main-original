import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Seo } from '@/components/Seo';

export function NotFoundPage() {
  return (
    <>
      <Seo title="Sivua ei löydy" description="Etsimääsi sivua ei löytynyt Maalaus Multivärin sivustolta. Palaa etusivulle tai ota yhteyttä." path="/404" indexable={false} />
      <section className="flex min-h-[70vh] items-center justify-center bg-navy-50/60 px-5 pt-16">
        <div className="text-center">
          <p className="font-display text-7xl font-extrabold text-orange-500 sm:text-9xl">404</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Hups — tätä sivua ei löydy
          </h1>
          <p className="mx-auto mt-3 max-w-md text-navy-600">
            Etsimääsi sivua ei ole olemassa tai se on siirretty. Palaa etusivulle
            tai tutustu palveluihimme.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary">
              <Home className="h-4 w-4" />
              Etusivulle
            </Link>
            <Link to="/palvelut" className="btn-outline">
              <ArrowLeft className="h-4 w-4" />
              Palvelut
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
