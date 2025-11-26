import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, CheckCircle } from 'lucide-react';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  process: {
    title: string;
    description: string;
  }[];
  technologies?: string[];
  image: string;
  caseStudies?: {
    title: string;
    description: string;
    image: string;
    link?: string;
  }[];
}

export const ServiceDetailModal = ({
  isOpen,
  onClose,
  title,
  description,
  features,
  benefits,
  process,
  technologies,
  image,
  caseStudies
}: ServiceDetailModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-dark-light rounded-xl border border-slate-200 dark:border-white/10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Hero Section */}
          <div className="relative aspect-[21/9] overflow-hidden rounded-t-xl">
            <div className="absolute inset-0">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-3xl px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
                <p className="text-lg text-gray-300">{description}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-12">
            {/* Features */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Özellikler</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-white dark:bg-dark rounded-xl border border-slate-200 dark:border-white/10"
                  >
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Faydalar</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white dark:bg-dark rounded-xl border border-slate-200 dark:border-white/10"
                  >
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Process */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Süreç</h3>
              <div className="space-y-4">
                {process.map((step, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white dark:bg-dark rounded-xl border border-slate-200 dark:border-white/10"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                        <p className="text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technologies */}
            {technologies && (
              <section>
                <h3 className="text-2xl font-bold mb-6">Teknolojiler</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Case Studies */}
            {caseStudies && (
              <section>
                <h3 className="text-2xl font-bold mb-6">Örnek Projeler</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {caseStudies.map((study, index) => (
                    <div
                      key={index}
                      className="group relative bg-white dark:bg-dark rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden"
                    >
                      <div className="aspect-[4/3]">
                        <img
                          src={study.image}
                          alt={study.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h4 className="text-lg font-bold mb-2">{study.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{study.description}</p>
                          {study.link && (
                            <a
                              href={study.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-primary hover:text-primary-light transition-colors"
                            >
                              <span>Projeyi İncele</span>
                              <ArrowUpRight className="w-4 h-4 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="text-center pt-8">
              <a
                href="/project-request"
                className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors group"
              >
                <span>Projenizi Başlatalım</span>
                <ArrowUpRight className="w-5 h-5 ml-2 group-hover:rotate-45 transition-transform" />
              </a>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};