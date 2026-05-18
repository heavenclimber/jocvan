import React from "react";

export function RoomShell() {
  const roomSize = 4;
  const wallHeight = 3;
  const floorThickness = 0.08;

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor slab with thickness ── */}
      <mesh position={[0, -floorThickness / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[roomSize, floorThickness, roomSize]} />
        <meshStandardMaterial color="#a07840" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Floor surface planks */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`plank-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.002, -roomSize / 2 + (i + 0.5) * (roomSize / 10)]}
        >
          <planeGeometry args={[roomSize, 0.015]} />
          <meshBasicMaterial color="#8a6830" transparent opacity={0.25} />
        </mesh>
      ))}

      {/* ── Back wall (facing +Z, camera sees front face) ── */}
      <mesh position={[0, wallHeight / 2, -roomSize / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomSize, wallHeight, 0.06]} />
        <meshStandardMaterial color="#c4b39a" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* ── Left wall (facing +X, camera sees front face) ── */}
      <mesh position={[-roomSize / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, wallHeight, roomSize]} />
        <meshStandardMaterial color="#b8a88e" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* ── Dark edge outlines ── */}
      {/* Vertical back-left corner */}
      <mesh position={[-roomSize / 2, wallHeight / 2, -roomSize / 2]}>
        <boxGeometry args={[0.05, wallHeight + 0.1, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Vertical back-right corner */}
      <mesh position={[roomSize / 2, wallHeight / 2, -roomSize / 2]}>
        <boxGeometry args={[0.05, wallHeight + 0.1, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Vertical front-left corner */}
      <mesh position={[-roomSize / 2, wallHeight / 2, roomSize / 2]}>
        <boxGeometry args={[0.05, wallHeight + 0.1, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Top back edge */}
      <mesh position={[0, wallHeight, -roomSize / 2]}>
        <boxGeometry args={[roomSize + 0.1, 0.05, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Top left edge */}
      <mesh position={[-roomSize / 2, wallHeight, 0]}>
        <boxGeometry args={[0.05, 0.05, roomSize + 0.1]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Floor front edge */}
      <mesh position={[0, -floorThickness, roomSize / 2]}>
        <boxGeometry args={[roomSize + 0.1, 0.05, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Floor right edge */}
      <mesh position={[roomSize / 2, -floorThickness, 0]}>
        <boxGeometry args={[0.05, 0.05, roomSize + 0.1]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Floor bottom-front-left to bottom-back-left */}
      <mesh position={[-roomSize / 2, -floorThickness, 0]}>
        <boxGeometry args={[0.05, 0.05, roomSize + 0.1]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Floor bottom-back */}
      <mesh position={[0, -floorThickness, -roomSize / 2]}>
        <boxGeometry args={[roomSize + 0.1, 0.05, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
}
