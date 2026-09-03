import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, GraduationCap, Heart, Home, PaintRoller, School, ShoppingBasket, Sparkles } from 'lucide-react';
import { Seo } from '@/components/Seo';

type SpaceKey = 'home' | 'office' | 'shop' | 'school' | 'daycare';
type MoodKey = 'happy' | 'calm' | 'energy' | 'focus';

const spaces = [
  { key: 'home' as const, label: 'Koti', icon: Home },
  { key: 'office' as const, label: 'Toimisto', icon: Building2 },
  { key: 'shop' as const, label: 'Liike / marketti', icon: ShoppingBasket },
  { key: 'school' as const, label: 'Koulu', icon: GraduationCap },
  { key: 'daycare' as const, label: 'Päiväkoti', icon: School },
];
const moods = [
  { key: 'happy' as const, label: 'Iloinen', emoji: '☀️' },
  { key: 'calm' as const, label: 'Rauhallinen', emoji: '🌿' },
  { key: 'energy' as const, label: 'Energinen', emoji: '✨' },
  { key: 'focus' as const, label: 'Keskittynyt', emoji: '🎯' },
];
const palettes: Record<MoodKey, { name: string; colors: string[]; note: string }> = {
  happy: { name: 'Valo & ilo', colors: ['#F7C948','#F28C45','#F5E6C8','#FFFFFF'], note: 'Lämpimiä, valoisia sävyjä iloiseen ja kutsuvaan tunnelmaan.' },
  calm: { name: 'Rauha & luonto', colors: ['#A8C3A0','#D8E2DC','#9DB7C4','#F7F4ED'], note: 'Pehmeitä vihreän ja sinisen sukuisia sävyjä rauhalliseen ilmeeseen.' },
  energy: { name: 'Energia & luovuus', colors: ['#F26B38','#F2B84B','#D76BA5','#F7F2E8'], note: 'Elävämpi yhdistelmä tiloihin, joissa halutaan aktiivista ja luovaa tunnelmaa.' },
  focus: { name: 'Selkeys & fokus', colors: ['#315A6B','#9BB7A5','#E7E2D5','#FAFAF8'], note: 'Hillitympi paletti työ-, opiskelu- ja keskittymistiloihin.' },
};

export function VariLabPage() {
  const [space, setSpace] = useState<SpaceKey>('home');
  const [mood, setMood] = useState<MoodKey>('happy');
  const palette = palettes[mood];
  const spaceLabel = useMemo(() => spaces.find((item) => item.key === space)?.label ?? 'tila', [space]);
  return <>
    <Seo title="VäriLab – löydä tilaan sopiva väritunnelma" description="Hauska värivisa koteihin, toimistoihin, liikkeisiin, kouluihin ja päiväkoteihin. Löydä paletti, lue värien ja tunteiden tutkimuksesta ja kokeile ideaa VäriKamussa." path="/varilab" />
    <main className="bg-navy-50/60 pb-20">
      <section className="bg-navy-950 px-4 py-14 text-white sm:py-20"><div className="container-base text-center"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-orange-300"><Sparkles className="h-4 w-4"/> VäriLab</span><h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-extrabold sm:text-6xl">Millaisen tunteen haluat tilaan?</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-navy-200">Valitse tila ja tunnelma. Saat väripaletin, jonka voit viedä seuraavaksi omaan kuvaasi VäriKamussa.</p></div></section>
      <section className="container-base -mt-7 px-4 sm:px-0"><div className="rounded-[2rem] bg-white p-5 shadow-lift sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[.16em] text-orange-600">1 · Mitä maalataan?</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{spaces.map(({key,label,icon:Icon})=><button key={key} onClick={()=>setSpace(key)} className={`rounded-2xl border p-4 text-left transition ${space===key?'border-orange-400 bg-orange-50 shadow-soft':'border-navy-100 hover:border-orange-200'}`}><Icon className="h-6 w-6 text-orange-600"/><span className="mt-3 block text-sm font-bold text-navy-900">{label}</span></button>)}</div>
        <p className="mt-8 text-xs font-extrabold uppercase tracking-[.16em] text-orange-600">2 · Valitse tunnelma</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{moods.map(({key,label,emoji})=><button key={key} onClick={()=>setMood(key)} className={`rounded-2xl border p-4 text-center transition ${mood===key?'border-navy-800 bg-navy-950 text-white':'border-navy-100 text-navy-900 hover:bg-navy-50'}`}><span className="text-2xl">{emoji}</span><span className="mt-2 block font-bold">{label}</span></button>)}</div>
        <div className="mt-8 overflow-hidden rounded-3xl border border-navy-100"><div className="grid grid-cols-4">{palette.colors.map(c=><div key={c} className="h-24 sm:h-36" style={{backgroundColor:c}} title={c}/>)}</div><div className="p-6 sm:p-8"><p className="text-xs font-extrabold uppercase tracking-wider text-orange-600">{spaceLabel} · sinun tuloksesi</p><h2 className="mt-2 font-display text-3xl font-extrabold text-navy-950">{palette.name}</h2><p className="mt-3 max-w-2xl leading-7 text-navy-600">{palette.note} Värit eivät kuitenkaan takaa tiettyä tunnetta: valaistus, ympäristö, kulttuuri ja henkilökohtaiset mieltymykset vaikuttavat kokemukseen.</p><div className="mt-5 flex flex-wrap gap-2">{palette.colors.map(c=><span key={c} className="rounded-full bg-navy-50 px-3 py-1.5 font-mono text-xs font-bold text-navy-700">{c}</span>)}</div><div className="mt-7 flex flex-wrap gap-3"><Link to="/app/varikamu" className="btn-primary"><PaintRoller className="h-4 w-4"/>Kokeile VäriKamussa <ArrowRight className="h-4 w-4"/></Link><Link to="/blogi/varit-tunteet-ja-hyvinvointi" className="btn-outline"><Heart className="h-4 w-4"/>Miten värit liittyvät tunteisiin?</Link></div></div></div>
      </div></section>
      <section className="container-base px-4 pt-12 sm:px-0"><div className="rounded-3xl bg-orange-50 p-6 sm:p-8"><h2 className="font-display text-2xl font-extrabold text-navy-950">Tutkimus ennen myyttejä</h2><p className="mt-3 max-w-3xl leading-7 text-navy-700">VäriLab on inspiraatiotyökalu, ei terveys- tai psykologinen testi. Tutkimuksissa ihmiset yhdistävät värejä ja tunteita systemaattisesti, mutta se ei tarkoita, että seinän maalaaminen tietyllä värillä automaattisesti tekisi ihmisestä onnellisemman. Blogissa avaamme tutkimuksen, rajat ja käytännön suunnitteluvinkit.</p><Link to="/blogi/varit-tunteet-ja-hyvinvointi" className="mt-5 inline-flex items-center gap-2 font-bold text-orange-700">Lue tutkimukseen perustuva artikkeli <ArrowRight className="h-4 w-4"/></Link></div></section>
    </main>
  </>;
}
