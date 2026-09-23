/**
 * RẰM.exe - “Một đêm Trung Thu không được QA.”
 * Playable 3D Mid-Autumn Festival Office Comedy Prototype
 */

import { useState } from 'react';
import { GameScene } from './components/3d/GameScene';
import { StartOverlay } from './components/ui/StartOverlay';
import { IntroSequence } from './components/ui/IntroSequence';
import { RetroHUD } from './components/ui/RetroHUD';
import { InteractionPrompt } from './components/ui/InteractionPrompt';
import { DialogueBox } from './components/ui/DialogueBox';
import { AchievementPopup } from './components/ui/AchievementPopup';
import { EndingSequence } from './components/ui/EndingSequence';
import { MobileControls } from './components/ui/MobileControls';
import { LanternWorkshopModal } from './components/ui/LanternWorkshopModal';
import { GameOverOverlay } from './components/ui/GameOverOverlay';
import { SocialPostModal } from './components/ui/SocialPostModal';
import { useGameStore } from './stores/useGameStore';

export default function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <main className="w-screen h-screen relative bg-slate-950 overflow-hidden font-sans select-none">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <GameScene />
      </div>

      {/* Subtle CRT Retro Scanlines Overlay */}
      <div className="absolute inset-0 scanlines z-10 pointer-events-none opacity-40" />

      {/* HUD & In-game Overlays (visible during playing & ending) */}
      {(gamePhase === 'playing' || gamePhase === 'rebooting' || gamePhase === 'game_won') && (
        <>
          <RetroHUD />
          <InteractionPrompt />
          <DialogueBox />
          <AchievementPopup />
          <MobileControls />

          {/* Quick Help Toggle in bottom-left */}
          <div className="absolute bottom-3 left-3 z-40 hidden sm:block">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded text-xs font-mono cursor-pointer shadow"
            >
              {showHelp ? '✕ ĐÓNG HƯỚNG DẪN' : '❓ PHÍM ĐIỀU KHIỂN'}
            </button>

            {showHelp && (
              <div className="mt-1 p-3 bg-slate-900/95 border border-slate-700 text-slate-200 text-xs font-mono rounded shadow-2xl space-y-1.5 max-w-xs backdrop-blur-md">
                <div className="font-bold text-yellow-400 border-b border-slate-700 pb-1">
                  BẢNG PHÍM ĐIỀU KHIỂN:
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span>WASD / Mũi tên:</span>
                  <span className="text-cyan-300">Di chuyển</span>
                  <span>Shift:</span>
                  <span className="text-cyan-300">Chạy nhanh</span>
                  <span>Space:</span>
                  <span className="text-cyan-300">Nhảy</span>
                  <span>Phím E / Click:</span>
                  <span className="text-cyan-300">Tương tác</span>
                  <span>Phím F:</span>
                  <span className="text-cyan-300">Bật / tắt lồng đèn</span>
                  <span>Click trái / J:</span>
                  <span className="text-cyan-300">Đánh bằng lồng đèn</span>
                  <span>Di chuột:</span>
                  <span className="text-cyan-300">Xoay hướng realtime</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <LanternWorkshopModal />
      <GameOverOverlay />
      <SocialPostModal />

      {/* Phase 1: Player Name Start Overlay */}
      {gamePhase === 'start_overlay' && <StartOverlay />}

      {/* Phase 2: Dramatic Intro Story Sequence */}
      {gamePhase === 'intro_story' && <IntroSequence />}

      {/* Phase 4: Ending Victory Sequence */}
      {(gamePhase === 'rebooting' || gamePhase === 'game_won') && <EndingSequence />}
    </main>
  );
}