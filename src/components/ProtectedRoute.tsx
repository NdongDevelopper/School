'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { SpecialiteKey } from '@/utils/specialites';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredSpecialite?: SpecialiteKey;
}

export default function ProtectedRoute({ children, requiredSpecialite }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Suppression de la validation stricte
  }, [user, loading, requiredSpecialite, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirection...</p>
      </div>
    );
  }

  return children;
}