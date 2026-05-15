"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Sparkles,
  Html,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
 *  AUDIO
 * ═══════════════════════════════════════════════════════════════ */

const SONGS = [
  "/bgm/Gregory Alan Isakov - Amsterdam.mp3",
  "/bgm/Gregory Alan Isakov - Second Chances.mp3",
];

let audioInstance: HTMLAudioElement | null = null;
let currentSongIndex = 0;

function getAudio(): HTMLAudioElement {
  if (!audioInstance) {
    audioInstance = new Audio(SONGS[currentSongIndex]);
    audioInstance.volume = 0.3;
    audioInstance.loop = false;
    audioInstance.addEventListener("ended", () => {
      currentSongIndex = (currentSongIndex + 1) % SONGS.length;
      audioInstance!.src = SONGS[currentSongIndex];
      audioInstance!.play().catch(() => {});
    });
  }
  return audioInstance;
}

/* ═══════════════════════════════════════════════════════════════
 *  CAMERA CONTROLLER — maintains isometric look-at
 * ═══════════════════════════════════════════════════════════════ */

function CameraSetup() {
  const { camera } = useThree();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      camera.position.set(5, 4.5, 5);
      camera.lookAt(0, 0.8, -0.3);
      camera.updateProjectionMatrix();
      initialized.current = true;
    }
  }, [camera]);

  return null;
}

/* ═══════════════════════════════════════════════════════════════
 *  ROOM SHELL — Isometric diorama walls + floor
 * ═══════════════════════════════════════════════════════════════ */

