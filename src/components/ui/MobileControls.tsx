import { useGameStore } from '../../stores/useGameStore';
import { sounds } from '../../utils/soundEffects';

export function MobileControls() {
  const triggerBambooPoke = useGameStore((s) => s.triggerBambooPoke);
  const hasBambooPole = useGameStore((s) => s.hasBambooPole);
  const interactionPrompt = useGameStore((s) => s.interactionPrompt);

  const simulateKey = (code: string, isDown: boolean) => {
    window.dispatchEvent(
      new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
        code,
        bubbles: true,
      })
    );
  };

  return (
    <div className="md:hidden absolute bottom-3 inset-x-3 pointer-events-none z-40 flex justify-between items-end select-none font-mono">
      {/* Virtual D-Pad */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1 w-32 h-32 bg-slate-900/60 p-1 rounded-xl backdrop-blur-sm border border-slate-700/50">
        <div />
        <button
          onTouchStart={() => simulateKey('KeyW', true)}
          onTouchEnd={() => simulateKey('KeyW', false)}
          onMouseDown={() => simulateKey('KeyW', true)}
          onMouseUp={() => simulateKey('KeyW', false)}
          className="bg-slate-800 text-white active:bg-slate-600 rounded flex items-center justify-center font-bold text-lg"
        >
          ▲
        </button>
        <div />
        <button
          onTouchStart={() => simulateKey('KeyA', true)}
          onTouchEnd={() => simulateKey('KeyA', false)}
          onMouseDown={() => simulateKey('KeyA', true)}
          onMouseUp={() => simulateKey('KeyA', false)}
          className="bg-slate-800 text-white active:bg-slate-600 rounded flex items-center justify-center font-bold text-lg"
        >
          ◀
        </button>
        <button
          onTouchStart={() => simulateKey('KeyS', true)}
          onTouchEnd={() => simulateKey('KeyS', false)}
          onMouseDown={() => simulateKey('KeyS', true)}
          onMouseUp={() => simulateKey('KeyS', false)}
          className="bg-slate-800 text-white active:bg-slate-600 rounded flex items-center justify-center font-bold text-lg"
        >
          ▼
        </button>
        <button
          onTouchStart={() => simulateKey('KeyD', true)}
          onTouchEnd={() => simulateKey('KeyD', false)}
          onMouseDown={() => simulateKey('KeyD', true)}
          onMouseUp={() => simulateKey('KeyD', false)}
          className="bg-slate-800 text-white active:bg-slate-600 rounded flex items-center justify-center font-bold text-lg"
        >
          ▶
        </button>
      </div>

      {/* Action Buttons: Jump, Interact, Poke */}
      <div className="pointer-events-auto flex flex-col gap-2 items-end">
        {hasBambooPole && (
          <button
            onClick={() => triggerBambooPoke()}
            className="w-14 h-14 bg-emerald-600 active:bg-emerald-700 text-white rounded-full font-bold shadow-lg flex items-center justify-center border-2 border-emerald-300 text-xl"
            title="Chọc lồng đèn"
          >
            🎋
          </button>
        )}

        <div className="flex gap-2">
          {interactionPrompt && (
            <button
              onClick={() => interactionPrompt.action()}
              className="w-14 h-14 bg-yellow-500 active:bg-yellow-600 text-slate-950 rounded-full font-bold text-sm shadow-lg flex items-center justify-center border-2 border-yellow-200"
            >
              [E]
            </button>
          )}

          <button
            onTouchStart={() => {
              simulateKey('Space', true);
              sounds.playJump();
            }}
            onTouchEnd={() => simulateKey('Space', false)}
            onMouseDown={() => {
              simulateKey('Space', true);
              sounds.playJump();
            }}
            onMouseUp={() => simulateKey('Space', false)}
            className="w-14 h-14 bg-blue-600 active:bg-blue-700 text-white rounded-full font-bold text-xs shadow-lg flex items-center justify-center border-2 border-blue-300"
          >
            NHẢY
          </button>
        </div>
      </div>
    </div>
  );
}
