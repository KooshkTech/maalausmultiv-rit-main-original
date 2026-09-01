import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Camera, Download, Eraser, HelpCircle, Maximize2, Paintbrush, PaintRoller, Redo2, RotateCcw, Shield, Sparkles, Undo2, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { CanvasPipeline } from '@/lib/engine/CanvasPipeline';
import { MaskLayer } from '@/lib/engine/MaskLayer';
import { SegmentationProvider, mergeManualAndSmart } from '@/lib/ai/SegmentationProvider';

type Point = { x: number; y: number };
type Tool = 'brush' | 'corner' | 'roller' | 'eraser' | 'cover' | 'scraper' | 'putty' | 'sand';
type ViewMode = 'before' | 'after' | 'compare';
type Snapshot = { manual: number[]; smart: number[]; protect: number[]; prep: string };

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const palette = ['#F2EFE6','#D8C9B5','#C9CBC8','#A7B19B','#9FB4C3','#B86F52','#496255','#45494B','#1D2022','#FF6B9D','#6C5CE7','#00B894'];
const brushes = [{label:'0.5 cm',px:6},{label:'1 cm',px:11},{label:'2 cm',px:18},{label:'3 cm',px:26},{label:'5 cm',px:38},{label:'7 cm',px:54},{label:'10 cm',px:72}];
const covers = [{label:'1 cm',px:12},{label:'2 cm',px:22},{label:'5 cm',px:42},{label:'10 cm',px:76}];
const rgb = (hex: string): [number, number, number] => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const segmentation = new SegmentationProvider();

