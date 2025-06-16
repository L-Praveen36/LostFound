// File: src/components/ModelCarousel.js
import React, { useState } from 'react';
import ModelViewer from './ModelViewer';

const modelPaths = [
  '/models/book.glb',
  '/models/cycle.glb',
  '/models/umbrella.glb',
];

const ModelCarousel = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setIndex((prev) => (prev + 1) % modelPaths.length);
  const prev = () => setIndex((prev) => (prev - 1 + modelPaths.length) % modelPaths.length);

  return (
    <div className="relative">
      <ModelViewer modelPath={modelPaths[index]} paused={paused} />

      <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10">
        <button
          onClick={prev}
          className="bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-40 transition"
        >
          ⬅
        </button>
      </div>

      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
        <button
          onClick={next}
          className="bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-40 transition"
        >
          ➡
        </button>
      </div>

      <div
        className="absolute inset-0 z-0"
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      ></div>
    </div>
  );
};

export default ModelCarousel;
