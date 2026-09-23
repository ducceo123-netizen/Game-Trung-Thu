import { create } from 'zustand';
import { GamePhase, DialogueData, Achievement, QuestItem } from '../types/game';
import { sounds } from '../utils/soundEffects';
import { MULTIPLAYER_PLAYER_ID, MULTIPLAYER_ROOM_ID, supabase } from '../lib/supabase';

export type LanternShapeMode = 'portrait' | 'wide' | 'generic';

export const INITIAL_QUEST_ITEMS: QuestItem[] = [
  {
    id: 'mooncake_ticket_1',
    name: 'Mooncake Ticket 1',
    vietnameseName: 'BÁNH TRUNG THU BÍ MẬT #1',
    description: 'Bên trong có vé máy bay nội địa trị giá 3.000.000đ.',
    position: [-5.9, 0.55, 9.0],
    color: '#f59e0b',
    collected: false,
  },
  {
    id: 'mooncake_ticket_2',
    name: 'Mooncake Ticket 2',
    vietnameseName: 'BÁNH TRUNG THU BÍ MẬT #2',
    description: 'Bên trong có vé máy bay nội địa trị giá 3.000.000đ.',
    position: [5.9, 0.55, 2.0],
    color: '#fbbf24',
    collected: false,
  },
  {
    id: 'mooncake_ticket_3',
    name: 'Mooncake Ticket 3',
    vietnameseName: 'BÁNH TRUNG THU BÍ MẬT #3',
    description: 'Bên trong có vé máy bay nội địa trị giá 3.000.000đ.',
    position: [-5.8, 0.55, -8.2],
    color: '#fb923c',
    collected: false,
  },
];

const RANDOM_SYSTEM_MESSAGES = [
  'BTC: 3 bánh Trung Thu bí mật đang nằm đâu đó ở Lầu 2.',
  'Mỗi bánh bí mật có 1 vé máy bay nội địa trị giá 3.000.000đ.',
  'Workshop UID: up ảnh xong là có thể cầm lồng đèn đi chơi luôn.',
  'Nhấn F để bật/tắt lồng đèn cá nhân sau khi làm xong.',
  'Lầu 3 đang hơi... lạ. Nếu đèn chớp thì chạy nha.',
  'Thỏ vẫn đang chiếm booth xanh để họp.',
  'Team nào tìm thấy bánh nhớ hú, đừng âm thầm flex.',
  'Cầu thang lên Lầu 3 mở rồi. Gan thì lên.',
];

interface GameState {
  playerName: string;
  gamePhase: GamePhase;
  hasBambooPole: boolean;
  bambooPokeTrigger: number;
  activeDialogue: DialogueData | null;
  activeAchievement: Achievement | null;
  interactionPrompt: { text: string; action: () => void } | null;

  questItems: QuestItem[];
  collectedItemIds: string[];
  moonOnline: boolean;

  currentFloor: 2 | 3;
  playerPosition: [number, number, number];
  playerRotationY: number;
  foundAllMooncakes: boolean;
  onlineConnected: boolean;
  onlinePlayerCount: number;

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

  workshopOpen: boolean;
  personalLanternImage: string | null;
  personalLanternBuilt: boolean;
  personalLanternLit: boolean;
  personalLanternShapeMode: LanternShapeMode;
  playerHasLanternEquipped: boolean;

  booWarning: boolean;
  booActive: boolean;
  booCooldownUntil: number | null;
  teamAnnouncement: string | null;

  setPlayerName: (name: string) => void;
  setGamePhase: (phase: GamePhase) => void;
  setCurrentFloor: (floor: 2 | 3) => void;
  setPlayerPosition: (position: [number, number, number]) => void;
  setPlayerTransform: (position: [number, number, number], rotationY: number) => void;
  setOnlineConnected: (connected: boolean) => void;
  setOnlinePlayerCount: (count: number) => void;

  equipBambooPole: () => void;
  triggerBambooPoke: () => void;
  startDialogue: (dialogue: DialogueData) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;
  showAchievement: (achievement: Achievement) => void;
  clearAchievement: () => void;
  setInteractionPrompt: (prompt: { text: string; action: () => void } | null) => void;
  collectItem: (itemId: string) => Promise<void>;
  syncMooncakeClaim: (itemId: string, claimedName: string) => void;
  rebootMoonServer: () => void;

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
  setPersonalLanternShapeMode: (mode: LanternShapeMode) => void;
  buildPersonalLantern: () => void;
  lightPersonalLantern: () => void;
  togglePersonalLanternLight: () => void;
  equipPersonalLantern: () => void;

