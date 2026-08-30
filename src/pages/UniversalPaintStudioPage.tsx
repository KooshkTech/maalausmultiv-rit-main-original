import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Camera, Download, Eraser, Maximize2, Paintbrush, PaintRoller, Redo2, RotateCcw, Sparkles, Undo2, Upload, ZoomIn, ZoomOut } from 'lucide-react';

type Tool = 'brush' | 'roller' | 'eraser' | 'smart';
type Point = { x: number; y: number };
type ViewMode = 'after' | 'before' | 'compare';

const palette = ['#F2EFE6','#D8C9B5','#C9CBC8','#A7B19B','#9FB4C3','#B86F52','#496255','#45494B','#1D2022','#FF6B9D','#6C5CE7','#00B894'];
const clamp = (value:number,min:number,max:number) => Math.max(min,Math.min(max,value));

export function UniversalPaintStudioPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const paintRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const preStrokeRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<Point | null>(null);
  const strokePointsRef = useRef<Point[]>([]);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#D99518');
  const [brushSize, setBrushSize] = useState(30);
  const [opacity, setOpacity] = useState(0.7);
  const [tolerance, setTolerance] = useState(58);
  const [edgeLock, setEdgeLock] = useState(68);
  const [autoFill, setAutoFill] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [kidsMode, setKidsMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('after');
  const [compareAt, setCompareAt] = useState(50);
  const [message, setMessage] = useState('Maalaa pieni osa pinnasta. Kun nostat sormen, VäriKamu yrittää täyttää koko saman pinnan rajojen sisällä.');

  const loadFile = (file?: File) => {
    if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) return;
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setHistory([]); setHistoryIndex(-1); setZoom(1); setViewMode('after');
    setMessage('Valitse väri ja maalaa pieni viiva keskelle haluamaasi pintaa. Viiva toimii vain vihjeenä; lopputulos täyttää pinnan.');
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
    source.getContext('2d')?.drawImage(img,0,0,width,height);
    sourceRef.current = source;
    const first = canvas.toDataURL('image/png'); setHistory([first]); setHistoryIndex(0);
  };

  const pointFromEvent = (event: ReactPointerEvent<HTMLDivElement>): Point | null => {
    const stage = stageRef.current;
    if (!stage || !size.width || !size.height) return null;
    const rect = stage.getBoundingClientRect();
    return { x: clamp(((event.clientX - rect.left) / rect.width) * size.width,0,size.width-1), y: clamp(((event.clientY - rect.top) / rect.height) * size.height,0,size.height-1) };
  };

  const snapshotCanvas = () => {
    const canvas = paintRef.current; if (!canvas) return;
    const copy = document.createElement('canvas'); copy.width = canvas.width; copy.height = canvas.height;
    copy.getContext('2d')?.drawImage(canvas,0,0); preStrokeRef.current = copy;
  };

  const restorePreStroke = () => {
    const target = paintRef.current, saved = preStrokeRef.current; if (!target || !saved) return;
    const ctx = target.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0,0,target.width,target.height); ctx.drawImage(saved,0,0);
  };

  const commit = () => {
    const canvas = paintRef.current; if (!canvas) return;
    const next = [...history.slice(0,historyIndex+1), canvas.toDataURL('image/png')].slice(-30);
    setHistory(next); setHistoryIndex(next.length-1);
  };

  const drawGuide = (from: Point,to: Point) => {
    const ctx = paintRef.current?.getContext('2d'); if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = tool==='eraser'?'destination-out':'source-over';
    ctx.globalAlpha = tool==='eraser'?1:0.9;
    ctx.strokeStyle = tool==='eraser'?'#000':color;
    ctx.lineWidth = tool==='roller'?brushSize*2.2:brushSize;
    ctx.lineCap = tool==='roller'?'square':'round'; ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();ctx.restore();
  };

  const smartFillFromSeeds = (rawSeeds: Point[], saveHistory=true) => {
    const source=sourceRef.current,target=paintRef.current;
    const sourceCtx=source?.getContext('2d'),targetCtx=target?.getContext('2d');
    if(!source||!target||!sourceCtx||!targetCtx||rawSeeds.length===0)return;

    const w=source.width,h=source.height,image=sourceCtx.getImageData(0,0,w,h),data=image.data,total=w*h;
    const stride=Math.max(1,Math.floor(rawSeeds.length/28));
    const seeds=rawSeeds.filter((_,i)=>i%stride===0).slice(0,32);
    const refs=seeds.map(seed=>{const x=clamp(Math.floor(seed.x),0,w-1),y=clamp(Math.floor(seed.y),0,h-1),i=(y*w+x)*4;return{index:y*w+x,r:data[i],g:data[i+1],b:data[i+2]};});
    const lum=(idx:number)=>{const p=idx*4;return data[p]*.299+data[p+1]*.587+data[p+2]*.114;};
    const rgbDistance=(a:number,b:number)=>{const pa=a*4,pb=b*4,dr=data[pa]-data[pb],dg=data[pa+1]-data[pb+1],db=data[pa+2]-data[pb+2];return Math.sqrt(dr*dr+dg*dg+db*db);};
    const refDistance=(idx:number)=>{const p=idx*4;let best=999;for(const ref of refs){const dr=data[p]-ref.r,dg=data[p+1]-ref.g,db=data[p+2]-ref.b;best=Math.min(best,Math.sqrt(dr*dr+dg*dg+db*db));}return best;};
    const edgeBetween=(a:number,b:number)=>Math.max(Math.abs(lum(a)-lum(b)),rgbDistance(a,b)*.55);

    const seen=new Uint8Array(total),mask=new Uint8Array(total),queue=new Int32Array(total);let head=0,tail=0,count=0;
    refs.forEach(ref=>{if(!seen[ref.index]){seen[ref.index]=1;queue[tail++]=ref.index;}});
    const edgeThreshold=clamp(78-edgeLock*.68,18,55);
    const directLimit=tolerance*1.65;
    const gradualLimit=20+tolerance*.34;
    const farLimit=tolerance*3.1;
    const safetyLimit=Math.floor(total*.72);

    while(head<tail&&count<safetyLimit){
      const idx=queue[head++]; mask[idx]=1; count++;
      const x=idx%w,y=Math.floor(idx/w);
      const visit=(n:number)=>{
        if(seen[n])return;seen[n]=1;
        const edge=edgeBetween(idx,n); if(edge>edgeThreshold)return;
        const fromSeed=refDistance(n),local=rgbDistance(idx,n);
        if(fromSeed<=directLimit || (local<=gradualLimit && fromSeed<=farLimit)) queue[tail++]=n;
      };
      if(x>0)visit(idx-1);if(x<w-1)visit(idx+1);if(y>0)visit(idx-w);if(y<h-1)visit(idx+w);
    }

    if(count<Math.max(120,Math.round(total*.0004))){
      setMessage('Pintaa ei löytynyt riittävästi. Maalaa hieman pidempi viiva pinnan keskelle tai vähennä Rajojen suojausta.');return;
    }
    if(count>=safetyLimit){
      setMessage('Täyttö oli leviämässä liian suurelle alueelle, joten se pysäytettiin. Lisää Rajojen suojausta ja yritä uudelleen pinnan keskeltä.');return;
    }

    const smooth=new Uint8Array(mask);
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const idx=y*w+x;if(mask[idx])continue;
      const neighbours=mask[idx-1]+mask[idx+1]+mask[idx-w]+mask[idx+w]+mask[idx-w-1]+mask[idx-w+1]+mask[idx+w-1]+mask[idx+w+1];
      if(neighbours>=6)smooth[idx]=1;
    }

    const overlayCanvas=document.createElement('canvas');overlayCanvas.width=w;overlayCanvas.height=h;
    const overlayCtx=overlayCanvas.getContext('2d');if(!overlayCtx)return;
    const overlay=overlayCtx.createImageData(w,h),rgb=parseInt(color.slice(1),16),r=(rgb>>16)&255,g=(rgb>>8)&255,b=rgb&255;
    for(let i=0;i<smooth.length;i++)if(smooth[i]){
      const p=i*4,light=(data[p]*.299+data[p+1]*.587+data[p+2]*.114)/255;
      const shade=.72+light*.34;
      overlay.data[p]=clamp(Math.round(r*shade),0,255);overlay.data[p+1]=clamp(Math.round(g*shade),0,255);overlay.data[p+2]=clamp(Math.round(b*shade),0,255);overlay.data[p+3]=Math.round(255*opacity);
    }
    overlayCtx.putImageData(overlay,0,0);targetCtx.drawImage(overlayCanvas,0,0);
    if(saveHistory)commit();
    setMessage(`Valittu pinta täytettiin automaattisesti (${Math.round(count/1000)}k px). Tarkista Ennen/Jälkeen. Jos reuna on väärä, Kumoa ja säädä Rajojen suojausta.`);
  };

  const pointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(!imageUrl||viewMode!=='after')return;
    event.currentTarget.setPointerCapture(event.pointerId);const p=pointFromEvent(event);if(!p)return;
    if(tool==='smart'){smartFillFromSeeds([p],true);return;}
    snapshotCanvas();drawingRef.current=true;lastRef.current=p;strokePointsRef.current=[p];drawGuide(p,p);
  };
  const pointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(!drawingRef.current||!lastRef.current)return;const p=pointFromEvent(event);if(!p)return;drawGuide(lastRef.current,p);
    const prev=strokePointsRef.current[strokePointsRef.current.length-1];if(!prev||Math.hypot(p.x-prev.x,p.y-prev.y)>Math.max(6,brushSize*.22))strokePointsRef.current.push(p);lastRef.current=p;
  };
  const pointerUp=()=>{
    if(!drawingRef.current)return;drawingRef.current=false;lastRef.current=null;const seeds=strokePointsRef.current;strokePointsRef.current=[];
    if((tool==='brush'||tool==='roller')&&autoFill&&seeds.length){restorePreStroke();smartFillFromSeeds(seeds,true);}else commit();
  };

  const restore=(index:number)=>{const canvas=paintRef.current,frame=history[index];if(!canvas||!frame)return;const ctx=canvas.getContext('2d');if(!ctx)return;const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0);setHistoryIndex(index);};img.src=frame;};
  const undo=()=>historyIndex>0&&restore(historyIndex-1);
  const redo=()=>historyIndex<history.length-1&&restore(historyIndex+1);
  const reset=()=>{const c=paintRef.current;if(!c)return;c.getContext('2d')?.clearRect(0,0,c.width,c.height);commit();};

  const download=(type:'png'|'jpg')=>{
    const img=imageRef.current,paint=paintRef.current;if(!img||!paint||!size.width)return;
    const out=document.createElement('canvas');out.width=size.width;out.height=size.height;const ctx=out.getContext('2d');if(!ctx)return;
    ctx.drawImage(img,0,0,size.width,size.height);ctx.drawImage(paint,0,0);
    ctx.fillStyle='rgba(255,255,255,.82)';ctx.fillRect(12,size.height-34,Math.min(320,size.width-24),22);ctx.fillStyle='#172033';ctx.font='12px sans-serif';ctx.fillText('VäriKamu · maalausmultivari.fi',20,size.height-19);
    const a=document.createElement('a');a.download=`varikamu-${Date.now()}.${type}`;a.href=type==='jpg'?out.toDataURL('image/jpeg',.92):out.toDataURL('image/png');a.click();
  };

  const ratio=size.width&&size.height?size.width/size.height:4/3;
  const stageWidth=size.width?`min(100%, calc(58dvh * ${ratio}))`:'100%';
  const canvasStyle=useMemo(()=>viewMode==='before'?{display:'none'}:viewMode==='compare'?{clipPath:`inset(0 ${100-compareAt}% 0 0)`}:undefined,[viewMode,compareAt]);

  return <section className={`${kidsMode?'bg-orange-50':'bg-navy-50'} min-h-screen w-full overflow-x-hidden px-2 py-3 sm:px-3 sm:py-4`}>
    <div className="container-base w-full max-w-6xl overflow-x-hidden">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">VäriKamu</p><h1 className="font-display text-xl font-extrabold text-navy-950 sm:text-2xl">Maalaa vähän – VäriKamu täyttää pinnan</h1></div><button className="btn-outline" onClick={()=>setKidsMode(v=>!v)}>{kidsMode?'Normaali tila':'🎨 Lasten tila'}</button></div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="card min-w-0 overflow-hidden p-2 sm:p-4">
          {!imageUrl?<div className="grid min-h-[46vh] place-items-center rounded-2xl border-2 border-dashed border-navy-200 bg-white p-5 text-center"><div><Camera className="mx-auto size-12 text-orange-500"/><h2 className="mt-4 text-xl font-bold">Ota kuva tai lataa kuva</h2><p className="mt-2 text-sm text-navy-600">Valitse mikä tahansa maalattava pinta: seinä, katto, ovi, ikkunan puuosa, kaappi, kaluste, puu tai metalli.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="btn-primary" onClick={()=>cameraRef.current?.click()}><Camera className="size-4"/>Ota kuva</button><button className="btn-outline" onClick={()=>fileRef.current?.click()}><Upload className="size-4"/>Lataa kuva</button></div></div></div>:<>
            <div className="w-full overflow-auto overscroll-contain rounded-2xl bg-navy-950 p-1" style={{maxHeight:'64dvh'}}><div className="flex min-h-[260px] w-full items-center justify-center"><div ref={stageRef} className="relative shrink-0 overflow-hidden rounded-xl bg-black" style={{width:stageWidth,aspectRatio:`${size.width}/${size.height}`,maxWidth:'100%',transform:`scale(${zoom})`,transformOrigin:'center',touchAction:'none'}} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}><img ref={imageRef} src={imageUrl} onLoad={onImageLoad} draggable={false} className="absolute inset-0 h-full w-full select-none object-fill"/><canvas ref={paintRef} className="absolute inset-0 h-full w-full" style={canvasStyle}/>{viewMode==='compare'&&<><div className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-white" style={{left:`${compareAt}%`}}/><span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white">Jälkeen</span><span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white">Ennen</span></>}</div></div></div>
            <div className="mt-2 flex flex-wrap items-center gap-2"><button className="btn-outline" onClick={()=>setZoom(z=>Math.max(1,z-.25))} disabled={zoom<=1}><ZoomOut className="size-4"/>−</button><button className="btn-outline" onClick={()=>setZoom(1)}><Maximize2 className="size-4"/>Sovita</button><button className="btn-outline" onClick={()=>setZoom(z=>Math.min(2.5,z+.25))}><ZoomIn className="size-4"/>+</button><span className="text-xs text-navy-500">{Math.round(zoom*100)}%</span></div>
            <div className="mt-3 grid grid-cols-3 gap-2"><button className={viewMode==='before'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('before')}>Ennen</button><button className={viewMode==='after'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('after')}>Jälkeen</button><button className={viewMode==='compare'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('compare')}>Vertaa</button></div>{viewMode==='compare'&&<input className="mt-3 w-full accent-orange-500" type="range" min="5" max="95" value={compareAt} onChange={e=>setCompareAt(Number(e.target.value))}/>}</>}
          <input ref={fileRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>loadFile(e.target.files?.[0])}/><input ref={cameraRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={e=>loadFile(e.target.files?.[0])}/>
          {imageUrl&&<div className="mt-2 flex flex-wrap gap-2"><button className="btn-outline" onClick={undo} disabled={historyIndex<=0}><Undo2 className="size-4"/>Kumoa</button><button className="btn-outline" onClick={redo} disabled={historyIndex>=history.length-1}><Redo2 className="size-4"/>Tee uudelleen</button><button className="btn-outline" onClick={reset}><RotateCcw className="size-4"/>Tyhjennä maalit</button></div>}
        </div>
        <aside className="min-w-0 space-y-4">
          <div className="card p-4"><h2 className="font-bold text-navy-950">1. Työkalu</h2><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>{setTool('brush');setViewMode('after');}} className={tool==='brush'?'btn-primary':'btn-outline'}><Paintbrush className="size-4"/>Sivellin</button><button onClick={()=>{setTool('roller');setViewMode('after');}} className={tool==='roller'?'btn-primary':'btn-outline'}><PaintRoller className="size-4"/>Tela</button><button onClick={()=>{setTool('smart');setViewMode('after');}} className={tool==='smart'?'btn-primary':'btn-outline'}><Sparkles className="size-4"/>Täytä napautus</button><button onClick={()=>{setTool('eraser');setViewMode('after');}} className={tool==='eraser'?'btn-primary':'btn-outline'}><Eraser className="size-4"/>Pyyhin</button></div><label className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-orange-50 px-3 py-3 text-sm font-bold"><span>✨ Täydennä pinta automaattisesti</span><input type="checkbox" checked={autoFill} onChange={e=>setAutoFill(e.target.checked)} className="size-5 accent-orange-500"/></label><p className="mt-3 text-xs leading-5 text-navy-600">Kun automaattinen täyttö on päällä, siveltimen tai telan viiva ei jää reunukseksi. Se toimii vain vihjeenä, ja VäriKamu täyttää tunnistetun pinnan.</p></div>
          <div className="card p-4"><h2 className="font-bold">2. Väri</h2><div className="mt-3 flex flex-wrap gap-2">{palette.map(c=><button key={c} aria-label={c} onClick={()=>setColor(c)} className={`h-9 w-9 rounded-full border-2 ${color===c?'border-orange-500 ring-2 ring-orange-200':'border-white'}`} style={{backgroundColor:c}}/>)}<input aria-label="Oma väri" type="color" value={color} onChange={e=>setColor(e.target.value)} className="h-9 w-12 rounded"/></div></div>
          <div className="card p-4"><label className="text-sm font-bold">Siveltimen koko {brushSize}px<input className="mt-2 w-full accent-orange-500" type="range" min="8" max="100" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))}/></label><label className="mt-4 block text-sm font-bold">Värin peittävyys {Math.round(opacity*100)}%<input className="mt-2 w-full accent-orange-500" type="range" min="35" max="90" value={Math.round(opacity*100)} onChange={e=>setOpacity(Number(e.target.value)/100)}/></label><label className="mt-4 block text-sm font-bold">Pinnan vaihtelu {tolerance}<input className="mt-2 w-full accent-orange-500" type="range" min="30" max="100" value={tolerance} onChange={e=>setTolerance(Number(e.target.value))}/></label><label className="mt-4 block text-sm font-bold">Rajojen suojaus {edgeLock}%<input className="mt-2 w-full accent-orange-500" type="range" min="35" max="85" value={edgeLock} onChange={e=>setEdgeLock(Number(e.target.value))}/></label></div>
          <div className="card p-4"><p className="text-sm leading-6 text-navy-700">{message}</p><div className="mt-3 grid grid-cols-2 gap-2"><button className="btn-outline" onClick={()=>download('png')} disabled={!imageUrl}><Download className="size-4"/>PNG</button><button className="btn-primary" onClick={()=>download('jpg')} disabled={!imageUrl}><Download className="size-4"/>JPG</button></div></div>
        </aside>
      </div>
    </div>
  </section>;
}
