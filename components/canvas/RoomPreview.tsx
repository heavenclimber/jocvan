"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
 *  MINI ROOM — lightweight isometric preview (no GLB models)
 *  Shows a stylized room silhouette for the teaser section.
 * ═══════════════════════════════════════════════════════════════ */

function MiniDesk() {
  return (
    <group position={[0, 0, -0.6]}>
      {/* Desk top */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.6, 0.06, 0.7]} />
        <meshStandardMaterial color="#3a2820" roughness={0.8} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.7, 0.26, 0]} castShadow>
        <boxGeometry args={[0.06, 0.52, 0.6]} />
        <meshStandardMaterial color="#2a1a14" roughness={0.9} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.7, 0.26, 0]} castShadow>
        <boxGeometry args={[0.06, 0.52, 0.6]} />
        <meshStandardMaterial color="#2a1a14" roughness={0.9} />
      </mesh>
    </group>
  );
}

function MiniMonitor() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
  });

  return (
    <group position={[0, 0.58, -0.75]}>
      {/* Screen */}
      <mesh ref={meshRef} position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.7, 0.45, 0.04]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#4488ff"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.06, 0.16, 0.04]} />
        <meshStandardMaterial color="#374151" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.01, 0.05]} castShadow>
        <boxGeometry args={[0.25, 0.02, 0.15]} />
        <meshStandardMaterial color="#374151" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  );
}

function MiniSpeaker() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.z = Math.sin(t * 15) * 0.002;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.15 + Math.sin(t * 3) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0.55, 0.58, -0.68]}>
      <mesh ref={meshRef} position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.15, 0.28, 0.12]} />
        <meshStandardMaterial
          color="#1f1f1f"
          emissive="#00ccff"
          emissiveIntensity={0.15}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

function MiniRoom() {
  const size = 2.2;
  const wallH = 1.6;

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[size, 0.04, size]} />
        <meshStandardMaterial color="#a07840" roughness={0.85} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, wallH / 2, -size / 2]} castShadow>
        <boxGeometry args={[size, wallH, 0.04]} />
        <meshStandardMaterial color="#c4b39a" roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-size / 2, wallH / 2, 0]} castShadow>
        <boxGeometry args={[0.04, wallH, size]} />
        <meshStandardMaterial color="#b8a88e" roughness={0.9} />
      </mesh>

      {/* Dark edges */}
      <mesh position={[-size / 2, wallH / 2, -size / 2]}>
        <boxGeometry args={[0.03, wallH + 0.06, 0.03]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[size / 2, wallH / 2, -size / 2]}>
        <boxGeometry args={[0.03, wallH + 0.06, 0.03]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[-size / 2, wallH / 2, size / 2]}>
        <boxGeometry args={[0.03, wallH + 0.06, 0.03]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, wallH, -size / 2]}>
        <boxGeometry args={[size + 0.06, 0.03, 0.03]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[-size / 2, wallH, 0]}>
        <boxGeometry args={[0.03, 0.03, size + 0.06]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>

      {/* Furniture */}
      <MiniDesk />
      <MiniMonitor />
      <MiniSpeaker />

      {/* Contact shadows */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.35}
        scale={3}
        blur={2}
        far={2}
      />
    </group>
  );
}

/* Slow auto-rotate for the preview */
function AutoRotate() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.12;
  });

  return <group ref={groupRef}><MiniRoom /></group>;
}

/* ── Floating dust particles ── */
function TeaserDust() {
  const count = 15;
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = Math.random() * 1.5 + 0.1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.0006;
      if (arr[i * 3 + 1] > 1.6) arr[i * 3 + 1] = 0.1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#ffecd2"
        size={0.02}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  EXPORTED CANVAS — lightweight preview
 * ═══════════════════════════════════════════════════════════════ */

export default function RoomPreview() {
  return (
    <Canvas
      camera={{
        position: [3, 2.5, 3],
        fov: 35,
        near: 0.1,
        far: 30,
      }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 1.5]}
      shadows
      style={{ background: "transparent", pointerEvents: "none" }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 0.5, -0.2);
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#ffecd2" />
      <directionalLight
        position={[3, 4, 3]}
        color="#ffe4c4"
        intensity={0.8}
        castShadow
      />
      <pointLight position={[0, 1.2, -0.4]} color="#4488ff" intensity={0.8} distance={3} decay={2} />
      <pointLight position={[0.5, 1, -0.3]} color="#00ccff" intensity={0.3} distance={2} decay={2} />
      <pointLight position={[-0.3, 1.5, 0]} color="#ffb347" intensity={1.5} distance={3} decay={2} />

      <AutoRotate />
      <TeaserDust />
    </Canvas>
  );
}
