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
  setPersonalLanternText: (text) => set({
    personalLanternText: text.slice(0, 42),
    personalLanternBuilt: false,
  }),
  setPersonalLanternShapeMode: (mode) => set({ personalLanternShapeMode: mode }),

  buildPersonalLantern: () => {
    if (!get().personalLanternImage && !get().personalLanternText.trim()) return;
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

  openSocialPost: () => {
    const firstView = !get().socialPostSeen;
    set({ socialPostOpen: true, socialPostSeen: true });
    if (firstView) {
      get().showAchievement({
        id: 'uid_social_checkin',
        title: '📺 UID SOCIAL SCREEN',
        subtitle: 'Bạn có thể up ảnh/meme vào carousel hoặc takeover màn hình bằng ảnh của mình.',
      });
    }
  },

  closeSocialPost: () => set({ socialPostOpen: false }),
}));