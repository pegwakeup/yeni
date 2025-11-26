import { useState, useEffect, useCallback } from "react";
import { Badge } from "./badge";
import { GripVertical, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function PortfolioPreview() {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }
    
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setInset(percentage);
  }, [onMouseDown]);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setOnMouseDown(true);
    onMouseMove(e);
  }, [onMouseMove]);

  const handleMouseUp = useCallback(() => {
    setOnMouseDown(false);
  }, []);

  return (
    <div className="w-full py-12 bg-gradient-to-b from-transparent via-cyan-50/20 to-transparent dark:from-transparent dark:via-transparent dark:to-transparent">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-center">
          {/* Left Column - Project Details */}
          <div className="space-y-4">
            <div>
              <Badge className="bg-primary/10 text-primary border-primary/20">Örnek Proje</Badge>
              <h2 className="text-2xl md:text-3xl tracking-tighter font-regular mt-4">
                Modern Ofis Tasarımı
              </h2>
              <p className="text-base leading-relaxed tracking-tight text-slate-600 dark:text-gray-400 mt-2">
                Kullanıcı deneyimini ön planda tutan, modern ve minimalist ofis tasarımı projesi. Ergonomik çalışma alanları ve akıllı aydınlatma sistemleri ile öne çıkan proje.
              </p>
            </div>

            {/* CTA Button */}
            <Link
              to="/portfolio"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors group"
            >
              <span>Diğer Projelerimize Göz Atın</span>
              <ArrowUpRight className="w-5 h-5 ml-2 group-hover:rotate-45 transition-transform" />
            </Link>
          </div>

          {/* Right Column - Image Comparison */}
          <div className="relative">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden rounded-xl select-none border border-slate-200 dark:border-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-500"
              onMouseMove={onMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={onMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Slider Bar with Shadow */}
              <div
                className="h-full absolute z-20 top-0 select-none pointer-events-none"
                style={{
                  left: `calc(${inset}% - 1px)`,
                  width: '2px',
                }}
              >
                {/* Shadow overlay */}
                <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,0,0,0.7)] blur-[3px]" />
                
                {/* Main slider bar */}
                <div className="h-full w-full bg-white/60 backdrop-blur-sm" />
                
                {/* Drag handle */}
                <button
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-20 pointer-events-auto"
                  style={{ left: '1px' }}
                  onTouchStart={handleMouseDown}
                  onMouseDown={handleMouseDown}
                  onTouchEnd={handleMouseUp}
                  onMouseUp={handleMouseUp}
                >
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-full shadow-lg transform hover:scale-110 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent rounded-full animate-pulse" />
                    <div className="absolute inset-0 shadow-[0_0_10px_rgba(95,200,218,0.3)] rounded-full" />
                    <GripVertical className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </button>
              </div>

              {/* Mobile Instructions */}
              {isMobile && !onMouseDown && (
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                  <div className="bg-dark/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white animate-pulse shadow-lg">
                    Kaydırarak karşılaştırın
                  </div>
                </div>
              )}

              {/* Light Version */}
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2000"
                alt="Modern Ofis - Aydınlık"
                className="absolute left-0 top-0 z-10 w-full h-full object-cover select-none"
                style={{
                  clipPath: `inset(0 0 0 ${inset}%)`
                }}
              />
              {/* Dark Version */}
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000"
                alt="Modern Ofis - Karanlık"
                className="absolute left-0 top-0 w-full h-full object-cover select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PortfolioPreview };