import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ReactNode } from 'react';

export default function MultimediaLayout({ children }: { children: ReactNode }) {
  return (
   <ProtectedRoute requiredSpecialite="mic">

      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
       <footer className="bg-purple-800 text-white p-4 text-center">
  © {new Date().getFullYear()} Université Numérique du Sénégal (UNS) - Multimédia internet et communication
  </footer>
      </div>
    </ProtectedRoute>
  );
}