import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Camera, Download, Eraser, Maximize2, Paintbrush, PaintRoller, Redo2, RotateCcw, Sparkles, Undo2, Upload, ZoomIn, ZoomOut } from 'lucide-react';

type Tool = 'brush' | 'roller' | 'eraser' | 'smart';
type Point = { x: number; y: number };
type ViewMode = 'after' | 'before' | 'compare';

const palette = ['#F2EFE6','#D8C9B5','#C9CBC8','#A7B19B','#9FB4C3','#B86F52','#496255','#45494B','#1D2022','#FF6B9D','#6C5CE7','#00B894'];

function clamp(value:number,min:number,max:number){ return Math.max(min,Math.min(max,value)); }

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
  const [opacity, setOpacity] = useState(0.48);
  const [tolerance, setTolerance] = useState(54);
  const [edgeLock, setEdgeLock] = useState(58);
  const [autoFill, setAutoFill] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [kidsMode, setKidsMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('after');
  const [compareAt, setCompareAt] = useState(50);
  const [message, setMessage] = useState('Maalaa vähän pintaa. VäriKamu etsii pinnan rajat ja täydentää alueen automaattisesti.');

  const loadFile = (file?: File) => {
    if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) return;
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setHistory([]); setHistoryIndex(-1); setZoom(1); setViewMode('after');
    setMessage('Valitse väri ja maalaa vain osa pinnasta. VäriKamu käyttää viivaa vihjeenä ja yrittää pysähtyä oikeisiin reunoihin.');
  };

  const onImageLoad = () => {
    const img = imageRef.current; const canvas = paintRef.current;
    if (!img || !canvas) return;
    const longest = Math.max(img.naturalWidth, img.naturalHeight);
    const scale = Math.min(1, 1400 / longest);
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
      x: clamp(((event.clientX - rect.left) / rect.width) * size.width, 0, size.width - 1),
      y: clamp(((event.clientY - rect.top) / rect.height) * size.height, 0, size.height - 1),
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

    const w=source.width,h=source.height,image=sourceCtx.getImageData(0,0,w,h),data=image.data;
    const stride=Math.max(1,Math.floor(rawSeeds.length/18));
    const seeds=rawSeeds.filter((_,i)=>i%stride===0).slice(0,22);
    const refs=seeds.map(seed=>{const x=clamp(Math.floor(seed.x),0,w-1),y=clamp(Math.floor(seed.y),0,h-1),i=(y*w+x)*4;return{index:y*w+x,r:data[i],g:data[i+1],b:data[i+2]};});

    const luminance = (idx:number) => { const p=idx*4; return data[p]*0.299 + data[p+1]*0.587 + data[p+2]*0.114; };
    const gradient = (idx:number) => {
      const x=idx%w,y=Math.floor(idx/w); let strongest=0;
      const here=luminance(idx);
      if(x>0) strongest=Math.max(strongest,Math.abs(here-luminance(idx-1)));
      if(x<w-1) strongest=Math.max(strongest,Math.abs(here-luminance(idx+1)));
      if(y>0) strongest=Math.max(strongest,Math.abs(here-luminance(idx-w)));
      if(y<h-1) strongest=Math.max(strongest,Math.abs(here-luminance(idx+w)));
      return strongest;
    };
    const colorDistance = (idx:number, ref:{r:number;g:number;b:number}) => { const p=idx*4,dr=data[p]-ref.r,dg=data[p+1]-ref.g,db=data[p+2]-ref.b; return Math.sqrt(dr*dr+dg*dg+db*db); };
    const match=(idx:number)=>{ let best=Number.POSITIVE_INFINITY; for(const ref of refs){ const d=colorDistance(idx,ref); if(d<best)best=d; } return best<=tolerance; };

    const seen=new Uint8Array(w*h),mask=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0,count=0;
    refs.forEach(ref=>{if(!seen[ref.index]){seen[ref.index]=1;queue[tail++]=ref.index;}});
    const maxPixels=Math.min(w*h,1100000);
    const edgeThreshold=Math.max(10,100-edgeLock);

    while(head<tail&&count<maxPixels){
      const idx=queue[head++]; if(!match(idx))continue;
      mask[idx]=1; count++;
      const x=idx%w,y=Math.floor(idx/w);
      const visit=(n:number)=>{
        if(seen[n])return; seen[n]=1;
        const isSeedNeighbour=refs.some(ref=>Math.abs((ref.index%w)-x)<=2&&Math.abs(Math.floor(ref.index/w)-y)<=2);
        if(!isSeedNeighbour && gradient(n)>edgeThreshold)return;
        queue[tail++]=n;
      };
      if(x>0)visit(idx-1); if(x<w-1)visit(idx+1); if(y>0)visit(idx-w); if(y<h-1)visit(idx+w);
    }

    // Close tiny gaps so straight architectural edges look cleaner without crossing strong boundaries.
    const smooth=new Uint8Array(mask);
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const idx=y*w+x;if(mask[idx])continue;
      const neighbours=mask[idx-1]+mask[idx+1]+mask[idx-w]+mask[idx+w]+mask[idx-w-1]+mask[idx-w+1]+mask[idx+w-1]+mask[idx+w+1];
      if(neighbours>=6 && gradient(idx)<=edgeThreshold*1.2)smooth[idx]=1;
    }

    const overlayCanvas=document.createElement('canvas');overlayCanvas.width=w;overlayCanvas.height=h;const overlayCtx=overlayCanvas.getContext('2d');if(!overlayCtx)return;
    const overlay=overlayCtx.createImageData(w,h),rgb=parseInt(color.slice(1),16),r=(rgb>>16)&255,g=(rgb>>8)&255,b=rgb&255;
    for(let i=0;i<smooth.length;i++)if(smooth[i]){
      const p=i*4,light=(data[p]+data[p+1]+data[p+2])/765;
      overlay.data[p]=Math.round(r*(0.82+light*.18));overlay.data[p+1]=Math.round(g*(0.82+light*.18));overlay.data[p+2]=Math.round(b*(0.82+light*.18));overlay.data[p+3]=Math.round(255*opacity);
    }
    overlayCtx.putImageData(overlay,0,0);
    targetCtx.save();targetCtx.globalCompositeOperation='source-over';targetCtx.drawImage(overlayCanvas,0,0);targetCtx.restore();
    if(saveHistory)commit();
    setMessage(count>=maxPixels?'Täyttö pysähtyi turvarajalle. Kumoa ja lisää Rajojen suojausta.':`Pinta täydennettiin rajat huomioiden (${Math.round(count/1000)}k px). Tarkista Ennen/Jälkeen ja kumoa, jos väärä alue täyttyi.`);
  };

  const pointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(!imageUrl||viewMode==='before'||viewMode==='compare')return;
    event.currentTarget.setPointerCapture(event.pointerId);const p=pointFromEvent(event);if(!p)return;
    if(tool==='smart'){smartFillFromSeeds([p],true);return;}
    drawingRef.current=true;lastRef.current=p;strokePointsRef.current=[p];drawLine(p,p);
  };
  const pointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(!drawingRef.current||!lastRef.current)return;const p=pointFromEvent(event);if(!p)return;drawLine(lastRef.current,p);
    const prev=strokePointsRef.current[strokePointsRef.current.length-1];if(!prev||Math.hypot(p.x-prev.x,p.y-prev.y)>Math.max(7,brushSize*.25))strokePointsRef.current.push(p);lastRef.current=p;
  };
  const pointerUp=()=>{
    if(!drawingRef.current)return;drawingRef.current=false;lastRef.current=null;const seeds=strokePointsRef.current;strokePointsRef.current=[];
    if((tool==='brush'||tool==='roller')&&autoFill&&seeds.length)smartFillFromSeeds(seeds,true);else commit();
  };

  const restore=(index:number)=>{const canvas=paintRef.current,frame=history[index];if(!canvas||!frame)return;const ctx=canvas.getContext('2d');if(!ctx)return;const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0);setHistoryIndex(index);};img.src=frame;};
  const undo=()=>{if(historyIndex>0)restore(historyIndex-1);};
  const redo=()=>{if(historyIndex<history.length-1)restore(historyIndex+1);};
  const reset=()=>{const c=paintRef.current;if(!c)return;c.getContext('2d')?.clearRect(0,0,c.width,c.height);commit();};

  const download=(type:'png'|'jpg')=>{
    const img=imageRef.current,paint=paintRef.current;if(!img||!paint||!size.width)return;
    const out=document.createElement('canvas');out.width=size.width;out.height=size.height;const ctx=out.getContext('2d');if(!ctx)return;
    ctx.drawImage(img,0,0,size.width,size.height);ctx.drawImage(paint,0,0);
    ctx.save();ctx.fillStyle='rgba(255,255,255,.78)';ctx.fillRect(12,size.height-34,Math.min(320,size.width-24),22);ctx.fillStyle='#172033';ctx.font='12px sans-serif';ctx.fillText('VäriKamu · maalausmultivari.fi',20,size.height-19);ctx.restore();
    const a=document.createElement('a');a.download=`varikamu-${Date.now()}.${type}`;a.href=type==='jpg'?out.toDataURL('image/jpeg',.92):out.toDataURL('image/png');a.click();
  };

  const ratio=size.width&&size.height?size.width/size.height:4/3;
  const stageWidth=size.width?`min(100%, calc(58dvh * ${ratio}))`:'100%';
  const canvasStyle = useMemo(() => viewMode==='before' ? {display:'none'} : viewMode==='compare' ? {clipPath:`inset(0 ${100-compareAt}% 0 0)`} : undefined,[viewMode,compareAt]);

  return <section className={`${kidsMode?'bg-orange-50':'bg-navy-50'} min-h-screen w-full overflow-x-hidden px-2 py-3 sm:px-3 sm:py-4`}>
    <div className="container-base w-full max-w-6xl overflow-x-hidden">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-orange-600">VäriKamu</p><h1 className="font-display text-xl font-extrabold leading-tight text-navy-950 sm:text-2xl">Maalaa vähän – VäriKamu tunnistaa rajat</h1></div><button type="button" className="btn-outline shrink-0" onClick={()=>setKidsMode(v=>!v)}>{kidsMode?'Normaali tila':'🎨 Lasten tila'}</button></div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="card min-w-0 overflow-hidden p-2 sm:p-4">
          {!imageUrl ? <div className="grid min-h-[46vh] place-items-center rounded-2xl border-2 border-dashed border-navy-200 bg-white p-5 text-center"><div><Camera className="mx-auto size-12 text-orange-500"/><h2 className="mt-4 text-xl font-bold">Ota kuva tai lataa kuva</h2><p className="mt-2 text-sm text-navy-600">Seinä, katto, ovi, ikkuna, kaappi, huonekalu, puuosa, metalli tai muu maalattava pinta.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="btn-primary" onClick={()=>cameraRef.current?.click()}><Camera className="size-4"/> Ota kuva</button><button className="btn-outline" onClick={()=>fileRef.current?.click()}><Upload className="size-4"/> Lataa kuva</button></div></div></div> : <>
            <div className="w-full overflow-auto overscroll-contain rounded-2xl bg-navy-950 p-1" style={{maxHeight:'64dvh'}}><div className="flex min-h-[260px] w-full items-center justify-center"><div ref={stageRef} className="relative shrink-0 overflow-hidden rounded-xl bg-black shadow-sm" style={{width:stageWidth,aspectRatio:`${size.width}/${size.height}`,maxWidth:'100%',transform:`scale(${zoom})`,transformOrigin:'center center',touchAction:'none'}} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
              <img ref={imageRef} src={imageUrl} onLoad={onImageLoad} draggable={false} className="absolute inset-0 h-full w-full select-none object-fill"/>
              <canvas ref={paintRef} className="absolute inset-0 h-full w-full" style={canvasStyle}/>
              {viewMode==='compare'&&<><div className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-white shadow" style={{left:`${compareAt}%`}}/><div className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white">Jälkeen</div><div className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white">Ennen</div></>}
            </div></div></div>
            <div className="mt-2 flex flex-wrap items-center gap-2"><button type="button" className="btn-outline" onClick={()=>setZoom(z=>Math.max(1,Number((z-.25).toFixed(2))))} disabled={zoom<=1}><ZoomOut className="size-4"/>−</button><button type="button" className="btn-outline" onClick={()=>setZoom(1)}><Maximize2 className="size-4"/>Sovita</button><button type="button" className="btn-outline" onClick={()=>setZoom(z=>Math.min(2.5,Number((z+.25).toFixed(2))))}><ZoomIn className="size-4"/>+</button><span className="text-xs text-navy-500">{Math.round(zoom*100)}%</span></div>
            <div className="mt-3 grid grid-cols-3 gap-2"><button className={viewMode==='before'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('before')}>Ennen</button><button className={viewMode==='after'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('after')}>Jälkeen</button><button className={viewMode==='compare'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('compare')}>Vertaa</button></div>
            {viewMode==='compare'&&<label className="mt-3 block text-sm font-bold text-navy-700">Vertailuraja {compareAt}%<input className="mt-2 w-full accent-orange-500" type="range" min="5" max="95" value={compareAt} onChange={e=>setCompareAt(Number(e.target.value))}/></label>}
          </>}
          <input ref={fileRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>loadFile(e.target.files?.[0])}/><input ref={cameraRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={e=>loadFile(e.target.files?.[0])}/>
          {imageUrl&&<div className="mt-2 flex flex-wrap gap-2"><button className="btn-outline" onClick={undo} disabled={historyIndex<=0}><Undo2 className="size-4"/>Kumoa</button><button className="btn-outline" onClick={redo} disabled={historyIndex>=history.length-1}><Redo2 className="size-4"/>Tee uudelleen</button><button className="btn-outline" onClick={reset}><RotateCcw className="size-4"/>Tyhjennä maalit</button></div>}
        </div>
        <aside className="min-w-0 space-y-4">
          <div className="card p-4"><h2 className="font-bold text-navy-950">1. Työkalu</h2><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>{setTool('brush');setViewMode('after');}} className={tool==='brush'?'btn-primary':'btn-outline'}><Paintbrush className="size-4"/>Sivellin</button><button onClick={()=>{setTool('roller');setViewMode('after');}} className={tool==='roller'?'btn-primary':'btn-outline'}><PaintRoller className="size-4"/>Tela</button><button onClick={()=>{setTool('smart');setViewMode('after');}} className={tool==='smart'?'btn-primary':'btn-outline'}><Sparkles className="size-4"/>Täytä napautus</button><button onClick={()=>{setTool('eraser');setViewMode('after');}} className={tool==='eraser'?'btn-primary':'btn-outline'}><Eraser className="size-4"/>Pyyhin</button></div><label className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-orange-50 px-3 py-3 text-sm font-bold text-navy-900"><span>✨ Täydennä pinta automaattisesti</span><input type="checkbox" checked={autoFill} onChange={e=>setAutoFill(e.target.checked)} className="size-5 accent-orange-500"/></label><p className="mt-3 text-xs leading-5 text-navy-600">Maalaa osa pinnasta. Kun nostat sormen, VäriKamu käyttää koko viivaa vihjeenä, etsii vahvoja reunoja ja yrittää pitää maalin seinän, katon, oven, ikkunan tai muun pinnan sisällä.</p></div>
          <div className="card p-4"><h2 className="font-bold text-navy-950">2. Väri</h2><div className="mt-3 flex flex-wrap gap-2">{palette.map(c=><button key={c} aria-label={c} onClick={()=>setColor(c)} className={`h-9 w-9 shrink-0 rounded-full border-2 ${color===c?'border-orange-500 ring-2 ring-orange-200':'border-white'}`} style={{backgroundColor:c}}/>)}<input aria-label="Valitse oma väri" type="color" value={color} onChange={e=>setColor(e.target.value)} className="h-9 w-12 shrink-0 rounded"/></div></div>
          <div className="card p-4"><label className="text-sm font-bold">Siveltimen koko {brushSize}px<input className="mt-2 w-full accent-orange-500" type="range" min="8" max="100" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))}/></label><label className="mt-4 block text-sm font-bold">Värin peittävyys {Math.round(opacity*100)}%<input className="mt-2 w-full accent-orange-500" type="range" min="20" max="80" value={Math.round(opacity*100)} onChange={e=>setOpacity(Number(e.target.value)/100)}/></label><label className="mt-4 block text-sm font-bold">Pinnan värivaihtelu {tolerance}<input className="mt-2 w-full accent-orange-500" type="range" min="20" max="110" value={tolerance} onChange={e=>setTolerance(Number(e.target.value))}/></label><label className="mt-4 block text-sm font-bold">Rajojen suojaus {edgeLock}<input className="mt-2 w-full accent-orange-500" type="range" min="25" max="85" value={edgeLock} onChange={e=>setEdgeLock(Number(e.target.value))}/></label><p className="mt-2 text-xs leading-5 text-navy-500">Lisää Rajojen suojausta, jos maali vuotaa katon, lasin, oven tai kalusteen yli. Lisää Pinnan värivaihtelua, jos sama pinta jää vajaaksi varjojen tai tekstuurin vuoksi.</p></div>
          <div className="card p-4"><p className="text-sm leading-6 text-navy-700">{message}</p><div className="mt-3 grid grid-cols-2 gap-2"><button className="btn-outline" onClick={()=>download('png')} disabled={!imageUrl}><Download className="size-4"/>PNG</button><button className="btn-primary" onClick={()=>download('jpg')} disabled={!imageUrl}><Download className="size-4"/>JPG</button></div><p className="mt-2 text-[11px] text-navy-500">Ladattuun kuvaan lisätään pieni VäriKamu-merkintä.</p></div>
        </aside>
      </div>
    </div>
  </section>;
}
