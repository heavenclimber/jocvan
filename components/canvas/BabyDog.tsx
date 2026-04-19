"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface BabyDogProps {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
}

export default function BabyDog({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: BabyDogProps) {
  const group = useRef<THREE.Group>(null);
  const { scene: originalScene, animations } = useGLTF(
    "/models/animated_dog_shiba_inu.glb",
  );

  useEffect(() => {
    originalScene.traverse((child) => {
      console.log(child.type, child.name, child.position);
    });
  }, [originalScene]);

  const { actions, names } = useAnimations(animations, group);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  // Play idle / first animation on load
  useEffect(() => {
    if (names.length > 0) {
      const idle = names[0];
      actions[idle]?.reset().fadeIn(0.3).play();
      setCurrentAction(idle);
    }
  }, [actions, names]);

  // Cursor style on hover
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  const handleClick = useCallback(
    (e: THREE.Event) => {
      e.stopPropagation();
      if (names.length === 0) return;

      // Pick a random animation different from the current one
      let candidates = names.filter((n) => n !== currentAction);
      if (candidates.length === 0) candidates = names;
      const randomName =
        candidates[Math.floor(Math.random() * candidates.length)];

      // Cross-fade from current to new animation
      if (currentAction && actions[currentAction]) {
        actions[currentAction]?.fadeOut(0.3);
      }

      const newAction = actions[randomName];
      if (newAction) {
        newAction.reset().fadeIn(0.3).play();
        setCurrentAction(randomName);
      }
    },
    [actions, names, currentAction],
  );

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <group position={[0, -3, 0]}>
        <primitive object={originalScene} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/animated_dog_shiba_inu.glb");
