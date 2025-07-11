import React, { useEffect } from 'react';

function Future() {
  useEffect(() => {
    const scriptId = "lottie-player-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
      script.async = true;
      script.id = scriptId;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-[#1a1330] via-[#0e0b23] to-[#1a1330] text-white" id="future">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Future Enhancements
        </h2>

        <div className="glass-card max-w-5xl mx-auto p-8 rounded-2xl shadow-md backdrop-blur-lg border border-white/10 bg-white/5">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Lottie Animation */}
            <div className="md:w-1/2 w-full">
              <lottie-player
                src="https://assets1.lottiefiles.com/packages/lf20_isdhpejy.json"
                background="transparent"
                speed="1"
                style={{ width: '100%', height: 'auto' }}
                loop
                autoplay
              ></lottie-player>
            </div>

            {/* Feature Description */}
            <div className="md:w-1/2 w-full">
              <h3 className="text-2xl font-semibold text-purple-300 mb-4">
                AI-Powered Image Search
              </h3>
              <p className="text-purple-100 mb-6 leading-relaxed opacity-90">
                Coming soon: Upload a photo of a similar item and our AI will search through found items to find potential matches based on visual similarity.
              </p>

              <ul className="space-y-4">
                {[
                  "Visual similarity matching",
                  "Color and pattern recognition",
                  "Push notifications for matches",
                ].map((text, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-purple-400 bg-opacity-20 rounded-full flex items-center justify-center mt-1">
                      <svg
                        className="w-5 h-5 text-purple-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-purple-100 opacity-90">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Future;
