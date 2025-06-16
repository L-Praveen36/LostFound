// File: src/components/ModelViewer.js
import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Center, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

const RotatingModel = ({ modelPath, paused }) => {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();

  useFrame((_, delta) => {
    if (!paused && ref.current) {
      ref.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <Center>
      <primitive object={scene} ref={ref} scale={[2, 2, 2]} />
    </Center>
  );
};

const GlowingBase = () => {
  const glowMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00ffff'),
      transparent: true,
      opacity: 0.2,
    }),
    []
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <circleGeometry args={[3, 64]} />
      <primitive object={glowMaterial} attach="material" />
    </mesh>
  );
};

const Loader = () => (
  <Html center>
    <div className="text-white text-xl animate-pulse">Loading Model...</div>
  </Html>
);

const ModelViewer = ({ modelPath, paused }) => {
  return (
    <div className="w-full h-[400px]">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 40 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
        shadows
      >
        <color attach="background" args={["#0a0a0a"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Environment preset="city" background={false} />
        <Suspense fallback={<Loader />}>
          <GlowingBase />
          <RotatingModel modelPath={modelPath} paused={paused} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
