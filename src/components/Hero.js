// components/Hero.js
import React from 'react';

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-200 py-32 md:py-40">
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <div className="max-w-3xl mx-auto backdrop-blur-md bg-white/60 p-10 rounded-3xl shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-6">
            Lost Something on Campus?
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Our smart lost & found system helps students reunite with their belongings faster than ever before.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#listings" className="neumorphic-btn px-6 py-3 rounded-full font-medium">
              Browse Found Items
            </a>
            <a
              href="#report"
              className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-200 transition"
            >
              Report Lost Item
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
        <iframe
          title="3D Spinner"
          src="https://lottie.host/embed/195e6da4-3323-4571-a316-2be42221f88d/qvMky8wn4M.json"
          className="w-72 h-72 md:w-96 md:h-96 opacity-80"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}

export default Hero;
