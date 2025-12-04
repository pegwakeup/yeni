"use client";

import { useEffect, useRef, useState } from "react";

interface GlitchyTextProps {
  text: string;
  className?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
}

export function GlitchyText({ 
  text, 
  className, 
  color = "#5FC8DA", 
  fontSize = 60,
  fontFamily = "Orbitron, sans-serif"
}: GlitchyTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver for visibility detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px' }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!fontLoaded) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    // Font setup
    const primaryFont = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
    const font = `900 ${fontSize}px "${primaryFont}", sans-serif`;
    
    // Measure
    ctx.font = font;
    const textMetrics = ctx.measureText(text);
    const width = textMetrics.width + 80;
    const height = fontSize * 1.5;

    // High DPI setup
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      // Skip rendering if not visible and not hovered (performance optimization)
      if (!isVisible && !isHovered) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      
      frameCount++;
      
      // Clear
      ctx.clearRect(0, 0, width, height);

      // Glitch probability
      // High probability on hover, low otherwise
      const glitchChance = isHovered ? 0.15 : 0.01;
      const isGlitching = Math.random() < glitchChance;

      // Helper: Draw text
      const drawText = (x: number, y: number, c: string, blur: number = 0) => {
        ctx.font = font;
        ctx.fillStyle = c;
        ctx.shadowBlur = blur;
        ctx.shadowColor = c;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
      };

      if (isGlitching || (isHovered && Math.random() < 0.5)) {
        // --- GLITCH MODE ---
        
        // 1. RGB Split
        const offset = (Math.random() * 6 - 3);
        const vOffset = (Math.random() * 4 - 2);
        
        ctx.globalCompositeOperation = 'screen';
        drawText(centerX - offset, centerY + vOffset, '#ff0040', 2); // Red/Pink
        drawText(centerX + offset, centerY - vOffset, '#00ffff', 2); // Cyan
        drawText(centerX, centerY, '#ffffff', 2); // White core
        ctx.globalCompositeOperation = 'source-over';

        // 2. Random Slices
        const sliceCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < sliceCount; i++) {
          const sliceH = Math.random() * 20 + 5;
          const sliceY = Math.random() * height;
          const sliceXOffset = (Math.random() * 30 - 15);
          
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, sliceY, width, sliceH);
          ctx.clip();
          ctx.clearRect(0, 0, width, height);
          // Draw shifted slice
          drawText(centerX + sliceXOffset, centerY, color);
          ctx.restore();
        }

        // 3. Noise Rects
        if (Math.random() < 0.3) {
            const rw = Math.random() * 40 + 10;
            const rh = Math.random() * 5 + 1;
            const rx = Math.random() * width;
            const ry = Math.random() * height;
            ctx.fillStyle = color;
            ctx.fillRect(rx, ry, rw, rh);
        }

      } else {
        // --- NORMAL MODE ---
        // Subtle float or breathe
        const floatY = Math.sin(frameCount * 0.05) * 2;
        
        // Glow on hover
        const glow = isHovered ? 15 : 0;
        
        drawText(centerX, centerY + floatY, color, glow);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, color, fontSize, fontFamily, isHovered, fontLoaded, isVisible]);

  return (
    <div ref={containerRef} className="inline-block">
      <canvas
        ref={canvasRef}
        className={`${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}
