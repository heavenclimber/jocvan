"use client";

import { useRef, useState } from "react";

interface JoystickProps {
  onMove: (direction: "LEFT" | "RIGHT" | "NONE") => void;
}

export default function Joystick({ onMove }: JoystickProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const baseRef = useRef<HTMLDivElement>(null);
  
  // How far the thumb can travel from the center
  const maxRadius = 35;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePos(e.clientX, e.clientY);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePos(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setPos({ x: 0, y: 0 });
    onMove("NONE");
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const updatePos = (clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Constrain the thumb within the max radius
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }
    
    setPos({ x: dx, y: dy });
    
    // We only care about X axis for this 2D game
    if (dx < -15) {
      onMove("LEFT");
    } else if (dx > 15) {
      onMove("RIGHT");
    } else {
      onMove("NONE");
    }
  };

  return (
    <div
      ref={baseRef}
      className="relative w-24 h-24 rounded-full bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center touch-none select-none shadow-[0_4px_20px_rgba(0,0,0,0.4)] z-50 cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="absolute w-12 h-12 rounded-full bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/50 pointer-events-none"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      />
      
      {/* Decorative center dot */}
      <div className="w-2 h-2 rounded-full bg-white/50 pointer-events-none opacity-50" />
      
      {/* Visual arrow guides */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-[6px] border-r-white/30 pointer-events-none" />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[6px] border-l-white/30 pointer-events-none" />
    </div>
  );
}
