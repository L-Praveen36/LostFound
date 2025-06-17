// src/components/ModelCarousel.js
import React, { useState } from "react";
import ModelViewer from "./ModelViewer";

const modelList = [
  "/models/book.glb",
  "/models/bicycle.glb",
//   "/models/idcard.glb",
  "/models/phone.glb",
  "/models/umbrella.glb",
];

const ModelCarousel = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % modelList.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + modelList.length) % modelList.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ModelViewer modelPath={modelList[index]} paused={paused} />

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-200"
        aria-label="Previous"
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        ⬅️
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-200"
        aria-label="Next"
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        ➡️
      </button>
    </div>
  );
};

export default ModelCarousel;
