import { PointerEvent, useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useWhiteboardStore } from '../../stores/useWhiteboardStore';

export function WhiteboardModal(){
  const open=useWhiteboardStore(s=>s.open);
  const close=useWhiteboardStore(s=>s.closeBoard);
  const imageData=useWhiteboardStore(s=>s.imageData);
  const save=useWhiteboardStore(s=>s.save);
  const init=useWhiteboardStore(s=>s.init);
  const name=useGameStore(s=>s.playerName);
  const show=useGameStore(s=>s.showAchievement);

  const canvasRef=useRef<HTMLCanvasElement>(null);
  const drawing=useRef(false);
  const [color,setColor]=useState('#111827');
  const [size,setSize]=useState(5);
  const [busy,setBusy]=useState(false);

  useEffect(()=>{ if(open) void init(); },[open,init]);

  useEffect(()=>{
    if(!open) return;
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext('2d');
    if(!canvas||!ctx) return;
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(imageData){
      const img=new Image();
      img.onload=()=>ctx.drawImage(img,0,0,canvas.width,canvas.height);
      img.src=imageData;
    }
  },[open,imageData]);

  if(!open) return null;

  const getPoint=(e:PointerEvent<HTMLCanvasElement>)=>{
    const canvas=canvasRef.current!;
    const rect=canvas.getBoundingClientRect();
    return {
      x:(e.clientX-rect.left)*(canvas.width/rect.width),
      y:(e.clientY-rect.top)*(canvas.height/rect.height),
    };
  };

  const start=(e:PointerEvent<HTMLCanvasElement>)=>{
    drawing.current=true;
    const ctx=canvasRef.current?.getContext('2d');
    if(!ctx) return;
    const p=getPoint(e);
    ctx.beginPath();
    ctx.moveTo(p.x,p.y);
  };

  const move=(e:PointerEvent<HTMLCanvasElement>)=>{
    if(!drawing.current) return;
    const ctx=canvasRef.current?.getContext('2d');
    if(!ctx) return;
    const p=getPoint(e);
    ctx.strokeStyle=color;
    ctx.lineWidth=size;
    ctx.lineCap='round';
    ctx.lineJoin='round';
    ctx.lineTo(p.x,p.y);
    ctx.stroke();
  };

  const clear=()=>{
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext('2d');
    if(!canvas||!ctx) return;
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  };

  const saveBoard=async()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    setBusy(true);
    const ok=await save(name,canvas.toDataURL('image/jpeg',0.82));
    setBusy(false);
    show({
      id:'whiteboard_save',
      title:ok?'✏️ ĐÃ CẬP NHẬT WHITEBOARD':'CHƯA LƯU ĐƯỢC',
      subtitle:ok?'Mọi người online sẽ thấy nét vẽ mới.':'Thử lại sau vài giây nha.',
    });
  };

  return (
    <div className="interactive-ui absolute inset-0 z-[96] bg-black/70 flex items-center justify-center p-3">
      <div className="w-full max-w-5xl rounded-xl bg-slate-950 border border-cyan-500/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between bg-cyan-600 px-4 py-3 text-white">
          <div>
            <div className="font-black">✏️ WHITEBOARD UID • VẼ BẰNG CHUỘT</div>
            <div className="text-[11px] opacity-90">Bảng chung realtime • ai save sau sẽ cập nhật bảng cho mọi người</div>
          </div>
          <button onClick={close} className="bg-black/25 px-3 py-1 rounded text-xs font-black">✕ ĐÓNG</button>
        </div>

        <div className="p-4">
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            className="w-full bg-white rounded-lg border-4 border-slate-700 touch-none cursor-crosshair"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={()=>{drawing.current=false;}}
            onPointerLeave={()=>{drawing.current=false;}}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {['#111827','#ef4444','#2563eb','#16a34a','#f59e0b','#a855f7'].map(c=>(
              <button key={c} onClick={()=>setColor(c)} className="h-8 w-8 rounded border-2 border-white/30" style={{backgroundColor:c}} />
            ))}
            <span className="text-xs text-slate-400 ml-2">Nét</span>
            <input type="range" min={2} max={18} value={size} onChange={e=>setSize(Number(e.target.value))}/>
            <button onClick={clear} className="ml-auto rounded bg-slate-700 px-4 py-2 text-sm font-black text-white">XOÁ BẢNG</button>
            <button disabled={busy} onClick={()=>void saveBoard()} className="rounded bg-emerald-500 px-5 py-2 text-sm font-black text-slate-950 disabled:opacity-50">
              {busy?'ĐANG SAVE...':'SAVE LÊN BẢNG CHUNG'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
