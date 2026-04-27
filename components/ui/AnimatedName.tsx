"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedName({ loaded = true }: { loaded?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !loaded) return;

    const elements = containerRef.current.querySelectorAll(".scramble-char");
    const symbols = "!<>-_\\\\/[]{}—=+*^?#________";
    
    // Reset state for hot-reloads
    gsap.killTweensOf(elements);

    // Initial state
    gsap.set(elements, { opacity: 0, y: 20, filter: "blur(10px)" });

    const tl = gsap.timeline({ delay: 0.5 });

    // 1. Split Text Fade & Up
    tl.to(elements, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.0,
      stagger: 0.05,
      ease: "power3.out",
    });

    // 2. Custom Scramble Text Effect synced with the fade
    elements.forEach((el, index) => {
      const target = el as HTMLElement;
      const original = target.getAttribute("data-char");
      
      if (!original || original === " ") {
        target.textContent = " ";
        return;
      }

      const dummy = { progress: 0 };
      
      tl.to(
        dummy,
        {
          progress: 1,
          duration: 0.7,
          ease: "none",
          onUpdate: () => {
            target.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            target.style.color = `hsl(${Math.random() * 360}, 80%, 70%)`; // Glitch colors
          },
          onComplete: () => {
            target.textContent = original;
            target.style.color = ""; // Reset to default CSS color
          },
        },
        index * 0.05 // Start at the same time as the stagger for this specific char
      );
    });

    return () => {
      tl.kill();
    };
  }, [loaded]);

  const name = "Jovan Bastian";
  const words = name.split(" ");

  return (
    <div 
      className="flex flex-wrap gap-x-4 font-black text-6xl md:text-8xl tracking-tight text-white uppercase overflow-hidden justify-center"
      ref={containerRef}
    >
      {words.map((word, wordIndex) => (
        <div key={wordIndex} className="flex">
          {word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              className="scramble-char inline-block whitespace-pre"
              data-char={char}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
