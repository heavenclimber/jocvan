"use client";

import { Canvas } from "@react-three/fiber";
import { Sparkles, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CameraSetup } from "./room/CameraSetup";
import { CozyLighting } from "./room/CozyLighting";
import { RoomShell } from "./room/RoomShell";
import { DeskPCModel } from "./room/models/DeskPCModel";
import { BedModel } from "./room/models/BedModel";
import { WindowModel } from "./room/models/WindowModel";
import { SideTableModel } from "./room/models/SideTableModel";
import { DogModel } from "./room/models/DogModel";
import { LavaLampModel } from "./room/models/LavaLampModel";
import { DustParticles } from "./room/DustParticles";

/* ═══════════════════════════════════════════════════════════════
 *  SCENE CONTENT — Low-poly gamey room
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

      {/* ── Low-poly furniture ── */}
      <DeskPCModel onClick={onMonitorClick} />
      <BedModel />
      <WindowModel />
      <SideTableModel playing={speakerPlaying} onToggle={onSpeakerToggle} />
      <LavaLampModel />
      <DogModel />

      {/* Contact shadows on the floor */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={5}
        blur={1.5}
        far={4}
      />

      {/* Atmosphere — fewer sparkles, bigger for that game-particle feel */}
      <DustParticles />
      <Sparkles
        count={20}
        scale={3.5}
        size={1.5}
        speed={0.15}
        color="#ffecd2"
        opacity={0.25}
      />

      {/* OrbitControls */}
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

/* Preload lowpoly models */
useGLTF.preload("/models/room/lowpoly/desk_and_pc.glb");
useGLTF.preload("/models/room/lowpoly/bed__bedside_table.glb");
useGLTF.preload("/models/room/lowpoly/residential_window.glb");
useGLTF.preload("/models/room/lowpoly/simple_wooden_end_table.glb");
useGLTF.preload("/models/room/lowpoly/stylized_dog_low_poly.glb");
useGLTF.preload("/models/room/lowpoly/lava_lamp_alembic.glb");
