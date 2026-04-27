"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import type { ProjectItem } from "@/types";
import ProjectCard3D from "./ProjectCard3D";

interface SceneProps {
  projects: ProjectItem[];
  selectedProject: ProjectItem | null;
  onSelect: (project: ProjectItem) => void;
}

function GlowingCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
      coreRef.current.rotation.x += delta * 0.1;
      // Pulse scale
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={coreRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={2}
        wireframe
      />
      <pointLight color="#a855f7" intensity={2} distance={20} />
    </mesh>
  );
}

function CameraController({ 
  selectedProject, 
  planetPositions 
}: { 
  selectedProject: ProjectItem | null;
  planetPositions: React.MutableRefObject<Record<string, THREE.Vector3>>;
}) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (selectedProject && planetPositions.current[selectedProject.id]) {
      const pos = planetPositions.current[selectedProject.id];
      // Target camera position: right and forward
      const targetPos = new THREE.Vector3(pos.x + 3.5, pos.y + 1, pos.z + 6);
      camera.position.lerp(targetPos, 0.05);
      
      // Look at a point to the right of the planet so the planet is on the left
      const targetLookAt = new THREE.Vector3(pos.x + 3.5, pos.y, pos.z);
      currentLookAt.current.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt.current);
    } else {
      // Return to overview
      const targetPos = new THREE.Vector3(0, 10, 18);
      camera.position.lerp(targetPos, 0.04);
      
      const targetLookAt = new THREE.Vector3(0, 0, 0);
      currentLookAt.current.lerp(targetLookAt, 0.04);
      camera.lookAt(currentLookAt.current);
    }
  });
  return null;
}

export default function Scene({ projects, selectedProject, onSelect }: SceneProps) {
  const planetPositions = useRef<Record<string, THREE.Vector3>>({});

  return (
    <Canvas
      className="h-full w-full rounded-2xl"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 10, 18], fov: 45 }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#a855f7" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#06b6d4" />
      
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      <GlowingCore />
      
      <CameraController 
        selectedProject={selectedProject} 
        planetPositions={planetPositions} 
      />

      {projects.map((project, i) => {
        // Distribute planets in orbits
        const orbitRadius = 6 + i * 2.5; // spaced out
        const orbitSpeed = 0.2 + (projects.length - i) * 0.05; // inner planets faster
        const initialAngle = (i / projects.length) * Math.PI * 2;
        
        return (
          <ProjectCard3D
            key={project.id}
            project={project}
            orbitRadius={orbitRadius}
            orbitSpeed={orbitSpeed}
            initialAngle={initialAngle}
            isSelected={selectedProject?.id === project.id}
            onPositionUpdate={(pos) => {
              planetPositions.current[project.id] = pos.clone();
            }}
            onClick={() => onSelect(project)}
          />
        );
      })}
    </Canvas>
  );
}
