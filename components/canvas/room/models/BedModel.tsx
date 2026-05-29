import { useClonedGLTF, useModelInfo } from "./utils";

/**
 * Low-poly bed + bedside table — cozy room decoration.
 */
export function BedModel() {
  const clonedScene = useClonedGLTF("/models/room/lowpoly/bed__bedside_table.glb");
  const { size, center } = useModelInfo(clonedScene);

  /* Fit to roughly 1.8 units wide */
  const targetWidth = 1.8;
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = maxDim > 0 ? targetWidth / maxDim : 1;

  return (
    <group
      position={[
        -1.6 - center.x * scaleFactor,
        -center.y * scaleFactor + (size.y * scaleFactor) / 2,
        1.0 - center.z * scaleFactor,
      ]}
      scale={scaleFactor}
      rotation={[0, -Math.PI / 1, 0]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}
