import React, { useState, useEffect, useRef } from 'react';
import ModelViewer from './ModelViewer';
import { motion, AnimatePresence } from 'framer-motion';

const models = [
  '/models/book.glb',
  '/models/bicycle.glb',
  //'/models/idcard.glb',
  '/models/phone.glb',
  '/models/umbrella.glb'
];

const ModelCarousel = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const next = () => setIndex((prev) => (prev + 1) % models.length);
  const prev = () => setIndex((prev) => (prev - 1 + models.length) % models.length);

  useEffect(() => {
    const tick = () => {
      timeoutRef.current = setTimeout(() => {
        next();
      }, 7000);
    };
    tick();
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  // Preload all models
  useEffect(() => {
    models.forEach((path) => {
      const loader = document.createElement('link');
      loader.rel = 'preload';
      loader.as = 'fetch';
      loader.href = path;
      document.head.appendChild(loader);
    });
  }, []);

  return (
    <div className="relative w-full max-w-xl h-[400px] mx-auto mb-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <ModelViewer modelPath={models[index]} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white shadow rounded-full p-2 text-gray-800 hover:bg-gray-100"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white shadow rounded-full p-2 text-gray-800 hover:bg-gray-100"
      >
        ▶
      </button>
    </div>
  );
};

export default ModelCarousel;