export function VarikamuEnterpriseStudioPage() {
  const fileRef = useRef<HTMLInputElement>(null), cameraRef = useRef<HTMLInputElement>(null), imageRef = useRef<HTMLImageElement>(null), stageRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLCanvasElement>(null), protectCanvasRef = useRef<HTMLCanvasElement>(null), sourceRef = useRef<HTMLCanvasElement | null>(null), prepRef = useRef<HTMLCanvasElement | null>(null);
  const manualRef = useRef<MaskLayer | null>(null), smartRef = useRef<MaskLayer | null>(null), protectRef = useRef<MaskLayer | null>(null);
  const drawingRef = useRef(false), lastRef = useRef<Point | null>(null), startRef = useRef<Point | null>(null), strokeRef = useRef<Point[]>([]), generationRef = useRef(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null), [size, setSize] = useState({width:0,height:0}), [tool,setTool] = useState<Tool>('brush');
  const [color,setColor] = useState('#9FB4C3'), [brushSize,setBrushSize] = useState(38), [coverSize,setCoverSize] = useState(22), [opacity,setOpacity] = useState(.95), [passes,setPasses] = useState<1|2|3>(3);
  const [smart,setSmart] = useState(true), [stabilizer,setStabilizer] = useState(76), [tolerance,setTolerance] = useState(32), [showProtection,setShowProtection] = useState(true), [smartBusy,setSmartBusy] = useState(false);
  const [history,setHistory] = useState<Snapshot[]>([]), [historyIndex,setHistoryIndex] = useState(-1), [viewMode,setViewMode] = useState<ViewMode>('after'), [compareAt,setCompareAt] = useState(50), [zoom,setZoom] = useState(1), [showGuide,setShowGuide] = useState(true);
  const [message,setMessage] = useState('Enterprise Engine valmis: manuaalinen jälki säilyy aina, Smart täydentää sen ympärille ja Suojaa rajaa aluetta.');

  const loadFile = (file?: File) => {
    if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) return;
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file)); setHistory([]); setHistoryIndex(-1); setZoom(1); setViewMode('after');
    setMessage('Kuva valmis. Tarvittaessa Kaavi → Kittaa → Hio, suojaa rajat ja maalaa. Smart on oletuksena päällä.');
  };

  const onImageLoad = () => {
    const img = imageRef.current, final = finalRef.current, protectCanvas = protectCanvasRef.current;
    if (!img || !final || !protectCanvas) return;
    const scale = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * scale)), height = Math.max(1, Math.round(img.naturalHeight * scale));
    setSize({width,height}); final.width = width; final.height = height; protectCanvas.width = width; protectCanvas.height = height;
    const source = document.createElement('canvas'); source.width = width; source.height = height; source.getContext('2d')?.drawImage(img,0,0,width,height); sourceRef.current = source;
    const prep = document.createElement('canvas'); prep.width = width; prep.height = height; prepRef.current = prep;
    manualRef.current = new MaskLayer(width,height); smartRef.current = new MaskLayer(width,height); protectRef.current = new MaskLayer(width,height);
    renderCurrent();
    window.setTimeout(() => commit(), 0);
  };

  const point = (e: ReactPointerEvent<HTMLDivElement>): Point | null => {
    const stage = stageRef.current; if (!stage || !size.width) return null; const r = stage.getBoundingClientRect();
    return {x:clamp((e.clientX-r.left)/r.width*size.width,0,size.width-1), y:clamp((e.clientY-r.top)/r.height*size.height,0,size.height-1)};
  };
  const smooth = (a:Point,b:Point) => { const s=clamp(stabilizer/100,0,.92); return {x:a.x*s+b.x*(1-s),y:a.y*s+b.y*(1-s)}; };
  const snap = (a:Point,b:Point) => { const dx=b.x-a.x,dy=b.y-a.y,d=Math.abs(Math.atan2(dy,dx)*180/Math.PI); if(d<12||d>168)return{x:b.x,y:a.y}; if(Math.abs(d-90)<12)return{x:a.x,y:b.y}; return b; };

  const lineMask = (a:Point,b:Point,width:number,square=false) => {
    const canvas=document.createElement('canvas'); canvas.width=size.width; canvas.height=size.height; const ctx=canvas.getContext('2d');
    const mask=new MaskLayer(size.width,size.height); if(!ctx)return mask;
    ctx.strokeStyle='#fff'; ctx.lineWidth=width; ctx.lineCap=square?'square':'round'; ctx.lineJoin='round'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data; for(let i=0;i<mask.alpha.length;i++) mask.alpha[i]=data[i*4+3]; return mask;
  };

  const workingBase = () => {
    const source=sourceRef.current, prep=prepRef.current; if(!source)return null; const c=document.createElement('canvas'); c.width=source.width; c.height=source.height;
    const ctx=c.getContext('2d'); if(!ctx)return null; ctx.drawImage(source,0,0); if(prep)ctx.drawImage(prep,0,0); return c;
  };

  const renderCurrent = () => {
    const final=finalRef.current, manual=manualRef.current, smartMask=smartRef.current, protect=protectRef.current, base=workingBase();
    if(!final||!manual||!smartMask||!protect||!base)return;
    const total=mergeManualAndSmart(manual,smartMask).subtract(protect);
    const pipeline=new CanvasPipeline(final); pipeline.setSize({width:base.width,height:base.height}); pipeline.renderBaseImage(base);
    pipeline.applyPaintMask(total,{tint:rgb(color),coat:passes,opacity});
    drawProtectionOverlay();
  };

  const drawProtectionOverlay = () => {
    const canvas=protectCanvasRef.current, mask=protectRef.current; if(!canvas||!mask)return; const ctx=canvas.getContext('2d'); if(!ctx)return; ctx.clearRect(0,0,canvas.width,canvas.height);
    const img=ctx.createImageData(canvas.width,canvas.height); for(let i=0;i<mask.alpha.length;i++){ if(!mask.alpha[i])continue; const p=i*4; img.data[p]=249;img.data[p+1]=115;img.data[p+2]=22;img.data[p+3]=Math.round(mask.alpha[i]*.56); } ctx.putImageData(img,0,0);
  };

  const applyPrep = (mask:MaskLayer, mode:'scraper'|'putty'|'sand') => {
    const source=sourceRef.current,prep=prepRef.current; if(!source||!prep)return; const sctx=source.getContext('2d'),pctx=prep.getContext('2d'); if(!sctx||!pctx)return;
    const src=sctx.getImageData(0,0,source.width,source.height), out=pctx.createImageData(source.width,source.height);
    for(let i=0;i<mask.alpha.length;i++){ const ma=mask.alpha[i]/255;if(!ma)continue;const p=i*4,r=src.data[p],g=src.data[p+1],b=src.data[p+2];
      if(mode==='scraper'){const local=(r+g+b)/3;out.data[p]=r*.78+local*.22;out.data[p+1]=g*.78+local*.22;out.data[p+2]=b*.78+local*.22;out.data[p+3]=110*ma;}
      else if(mode==='putty'){const neutral=(r+g+b)/3;const base=clamp(neutral+18,150,232);out.data[p]=base;out.data[p+1]=base;out.data[p+2]=base;out.data[p+3]=185*ma;}
      else {const l=(r+g+b)/3;out.data[p]=r*.72+l*.28;out.data[p+1]=g*.72+l*.28;out.data[p+2]=b*.72+l*.28;out.data[p+3]=95*ma;}
    }
    const temp=document.createElement('canvas');temp.width=source.width;temp.height=source.height;temp.getContext('2d')?.putImageData(out,0,0);
    pctx.save(); if(mode==='sand')pctx.filter='blur(1.2px)'; pctx.drawImage(temp,0,0); pctx.restore(); renderCurrent();
  };

  const applyManual = (a:Point,b:Point) => {
    const manual=manualRef.current, smartMask=smartRef.current, protect=protectRef.current; if(!manual||!smartMask||!protect)return;
    const width=tool==='roller'?brushSize*2.1:tool==='corner'?Math.max(4,brushSize*.55):brushSize; const mask=lineMask(a,b,width,tool==='roller'||tool==='corner');
    if(tool==='eraser'){manualRef.current=manual.subtract(mask);smartRef.current=smartMask.subtract(mask);renderCurrent();return;}
    if(tool==='scraper'||tool==='putty'||tool==='sand'){applyPrep(mask,tool);return;}
    manualRef.current=manual.union(mask.subtract(protect)); renderCurrent();
  };

  const applyCover = (a:Point,b:Point) => { const protect=protectRef.current;if(!protect)return;const m=lineMask(a,b,coverSize);protectRef.current=protect.union(m);renderCurrent(); };

  const smartFill = async (seed:Point) => {
    const source=sourceRef.current,manual=manualRef.current,currentSmart=smartRef.current,protect=protectRef.current;if(!source||!manual||!currentSmart||!protect)return;
    const ctx=source.getContext('2d');if(!ctx)return;const image=ctx.getImageData(0,0,source.width,source.height);const generation=++generationRef.current;setSmartBusy(true);
    try{
      const result=await segmentation.segment({imageId:`${source.width}x${source.height}:${imageUrl ?? 'local'}`,image,point:seed,tolerance});
      if(generation!==generationRef.current)return;
      const safeSmart=result.mask.subtract(protect);const total=mergeManualAndSmart(manual,safeSmart);smartRef.current=total.subtract(manual);renderCurrent();
      const coverage=safeSmart.alpha.reduce((n,a)=>n+(a>0?1:0),0)/(safeSmart.width*safeSmart.height);
      if(coverage>.58){smartRef.current=currentSmart;renderCurrent();setMessage('Smart hylättiin turvallisuussyystä: alue oli liian suuri. Oma siveltimen jälki säilyi. Lisää Suojaa-raja tai maalaa pidempi vihje.');return;}
      setMessage(result.source==='remote-sam'?'AI Smart tunnisti pinnan. Oma jälki + Smart-mask yhdistettiin rikkomatta manuaalityötä.':'Verkko-AI ei ollut käytettävissä, joten käytettiin turvallista paikallista Smart-varamenetelmää. Oma jälki säilyi.');
    }catch{setMessage('Smart epäonnistui, mutta oma siveltimen/telan jälki säilyi muuttumattomana.');}
    finally{if(generation===generationRef.current)setSmartBusy(false);}
  };

  const down=(e:ReactPointerEvent<HTMLDivElement>)=>{if(!imageUrl||viewMode!=='after')return;e.preventDefault();const p=point(e);if(!p)return;e.currentTarget.setPointerCapture?.(e.pointerId);drawingRef.current=true;lastRef.current=p;startRef.current=p;strokeRef.current=[p];};
  const move=(e:ReactPointerEvent<HTMLDivElement>)=>{if(!drawingRef.current||!lastRef.current)return;e.preventDefault();const raw=point(e);if(!raw)return;const p=smooth(lastRef.current,raw);strokeRef.current.push(p);if(tool!=='cover')applyManual(lastRef.current,p);lastRef.current=p;};
  const up=(e?:ReactPointerEvent<HTMLDivElement>)=>{e?.preventDefault();if(!drawingRef.current)return;drawingRef.current=false;const start=startRef.current,last=lastRef.current,pts=strokeRef.current;lastRef.current=null;startRef.current=null;
    if(tool==='cover'&&start&&last){applyCover(start,snap(start,last));commit();setMessage('Suojareuna lisättiin. Smart ja manuaalinen maalaus eivät ylitä suojausmaskia.');return;}
    commit();if(smart&&(tool==='brush'||tool==='corner'||tool==='roller')&&pts.length)void smartFill(pts[Math.floor(pts.length/2)]);else if(tool==='scraper')setMessage('Kaavinta simuloi irtoavan pinnan tasoitusta ilman maaliväriä.');else if(tool==='putty')setMessage('Kittaus simuloi paikattua aluetta paikallisen pinnan sävyn perusteella.');else if(tool==='sand')setMessage('Hionta pehmentää paikkausjälkeä. Pinta voidaan nyt maalata.');};

  const snapshot=():Snapshot|null=>{const manual=manualRef.current,smartMask=smartRef.current,protect=protectRef.current,prep=prepRef.current;if(!manual||!smartMask||!protect||!prep)return null;return{manual:manual.toRle(),smart:smartMask.toRle(),protect:protect.toRle(),prep:prep.toDataURL('image/png')};};
  const commit=()=>{const snap=snapshot();if(!snap)return;const next=[...history.slice(0,historyIndex+1),snap].slice(-30);setHistory(next);setHistoryIndex(next.length-1);try{localStorage.setItem('kamu.varikamu.recovery',JSON.stringify({size,snapshot:snap,updatedAt:Date.now()}));}catch{/* quota/private mode */}};
  const restore=(index:number)=>{const snap=history[index];if(!snap||!size.width)return;manualRef.current=MaskLayer.fromRle(size.width,size.height,snap.manual);smartRef.current=MaskLayer.fromRle(size.width,size.height,snap.smart);protectRef.current=MaskLayer.fromRle(size.width,size.height,snap.protect);const prep=prepRef.current;if(prep){const img=new Image();img.onload=()=>{const c=prep.getContext('2d');c?.clearRect(0,0,prep.width,prep.height);c?.drawImage(img,0,0);renderCurrent();};img.src=snap.prep;}setHistoryIndex(index);};
  const reset=()=>{manualRef.current?.clear();smartRef.current?.clear();prepRef.current?.getContext('2d')?.clearRect(0,0,size.width,size.height);renderCurrent();commit();};
  const clearProtection=()=>{protectRef.current?.clear();renderCurrent();commit();setMessage('Suojaukset poistettiin. Maalaus- ja valmistelutyö säilyi.');};
  const download=(type:'png'|'jpg')=>{const canvas=finalRef.current;if(!canvas||!size.width)return;const out=document.createElement('canvas');out.width=size.width;out.height=size.height;const ctx=out.getContext('2d');if(!ctx)return;ctx.drawImage(canvas,0,0);ctx.fillStyle='rgba(255,255,255,.82)';ctx.fillRect(12,size.height-34,Math.min(360,size.width-24),22);ctx.fillStyle='#172033';ctx.font='12px sans-serif';ctx.fillText('VäriKamu Enterprise · maalausmultivari.fi',20,size.height-19);const a=document.createElement('a');a.download=`varikamu-${Date.now()}.${type}`;a.href=type==='jpg'?out.toDataURL('image/jpeg',.93):out.toDataURL('image/png');a.click();};

  const ratio=size.width&&size.height?size.width/size.height:4/3,stageWidth=size.width?`min(100%, calc(58dvh * ${ratio}))`:'100%';
  const finalStyle=useMemo(()=>viewMode==='before'?{display:'none'}:viewMode==='compare'?{clipPath:`inset(0 ${100-compareAt}% 0 0)`}:undefined,[viewMode,compareAt]);

  return <section className="min-h-screen w-full overflow-x-hidden bg-navy-50 px-2 py-3 sm:px-3 sm:py-4"><div className="container-base w-full max-w-6xl">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">VäriKamu Enterprise</p><h1 className="font-display text-xl font-extrabold text-navy-950 sm:text-2xl">Korjaa, suojaa ja maalaa fotorealistisella 3-kerrosmoottorilla</h1></div><button className="btn-outline" onClick={()=>setShowGuide(v=>!v)}><HelpCircle className="size-4"/>Ohje</button></div>
    {showGuide&&<div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4"><div className="grid gap-2 text-sm sm:grid-cols-6"><strong>1. 📷 Kuva</strong><strong>2. 🪚 Kaavi</strong><strong>3. 🧱 Kittaa</strong><strong>4. 🧽 Hio</strong><strong>5. 🛡️ Suojaa</strong><strong>6. 🎨 Maalaa ×3</strong></div><p className="mt-2 text-xs text-navy-700">Smart käyttää ensisijaisesti segmentointipalvelua ja siirtyy automaattisesti paikalliseen fallbackiin. Manuaalinen jälki säilyy aina.</p></div>}
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="card min-w-0 overflow-hidden p-2 sm:p-4">
      {!imageUrl?<div className="grid min-h-[46vh] place-items-center rounded-2xl border-2 border-dashed border-navy-200 bg-white p-5 text-center"><div><Camera className="mx-auto size-12 text-orange-500"/><h2 className="mt-4 text-xl font-bold">Ota kuva tai lataa kuva</h2><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="btn-primary" onClick={()=>cameraRef.current?.click()}><Camera className="size-4"/>Ota kuva</button><button className="btn-outline" onClick={()=>fileRef.current?.click()}><Upload className="size-4"/>Lataa kuva</button></div></div></div>:<><div className="w-full overflow-hidden rounded-2xl bg-navy-950 p-1" style={{maxHeight:'64dvh'}}><div className="flex min-h-[260px] items-center justify-center overflow-hidden"><div ref={stageRef} className="relative shrink-0 overflow-hidden rounded-xl bg-black select-none" style={{width:stageWidth,aspectRatio:`${size.width}/${size.height}`,maxWidth:'100%',transform:`scale(${zoom})`,transformOrigin:'center',touchAction:'none',userSelect:'none',cursor:'crosshair'}} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up}><img ref={imageRef} src={imageUrl} onLoad={onImageLoad} draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill"/><canvas ref={finalRef} className="pointer-events-none absolute inset-0 h-full w-full" style={finalStyle}/><canvas ref={protectCanvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${showProtection?'opacity-100':'opacity-0'}`}/>{viewMode==='compare'&&<div className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-white" style={{left:`${compareAt}%`}}/>}</div></div></div><div className="mt-2 flex flex-wrap gap-2"><button className="btn-outline" onClick={()=>setZoom(z=>Math.max(1,z-.25))}><ZoomOut className="size-4"/>−</button><button className="btn-outline" onClick={()=>setZoom(1)}><Maximize2 className="size-4"/>Sovita</button><button className="btn-outline" onClick={()=>setZoom(z=>Math.min(2.5,z+.25))}><ZoomIn className="size-4"/>+</button></div><div className="mt-3 grid grid-cols-3 gap-2"><button className={viewMode==='before'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('before')}>Ennen</button><button className={viewMode==='after'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('after')}>Jälkeen</button><button className={viewMode==='compare'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('compare')}>Vertaa</button></div>{viewMode==='compare'&&<input className="mt-3 w-full accent-orange-500" type="range" min="5" max="95" value={compareAt} onChange={e=>setCompareAt(Number(e.target.value))}/>}</>}
      <input ref={fileRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>loadFile(e.target.files?.[0])}/><input ref={cameraRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={e=>loadFile(e.target.files?.[0])}/>{imageUrl&&<div className="mt-2 flex flex-wrap gap-2"><button className="btn-outline" onClick={()=>historyIndex>0&&restore(historyIndex-1)} disabled={historyIndex<=0}><Undo2 className="size-4"/>Kumoa</button><button className="btn-outline" onClick={()=>historyIndex<history.length-1&&restore(historyIndex+1)} disabled={historyIndex>=history.length-1}><Redo2 className="size-4"/>Tee uudelleen</button><button className="btn-outline" onClick={reset}><RotateCcw className="size-4"/>Tyhjennä työ</button><button className="btn-outline" onClick={()=>setShowProtection(v=>!v)}>{showProtection?'Piilota suoja':'Näytä suoja'}</button><button className="btn-outline" onClick={clearProtection}><Shield className="size-4"/>Poista suoja</button></div>}</div>
      <aside className="space-y-4"><div className="card p-4"><h2 className="font-bold">1. Työkalu</h2><div className="mt-3 grid grid-cols-2 gap-2"><button className={tool==='scraper'?'btn-primary':'btn-outline'} onClick={()=>setTool('scraper')}>🪚 Kaavin / lasta</button><button className={tool==='putty'?'btn-primary':'btn-outline'} onClick={()=>setTool('putty')}>🧱 Kitti / paikkaus</button><button className={tool==='sand'?'btn-primary':'btn-outline'} onClick={()=>setTool('sand')}>🧽 Hionta</button><button className={tool==='cover'?'btn-primary':'btn-outline'} onClick={()=>{setTool('cover');setShowProtection(true);}}>🛡️ Suojaa</button><button className={tool==='brush'?'btn-primary':'btn-outline'} onClick={()=>setTool('brush')}><Paintbrush className="size-4"/>Sivellin</button><button className={tool==='corner'?'btn-primary':'btn-outline'} onClick={()=>setTool('corner')}>◩ Kulmasivellin</button><button className={tool==='roller'?'btn-primary':'btn-outline'} onClick={()=>setTool('roller')}><PaintRoller className="size-4"/>Tela</button><button className={tool==='eraser'?'btn-primary':'btn-outline'} onClick={()=>setTool('eraser')}><Eraser className="size-4"/>Poista alue</button></div><button className={`mt-3 w-full rounded-xl border p-3 text-left ${smart?'border-orange-400 bg-orange-50':'border-navy-200'}`} onClick={()=>setSmart(v=>!v)}><strong><Sparkles className="mr-1 inline size-4"/>Smart {smart?'ON':'OFF'} {smartBusy?'· tunnistaa…':''}</strong><span className="mt-1 block text-xs text-navy-600">{smart?'Remote SAM → turvallinen paikallinen fallback':'Vain oma siveltimen/telan jälki'}</span></button></div>
      {tool==='cover'&&<div className="card p-4"><h2 className="font-bold">2. Suojauksen leveys</h2><div className="mt-3 grid grid-cols-4 gap-2">{covers.map(c=><button key={c.label} className={`rounded-xl border p-2 text-xs font-bold ${coverSize===c.px?'border-orange-500 bg-orange-50':'border-navy-200'}`} onClick={()=>setCoverSize(c.px)}>{c.label}</button>)}</div></div>}
      <div className="card p-4"><h2 className="font-bold">3. Siveltimen leveys</h2><div className="mt-3 grid grid-cols-4 gap-2">{brushes.map(b=><button key={b.label} className={`rounded-xl border p-2 text-xs font-bold ${brushSize===b.px?'border-orange-500 bg-orange-50':'border-navy-200'}`} onClick={()=>setBrushSize(b.px)}>{b.label}</button>)}</div></div>
      <div className="card p-4"><h2 className="font-bold">4. Väri ja 3 kerrosta</h2><div className="mt-3 flex flex-wrap gap-2">{palette.map(c=><button key={c} aria-label={c} onClick={()=>{setColor(c);window.setTimeout(renderCurrent,0);}} className={`h-9 w-9 rounded-full border-2 ${color===c?'border-orange-500 ring-2 ring-orange-200':'border-white'}`} style={{backgroundColor:c}}/>)}<input type="color" value={color} onChange={e=>setColor(e.target.value)} onBlur={renderCurrent} className="h-9 w-12"/></div><div className="mt-4 grid grid-cols-3 gap-2">{([1,2,3] as const).map(n=><button key={n} className={`rounded-xl border p-2 text-xs font-bold ${passes===n?'border-orange-500 bg-orange-50':'border-navy-200'}`} onClick={()=>{setPasses(n);window.setTimeout(renderCurrent,0);}}>{n===1?'1× Pohja':n===2?'2× Peitto':'3× Valmis'}</button>)}</div><label className="mt-3 block text-sm font-bold">Peittävyys {Math.round(opacity*100)}%<input className="mt-2 w-full accent-orange-500" type="range" min="60" max="100" value={Math.round(opacity*100)} onChange={e=>setOpacity(Number(e.target.value)/100)} onPointerUp={renderCurrent}/></label><label className="mt-3 block text-sm font-bold">Käden vakautus {stabilizer}%<input className="mt-2 w-full accent-orange-500" type="range" min="0" max="90" value={stabilizer} onChange={e=>setStabilizer(Number(e.target.value))}/></label><label className="mt-3 block text-sm font-bold">Fallback-herkkyys {tolerance}<input className="mt-2 w-full accent-orange-500" type="range" min="18" max="64" value={tolerance} onChange={e=>setTolerance(Number(e.target.value))}/></label></div>
      <div className="card p-4"><p className="text-sm leading-6 text-navy-700">{message}</p><div className="mt-3 grid grid-cols-2 gap-2"><button className="btn-outline" onClick={()=>download('png')} disabled={!imageUrl}><Download className="size-4"/>PNG</button><button className="btn-primary" onClick={()=>download('jpg')} disabled={!imageUrl}><Download className="size-4"/>JPG</button></div></div></aside>
    </div>
  </div></section>;
}
