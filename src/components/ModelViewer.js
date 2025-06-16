// src/components/ModelViewer.js
import React, { useRef,  useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import * as THREE from "three";

const RotatingModel = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();

  // Rotation animation
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[0, 0.6, 0]}
      scale={[1.5, 1.5, 1.5]}
    />
  );
};

const GlowingBase = () => {
  const glowMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00ffff"),
      transparent: true,
      opacity: 0.3,
    });
    return material;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleBufferGeometry args={[2.5, 64]} />
      <primitive object={glowMaterial} attach="material" />
    </mesh>
  );
};

const ModelViewer = ({ modelPath }) => {
  return (
    <div className="w-full h-[400px] relative">
      <Canvas camera={{ position: [0, 2, 5], fov: 35 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Stage environment="city" intensity={0.6}>
          <GlowingBase />
          <RotatingModel modelPath={modelPath} />
        </Stage>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
