// src/components/ui/effects/aurora-background.tsx
import React from 'react';
import { motion } from 'framer-motion';

const AuroraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{
            width: '1200px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, hsla(var(--primary-light)/0.1), transparent 60%)',
            filter: 'blur(100px)',
            position: 'absolute',
            top: '-20%',
            left: '-20%',
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', delay: 5 }}
        style={{
            width: '1000px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, hsla(var(--brand)/0.1), transparent 60%)',
            filter: 'blur(100px)',
            position: 'absolute',
            bottom: '-30%',
            right: '-30%',
        }}
      />
    </div>
  );
};

export default AuroraBackground;
