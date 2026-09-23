import { useGameStore } from '../../stores/useGameStore';

export function DialogueBox() {
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const advanceDialogue = useGameStore((s) => s.advanceDialogue);
  const closeDialogue = useGameStore((s) => s.closeDialogue);

  if (!activeDialogue) return null;

  const currentLine = activeDialogue.lines[activeDialogue.currentLineIndex] || '';
  const isLastLine = activeDialogue.currentLineIndex === activeDialogue.lines.length - 1;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 pointer-events-auto select-none font-mono">
      <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 shadow-2xl p-1 text-slate-900">
        {/* Title / Speaker Bar */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-3 py-1 flex items-center justify-between text-white font-bold text-sm">
          <div className="flex items-center gap-2">
            <span>🗣️</span>
            <span>{activeDialogue.speaker}</span>
          </div>
          <button
            onClick={closeDialogue}
            className="w-4 h-4 bg-[#c0c0c0] hover:bg-slate-300 text-slate-900 flex items-center justify-center text-xs font-bold border border-white cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Content Box */}
        <div className="p-4 bg-white border border-slate-400 mt-1 min-h-[90px] flex flex-col justify-between">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            {currentLine}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-2">
            <span className="text-[11px] text-slate-500">
              Trang {activeDialogue.currentLineIndex + 1} / {activeDialogue.lines.length}
            </span>
            <button
              onClick={advanceDialogue}
              className="px-4 py-1.5 bg-[#c0c0c0] hover:bg-slate-300 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 text-xs font-bold active:translate-y-0.5 cursor-pointer text-slate-900"
            >
              {isLastLine ? 'XONG [E / CLICK]' : 'TIẾP TỤC ➔'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
