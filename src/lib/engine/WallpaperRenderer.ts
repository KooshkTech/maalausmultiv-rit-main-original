import { MaskLayer } from './MaskLayer';

export type WallpaperKind = 'solid'|'stripe'|'geometric'|'floral'|'concrete'|'wood'|'brick'|'linen';
export interface WallpaperParams { kind: WallpaperKind; scale:number; rotation:number; opacity:number; foreground:string; background:string; offsetX:number; offsetY:number }

const clamp01=(v:number)=>Math.max(0,Math.min(1,v));

export function applyWallpaper(canvas:HTMLCanvasElement,mask:MaskLayer,params:WallpaperParams){
  if(canvas.width!==mask.width||canvas.height!==mask.height) throw new Error('Wallpaper mask dimensions must match canvas');
  const ctx=canvas.getContext('2d'); if(!ctx) return;
  const tile=document.createElement('canvas'); const base=Math.max(24,Math.round(96*Math.max(.35,params.scale)));
  tile.width=base; tile.height=base; const t=tile.getContext('2d'); if(!t) return;
  t.fillStyle=params.background; t.fillRect(0,0,base,base); t.strokeStyle=params.foreground; t.fillStyle=params.foreground; t.lineWidth=Math.max(1,base*.055);
  switch(params.kind){
    case 'solid': t.fillStyle=params.foreground;t.globalAlpha=.96;t.fillRect(0,0,base,base);break;
    case 'stripe': for(let x=-base;x<base*2;x+=base*.34){t.beginPath();t.moveTo(x,0);t.lineTo(x+base*.45,base);t.stroke();}break;
    case 'geometric': for(let y=0;y<base;y+=base/2)for(let x=0;x<base;x+=base/2){t.strokeRect(x+3,y+3,base/2-6,base/2-6);t.beginPath();t.moveTo(x+3,y+base/4);t.lineTo(x+base/2-3,y+base/4);t.stroke();}break;
    case 'floral': for(const [x,y] of [[.25,.28],[.72,.68],[.72,.2]] as const){const cx=base*x,cy=base*y,r=base*.11;for(let a=0;a<6;a++){t.beginPath();t.ellipse(cx+Math.cos(a*Math.PI/3)*r,cy+Math.sin(a*Math.PI/3)*r,r*.58,r*.28,a*Math.PI/3,0,Math.PI*2);t.stroke();}t.beginPath();t.arc(cx,cy,r*.22,0,Math.PI*2);t.fill();}break;
    case 'concrete': for(let i=0;i<40;i++){const x=(i*37)%base,y=(i*61)%base,r=1+(i%4);t.globalAlpha=.08+(i%5)*.02;t.beginPath();t.arc(x,y,r,0,Math.PI*2);t.fill();}t.globalAlpha=1;break;
    case 'wood': for(let y=0;y<base;y+=base*.2){t.globalAlpha=.25;t.beginPath();t.moveTo(0,y);for(let x=0;x<=base;x+=8)t.lineTo(x,y+Math.sin((x+y)*.08)*4);t.stroke();}t.globalAlpha=1;break;
    case 'brick': {const h=base/4,w=base/2;for(let row=0;row<4;row++){const off=row%2?w/2:0;for(let x=-w;x<base+w;x+=w)t.strokeRect(x+off,row*h,w,h);}break;}
    case 'linen': for(let i=0;i<base;i+=6){t.globalAlpha=.15;t.fillRect(i,0,1,base);t.fillRect(0,i,base,1);}t.globalAlpha=1;break;
  }
  const patternCanvas=document.createElement('canvas');patternCanvas.width=canvas.width;patternCanvas.height=canvas.height;const p=patternCanvas.getContext('2d');if(!p)return;
  p.save();p.translate(params.offsetX,params.offsetY);p.translate(canvas.width/2,canvas.height/2);p.rotate(params.rotation*Math.PI/180);p.translate(-canvas.width/2,-canvas.height/2);const pattern=p.createPattern(tile,'repeat');if(pattern){p.fillStyle=pattern;p.fillRect(-canvas.width,-canvas.height,canvas.width*3,canvas.height*3);}p.restore();
  const maskCanvas=document.createElement('canvas');maskCanvas.width=mask.width;maskCanvas.height=mask.height;maskCanvas.getContext('2d')!.putImageData(mask.toImageData(),0,0);
  p.globalCompositeOperation='destination-in';p.drawImage(maskCanvas,0,0);
  const original=ctx.getImageData(0,0,canvas.width,canvas.height);const over=p.getImageData(0,0,canvas.width,canvas.height);const o=original.data,w=over.data,alpha=clamp01(params.opacity);
  for(let i=0;i<mask.alpha.length;i++){const m=(mask.alpha[i]/255)*alpha;if(!m)continue;const q=i*4;const lum=(.299*o[q]+.587*o[q+1]+.114*o[q+2])/255;const shade=.72+.38*lum;for(let c=0;c<3;c++){const target=w[q+c]*shade;o[q+c]=Math.max(0,Math.min(255,target*m+o[q+c]*(1-m)));}}
  ctx.putImageData(original,0,0);
}
