import { useGameStore } from '../../stores/useGameStore';

export function InteractionPrompt() {
  const prompt = useGameStore((s) => s.interactionPrompt);

  if (!prompt) return null;

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none">
      <button
        onClick={prompt.action}
        className="group relative px-6 py-3 bg-[#c0c0c0] hover:bg-[#d8d8d8] text-slate-900 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 shadow-2xl active:translate-y-1 transition-transform cursor-pointer font-mono"
      >
        {/* Retro PS2 / Win98 chunky box frame */}
        <div className="flex items-center gap-2">
          <span className="bg-blue-800 text-yellow-300 px-2 py-0.5 font-bold text-xs rounded border border-blue-950">
            PHÍM E
          </span>
          <span className="font-extrabold text-sm sm:text-base tracking-wide text-slate-900 group-hover:text-blue-900">
            {prompt.text}
          </span>
        </div>
      </button>
    </div>
  );
}
