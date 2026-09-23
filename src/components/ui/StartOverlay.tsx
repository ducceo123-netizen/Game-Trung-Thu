import { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { sounds } from '../../utils/soundEffects';

export function StartOverlay() {
  const [nameInput, setNameInput] = useState('');
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = nameInput.trim() || 'Dev Quèn';
    setPlayerName(finalName);
    sounds.playBlip(540);
    // Proceed to dramatic intro sequence
    setGamePhase('intro_story');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      {/* Windows 98 / PS2 Retro Window Box */}
      <div className="w-full max-w-lg bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 shadow-2xl p-1 text-slate-900 font-sans">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-3 py-1 flex items-center justify-between text-white font-bold select-none">
          <div className="flex items-center gap-2">
            <span className="text-yellow-300">🏮</span>
            <span className="tracking-wider text-sm font-mono">RAM_EXE_INSTALLER.BAT</span>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-[#c0c0c0] text-slate-900 flex items-center justify-center text-xs font-bold border border-white">_</div>
            <div className="w-4 h-4 bg-[#c0c0c0] text-slate-900 flex items-center justify-center text-xs font-bold border border-white">×</div>
          </div>
        </div>

        {/* Window Content */}
        <div className="p-6 bg-[#dfdfdf] border border-slate-400 mt-1">
          {/* Logo / Title */}
          <div className="text-center mb-6">
            <div className="inline-block bg-black px-4 py-2 border-2 border-yellow-400 shadow-inner mb-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-widest text-yellow-400 font-mono">
                RẰM.exe
              </h1>
            </div>
            <p className="text-base sm:text-lg font-bold text-red-700 italic mt-1 font-mono">
              “3 bánh • 3 vé máy bay • một Lầu 3 không nên lên một mình.”
            </p>
            <p className="text-xs text-slate-600 mt-2 font-mono">
              Phiên bản: Build 15.08.PROD (Hotfix lúc 23:45)
            </p>
            <p className="text-xs text-blue-800 mt-1 font-mono font-bold">
              📍 ĐỊA ĐIỂM: LẦU 2 • VĂN PHÒNG GÒ DẦU
            </p>
          </div>

          {/* Lore description box */}
          <div className="bg-white border-2 border-inset border-slate-600 p-3 text-xs leading-relaxed text-slate-800 mb-6 font-mono">
            <p className="font-bold text-red-600 mb-1">UID GÒ DẦU • HỘI THI LỒNG ĐÈN THỦ CÔNG:</p>
            <p>
              BTC đã giấu 3 bánh Trung Thu bí mật ở Lầu 2. Mỗi bánh chứa một vé máy bay nội địa trị giá 3.000.000đ.
              Bạn có thể up ảnh làm lồng đèn riêng, cầm đi vòng vòng và bật sáng. Cầu thang lên Lầu 3 đã mở — nhưng Boo có thể xuất hiện bất kỳ lúc nào.
            </p>
          </div>

          {/* Name input form */}
          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                Tên đồng chí (Nhập họ tên hoặc chức vụ):
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="VD: Dev Quèn / Lead Cay Đắng / Intern..."
                maxLength={24}
                autoFocus
                className="w-full px-3 py-2 bg-white border-2 border-inset border-slate-700 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Quick preset name buttons */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="text-slate-500 self-center">Gợi ý:</span>
              {['Dev Quèn', 'Tester Khó Tính', 'PM Hối Deadline', 'Designer OT'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setNameInput(preset)}
                  className="px-2 py-0.5 bg-[#c0c0c0] hover:bg-slate-300 border border-slate-500 text-slate-800 active:translate-y-0.5"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Launch button */}
            <div className="pt-2 text-center">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-red-700 hover:bg-red-800 text-yellow-300 font-bold font-mono text-lg tracking-widest border-t-2 border-l-2 border-red-400 border-b-2 border-r-2 border-red-950 shadow-lg active:translate-y-1 transition-transform cursor-pointer"
              >
                🌕 SĂN BÁNH & LÀM LỒNG ĐÈN 🏮
              </button>
            </div>
          </form>

          {/* Footer Controls summary */}
          <div className="mt-4 pt-3 border-t border-slate-400 text-center text-[11px] text-slate-600 font-mono">
            WASD di chuyển · chuột xoay hướng · E tương tác · F bật/tắt lồng đèn · Shift chạy
          </div>
        </div>
      </div>
    </div>
  );
}