import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';
import { sounds } from '../../utils/soundEffects';

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
  const isPointerDown = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

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
          // Poke with bamboo pole
          triggerBambooPoke();
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

    // Mouse drag for camera orbit
    const handleMouseDown = (e: MouseEvent) => {
      // If clicking directly on UI, don't drag camera
      if ((e.target as HTMLElement).closest('.interactive-ui')) return;
      isPointerDown.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // Left click also pokes bamboo pole if playing
      if (e.button === 0 && hasBambooPole) {
        triggerBambooPoke();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerDown.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      cameraYaw.current -= dx * 0.005;
      cameraPitch.current = Math.max(0.05, Math.min(1.2, cameraPitch.current + dy * 0.004));
    };

    const handleMouseUp = () => {
      isPointerDown.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [hasBambooPole, triggerBambooPoke]);

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

      // Rotate player toward movement direction
      const targetAngle = Math.atan2(dir.x, dir.z);
      // Smooth angular interpolation
      let angleDiff = targetAngle - rotationY.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      rotationY.current += angleDiff * Math.min(1, delta * 12);
    }

    // Bounds check to keep inside alley & courtyard
    pos.current.x = Math.max(-5.0, Math.min(5.0, pos.current.x));
    pos.current.z = Math.max(-23.0, Math.min(15.5, pos.current.z));

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
                '“Anh không biết chuyện gì vừa xảy ra...”',
                '“Có đứa phòng Thiết Kế vừa cắm nồi lẩu cá thác lác vào ổ điện trạm phát trăng.”',
                '“Cả hệ thống sập nguồn rồi. Nhưng hình như công ty còn đúng một cây tre.”',
                '“Cầm lấy đi! Dùng nó mà khều lồng đèn với giải cứu Trung Thu!”',
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
                '“Cây tre xịn đấy! Đi gom đủ 3 món linh kiện rồi về trạm phát trăng khởi động lại server!”',
                '“Nhớ cẩn thận mấy cái lồng đèn tự chế của tụi Dev, dị lắm!”',
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
          text: `[E] Nhặt: ${item.vietnameseName}`,
          action: () => collectItem(item.id),
        });
        break;
      }
    }
    if (nearQuestItem) return;

    // 3. Moon Server Machine check (near [0, 0, -17.5])
    const serverDist = playerPos.distanceTo(new THREE.Vector3(0, 0.5, -16.5));
    if (serverDist < 3.2) {
      if (collectedIds.length === 3) {
        setInteractionPrompt({
          text: '⚡ [E] KHỞI ĐỘNG LẠI MẶT TRĂNG (REBOOT MOON SERVER)',
          action: () => rebootMoonServer(),
        });
      } else {
        setInteractionPrompt({
          text: `[E] Trạm Phát Trăng (Thiếu ${3 - collectedIds.length}/3 linh kiện)`,
          action: () => {
            showAchievement({
              id: 'server_offline',
              title: 'SERVER OFFLINE (404)',
              subtitle: `Cần tìm đủ 3 linh kiện: Ổ cắm, Súng bắn keo, Remote LED (${collectedIds.length}/3)`,
            });
          },
        });
      }
      return;
    }

    // 4. Lanterns proximity check
    const lanternDistances = [
      {
        name: 'LỒNG ĐÈN SALONPAS',
        pos: [-2.8, 2.2, 10.5],
        action: applySalonpas,
        tip: '[E] Chữa lành cột sống',
      },
      {
        name: 'LỒNG ĐÈN LON BIA SAIGON',
        pos: [2.8, 2.3, 7.0],
        action: triggerBeerCan,
        tip: '[E] Bắt thỏ ngồi trên lon bia',
      },
      {
        name: 'LỒNG ĐÈN CHAI AQUAFINA',
        pos: [-2.6, 2.2, 4.0],
        action: launchBottle,
        tip: '[E] Kích hoạt tên lửa nước',
      },
      {
        name: 'LỒNG ĐÈN THÙNG CARTON',
        pos: [2.7, 2.3, 1.2],
        action: openBox,
        tip: '[E] Mở nắp hộp FINAL_v7',
      },
      {
        name: 'LỒNG ĐÈN MÌ HẢO HẢO',
        pos: [-2.8, 2.2, -1.8],
        action: eatNoodles,
        tip: '[E] Húp mì nạp 12mg sodium',
      },
      {
        name: 'LỒNG ĐÈN BÀN PHÍM RGB',
        pos: [2.6, 2.4, -4.5],
        action: triggerKeyboard,
        tip: '[E] Gõ phím ASDFGHJK',
      },
      {
        name: 'LỒNG ĐÈN BEAUTY FILTER',
        pos: [-3.2, 2.3, -7.5],
        action: triggerBeauty,
        tip: '[E] Bật filter 280%',
      },
      {
        name: 'LỒNG ĐÈN MÁY IN CANON',
        pos: [3.2, 2.2, -9.5],
        action: printPaper,
        tip: '[E] In lệnh duyệt deadline',
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

    // 5. Rabbit check (Hiding rabbit near [-4.0, 0.5, 11])
    const rabbitDist = playerPos.distanceTo(new THREE.Vector3(-4.0, 0.5, 11));
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

        {/* Torso / Developer Hoodie */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.48, 0.48, 0.28]} />
          <meshStandardMaterial color={isBeautyMode ? '#ec4899' : '#0284c7'} roughness={0.5} />
        </mesh>
        {/* Hoodie pocket */}
        <mesh position={[0, 0.56, 0.15]}>
          <boxGeometry args={[0.28, 0.15, 0.02]} />
          <meshStandardMaterial color="#0369a1" />
        </mesh>

        {/* Left Arm */}
        <mesh position={[-0.32, 0.62, 0]} castShadow>
          <boxGeometry args={[0.14, 0.42, 0.15]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Right Arm (Holding bamboo pole) */}
        <mesh position={[0.32, 0.62, 0]} castShadow>
          <boxGeometry args={[0.14, 0.42, 0.15]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

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