import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Timeout to prevent infinite loading
        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => resolve(null), 8000)
        );
        
        const userPromise = getCurrentUser();
        
        const currentUser = await Promise.race([userPromise, timeoutPromise]);
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;