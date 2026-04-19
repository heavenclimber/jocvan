"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import Char from "./Char";
import BabyDog from "./BabyDog";
import * as THREE from "three";

// ── Suppress THREE.Clock deprecation from R3F internals ──────────────
// This warning originates inside @react-three/fiber v9 which still uses
// THREE.Clock. It will disappear once R3F switches to THREE.Timer.
const _origWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
  _origWarn.apply(console, args);
};

// ── Falling Snow ─────────────────────────────────────────────────────
function FallingSnow({
  targetRef,
}: {
  targetRef: React.RefObject<THREE.Object3D | null>;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/falling_snow_loop.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions || {}).forEach((a) => a?.play());
  }, [actions]);

  useFrame(() => {
    if (!targetRef.current || !group.current) return;

    // Keep snow centered around the character
    group.current.position.z = targetRef.current.position.z;
    group.current.position.x = targetRef.current.position.x;
  });

  return <primitive ref={group} object={scene} />;
}

// ── Infinite Autumn Road (tiles along Z) ─────────────────────────────
function InfiniteAutumnRoad({
  targetRef,
}: {
  targetRef: React.RefObject<THREE.Object3D | null>;
}) {
  const { scene } = useGLTF("/models/autumn_road.glb");

  const road1 = useRef<THREE.Object3D>(null);
  const road2 = useRef<THREE.Object3D>(null);

  const ROAD_LENGTH = 40;

  useEffect(() => {
    [road1.current, road2.current].forEach((road) => {
      if (!road) return;

      const box = new THREE.Box3().setFromObject(road);
      const size = box.getSize(new THREE.Vector3());

      const scaleFactor = ROAD_LENGTH / Math.max(size.x, size.z);
      road.scale.setScalar(scaleFactor);
    });
  }, []);

  useFrame(() => {
    if (!targetRef.current || !road1.current || !road2.current) return;

    const target = targetRef.current;

    const baseZ = Math.round(target.position.z / ROAD_LENGTH) * ROAD_LENGTH;

    road1.current.position.z = baseZ;

    if (target.position.z > baseZ) {
      road2.current.position.z = baseZ + ROAD_LENGTH;
    } else {
      road2.current.position.z = baseZ - ROAD_LENGTH;
    }

    // Keep road centered on character's X
    road1.current.position.x = target.position.x;
    road2.current.position.x = target.position.x;
  });

  return (
    <>
      <primitive
        ref={road1}
        object={scene.clone()}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <primitive
        ref={road2}
        object={scene.clone()}
        position={[0, 0, -ROAD_LENGTH]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </>
  );
}

// ── Camera Rig — true top-down, follows character ────────────────────
function Rig({
  targetRef,
}: {
  targetRef: React.RefObject<THREE.Object3D | null>;
}) {
  const camPos = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    if (!targetRef.current) return;

    const target = targetRef.current;

    // Camera stays directly above the character
    camPos.current.set(target.position.x, 25, target.position.z);
    camera.position.lerp(camPos.current, 0.08);
    camera.lookAt(target.position.x, 0, target.position.z);
  });

  return null;
}

// ── Main Scene ───────────────────────────────────────────────────────
export default function BackgroundScene() {
  const targetRef = useRef<THREE.Object3D>(null);

  return (
    <div className="fixed inset-0 -z-10" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 25, 0], fov: 50 }}
        style={{ pointerEvents: "auto" }}
        onCreated={({ camera }) => {
          // Set "up" to -Z so the top of the screen is the walk direction
          camera.up.set(0, 0, -1);
          camera.lookAt(0, 0, 0);
        }}
      >
        {/* Solid background + distance fog for an autumn atmosphere */}
        <color attach="background" args={["#d4dce6"]} />
        <fog attach="fog" args={["#d4dce6", 20, 50]} />

        <ambientLight intensity={0.8} color="#c6d8eb" />
        <directionalLight position={[5, 15, 5]} intensity={1.2} />
        <directionalLight
          position={[-5, 10, -5]}
          intensity={0.4}
          color="#ffd4a3"
        />

        {/* Road + snow */}
        <InfiniteAutumnRoad targetRef={targetRef} />
        <FallingSnow targetRef={targetRef} />

        {/* Character (walks on scroll, faces the cursor) */}
        <Char ref={targetRef} />

        {/* Baby dog — fixed on the road, click to play random animation */}
        <Suspense fallback={null}>
          <BabyDog position={[1.5, 0, -5]} />
        </Suspense>

        {/* Camera follow rig */}
        <Rig targetRef={targetRef} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/falling_snow_loop.glb");
useGLTF.preload("/models/autumn_road.glb");
