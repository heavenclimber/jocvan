"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

function Shapes() {
  const group = useRef<THREE.Group>(null);
  const count = 30;

  const shapes = useMemo(() => {
    return new Array(count).fill(0).map(() => {
      // Spread them across a wide area behind the content
      const position = [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 15, // Push them back
      ] as [number, number, number];
      
      const rotation = [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0,
      ] as [number, number, number];
      
      const scale = Math.random() * 0.8 + 0.3;
      
      return { position, rotation, scale };
    });
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
      group.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {shapes.map((props, i) => (
        <Float 
          key={i} 
          speed={1 + Math.random() * 2} 
          rotationIntensity={1.5} 
          floatIntensity={2}
          position={props.position}
        >
          <mesh rotation={props.rotation} scale={props.scale}>
            {i % 3 === 0 ? (
              <icosahedronGeometry args={[1, 0]} />
            ) : i % 3 === 1 ? (
              <torusGeometry args={[0.8, 0.2, 16, 32]} />
            ) : (
              <octahedronGeometry args={[1, 0]} />
            )}
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#a855f7" : "#6366f1"} /* Purple and Indigo mix */
              wireframe={i % 4 === 0}
              transparent
              opacity={i % 4 === 0 ? 0.2 : 0.08} /* Subtle opacity */
              roughness={0.1}
              metalness={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function SubtleBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-slate-50 dark:bg-neutral-950 transition-colors duration-500">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} color="#a855f7" intensity={1} />
        <Shapes />
      </Canvas>
      {/* A soft gradient overlay to softly mask edges and add atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40 dark:to-black/40" />
    </div>
  );
}
