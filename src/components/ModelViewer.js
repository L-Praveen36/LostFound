// src/components/ModelViewer.js
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment} from "@react-three/drei";
import * as THREE from "three";
import { CircleGeometry } from "three";

extend({ CircleGeometry }); // Extend R3F to allow <circleGeometry />

const RotatingModel = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  // Model rotation around its center
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={modelRef} position={[0, 0.7, 0]} scale={[1.5, 1.5, 1.5]}>
      <primitive object={scene} />
    </group>
  );
};

const GlowingBase = () => {
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: "#00ffff",
      transparent: true,
      opacity: 0.3,
      toneMapped: false,
    });
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <circleGeometry args={[2, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const ModelViewer = ({ modelPath }) => {
  return (
    <div className="w-full max-w-md h-[400px] mx-auto rounded-lg overflow-hidden shadow-lg bg-black">
      <Canvas camera={{ position: [0, 2, 4], fov: 40 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 2]} intensity={1.5} />

        {/* Glowing base and model */}
        <GlowingBase />
        <RotatingModel modelPath={modelPath} />

        {/* Smooth orbit control (disabled pan/zoom) */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />

        {/* Soft background */}
        <Environment preset="sunset" background blur={0.6} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
