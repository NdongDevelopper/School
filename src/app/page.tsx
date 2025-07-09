'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      switch(user.specialite) {
        case 'ida':
          router.push('/informatique/tableau-bord');
          break;
        case 'mic':
          router.push('/multimedia/tableau-bord');
          break;
        case 'cd':
          router.push('/communication/tableau-bord');
          break;
        default:
          router.push('/login');
      }
    } else {
      router.push('/login'); // Redirection vers la page de login
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement de la plateforme...</p>
      </div>
    </div>
  );
}