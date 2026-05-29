import { useState, useEffect, useCallback } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useClonedGLTF, useModelInfo } from "./utils";
import { getAudio } from "../audio";

interface SideTableModelProps {
  playing: boolean;
  onToggle: (playing: boolean) => void;
}

/**
 * Low-poly side table — acts as the music player interaction point.
 * Click to toggle background music.
 */
export function SideTableModel({ playing, onToggle }: SideTableModelProps) {
  const clonedScene = useClonedGLTF("/models/room/lowpoly/simple_wooden_end_table.glb");
  const { size, center } = useModelInfo(clonedScene);
  const [hovered, setHovered] = useState(false);

  /* Fit to roughly 0.6 units tall */
  const targetHeight = 0.6;
  const scaleFactor = size.y > 0 ? targetHeight / size.y : 1;

  /* Glow when playing or hovered */
  useFrame((state) => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat.emissive) {
          if (playing) {
            const t = state.clock.elapsedTime;
            mat.emissiveIntensity = 0.2 + Math.sin(t * 3) * 0.15;
            mat.emissive.setHex(0x00ccff);
          } else {
            mat.emissiveIntensity = hovered ? 0.12 : 0;
          }
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

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      const audio = getAudio();
      if (playing) {
        audio.pause();
        onToggle(false);
      } else {
        audio.play().catch(() => {});
        onToggle(true);
      }
    },
    [playing, onToggle]
  );

  return (
    <group
      position={[
        1.3 - center.x * scaleFactor,
        -center.y * scaleFactor + (size.y * scaleFactor) / 2,
        -1.3 - center.z * scaleFactor,
      ]}
      scale={scaleFactor}
    >
      <primitive
        object={clonedScene}
        onClick={handleClick}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();
          setHovered(false);
        }}
      />

      {/* Floating music note when playing */}
      {playing && (
        <group position={[center.x, center.y + size.y + 0.3, center.z]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i}>
              <ringGeometry args={[0.15 + i * 0.12, 0.17 + i * 0.12, 6]} />
              <meshBasicMaterial
                color="#00ccff"
                transparent
                opacity={0.3 - i * 0.08}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Tooltip */}
      {hovered && (
        <Html
          position={[center.x, center.y + size.y + 0.5, center.z]}
          center
        >
          <div className="rpg-tooltip animate-rpg-tooltip-in">
            <span className="rpg-tooltip-icon">
              {playing ? "⏸️" : "🔊"}
            </span>
            <span>{playing ? "Pause Music" : "Play Music"}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
