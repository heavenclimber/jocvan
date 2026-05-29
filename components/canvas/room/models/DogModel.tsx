import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useClonedGLTF, useModelInfo } from "./utils";

type AnimState = "idle" | "bark" | "dead" | "walk";

/**
 * Low-poly stylized dog — interactive with animations (idle, bark, dead, walk).
 */
export function DogModel() {
  const modelPath = "/models/room/lowpoly/stylized_dog_low_poly.glb";
  const { animations } = useGLTF(modelPath);
  const clonedScene = useClonedGLTF(modelPath);
  const { size, center } = useModelInfo(clonedScene);

  const outerGroupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const { actions, mixer } = useAnimations(animations, innerGroupRef);

  const [animState, setAnimState] = useState<AnimState>("idle");
  const [hovered, setHovered] = useState(false);

  /* Fit to roughly 0.5 units tall */
  const targetHeight = 0.5;
  const scaleFactor = size.y > 0 ? targetHeight / size.y : 1;

  const startPosition = useMemo(
    () =>
      new THREE.Vector3(
        0.8 - center.x * scaleFactor,
        -center.y * scaleFactor + (size.y * scaleFactor) / 2,
        0.6 - center.z * scaleFactor
      ),
    [center, size, scaleFactor]
  );

  const walkTarget = useRef(new THREE.Vector3());

  const getNewTarget = useCallback(() => {
    // Keep it somewhat near the start position
    const rx = (Math.random() - 0.5) * 2.5;
    const rz = (Math.random() - 0.5) * 2.5;
    walkTarget.current.set(
      startPosition.x + rx,
      startPosition.y,
      startPosition.z + rz
    );
  }, [startPosition]);

  // Handle animation states
  useEffect(() => {
    if (!actions || !actions[animState]) return;

    const action = actions[animState] as THREE.AnimationAction;
    action.reset().fadeIn(0.2).play();

    let timeout: NodeJS.Timeout;

    if (animState === "bark") {
      action.setLoop(THREE.LoopRepeat, 3);
      action.clampWhenFinished = true;
      const onFinished = (e: any) => {
        if (e.action === action) setAnimState("idle");
      };
      mixer.addEventListener("finished", onFinished);
      return () => {
        action.fadeOut(0.2);
        mixer.removeEventListener("finished", onFinished);
      };
    } else if (animState === "dead") {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      const onFinished = (e: any) => {
        if (e.action === action) {
          // Stay "dead" for 1.5 seconds before returning to idle
          timeout = setTimeout(() => setAnimState("idle"), 1500);
        }
      };
      mixer.addEventListener("finished", onFinished);
      return () => {
        action.fadeOut(0.2);
        mixer.removeEventListener("finished", onFinished);
        clearTimeout(timeout);
      };
    } else if (animState === "walk") {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
      // Walk for 8 seconds, then go idle
      timeout = setTimeout(() => {
        setAnimState("idle");
      }, 8000);
      return () => {
        action.fadeOut(0.2);
        clearTimeout(timeout);
      };
    } else {
      // idle
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
      return () => {
        action.fadeOut(0.2);
      };
    }
  }, [animState, actions, mixer]);

  // Hover cursor
  useEffect(() => {
    document.body.style.cursor = hovered && animState === "idle" ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, animState]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (animState !== "idle") return; // Only allow clicking when idle

    const choices: AnimState[] = ["bark", "dead", "walk"];
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];

    if (randomChoice === "walk") {
      getNewTarget();
    }
    setAnimState(randomChoice);
    setHovered(false); // Remove hover state while animating
  };

  // Movement logic during walk
  useFrame((_, delta) => {
    if (animState === "walk" && outerGroupRef.current) {
      const group = outerGroupRef.current;
      const distance = group.position.distanceTo(walkTarget.current);

      if (distance < 0.2) {
        getNewTarget();
      }

      // Move towards target
      const speed = 0.8;
      const dir = new THREE.Vector3()
        .subVectors(walkTarget.current, group.position)
        .normalize();
      
      // Update position
      group.position.add(dir.clone().multiplyScalar(speed * delta));

      // Update rotation to face target smoothly
      const targetRot = Math.atan2(dir.x, dir.z);
      
      // Angle diff handling for smooth rotation (shortest path)
      let diff = targetRot - group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      
      group.rotation.y += diff * 6 * delta;
    }
  });

  return (
    <group
      ref={outerGroupRef}
      position={startPosition}
      rotation={[0, Math.PI / 6, 0]}
      scale={scaleFactor}
    >
      <group ref={innerGroupRef}>
        <primitive
          object={clonedScene}
          onClick={handleClick}
          onPointerOver={(e: any) => {
            e.stopPropagation();
            if (animState === "idle") setHovered(true);
          }}
          onPointerOut={(e: any) => {
            e.stopPropagation();
            setHovered(false);
          }}
        />
      </group>
    </group>
  );
}
