import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { sounds } from '../../utils/soundEffects';

export function IntroSequence() {
  const [step, setStep] = useState(0);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  useEffect(() => {
    // Step 0: "23:47"
    sounds.playZap();
    const t1 = setTimeout(() => {
      setStep(1);
      sounds.playBlip(300);
    }, 1800);

    // Step 1: "Có đứa vừa cắm nồi lẩu vào ổ điện."
    const t2 = setTimeout(() => {
      setStep(2);
      sounds.playZap();
    }, 4200);

    // Step 2: "Mặt trăng đã mất kết nối."
    const t3 = setTimeout(() => {
      setStep(3);
      sounds.playAchievement();
    }, 6600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleSkipOrStart = () => {
    sounds.playBlip(500);
    setGamePhase('playing');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-white font-mono p-6 select-none">
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Step 0: 23:47 */}
        {step >= 0 && (
          <div className="animate-pulse">
            <span className="text-5xl sm:text-7xl font-bold tracking-widest text-red-500 font-mono">
              23:47
            </span>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">
              Đêm rằm tháng 8 · Tầng 7 Tòa nhà Công ty
            </p>
          </div>
        )}

        {/* Step 1: Có đứa vừa cắm nồi lẩu vào ổ điện */}
        {step >= 1 && (
          <div className="p-4 bg-red-950/40 border border-red-800 rounded-lg text-lg sm:text-xl font-semibold text-amber-200">
            “Có đứa vừa cắm nồi lẩu vào ổ điện.”
          </div>
        )}

        {/* Step 2: Mặt trăng đã mất kết nối */}
        {step >= 2 && (
          <div className="p-4 bg-slate-900 border-2 border-red-600 rounded-lg space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-red-400">
              ⚠️ MẶT TRĂNG ĐÃ MẤT KẾT NỐI
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Mã lỗi: CRITICAL_CIRCUIT_OVERLOAD_HOTPOT_ERR
            </p>
          </div>
        )}

        {/* Step 3: NHIỆM VỤ: KHỞI ĐỘNG LẠI TRUNG THU */}
        {step >= 3 && (
          <div className="pt-4 space-y-6 animate-bounce">
            <div className="bg-yellow-400 text-slate-950 px-6 py-4 rounded-lg font-extrabold text-xl sm:text-2xl shadow-xl">
              🏮 NHIỆM VỤ: KHỞI ĐỘNG LẠI TRUNG THU 🏮
            </div>
            <p className="text-sm text-yellow-200">
              Tiến lại gần Chú Bảo Vệ để nhận vũ khí tối thượng!
            </p>
            <button
              onClick={handleSkipOrStart}
              className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-base tracking-wider rounded border-t-2 border-l-2 border-blue-400 border-b-2 border-r-2 border-blue-950 shadow-lg active:translate-y-1 cursor-pointer"
            >
              VÀO GAME NGAY ➔
            </button>
          </div>
        )}
      </div>

      {/* Skip button in corner */}
      {step < 3 && (
        <button
          onClick={handleSkipOrStart}
          className="absolute bottom-6 right-6 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-600 rounded cursor-pointer"
        >
          [Bỏ qua đoạn mở đầu ➔]
        </button>
      )}
    </div>
  );
}
