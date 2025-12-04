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
        type: "tween",
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // A different animation for highlighted words - lighter animation
  const highlightVariants: Variants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.5,
        ease: "easeOut",
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
