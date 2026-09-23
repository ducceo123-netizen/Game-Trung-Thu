import { ChangeEvent, useRef } from 'react';
import { useGameStore } from '../../stores/useGameStore';

export function LanternWorkshopModal() {
  const open = useGameStore((s) => s.workshopOpen);
  const image = useGameStore((s) => s.personalLanternImage);
  const built = useGameStore((s) => s.personalLanternBuilt);
  const lanternText = useGameStore((s) => s.personalLanternText);
  const closeWorkshop = useGameStore((s) => s.closeWorkshop);
  const setImage = useGameStore((s) => s.setPersonalLanternImage);
  const setLanternText = useGameStore((s) => s.setPersonalLanternText);
  const setShapeMode = useGameStore((s) => s.setPersonalLanternShapeMode);
  const build = useGameStore((s) => s.buildPersonalLantern);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const sourceDataUrl = reader.result;
      const preview = new Image();
      preview.onload = () => {
        const ratio = preview.naturalWidth / Math.max(1, preview.naturalHeight);
        if (ratio > 1.3) setShapeMode('wide');
        else if (ratio < 0.78) setShapeMode('portrait');
        else setShapeMode('generic');

        // Compress uploaded images before syncing them through Realtime Presence.
        // 256px is enough for the in-game lantern face and keeps multiplayer traffic light.
        const maxSide = 256;
        const scale = Math.min(1, maxSide / Math.max(preview.naturalWidth, preview.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(preview.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(preview.naturalHeight * scale));
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setImage(sourceDataUrl);
          return;
        }

        ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
        const compactDataUrl = canvas.toDataURL('image/jpeg', 0.72);
        setImage(compactDataUrl);
      };
      preview.src = sourceDataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 interactive-ui">
      <div className="w-full max-w-xl bg-[#d6d3c9] border-t-4 border-l-4 border-white border-b-4 border-r-4 border-slate-900 shadow-2xl font-mono text-slate-900">
        <div className="bg-[#8b1e1e] text-yellow-100 px-4 py-2 flex items-center justify-between border-b-2 border-slate-900">
          <div className="font-black tracking-wide">🏮 QUẦY LÀM LỒNG ĐÈN — UID GÒ DẦU • LẦU 2</div>
          <button onClick={closeWorkshop} className="bg-[#c0c0c0] text-slate-900 border border-white px-2 cursor-pointer">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-yellow-100 border-2 border-amber-700 p-3 text-sm leading-relaxed">
            <div className="font-black mb-1">BẢNG HƯỚNG DẪN:</div>
            <div>1. Chọn ảnh/meme hoặc gõ một câu ngắn để giao tiếp trên lồng đèn.</div>
            <div>2. Hệ thống đọc tỷ lệ ảnh để chọn shape dọc / ngang / vuông gần giống ảnh.</div>
            <div>3. Bấm <b>LÀM LỒNG ĐÈN</b> — nhân vật sẽ cầm đèn theo luôn.</div>
            <div>4. Nhấn <b>F</b> để bật / tắt đèn trong lúc đi vòng vòng.</div>
            <div>5. Có thể mang đèn lên Lầu 3... nếu đủ gan.</div>
            <div className="mt-1 text-[11px] text-amber-900">Mẹo: đổi meme/ảnh/text bất kỳ lúc nào để dùng lồng đèn như bảng chat di động.</div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => inputRef.current?.click()}
              className="min-h-48 border-2 border-dashed border-slate-700 bg-slate-100 hover:bg-white cursor-pointer flex flex-col items-center justify-center gap-2 p-3"
            >
              {image ? (
                <img src={image} alt="Ảnh lồng đèn" className="max-h-44 max-w-full object-contain" />
              ) : (
                <>
                  <div className="text-5xl">📸</div>
                  <div className="font-black">BẤM ĐỂ UP ẢNH</div>
                  <div className="text-xs text-slate-600">JPG / PNG / WEBP</div>
                </>
              )}
            </button>

            <div className="bg-slate-900 text-slate-100 border-2 border-slate-700 p-4 flex flex-col justify-between">
              <div>
                <div className="text-yellow-300 font-black mb-2">PREVIEW OUTPUT</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Ảnh sẽ thành mặt chính của lồng đèn. Shape sẽ đổi theo tỷ lệ ảnh, kèm khung DIY, dây đỏ, tua rua và LED có thể bật sáng.
                </div>
              </div>
              <div className="mt-4 text-xs text-cyan-300">
                FLOW: UP ẢNH → CẦM ĐÈN → NHẤN F BẬT SÁNG
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-700 p-3">
            <div className="font-black text-sm mb-1">💬 CHỮ TRÊN LỒNG ĐÈN</div>
            <input
              value={lanternText}
              onChange={(e)=>setLanternText(e.target.value)}
              maxLength={42}
              placeholder="VD: ai đánh tui là hết bánh nha :))"
              className="w-full bg-slate-100 border border-slate-500 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
            <div className="text-[10px] text-slate-500 mt-1">{lanternText.length}/42 • người chơi khác online cũng thấy dòng này.</div>
          </div>

          <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

          <div className="flex gap-2 justify-end">
            <button
              onClick={closeWorkshop}
              className="px-4 py-2 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 cursor-pointer"
            >
              ĐÓNG
            </button>
            <button
              disabled={!image && !lanternText.trim()}
              onClick={() => {
                build();
                closeWorkshop();
              }}
              className="px-4 py-2 bg-amber-400 disabled:bg-slate-400 disabled:text-slate-600 border-t-2 border-l-2 border-yellow-100 border-b-2 border-r-2 border-slate-900 font-black cursor-pointer disabled:cursor-not-allowed"
            >
              {built ? 'LÀM LẠI LỒNG ĐÈN' : '🏮 LÀM LỒNG ĐÈN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}