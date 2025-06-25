// components/Stats.js
import React from 'react';

function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-4xl font-bold text-purple-700 mb-2">1,240+</h3>
            <p className="text-gray-600">Items Found</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-4xl font-bold text-purple-700 mb-2">980+</h3>
            <p className="text-gray-600">Items Returned</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-4xl font-bold text-purple-700 mb-2">24</h3>
            <p className="text-gray-600">Hours Average</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-4xl font-bold text-purple-700 mb-2">99%</h3>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
