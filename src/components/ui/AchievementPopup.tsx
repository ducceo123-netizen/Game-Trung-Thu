import { useGameStore } from '../../stores/useGameStore';

export function AchievementPopup() {
  const achievement = useGameStore((s) => s.activeAchievement);
  const clearAchievement = useGameStore((s) => s.clearAchievement);

  if (!achievement) return null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none animate-bounce">
      <div className="bg-[#1e1b4b] border-2 border-yellow-400 shadow-2xl px-5 py-3 rounded-lg text-white font-mono flex items-center gap-3 max-w-md">
        <div className="text-3xl">🏆</div>
        <div>
          <div className="text-xs font-bold text-yellow-400 tracking-wider">
            + {achievement.title}
          </div>
          <div className="text-sm font-semibold text-slate-100">
            {achievement.subtitle}
          </div>
        </div>
        <button
          onClick={clearAchievement}
          className="ml-auto text-slate-400 hover:text-white text-xs cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
