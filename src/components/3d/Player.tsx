import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';
import { sounds } from '../../utils/soundEffects';
import { PlayerLantern } from './PlayerLantern';

// Keyboard movement state tracker
interface KeysState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
  jump: boolean;
  interact: boolean;
}

export function Player() {
  const playerRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const poleRef = useRef<THREE.Group>(null);

  const { camera } = useThree();

  // Zustand states & actions
  const playerName = useGameStore((s) => s.playerName);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const hasBambooPole = useGameStore((s) => s.hasBambooPole);
  const bambooPokeTrigger = useGameStore((s) => s.bambooPokeTrigger);
  const isSlowed = useGameStore((s) => s.isSlowed);
  const isBeautyMode = useGameStore((s) => s.isBeautyMode);
  const equipBambooPole = useGameStore((s) => s.equipBambooPole);
  const startDialogue = useGameStore((s) => s.startDialogue);
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const setInteractionPrompt = useGameStore((s) => s.setInteractionPrompt);
  const workshopOpen = useGameStore((s) => s.workshopOpen);
  const openWorkshop = useGameStore((s) => s.openWorkshop);
  const personalLanternBuilt = useGameStore((s) => s.personalLanternBuilt);
  const personalLanternLit = useGameStore((s) => s.personalLanternLit);
  const lightPersonalLantern = useGameStore((s) => s.lightPersonalLantern);
  const togglePersonalLanternLight = useGameStore((s) => s.togglePersonalLanternLight);
  const currentFloor = useGameStore((s) => s.currentFloor);
  const setCurrentFloor = useGameStore((s) => s.setCurrentFloor);
  const setPlayerTransform = useGameStore((s) => s.setPlayerTransform);
  const questItems = useGameStore((s) => s.questItems);
  const collectedIds = useGameStore((s) => s.collectedItemIds);
  const collectItem = useGameStore((s) => s.collectItem);
  const rebootMoonServer = useGameStore((s) => s.rebootMoonServer);
  const interactRabbit = useGameStore((s) => s.interactRabbit);
  const showAchievement = useGameStore((s) => s.showAchievement);
  const triggerBambooPoke = useGameStore((s) => s.triggerBambooPoke);

  // Lantern triggers
  const applySalonpas = useGameStore((s) => s.applySalonpasHealing);
  const triggerBeerCan = useGameStore((s) => s.triggerBeerCanRabbit);
  const launchBottle = useGameStore((s) => s.launchWaterBottle);
  const openBox = useGameStore((s) => s.openCardboardBox);
  const eatNoodles = useGameStore((s) => s.eatInstantNoodles);
  const triggerKeyboard = useGameStore((s) => s.triggerKeyboardRGB);
  const triggerBeauty = useGameStore((s) => s.triggerBeautyFilter);
  const printPaper = useGameStore((s) => s.printOfficePaper);

  // Physics & locomotion state
  const pos = useRef(new THREE.Vector3(0, 0.5, 14)); // Start near entrance
  const velY = useRef(0);
  const isGrounded = useRef(true);
  const rotationY = useRef(Math.PI); // Facing inward (toward alley)
  const cameraYaw = useRef(Math.PI);
  const cameraPitch = useRef(0.28);
  const lastPositionSync = useRef(0);

  const keys = useRef<KeysState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    jump: false,
    interact: false,
  });

  // Setup keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing inside an input element
      if (document.activeElement?.tagName === 'INPUT') return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.run = true;
          break;
        case 'Space':
          keys.current.jump = true;
          break;
        case 'KeyE':
          keys.current.interact = true;
          break;
        case 'KeyF':
          if (useGameStore.getState().personalLanternBuilt) {
            togglePersonalLanternLight();
          } else if (hasBambooPole) {
            triggerBambooPoke();
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.run = false;
          break;
        case 'Space':
          keys.current.jump = false;
          break;
        case 'KeyE':
          keys.current.interact = false;
          break;
      }
    };

    // Free-look mouse controls: moving the mouse rotates view immediately.
    // No click-and-drag required. UI surfaces remain excluded.
    const handleMouseMove = (e: MouseEvent) => {
      if (useGameStore.getState().gamePhase !== 'playing') return;
      if (useGameStore.getState().workshopOpen) return;
      if ((e.target as HTMLElement).closest('.interactive-ui')) return;

      const dx = e.movementX;
      const dy = e.movementY;

      cameraYaw.current -= dx * 0.0042;
      cameraPitch.current = Math.max(
        0.08,
        Math.min(0.95, cameraPitch.current + dy * 0.0032),
      );
    };

    // Left click keeps the existing bamboo poke action.
    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.interactive-ui')) return;
      if (e.button === 0 && hasBambooPole) {
        triggerBambooPoke();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [hasBambooPole, triggerBambooPoke, togglePersonalLanternLight]);

  // Floor transition spawn points.
  useEffect(() => {
    if (currentFloor === 3) {
      pos.current.set(0, 0.5, 11.2);
      cameraYaw.current = Math.PI;
      rotationY.current = Math.PI;
    } else {
      pos.current.set(7.0, 0.5, -1.8);
      cameraYaw.current = Math.PI;
      rotationY.current = Math.PI;
    }
    setInteractionPrompt(null);
  }, [currentFloor, setInteractionPrompt]);

  // Handle interact key trigger
  useEffect(() => {
    const handleInteractCheck = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const currentPrompt = useGameStore.getState().interactionPrompt;
        if (currentPrompt) {
          currentPrompt.action();
        }
      }
    };
    window.addEventListener('keydown', handleInteractCheck);
    return () => window.removeEventListener('keydown', handleInteractCheck);
  }, []);

  // Bamboo poke visual animation
  const pokeProgress = useRef(0);
  useEffect(() => {
    if (bambooPokeTrigger > 0) {
      pokeProgress.current = 1.0;
    }
  }, [bambooPokeTrigger]);

  useFrame((state, delta) => {
    if (gamePhase !== 'playing') return;
    if (workshopOpen) return;

    // Movement calculation
    let moveSpeed = 4.2;
    if (keys.current.run) moveSpeed = 7.0;
    if (isSlowed) moveSpeed = 1.6; // Salonpas slow

    const forwardInput = (keys.current.forward ? 1 : 0) - (keys.current.backward ? 1 : 0);
    const strafeInput = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
    const isMoving = forwardInput !== 0 || strafeInput !== 0;

    if (isMoving) {
      // Standard third-person camera-relative movement:
      // W always moves toward screen/camera forward, D always moves screen-right.
      const forwardVec = new THREE.Vector3();
      camera.getWorldDirection(forwardVec);
      forwardVec.y = 0;

      if (forwardVec.lengthSq() < 0.0001) {
        forwardVec.set(Math.sin(cameraYaw.current), 0, Math.cos(cameraYaw.current));
      } else {
        forwardVec.normalize();
      }

      const rightVec = new THREE.Vector3().crossVectors(forwardVec, camera.up).normalize();

      const dir = new THREE.Vector3()
        .addScaledVector(forwardVec, forwardInput)
        .addScaledVector(rightVec, strafeInput);

      if (dir.lengthSq() > 1) dir.normalize();

      pos.current.x += dir.x * moveSpeed * delta;
      pos.current.z += dir.z * moveSpeed * delta;

    }

    // Character faces the mouse/camera direction in real time, even while idle.
    // This gives action-game controls: W/S move along facing direction, A/D strafe.
    const targetFacing = cameraYaw.current;
    let facingDiff = targetFacing - rotationY.current;
    while (facingDiff > Math.PI) facingDiff -= Math.PI * 2;
    while (facingDiff < -Math.PI) facingDiff += Math.PI * 2;
    rotationY.current += facingDiff * Math.min(1, delta * 18);

    // Bounds for each playable floor.
    pos.current.x = Math.max(-8.6, Math.min(8.6, pos.current.x));
    if (currentFloor === 2) {
      pos.current.z = Math.max(-22.8, Math.min(15.2, pos.current.z));
    } else {
      pos.current.z = Math.max(-14.0, Math.min(13.6, pos.current.z));
    }

    // Jump & gravity
    if (keys.current.jump && isGrounded.current) {
      velY.current = 6.2;
      isGrounded.current = false;
      sounds.playJump();
    }

    velY.current -= 18.0 * delta; // Gravity
    pos.current.y += velY.current * delta;

    if (pos.current.y <= 0.5) {
      pos.current.y = 0.5;
      velY.current = 0;
      isGrounded.current = true;
    }

    // Squash & bounce walking animation
    const time = state.clock.getElapsedTime();
    if (bodyRef.current && headRef.current) {
      if (isMoving && isGrounded.current) {
        const bounceFreq = keys.current.run ? 16 : 10;
        const bounce = Math.abs(Math.sin(time * bounceFreq));
        bodyRef.current.position.y = bounce * 0.12;
        bodyRef.current.scale.set(1 + bounce * 0.08, 1 - bounce * 0.08, 1 + bounce * 0.08);
        headRef.current.position.y = 0.85 + bounce * 0.15;
        headRef.current.rotation.z = Math.sin(time * (bounceFreq / 2)) * 0.08;
      } else {
        // Idle breathing
        bodyRef.current.position.y = Math.sin(time * 2.5) * 0.02;
        bodyRef.current.scale.set(1, 1, 1);
        headRef.current.position.y = 0.85 + Math.sin(time * 2.5) * 0.01;
        headRef.current.rotation.z = 0;
      }
    }

    // Update Player Group Transform
    if (playerRef.current) {
      playerRef.current.position.copy(pos.current);
      playerRef.current.rotation.y = rotationY.current;
    }

    // Low-frequency position sync for Boo chase; avoids a Zustand update every frame.
    const now = state.clock.elapsedTime;
    if (now - lastPositionSync.current > 0.12) {
      lastPositionSync.current = now;
      setPlayerTransform([pos.current.x, pos.current.y, pos.current.z], rotationY.current);
    }

    // Bamboo pole poke swing animation
    if (poleRef.current) {
      if (pokeProgress.current > 0) {
        pokeProgress.current = Math.max(0, pokeProgress.current - delta * 4);
        const swing = Math.sin(pokeProgress.current * Math.PI);
        poleRef.current.rotation.x = 0.3 - swing * 1.2;
        poleRef.current.position.z = 0.4 + swing * 0.6;
      } else {
        poleRef.current.rotation.x = 0.3;
        poleRef.current.position.z = 0.4;
      }
    }

    // Camera follow (Smooth Third-Person)
    const camDist = 4.2;
    const camHeight = Math.sin(cameraPitch.current) * camDist + 1.6;
    const camBack = Math.cos(cameraPitch.current) * camDist;

    const targetCamX = pos.current.x - Math.sin(cameraYaw.current) * camBack;
    const targetCamZ = pos.current.z - Math.cos(cameraYaw.current) * camBack;
    const targetCamY = pos.current.y + camHeight;

    camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.12);
    camera.lookAt(pos.current.x, pos.current.y + 1.2, pos.current.z);

    // =========================================================
    // PROXIMITY DETECTION & INTERACTION TARGETING
    // =========================================================
    const playerPos = pos.current;

    if (currentFloor === 3) {
      const stairDownDist = playerPos.distanceTo(new THREE.Vector3(0, 0.5, 12.3));
      if (stairDownDist < 3.2) {
        setInteractionPrompt({
          text: '⬇️ [E] CHẠY XUỐNG LẦU 2',
          action: () => setCurrentFloor(2),
        });
        return;
      }
      setInteractionPrompt(null);
      return;
    }

    // Floor 2 staircase to Halloween zone.
    const stairUpDist = playerPos.distanceTo(new THREE.Vector3(7.1, 0.5, -4.0));
    if (stairUpDist < 3.0) {
      setInteractionPrompt({
        text: '👻 [E] LÊN LẦU 3 — HALLOWEEN ZONE',
        action: () => setCurrentFloor(3),
      });
      return;
    }

    // 1. Security Guard check (near [2.2, 0, 12])
    const guardDist = playerPos.distanceTo(new THREE.Vector3(2.2, 0.5, 12));
    if (guardDist < 2.5 && !activeDialogue) {
      setInteractionPrompt({
        text: '[E] Nói chuyện với Chú Bảo Vệ',
        action: () => {
          if (!hasBambooPole) {
            startDialogue({
              speaker: 'CHÚ BẢO VỆ',
              lines: [
                '“Ê, BTC giấu 3 bánh Trung Thu bí mật quanh Lầu 2 đó.”',
                '“Mỗi bánh có một vé máy bay nội địa trị giá 3 triệu.”',
                '“Tìm bánh xong nhớ ghé Workshop UID up ảnh làm lồng đèn của mình.”',
                '“Làm xong cầm đèn đi chơi được luôn. Còn Lầu 3... nghe nói có Boo.”',
              ],
              currentLineIndex: 0,
              onComplete: () => {
                equipBambooPole();
              },
            });
          } else {
            startDialogue({
              speaker: 'CHÚ BẢO VỆ',
              lines: [
                '“3 bánh nằm rải quanh Lầu 2, nhìn kỹ mấy góc khuất nha.”',
                '“Workshop ở phía trong. Làm xong nhấn F để bật tắt đèn.”',
                '“Muốn thử gan thì lên Lầu 3. Nếu có tín hiệu lạ thì chạy xuống đây.”',
              ],
              currentLineIndex: 0,
            });
          }
        },
      });
      return;
    }

    // 2. Quest collectibles check
    let nearQuestItem = false;
    for (const item of questItems) {
      if (collectedIds.includes(item.id)) continue;
      const dist = playerPos.distanceTo(new THREE.Vector3(...item.position));
      if (dist < 2.0) {
        nearQuestItem = true;
        setInteractionPrompt({
          text: `🌕 [E] MỞ: ${item.vietnameseName}`,
          action: () => collectItem(item.id),
        });
        break;
      }
    }
    if (nearQuestItem) return;

    // 3. Personal Lantern Workshop check (UID Floor 2)
    const workshopDist = playerPos.distanceTo(new THREE.Vector3(-5.4, 0.5, -9.7));
    if (workshopDist < 3.0) {
      setInteractionPrompt({
        text: personalLanternBuilt
          ? '📸 [E] Mở lại QUẦY LÀM LỒNG ĐÈN / đổi ảnh'
          : '🏮 [E] Vào QUẦY LÀM LỒNG ĐÈN — Up ảnh của bạn',
        action: () => openWorkshop(),
      });
      return;
    }

    // 4. Lanterns proximity check
    const lanternDistances = [
      {
        name: 'LỒNG ĐÈN SALONPAS',
        pos: [-3.1, 1.65, 6.0],
        action: applySalonpas,
        tip: '[E] Chữa lành cột sống',
      },
      {
        name: 'LỒNG ĐÈN BIA + THỎ',
        pos: [3.2, 1.7, 4.4],
        action: triggerBeerCan,
        tip: '[E] Chọc con thỏ ngồi trên lon bia',
      },
      {
        name: 'LỒNG ĐÈN CHAI SATORI',
        pos: [-2.6, 1.65, 1.5],
        action: launchBottle,
        tip: '[E] Kích hoạt chai nước tên lửa',
      },
      {
        name: 'LỒNG ĐÈN THÙNG CARTON',
        pos: [2.9, 1.65, -1.9],
        action: openBox,
        tip: '[E] Mở FINAL_FINAL_v7',
      },
      {
        name: 'LỒNG ĐÈN MÌ HẢO HẢO',
        pos: [-2.7, 1.65, -4.7],
        action: eatNoodles,
        tip: '[E] Húp mì cứu OT',
      },
      {
        name: 'LỒNG ĐÈN BÀN PHÍM RGB',
        pos: [4.6, 1.75, -7.1],
        action: triggerKeyboard,
        tip: '[E] Gõ phím ASDFGHJK',
      },
      {
        name: 'LỒNG ĐÈN SẮC ĐẸP',
        pos: [-5.8, 1.75, -7.6],
        action: triggerBeauty,
        tip: '[E] Bật beauty filter 280%',
      },
      {
        name: 'LỒNG ĐÈN MÁY IN 2900',
        pos: [4.4, 1.7, -9.8],
        action: printPaper,
        tip: '[E] In lệnh pls revise',
      },
    ];

    let nearLantern = false;
    for (const l of lanternDistances) {
      const dist = playerPos.distanceTo(new THREE.Vector3(...l.pos));
      if (dist < 2.6) {
        nearLantern = true;
        setInteractionPrompt({
          text: `${l.tip} (${l.name})`,
          action: l.action,
        });
        break;
      }
    }
    if (nearLantern) return;

    // 7. Rabbit check — hiding inside the turquoise booth
    const rabbitDist = playerPos.distanceTo(new THREE.Vector3(6.2, 0.5, 5.7));
    if (rabbitDist < 2.2) {
      setInteractionPrompt({
        text: '[E] Bắt chuyện với Thỏ Trốn Họp',
        action: () => {
          const speech = interactRabbit();
          showAchievement({
            id: 'rabbit_chat',
            title: 'THỎ TRUNG THU',
            subtitle: speech,
          });
        },
      });
      return;
    }

    // Nothing nearby
    setInteractionPrompt(null);
  });

  return (
    <group ref={playerRef} position={[0, 0.5, 14]}>
      {/* --- CHARACTER MESH (Cute Low-Poly Big Head Humanoid) --- */}
      <group ref={bodyRef}>
        {/* Legs / Jeans */}
        <mesh position={[-0.14, 0.25, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.16]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        <mesh position={[0.14, 0.25, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.16]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Sneakers */}
        <mesh position={[-0.14, 0.05, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[0.14, 0.05, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>

        {/* UID team shirt: dark navy tee with small UID chest mark */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.5, 0.48, 0.28]} />
          <meshStandardMaterial color={isBeautyMode ? '#ec4899' : '#111827'} roughness={0.62} />
        </mesh>
        {/* subtle collar */}
        <mesh position={[0, 0.87, 0.145]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.105, 0.018, 6, 14, Math.PI]} />
          <meshStandardMaterial color="#0b1220" roughness={0.7} />
        </mesh>
        {/* UID logo on left chest */}
        <Text
          position={[-0.105, 0.72, 0.151]}
          fontSize={0.09}
          color="#eaf6ff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          UID
        </Text>
        <mesh position={[-0.105, 0.645, 0.152]}>
          <boxGeometry args={[0.13, 0.018, 0.008]} />
          <meshStandardMaterial color="#2aa7d6" emissive="#0e7490" emissiveIntensity={0.3} />
        </mesh>

        {/* Left Arm */}
        <mesh position={[-0.32, 0.62, 0]} castShadow>
          <boxGeometry args={[0.14, 0.42, 0.15]} />
          <meshStandardMaterial color={isBeautyMode ? '#ec4899' : '#111827'} roughness={0.62} />
        </mesh>

        {/* Right Arm (Holding bamboo pole) */}
        <mesh position={[0.32, 0.62, 0]} castShadow>
          <boxGeometry args={[0.14, 0.42, 0.15]} />
          <meshStandardMaterial color={isBeautyMode ? '#ec4899' : '#111827'} roughness={0.62} />
        </mesh>

        {/* Personal photo lantern follows the player after workshop build */}
        <PlayerLantern />

        {/* --- THE SIGNATURE BAMBOO POLE WITH HOOK TIP --- */}
        {hasBambooPole && (
          <group ref={poleRef} position={[0.4, 0.5, 0.2]} rotation={[0.3, 0, 0]}>
            {/* Long bamboo rod (segmented joints) */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <cylinderGeometry args={[0.022, 0.03, 2.2, 8]} />
              <meshStandardMaterial color="#65a30d" roughness={0.6} />
            </mesh>
            {/* Bamboo rings / nodes */}
            {[-0.3, 0.2, 0.7, 1.2, 1.7].map((by, bi) => (
              <mesh key={bi} position={[0, by, 0]}>
                <torusGeometry args={[0.032, 0.008, 6, 12]} />
                <meshStandardMaterial color="#3f6212" />
              </mesh>
            ))}
            {/* Wire hook on top tip */}
            <mesh position={[0, 1.82, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.06, 0.012, 6, 12, Math.PI * 1.4]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
            </mesh>
            {/* Red festive ribbon hanging from tip */}
            <mesh position={[0, 1.72, 0.06]}>
              <boxGeometry args={[0.03, 0.25, 0.01]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>
        )}
      </group>

      {/* --- BIG CUTE HEAD --- */}
      <group ref={headRef} position={[0, 0.85, 0]}>
        {/* Head Cube */}
        <mesh position={[0, 0.26, 0]} castShadow>
          <boxGeometry args={[0.44, 0.42, 0.38]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
        {/* Big Expressive Eyes */}
        <mesh position={[-0.11, 0.28, 0.2]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.11, 0.28, 0.2]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Eye sparkles */}
        <mesh position={[-0.1, 0.3, 0.215]}>
          <boxGeometry args={[0.025, 0.025, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, 0.3, 0.215]}>
          <boxGeometry args={[0.025, 0.025, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Developer Messy Hair */}
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[0.48, 0.12, 0.42]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Headband / Eyeglasses */}
        <mesh position={[0, 0.28, 0.195]}>
          <boxGeometry args={[0.38, 0.04, 0.03]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* --- FLOATING PLAYER NAME OVER HEAD --- */}
      <group position={[0, 1.85, 0]}>
        <mesh>
          <planeGeometry args={[1.6, 0.35]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.8} />
        </mesh>
        <Text
          position={[0, 0.02, 0.01]}
          fontSize={0.12}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {playerName}
        </Text>
      </group>
    </group>
  );
}