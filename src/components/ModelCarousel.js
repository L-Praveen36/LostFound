import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const models = [
  "/models/book.glb",
  "/models/bicycle.glb",
  "/models/umbrella.glb",
  "/models/phone.glb",
];

const Model = ({ path }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={2.5} />;
};

const ModelCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % models.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + models.length) % models.length);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-md h-[400px] mx-auto overflow-hidden">
      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 5]} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
            <Model path={models[currentIndex]} />
          </Canvas>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ModelCarousel;
