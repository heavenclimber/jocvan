"use client";

import { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import ExperienceScene from "./ExperienceScene";
import type { ExperienceItem } from "@/types";

interface PhaserGameProps {
  onNodeReached: (data: ExperienceItem) => void;
  onNodeLeft: () => void;
  gameRef: React.MutableRefObject<Phaser.Game | null>;
}

export default function PhaserGame({ onNodeReached, onNodeLeft, gameRef }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: "100%",
      height: "100%",
      parent: containerRef.current,
      backgroundColor: "#000814",
      scene: ExperienceScene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Listen to scene events after the scene starts
    game.events.on("ready", () => {
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

  return <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden border border-white/10" />;
}
