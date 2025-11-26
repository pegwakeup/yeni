import React from 'react';
import { motion } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const ScrollAnimation = ({ children, className = '', delay = 0 }: ScrollAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.5,
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1], // Custom easing function
        }
      }}
      viewport={{ 
        once: true, // Only animate once
        margin: "-20% 0px", // Start animation when element is 20% in viewport
        amount: 0.2 // Trigger when 20% of element is visible
      }}
      className={`animate-on-scroll ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;