import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

/**
 * Low-poly isometric room shell — gamey diorama vibes.
 * Wall features stylized repeating wallpaper.
 */
export function RoomShell() {
  const roomSize = 4;
  const wallHeight = 3;
  const floorThickness = 0.1;

  // Load and setup repeating wall texture
  const wallTex = useTexture("/textures/wall_texture.png");
  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.repeat.set(2, 1.5);
  // To avoid color washing out, set colorSpace correctly
  wallTex.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor slab ── */}
      <mesh position={[0, -floorThickness / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[roomSize, floorThickness, roomSize]} />
        <meshStandardMaterial
          color="#8B7355"
          roughness={1}
          metalness={0}
          flatShading
        />
      </mesh>

      {/* Low-poly floor plank lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`plank-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.003, -roomSize / 2 + (i + 0.5) * (roomSize / 8)]}
        >
          <planeGeometry args={[roomSize, 0.02]} />
          <meshBasicMaterial color="#6B5B3E" transparent opacity={0.35} />
        </mesh>
      ))}

      {/* ── Back wall ── */}
      <mesh position={[0, wallHeight / 2, -roomSize / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomSize, wallHeight, 0.08]} />
        <meshStandardMaterial
          map={wallTex}
          color="#bbccdd"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* ── Left wall ── */}
      <mesh position={[-roomSize / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, wallHeight, roomSize]} />
        <meshStandardMaterial
          map={wallTex}
          color="#bbccdd"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* ── Bold dark edge outlines (gamey style) ── */}
      {/* Vertical corners */}
      <mesh position={[-roomSize / 2, wallHeight / 2, -roomSize / 2]}>
        <boxGeometry args={[0.06, wallHeight + 0.12, 0.06]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[roomSize / 2, wallHeight / 2, -roomSize / 2]}>
        <boxGeometry args={[0.06, wallHeight + 0.12, 0.06]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[-roomSize / 2, wallHeight / 2, roomSize / 2]}>
        <boxGeometry args={[0.06, wallHeight + 0.12, 0.06]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>

      {/* Top edges */}
      <mesh position={[0, wallHeight, -roomSize / 2]}>
        <boxGeometry args={[roomSize + 0.12, 0.06, 0.06]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[-roomSize / 2, wallHeight, 0]}>
        <boxGeometry args={[0.06, 0.06, roomSize + 0.12]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>

      {/* Floor edges */}
      <mesh position={[0, -floorThickness, roomSize / 2]}>
        <boxGeometry args={[roomSize + 0.12, 0.06, 0.06]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[roomSize / 2, -floorThickness, 0]}>
        <boxGeometry args={[0.06, 0.06, roomSize + 0.12]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[-roomSize / 2, -floorThickness, 0]}>
        <boxGeometry args={[0.06, 0.06, roomSize + 0.12]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, -floorThickness, -roomSize / 2]}>
        <boxGeometry args={[roomSize + 0.12, 0.06, 0.06]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>

      {/* ── Low-poly rug on the floor ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, Math.PI / 4]}
        position={[0.3, 0.005, 0.2]}
      >
        <circleGeometry args={[0.9, 6]} />
        <meshStandardMaterial
          color="#D4845A"
          roughness={1}
          metalness={0}
          flatShading
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Rug inner ring */}
      <mesh
        rotation={[-Math.PI / 2, 0, Math.PI / 4]}
        position={[0.3, 0.006, 0.2]}
      >
        <circleGeometry args={[0.55, 6]} />
        <meshStandardMaterial
          color="#C4734A"
          roughness={1}
          metalness={0}
          flatShading
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
