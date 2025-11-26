// src/components/ui/effects/animated-text.tsx
import React from "react";
import { motion, Variants } from "framer-motion";

interface Word {
  text: string;
  className?: string;
}

interface AnimatedTextProps {
  words: Word[];
  className?: string;
  as?: keyof typeof motion;
  stagger?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ words, className, as = "div", stagger = 0.08 }) => {
  const MotionComponent = motion[as] || motion.div;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // A different animation for highlighted words
  const highlightVariants: Variants = {
    hidden: { opacity: 0, y: -20, scale: 0.8, rotateX: 45 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 150,
      },
    },
  };

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={word.className ? highlightVariants : childVariants}
          className={`inline-block mr-[0.25em] ${word.className || ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {word.text}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export default AnimatedText;
