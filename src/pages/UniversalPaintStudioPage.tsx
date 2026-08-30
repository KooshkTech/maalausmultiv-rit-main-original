import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Camera, Download, Eraser, Paintbrush, PaintRoller, Redo2, RotateCcw, Sparkles, Undo2, Upload } from 'lucide-react';

type Tool = 'brush' | 'roller' | 'eraser' | 'smart';
type Point = { x: number; y: number };

const palette = ['#F2EFE6','#D8C9B5','#C9CBC8','#A7B19B','#9FB4C3','#B86F52','#496255','#45494B','#1D2022','#FF6B9D','#6C5CE7','#00B894'];

export function UniversalPaintStudioPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const paintRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<Point | null>(null);
  const strokePointsRef = useRef<Point[]>([]);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#D8C9B5');
  const [brushSize, setBrushSize] = useState(34);
  const [opacity, setOpacity] = useState(0.42);
  const [tolerance, setTolerance] = useState(48);
  const [autoFill, setAutoFill] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [kidsMode, setKidsMode] = useState(false);
  const [message, setMessage] = useState('Maalaa vähän pintaa. VäriKamu yrittää täydentää saman pinnan automaattisesti.');

  const loadFile = (file?: File) => {
    if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) return;
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setHistory([]); setHistoryIndex(-1);
    setMessage('Valitse väri ja maalaa vain osa pinnasta. Automaattinen täyttö viimeistelee valintaa ilman ulkoista AI-kiintiötä.');
  };

  const onImageLoad = () => {
    const img = imageRef.current; const canvas = paintRef.current;
    if (!img || !canvas) return;
    const scale = Math.min(1, 1400 / img.naturalWidth);
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    setSize({ width, height });
    canvas.width = width; canvas.height = height;
    canvas.getContext('2d')?.clearRect(0,0,width,height);
    const source = document.createElement('canvas'); source.width = width; source.height = height;
    const ctx = source.getContext('2d'); if (ctx) ctx.drawImage(img,0,0,width,height);
    sourceRef.current = source;
    const first = canvas.toDataURL('image/png'); setHistory([first]); setHistoryIndex(0);
  };

  const pointFromEvent = (event: ReactPointerEvent<HTMLDivElement>): Point | null => {
    const stage = stageRef.current;
    if (!stage || !size.width || !size.height) return null;
    const rect = stage.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(size.width - 1, ((event.clientX - rect.left) / rect.width) * size.width)),
      y: Math.max(0, Math.min(size.height - 1, ((event.clientY - rect.top) / rect.height) * size.height)),
    };
  };

  const commit = () => {
    const canvas = paintRef.current; if (!canvas) return;
    const next = [...history.slice(0, historyIndex + 1), canvas.toDataURL('image/png')].slice(-30);
    setHistory(next); setHistoryIndex(next.length - 1);
  };

  const drawLine = (from: Point, to: Point) => {
    const ctx = paintRef.current?.getContext('2d'); if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.globalAlpha = tool === 'eraser' ? 1 : opacity;
    ctx.strokeStyle = tool === 'eraser' ? '#000' : color;
    ctx.lineWidth = tool === 'roller' ? brushSize * 2.4 : brushSize;
    ctx.lineCap = tool === 'roller' ? 'square' : 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(from.x,from.y); ctx.lineTo(to.x,to.y); ctx.stroke(); ctx.restore();
  };

  const smartFillFromSeeds = (rawSeeds: Point[], saveHistory = true) => {
    const source = sourceRef.current; const target = paintRef.current;
    const sourceCtx = source?.getContext('2d'); const targetCtx = target?.getContext('2d');
    if (!source || !target || !sourceCtx || !targetCtx || rawSeeds.length === 0) return;

    const w = source.width, h = source.height;
    const image = sourceCtx.getImageData(0,0,w,h); const data = image.data;
    const stride = Math.max(1, Math.floor(rawSeeds.length / 10));
    const seeds = rawSeeds.filter((_,i)=>i % stride === 0).slice(0,12);
    const refs = seeds.map(seed => {
      const x = Math.max(0,Math.min(w-1,Math.floor(seed.x))); const y = Math.max(0,Math.min(h-1,Math.floor(seed.y))); const i=(y*w+x)*4;
      return { index:y*w+x, r:data[i], g:data[i+1], b:data[i+2] };
    });

    const seen = new Uint8Array(w*h); const mask = new Uint8Array(w*h); const queue = new Int32Array(w*h);
    let head=0,tail=0,count=0;
    refs.forEach(ref=>{ if(!seen[ref.index]){ seen[ref.index]=1; queue[tail++]=ref.index; } });
    const maxPixels=Math.min(w*h,900000);
    const limit=tolerance*tolerance;
    const match=(idx:number)=>{ const i=idx*4; let best=Number.POSITIVE_INFINITY; for(const ref of refs){ const dr=data[i]-ref.r,dg=data[i+1]-ref.g,db=data[i+2]-ref.b; const d=dr*dr+dg*dg+db*db; if(d<best) best=d; if(best<=limit) return true; } return false; };

    while(head<tail && count<maxPixels){
      const idx=queue[head++]; if(!match(idx)) continue; mask[idx]=1; count++;
      const x=idx%w, y=Math.floor(idx/w);
      if(x>0){const n=idx-1;if(!seen[n]){seen[n]=1;queue[tail++]=n;}}
      if(x<w-1){const n=idx+1;if(!seen[n]){seen[n]=1;queue[tail++]=n;}}
      if(y>0){const n=idx-w;if(!seen[n]){seen[n]=1;queue[tail++]=n;}}
      if(y<h-1){const n=idx+w;if(!seen[n]){seen[n]=1;queue[tail++]=n;}}
    }

    const overlayCanvas=document.createElement('canvas'); overlayCanvas.width=w; overlayCanvas.height=h;
    const overlayCtx=overlayCanvas.getContext('2d'); if(!overlayCtx) return;
    const overlay=overlayCtx.createImageData(w,h); const rgb=parseInt(color.slice(1),16); const r=(rgb>>16)&255,g=(rgb>>8)&255,b=rgb&255;
    for(let i=0;i<mask.length;i++){ if(mask[i]){ const p=i*4; const sourceLight=(data[p]+data[p+1]+data[p+2])/765; const alpha=Math.round(255*opacity*(0.82+sourceLight*0.18)); overlay.data[p]=r; overlay.data[p+1]=g; overlay.data[p+2]=b; overlay.data[p+3]=alpha; } }
    overlayCtx.putImageData(overlay,0,0);
    targetCtx.save(); targetCtx.globalCompositeOperation='source-over'; targetCtx.drawImage(overlayCanvas,0,0); targetCtx.restore();
    if(saveHistory) commit();
    setMessage(count>=maxPixels ? 'Automaattinen täyttö pysähtyi turvarajalle. Kumoa ja pienennä Älytäytön rajaa.' : `Pinta täydennettiin automaattisesti (${Math.round(count/1000)}k px). Jos reuna meni väärin, kumoa ja säädä Älytäytön rajaa.`);
  };

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imageUrl) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = pointFromEvent(event); if (!p) return;
    if (tool === 'smart') { smartFillFromSeeds([p], true); return; }
    drawingRef.current=true; lastRef.current=p; strokePointsRef.current=[p]; drawLine(p,p);
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if(!drawingRef.current || !lastRef.current) return;
    const p=pointFromEvent(event); if(!p) return;
    drawLine(lastRef.current,p);
    const prev=strokePointsRef.current[strokePointsRef.current.length-1];
    if(!prev || Math.hypot(p.x-prev.x,p.y-prev.y)>Math.max(10,brushSize*.35)) strokePointsRef.current.push(p);
    lastRef.current=p;
  };

  const pointerUp = () => {
    if(!drawingRef.current) return;
    drawingRef.current=false; lastRef.current=null;
    const seeds=strokePointsRef.current; strokePointsRef.current=[];
    if((tool==='brush'||tool==='roller') && autoFill && seeds.length){ smartFillFromSeeds(seeds,true); }
    else commit();
  };

  const restore = (index:number) => { const canvas=paintRef.current; const frame=history[index]; if(!canvas||!frame) return; const ctx=canvas.getContext('2d'); if(!ctx) return; const img=new Image(); img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0);setHistoryIndex(index);}; img.src=frame; };
  const undo=()=>{ if(historyIndex>0) restore(historyIndex-1); };
  const redo=()=>{ if(historyIndex<history.length-1) restore(historyIndex+1); };
  const reset=()=>{ const c=paintRef.current; if(!c) return; c.getContext('2d')?.clearRect(0,0,c.width,c.height); commit(); };

  const download = (type:'png'|'jpg') => {
    const img=imageRef.current, paint=paintRef.current; if(!img||!paint||!size.width) return;
    const out=document.createElement('canvas'); out.width=size.width; out.height=size.height; const ctx=out.getContext('2d'); if(!ctx) return;
    ctx.drawImage(img,0,0,size.width,size.height); ctx.drawImage(paint,0,0);
    const a=document.createElement('a'); a.download=`varikamu-${Date.now()}.${type}`; a.href=type==='jpg'?out.toDataURL('image/jpeg',.92):out.toDataURL('image/png'); a.click();
  };

  return <section className={kidsMode ? 'min-h-screen bg-orange-50 px-3 py-4' : 'min-h-screen bg-navy-50 px-3 py-4'}>
    <div className="container-base max-w-6xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">VäriKamu</p><h1 className="font-display text-2xl font-extrabold text-navy-950">Maalaa vähän – VäriKamu täydentää pintaa</h1></div><button type="button" className="btn-outline" onClick={()=>setKidsMode(v=>!v)}>{kidsMode?'Normaali tila':'🎨 Lasten tila'}</button></div>
      <div className="grid gap-4 lg:grid-cols-[1fr_310px]">
        <div className="card overflow-hidden p-3 sm:p-4">
          {!imageUrl ? <div className="grid min-h-[52vh] place-items-center rounded-2xl border-2 border-dashed border-navy-200 bg-white p-6 text-center"><div><Camera className="mx-auto size-12 text-orange-500"/><h2 className="mt-4 text-xl font-bold">Ota kuva tai lataa kuva</h2><p className="mt-2 text-sm text-navy-600">Seinä, ovi, ikkuna, kaappi, huonekalu, puuosa, metalli tai muu maalattava pinta.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="btn-primary" onClick={()=>cameraRef.current?.click()}><Camera className="size-4"/> Ota kuva</button><button className="btn-outline" onClick={()=>fileRef.current?.click()}><Upload className="size-4"/> Lataa kuva</button></div></div></div> : <div ref={stageRef} className="relative mx-auto touch-none overflow-hidden rounded-2xl bg-navy-950" style={{aspectRatio:size.width&&size.height?`${size.width}/${size.height}`:'4/3'}} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onPointerLeave={pointerUp}><img ref={imageRef} src={imageUrl} onLoad={onImageLoad} draggable={false} className="absolute inset-0 h-full w-full select-none object-contain"/><canvas ref={paintRef} className="absolute inset-0 h-full w-full"/></div>}
          <input ref={fileRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>loadFile(e.target.files?.[0])}/><input ref={cameraRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={e=>loadFile(e.target.files?.[0])}/>
          {imageUrl && <div className="mt-3 flex flex-wrap gap-2"><button className="btn-outline" onClick={undo} disabled={historyIndex<=0}><Undo2 className="size-4"/>Kumoa</button><button className="btn-outline" onClick={redo} disabled={historyIndex>=history.length-1}><Redo2 className="size-4"/>Tee uudelleen</button><button className="btn-outline" onClick={reset}><RotateCcw className="size-4"/>Tyhjennä maalit</button></div>}
        </div>
        <aside className="space-y-4">
          <div className="card p-4"><h2 className="font-bold text-navy-950">1. Työkalu</h2><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>setTool('brush')} className={tool==='brush'?'btn-primary':'btn-outline'}><Paintbrush className="size-4"/>Sivellin</button><button onClick={()=>setTool('roller')} className={tool==='roller'?'btn-primary':'btn-outline'}><PaintRoller className="size-4"/>Tela</button><button onClick={()=>setTool('smart')} className={tool==='smart'?'btn-primary':'btn-outline'}><Sparkles className="size-4"/>Täytä napautus</button><button onClick={()=>setTool('eraser')} className={tool==='eraser'?'btn-primary':'btn-outline'}><Eraser className="size-4"/>Pyyhin</button></div><label className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-orange-50 px-3 py-3 text-sm font-bold text-navy-900"><span>✨ Täydennä pinta automaattisesti</span><input type="checkbox" checked={autoFill} onChange={e=>setAutoFill(e.target.checked)} className="size-5 accent-orange-500"/></label><p className="mt-3 text-xs leading-5 text-navy-600">Kun tämä on päällä, maalaa vain osa pinnasta. Kun nostat sormen tai hiiren, VäriKamu käyttää koko siveltimen jälkeä vihjeenä ja yrittää täyttää yhtenäisen pinnan automaattisesti.</p></div>
          <div className="card p-4"><h2 className="font-bold text-navy-950">2. Väri</h2><div className="mt-3 flex flex-wrap gap-2">{palette.map(c=><button key={c} aria-label={c} onClick={()=>setColor(c)} className={`size-9 rounded-full border-2 ${color===c?'border-orange-500 ring-2 ring-orange-200':'border-white'}`} style={{backgroundColor:c}}/>)}<input type="color" value={color} onChange={e=>setColor(e.target.value)} className="h-9 w-12 rounded"/></div></div>
          <div className="card p-4"><label className="text-sm font-bold">Siveltimen koko {brushSize}px<input className="mt-2 w-full accent-orange-500" type="range" min="8" max="100" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))}/></label><label className="mt-4 block text-sm font-bold">Värin peittävyys {Math.round(opacity*100)}%<input className="mt-2 w-full accent-orange-500" type="range" min="15" max="80" value={Math.round(opacity*100)} onChange={e=>setOpacity(Number(e.target.value)/100)}/></label><label className="mt-4 block text-sm font-bold">Älytäytön raja {tolerance}<input className="mt-2 w-full accent-orange-500" type="range" min="12" max="95" value={tolerance} onChange={e=>setTolerance(Number(e.target.value))}/></label></div>
          <div className="card p-4"><p className="text-sm leading-6 text-navy-700">{message}</p><div className="mt-3 grid grid-cols-2 gap-2"><button className="btn-outline" onClick={()=>download('png')} disabled={!imageUrl}><Download className="size-4"/>PNG</button><button className="btn-primary" onClick={()=>download('jpg')} disabled={!imageUrl}><Download className="size-4"/>JPG</button></div></div>
        </aside>
      </div>
    </div>
  </section>;
}
