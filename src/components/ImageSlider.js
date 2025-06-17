import React, { useState, useEffect } from "react";

const images = [
  {
    src: "/images/bicycle.jpg",
    caption: "🚲 Bicycle found near parking"
  },
  {
    src: "/images/book.jpg",
    caption: "📚 Lost book: 'React Made Easy'"
  },
  {
    src: "/images/umbrella.jpg",
    caption: "umbrella dropped in cafeteria"
  }
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full max-w-5xl h-[300px] md:h-[400px] mx-auto mb-10 overflow-hidden">
      <img
        src={images[current].src}
        alt={`Slide ${current + 1}`}
        className="w-full h-full object-cover rounded-lg shadow transition-all duration-700"
      />

      {/* Caption */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
        {images[current].caption}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 px-3 py-2 rounded-full shadow"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 px-3 py-2 rounded-full shadow"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => goToSlide(i)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
