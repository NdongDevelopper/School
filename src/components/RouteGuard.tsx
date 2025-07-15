'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SpecialiteKey } from '@/utils/specialites';  // Assure-toi que ce type existe

export default function RouteGuard({ 
  children,
  roles,
  specialite
}: {
  children: React.ReactNode;
  roles?: string[];
  specialite?: SpecialiteKey;   // Ajout ici
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    if (loading) return;

    console.log("RouteGuard - User:", user);
    console.log("RouteGuard - Pathname:", pathname);
    console.log("RouteGuard - Required roles:", roles);
    console.log("RouteGuard - Required specialite:", specialite);

    if (!user) {
      console.log("Redirecting to login");
      router.push('/login');
      return;
    }

    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      console.log("Access denied, redirecting to unauthorized");
      router.push('/unauthorized');
      return;
    }

    if (user.role === 'etudiant' && specialite && user.specialite !== specialite) {
      console.log(`Redirecting etudiant to their tableau-bord: /${user.specialite}/tableau-bord`);
      router.push(`/${user.specialite}/tableau-bord`);
      return;
    }

    console.log("Access granted");
    setAccessGranted(true);
  }, [user, loading, pathname, roles, specialite, router]);

  if (loading || !accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