  triggerBooWarning: () => void;
  startBooChase: () => void;
  stopBooChase: () => void;
  setTeamAnnouncement: (message: string | null) => void;
}

let achievementTimer: ReturnType<typeof setTimeout> | null = null;
let beautyTimer: ReturnType<typeof setTimeout> | null = null;
let slowTimer: ReturnType<typeof setTimeout> | null = null;
let announcementTimer: ReturnType<typeof setTimeout> | null = null;

export const useGameStore = create<GameState>((set, get) => ({
  playerName: 'UID Player',
  gamePhase: 'start_overlay',
  hasBambooPole: false,
  bambooPokeTrigger: 0,
  activeDialogue: null,
  activeAchievement: null,
  interactionPrompt: null,

  questItems: INITIAL_QUEST_ITEMS,
  collectedItemIds: [],
  moonOnline: false,

  currentFloor: 2,
  playerPosition: [0, 0.5, 14],
  playerRotationY: Math.PI,
  foundAllMooncakes: false,
  onlineConnected: false,
  onlinePlayerCount: 1,

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
  systemMessage: 'UID Gò Dầu chuẩn bị vào Trung Thu...',

  workshopOpen: false,
  personalLanternImage: null,
  personalLanternBuilt: false,
  personalLanternLit: false,
  personalLanternShapeMode: 'generic',
  playerHasLanternEquipped: false,

  booWarning: false,
  booActive: false,
  booCooldownUntil: null,
  teamAnnouncement: null,

  setPlayerName: (name) => set({ playerName: name.trim() || 'UID Player' }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setCurrentFloor: (floor) => {
    if (floor === 2) {
      set({
        currentFloor: 2,
        booWarning: false,
        booActive: false,
        booCooldownUntil: Date.now() + 12000,
      });
      get().setTeamAnnouncement('✅ Xuống Lầu 2 an toàn — Boo bỏ cuộc rồi.');
    } else {
      set({ currentFloor: 3 });
      get().setTeamAnnouncement('👻 Đã lên Lầu 3. Nếu thấy tín hiệu lạ thì chạy về cầu thang!');
    }
  },
  setPlayerPosition: (position) => set({ playerPosition: position }),
  setPlayerTransform: (position, rotationY) => set({ playerPosition: position, playerRotationY: rotationY }),
  setOnlineConnected: (connected) => set({ onlineConnected: connected }),
  setOnlinePlayerCount: (count) => set({ onlinePlayerCount: Math.max(1, count) }),

  equipBambooPole: () => {
    sounds.playPickup();
    set({ hasBambooPole: true });
    get().showAchievement({
      id: 'bamboo_pole',
      title: 'ĐỒ NGHỀ BTC',
      subtitle: 'Nhận cây tre rồi. Giờ vừa săn bánh vừa đi nghịch lồng đèn.',
    });
  },

  triggerBambooPoke: () => {
    sounds.playBambooPoke();
    set((state) => ({ bambooPokeTrigger: state.bambooPokeTrigger + 1 }));
  },

  startDialogue: (dialogue) => {
    sounds.playBlip(520);
    set({ activeDialogue: { ...dialogue, currentLineIndex: 0 } });
  },

  advanceDialogue: () => {
    const activeDialogue = get().activeDialogue;
    if (!activeDialogue) return;
    sounds.playBlip(580);
    if (activeDialogue.currentLineIndex < activeDialogue.lines.length - 1) {
      set({ activeDialogue: { ...activeDialogue, currentLineIndex: activeDialogue.currentLineIndex + 1 } });
    } else {
      const onComplete = activeDialogue.onComplete;
      set({ activeDialogue: null });
      onComplete?.();
    }
  },

  closeDialogue: () => set({ activeDialogue: null }),

  showAchievement: (achievement) => {
    sounds.playAchievement();
    if (achievementTimer) clearTimeout(achievementTimer);
    set({ activeAchievement: achievement });
    achievementTimer = setTimeout(() => set({ activeAchievement: null }), 4500);
  },

  clearAchievement: () => set({ activeAchievement: null }),
  setInteractionPrompt: (prompt) => set({ interactionPrompt: prompt }),

  collectItem: async (itemId) => {
    const { collectedItemIds, questItems, playerName } = get();
    if (collectedItemIds.includes(itemId)) return;

    const { error } = await supabase
      .from('mooncake_claims')
      .insert({
        room_id: MULTIPLAYER_ROOM_ID,
        mooncake_id: itemId,
        claimed_by: MULTIPLAYER_PLAYER_ID,
        claimed_name: playerName,
      });

    if (error) {
      if (error.code === '23505') {
        const { data } = await supabase
          .from('mooncake_claims')
          .select('claimed_name')
          .eq('room_id', MULTIPLAYER_ROOM_ID)
          .eq('mooncake_id', itemId)
          .maybeSingle();

        get().syncMooncakeClaim(itemId, data?.claimed_name ?? 'Một đồng đội');
        get().showAchievement({
          id: `already_claimed_${itemId}`,
          title: '😵 CHẬM MỘT NHỊP',
          subtitle: `${data?.claimed_name ?? 'Có người'} đã tìm thấy bánh này trước bạn.`,
        });
        return;
      }

      get().showAchievement({
        id: `claim_error_${itemId}`,
        title: 'MẠNG ĐANG CHẬP CHỜN',
        subtitle: 'Chưa xác nhận được bánh này. Thử bấm E lại nha.',
      });
      return;
    }

    const item = questItems.find((q) => q.id === itemId);
    get().syncMooncakeClaim(itemId, playerName);
    sounds.playAchievement();
    get().showAchievement({
      id: `ticket_${itemId}`,
      title: '✈️ BẠN LÀ NGƯỜI TÌM THẤY BÁNH!',
      subtitle: `${item?.vietnameseName ?? 'Bánh Trung Thu'} — vé máy bay nội địa trị giá 3.000.000đ!`,
    });
  },

  syncMooncakeClaim: (itemId, claimedName) => {
    const { collectedItemIds, questItems } = get();
    if (collectedItemIds.includes(itemId)) return;

    const updatedIds = [...collectedItemIds, itemId];
    set({
      collectedItemIds: updatedIds,
      foundAllMooncakes: updatedIds.length >= 3,
      moonOnline: updatedIds.length >= 3,
      questItems: questItems.map((q) => q.id === itemId ? { ...q, collected: true } : q),
    });

    const number = itemId.split('_').pop() ?? String(updatedIds.length);
    get().setTeamAnnouncement(`🎉 ${claimedName} vừa tìm thấy bánh bí mật #${number}!`);

    if (updatedIds.length === 3) {
      setTimeout(() => get().showAchievement({
        id: 'all_mooncakes',
        title: '🏆 CẢ PHÒNG ĐÃ TÌM ĐỦ 3 BÁNH',
        subtitle: 'Ba vé máy bay nội địa 3.000.000đ đã có chủ!',
      }), 500);
    }
  },

  rebootMoonServer: () => set({ gamePhase: 'rebooting' }),

  applySalonpasHealing: () => {
    sounds.playBlip(320);
    set({ isSlowed: true });
    get().showAchievement({ id: 'salonpas', title: 'SALONPAS', subtitle: 'Cột sống được chữa lành trong 3 giây.' });
    if (slowTimer) clearTimeout(slowTimer);
    slowTimer = setTimeout(() => set({ isSlowed: false }), 3200);
  },

  triggerBeerCanRabbit: () => {
    sounds.playJump();
    set({ beerCanRabbitFled: true });
    get().showAchievement({ id: 'rabbit_quit', title: 'CON THỎ ĐÃ BỎ VIỆC', subtitle: 'Nó out nhóm không chào ai.' });
  },

  launchWaterBottle: () => {
    sounds.playRocket();
    set({ waterBottleLaunched: true });
    setTimeout(() => set({ waterBottleLaunched: false }), 4000);
  },

  openCardboardBox: () => {
    sounds.playBlip(380);
    set((state) => ({ boxLanternOpen: !state.boxLanternOpen }));
  },

  eatInstantNoodles: () => {
    sounds.playBlip(480);
    set((state) => ({ sodiumLevel: state.sodiumLevel + 12 }));
  },

  triggerKeyboardRGB: () => {
    sounds.playBlip(620);
    const values = ['ASDFGHJK', 'CTRL+Z', 'GIT PUSH -F', 'FINAL_REAL', 'ESCAPE'];
    set({ lastTypedKeys: values[Math.floor(Math.random() * values.length)] });
  },

  triggerBeautyFilter: () => {
    sounds.playAchievement();
    set({ isBeautyMode: true });
    if (beautyTimer) clearTimeout(beautyTimer);
    beautyTimer = setTimeout(() => set({ isBeautyMode: false }), 5000);
  },

  printOfficePaper: () => {
    sounds.playBlip(540);
    const labels = ['APPROVED', 'REJECTED', 'pls revise', 'final_v2', 'HOTFIX GẤP'];
    const text = labels[Math.floor(Math.random() * labels.length)];
    set((state) => ({
      printerPapers: [...state.printerPapers.slice(-8), {
        id: Date.now() + Math.random(),
        text,
        x: -4.5 + (Math.random() * 0.4 - 0.2),
        y: 0.2 + Math.random() * 0.2,
        z: 3.5 + (Math.random() * 0.4 - 0.2),
      }],
      printerJobCount: state.printerJobCount + 1,
    }));
  },

  interactRabbit: () => {
    const count = get().rabbitDialogCount;
    const messages = [
      'Thỏ đang bận.',
      'Thỏ đang họp.',
      'Thỏ hiện đang AFK.',
      'Thỏ: “Lên Lầu 3 đi rồi biết.”',
    ];
    set({ rabbitDialogCount: count + 1 });
    sounds.playBlip(700);
    return messages[count % messages.length];
  },

  cycleSystemMessage: () => {
    set({ systemMessage: RANDOM_SYSTEM_MESSAGES[Math.floor(Math.random() * RANDOM_SYSTEM_MESSAGES.length)] });
  },

  openWorkshop: () => set({ workshopOpen: true }),
  closeWorkshop: () => set({ workshopOpen: false }),
  setPersonalLanternImage: (image) => set({
    personalLanternImage: image,
    personalLanternBuilt: false,
    personalLanternLit: false,
    playerHasLanternEquipped: false,
  }),
  setPersonalLanternShapeMode: (mode) => set({ personalLanternShapeMode: mode }),

  buildPersonalLantern: () => {
    if (!get().personalLanternImage) return;
    sounds.playAchievement();
    set({
      personalLanternBuilt: true,
      personalLanternLit: true,
      playerHasLanternEquipped: true,
    });
    get().showAchievement({
      id: 'personal_lantern_built',
      title: '🏮 LỒNG ĐÈN CÁ NHÂN ĐÃ XONG',
      subtitle: 'Đèn đã được cầm trên tay. Nhấn F để bật/tắt sáng và đi vòng vòng chơi!',
    });
    get().setTeamAnnouncement(`🏮 ${get().playerName} vừa làm xong lồng đèn cá nhân!`);
  },

  lightPersonalLantern: () => {
    if (!get().personalLanternBuilt) return;
    set({ personalLanternLit: true, playerHasLanternEquipped: true });
  },

  togglePersonalLanternLight: () => {
    if (!get().personalLanternBuilt) return;
    const next = !get().personalLanternLit;
    sounds.playBlip(next ? 720 : 320);
    set({ personalLanternLit: next, playerHasLanternEquipped: true });
  },

  equipPersonalLantern: () => {
    if (get().personalLanternBuilt) set({ playerHasLanternEquipped: true });
  },

  triggerBooWarning: () => {
    if (get().currentFloor !== 3 || get().booActive || get().booWarning) return;
    set({ booWarning: true });
    sounds.playZap();
  },

  startBooChase: () => {
    if (get().currentFloor !== 3) return;
    set({ booWarning: false, booActive: true });
    get().setTeamAnnouncement('👻 BOO XUẤT HIỆN! CHẠY XUỐNG LẦU 2!');
  },

  stopBooChase: () => set({
    booWarning: false,
    booActive: false,
    booCooldownUntil: Date.now() + 15000,
  }),

  setTeamAnnouncement: (message) => {
    if (announcementTimer) clearTimeout(announcementTimer);
    set({ teamAnnouncement: message });
    if (message) {
      announcementTimer = setTimeout(() => set({ teamAnnouncement: null }), 5500);
    }
  },
}));