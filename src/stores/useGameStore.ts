
  currentFloor: 1,
  playerPosition: [0, 0.5, 10],
  playerRotationY: Math.PI,
  foundAllMooncakes: false,
  onlineConnected: false,
  onlinePlayerCount: 1,

  health: 100,
  maxHealth: 100,
  isDead: false,
  respawnAt: null,
  respawnNonce: 0,
  damageTick: 0,
  lanternAttackTrigger: 0,

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
  personalLanternText: '',
  personalLanternBuilt: false,
  personalLanternLit: false,
  personalLanternShapeMode: 'generic',
  playerHasLanternEquipped: false,

  booWarning: false,
  booActive: false,
  booCooldownUntil: null,
  teamAnnouncement: null,

  socialPostOpen: false,
  socialPostSeen: false,

  setPlayerName: (name) => set({ playerName: name.trim() || 'UID Player' }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setCurrentFloor: (floor) => {
    if (floor === 1) {
      set({
        currentFloor: 1,
        booWarning: false,
        booActive: false,
        booCooldownUntil: Date.now() + 12000,
      });
      get().setTeamAnnouncement('🏢 Đã xuống Lầu 1 • sảnh UID Gò Dầu.');
      return;
    }

    if (floor === 2) {
      set({
        currentFloor: 2,
        booWarning: false,
        booActive: false,
        booCooldownUntil: Date.now() + 12000,
      });
      get().setTeamAnnouncement('🏮 Đã lên Lầu 2 • khu Trung Thu UID.');
      return;
    }

    set({ currentFloor: 3 });
    get().setTeamAnnouncement('👻 Đã lên Lầu 3. Nếu thấy tín hiệu lạ thì chạy về cầu thang!');
  },
  setPlayerPosition: (position) => set({ playerPosition: position }),
  setPlayerTransform: (position, rotationY) => set({ playerPosition: position, playerRotationY: rotationY }),
  setOnlineConnected: (connected) => set({ onlineConnected: connected }),
  setOnlinePlayerCount: (count) => set({ onlinePlayerCount: Math.max(1, count) }),

  attackWithLantern: () => {
    const state = get();
    const equipped = useEconomyStore.getState().equippedItem;
    const hasCombatItem = state.personalLanternBuilt || equipped === 'sword' || equipped === 'blaster';
    if (state.currentFloor === 1 || !hasCombatItem || state.isDead || state.workshopOpen || state.socialPostOpen || state.gamePhase !== 'playing') return;

    const now = Date.now();
    const cooldown = equipped === 'blaster' ? 420 : equipped === 'sword' ? 560 : 700;
    if (now - lastLanternAttackAt < cooldown) return;
    lastLanternAttackAt = now;

    const weapon = equipped === 'sword' ? 'sword' : equipped === 'blaster' ? 'blaster' : 'lantern';
    const damage = weapon === 'sword' ? 35 : weapon === 'blaster' ? 20 : 25;
    const range = weapon === 'sword' ? 2.2 : weapon === 'blaster' ? 10.0 : 1.85;

    sounds.playBambooPoke();
    set((s) => ({ lanternAttackTrigger: s.lanternAttackTrigger + 1 }));

    broadcastCombatAttack({
      id: `${MULTIPLAYER_PLAYER_ID}-${now}`,
      attackerId: MULTIPLAYER_PLAYER_ID,
      attackerName: state.playerName,
      floor: state.currentFloor,
      x: state.playerPosition[0],
      y: state.playerPosition[1],
      z: state.playerPosition[2],
      rotationY: state.playerRotationY,
      damage,
      range,
      weapon,
      createdAt: now,
    });
  },

  receiveCombatAttack: (payload) => {
    const state = get();
    if (payload.attackerId === MULTIPLAYER_PLAYER_ID) return;
    if (state.isDead || payload.floor !== state.currentFloor) return;
    if (Date.now() - payload.createdAt > 1800) return;

    const dx = state.playerPosition[0] - payload.x;
    const dz = state.playerPosition[2] - payload.z;
    const distance = Math.hypot(dx, dz);
    if (distance > Math.max(1.5, payload.range ?? 1.85) || distance < 0.01) return;

    const inv = 1 / distance;
    const toTargetX = dx * inv;
    const toTargetZ = dz * inv;
    const forwardX = Math.sin(payload.rotationY);
    const forwardZ = Math.cos(payload.rotationY);
    const facingDot = forwardX * toTargetX + forwardZ * toTargetZ;

    if (facingDot < (payload.weapon === 'blaster' ? 0.45 : 0.1)) return;
    get().applyDamage(payload.damage, payload.attackerName);
  },

  applyDamage: (amount, attackerName) => {
    const state = get();
    if (state.isDead) return;

    const nextHealth = Math.max(0, state.health - Math.max(1, amount));
    const dead = nextHealth <= 0;

    set((s) => ({
      health: nextHealth,
      damageTick: s.damageTick + 1,
      isDead: dead,
      respawnAt: dead ? Date.now() + 60000 : s.respawnAt,
      interactionPrompt: dead ? null : s.interactionPrompt,
      booActive: dead ? false : s.booActive,
      booWarning: dead ? false : s.booWarning,
    }));

    if (dead) {
      sounds.playZap();
      get().setTeamAnnouncement(`💥 ${attackerName} vừa hạ ${state.playerName} bằng lồng đèn!`);
      void useEconomyStore.getState().dropOnDeath(
        state.playerName,
        state.currentFloor === 3 ? 3 : 2,
        state.playerPosition[0],
        state.playerPosition[2],
      ).then((dropped) => {
        if (dropped > 0) get().setTeamAnnouncement(`🌕 ${state.playerName} rơi ra ${dropped} bánh Trung Thu!`);
      });
      window.setTimeout(() => {
        if (get().isDead) get().respawnPlayer();
      }, 60000);
    } else {
      sounds.playBlip(180);
    }
  },

  respawnPlayer: () => {
    set((s) => ({
      health: s.maxHealth,
      isDead: false,
      respawnAt: null,
      currentFloor: 2,
      playerPosition: [0, 0.5, 14],
      playerRotationY: Math.PI,
      respawnNonce: s.respawnNonce + 1,
      booActive: false,
      booWarning: false,
    }));