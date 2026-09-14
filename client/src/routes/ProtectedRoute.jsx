import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/public/LoginPage';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  const storedUser = user || (() => {
    try {
      const saved = localStorage.getItem('routeresq_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  if (loading && !storedUser) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 font-semibold">
        Validating secure authentication session...
      </div>
    );
  }

  if (!storedUser) {
    return <LoginPage />;
  }

  return children;
}