function RoomShell() {
  const roomSize = 4;
  const wallHeight = 3;
  const floorThickness = 0.08;

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor slab with thickness ── */}
      <mesh position={[0, -floorThickness / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[roomSize, floorThickness, roomSize]} />
        <meshStandardMaterial color="#a07840" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Floor surface planks */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`plank-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.002, -roomSize / 2 + (i + 0.5) * (roomSize / 10)]}
        >
          <planeGeometry args={[roomSize, 0.015]} />
          <meshBasicMaterial color="#8a6830" transparent opacity={0.25} />
        </mesh>
      ))}

      {/* ── Back wall (facing +Z, camera sees front face) ── */}
      <mesh position={[0, wallHeight / 2, -roomSize / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomSize, wallHeight, 0.06]} />
        <meshStandardMaterial color="#c4b39a" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* ── Left wall (facing +X, camera sees front face) ── */}
      <mesh position={[-roomSize / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, wallHeight, roomSize]} />
        <meshStandardMaterial color="#b8a88e" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* ── Dark edge outlines ── */}
      {/* Vertical back-left corner */}
      <mesh position={[-roomSize / 2, wallHeight / 2, -roomSize / 2]}>
        <boxGeometry args={[0.05, wallHeight + 0.1, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Vertical back-right corner */}
      <mesh position={[roomSize / 2, wallHeight / 2, -roomSize / 2]}>
        <boxGeometry args={[0.05, wallHeight + 0.1, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Vertical front-left corner */}
      <mesh position={[-roomSize / 2, wallHeight / 2, roomSize / 2]}>
        <boxGeometry args={[0.05, wallHeight + 0.1, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Top back edge */}
      <mesh position={[0, wallHeight, -roomSize / 2]}>
        <boxGeometry args={[roomSize + 0.1, 0.05, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Top left edge */}
      <mesh position={[-roomSize / 2, wallHeight, 0]}>
        <boxGeometry args={[0.05, 0.05, roomSize + 0.1]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Floor front edge */}
      <mesh position={[0, -floorThickness, roomSize / 2]}>
        <boxGeometry args={[roomSize + 0.1, 0.05, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Floor right edge */}
      <mesh position={[roomSize / 2, -floorThickness, 0]}>
        <boxGeometry args={[0.05, 0.05, roomSize + 0.1]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Floor bottom-front-left to bottom-back-left */}
      <mesh position={[-roomSize / 2, -floorThickness, 0]}>
        <boxGeometry args={[0.05, 0.05, roomSize + 0.1]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Floor bottom-back */}
      <mesh position={[0, -floorThickness, -roomSize / 2]}>
        <boxGeometry args={[roomSize + 0.1, 0.05, 0.05]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  GLB MODEL LOADER — auto-centers and normalizes scale
 * ═══════════════════════════════════════════════════════════════ */

function useClonedGLTF(path: string) {
  const { scene } = useGLTF(path);
  return useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          mesh.material = (mesh.material as THREE.Material).clone();
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);
}

/* Helper to compute bounding box info */
function useModelInfo(scene: THREE.Object3D) {
  return useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    return { box, size, center };
  }, [scene]);
}

/* ═══════════════════════════════════════════════════════════════
 *  DESK MODEL — auto-scales to fit ~1.8 units wide on desk area
 * ═══════════════════════════════════════════════════════════════ */

function DeskModel() {
  const clonedScene = useClonedGLTF("/models/room/desk.glb");
  const { size, center } = useModelInfo(clonedScene);

  /* Scale to make desk about 2 units wide */
  const targetWidth = 2.0;
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = maxDim > 0 ? targetWidth / maxDim : 1;

  return (
    <group
      position={[
        -center.x * scaleFactor,
        -center.y * scaleFactor + (size.y * scaleFactor) / 2,
        -1.2 - center.z * scaleFactor,
      ]}
      scale={scaleFactor}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  MONITOR MODEL (interactive)
 * ═══════════════════════════════════════════════════════════════ */

interface MonitorModelProps {
  onClick: () => void;
}

function MonitorModel({ onClick }: MonitorModelProps) {
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

/* ═══════════════════════════════════════════════════════════════
 *  SPEAKER MODEL (interactive — plays music)
 * ═══════════════════════════════════════════════════════════════ */

interface SpeakerModelProps {
  playing: boolean;
  onToggle: (playing: boolean) => void;
}

function SpeakerModel({ playing, onToggle }: SpeakerModelProps) {
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

/* ═══════════════════════════════════════════════════════════════
 *  COZY LIGHTING
 * ═══════════════════════════════════════════════════════════════ */

function CozyLighting() {
  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight intensity={0.5} color="#ffecd2" />

      {/* Main warm key light from upper-right-front (where camera is) */}
      <directionalLight
        position={[4, 6, 4]}
        color="#ffe4c4"
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      {/* Desk lamp warm glow */}
      <pointLight
        position={[-0.5, 2.5, -0.5]}
        color="#ffb347"
        intensity={3}
        distance={5}
        decay={2}
      />

      {/* Monitor blue glow */}
      <pointLight
        position={[0, 1.5, -1.0]}
        color="#4488ff"
        intensity={1.5}
        distance={3}
        decay={2}
      />

      {/* Speaker cyan accent */}
      <pointLight
        position={[1.2, 1.3, -1.0]}
        color="#00ccff"
        intensity={0.5}
        distance={2.5}
        decay={2}
      />

      {/* Warm fill from behind */}
      <pointLight
        position={[-1, 1.5, -1.8]}
        color="#ff9966"
        intensity={0.6}
        distance={4}
        decay={2}
      />
    </>
  );
}

/* ── Floating dust motes ── */
function DustParticles() {
  const count = 40;
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 1] = Math.random() * 2.8 + 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] +=
        Math.sin(state.clock.elapsedTime * 0.2 + i * 0.5) * 0.0008;
      if (arr[i * 3 + 1] > 3) arr[i * 3 + 1] = 0.2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#ffecd2"
        size={0.025}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  SCENE CONTENT
 * ═══════════════════════════════════════════════════════════════ */

interface SceneContentProps {
  onMonitorClick: () => void;
  onSpeakerToggle: (playing: boolean) => void;
  speakerPlaying: boolean;
}

function SceneContent({
  onMonitorClick,
  onSpeakerToggle,
  speakerPlaying,
}: SceneContentProps) {
  return (
    <>
      <CameraSetup />
      <CozyLighting />

      {/* Room diorama shell */}
      <RoomShell />

      {/* Models */}
      <DeskModel />
      <MonitorModel onClick={onMonitorClick} />
      <SpeakerModel playing={speakerPlaying} onToggle={onSpeakerToggle} />

      {/* Contact shadows on the floor */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={5}
        blur={2}
        far={4}
      />

      {/* Atmosphere */}
      <DustParticles />
      <Sparkles
        count={15}
        scale={3}
        size={1}
        speed={0.1}
        color="#ffecd2"
        opacity={0.2}
      />

      {/* OrbitControls with tight limits for fine-tuning view */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minAzimuthAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        dampingFactor={0.05}
        enableDamping
        target={[0, 0.8, -0.3]}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  EXPORTED CANVAS
 * ═══════════════════════════════════════════════════════════════ */

interface RoomSceneProps {
  onMonitorClick: () => void;
  onSpeakerToggle: (playing: boolean) => void;
  speakerPlaying: boolean;
}

export default function RoomScene({
  onMonitorClick,
  onSpeakerToggle,
  speakerPlaying,
}: RoomSceneProps) {
  return (
    <Canvas
      camera={{
        position: [5, 4.5, 5],
        fov: 35,
        near: 0.1,
        far: 50,
      }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
      dpr={[1, 2]}
      shadows
      style={{ background: "transparent" }}
    >
      <SceneContent
        onMonitorClick={onMonitorClick}
        onSpeakerToggle={onSpeakerToggle}
        speakerPlaying={speakerPlaying}
      />
    </Canvas>
  );
}

/* Preload models */
useGLTF.preload("/models/room/desk.glb");
useGLTF.preload("/models/room/monitor.glb");
useGLTF.preload("/models/room/speaker.glb");
