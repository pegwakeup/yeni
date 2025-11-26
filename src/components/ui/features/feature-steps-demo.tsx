import React from 'react';
import { FeatureSteps } from './feature-steps';

const features = [
  { 
    step: 'Step 1', 
    title: 'Modern Teknolojiler',
    content: 'En son teknolojileri kullanarak işletmenizi dijital dünyada öne çıkarıyoruz.', 
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000' 
  },
  { 
    step: 'Step 2',
    title: 'Özel Çözümler',
    content: 'İşletmenize özel, ölçeklenebilir ve sürdürülebilir çözümler geliştiriyoruz.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80'
  },
  { 
    step: 'Step 3',
    title: 'Sürekli Destek',
    content: 'Projenizin her aşamasında yanınızda olup, sürekli teknik destek sağlıyoruz.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80'
  },
];

export function FeatureStepsDemo() {
  return (
    <FeatureSteps 
      features={features}
      title="Nasıl Çalışıyoruz?"
      autoPlayInterval={4000}
      imageHeight="h-[500px]"
    />
  );
}