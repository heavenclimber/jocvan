"use client";

import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import ExperienceScene from "./ExperienceScene";
import type { ExperienceItem } from "@/types";

interface PhaserGameProps {
  onNodeReached: (data: ExperienceItem) => void;
  onNodeLeft: () => void;
  gameRef: React.MutableRefObject<Phaser.Game | null>;
}

const MD_BREAKPOINT = 768;

export default function PhaserGame({ onNodeReached, onNodeLeft, gameRef }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isMobile = window.innerWidth < MD_BREAKPOINT;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#000814",
      scene: ExperienceScene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: "100%",
        height: "100%",
      },
      physics: {
        default: "arcade",
      },
      input: {
        // Disable touch/mouse capture so events pass through to the browser
        touch: { capture: false },
        mouse: { capture: false },
      },
      audio: {
        // Prevent "Cannot resume/suspend a closed AudioContext" errors
        disableWebAudio: true,
        noAudio: true,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    const fixTouchAction = () => {
      if (!containerRef.current) return;
      const els = containerRef.current.querySelectorAll("canvas, div");
      els.forEach((el) => {
        (el as HTMLElement).style.touchAction = "pan-y";
        if (isMobile) {
          (el as HTMLElement).style.pointerEvents = "none";
        }
      });
    };

    // Listen to scene events after the scene starts
    game.events.on("ready", () => {
      fixTouchAction();

      const scene = game.scene.getScene("ExperienceScene") as ExperienceScene;
      if (scene) {
        scene.reactEvents.on("nodeReached", onNodeReached);
        scene.reactEvents.on("nodeLeft", onNodeLeft);
      }
    });

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [onNodeReached, onNodeLeft, gameRef]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden border border-white/10"
      style={{ touchAction: "pan-y" }}
    />
  );
}
