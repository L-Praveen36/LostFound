import React, { useEffect, useRef } from 'react';

function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = initThree;
      document.body.appendChild(script);
    } else {
      initThree();
    }

    function initThree() {
      const container = containerRef.current;
      if (!container || container.children.length > 0) return;

      const scene = new window.THREE.Scene();
      const camera = new window.THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new window.THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      const geometry = new window.THREE.SphereGeometry(0.2, 32, 32);

      const phone = new window.THREE.Mesh(
        geometry,
        new window.THREE.MeshBasicMaterial({ color: 0x333333 })
      );
      phone.position.set(-2, 1, -5);
      scene.add(phone);

      const key = new window.THREE.Mesh(
        geometry,
        new window.THREE.MeshBasicMaterial({ color: 0xffd700 })
      );
      key.position.set(0, 0.5, -4);
      scene.add(key);

      const book = new window.THREE.Mesh(
        geometry,
        new window.THREE.MeshBasicMaterial({ color: 0x8b4513 })
      );
      book.position.set(2, -0.5, -6);
      scene.add(book);

      camera.position.z = 5;

      const animate = () => {
        phone.rotation.y += 0.01;
        key.rotation.y += 0.01;
        book.rotation.y += 0.01;

        phone.position.y = 1 + Math.sin(Date.now() * 0.001) * 0.3;
        key.position.y = 0.5 + Math.sin(Date.now() * 0.0015) * 0.3;
        book.position.y = -0.5 + Math.sin(Date.now() * 0.002) * 0.3;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }
  }, []);

  return (
    <section id="home" className="relative bg-gradient-to-br from-[#1a1330] via-[#0d0b1f] to-[#1a1330] text-white overflow-hidden min-h-screen flex items-center">
      <div
        ref={containerRef}
        id="canvas-container"
        className="absolute top-0 left-0 w-full h-full z-0"
      ></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Side */}
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-xl">
              Lost Something on Campus?
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-lg">
              Our smart lost & found system helps students reunite with their belongings faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#listings"
                className="px-8 py-3 rounded-full font-medium border-2 border-white text-white hover:bg-white hover:text-purple-700 transition backdrop-blur-lg bg-white/10"
              >
                Browse Found Items
              </a>
              <a
                href="#report"
                className="px-8 py-3 rounded-full font-medium border-2 border-white text-white hover:bg-white hover:text-purple-700 transition backdrop-blur-lg bg-white/10"
              >
                Report Lost Item
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="glass-card p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <lottie-player
                  src="https://assets1.lottiefiles.com/packages/lf20_5tkzkblw.json"
                  background="transparent"
                  speed="1"
                  style={{ width: '100%', height: 'auto' }}
                  loop
                  autoplay
                ></lottie-player>
                <div className="text-center mt-4">
                  <h3 className="text-xl font-semibold">🎉 Recent Reunions</h3>
                  <p className="text-sm text-purple-200">87 items returned this week!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
