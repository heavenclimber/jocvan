import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useClonedGLTF, useModelInfo } from "./utils";

interface DeskPCModelProps {
    onClick: () => void;
}

/**
 * Low-poly desk + PC combo model.
 * The PC screen is interactive — clicking it opens the portfolio.
 */
export function DeskPCModel({ onClick }: DeskPCModelProps) {
    const clonedScene = useClonedGLTF("/models/room/lowpoly/desk_and_pc.glb");
    const { size, center } = useModelInfo(clonedScene);
    const [hovered, setHovered] = useState(false);

    /* Fit to roughly 1.6 units wide */
    const targetWidth = 1.6;
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim > 0 ? targetWidth / maxDim : 1;

    /* Screen glow pulse */
    useFrame((state) => {
        clonedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat.emissive) {
                    const pulse = 0.1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08;
                    mat.emissiveIntensity = hovered ? 0.5 : pulse;
                    mat.emissive.setHex(0x66bbff);
                }
            }
        });
    });

    useEffect(() => {
        document.body.style.cursor = hovered ? "pointer" : "auto";
        return () => {
            document.body.style.cursor = "auto";
        };
    }, [hovered]);

    return (
        <group
            position={[
                -1.6 - center.x * scaleFactor,
                -center.y * scaleFactor + (size.y * scaleFactor) / 2,
                -1.0 - center.z * scaleFactor,
            ]}
            scale={scaleFactor}
        >
            <primitive
                object={clonedScene}
                onClick={(e: any) => {
                    e.stopPropagation();
                    onClick();
                }}
                onPointerOver={(e: any) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={(e: any) => {
                    e.stopPropagation();
                    setHovered(false);
                }}
            />

            {/* Tooltip above the desk */}
            {hovered && (
                <Html
                    position={[
                        -0.3 - center.x * scaleFactor,
                        -center.y * scaleFactor + (size.y * scaleFactor) / 2,
                        -1.0 - center.z * scaleFactor,
                    ]}
                    center
                >
                    <div className="rpg-tooltip animate-rpg-tooltip-in">
                        <span className="rpg-tooltip-icon">🖥️</span>
                        <span>View Portfolio</span>
                    </div>
                </Html>
            )}
        </group>
    );
}
