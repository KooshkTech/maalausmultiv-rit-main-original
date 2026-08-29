import { useEffect, useState } from 'react';
import { X, PaintRoller, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudioIntroPopup() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(window.localStorage.getItem('mvv-studio-popup-dismissed') !== '1'); }, []);
  const dismiss = () => { window.localStorage.setItem('mvv-studio-popup-dismissed', '1'); setVisible(false); };
  if (!visible) return null;
  return <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-3xl border border-navy-100 bg-white p-5 shadow-2xl sm:p-6" role="dialog" aria-label="Tutustu studioihin"><button type="button" onClick={dismiss} className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full text-navy-500 hover:bg-navy-50" aria-label="Sulje"><X className="size-5" /></button><p className="pr-8 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Multiväri Home Transformation Studio</p><h2 className="mt-2 pr-8 font-display text-xl font-extrabold text-navy-950">Suunnittele ennen kuin päätät</h2><p className="mt-2 max-w-lg text-sm leading-6 text-navy-600">Kokeile värejä tai suunnittele siivousta omalla kuvallasi. Saat ensin hyödyllisen suunnitelman, ilman painostavaa lomaketta.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Link to="/varikamu" onClick={dismiss} className="flex items-center gap-3 rounded-2xl bg-navy-950 p-4 text-white hover:bg-navy-800"><PaintRoller className="size-5 text-orange-300" /><span><strong className="block">VäriKamu</strong><span className="text-xs text-navy-100">Maalisuunnittelija</span></span></Link><Link to="/siivouskamu" onClick={dismiss} className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4 text-navy-950 hover:bg-orange-100"><Sparkles className="size-5 text-orange-600" /><span><strong className="block">SiivousKamu</strong><span className="text-xs text-navy-600">Siivoussuunnittelija</span></span></Link></div></aside>;
}
