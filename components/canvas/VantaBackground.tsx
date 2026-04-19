"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    VANTA: any;
  }
}

export default function VantaBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(0);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(0);

  useEffect(() => {
    if (scriptsLoaded === 2 && !vantaEffect && vantaRef.current) {
      if (window.VANTA && window.VANTA.BIRDS) {
        setVantaEffect(
          window.VANTA.BIRDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x050508, // Very deep dark background to make colors pop
            color1: 0xa855f7, // tailwind purple-500
            color2: 0x22d3ee, // tailwind cyan-400
            colorMode: "variance",
            birdSize: 1.2,
            wingSpan: 25.0,
            speedLimit: 4.0,
            separation: 50.0,
            alignment: 20.0,
            cohesion: 20.0,
            quantity: 4.0,
          })
        );
      }
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [scriptsLoaded, vantaEffect]);

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" 
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded((s) => s + 1)}
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js" 
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded((s) => s + 1)}
      />
      <div
        ref={vantaRef}
        className="fixed inset-0 z-[-1] pointer-events-none"
      />
    </>
  );
}
