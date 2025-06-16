// src/components/ModelCarousel.js
import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";


// List of model paths
const models = ["/models/book.glb", "/models/bike.glb", "/models/phone.glb"];

const RotatingModel = ({ path, paused }) => {
  const { scene } = useGLTF(path);
  const ref = useRef();
  const rotationSpeed = 0.01;
  const angle = useRef(0);

  useFrame(() => {
    if (!paused && ref.current) {
      ref.current.rotation.y += rotationSpeed;
      angle.current += rotationSpeed;

      if (angle.current >= Math.PI * 2) {
        angle.current = 0;
        if (typeof ref.current?.onCompleteRotation === "function") {
          ref.current.onCompleteRotation();
        }
      }
    }
  });

  return (
    <group ref={ref} scale={[1.5, 1.5, 1.5]} position={[0, 0.5, 0]}>
      <primitive object={scene} />
    </group>
  );
};

const GlowingBase = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleGeometry args={[2, 64]} />
      <meshBasicMaterial color="#00ffff" opacity={0.4} transparent />
    </mesh>
  );
};

const ModelCarousel = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const modelRef = useRef();

  const next = () => {
    setIndex((i) => (i + 1) % models.length);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + models.length) % models.length);
  };

  return (
    <div
      className="relative w-full max-w-md h-[400px] mx-auto mb-8 bg-black rounded-xl"
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <Canvas camera={{ position: [0, 2, 5], fov: 40 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 5, 3]} intensity={1.5} />
        <GlowingBase />
        <RotatingModel
          path={models[index]}
          paused={paused}
          ref={modelRef}
        />
        <Environment preset="sunset" background blur={0.7} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Manual controls */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black px-3 py-1 rounded-full shadow hover:bg-gray-300"
      >
        ⬅
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black px-3 py-1 rounded-full shadow hover:bg-gray-300"
      >
        ➡
      </button>
    </div>
  );
};

export default ModelCarousel;
