import { useClonedGLTF, useModelInfo } from "./utils";

export function DeskModel() {
  const clonedScene = useClonedGLTF("/models/room/desk.glb");
  const { size, center } = useModelInfo(clonedScene);

  /* Scale to make desk about 2 units wide */
  const targetWidth = 2.0;
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = maxDim > 0 ? targetWidth / maxDim : 1;

  return (
    <group
      position={[
         -1.4 -center.x * scaleFactor,
        -center.y * scaleFactor + (size.y * scaleFactor) / 2,
        -0.3 - center.z * scaleFactor,
      ]}
      scale={scaleFactor}
      rotation={[0, Math.PI / 2, 0]} //fixed rotation
    >
      <primitive object={clonedScene} />
    </group>
  );
}
