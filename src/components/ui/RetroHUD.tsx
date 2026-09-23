import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { sounds } from '../../utils/soundEffects';

export function RetroHUD() {
  const questItems = useGameStore((s) => s.questItems);
  const collectedIds = useGameStore((s) => s.collectedItemIds);
  const moonOnline = useGameStore((s) => s.moonOnline);
  const hasBambooPole = useGameStore((s) => s.hasBambooPole);
  const systemMessage = useGameStore((s) => s.systemMessage);
  const cycleSystemMessage = useGameStore((s) => s.cycleSystemMessage);
  const isBeautyMode = useGameStore((s) => s.isBeautyMode);
  const isSlowed = useGameStore((s) => s.isSlowed);
  const sodiumLevel = useGameStore((s) => s.sodiumLevel);
  const triggerBambooPoke = useGameStore((s) => s.triggerBambooPoke);
  const personalLanternBuilt = useGameStore((s) => s.personalLanternBuilt);
  const personalLanternLit = useGameStore((s) => s.personalLanternLit);

  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  // Periodically cycle hilarious system status messages
  useEffect(() => {
    const interval = setInterval(() => {
      cycleSystemMessage();
    }, 6500);
    return () => clearInterval(interval);
  }, [cycleSystemMessage]);

  const toggleSound = () => {
    const nextState = sounds.toggleMute();
    setIsMuted(nextState);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 select-none">
      {/* ================= TOP BAR ================= */}
      <div className="flex items-start justify-between w-full gap-2">
        {/* TOP-LEFT: Game Title & Quest Tracker */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {/* Main title tag */}
          <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 px-3 py-1 shadow-md inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="font-mono font-extrabold text-sm sm:text-base text-slate-900 tracking-wider">
              RẰM.exe
            </span>
            <span className="text-[11px] text-slate-600 font-mono hidden sm:inline">
              | Build 15.08
            </span>
          </div>

          {/* Quest Tracker Box */}
          <div className="bg-[#0f172a]/90 backdrop-blur-sm border border-slate-700 p-2.5 rounded shadow-lg max-w-xs text-xs font-mono text-slate-200">
            <div className="flex items-center justify-between text-yellow-400 font-bold mb-1.5">
              <span>SETUP KHU THẮP SÁNG:</span>
              <span className="text-sm bg-yellow-400/20 px-1.5 py-0.5 rounded text-yellow-300">
                {collectedIds.length} / 3
              </span>
            </div>

            {/* Checklist of 3 items */}
            <div className="space-y-1">
              {questItems.map((item) => {
                const isCollected = collectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                      isCollected ? 'text-emerald-400 line-through opacity-70' : 'text-slate-300'
                    }`}
                  >
                    <span>{isCollected ? '✅' : '◽'}</span>
                    <span className="truncate">{item.vietnameseName}</span>
                  </div>
                );
              })}
            </div>

            {/* Prompt when all 3 collected */}
            {collectedIds.length === 3 && !moonOnline && (
              <div className="mt-2 p-1.5 bg-yellow-500/20 border border-yellow-500/50 rounded text-[11px] text-yellow-300 font-bold animate-pulse text-center">
                ➔ Đủ đồ rồi — mang về khu setup / stage!
              </div>
            )}
          </div>
        </div>

        {/* TOP-RIGHT: Moon Status & Weapon / Sound Controls */}
        <div className="flex flex-col items-end gap-1.5 pointer-events-auto">
          {/* Moon Server Status Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="bg-[#c0c0c0] hover:bg-slate-300 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 px-2 py-1 text-xs font-mono font-bold shadow active:translate-y-0.5 cursor-pointer text-slate-900"
              title="Bật/Tắt âm thanh"
            >
              {isMuted ? '🔇 TẮT ÂM' : '🔊 BẬT ÂM'}
            </button>

            <div
              className={`border-t-2 border-l-2 border-b-2 border-r-2 px-3 py-1 font-mono font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 ${
                moonOnline
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                  : 'bg-red-950 border-red-500 text-red-300'
              }`}
            >
              <span>LẦU 4:</span>
              <span className="font-extrabold">
                {moonOnline ? 'LÊN ĐÈN ✨' : 'ĐANG SETUP 🛠️'}
              </span>
            </div>
          </div>

          {/* Bamboo Pole Status */}
          {hasBambooPole ? (
            <button
              onClick={triggerBambooPoke}
              className="bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-500 text-emerald-200 px-2.5 py-1 text-xs font-mono rounded shadow cursor-pointer active:scale-95 transition-transform flex items-center gap-1.5"
            >
              <span>🎋</span>
              <span>CÂY TRE BTC: </span>
              <span className="text-yellow-300 underline font-bold">[CHỌC LỒNG ĐÈN]</span>
            </button>
          ) : (
            <div className="bg-slate-900/80 border border-slate-700 text-slate-400 px-2.5 py-1 text-[11px] font-mono rounded">
              🎋 Chưa có cây tre (Gặp Chú Bảo Vệ/BTC)
            </div>
          )}

          {/* Personal lantern workshop status */}
          <div className="bg-amber-950/85 border border-amber-500 text-amber-200 px-2.5 py-1 text-[11px] font-mono rounded max-w-[260px] text-right">
            <div className="font-bold text-yellow-300">🏮 QUẦY LÀM LỒNG ĐÈN</div>
            <div>
              {personalLanternLit
                ? 'Đèn cá nhân: ĐÃ THẮP SÁNG ✨'
                : personalLanternBuilt
                  ? 'Đèn cá nhân: ĐÃ LÀM XONG — đi theo biển → KHU THẮP SÁNG'
                  : 'Theo biển ← WORKSHOP UID → up ảnh → làm lồng đèn'}
            </div>
            <div className="text-amber-400/80">UID • Lầu 4 • Văn phòng Gò Dầu</div>
          </div>

          {/* Active Buffs / Debuffs Status */}
          <div className="flex flex-col items-end gap-1 text-[11px] font-mono">
            {isSlowed && (
              <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 px-2 py-0.5 rounded animate-pulse">
                🩹 Salonpas: Cột sống đang hồi phục (Chậm 3s)
              </div>
            )}
            {isBeautyMode && (
              <div className="bg-pink-950/90 border border-pink-500 text-pink-300 px-2 py-0.5 rounded animate-bounce">
                💄 Beauty Filter: 280% (Lung linh lung linh)
              </div>
            )}
            {sodiumLevel > 0 && (
              <div className="bg-amber-950/80 border border-amber-600 text-amber-300 px-2 py-0.5 rounded">
                🍜 Sodium nạp: {sodiumLevel}mg
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR: SYSTEM TICKER ================= */}
      <div className="w-full flex justify-center pointer-events-none mb-1">
        <div className="bg-slate-950/85 border border-slate-800 backdrop-blur-sm px-4 py-1.5 rounded-full max-w-xl text-center shadow-lg pointer-events-auto">
          <div className="text-[11px] sm:text-xs font-mono text-cyan-400 flex items-center justify-center gap-2">
            <span className="text-yellow-400 font-bold">ℹ️ SERVER LOG:</span>
            <span className="truncate italic">“{systemMessage}”</span>
          </div>
        </div>
      </div>
    </div>
  );
}