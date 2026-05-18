import { useClonedGLTF, useModelInfo } from "./utils";

/**
 * Low-poly window — mounted on the back wall.
 */
export function WindowModel() {
  const clonedScene = useClonedGLTF("/models/room/lowpoly/residential_window.glb");
  const { size, center } = useModelInfo(clonedScene);

  /* Fit to roughly 1.2 units tall */
  const targetHeight = 1.2;
  const scaleFactor = size.y > 0 ? targetHeight / size.y : 1;

  return (
    <group
      position={[
        -0.5 - center.x * scaleFactor,
        1.6 - center.y * scaleFactor,
        -1.93 - center.z * scaleFactor,
      ]}
      scale={scaleFactor}
    >
      <primitive object={clonedScene} />
    </group>
  );
}
