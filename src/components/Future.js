import React from 'react';

function Future() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Future Enhancements</h2>

        <div className="glass-card max-w-4xl mx-auto p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <lottie-player
                src="https://assets1.lottiefiles.com/packages/lf20_isdhpejy.json"
                background="transparent"
                speed="1"
                style={{ width: '100%', height: 'auto' }}
                loop
                autoPlay
              ></lottie-player>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <h3 className="text-2xl font-semibold mb-4">AI-Powered Image Search</h3>
              <p className="text-gray-600 mb-6">
                Coming soon: Upload a photo of a similar item and our AI will search through found items to find potential matches based on visual similarity.
              </p>

              <ul className="space-y-4">
                {[
                  "Visual similarity matching",
                  "Color and pattern recognition",
                  "Push notifications for matches",
                ].map((text, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">{text}</p>
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
