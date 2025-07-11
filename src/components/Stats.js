import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Items Found', value: '1,240+' },
  { label: 'Items Returned', value: '980+' },
  { label: 'Hours Average', value: '24' },
  { label: 'Satisfaction Rate', value: '99%' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Stats() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#1a1330] via-[#2c1a4e] to-[#1a1330] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 rounded-2xl shadow hover:shadow-xl transition border border-white/10"
              variants={cardVariants}
            >
              <h3 className="text-4xl font-bold text-purple-400 mb-2">{stat.value}</h3>
              <p className="text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Stats;
