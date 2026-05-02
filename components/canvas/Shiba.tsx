"use client";

import { useEffect, useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const Shiba = forwardRef<THREE.Group>((_, ref) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/shiba.glb");
  const { actions } = useAnimations(animations, group);
  const timeRef = useRef(0);

  // expose ref to parent (for camera tracking)
  useEffect(() => {
    if (typeof ref === "function") ref(group.current!);
    else if (ref) (ref as any).current = group.current;
  }, [ref]);

  useEffect(() => {
    if (actions) {
      const walkAction =
        actions["Walk"] || actions["walk"] || Object.values(actions)[0];
      walkAction?.play();
    }
  }, [actions]);

  useFrame((state, delta) => {
    timeRef.current += delta;

    const t = timeRef.current;

    if (!group.current) return;

    const dog = group.current;

    dog.position.y = -1.5 + Math.sin(t * 6) * 0.08;

    // 🟡 SCROLL → forward (Z)
    const scrollMax =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollMax > 0 ? Math.min(Math.max(window.scrollY / scrollMax, 0), 1) : 0;

    const targetZ = 5 - progress * 20;
    dog.position.z = THREE.MathUtils.lerp(dog.position.z, targetZ, 0.08);
    dog.position.z = THREE.MathUtils.clamp(dog.position.z, -20, 5);

    // 🟢 CURSOR → horizontal target
    const targetX = state.pointer.x * 6;
    const dir = targetX - dog.position.x;
    const dist = Math.abs(dir);

    const minDistance = 1.2;

    if (dist > minDistance) {
      const moveDir = Math.sign(dir);
      dog.position.x += moveDir * delta * 4;
    }

    // clamp to road width
    dog.position.x = THREE.MathUtils.clamp(dog.position.x, -4, 4);

    // 🔵 ROTATION (face movement direction)
    const targetRotY = -Math.atan2(dir, 4);
    dog.rotation.y = THREE.MathUtils.lerp(dog.rotation.y, targetRotY, 0.1);

    // 🟠 LOOK UP + cursor tilt
    const targetY = (state.pointer.y * Math.PI) / 6;
    const lookUp = -Math.PI / 3;

    dog.rotation.x = THREE.MathUtils.lerp(
      dog.rotation.x,
      lookUp + targetY,
      0.08,
    );
  });

  return (
    <group ref={group} position={[0, -0.8, 5]}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
});

export default Shiba;

useGLTF.preload("/models/shiba.glb");

Shiba.displayName = "Shiba";
