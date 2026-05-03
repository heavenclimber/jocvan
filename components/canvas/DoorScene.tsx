"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  Html,
  Sparkles,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────
 *  Door model – loads door.glb, plays open animation on click,
 *  and drives a camera zoom toward the door.
 * ───────────────────────────────────────────────────────── */

interface DoorModelProps {
  onAnimationDone: () => void;
}

function DoorModel({ onAnimationDone }: DoorModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/door.glb");
  const { actions, mixer } = useAnimations(animations, group);
  const { camera } = useThree();

  const [zoomPhase, setZoomPhase] = useState<0 | 1 | 2>(0);
  const [hovering, setHovering] = useState(false);

  /* Subtle idle float */
  const idleTime = useRef(0);

  /* Camera zoom state */
  const zoomProgress = useRef(0);
  const startCamPos = useRef(new THREE.Vector3());
  const startCamLookAt = useRef(new THREE.Vector3());

  /* ── Camera zoom targets ── */
  const PHASE1_POS = new THREE.Vector3(0, 0.8, 2.5); // Close to door
  const PHASE1_LOOK = new THREE.Vector3(0, 0.8, 0.0);
  const PHASE1_DURATION = 0.8;

  const PHASE2_POS = new THREE.Vector3(0, 0.8, -0.6); // Through the door
  const PHASE2_LOOK = new THREE.Vector3(0, 0.8, -2.0);
  const PHASE2_DURATION = 0.4;

  /* ── Hover pointer ── */
  useEffect(() => {
    document.body.style.cursor =
      hovering && zoomPhase === 0 ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovering, zoomPhase]);

  /* ── Handle click: play open animation + start Phase 1 zoom ── */
  const handleClick = useCallback(() => {
    if (zoomPhase !== 0) return;
    setZoomPhase(1);
    setHovering(false);

    startCamPos.current.copy(camera.position);
    startCamLookAt.current
      .copy(camera.position)
      .add(camera.getWorldDirection(new THREE.Vector3()));
    zoomProgress.current = 0;

    const clipNames = Object.keys(actions);
    const openAction =
      actions["DoorOpen"] ||
      actions["Open"] ||
      actions["open"] ||
      actions["door_open"] ||
      (clipNames.length > 0 ? actions[clipNames[0]] : null);

    if (openAction) {
      openAction.setLoop(THREE.LoopOnce, 1);
      openAction.clampWhenFinished = true;
      openAction.reset().play();

      const onFinished = (e: { action: THREE.AnimationAction }) => {
        if (e.action === openAction) {
          mixer.removeEventListener("finished", onFinished);
          // Start Phase 2 Zoom
          setZoomPhase(2);
          zoomProgress.current = 0;
          startCamPos.current.copy(camera.position);
          startCamLookAt.current
            .copy(camera.position)
            .add(camera.getWorldDirection(new THREE.Vector3()));
          onAnimationDone();
        }
      };
      mixer.addEventListener("finished", onFinished);
    } else {
      setTimeout(
        () => {
          setZoomPhase(2);
          zoomProgress.current = 0;
          startCamPos.current.copy(camera.position);
          startCamLookAt.current
            .copy(camera.position)
            .add(camera.getWorldDirection(new THREE.Vector3()));
          onAnimationDone();
        },
        PHASE1_DURATION * 1000 + 500,
      );
    }
  }, [zoomPhase, actions, mixer, camera, onAnimationDone]);

  /* ── Per-frame: idle float + camera zoom phases ── */
  useFrame((_, delta) => {
    if (!group.current) return;

    if (zoomPhase === 0) {
      idleTime.current += delta;
      group.current.position.y = Math.sin(idleTime.current * 1.2) * 0.06;
      group.current.rotation.y = Math.sin(idleTime.current * 0.6) * 0.05;
    }

    if (zoomPhase === 1 && zoomProgress.current < 1) {
      zoomProgress.current = Math.min(
        zoomProgress.current + delta / PHASE1_DURATION,
        1,
      );
      const t = zoomProgress.current;
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      camera.position.lerpVectors(startCamPos.current, PHASE1_POS, ease);
      const lookAt = new THREE.Vector3().lerpVectors(
        startCamLookAt.current,
        PHASE1_LOOK,
        ease,
      );
      camera.lookAt(lookAt);
    } else if (zoomPhase === 2 && zoomProgress.current < 1) {
      zoomProgress.current = Math.min(
        zoomProgress.current + delta / PHASE2_DURATION,
        1,
      );
      const t = zoomProgress.current;
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      camera.position.lerpVectors(startCamPos.current, PHASE2_POS, ease);
      const lookAt = new THREE.Vector3().lerpVectors(
        startCamLookAt.current,
        PHASE2_LOOK,
        ease,
      );
      camera.lookAt(lookAt);
    }
  });

  return (
    <group
      ref={group}
      position={[0, 0, 0]}
      onClick={handleClick}
      onPointerOver={() => setHovering(true)}
      onPointerOut={() => setHovering(false)}
    >
      <primitive object={scene} scale={0.5} />

      {/* White Background behind the door (Portal) - now tracks door float */}
      <mesh position={[0, 0.45, -0.6]}>
        <planeGeometry args={[0.4, 1.05]} />
        <meshBasicMaterial color="#ffffff" fog={false} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
 *  3D floating text above the door
 * ───────────────────────────────────────────────────────── */

function FloatingTitle({ text }: { text: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y =
      -2.0 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={ref} position={[0, -2.0, 0]}>
      <Html center transform distanceFactor={4}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <p
            className="text-md md:text-md font-medium text-blue-200/80 whitespace-nowrap tracking-widest animate-pulse"
            style={{ textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
          >
            {text}
          </p>
        </div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
 *  Full-screen overlay that fades to white during zoom
 * ───────────────────────────────────────────────────────── */

function FadeOverlay({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const fadeProgress = useRef(0);
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (active) {
      fadeProgress.current = Math.min(fadeProgress.current + delta * 2.5, 1);
    }

    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = fadeProgress.current;

    ref.current.position.copy(camera.position);
    ref.current.quaternion.copy(camera.quaternion);
    ref.current.translateZ(-0.5);
  });

  return (
    <mesh ref={ref} renderOrder={999}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0}
        depthTest={false}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────
 *  DoorScene — exported Canvas wrapper
 * ───────────────────────────────────────────────────────── */

interface DoorSceneProps {
  onDoorOpened: () => void;
  hintText: string;
}

export default function DoorScene({ onDoorOpened, hintText }: DoorSceneProps) {
  const [zooming, setZooming] = useState(false);

  const handleAnimDone = useCallback(() => {
    setZooming(true);
    setTimeout(onDoorOpened, 400);
  }, [onDoorOpened]);

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 1.0, 6.0], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.2}
          castShadow
          color="#e0e8ff"
        />
        <pointLight position={[-2, 3, -1]} color="#3b82f6" intensity={0.6} />
        <pointLight position={[0, 0.5, 3]} color="#60a5fa" intensity={0.3} />

        {/* Door */}
        <DoorModel onAnimationDone={handleAnimDone} />

        {/* 3D Title */}
        <FloatingTitle text={hintText} />

        {/* Atmosphere */}
        <Sparkles count={40} scale={8} size={2} speed={0.3} color="#60a5fa" />
        <Stars
          radius={30}
          depth={40}
          count={400}
          factor={3}
          saturation={0}
          fade
          speed={0.8}
        />

        {/* Fade to white overlay */}
        <FadeOverlay active={zooming} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/door.glb");
