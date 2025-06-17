import React, { useState } from "react";

const images = [
  "/images/bicycle.jpg",
  "/images/book.jpg",
  "/images/umbrella.jpg"
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <img
        src={images[current]}
        alt={`Slide ${current + 1}`}
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 px-3 py-1 rounded-full shadow"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 px-3 py-1 rounded-full shadow"
      >
        ▶
      </button>
    </div>
  );
};

export default ImageSlider;
