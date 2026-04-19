"use client";

import { useEffect, useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

// Reusable objects to avoid GC pressure in useFrame
const _raycaster = new THREE.Raycaster();
const _groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _intersection = new THREE.Vector3();

const Char = forwardRef<THREE.Group>((_, ref) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/char.glb");
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
        actions["Walk"] ||
        actions["walk"] ||
        actions["Run"] ||
        actions["run"] ||
        Object.values(actions)[0];
      walkAction?.play();
    }
  }, [actions]);

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (!group.current) return;

    const char = group.current;

    // Subtle walking bob (very small since we're viewing from above)
    char.position.y = Math.sin(timeRef.current * 6) * 0.02;

    // SCROLL → forward movement along Z axis
    const scrollMax =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollMax > 0 ? Math.min(Math.max(window.scrollY / scrollMax, 0), 1) : 0;

    const targetZ = 5 - progress * 40;
    char.position.z = THREE.MathUtils.lerp(char.position.z, targetZ, 0.08);
    char.position.z = THREE.MathUtils.clamp(char.position.z, -40, 5);

    // CURSOR → horizontal (X) movement
    const targetX = state.pointer.x * 4;
    const dir = targetX - char.position.x;
    const dist = Math.abs(dir);

    const minDistance = 0.3;

    if (dist > minDistance) {
      const moveDir = Math.sign(dir);
      char.position.x += moveDir * delta * 3;
    }

    // Clamp to road width
    char.position.x = THREE.MathUtils.clamp(char.position.x, -3, 3);

    // ROTATION — face toward cursor position on the ground plane
    _raycaster.setFromCamera(state.pointer, state.camera);
    const hit = _raycaster.ray.intersectPlane(_groundPlane, _intersection);

    if (hit) {
      const dx = _intersection.x - char.position.x;
      const dz = _intersection.z - char.position.z;
      const targetRotY = Math.atan2(dx, dz);
      char.rotation.y = THREE.MathUtils.lerp(
        char.rotation.y,
        targetRotY,
        0.1,
      );
    }
  });

  return (
    <group ref={group} position={[0, 0, 5]}>
      <primitive object={scene} scale={1.2} />
    </group>
  );
});

export default Char;

useGLTF.preload("/models/char.glb");

Char.displayName = "Char";
