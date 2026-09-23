import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../stores/useGameStore';
import { sounds } from '../../utils/soundEffects';

export function EndingSequence() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (gamePhase !== 'rebooting') return;

    // Step 0: Lights shut off & electric zap
    sounds.playZap();

    const t1 = setTimeout(() => {
      // Step 1: Electrical sparks flicker
      setStep(1);
      sounds.playZap();
    }, 1800);

    const t2 = setTimeout(() => {
      // Step 2: MOON EXPLODES TO BLINDING BRIGHTNESS! Confetti!
      setStep(2);
      useGameStore.setState({ moonOnline: true });
      sounds.playMoonOnline();

      // Explode confetti cannons!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#facc15', '#f43f5e', '#06b6d4', '#22c55e', '#a855f7'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 800);
      } catch {}
    }, 3800);

    const t3 = setTimeout(() => {
      // Step 3: “HỆ THỐNG ĐÃ KHÔI PHỤC.” “TRUNG THU ĐÃ ONLINE.”
      setStep(3);
    }, 5500);

    const t4 = setTimeout(() => {
      // Step 4: [pause] “Ngày mai vẫn đi làm bình thường.” RẰM.exe MISSION COMPLETE
      setStep(4);
      sounds.playAchievement();
    }, 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [gamePhase]);

  if (gamePhase !== 'rebooting' && gamePhase !== 'game_won') return null;

  const handleContinuePlaying = () => {
    setGamePhase('playing');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto select-none p-4 font-mono">
      {/* Blackout / screen shake phase */}
      {step === 0 && (
        <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-red-500 animate-pulse">
          <div className="text-3xl sm:text-5xl font-extrabold tracking-widest">
            ⚡ ĐANG RESET NGUỒN ĐIỆN...
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Đang ngắt kết nối nồi lẩu cá thác lác khỏi server
          </p>
        </div>
      )}

      {/* Sparks flicker phase */}
      {step === 1 && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-cyan-400">
          <div className="text-3xl sm:text-4xl font-bold">
            🔌 ĐỒNG BỘ NGUỒN ÁNH TRĂNG...
          </div>
          <p className="text-sm text-yellow-300 mt-2">
            Cầu chì 10A đang gánh toàn bộ lễ hội!
          </p>
        </div>
      )}

      {/* Final Victory Sequences */}
      {step >= 2 && (
        <div className="w-full max-w-xl bg-[#c0c0c0] border-t-4 border-l-4 border-white border-b-4 border-r-4 border-slate-900 shadow-2xl p-2 text-slate-900">
          {/* Title Bar */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-4 py-2 flex items-center justify-between text-white font-bold">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌕</span>
              <span className="tracking-widest">RAM_EXE_SUCCESS.LOG</span>
            </div>
            <span className="text-xs bg-emerald-600 px-2 py-0.5 rounded">200 OK</span>
          </div>

          <div className="p-6 bg-white border-2 border-slate-600 mt-1 text-center space-y-4">
            <div className="text-4xl sm:text-5xl font-black text-amber-500 tracking-wider">
              🌕 TRUNG THU ĐÃ ONLINE! 🌕
            </div>

            <div className="bg-emerald-50 border border-emerald-300 p-3 rounded text-sm text-emerald-900 font-semibold space-y-1">
              <p>“HỆ THỐNG ĐÃ KHÔI PHỤC.”</p>
              <p>“Ánh trăng đã được phát sóng trực tiếp tới toàn thể nhân viên.”</p>
            </div>

            {step >= 4 && (
              <div className="pt-2 border-t border-slate-300 space-y-3">
                <p className="text-lg sm:text-xl font-bold text-red-600 italic">
                  “Ngày mai vẫn đi làm bình thường.”
                </p>

                <div className="inline-block bg-slate-900 text-yellow-300 px-4 py-2 rounded text-base font-extrabold tracking-widest">
                  RẰM.exe · MISSION COMPLETE
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleContinuePlaying}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm tracking-wider border-t-2 border-l-2 border-blue-400 border-b-2 border-r-2 border-blue-950 shadow-lg active:translate-y-1 cursor-pointer"
                  >
                    🏮 TIẾP TỤC ĐI DẠO & CHỌC LỒNG ĐÈN 🏮
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
