"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const particleOptions: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: {
      value: 60,
      density: { enable: true, width: 1920, height: 1080 },
    },
    color: { value: ["#a855f7", "#06b6d4", "#6366f1"] },
    opacity: {
      value: { min: 0.1, max: 0.4 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: {
      value: { min: 1, max: 3 },
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      outModes: { default: "out" },
    },
    links: {
      enable: true,
      distance: 120,
      color: "#a855f7",
      opacity: 0.08,
      width: 1,
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
    },
    modes: {
      grab: { distance: 140, links: { opacity: 0.2 } },
    },
  },
  detectRetina: true,
};

export default function ParticlesBg() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="hero-particles"
      className="pointer-events-auto absolute inset-0"
      options={particleOptions}
    />
  );
}
