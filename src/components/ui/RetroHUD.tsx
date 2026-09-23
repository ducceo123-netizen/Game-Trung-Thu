import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { sounds } from '../../utils/soundEffects';
import { useEconomyStore } from '../../stores/useEconomyStore';

export function RetroHUD() {
  const collectedIds = useGameStore((s) => s.collectedItemIds);
  const currentFloor = useGameStore((s) => s.currentFloor);
  const systemMessage = useGameStore((s) => s.systemMessage);
  const cycleSystemMessage = useGameStore((s) => s.cycleSystemMessage);
  const personalLanternBuilt = useGameStore((s) => s.personalLanternBuilt);
  const personalLanternLit = useGameStore((s) => s.personalLanternLit);
  const playerHasLanternEquipped = useGameStore((s) => s.playerHasLanternEquipped);
  const booWarning = useGameStore((s) => s.booWarning);
  const booActive = useGameStore((s) => s.booActive);
  const teamAnnouncement = useGameStore((s) => s.teamAnnouncement);
  const isBeautyMode = useGameStore((s) => s.isBeautyMode);
  const isSlowed = useGameStore((s) => s.isSlowed);
  const sodiumLevel = useGameStore((s) => s.sodiumLevel);
  const onlineConnected = useGameStore((s) => s.onlineConnected);
  const onlinePlayerCount = useGameStore((s) => s.onlinePlayerCount);
  const mooncakeBalance = useEconomyStore((s)=>s.balance);
  const equippedItem = useEconomyStore((s)=>s.equippedItem);
  const health = useGameStore((s) => s.health);
  const maxHealth = useGameStore((s) => s.maxHealth);
  const isDead = useGameStore((s) => s.isDead);

  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  useEffect(() => {
    const interval = setInterval(cycleSystemMessage, 6500);
    return () => clearInterval(interval);
  }, [cycleSystemMessage]);

  const toggleSound = () => {
    setIsMuted(sounds.toggleMute());
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 select-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 px-3 py-1 shadow-md inline-flex items-center gap-2 pointer-events-auto w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono font-extrabold text-sm sm:text-base text-slate-900 tracking-wider">RẰM.exe</span>
            <span className="text-[11px] text-slate-600 font-mono">UID GÒ DẦU</span>
            <span className={onlineConnected ? 'text-[11px] font-mono text-emerald-700' : 'text-[11px] font-mono text-red-700'}>
              {onlineConnected ? `● ONLINE ${onlinePlayerCount}` : '● CONNECTING'}
            </span>
          </div>

          <div className="bg-[#0f172a]/90 border border-slate-700 p-2.5 rounded max-w-xs text-xs font-mono text-slate-200">
            <div className="flex items-center justify-between text-yellow-300 font-bold mb-1.5">
              <span>🌕 SĂN BÁNH TRUNG THU</span>
              <span className="bg-yellow-400/20 px-1.5 py-0.5 rounded">{collectedIds.length}/3</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Mỗi bánh bí mật chứa vé máy bay nội địa trị giá <b className="text-yellow-300">3.000.000đ</b>.
            </div>
            {collectedIds.length === 3 && (
              <div className="mt-2 border border-emerald-500/60 bg-emerald-900/30 text-emerald-300 px-2 py-1 text-center font-bold">
                🏆 ĐÃ TÌM ĐỦ 3 BÁNH!
              </div>
            )}
          </div>

          <div className="bg-amber-950/90 border border-amber-500 px-2.5 py-1.5 rounded text-[11px] font-mono text-amber-100 max-w-xs">
            <div className="font-black text-yellow-300">🌕 VÍ BÁNH: {mooncakeBalance}</div>
            <div>{equippedItem ? `Đang equip: ${equippedItem}` : 'Chưa equip vật phẩm'}</div>
          </div>

          <div className="bg-slate-950/85 border border-cyan-700/60 px-2.5 py-1.5 rounded text-[11px] font-mono text-cyan-100 max-w-xs">
            <div className="font-bold text-cyan-300">📍 LẦU HIỆN TẠI: LẦU {currentFloor}</div>
            <div>{currentFloor === 1 ? 'Sảnh UID • nhìn ra đường Gò Dầu' : currentFloor === 2 ? 'Văn phòng Gò Dầu • Trung Thu UID' : 'Halloween Zone • tìm đường về cầu thang'}</div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <button
            onClick={toggleSound}
            className="bg-[#c0c0c0] hover:bg-slate-300 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 px-2 py-1 text-xs font-mono font-bold text-slate-900"
          >
            {isMuted ? '🔇 TẮT ÂM' : '🔊 BẬT ÂM'}
          </button>

          <div className="bg-amber-950/90 border border-amber-500 text-amber-100 px-2.5 py-1.5 text-[11px] font-mono rounded max-w-[280px] text-right">
            <div className="font-bold text-yellow-300">🏮 LỒNG ĐÈN CÁ NHÂN</div>
            {!personalLanternBuilt && 'Chưa có — tới Workshop UID để up ảnh'}
            {personalLanternBuilt && playerHasLanternEquipped && (
              <div>
                ĐANG CẦM • {personalLanternLit ? '✨ ĐANG SÁNG' : 'TẮT ĐÈN'}
                <div className="text-amber-300 mt-0.5">Nhấn F để bật / tắt</div>
              </div>
            )}
          </div>

          <div className="w-[280px] bg-slate-950/90 border border-red-700 px-2.5 py-2 rounded font-mono">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-black text-red-300">❤️ HP</span>
              <span className={isDead ? 'text-red-400 font-black' : 'text-slate-200'}>{health}/{maxHealth}</span>
            </div>
            <div className="h-2.5 bg-red-950 border border-red-900 overflow-hidden">
              <div
                className="h-full transition-[width] duration-150"
                style={{
                  width: `${Math.max(0, Math.min(100, (health / maxHealth) * 100))}%`,
                  backgroundColor: health > 50 ? '#22c55e' : health > 25 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 text-right">
              {personalLanternBuilt ? 'Click trái / J: quật lồng đèn • 25 damage' : 'Làm lồng đèn để mở khóa combat'}
            </div>
          </div>

          {(booWarning || booActive) && (
            <div className={'px-4 py-2 font-mono font-black text-sm border-2 animate-pulse ' + (
              booActive
                ? 'bg-red-950 border-red-500 text-red-200'
                : 'bg-purple-950 border-purple-400 text-purple-100'
            )}>
              {booActive ? '🏃 BOO ĐANG RƯỢT — CHẠY XUỐNG LẦU 2!' : '⚠️ TÍN HIỆU LẠ... BOO ĐANG ĐẾN'}
            </div>
          )}

          <div className="flex flex-col items-end gap-1 text-[11px] font-mono">
            {isSlowed && <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 px-2 py-0.5 rounded">🩹 Salonpas đang hồi phục</div>}
            {isBeautyMode && <div className="bg-pink-950 border border-pink-500 text-pink-300 px-2 py-0.5 rounded">💄 Beauty Filter 280%</div>}
            {sodiumLevel > 0 && <div className="bg-amber-950 border border-amber-600 text-amber-300 px-2 py-0.5 rounded">🍜 Sodium: {sodiumLevel}mg</div>}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-2 mb-1">
        {teamAnnouncement && (
          <div className="bg-yellow-300 text-slate-950 border-2 border-yellow-100 px-4 py-2 rounded font-mono font-bold text-sm shadow-lg">
            {teamAnnouncement}
          </div>
        )}
        <div className="bg-slate-950/85 border border-slate-800 px-4 py-1.5 rounded-full max-w-xl text-center">
          <div className="text-[11px] sm:text-xs font-mono text-cyan-400">
            <span className="text-yellow-400 font-bold">ℹ️ UID LOG: </span>
            <span className="italic">“{systemMessage}”</span>
          </div>
        </div>
      </div>
    </div>
  );
}