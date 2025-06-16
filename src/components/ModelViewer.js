import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, useGLTF, Html } from "@react-three/drei";
import { Suspense } from "react";

// Load and display the 3D model
function Model({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.5} />;
}

// Render a glowing circular base under the model
function Base() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
      <cylinderGeometry args={[1.8, 1.8, 0.1, 64]} />
      <meshStandardMaterial color="#4f46e5" emissive="#6366f1" metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

export default function ModelViewer({ modelPath }) {
  return (
    <div className="w-full h-full bg-transparent">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Suspense
          fallback={
            <Html center>
              <span className="text-gray-600">Loading...</span>
            </Html>
          }
        >
          <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
            <Model path={modelPath} />
          </Float>
          <Base />
          <OrbitControls autoRotate enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
