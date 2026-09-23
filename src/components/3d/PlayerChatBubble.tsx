import { useEffect, useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSocialChatStore } from '../../stores/useSocialChatStore';

export function PlayerChatBubble(){
  const bubble=useSocialChatStore(s=>s.localBubble);
  const clear=useSocialChatStore(s=>s.clearLocalBubble);
  const [texture,setTexture]=useState<THREE.Texture|null>(null);
  const timer=useRef<number|null>(null);

  useEffect(()=>{
    if(timer.current) window.clearTimeout(timer.current);
    if(!bubble){setTexture(old=>{old?.dispose();return null;});return;}
    timer.current=window.setTimeout(()=>clear(),Math.max(0,bubble.until-Date.now()+50));
    if(bubble.meme){
      const loader=new THREE.TextureLoader();
      loader.load(bubble.meme,next=>{
        next.colorSpace=THREE.SRGBColorSpace;
        setTexture(old=>{old?.dispose();return next;});
      });
    }else{
      setTexture(old=>{old?.dispose();return null;});
    }
    return()=>{if(timer.current)window.clearTimeout(timer.current);};
  },[bubble,clear]);

  if(!bubble) return null;

  return (
    <group position={[0,2.35,0]}>
      <mesh position={[0,0,0]}>
        <planeGeometry args={[1.8,bubble.meme?1.25:0.55]}/>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.93}/>
      </mesh>
      {bubble.meme && (
        <mesh position={[0,bubble.text?0.12:0,0.012]}>
          <planeGeometry args={[1.45,0.9]}/>
          <meshBasicMaterial map={texture??undefined} color={texture?'#ffffff':'#d1d5db'}/>
        </mesh>
      )}
      {bubble.text && (
        <Text
          position={[0,bubble.meme?-0.48:0,0.02]}
          fontSize={0.11}
          maxWidth={1.55}
          color="#111827"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
        >
          {bubble.text}
        </Text>
      )}
    </group>
  );
}
