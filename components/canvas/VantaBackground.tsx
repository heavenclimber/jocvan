"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    VANTA: any;
  }
}

interface VantaBackgroundProps {
  type: "fog" | "birds";
}

export default function VantaBackground({ type }: VantaBackgroundProps) {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(0);

  // We need 3 scripts loaded: three.js, vanta.fog, and vanta.birds
  const TOTAL_SCRIPTS = 3;

  useEffect(() => {
    if (scriptsLoaded === TOTAL_SCRIPTS && !vantaEffect && vantaRef.current) {
      if (type === "fog" && window.VANTA && window.VANTA.FOG) {
        setVantaEffect(
          window.VANTA.FOG({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            highlightColor: 0x414547,  
            midtoneColor: 0xe0e0e,    
            lowlightColor: 0x172051,
            baseColor: 0x0,
            blurFactor: 0.6,
            speed: 1.0,
            zoom: 0.9,
          })
        );
      } else if (type === "birds" && window.VANTA && window.VANTA.BIRDS) {
        setVantaEffect(
          window.VANTA.BIRDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0x000814,
            color1: 0x3b82f6,
            color2: 0x60a5fa,
            colorMode: "variance",
            birdSize: 1.50,
            wingSpan: 30.00,
            speedLimit: 5.00,
            separation: 20.00,
            alignment: 20.00,
            cohesion: 20.00,
            quantity: 3.00
          })
        );
      }
    }

    return () => {
      if (vantaEffect) {
        try {
          vantaEffect.destroy();
          setVantaEffect(null);
        } catch (e) {
          console.error("Vanta destroy error:", e);
        }
      }
    };
  }, [scriptsLoaded, type]);

  // Re-initialize effect when type changes
  useEffect(() => {
    if (vantaEffect) {
      try {
        vantaEffect.destroy();
        setVantaEffect(null);
      } catch (e) {
        console.error("Vanta destroy error:", e);
      }
    }
  }, [type]);


  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="afterInteractive"
        onReady={() => setScriptsLoaded((s) => s + 1)}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
        strategy="afterInteractive"
        onReady={() => setScriptsLoaded((s) => s + 1)}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js"
        strategy="afterInteractive"
        onReady={() => setScriptsLoaded((s) => s + 1)}
      />
      <div
        ref={vantaRef}
        className="fixed inset-0 z-[-1] pointer-events-none"
      />
    </>
  );
}
