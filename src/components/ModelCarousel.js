// src/components/ModelCarousel.js
import React, { useState } from "react";
import ModelViewer from "./ModelViewer";

const models = [
  "/models/book.glb",
  "/models/cycle.glb",
  "/models/phone.glb"
];

const ModelCarousel = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + models.length) % models.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % models.length);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[500px]">
      <ModelViewer modelPath={models[index]} paused={paused} />

      {/* Controls */}
      <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
        <button
          onClick={handlePrev}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          className="bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow pointer-events-auto"
        >
          ◀
        </button>
        <button
          onClick={handleNext}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          className="bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow pointer-events-auto"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default ModelCarousel;
