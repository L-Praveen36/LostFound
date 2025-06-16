// src/components/ModelViewer.js
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

const RotatingModel = ({ modelPath, paused }) => {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();

  useFrame(() => {
    if (ref.current && !paused) {
      ref.current.rotation.y += 0.01; // slow, smooth
    }
  });

  useEffect(() => {
    scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[0, -0.5, 0]}
      scale={[1.5, 1.5, 1.5]}
    />
  );
};

const ModelViewer = ({ modelPath, paused }) => {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <RotatingModel modelPath={modelPath} paused={paused} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
