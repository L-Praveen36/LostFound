// src/components/ModelViewer.js
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

const RotatingModel = ({ modelPath, paused }) => {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();

  useEffect(() => {
    // Center the model based on bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center); // shift to origin
  }, [scene]);

  useFrame(() => {
    if (ref.current && !paused) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={ref} position={[0, -0.5, 0]}>
      <primitive object={scene} />
    </group>
  );
};

const ModelViewer = ({ modelPath, paused }) => {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 5]} intensity={1.2} />
        <RotatingModel modelPath={modelPath} paused={paused} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
