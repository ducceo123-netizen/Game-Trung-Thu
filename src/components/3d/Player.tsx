
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

    if (hitShake.current > 0) {
      hitShake.current = Math.max(0, hitShake.current - delta * 1.8);
      const intensity = hitShake.current * 0.18;
      camera.position.x += Math.sin(time * 52) * intensity;
      camera.position.y += Math.cos(time * 47) * intensity * 0.6;
      camera.position.z += Math.sin(time * 61) * intensity * 0.7;
    }

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

    // 3. Continuously spawning mooncake currency
    for (const cake of worldMooncakes) {
      const dist = playerPos.distanceTo(new THREE.Vector3(cake.x, 0.5, cake.z));
      if (dist < 1.7) {
        setInteractionPrompt({
          text: cake.source === 'drop'
            ? '🌕 [E] Nhặt bánh người chơi vừa làm rơi'
            : '🌕 [E] Nhặt bánh Trung Thu',
          action: async () => {
            const ok = await claimWorldMooncake(cake.id, playerName);
            showAchievement({
              id: `cake_${cake.id}`,
              title: ok ? '🌕 +1 BÁNH TRUNG THU' : 'CHẬM MỘT NHỊP',
              subtitle: ok ? 'Đã cộng vào ví. Dùng để mua đồ ở tiệm.' : 'Có người vừa nhặt trước bạn.',
            });
          },
        });
        return;
      }
    }

    // 4. Dropped shop items — anyone can pick them up
    for (const item of worldItems) {
      if (item.floor !== currentFloor) continue;
      const dist=playerPos.distanceTo(new THREE.Vector3(item.x,0.5,item.z));
      if (dist < 1.8) {
        setInteractionPrompt({
          text: `📦 [E] Nhặt ${item.item_id === 'sword' ? 'Kiếm LED' : item.item_id === 'blaster' ? 'Blaster' : 'Xe điện mini'}`,
          action: async () => {
            const r=await claimWorldItem(item.id,playerName);
            showAchievement({
              id:`pickup_${item.id}`,
              title:r.ok?'📦 NHẶT ĐƯỢC VẬT PHẨM':'KHÔNG NHẶT ĐƯỢC',
              subtitle:r.ok?'Vật phẩm đã vào inventory. Ghé shop hoặc HUD để equip.':r.reason==='already_owned'?'Bạn đã có món này rồi.':'Có người khác vừa nhặt trước bạn.',
            });
          },
        });
        return;
      }
    }

    // 5. Anh Khoẻ — compliment once for 10 cakes
    const khoeDist = playerPos.distanceTo(new THREE.Vector3(ANH_KHOE_POSITION[0], 0.5, ANH_KHOE_POSITION[2]));
    if (khoeDist < 2.3) {
      setInteractionPrompt({
        text: '😎 [E] Khen anh Khoẻ đẹp trai',
        action: async () => {
          const granted = await praiseAnhKhoe(playerName);
          showAchievement({
            id: 'anh_khoe_reward',
            title: granted ? '😎 ANH KHOẺ VUI RỒI' : 'ANH KHOẺ NHỚ MÀ',
            subtitle: granted ? '“Biết nhìn người đó em.” +10 bánh Trung Thu!' : 'Mỗi người chỉ được khen lấy quà một lần thôi nha :))',
          });
        },
      });
      return;
    }

    // 6. Item shop
    const shopDist = playerPos.distanceTo(new THREE.Vector3(ITEM_SHOP_POSITION[0],0.5,ITEM_SHOP_POSITION[2]));
    if (shopDist < 2.8) {
      setInteractionPrompt({
        text: '🛒 [E] Mở TIỆM ĐỒ TRUNG THU',
        action: () => openShop(),
      });
      return;
    }

    // 7. UID culture social post
    const socialPostDist = playerPos.distanceTo(
      new THREE.Vector3(SOCIAL_POST_POSITION[0], 0.5, SOCIAL_POST_POSITION[2]),
    );
    if (socialPostDist < 2.25) {
      setInteractionPrompt({
        text: '📺 [E] Mở UID SOCIAL SCREEN • Up ảnh / meme',
        action: () => openSocialPost(),
      });
      return;
    }

    // 8. Personal Lantern Workshop check (UID Floor 2)
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

    // 9. Lanterns proximity check
    const lanternDistances = [
      {
        name: 'LỒNG ĐÈN SALONPAS',
        pos: [-3.1, 1.65, 6.0],
        action: applySalonpas,
        tip: '[E] Chữa lành cột sống',
      },
      {
        name: 'LỒNG ĐÈN LON BIA',
        pos: [3.2, 1.7, 4.4],
        action: triggerBeerCan,
        tip: '[E] Lắc lon bia phát sáng',
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