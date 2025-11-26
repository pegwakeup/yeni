import React from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className }) => {
  return (
    <div className={cn("relative inline-block font-['Orbitron'] tracking-wider", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500/80 opacity-70 animate-glitch-1 mix-blend-screen">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-500/80 opacity-70 animate-glitch-2 mix-blend-screen">
        {text}
      </span>
    </div>
  );
};
