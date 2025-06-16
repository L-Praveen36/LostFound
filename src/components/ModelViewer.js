// src/components/ModelViewer.js
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";


const RotatingModel = ({ modelPath }) => {
  const groupRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Center and scale the model
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center); // Center it
    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = 2.5 / size;
    scene.scale.setScalar(scaleFactor);
  }, [scene]);

  // Rotation animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
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
    <div className="w-screen h-screen">
  <Canvas camera={{ position: [0, 1, 5], fov: 35 }}>
    <ambientLight intensity={1.2} />
    <directionalLight position={[2, 2, 2]} intensity={1} />
    <RotatingModel modelPath={modelPath} />
    <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
  </Canvas>
</div>

  );
};

export default ModelViewer;
