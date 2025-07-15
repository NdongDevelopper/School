import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ReactNode } from 'react';

export default function CommunicationLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredSpecialite="cd">
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
       <footer className="bg-teal-800 text-white p-4 text-center">
  © {new Date().getFullYear()} Université Numérique du Sénégal (UNS) - Communication digitale
</footer>
      </div>
    </ProtectedRoute>
  );
}