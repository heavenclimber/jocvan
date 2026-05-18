import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

export function CameraSetup() {
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
