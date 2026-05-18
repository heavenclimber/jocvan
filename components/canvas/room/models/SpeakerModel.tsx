import { useState, useEffect, useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useClonedGLTF, useModelInfo } from "./utils";
import { getAudio } from "../audio";

interface SpeakerModelProps {
  playing: boolean;
  onToggle: (playing: boolean) => void;
}

export function SpeakerModel({ playing, onToggle }: SpeakerModelProps) {
  const clonedScene = useClonedGLTF("/models/room/speaker.glb");
  const { size, center } = useModelInfo(clonedScene);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const targetHeight = 0.6;
  const scaleFactor = size.y > 0 ? targetHeight / size.y : 1;

  /* Speaker vibration + glow */
  useFrame((state) => {
    if (!groupRef.current) return;
    if (playing) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.z = Math.sin(t * 25) * 0.004;

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh)
            .material as THREE.MeshStandardMaterial;
          if (mat.emissive) {
            mat.emissiveIntensity = 0.25 + Math.sin(t * 4) * 0.2;
            mat.emissive.setHex(0x00ccff);
          }
        }
      });
    } else {
      groupRef.current.rotation.z = 0;

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh)
            .material as THREE.MeshStandardMaterial;
          if (mat.emissive) {
            mat.emissiveIntensity = hovered ? 0.15 : 0;
          }
        }
      });
    }
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
      ref={groupRef}
      position={[
        1.2 - center.x * scaleFactor,
        -center.y * scaleFactor + size.y * scaleFactor + 0.75,
        -1.5 - center.z * scaleFactor,
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

      {/* Sound wave rings when playing */}
      {playing && (
        <group position={[center.x, center.y + size.y * 0.6, center.z + 0.3]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i}>
              <ringGeometry
                args={[0.3 + i * 0.25, 0.33 + i * 0.25, 32]}
              />
              <meshBasicMaterial
                color="#00ccff"
                transparent
                opacity={0.25 - i * 0.06}
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
