import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signIn } from '../lib/auth';
import { ArrowRight, Eye, EyeOff, AlertTriangle, Shield } from 'lucide-react';
import { supabase } from '../lib/config/supabase';
import { useTranslation } from '../hooks/useTranslation';

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Load failed attempts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('login_attempts');
    if (stored) {
      try {
        const { attempts, lockout } = JSON.parse(stored);
        setFailedAttempts(attempts || 0);
        if (lockout && Date.now() < lockout) {
          setLockoutUntil(lockout);
        } else if (lockout) {
          // Lockout expired, reset
          localStorage.removeItem('login_attempts');
        }
      } catch (e) {
        localStorage.removeItem('login_attempts');
      }
    }
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          navigate('/admin');
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    checkAuth();
  }, [navigate]);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockoutUntil) return;
    
    const interval = setInterval(() => {
      if (Date.now() >= lockoutUntil) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        localStorage.removeItem('login_attempts');
        setError(null);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const getRemainingLockoutTime = () => {
    if (!lockoutUntil) return '';
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  const isLockedOut = lockoutUntil && Date.now() < lockoutUntil;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check lockout
    if (isLockedOut) {
      setError(`Çok fazla hatalı deneme. Lütfen ${getRemainingLockoutTime()} bekleyin.`);
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) throw error;
      if (!data.session) throw new Error(t('login.oturum_oluşturulamadı', 'Oturum oluşturulamadı.'));

      // Success - reset attempts
      localStorage.removeItem('login_attempts');
      setFailedAttempts(0);

      // Redirect to admin or intended page
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Increment failed attempts
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockout = Date.now() + LOCKOUT_DURATION;
        setLockoutUntil(lockout);
        localStorage.setItem('login_attempts', JSON.stringify({ attempts: newAttempts, lockout }));
        setError(`Çok fazla hatalı deneme. Hesabınız ${Math.ceil(LOCKOUT_DURATION / 60000)} dakika kilitlendi.`);
      } else {
        localStorage.setItem('login_attempts', JSON.stringify({ attempts: newAttempts, lockout: null }));
        const remainingAttempts = MAX_ATTEMPTS - newAttempts;
        setError(`${err.message || 'E-posta veya şifre hatalı.'} (${remainingAttempts} deneme hakkınız kaldı)`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left Panel - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-[500px] p-8 flex flex-col justify-center relative z-10"
      >
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <Link to="/">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl opacity-50" />
                <img 
                  src="/images/Unilancer logo 2.png" 
                  alt="Unilancer"
                  className="h-16 relative"
                />
              </motion.div>
            </Link>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lockout Warning */}
            {isLockedOut && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3"
              >
                <Shield className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-orange-500 text-sm font-medium">Hesap Geçici Olarak Kilitlendi</p>
                  <p className="text-orange-400 text-xs mt-1">
                    Kalan süre: <span className="font-mono font-bold">{getRemainingLockoutTime()}</span>
                  </p>
                </div>
              </motion.div>
            )}

            {error && !isLockedOut && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t('login.eposta', 'E-posta')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                className={`w-full bg-dark-light/50 backdrop-blur-sm border rounded-xl px-4 py-3 focus:outline-none transition-colors placeholder-gray-400 text-gray-100 ${
                  touched.email && email && !isValidEmail(email)
                    ? 'border-red-500/50 focus:border-red-500'
                    : touched.email && email && isValidEmail(email)
                    ? 'border-green-500/50 focus:border-green-500'
                    : 'border-white/10 focus:border-primary'
                }`}
                placeholder="ornek@unilancer.com"
                required
                disabled={loading || isLockedOut}
                autoComplete="email"
              />
              {touched.email && email && !isValidEmail(email) && (
                <p className="text-red-400 text-xs mt-1">Geçerli bir e-posta adresi girin</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t('login.şifre', 'Şifre')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  className="w-full bg-dark-light/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-primary transition-colors placeholder-gray-400 text-gray-100"
                  placeholder="••••••••"
                  required
                  disabled={loading || isLockedOut}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-white/5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {capsLockOn && (
                <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Caps Lock açık
                </p>
              )}
            </div>

            {/* Failed attempts indicator */}
            {failedAttempts > 0 && failedAttempts < MAX_ATTEMPTS && !isLockedOut && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex gap-1">
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < failedAttempts ? 'bg-red-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span>{MAX_ATTEMPTS - failedAttempts} deneme hakkı kaldı</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLockedOut}
              className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl transition-colors relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('login.giriş_yapılıyor', 'Giriş yapılıyor...')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{t('login.giriş_yap', 'Giriş Yap')}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </button>
          </form>
        </div>
      </motion.div>

      {/* Right Panel - Decorative Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block flex-1 relative overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/blog-images//3236267.jpg"
            alt="Abstract Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/90 to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <motion.div
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-primary-light/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1.2, 1, 1.2]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-primary-light/20 to-primary/10 rounded-full blur-3xl"
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
      </motion.div>
    </div>
  );
};

export default Login;