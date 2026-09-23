import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';

export function GameOverOverlay() {
  const isDead = useGameStore((s) => s.isDead);
  const respawnAt = useGameStore((s) => s.respawnAt);
  const respawnPlayer = useGameStore((s) => s.respawnPlayer);
  const [remaining, setRemaining] = useState(60);

  useEffect(() => {
    if (!isDead || !respawnAt) return;

    const update = () => {
      const seconds = Math.max(0, Math.ceil((respawnAt - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds <= 0) respawnPlayer();
    };

    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [isDead, respawnAt, respawnPlayer]);

  if (!isDead) return null;

  return (
    <div className="absolute inset-0 z-[95] bg-red-950/72 backdrop-blur-[2px] flex items-center justify-center pointer-events-auto">
      <div className="w-full max-w-md mx-4 bg-slate-950 border-4 border-red-600 text-center p-6 font-mono shadow-2xl">
        <div className="text-red-400 text-5xl font-black tracking-widest mb-2">GAME OVER</div>
        <div className="text-slate-200 text-sm mb-5">
          Bạn vừa bị đồng nghiệp đập bằng lồng đèn.
        </div>
        <div className="text-yellow-300 text-2xl font-black mb-2">
          HỒI SINH SAU {remaining}s
        </div>
        <div className="h-2 bg-slate-800 border border-slate-600 overflow-hidden">
          <div
            className="h-full bg-red-500 transition-[width] duration-200"
            style={{ width: `${Math.max(0, Math.min(100, ((60 - remaining) / 60) * 100))}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-400 mt-4">
          Hồi sinh tại Lầu 2 • vẫn giữ lồng đèn đã làm
        </div>
      </div>
    </div>
  );
}
