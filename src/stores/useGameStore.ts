import { create } from 'zustand';
import { GamePhase, DialogueData, Achievement, QuestItem } from '../types/game';
import { sounds } from '../utils/soundEffects';

export const INITIAL_QUEST_ITEMS: QuestItem[] = [
  {
    id: 'extension_cord',
    name: 'Ổ cắm điện Lioa 10m',
    vietnameseName: 'Ổ CẮM LIOA DÂY CAM',
    description: 'Chống cháy nổ tạm thời, quấn băng keo đen 3 vòng.',
    position: [6.5, 0.45, 9.5],
    color: '#ff6600',
    collected: false,
  },
  {
    id: 'glue_gun',
    name: 'Súng bắn keo silicon 60W',
    vietnameseName: 'SÚNG BẮN KEO CÔNG SỞ',
    description: 'Nóng chảy mọi linh kiện, dính liền mọi rạn nứt deadline.',
    position: [-6.8, 0.5, -1.5],
    color: '#00e5ff',
    collected: false,
  },
  {
    id: 'led_controller',
    name: 'Remote điều khiển LED RGB',
    vietnameseName: 'REMOTE LED TÀU 12 NÚT',
    description: 'Bấm nút "STROBE" để tạo ảo giác tiệc tùng công ty.',
    position: [4.8, 0.65, -8.5],
    color: '#ff00aa',
    collected: false,
  },
];

const RANDOM_SYSTEM_MESSAGES = [
  'Chị Hằng đang reconnect...',
  'Đồng bộ ánh trăng thất bại. Mã lỗi: ERR_NO_LAU_ALLOWED',
  'Hot glue gun temperature: 185°C (Nguy hiểm)',
  'Design đang chờ Sếp approve lần 8...',
  'Đang tải Trung Thu... 99% (Stuck)',
  'Không tìm thấy file final_final_REAL.psd',
  'Thông báo: Ai rút phích cắm nồi lẩu xin vui lòng nhận lỗi',
  'Server Mặt Trăng: 404 Moon Not Found',
  'Chú Cuội đang kẹt trên xe ôm công nghệ',
  'Team QA: Tính năng "Trăng Rằm" chưa được test trên Production!',
];

interface GameState {
  playerName: string;
  gamePhase: GamePhase;
  hasBambooPole: boolean;
  bambooPokeTrigger: number;
  activeDialogue: DialogueData | null;
  activeAchievement: Achievement | null;
  interactionPrompt: { text: string; action: () => void } | null;
  
  // Quest
  questItems: QuestItem[];
  collectedItemIds: string[];
  moonOnline: boolean;
  
  // Buffs / Debuffs / Gags
  isBeautyMode: boolean;
  isSlowed: boolean;
  sodiumLevel: number;
  rabbitDialogCount: number;
  beerCanRabbitFled: boolean;
  waterBottleLaunched: boolean;
  boxLanternOpen: boolean;
  printerPapers: Array<{ id: number; text: string; x: number; y: number; z: number }>;
  printerJobCount: number;
  lastTypedKeys: string;
  systemMessage: string;

  // Personal lantern workshop
  workshopOpen: boolean;
  personalLanternImage: string | null;
  personalLanternBuilt: boolean;
  personalLanternLit: boolean;

  // Actions
  setPlayerName: (name: string) => void;
  setGamePhase: (phase: GamePhase) => void;
  equipBambooPole: () => void;
  triggerBambooPoke: () => void;
  startDialogue: (dialogue: DialogueData) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;
  showAchievement: (achievement: Achievement) => void;
  clearAchievement: () => void;
  setInteractionPrompt: (prompt: { text: string; action: () => void } | null) => void;
  collectItem: (itemId: string) => void;
  rebootMoonServer: () => void;
  
  // Lantern effects
  applySalonpasHealing: () => void;
  triggerBeerCanRabbit: () => void;
  launchWaterBottle: () => void;
  openCardboardBox: () => void;
  eatInstantNoodles: () => void;
  triggerKeyboardRGB: () => void;
  triggerBeautyFilter: () => void;
  printOfficePaper: () => void;
  interactRabbit: () => string;
  cycleSystemMessage: () => void;
  openWorkshop: () => void;
  closeWorkshop: () => void;
  setPersonalLanternImage: (image: string | null) => void;
  buildPersonalLantern: () => void;
  lightPersonalLantern: () => void;
}

