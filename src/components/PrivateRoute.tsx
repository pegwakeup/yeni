import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      console.log('PrivateRoute: Checking authentication...');
      const currentUser = await getCurrentUser();
      console.log('PrivateRoute: User:', currentUser);
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    console.log('PrivateRoute: Loading...');
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('PrivateRoute: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute: User authenticated, rendering children');
  return <>{children}</>;
};

export default PrivateRoute;