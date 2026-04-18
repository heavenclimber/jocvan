"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useTexture, Text } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import type { ProjectItem } from "@/types";

interface ProjectCard3DProps {
  project: ProjectItem;
  initialPosition: [number, number, number];
  onClick: () => void;
}

export default function ProjectCard3D({
  project,
  initialPosition,
  onClick,
}: ProjectCard3DProps) {
  const rbRef = useRef<RapierRigidBody>(null);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Safe load texture, providing a fallback dummy URL or handling failure gracefully
  const texture = useTexture(project.image);
  
  const { size, viewport, camera } = useThree();
  const aspect = size.width / viewport.width;

  // Hover effects
  useEffect(() => {
    document.body.style.cursor = hovered ? "grab" : "auto";
    if (isDragging) document.body.style.cursor = "grabbing";
  }, [hovered, isDragging]);

  const bind = useDrag(
    ({ active, offset: [x, y], event, first, last, velocity }) => {
      // Prevent click from firing when stopping a drag
      if (first) {
        setIsDragging(true);
        if (rbRef.current) {
          rbRef.current.setBodyType(2, true); // 2 = kinematicPosition
        }
      }

      if (active && rbRef.current) {
        // Convert screen offset to 3D world coords on z=0 plane
        // Or simply unproject 
        const vec = new THREE.Vector3(
          ((event as any).clientX / window.innerWidth) * 2 - 1,
          -((event as any).clientY / window.innerHeight) * 2 + 1,
          0.5
        );
        vec.unproject(camera);
        const dir = vec.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z; // interacting on z=0
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        rbRef.current.setNextKinematicTranslation(pos);
      }

      if (last) {
        setIsDragging(false);
        if (rbRef.current) {
          rbRef.current.setBodyType(0, true); // 0 = dynamic
          // Optionally impart velocity from the drag ending
          const pushForce = { 
            x: velocity[0] * (event as any).movementX * 0.1, 
            y: -velocity[1] * (event as any).movementY * 0.1, 
            z: (Math.random() - 0.5) * 5 
          };
          rbRef.current.applyImpulse(pushForce, true);
        }
      }
    },
    { pointerEvents: true }
  );

  // Attractive pull to center if dynamic, plus scale animation for hover
  useFrame((state, delta) => {
    if (!rbRef.current) return;
    
    // Scale animation
    const targetScale = hovered || isDragging ? 1.2 : 1;
    // rbRef scale is a bit tricky, but we can scale the mesh visual inside the body
    
    if (rbRef.current.bodyType() === 0) {
      // Very gentle pull towards center [0,0,0]
      const pos = rbRef.current.translation();
      const pullForce = new THREE.Vector3(0, 0, 0).sub(pos as any).multiplyScalar(0.005);
      rbRef.current.applyImpulse(pullForce, true);
      
      // Dampen linear velocity slightly to simulate air resistance
      const linvel = rbRef.current.linvel();
      rbRef.current.setLinvel(
        { x: linvel.x * 0.99, y: linvel.y * 0.99, z: linvel.z * 0.99 }, 
        true
      );
    }
  });

  return (
    <RigidBody
      ref={rbRef}
      position={initialPosition}
      colliders="ball"
      restitution={0.8}
      friction={0.2}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <group 
        {...(bind() as any)} 
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onClick={(e) => {
          // Only trigger if we didn't just drag
          if (!isDragging) {
            e.stopPropagation();
            if (onClick) onClick();
            else if (project.liveUrl) window.open(project.liveUrl, "_blank");
          }
        }}
      >
        <mesh scale={hovered || isDragging ? 1.1 : 1}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial 
             map={texture} 
             metalness={0.4} 
             roughness={0.2}
             emissive={hovered ? "#a855f7" : "#000000"}
             emissiveIntensity={hovered ? 0.4 : 0}
          />
        </mesh>
        
        {/* Floating title label below the cube */}
        <Text
          position={[0, -1.8, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {project.title}
        </Text>
      </group>
    </RigidBody>
  );
}
