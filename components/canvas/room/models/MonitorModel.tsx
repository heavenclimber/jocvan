import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useClonedGLTF, useModelInfo } from "./utils";

interface MonitorModelProps {
  onClick: () => void;
}

export function MonitorModel({ onClick }: MonitorModelProps) {
  const clonedScene = useClonedGLTF("/models/room/monitor.glb");
  const { size, center } = useModelInfo(clonedScene);
  const [hovered, setHovered] = useState(false);

  const targetHeight = 0.8;
  const scaleFactor = size.y > 0 ? targetHeight / size.y : 1;

  /* Screen glow pulse */
  useFrame((state) => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat.emissive) {
          const pulse = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
          mat.emissiveIntensity = hovered ? 0.6 : pulse;
          mat.emissive.setHex(0x4488ff);
        }
      }
    });
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  return (
    <group
      position={[
        -center.x * scaleFactor,
        -center.y * scaleFactor + size.y * scaleFactor + 0.75,
        -1.5 - center.z * scaleFactor,
      ]}
      scale={scaleFactor}
    >
      <primitive
        object={clonedScene}
        onClick={(e: any) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();
          setHovered(false);
        }}
      />

      {/* Tooltip in world-space above the monitor */}
      {hovered && (
        <Html
          position={[center.x, center.y + size.y + 0.5, center.z]}
          center
        >
          <div className="rpg-tooltip animate-rpg-tooltip-in">
            <span className="rpg-tooltip-icon">🖥️</span>
            <span>View Portfolio</span>
          </div>
        </Html>
      )}
    </group>
  );
}
