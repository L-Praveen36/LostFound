// components/Hero.js
import React, { useEffect } from 'react';

function Hero() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      const container = document.getElementById('canvas-container');
      const scene = new window.THREE.Scene();
      const camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new window.THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      const geometry = new window.THREE.SphereGeometry(0.2, 32, 32);
      const phone = new window.THREE.Mesh(geometry, new window.THREE.MeshBasicMaterial({ color: 0x333333 }));
      phone.position.set(-2, 1, -5);
      scene.add(phone);
      const key = new window.THREE.Mesh(geometry, new window.THREE.MeshBasicMaterial({ color: 0xFFD700 }));
      key.position.set(0, 0.5, -4);
      scene.add(key);
      const book = new window.THREE.Mesh(geometry, new window.THREE.MeshBasicMaterial({ color: 0x8B4513 }));
      book.position.set(2, -0.5, -6);
      scene.add(book);

      camera.position.z = 5;

      function animate() {
        requestAnimationFrame(animate);
        phone.rotation.y += 0.01;
        key.rotation.y += 0.01;
        book.rotation.y += 0.01;
        renderer.render(scene, camera);
      }

      animate();
    };
    document.body.appendChild(script);
  }, []);

  return (
    <section id="home" className="bg-gray-100 py-24 md:py-32 text-gray-900">
      <div id="canvas-container" className="absolute top-0 left-0 w-full h-full z-0"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Lost Something on Campus?</h1>
            <p className="text-xl mb-8 opacity-90">Our smart lost & found system helps students reunite with their belongings faster than ever before.</p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <a href="#listings" className="neumorphic-btn px-8 py-3 rounded-full font-medium text-purple-700 text-center">Browse Found Items</a>
              <a href="#report" className="px-8 py-3 rounded-full font-medium border-2 border-white text-white hover:bg-white hover:text-purple-700 transition text-center">Report Lost Item</a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="glass-card p-6 rounded-3xl w-full max-w-md">
              <lottie-player
                src="https://assets1.lottiefiles.com/packages/lf20_5tkzkblw.json"
                background="transparent"
                speed="1"
                style={{ width: '100%', height: 'auto' }}
                loop
                autoPlay
              ></lottie-player>
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold">Recent Reunions</h3>
                <p className="text-sm opacity-80">87 items returned this week!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;