import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  Camera,
  Check,
  Download,
  Eraser,
  HelpCircle,
  Maximize2,
  MousePointer2,
  Paintbrush,
  PaintRoller,
  Redo2,
  RotateCcw,
  Shield,
  Sparkles,
  Undo2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

type Tool = 'brush' | 'roller' | 'eraser' | 'smart' | 'polygon' | 'cover';
type Point = { x: number; y: number };
type ViewMode = 'after' | 'before' | 'compare';
type BrushPreset = { id: string; label: string; detail: string; px: number };
type CoverPreset = { id: string; label: string; detail: string; px: number };

const palette = ['#F2EFE6','#D8C9B5','#C9CBC8','#A7B19B','#9FB4C3','#B86F52','#496255','#45494B','#1D2022','#FF6B9D','#6C5CE7','#00B894'];
const brushPresets: BrushPreset[] = [
  { id: '2cm', label: '2 cm', detail: 'Tarkka', px: 18 },
  { id: '3cm', label: '3 cm', detail: 'Reunat', px: 26 },
  { id: '5cm', label: '5 cm', detail: 'Yleinen', px: 38 },
  { id: '7cm', label: '7 cm', detail: 'Leveä', px: 54 },
  { id: '10cm', label: '10 cm', detail: 'Julkisivu', px: 72 },
];
const coverPresets: CoverPreset[] = [
  { id: 'thin', label: '1 cm', detail: 'Ohut teippi', px: 12 },
  { id: 'edge', label: '2 cm', detail: 'Reunat', px: 22 },
  { id: 'medium', label: '5 cm', detail: 'Kehykset', px: 42 },
  { id: 'wide', label: '10 cm', detail: 'Leveä suoja', px: 76 },
];
const clamp = (value:number,min:number,max:number) => Math.max(min,Math.min(max,value));

function hexRgb(hex:string) {
  const value = parseInt(hex.slice(1), 16);
  return { r:(value >> 16) & 255, g:(value >> 8) & 255, b:value & 255 };
}

