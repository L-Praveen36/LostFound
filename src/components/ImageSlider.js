import React, { useState, useEffect } from "react";

const images = [
  {
    src: "/images/bicycle.webp",
    caption: "🚲 Bicycle found near parking"
  },
  {
    src: "/images/book.webp",
    caption: "📚 Lost book: 'React Made Easy'"
  },
  {
    src: "/images/umbrella.webp",
    caption: "🌂 Umbrella dropped in cafeteria"
  }
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const next = () =>
    setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] overflow-hidden rounded-lg shadow-lg">
      <img
        src={images[current].src}
        loading="lazy"
        alt={`Slide ${current + 1}`}
        className="w-full h-full object-cover transition-all duration-700"
      />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-sm sm:text-base">
        {images[current].caption}
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-xl px-3 py-1 rounded-full shadow"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-xl px-3 py-1 rounded-full shadow"
      >
        ▶
      </button>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full ${
              current === i ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
