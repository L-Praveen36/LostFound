// ModelCarousel.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModelViewer from './ModelViewer';

const models = [
  { path: '/models/book.glb', name: 'Book' },
  { path: '/models/bicycle.glb', name: 'Bicycle' },
  { path: '/models/phone.glb', name: 'Smartphone' },
];

const ModelCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % models.length);
    }, 7000); // Change model every 7 seconds
    return () => clearInterval(interval);
  }, []);

  const prevModel = () => {
    setIndex((prev) => (prev - 1 + models.length) % models.length);
  };

  const nextModel = () => {
    setIndex((prev) => (prev + 1) % models.length);
  };

  return (
    <div className="relative w-full max-w-md h-[450px] mx-auto my-8">
      <div className="absolute top-1/2 left-2 z-10 -translate-y-1/2">
        <button onClick={prevModel} className="bg-white shadow p-2 rounded-full hover:bg-gray-100">
          ◀
        </button>
      </div>

      <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2">
        <button onClick={nextModel} className="bg-white shadow p-2 rounded-full hover:bg-gray-100">
          ▶
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={models[index].path}
          className="absolute w-full h-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
            <ModelViewer modelPath={models[index].path} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Glowing stand */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-40 h-4 bg-blue-500 rounded-full blur-2xl opacity-50"></div>
    </div>
  );
};

export default ModelCarousel;
