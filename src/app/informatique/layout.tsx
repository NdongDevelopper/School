import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ReactNode } from 'react';

export default function InformatiqueLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredSpecialite="ida">

      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-blue-800 text-white p-4 text-center">
  © {new Date().getFullYear()} Université Numérique du Sénégal (UNS) - Informatique développement d'application
</footer>
      </div>
    </ProtectedRoute>
  );
}