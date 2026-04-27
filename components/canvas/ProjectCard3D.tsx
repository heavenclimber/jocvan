"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";
import type { ProjectItem } from "@/types";

interface ProjectCard3DProps {
  project: ProjectItem;
  orbitRadius: number;
  orbitSpeed: number;
  initialAngle: number;
  isSelected: boolean;
  onPositionUpdate: (pos: THREE.Vector3) => void;
  onClick: () => void;
}

export default function ProjectCard3D({
  project,
  orbitRadius,
  orbitSpeed,
  initialAngle,
  isSelected,
  onPositionUpdate,
  onClick,
}: ProjectCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Safe load texture
  const texture = useTexture(project.image);
  
  // Track orbit angle internally so we can pause it smoothly
  const currentAngle = useRef(initialAngle);

  // Hover cursor
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    
    // 1. Self Rotation (always spins)
    meshRef.current.rotation.y += delta * 0.5;

    // 2. Orbiting (pauses when selected)
    if (!isSelected) {
      currentAngle.current += delta * orbitSpeed;
    }

    // Calculate position on the orbit path (XZ plane)
    const x = Math.cos(currentAngle.current) * orbitRadius;
    const z = Math.sin(currentAngle.current) * orbitRadius;

    // Optional: add a slight Y wobble based on time
    const yWobble = Math.sin(state.clock.elapsedTime + initialAngle) * 0.5;

    // Use lerp for smooth position transitions
    const targetPosition = new THREE.Vector3(x, yWobble, z);
    groupRef.current.position.lerp(targetPosition, 0.1);
    
    // Report position to parent
    onPositionUpdate(groupRef.current.position);

    // Scale animation
    const targetScale = hovered || isSelected ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
           map={texture} 
           metalness={0.4} 
           roughness={0.2}
           emissive={hovered || isSelected ? "#a855f7" : "#000000"}
           emissiveIntensity={hovered || isSelected ? 0.6 : 0}
        />
      </mesh>
      
      {/* Floating title label below the planet */}
      <Text
        position={[0, -2.0, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {project.title}
      </Text>
    </group>
  );
}
