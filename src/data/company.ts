export const company = {
  name: 'Maalaus Multiväri',
  tagline: 'Laadukkaita maalaus- ja siivouspalveluja Uudellamaalla',
  phone: '040 242 9650',
  phoneHref: 'tel:+358402429650',
  email: 'info@maalausmultivari.fi',
  emailHref: 'mailto:info@maalausmultivari.fi',
  city: 'Vantaa',
  region: 'Uusimaa',
  country: 'Suomi',
  whatsapp: '358402429650',
  whatsappHref: 'https://wa.me/358402429650',
  mapsEmbed:
    'https://www.google.com/maps?q=Vantaa,+Finland&output=embed',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Vantaa+Finland',
  hours: [
    { day: 'Maanantai – Perjantai', time: '07:00 – 18:00' },
    { day: 'Lauantai', time: '09:00 – 15:00' },
    { day: 'Sunnuntai', time: 'Suljettu' },
  ],
} as const;

export type Company = typeof company;
