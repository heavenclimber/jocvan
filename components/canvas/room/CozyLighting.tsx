import React from "react";

export function CozyLighting() {
  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.5} color="#ffecd2" />

      {/* Main warm key light from upper-right-front (where camera is) */}
      <directionalLight
        position={[4, 6, 4]}
        color="#ffe4c4"
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      {/* Desk lamp warm glow */}
      <pointLight
        position={[-0.5, 2.5, -0.5]}
        color="#ffb347"
        intensity={3}
        distance={5}
        decay={2}
      />

      {/* Monitor blue glow */}
      <pointLight
        position={[0, 1.5, -1.0]}
        color="#c6dafdff"
        intensity={1.0}
        distance={3}
        decay={2}
      />

      {/* Speaker cyan accent */}
      <pointLight
        position={[1.2, 1.3, -1.0]}
        color="#00ccff"
        intensity={0.5}
        distance={2.5}
        decay={2}
      />

      {/* Warm fill from behind */}
      <pointLight
        position={[-1, 1.5, -1.8]}
        color="#ff9966"
        intensity={0.6}
        distance={4}
        decay={2}
      />
    </>
  );
}
