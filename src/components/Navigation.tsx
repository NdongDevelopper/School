'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { getNomSpecialite, SpecialiteKey } from '@/utils/specialites';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import des icônes de menu

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/';

    const specialiteBasePath = user.specialite ? `/${user.specialite}` : '';

    switch (user.role) {
      case 'etudiant':
        return `${specialiteBasePath}/tableau-bord`;
      case 'enseignant':
        return '/enseignant/dashboard';
      case 'responsable':
        return '/responsable/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow-lg py-4 px-4 md:px-8 flex flex-wrap items-center justify-between sticky top-0 z-50">
      {/* Logo et bouton mobile */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/" className="text-lg md:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">
          <span className="text-blue-600">Bienvenue à UNS</span> 
        </Link>
        
        {/* Bouton menu mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu desktop - toujours visible sur écrans larges */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 font-medium">
              <span className="truncate max-w-[150px]">{user.username}</span>
              {user.specialite && (
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {getNomSpecialite(user.specialite as SpecialiteKey)}
                  {user.niveau && ` - ${user.niveau}`}
                </span>
              )}
            </div>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connexion
          </Link>
        )}
      </div>

      {/* Menu mobile - visible seulement quand ouvert */}
      {isOpen && (
        <div className="md:hidden w-full mt-4 bg-white rounded-lg shadow-xl py-4 px-6">
          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <div className="flex flex-col space-y-2 pb-3 border-b">
                  <span className="text-gray-800 font-medium">{user.username}</span>
                  {user.specialite && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold w-fit">
                      {getNomSpecialite(user.specialite as SpecialiteKey)}
                      {user.niveau && ` - ${user.niveau}`}
                    </span>
                  )}
                </div>

                <Link 
                  href={getDashboardLink()}
                  className="text-gray-700 hover:text-blue-600 py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Tableau de bord
                </Link>

                <button 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md text-center w-full"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Connexion
                </Link>
                
                <Link 
                  href="/register"
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg shadow-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}