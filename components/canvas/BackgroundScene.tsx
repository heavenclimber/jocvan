"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, useGLTF, useAnimations } from "@react-three/drei";
import Shiba from "./Shiba";
import * as THREE from "three";

function FallingSnow() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/falling_snow_loop.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions || {}).forEach((a) => a?.play());
  }, [actions]);

  return <primitive ref={group} object={scene} />;
}

function StaticAutumnRoad() {
  const { scene } = useGLTF("/models/autumn_road.glb");
  return (
    <primitive object={scene} position={[0, -1.5, -15]} scale={[3, 3, 3]} />
  );
}

function Rig({ dogRef }: { dogRef: React.RefObject<THREE.Object3D> }) {
  useFrame((state) => {
    if (!dogRef.current) return;

    const dog = dogRef.current;

    // camera follows dog slightly (cinematic drift)
    const targetPos = new THREE.Vector3(
      dog.position.x * 0.5,
      18,
      dog.position.z + 8,
    );

    state.camera.position.lerp(targetPos, 0.08);

    state.camera.lookAt(dog.position.x, dog.position.y, dog.position.z);
  });

  return null;
}

export default function BackgroundScene() {
  const dogRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    document.documentElement.style.backgroundColor = "#e0e8f0";
    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 15, 13], fov: 40 }}>
        <fog attach="fog" args={["#e0e8f0", 15, 40]} />

        <ambientLight intensity={0.6} color="#c6d8eb" />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />

        <Sky
          sunPosition={[100, 20, 100]}
          turbidity={0.1}
          rayleigh={0.1}
          mieCoefficient={0.005}
        />

        <StaticAutumnRoad />
        <FallingSnow />

        <Shiba ref={dogRef} />
        <Rig dogRef={dogRef} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/falling_snow_loop.glb");
useGLTF.preload("/models/autumn_road.glb");
