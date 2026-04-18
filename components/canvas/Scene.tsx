"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import type { ProjectItem } from "@/types";
import ProjectCard3D from "./ProjectCard3D";

interface SceneProps {
  projects: ProjectItem[];
  onSelect: (project: ProjectItem) => void;
}

// Invisible boundaries to keep objects corralled
function Boundaries() {
  return (
    <>
      <RigidBody type="fixed" position={[0, -5, 0]}>
        <CuboidCollider args={[15, 0.5, 15]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 5, 0]}>
        <CuboidCollider args={[15, 0.5, 15]} />
      </RigidBody>
      <RigidBody type="fixed" position={[-6, 0, 0]}>
        <CuboidCollider args={[0.5, 15, 15]} />
      </RigidBody>
      <RigidBody type="fixed" position={[6, 0, 0]}>
        <CuboidCollider args={[0.5, 15, 15]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 0, -6]}>
        <CuboidCollider args={[15, 15, 0.5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 0, 4]}>
        <CuboidCollider args={[15, 15, 0.5]} />
      </RigidBody>
    </>
  );
}

// A central attractor force
function Attractor() {
  // We can just rely on the objects moving towards center inside the ProjectCard3D useFrame,
  // or we can just let them bounce freely in the bounds. For simplicity, bounds are enough,
  // but let's add a subtle pull towards [0,0,0] in the card itself.
  return null;
}

export default function Scene({ projects, onSelect }: SceneProps) {
  return (
    <Canvas
      className="!h-[500px] w-full rounded-2xl"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], fov: 45 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#a855f7" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#06b6d4" />
      
      {/* Physics World with zero gravity */}
      <Physics gravity={[0, 0, 0]} interpolate>
        <Boundaries />
        
        {projects.map((project, i) => {
          // Spread them out initially
          const x = (Math.random() - 0.5) * 8;
          const y = (Math.random() - 0.5) * 6;
          const z = (Math.random() - 0.5) * 4;
          
          return (
            <ProjectCard3D
              key={project.id}
              project={project}
              initialPosition={[x, y, z]}
              onClick={() => onSelect(project)}
            />
          );
        })}
      </Physics>
      
      {/* Invisible plane for catching PointerEvents to calculate drag un-projected positions */}
      {/* The pointer events are handled directly on the 3D meshes in ProjectCard3D via @use-gesture */}
    </Canvas>
  );
}
