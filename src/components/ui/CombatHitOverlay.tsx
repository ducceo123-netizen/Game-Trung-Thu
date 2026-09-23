import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';

export function CombatHitOverlay() {
  const tick=useGameStore((s)=>s.damageTick);
  const [show,setShow]=useState(false);
  useEffect(()=>{
    if(tick<=0) return;
    setShow(true);
    const t=window.setTimeout(()=>setShow(false),180);
    return()=>window.clearTimeout(t);
  },[tick]);
  if(!show) return null;
  return <div className="pointer-events-none absolute inset-0 z-[89]">
    <div className="absolute inset-0 bg-red-700/18 animate-pulse" />
    <div className="absolute inset-0 shadow-[inset_0_0_120px_45px_rgba(127,29,29,0.7)]" />
  </div>;
}
