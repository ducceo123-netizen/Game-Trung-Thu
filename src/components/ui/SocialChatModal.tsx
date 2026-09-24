import { ChangeEvent, useRef, useState } from 'react';
import { useSocialChatStore } from '../../stores/useSocialChatStore';

async function compressMeme(file:File):Promise<string>{
  const source=await new Promise<string>((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>typeof reader.result==='string'?resolve(reader.result):reject(new Error('read'));
    reader.onerror=()=>reject(reader.error);
    reader.readAsDataURL(file);
  });
  const img=await new Promise<HTMLImageElement>((resolve,reject)=>{
    const next=new Image();
    next.onload=()=>resolve(next);
    next.onerror=()=>reject(new Error('image'));
    next.src=source;
  });
  const maxSide=256;
  const scale=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
  canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
  const ctx=canvas.getContext('2d');
  if(!ctx) return source;
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/jpeg',0.7);
}

export function SocialChatModal(){
  const open=useSocialChatStore(s=>s.open);
  const close=useSocialChatStore(s=>s.closeChat);
  const send=useSocialChatStore(s=>s.sendChat);
  const [text,setText]=useState('');
  const [meme,setMeme]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);

  if(!open) return null;

  const onFile=async(e:ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    if(!file||!file.type.startsWith('image/')) return;
    setBusy(true);
    try{setMeme(await compressMeme(file));}finally{setBusy(false);e.target.value='';}
  };

  return (
    <div className="interactive-ui absolute inset-0 z-[93] bg-black/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-3">
      <div className="w-full max-w-lg rounded-xl border border-cyan-400/50 bg-slate-950 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <div className="font-black text-cyan-300">💬 NÓI CHUYỆN GẦN ĐÂY</div>
            <div className="text-[11px] text-slate-400">UIDer cùng tầng trong khoảng gần sẽ thấy bubble khoảng 7 giây.</div>
          </div>
          <button onClick={close} className="rounded bg-slate-800 px-2 py-1 text-xs">✕</button>
        </div>
        <div className="space-y-3 p-4">
          <textarea
            autoFocus
            value={text}
            onChange={e=>setText(e.target.value.slice(0,120))}
            onKeyDown={e=>{
              if(e.key==='Enter' && !e.shiftKey){
                e.preventDefault();
                if((text.trim()||meme)&&!busy){
                  send(text,meme);
                  setText('');
                  setMeme(null);
                }
              }
            }}
            placeholder="Gõ gì đó... VD: ai có bánh cho tui xin :))"
            className="h-24 w-full resize-none rounded border border-slate-700 bg-slate-900 p-3 text-sm outline-none focus:border-cyan-400"
          />
          <div className="text-right text-[10px] text-slate-500">{text.length}/120</div>

          {meme && (
            <div className="relative">
              <img src={meme} alt="meme preview" className="max-h-48 w-full rounded bg-black object-contain"/>
              <button onClick={()=>setMeme(null)} className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs">BỎ MEME</button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={busy}
              onClick={()=>inputRef.current?.click()}
              className="rounded bg-fuchsia-700 px-3 py-2 text-sm font-black disabled:opacity-50"
            >
              {busy?'ĐANG XỬ LÝ...':'🖼️ THẢ MEME'}
            </button>
            <button
              disabled={(!text.trim()&&!meme)||busy}
              onClick={()=>{send(text,meme);setText('');setMeme(null);}}
              className="rounded bg-cyan-400 px-3 py-2 text-sm font-black text-slate-950 disabled:opacity-40"
            >
              GỬI • ENTER/T
            </button>
          </div>
          <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden"/>
        </div>
      </div>
    </div>
  );
}