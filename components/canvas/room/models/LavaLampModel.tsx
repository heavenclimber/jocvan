import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useClonedGLTF, useModelInfo } from "./utils";

/**
 * Low-poly lava lamp — decorative accent piece on the side table area.
 * Has a gentle color-cycling glow and plays its internal fluid animation.
 */
export function LavaLampModel() {
  const modelPath = "/models/room/lowpoly/lava_lamp_alembic.glb";
  const { animations } = useGLTF(modelPath);
  const clonedScene = useClonedGLTF(modelPath);
  const { size, center } = useModelInfo(clonedScene);
  const groupRef = useRef<THREE.Group>(null);
  
  const { actions } = useAnimations(animations, groupRef);

  // Play default animation
  useEffect(() => {
    if (actions) {
      const actionName = Object.keys(actions)[0];
      if (actionName && actions[actionName]) {
        actions[actionName].play();
      }
    }
  }, [actions]);

  /* Fit to roughly 0.35 units tall */
  const targetHeight = 0.35;
  const scaleFactor = size.y > 0 ? targetHeight / size.y : 1;

  /* Color-cycling glow */
  useFrame((state) => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat.emissive) {
          const t = state.clock.elapsedTime;
          const hue = (Math.sin(t * 0.5) * 0.5 + 0.5) * 0.15 + 0.0; // warm red-orange range
          mat.emissive.setHSL(hue, 0.8, 0.5);
          mat.emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.15;
        }
      }
    });
  });

  return (
    <group
      ref={groupRef}
      position={[
        1.3 - center.x * scaleFactor,
        0.6 - center.y * scaleFactor + (size.y * scaleFactor) / 2,
        -1.3 - center.z * scaleFactor,
      ]}
      scale={scaleFactor}
    >
      <primitive object={clonedScene} />
    </group>
  );
}
