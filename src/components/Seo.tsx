import { Helmet } from 'react-helmet-async';
import { company } from '@/data/company';
import { serviceAreas } from '@/data/site';
import { ogImage } from '@/config/images';

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
  indexable?: boolean;
  breadcrumbs?: { name: string; path: string }[];
  faqSchema?: { q: string; a: string }[];
  serviceSchema?: {
    name: string;
    description: string;
    areaServed: string;
  };
  articleSchema?: {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author: string;
  };
};

const BASE_URL = 'https://maalausmultivari.fi';
const DEFAULT_IMAGE = ogImage;
const absoluteUrl = (value: string) => (value.startsWith('http') ? value : `${BASE_URL}${value}`);

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}/#localbusiness`,
  name: company.name,
  description:
    'Maalaus Multiväri tarjoaa laadukkaita maalaus- ja siivouspalveluja yksityisille ja yrityksille Uudellamaalla.',
  url: BASE_URL,
  telephone: '+358402429650',
  email: company.email,
  image: absoluteUrl(DEFAULT_IMAGE),
  priceRange: '€€',
  areaServed: serviceAreas.map((a) => a.name),
  address: {
    '@type': 'PostalAddress',
    addressLocality: company.city,
    addressRegion: company.region,
    addressCountry: 'FI',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 60.2934,
    longitude: 24.9574,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '15:00',
    },
  ],
  sameAs: [] as string[],
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: company.name,
  url: BASE_URL,
  telephone: '+358402429650',
  email: company.email,
  logo: `${BASE_URL}/OY.png`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: company.city,
    addressRegion: company.region,
    addressCountry: 'FI',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: company.name,
  inLanguage: 'fi-FI',
  publisher: { '@id': `${BASE_URL}/#organization` },
};

export function Seo({
  title,
  description =
    'Maalaus Multiväri tarjoaa laadukkaita maalaus- ja siivouspalveluja yksityisille ja yrityksille Uudellamaalla. Pyydä ilmainen arvio jo tänään.',
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  indexable = true,
  breadcrumbs,
  faqSchema,
  serviceSchema,
  articleSchema,
}: SeoProps) {
  const fullTitle = title
    ? `${title} | ${company.name}`
    : `${company.name} | Maalaus- ja siivouspalveluja Uudellamaalla`;
  const url = `${BASE_URL}${path}`;
  // Social crawlers (Facebook, LinkedIn, WhatsApp, X) require an absolute
  // URL for og:image / twitter:image — a root-relative path like
  // "/images/..." is not reliably resolved and breaks link previews.
  const absoluteImage = absoluteUrl(image);

  const schemas: Record<string, unknown>[] = [localBusinessSchema, organizationSchema, websiteSchema];

  if (breadcrumbs) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: `${BASE_URL}${b.path}`,
      })),
    });
  }

  if (faqSchema) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqSchema.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  if (serviceSchema) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: serviceSchema.name,
      description: serviceSchema.description,
      provider: {
        '@type': 'ProfessionalService',
        name: company.name,
        telephone: '+358402429650',
        areaServed: serviceAreas.map((a) => a.name),
      },
      areaServed: serviceSchema.areaServed,
    });
  }

  if (articleSchema) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleSchema.headline,
      description: articleSchema.description,
      image: absoluteUrl(articleSchema.image),
      datePublished: articleSchema.datePublished,
      dateModified: articleSchema.dateModified ?? articleSchema.datePublished,
      author: {
        '@type': 'Organization',
        name: articleSchema.author,
      },
      publisher: {
        '@type': 'Organization',
        name: company.name,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/OY.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
    });
  }

  return (
    <Helmet>
      <html lang="fi" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={indexable ? 'index, follow' : 'noindex, follow'} />
      <meta name="googlebot" content={indexable ? 'index, follow' : 'noindex, follow'} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:locale" content="fi_FI" />
      <meta property="og:site_name" content={company.name} />
      <meta property="og:image:alt" content={`${company.name} — maalaus- ja siivouspalvelut`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={`${company.name} — maalaus- ja siivouspalvelut`} />

      {schemas.map((schema, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
