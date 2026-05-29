import React from "react";

/**
 * Cozy, warm ambience — welcoming and soft lighting.
 */
export function CozyLighting() {
  return (
    <>
      {/* Warm ambient fill for a soft baseline */}
      <ambientLight intensity={0.8} color="#ffe8d6" />

      {/* Main directional sun/room light — warm and soft */}
      <directionalLight
        position={[3, 5, 4]}
        color="#ffd7b5"
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />

      {/* PC screen blue glow (subtle) */}
      <pointLight
        position={[-0.3, 1.3, -1.0]}
        color="#88ccff"
        intensity={0.8}
        distance={3}
        decay={2}
      />

      {/* Lava lamp warm accent */}
      <pointLight
        position={[1.3, 1.2, -1.3]}
        color="#ff6633"
        intensity={1.5}
        distance={4}
        decay={2}
      />

      {/* Window fill — subtle cool daylight coming in */}
      <pointLight
        position={[-0.5, 2.0, -1.8]}
        color="#e0f0ff"
        intensity={0.6}
        distance={5}
        decay={2}
      />
    </>
  );
}
