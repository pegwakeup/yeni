import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signIn } from '../lib/auth';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/config/supabase';
import { useTranslation } from '../hooks/useTranslation';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error(t('login.lütfen_eposta_ve', 'Lütfen e-posta ve şifrenizi girin.'));
      }

      const { data, error } = await signIn(email, password);

      if (error) throw error;
      if (!data.session) throw new Error(t('login.oturum_oluşturulamadı', 'Oturum oluşturulamadı.'));

      // Redirect to admin or intended page
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || t('login.giriş_yapılırken_bir', 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'));
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
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm"
              >
                {error}
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
                className="w-full bg-dark-light/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder-gray-400 text-gray-100"
                placeholder="ornek@unilancer.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t('login.şifre', 'Şifre')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-light/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder-gray-400 text-gray-100"
                placeholder="••••••••"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
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