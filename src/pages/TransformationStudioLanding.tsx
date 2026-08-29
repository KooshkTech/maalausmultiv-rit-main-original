import { Link } from 'react-router-dom';
import { ArrowRight, Brush, Sparkles, PaintRoller } from 'lucide-react';
import { Seo } from '@/components/Seo';

export function TransformationStudioLanding({ kind }: { kind: 'paint' | 'cleaning' }) {
  const paint = kind === 'paint';
  const title = paint ? 'VäriKamu – maalisuunnittelija' : 'SiivousKamu – siivoussuunnittelija';
  const description = paint
    ? 'Suunnittele huoneen värit omalla kuvallasi VäriKamussa. Kokeile pintoja, tallenna ideasi ja pyydä ammattilainen toteuttamaan suunnitelma.'
    : 'Suunnittele siivous helposti SiivousKamussa. Merkitse kohteet, arvioi työ ja pyydä Maalaus Multiväriltä tarjous.';
  const features = paint ? ['Kokeile värejä omassa kuvassasi', 'Valitse pinta ja maalaa kerroksittain', 'Tallenna suunnitelma ja pyydä tarjous'] : ['Merkitse puhdistettavat alueet', 'Valitse siivouksen taso ja toistuvuus', 'Saat läpinäkyvän alustavan arvion'];
  return <><Seo title={title} description={description} path={paint ? '/varikamu' : '/siivouskamu'} serviceSchema={{ name: title, description, areaServed: 'Helsinki, Espoo, Vantaa ja Uusimaa' }} />
    <main className="container-base py-14 sm:py-20"><div className="mx-auto max-w-4xl text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">{paint ? <PaintRoller className="size-8" /> : <Sparkles className="size-8" />}</div><p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Multiväri Home Transformation Studio</p><h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy-950 sm:text-6xl">{paint ? 'Muuta tilasi ennen kuin päätät.' : 'Näe ero. Me hoidamme loput.'}</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-navy-600">{description}</p><Link to={paint ? '/paint-studio' : '/cleaning-studio'} className="btn-primary mt-8">Aloita ilmaiseksi <ArrowRight className="size-5" /></Link><p className="mt-3 text-sm text-navy-500">Kokeile ilman rekisteröitymistä. Tallenna tai pyydä tarjous vasta kun suunnitelma tuntuu omalta.</p></div><div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">{features.map((feature, i) => <div key={feature} className="card p-6 text-left"><span className="flex size-9 items-center justify-center rounded-xl bg-navy-100 text-navy-800">{i === 0 ? (paint ? <Brush className="size-4" /> : <Sparkles className="size-4" />) : i + 1}</span><h2 className="mt-4 font-display text-lg font-bold text-navy-950">{feature}</h2></div>)}</div><section className="mx-auto mt-16 max-w-3xl rounded-3xl bg-navy-950 p-8 text-center text-white"><h2 className="font-display text-2xl font-bold">Suunnittele rauhassa, päätä varmemmin</h2><p className="mt-3 leading-7 text-navy-100">Työkalu on suunniteltu kokeiluun. Lopullinen hinta ja toteutus varmistetaan aina kohteen mukaan.</p><Link to="/yhteystiedot" className="btn-primary mt-6">Pyydä ammattilainen mukaan <ArrowRight className="size-4" /></Link></section></main></>;
}

export function VarikamuLanding() { return <TransformationStudioLanding kind="paint" />; }
export function SiivouskamuLanding() { return <TransformationStudioLanding kind="cleaning" />; }

export function StudioAuthPopup() {
  return <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md rounded-2xl border border-navy-100 bg-white p-5 shadow-2xl"><p className="text-sm font-bold text-navy-950">Kokeile VäriKamua ja SiivousKamua</p><p className="mt-1 text-sm leading-6 text-navy-600">Suunnittele ensin, pyydä tarjous vasta kun lopputulos tuntuu omalta.</p><div className="mt-4 flex gap-2"><Link className="btn-primary flex-1 justify-center" to="/varikamu">VäriKamu</Link><Link className="btn-outline flex-1 justify-center" to="/siivouskamu">SiivousKamu</Link></div></div>;
}

export function StudioIcon() { return <PaintRoller className="size-5" />; }
