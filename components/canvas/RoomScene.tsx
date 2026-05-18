"use client";

import { Canvas } from "@react-three/fiber";
import { Sparkles, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CameraSetup } from "./room/CameraSetup";
import { CozyLighting } from "./room/CozyLighting";
import { RoomShell } from "./room/RoomShell";
import { DeskModel } from "./room/models/DeskModel";
import { MonitorModel } from "./room/models/MonitorModel";
import { SpeakerModel } from "./room/models/SpeakerModel";
import { DustParticles } from "./room/DustParticles";

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
