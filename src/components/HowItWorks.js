import React from 'react';

const steps = [
  {
    title: '1. Report Lost or Found',
    description: 'Submit details about your lost item or an item you\'ve found on campus.',
    lottieSrc: 'https://assets1.lottiefiles.com/packages/lf20_gn0tojcq.json',
  },
  {
    title: '2. Smart Matching',
    description: 'Our system automatically matches lost reports with found items.',
    lottieSrc: 'https://assets1.lottiefiles.com/packages/lf20_osdxlbqq.json',
  },
  {
    title: '3. Secure Claim',
    description: 'Verify ownership through our secure system and get your item back.',
    lottieSrc: 'https://assets1.lottiefiles.com/packages/lf20_1LhG0H.json',
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-[#1a1330] via-[#0d0b1f] to-[#1a1330] text-white"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 drop-shadow-md">
          ✨ How It Works
        </h2>
        <ol className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <li
              key={index}
              className="glass-card p-8 rounded-2xl text-center transition-all hover:shadow-xl hover:scale-105 backdrop-blur-lg bg-white/10 border border-white/20"
              aria-label={step.title}
            >
              <div className="w-20 h-20 bg-white/10 border border-purple-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <lottie-player
                  src={step.lottieSrc}
                  background="transparent"
                  speed="1"
                  style={{ width: '40px', height: '40px' }}
                  loop
                  autoplay
                  title={step.title}
                ></lottie-player>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-200">{step.title}</h3>
              <p className="text-purple-100 opacity-90">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
