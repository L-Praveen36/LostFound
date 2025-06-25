// components/HowItWorks.js
import React from 'react';

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <lottie-player
                src="https://assets1.lottiefiles.com/packages/lf20_gn0tojcq.json"
                background="transparent"
                speed="1"
                style={{ width: '40px', height: '40px' }}
                loop
                autoPlay
              ></lottie-player>
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Report Lost or Found</h3>
            <p className="text-gray-600">Submit details about your lost item or an item you've found on campus.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <lottie-player
                src="https://assets1.lottiefiles.com/packages/lf20_osdxlbqq.json"
                background="transparent"
                speed="1"
                style={{ width: '40px', height: '40px' }}
                loop
                autoPlay
              ></lottie-player>
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Smart Matching</h3>
            <p className="text-gray-600">Our system automatically matches lost reports with found items.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <lottie-player
                src="https://assets1.lottiefiles.com/packages/lf20_1LhG0H.json"
                background="transparent"
                speed="1"
                style={{ width: '40px', height: '40px' }}
                loop
                autoPlay
              ></lottie-player>
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Secure Claim</h3>
            <p className="text-gray-600">Verify ownership through our secure system and get your item back.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
