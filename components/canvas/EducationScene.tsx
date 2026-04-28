"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Sparkles,
  Stars,
  PresentationControls,
} from "@react-three/drei";
import * as THREE from "three";

function GlowingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      glowRef.current.scale.setScalar(pulse * 1.6);
    }
  });

  return (
    <group>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} />
      </mesh>

      {/* Central core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshPhysicalMaterial
          color="#1e40af"
          emissive="#3b82f6"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          wireframe
        />
      </mesh>

      {/* Inner solid core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshPhysicalMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

function AbstractComposition() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={group}>
      <GlowingCore />

      {/* Orbiting Halo */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.5, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={2}
          />
        </mesh>
      </Float>

      {/* Second Ring */}
      <Float speed={1.5} rotationIntensity={3} floatIntensity={1}>
        <mesh rotation={[-Math.PI / 4, Math.PI / 2, 0]}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#94a3b8"
            emissiveIntensity={1}
          />
        </mesh>
      </Float>

      {/* Small floating data nodes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const radius = 4;
        const theta = (i / 8) * Math.PI * 2;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        const y = Math.sin(theta * 2) * 1.5;

        return (
          <Float
            key={i}
            speed={2 + i * 0.3}
            floatIntensity={1.5}
            rotationIntensity={2}
          >
            <mesh position={[x, y, z]}>
              <octahedronGeometry args={[0.2, 0]} />
              <meshStandardMaterial
                color="#93c5fd"
                emissive="#3b82f6"
                emissiveIntensity={1}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default function EducationScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#000814"]} />
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
        />
        <pointLight
          position={[-10, -10, -10]}
          color="#3b82f6"
          intensity={0.5}
        />

        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          snap
          damping={0.1}
        >
          <AbstractComposition />
        </PresentationControls>

        <Sparkles count={60} scale={10} size={2} speed={0.4} color="#60a5fa" />
        <Stars
          radius={50}
          depth={50}
          count={500}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
    </div>
  );
}
