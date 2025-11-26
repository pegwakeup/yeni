import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface Feature {
  step: string;
  title?: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  title?: string;
  autoPlayInterval?: number;
  imageHeight?: string;
}

export function FeatureSteps({
  features,
  className,
  title = "How to get Started",
  autoPlayInterval = 3000,
  imageHeight = "h-[400px]",
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 50));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [progress, features.length, autoPlayInterval]);

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
      
      {/* Gradient Orbs */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -left-40 -top-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-20"
      />
      <motion.div
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1.2, 1, 1.2]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -right-40 -bottom-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-20"
      />

      {/* Content Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Framed Content */}
        <div className="relative bg-white dark:bg-dark-light/30 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/10 p-8 md:p-12">
          {/* Inner Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-xl" />
          
          <div className="relative">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10">
              <div className="order-2 md:order-1 space-y-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-6 md:gap-8"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className={cn(
                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2",
                        index === currentFeature
                          ? "bg-primary border-primary text-slate-900 dark:text-white scale-110"
                          : "bg-dark-light border-slate-200 dark:border-white/10",
                      )}
                    >
                      <span className="text-lg font-semibold">{index + 1}</span>
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-semibold">
                        {feature.title || feature.step}
                      </h3>
                      <p className="text-sm md:text-lg text-gray-400">
                        {feature.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="order-1 md:order-2 relative h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-lg">
                <AnimatePresence mode="wait">
                  {features.map(
                    (feature, index) =>
                      index === currentFeature && (
                        <motion.div
                          key={index}
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          initial={{ y: 100, opacity: 0, rotateX: -20 }}
                          animate={{ y: 0, opacity: 1, rotateX: 0 }}
                          exit={{ y: -100, opacity: 0, rotateX: 20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <img
                            src={feature.image}
                            alt={feature.step}
                            className="w-full h-full object-cover transition-transform transform"
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}