export function UniversalPaintStudioPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const paintRef = useRef<HTMLCanvasElement>(null);
  const protectRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<Point | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#D99518');
  const [brushSize, setBrushSize] = useState(38);
  const [brushPreset, setBrushPreset] = useState('5cm');
  const [coverSize, setCoverSize] = useState(22);
  const [coverPreset, setCoverPreset] = useState('edge');
  const [opacity, setOpacity] = useState(0.7);
  const [tolerance, setTolerance] = useState(62);
  const [edgeLock, setEdgeLock] = useState(62);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [kidsMode, setKidsMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('after');
  const [compareAt, setCompareAt] = useState(50);
  const [polygonPoints, setPolygonPoints] = useState<Point[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [message, setMessage] = useState('Aloita suojaamalla kohdat, joita et halua maalata. Sen jälkeen valitse väri ja työkalu.');

  const loadFile = (file?: File) => {
    if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) return;
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setHistory([]); setHistoryIndex(-1); setZoom(1); setViewMode('after'); setPolygonPoints([]);
    setMessage('Kuva valmis. Vaihe 1: suojaa ikkunat, listat, kehykset tai muut kohdat, joita et halua maalata.');
  };

  const onImageLoad = () => {
    const img = imageRef.current; const canvas = paintRef.current; const protect = protectRef.current;
    if (!img || !canvas || !protect) return;
    const longest = Math.max(img.naturalWidth, img.naturalHeight);
    const scale = Math.min(1, 1400 / longest);
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    setSize({ width, height });
    canvas.width = width; canvas.height = height;
    protect.width = width; protect.height = height;
    canvas.getContext('2d')?.clearRect(0,0,width,height);
    protect.getContext('2d')?.clearRect(0,0,width,height);
    const source = document.createElement('canvas'); source.width = width; source.height = height;
    source.getContext('2d')?.drawImage(img,0,0,width,height);
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
    const next = [...history.slice(0,historyIndex+1), canvas.toDataURL('image/png')].slice(-30);
    setHistory(next); setHistoryIndex(next.length-1);
  };

  const protectAlpha = () => protectRef.current?.getContext('2d')?.getImageData(0,0,size.width,size.height).data ?? null;

  const drawProtection = (from:Point,to:Point) => {
    const ctx=protectRef.current?.getContext('2d'); if(!ctx)return;
    ctx.save(); ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=.62; ctx.strokeStyle='#F97316';
    ctx.lineWidth=coverSize; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();ctx.restore();
  };

  const drawStroke = (from: Point, to: Point) => {
    const target=paintRef.current; const ctx=target?.getContext('2d'); if (!target||!ctx) return;
    if(tool==='eraser'){
      ctx.save();ctx.globalCompositeOperation='destination-out';ctx.globalAlpha=1;ctx.strokeStyle='#000';ctx.lineWidth=brushSize;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();ctx.restore();return;
    }
    const temp=document.createElement('canvas');temp.width=target.width;temp.height=target.height;const t=temp.getContext('2d');if(!t)return;
    t.globalAlpha=opacity;t.strokeStyle=color;t.lineWidth=tool==='roller'?brushSize*2.15:brushSize;t.lineCap=tool==='roller'?'square':'round';t.lineJoin='round';t.beginPath();t.moveTo(from.x,from.y);t.lineTo(to.x,to.y);t.stroke();
    const protect=protectRef.current;if(protect){t.globalCompositeOperation='destination-out';t.globalAlpha=1;t.drawImage(protect,0,0);}
    ctx.drawImage(temp,0,0);
  };

  const renderMask = (mask:Uint8Array) => {
    const source=sourceRef.current,target=paintRef.current;
    const sourceCtx=source?.getContext('2d'),targetCtx=target?.getContext('2d');
    if(!source||!target||!sourceCtx||!targetCtx)return;
    const w=source.width,h=source.height,data=sourceCtx.getImageData(0,0,w,h).data,protectedPixels=protectAlpha();
    const overlayCanvas=document.createElement('canvas'); overlayCanvas.width=w; overlayCanvas.height=h;
    const overlayCtx=overlayCanvas.getContext('2d'); if(!overlayCtx)return;
    const overlay=overlayCtx.createImageData(w,h); const rgb=hexRgb(color);
    for(let i=0;i<mask.length;i++) if(mask[i] && !(protectedPixels && protectedPixels[i*4+3]>0)) {
      const p=i*4, light=(data[p]*.299+data[p+1]*.587+data[p+2]*.114)/255;
      const shade=.66+light*.42;
      overlay.data[p]=clamp(Math.round(rgb.r*shade),0,255);
      overlay.data[p+1]=clamp(Math.round(rgb.g*shade),0,255);
      overlay.data[p+2]=clamp(Math.round(rgb.b*shade),0,255);
      overlay.data[p+3]=Math.round(255*opacity);
    }
    overlayCtx.putImageData(overlay,0,0); targetCtx.drawImage(overlayCanvas,0,0); commit();
  };

  const smartFillAt = (seed: Point) => {
    const source=sourceRef.current; const sourceCtx=source?.getContext('2d');
    if(!source||!sourceCtx)return false;
    const w=source.width,h=source.height,image=sourceCtx.getImageData(0,0,w,h),data=image.data,total=w*h,protectedPixels=protectAlpha();
    const sx=clamp(Math.floor(seed.x),0,w-1), sy=clamp(Math.floor(seed.y),0,h-1);
    const refs:{r:number;g:number;b:number}[]=[];
    const radius=Math.max(3,Math.round(Math.min(w,h)*.008));
    for(let oy=-radius;oy<=radius;oy+=Math.max(2,Math.round(radius/2))) for(let ox=-radius;ox<=radius;ox+=Math.max(2,Math.round(radius/2))) {
      const x=clamp(sx+ox,0,w-1), y=clamp(sy+oy,0,h-1), p=(y*w+x)*4;
      refs.push({r:data[p],g:data[p+1],b:data[p+2]});
    }
    const refDistance=(idx:number)=>{const p=idx*4;let best=999;for(const ref of refs){const dr=data[p]-ref.r,dg=data[p+1]-ref.g,db=data[p+2]-ref.b;best=Math.min(best,Math.sqrt(dr*dr+dg*dg+db*db));}return best;};
    const localDistance=(a:number,b:number)=>{const pa=a*4,pb=b*4,dr=data[pa]-data[pb],dg=data[pa+1]-data[pb+1],db=data[pa+2]-data[pb+2];return Math.sqrt(dr*dr+dg*dg+db*db);};
    const luminance=(idx:number)=>{const p=idx*4;return data[p]*.299+data[p+1]*.587+data[p+2]*.114;};
    const edge=(a:number,b:number)=>Math.max(Math.abs(luminance(a)-luminance(b)),localDistance(a,b)*.48);
    const mask=new Uint8Array(total), seen=new Uint8Array(total), queue=new Int32Array(total);
    let head=0,tail=0,count=0; const start=sy*w+sx;
    if(protectedPixels && protectedPixels[start*4+3]>0){setMessage('Tämä kohta on suojattu. Napauta maalausalueen sisäpuolelta.');return false;}
    seen[start]=1; queue[tail++]=start;
    const edgeThreshold=clamp(88-edgeLock*.62,30,66),directLimit=tolerance*1.85,localLimit=24+tolerance*.42,farLimit=tolerance*3.25,safetyLimit=Math.floor(total*.64);
    while(head<tail&&count<safetyLimit){
      const idx=queue[head++]; mask[idx]=1; count++; const x=idx%w,y=Math.floor(idx/w);
      const visit=(n:number)=>{if(seen[n])return;seen[n]=1;if(protectedPixels&&protectedPixels[n*4+3]>0)return;if(edge(idx,n)>edgeThreshold)return;const fromSeed=refDistance(n),local=localDistance(idx,n);if(fromSeed<=directLimit||(local<=localLimit&&fromSeed<=farLimit))queue[tail++]=n;};
      if(x>0)visit(idx-1);if(x<w-1)visit(idx+1);if(y>0)visit(idx-w);if(y<h-1)visit(idx+w);
    }
    const minimum=Math.max(600,Math.round(total*.004));
    if(count<minimum){setMessage('Automaattinen täyttö löysi liian pienen alueen. Napauta seinän keskeltä tai nosta herkkyyttä.');return false;}
    if(count>=safetyLimit){setMessage('Automaattinen täyttö olisi levinnyt liian laajalle, joten se pysäytettiin. Lisää suojakaistaleita tai käytä Rajaa pinta -työkalua.');return false;}
    const smooth=new Uint8Array(mask);
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const idx=y*w+x;if(mask[idx])continue;const n=mask[idx-1]+mask[idx+1]+mask[idx-w]+mask[idx+w]+mask[idx-w-1]+mask[idx-w+1]+mask[idx+w-1]+mask[idx+w+1];if(n>=7)smooth[idx]=1;}
    renderMask(smooth);setMessage(`Automaattinen maalaus onnistui (${Math.round(count/1000)}k px). Suojatut alueet jätettiin maalaamatta.`);return true;
  };

  const fillPolygon = () => {
    const source=sourceRef.current;
    if(!source||polygonPoints.length<3){setMessage('Rajaa pinta vähintään kolmella pisteellä.');return;}
    const maskCanvas=document.createElement('canvas');maskCanvas.width=source.width;maskCanvas.height=source.height;
    const ctx=maskCanvas.getContext('2d');if(!ctx)return;
    ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(polygonPoints[0].x,polygonPoints[0].y);polygonPoints.slice(1).forEach(point=>ctx.lineTo(point.x,point.y));ctx.closePath();ctx.fill();
    const pixels=ctx.getImageData(0,0,source.width,source.height).data,mask=new Uint8Array(source.width*source.height);
    for(let i=0;i<mask.length;i++)if(pixels[i*4+3]>0)mask[i]=1;
    renderMask(mask);setPolygonPoints([]);setTool('brush');setMessage('Rajattu pinta maalattiin. Suojatut kehykset ja reunat säilyivät koskemattomina.');
  };

  const pointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(!imageUrl||viewMode!=='after')return;event.preventDefault();event.stopPropagation();const p=pointFromEvent(event);if(!p)return;
    if(tool==='polygon'){setPolygonPoints(points=>[...points,p]);return;}
    if(tool==='smart'){smartFillAt(p);return;}
    event.currentTarget.setPointerCapture(event.pointerId);drawingRef.current=true;lastRef.current=p;
    if(tool==='cover')drawProtection(p,p);else drawStroke(p,p);
  };
  const pointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(!drawingRef.current||!lastRef.current)return;event.preventDefault();event.stopPropagation();const p=pointFromEvent(event);if(!p)return;
    if(tool==='cover')drawProtection(lastRef.current,p);else drawStroke(lastRef.current,p);lastRef.current=p;
  };
  const pointerUp=(event?:ReactPointerEvent<HTMLDivElement>)=>{event?.preventDefault();event?.stopPropagation();if(!drawingRef.current)return;drawingRef.current=false;lastRef.current=null;if(tool!=='cover')commit();};

  const restore=(index:number)=>{const canvas=paintRef.current,frame=history[index];if(!canvas||!frame)return;const ctx=canvas.getContext('2d');if(!ctx)return;const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0);setHistoryIndex(index);};img.src=frame;};
  const undo=()=>historyIndex>0&&restore(historyIndex-1);
  const redo=()=>historyIndex<history.length-1&&restore(historyIndex+1);
  const reset=()=>{const c=paintRef.current;if(!c)return;c.getContext('2d')?.clearRect(0,0,c.width,c.height);setPolygonPoints([]);commit();};
  const clearProtection=()=>{const c=protectRef.current;if(!c)return;c.getContext('2d')?.clearRect(0,0,c.width,c.height);setMessage('Kaikki suojaukset poistettiin.');};
  const chooseBrush=(preset:BrushPreset)=>{setBrushPreset(preset.id);setBrushSize(preset.px);setTool('brush');setViewMode('after');setPolygonPoints([]);setMessage(`${preset.label} ${preset.detail} -sivellin valittu.`);};
  const chooseCover=(preset:CoverPreset)=>{setCoverPreset(preset.id);setCoverSize(preset.px);setTool('cover');setViewMode('after');setPolygonPoints([]);setMessage(`${preset.label} ${preset.detail} valittu. Vedä suojaus sen kohdan päälle tai ympäri, jota et halua maalata.`);};

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
  const svgPoints=polygonPoints.map(point=>`${(point.x/Math.max(1,size.width))*1000},${(point.y/Math.max(1,size.height))*1000}`).join(' ');

  return <section className={`${kidsMode?'bg-orange-50':'bg-navy-50'} min-h-screen w-full overflow-x-hidden px-2 py-3 sm:px-3 sm:py-4`}>
    <div className="container-base w-full max-w-6xl overflow-x-hidden">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">VäriKamu</p><h1 className="font-display text-xl font-extrabold text-navy-950 sm:text-2xl">Maalaa seinä helposti ja tarkasti</h1></div><div className="flex gap-2"><button className="btn-outline" onClick={()=>setShowGuide(v=>!v)}><HelpCircle className="size-4"/>Ohje</button><button className="btn-outline" onClick={()=>setKidsMode(v=>!v)}>{kidsMode?'Normaali tila':'🎨 Lasten tila'}</button></div></div>

      {showGuide&&<div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4"><div className="flex items-center justify-between"><h2 className="font-bold text-navy-950">Näin käytät VäriKamua</h2><button onClick={()=>setShowGuide(false)} className="text-navy-500"><X className="size-4"/></button></div><div className="mt-3 grid gap-2 sm:grid-cols-5">{[
        ['1','Lataa kuva','Ota kuva tai valitse tiedosto.'],['2','Suojaa','Peitä ikkunat, listat ja muut kohdat, joita et halua maalata.'],['3','Valitse väri','Valitse valmis väri tai oma HEX-väri.'],['4','Maalaa','Käytä sivellintä, telaa, automaattitäyttöä tai Rajaa pinta -työkalua.'],['5','Tarkista','Vertaa Ennen/Jälkeen ja lataa kuva.']
      ].map(([n,title,text])=><div key={n} className="rounded-xl bg-white p-3"><span className="inline-grid size-7 place-items-center rounded-full bg-orange-500 text-xs font-black text-white">{n}</span><strong className="mt-2 block text-sm">{title}</strong><span className="mt-1 block text-xs text-navy-600">{text}</span></div>)}</div></div>}

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="card min-w-0 overflow-hidden p-2 sm:p-4">
          {!imageUrl?<div className="grid min-h-[46vh] place-items-center rounded-2xl border-2 border-dashed border-navy-200 bg-white p-5 text-center"><div><Camera className="mx-auto size-12 text-orange-500"/><h2 className="mt-4 text-xl font-bold">Ota kuva tai lataa kuva</h2><p className="mt-2 text-sm text-navy-600">Seinä, katto, ovi, ikkunan puuosa, kaappi, kaluste, puu tai metalli.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="btn-primary" onClick={()=>cameraRef.current?.click()}><Camera className="size-4"/>Ota kuva</button><button className="btn-outline" onClick={()=>fileRef.current?.click()}><Upload className="size-4"/>Lataa kuva</button></div></div></div>:<>
            <div className="w-full overflow-hidden rounded-2xl bg-navy-950 p-1" style={{maxHeight:'64dvh'}}><div className="flex min-h-[260px] w-full items-center justify-center overflow-hidden"><div ref={stageRef} className="relative shrink-0 overflow-hidden rounded-xl bg-black select-none" style={{width:stageWidth,aspectRatio:`${size.width}/${size.height}`,maxWidth:'100%',transform:`scale(${zoom})`,transformOrigin:'center',touchAction:'none',userSelect:'none',WebkitUserSelect:'none',cursor:tool==='polygon'?'crosshair':tool==='smart'?'cell':'crosshair'}} onDragStart={e=>e.preventDefault()} onContextMenu={e=>e.preventDefault()} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onLostPointerCapture={pointerUp}><img ref={imageRef} src={imageUrl} onLoad={onImageLoad} draggable={false} onDragStart={e=>e.preventDefault()} className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill"/><canvas ref={paintRef} className="pointer-events-none absolute inset-0 h-full w-full select-none" style={canvasStyle}/><canvas ref={protectRef} className="pointer-events-none absolute inset-0 h-full w-full select-none" style={{opacity:.72}}/>{polygonPoints.length>0&&<svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full"><polyline points={svgPoints} fill="none" stroke="#F97316" strokeWidth="4" vectorEffect="non-scaling-stroke"/>{polygonPoints.map((point,index)=><circle key={index} cx={(point.x/Math.max(1,size.width))*1000} cy={(point.y/Math.max(1,size.height))*1000} r="10" fill="#fff" stroke="#F97316" strokeWidth="4" vectorEffect="non-scaling-stroke"/>)}</svg>}{viewMode==='compare'&&<><div className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-white" style={{left:`${compareAt}%`}}/><span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white">Jälkeen</span><span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white">Ennen</span></>}</div></div></div>
            <div className="mt-2 flex flex-wrap items-center gap-2"><button className="btn-outline" onClick={()=>setZoom(z=>Math.max(1,z-.25))} disabled={zoom<=1}><ZoomOut className="size-4"/>−</button><button className="btn-outline" onClick={()=>setZoom(1)}><Maximize2 className="size-4"/>Sovita</button><button className="btn-outline" onClick={()=>setZoom(z=>Math.min(2.5,z+.25))}><ZoomIn className="size-4"/>+</button><span className="text-xs text-navy-500">{Math.round(zoom*100)}%</span></div>
            <div className="mt-3 grid grid-cols-3 gap-2"><button className={viewMode==='before'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('before')}>Ennen</button><button className={viewMode==='after'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('after')}>Jälkeen</button><button className={viewMode==='compare'?'btn-primary':'btn-outline'} onClick={()=>setViewMode('compare')}>Vertaa</button></div>{viewMode==='compare'&&<input className="mt-3 w-full accent-orange-500" type="range" min="5" max="95" value={compareAt} onChange={e=>setCompareAt(Number(e.target.value))}/>}</>}
          <input ref={fileRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>loadFile(e.target.files?.[0])}/><input ref={cameraRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={e=>loadFile(e.target.files?.[0])}/>
          {imageUrl&&<div className="mt-2 flex flex-wrap gap-2"><button className="btn-outline" onClick={undo} disabled={historyIndex<=0}><Undo2 className="size-4"/>Kumoa</button><button className="btn-outline" onClick={redo} disabled={historyIndex>=history.length-1}><Redo2 className="size-4"/>Tee uudelleen</button><button className="btn-outline" onClick={reset}><RotateCcw className="size-4"/>Tyhjennä maalit</button><button className="btn-outline" onClick={clearProtection}><Shield className="size-4"/>Poista suojaukset</button></div>}
        </div>

        <aside className="min-w-0 space-y-4">
          <div className="card p-4"><h2 className="font-bold text-navy-950">1. Työkalu</h2><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>{setTool('cover');setViewMode('after');setPolygonPoints([]);setMessage('Vedä suojaus sen kohdan päälle tai reunan ympärille, jota et halua maalata.');}} className={tool==='cover'?'btn-primary':'btn-outline'}><Shield className="size-4"/>Suojaa</button><button onClick={()=>{setTool('brush');setViewMode('after');setPolygonPoints([]);}} className={tool==='brush'?'btn-primary':'btn-outline'}><Paintbrush className="size-4"/>Sivellin</button><button onClick={()=>{setTool('roller');setViewMode('after');setPolygonPoints([]);}} className={tool==='roller'?'btn-primary':'btn-outline'}><PaintRoller className="size-4"/>Tela</button><button onClick={()=>{setTool('smart');setViewMode('after');setPolygonPoints([]);setMessage('Napauta kerran seinän keskeltä. Suojatut alueet toimivat esteinä automaattiselle maalaukselle.');}} className={tool==='smart'?'btn-primary':'btn-outline'}><Sparkles className="size-4"/>Täytä automaattisesti</button><button onClick={()=>{setTool('eraser');setViewMode('after');setPolygonPoints([]);}} className={tool==='eraser'?'btn-primary':'btn-outline'}><Eraser className="size-4"/>Pyyhin</button><button onClick={()=>{setTool('polygon');setViewMode('after');setPolygonPoints([]);setMessage('Klikkaa maalattavan pinnan kulmapisteet. Suojatut kohdat pysyvät silti maalaamatta.');}} className={tool==='polygon'?'btn-primary':'btn-outline'}><MousePointer2 className="size-4"/>Rajaa pinta</button></div>{tool==='polygon'&&<div className="mt-3 grid grid-cols-2 gap-2"><button className="btn-primary" disabled={polygonPoints.length<3} onClick={fillPolygon}><Check className="size-4"/>Maalaa rajattu</button><button className="btn-outline" onClick={()=>setPolygonPoints([])}><X className="size-4"/>Tyhjennä rajaus</button></div>}</div>

          <div className="card p-4"><h2 className="font-bold text-navy-950">2. Suojauksen leveys</h2><p className="mt-1 text-xs text-navy-600">Käytä kuin maalarinteippiä: kierrä ikkunan, oven, listan, laitteen tai muun suojattavan kohteen ympärille.</p><div className="mt-3 grid grid-cols-4 gap-2">{coverPresets.map(preset=><button key={preset.id} onClick={()=>chooseCover(preset)} className={`rounded-xl border p-2 text-center ${coverPreset===preset.id&&tool==='cover'?'border-orange-500 bg-orange-50 ring-2 ring-orange-100':'border-navy-100 bg-white'}`}><span className="mx-auto block rounded-full bg-orange-500" style={{width:'34px',height:`${Math.max(3,Math.round(preset.px*.22))}px`}}/><strong className="mt-1 block text-[11px]">{preset.label}</strong><span className="block text-[9px] text-navy-500">{preset.detail}</span></button>)}</div><label className="mt-3 block text-xs font-bold">Oma suojausleveys {coverSize}px<input className="mt-1 w-full accent-orange-500" type="range" min="6" max="120" value={coverSize} onChange={e=>{setCoverSize(Number(e.target.value));setCoverPreset('custom');setTool('cover');}}/></label></div>

          <div className="card p-4"><h2 className="font-bold text-navy-950">3. Siveltimen tyyppi</h2><div className="mt-3 grid grid-cols-5 gap-2">{brushPresets.map(preset=><button key={preset.id} onClick={()=>chooseBrush(preset)} className={`rounded-xl border p-2 text-center transition ${brushPreset===preset.id&&tool==='brush'?'border-orange-500 bg-orange-50 ring-2 ring-orange-100':'border-navy-100 bg-white hover:border-orange-300'}`}><span className="mx-auto block rounded-sm bg-navy-900" style={{width:`${Math.max(8,Math.round(preset.px*.35))}px`,height:'28px'}}/><strong className="mt-1 block text-[11px]">{preset.label}</strong><span className="block text-[9px] text-navy-500">{preset.detail}</span></button>)}</div></div>

          <div className="card p-4"><h2 className="font-bold">4. Väri</h2><div className="mt-3 flex flex-wrap gap-2">{palette.map(c=><button key={c} aria-label={c} onClick={()=>setColor(c)} className={`h-9 w-9 rounded-full border-2 ${color===c?'border-orange-500 ring-2 ring-orange-200':'border-white'}`} style={{backgroundColor:c}}/>)}<input aria-label="Oma väri" type="color" value={color} onChange={e=>setColor(e.target.value)} className="h-9 w-12 rounded"/></div></div>
          <div className="card p-4"><label className="text-sm font-bold">Siveltimen koko {brushSize}px<input className="mt-2 w-full accent-orange-500" type="range" min="8" max="110" value={brushSize} onChange={e=>{setBrushSize(Number(e.target.value));setBrushPreset('custom');}}/></label><label className="mt-4 block text-sm font-bold">Värin peittävyys {Math.round(opacity*100)}%<input className="mt-2 w-full accent-orange-500" type="range" min="35" max="90" value={Math.round(opacity*100)} onChange={e=>setOpacity(Number(e.target.value)/100)}/></label><label className="mt-4 block text-sm font-bold">Automaation herkkyys {tolerance}<input className="mt-2 w-full accent-orange-500" type="range" min="35" max="100" value={tolerance} onChange={e=>setTolerance(Number(e.target.value))}/></label><label className="mt-4 block text-sm font-bold">Rajojen suojaus {edgeLock}%<input className="mt-2 w-full accent-orange-500" type="range" min="30" max="85" value={edgeLock} onChange={e=>setEdgeLock(Number(e.target.value))}/></label></div>
          <div className="card p-4"><p className="text-sm leading-6 text-navy-700">{message}</p><div className="mt-3 grid grid-cols-2 gap-2"><button className="btn-outline" onClick={()=>download('png')} disabled={!imageUrl}><Download className="size-4"/>PNG</button><button className="btn-primary" onClick={()=>download('jpg')} disabled={!imageUrl}><Download className="size-4"/>JPG</button></div></div>
        </aside>
      </div>
    </div>
  </section>;
}
