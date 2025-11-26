import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const MODEL_URL = 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/bean-bag-chair.compressed.glb';

useGLTF.preload(MODEL_URL);

type LeatherColor = 'brown' | 'black' | 'beige';

const LEATHER_COLORS = {
  brown: {
    name: 'Klasik Kahverengi',
    color: '#8B4513',
    roughness: 0.4,
    metalness: 0.1
  },
  black: {
    name: 'Siyah Deri',
    color: '#1a1a1a',
    roughness: 0.3,
    metalness: 0.2
  },
  beige: {
    name: 'Bej Deri',
    color: '#D2B48C',
    roughness: 0.45,
    metalness: 0.05
  }
};

interface BeanBagModelProps {
  leatherColor: LeatherColor;
}

const BeanBagModel = React.memo(({ leatherColor }: BeanBagModelProps) => {
  const { scene } = useGLTF(MODEL_URL);
  const modelRef = useRef<THREE.Group>(null);
  const animationFrameRef = useRef<number[]>([]);
  const transformCalculated = useRef(false);
  const materialsInitialized = useRef(false);
  const meshCacheRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (modelRef.current && !transformCalculated.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.45 / maxDim;

      modelRef.current.scale.setScalar(scale);
      modelRef.current.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      );

      transformCalculated.current = true;
    }

    if (modelRef.current && !materialsInitialized.current) {
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshCacheRef.current.push(child);
          const leatherConfig = LEATHER_COLORS[leatherColor];

          if (child.geometry) {
            child.geometry.computeVertexNormals();
            child.geometry.computeBoundingSphere();
          }

          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(leatherConfig.color),
            roughness: leatherConfig.roughness,
            metalness: leatherConfig.metalness,
            envMapIntensity: 1.0,
            side: THREE.FrontSide,
            flatShading: false,
            toneMapped: true
          });
          child.castShadow = false;
          child.receiveShadow = false;
          child.frustumCulled = true;
        }
      });

      materialsInitialized.current = true;
    }
  }, [scene, leatherColor]);

  useEffect(() => {
    animationFrameRef.current.forEach(id => cancelAnimationFrame(id));
    animationFrameRef.current = [];

    if (meshCacheRef.current.length === 0) return;

    const meshes: Array<{
      material: THREE.MeshStandardMaterial;
      startColor: THREE.Color;
      targetColor: THREE.Color;
      startRoughness: number;
      startMetalness: number;
      targetRoughness: number;
      targetMetalness: number;
    }> = [];

    const leatherConfig = LEATHER_COLORS[leatherColor];

    meshCacheRef.current.forEach((mesh) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      meshes.push({
        material,
        startColor: material.color.clone(),
        targetColor: new THREE.Color(leatherConfig.color),
        startRoughness: material.roughness,
        startMetalness: material.metalness,
        targetRoughness: leatherConfig.roughness,
        targetMetalness: leatherConfig.metalness,
      });
    });

    const duration = 300;
    const startTime = Date.now();
    let lastFrameTime = startTime;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const timeSinceLastFrame = currentTime - lastFrameTime;

      if (timeSinceLastFrame < frameInterval) {
        const frameId = requestAnimationFrame(animate);
        animationFrameRef.current.push(frameId);
        return;
      }

      lastFrameTime = currentTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      meshes.forEach(({ material, startColor, targetColor, startRoughness, startMetalness, targetRoughness, targetMetalness }) => {
        material.color.lerpColors(startColor, targetColor, eased);
        material.roughness = THREE.MathUtils.lerp(startRoughness, targetRoughness, eased);
        material.metalness = THREE.MathUtils.lerp(startMetalness, targetMetalness, eased);
        material.needsUpdate = true;
      });

      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        animationFrameRef.current.push(frameId);
      }
    };

    animate();

    return () => {
      animationFrameRef.current.forEach(id => cancelAnimationFrame(id));
      animationFrameRef.current = [];
    };
  }, [leatherColor]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      castShadow
      receiveShadow
    />
  );
});

function LoadingSpinner({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-dark/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-primary/20"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
              className="text-primary transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{progress}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-primary font-semibold mb-1">3D Model Yükleniyor</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Lütfen bekleyin...</p>
        </div>
      </div>
    </div>
  );
}

interface BeanBagChair3DProps {
  className?: string;
  onARClick?: (modelUrl: string, color: string, colorName: string) => void;
}