let achievementTimer: ReturnType<typeof setTimeout> | null = null;
let beautyTimer: ReturnType<typeof setTimeout> | null = null;
let slowTimer: ReturnType<typeof setTimeout> | null = null;

export const useGameStore = create<GameState>((set, get) => ({
  playerName: 'Dev Quèn',
  gamePhase: 'start_overlay',
  hasBambooPole: false,
  bambooPokeTrigger: 0,
  activeDialogue: null,
  activeAchievement: null,
  interactionPrompt: null,

  questItems: INITIAL_QUEST_ITEMS,
  collectedItemIds: [],
  moonOnline: false,

  isBeautyMode: false,
  isSlowed: false,
  sodiumLevel: 0,
  rabbitDialogCount: 0,
  beerCanRabbitFled: false,
  waterBottleLaunched: false,
  boxLanternOpen: false,
  printerPapers: [],
  printerJobCount: 0,
  lastTypedKeys: '',
  systemMessage: 'Hệ thống chuẩn bị vào ca trực đêm...',

  workshopOpen: false,
  personalLanternImage: null,
  personalLanternBuilt: false,
  personalLanternLit: false,

  setPlayerName: (name: string) => set({ playerName: name.trim() || 'Dev Quèn' }),
  setGamePhase: (phase: GamePhase) => set({ gamePhase: phase }),

  equipBambooPole: () => {
    sounds.playPickup();
    set({ hasBambooPole: true });
    get().showAchievement({
      id: 'bamboo_pole',
      title: 'VŨ KHÍ THƯỢNG HẠNG',
      subtitle: 'Đã nhận Cây Tre Huyền Thoại (Còn đúng 1 cây)',
    });
  },

  triggerBambooPoke: () => {
    sounds.playBambooPoke();
    set((state) => ({ bambooPokeTrigger: state.bambooPokeTrigger + 1 }));
  },

  startDialogue: (dialogue: DialogueData) => {
    sounds.playBlip(520);
    set({ activeDialogue: { ...dialogue, currentLineIndex: 0 } });
  },

  advanceDialogue: () => {
    const { activeDialogue } = get();
    if (!activeDialogue) return;

    sounds.playBlip(580);
    if (activeDialogue.currentLineIndex < activeDialogue.lines.length - 1) {
      set({
        activeDialogue: {
          ...activeDialogue,
          currentLineIndex: activeDialogue.currentLineIndex + 1,
        },
      });
    } else {
      const onComplete = activeDialogue.onComplete;
      set({ activeDialogue: null });
      if (onComplete) onComplete();
    }
  },

  closeDialogue: () => {
    set({ activeDialogue: null });
  },

  showAchievement: (achievement: Achievement) => {
    sounds.playAchievement();
    if (achievementTimer) clearTimeout(achievementTimer);
    set({ activeAchievement: achievement });
    achievementTimer = setTimeout(() => {
      set({ activeAchievement: null });
    }, 4500);
  },

  clearAchievement: () => {
    set({ activeAchievement: null });
  },

  setInteractionPrompt: (prompt) => set({ interactionPrompt: prompt }),

  collectItem: (itemId: string) => {
    const { collectedItemIds, questItems, showAchievement } = get();
    if (collectedItemIds.includes(itemId)) return;

    sounds.playPickup();
    const updatedIds = [...collectedItemIds, itemId];
    const item = questItems.find((q) => q.id === itemId);

    set({
      collectedItemIds: updatedIds,
      questItems: questItems.map((q) => (q.id === itemId ? { ...q, collected: true } : q)),
    });

    showAchievement({
      id: `collect_${itemId}`,
      title: `LINH KIỆN TRUNG THU (${updatedIds.length}/3)`,
      subtitle: item ? `Nhặt được: ${item.vietnameseName}` : 'Đã nhặt linh kiện!',
    });
  },

  rebootMoonServer: () => {
    set({ gamePhase: 'rebooting' });
  },

  applySalonpasHealing: () => {
    sounds.playBlip(320);
    set({ isSlowed: true });
    get().showAchievement({
      id: 'salonpas',
      title: 'THÀNH TỰU MỚI',
      subtitle: 'Đau lưng vì deadline - Cột sống được chữa lành 3 giây',
    });
    if (slowTimer) clearTimeout(slowTimer);
    slowTimer = setTimeout(() => {
      set({ isSlowed: false });
    }, 3200);
  },

  triggerBeerCanRabbit: () => {
    sounds.playJump();
    set({ beerCanRabbitFled: true });
    get().showAchievement({
      id: 'rabbit_quit',
      title: 'BIẾN CỐ NHÂN SỰ',
      subtitle: 'CON THỎ ĐÃ BỎ VIỆC (Out nhóm Zalo không chào ai)',
    });
  },

  launchWaterBottle: () => {
    sounds.playRocket();
    set({ waterBottleLaunched: true });
    setTimeout(() => {
      set({ waterBottleLaunched: false });
    }, 4000);
  },

  openCardboardBox: () => {
    sounds.playBlip(380);
    set((state) => ({ boxLanternOpen: !state.boxLanternOpen }));
  },

  eatInstantNoodles: () => {
    sounds.playBlip(480);
    set((state) => ({ sodiumLevel: state.sodiumLevel + 12 }));
    get().showAchievement({
      id: 'sodium_boost',
      title: 'NẠP DINH DƯỠNG DEV',
      subtitle: `Bạn vừa nhận 12mg sodium. Tổng nạp: ${get().sodiumLevel}mg!`,
    });
  },

  triggerKeyboardRGB: () => {
    sounds.playBlip(620);
    const keys = ['ASDFGHJK', 'CTRL+Z', 'GIT PUSH -F', 'WIP_FIX_FINAL', 'BUG_FEATURE_X', 'ESCAPE'];
    const pick = keys[Math.floor(Math.random() * keys.length)];
    set({ lastTypedKeys: pick });
  },

  triggerBeautyFilter: () => {
    sounds.playAchievement();
    set({ isBeautyMode: true });
    if (beautyTimer) clearTimeout(beautyTimer);
    beautyTimer = setTimeout(() => {
      set({ isBeautyMode: false });
    }, 5000);
  },

  printOfficePaper: () => {
    sounds.playBlip(540);
    const labels = ['APPROVED', 'REJECTED', 'pls revise', 'final_v2', 'HOTFIX GẤP', 'KÝ TÊN Ở ĐÂY'];
    const text = labels[Math.floor(Math.random() * labels.length)];
    const newPaper = {
      id: Date.now() + Math.random(),
      text,
      x: -4.5 + (Math.random() * 0.4 - 0.2),
      y: 0.2 + Math.random() * 0.2,
      z: 3.5 + (Math.random() * 0.4 - 0.2),
    };
    set((state) => ({
      printerPapers: [...state.printerPapers.slice(-8), newPaper],
      printerJobCount: state.printerJobCount ? state.printerJobCount + 1 : 1,
    }));
  },

  interactRabbit: () => {
    const { rabbitDialogCount } = get();
    sounds.playBlip(700);
    const msgs = [
      'Thỏ đang bận (Đang trả lời tin nhắn sếp)',
      'Thỏ đang họp (Meeting 3 tiếng không có agenda)',
      'Thỏ hiện đang AFK (Đã biến mất khỏi văn phòng)',
      'Thỏ: "Deadline dí quá đừng chọc em nữa!"',
    ];
    const msg = msgs[rabbitDialogCount % msgs.length];
    set({ rabbitDialogCount: rabbitDialogCount + 1 });
    return msg;
  },

  cycleSystemMessage: () => {
    const pick = RANDOM_SYSTEM_MESSAGES[Math.floor(Math.random() * RANDOM_SYSTEM_MESSAGES.length)];
    set({ systemMessage: pick });
  },

  openWorkshop: () => set({ workshopOpen: true }),
  closeWorkshop: () => set({ workshopOpen: false }),
  setPersonalLanternImage: (image: string | null) =>
    set({ personalLanternImage: image, personalLanternBuilt: false, personalLanternLit: false }),
  buildPersonalLantern: () => {
    if (!get().personalLanternImage) return;
    sounds.playAchievement();
    set({ personalLanternBuilt: true, personalLanternLit: false });
    get().showAchievement({
      id: 'personal_lantern_built',
      title: 'LỒNG ĐÈN CÁ NHÂN ĐÃ XONG',
      subtitle: 'Đã xong! Đi theo bảng → KHU THẮP SÁNG và bấm E để bật đèn.',
    });
  },
  lightPersonalLantern: () => {
    if (!get().personalLanternBuilt) return;
    sounds.playAchievement();
    set({ personalLanternLit: true });
    get().showAchievement({
      id: 'personal_lantern_lit',
      title: 'THẮP ĐÈN THÀNH CÔNG ✨',
      subtitle: 'Lồng đèn của bạn đã sáng tại khu showcase UID Gò Dầu! ✨',
    });
  },
}));