function ResponsiveCamera() {
  const { viewport, camera } = useThree();

  useEffect(() => {
    const handleResize = () => {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = viewport.width / viewport.height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, viewport]);

  return null;
}

const BeanBagChair3D: React.FC<BeanBagChair3DProps> = ({ className = '', onARClick }) => {
  const [isRotating, setIsRotating] = useState(true);
  const [leatherColor, setLeatherColor] = useState<LeatherColor>('black');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const loadModel = async () => {
      try {
        setLoadingProgress(0);
        setLoadError(null);

        progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        await useGLTF.preload(MODEL_URL);

        clearInterval(progressInterval);
        setLoadingProgress(100);

        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      } catch (error) {
        clearInterval(progressInterval);
        console.error('3D model yükleme hatası:', error);

        if (retryCountRef.current < 3) {
          retryCountRef.current += 1;
          setLoadError(`Yükleme başarısız, tekrar deneniyor... (${retryCountRef.current}/3)`);
          setTimeout(loadModel, 2000);
        } else {
          setLoadError('Model yüklenemedi. Lütfen sayfayı yenileyin.');
        }
      }
    };

    loadModel();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, []);

  const handleCameraReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  useEffect(() => {
    const savedColor = localStorage.getItem('beanBagColor') as LeatherColor;
    if (savedColor && LEATHER_COLORS[savedColor]) {
      setLeatherColor(savedColor);
    } else {
      setLeatherColor('black');
    }
  }, []);

  const handleColorChange = (color: LeatherColor) => {
    setLeatherColor(color);
    localStorage.setItem('beanBagColor', color);
  };

  return (
    <div className={`relative w-full h-[500px] sm:h-[550px] md:h-[650px] lg:h-[700px] xl:h-[800px] ${className}`}>
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true
        }}
        frameloop="always"
        className="touch-none w-full h-full"
        performance={{ min: 0.5, max: 1 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

        <ambientLight intensity={0.7} />
        <hemisphereLight intensity={0.6} groundColor="#555555" />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-camera-far={30}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-3, 3, -3]} intensity={0.4} />

        <Suspense fallback={null}>
          <BeanBagModel leatherColor={leatherColor} />
          <Environment preset="warehouse" />
          <ResponsiveCamera />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={isRotating}
          autoRotateSpeed={1.5}
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          enableDamping={true}
          dampingFactor={0.05}
          onStart={() => setIsRotating(false)}
          onEnd={() => {
            setTimeout(() => setIsRotating(true), 2000);
          }}
        />
      </Canvas>

      {!isLoaded && (
        <LoadingSpinner progress={loadingProgress} />
      )}

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-dark/80 backdrop-blur-sm">
          <div className="text-center p-6 bg-white dark:bg-dark-light rounded-xl shadow-xl max-w-sm">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      )}


      {isRotating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-primary/20 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm text-primary font-medium whitespace-nowrap pointer-events-none z-10"
        >
          Sürükleyerek döndürün
        </motion.div>
      )}

      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white p-2.5 md:p-3 rounded-lg font-semibold shadow-lg transition-all touch-manipulation"
          title="Renk Değiştir"
        >
          <div
            className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: LEATHER_COLORS[leatherColor].color }}
          />
        </motion.button>

        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 shadow-2xl border border-slate-200 dark:border-white/10"
            >
              <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-2">Deri Rengi</p>
              <div className="flex flex-col gap-2">
                {(Object.keys(LEATHER_COLORS) as LeatherColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${
                      leatherColor === color ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: LEATHER_COLORS[color].color }}
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-gray-300 whitespace-nowrap">
                      {LEATHER_COLORS[color].name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCameraReset}
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white p-2.5 md:p-3 rounded-lg shadow-lg transition-all touch-manipulation"
          title="Sıfırla"
        >
          <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </div>

      {onARClick && isLoaded && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(95, 200, 218, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onARClick && onARClick(MODEL_URL, LEATHER_COLORS[leatherColor].color, LEATHER_COLORS[leatherColor].name)}
          className="absolute top-4 right-4 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-full font-semibold shadow-lg shadow-primary/30 flex items-center gap-2 z-10 transition-all touch-manipulation group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <svg
            className="w-4 h-4 md:w-5 md:h-5 relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm md:text-base relative z-10">AR ile Görüntüle</span>
        </motion.button>
      )}
    </div>
  );
};

export default BeanBagChair3D;
