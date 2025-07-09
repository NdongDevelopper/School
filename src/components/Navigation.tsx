'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { getNomSpecialite, SpecialiteKey } from '@/utils/specialites';
import { useState } from 'react'; // For mobile menu toggle if added later

export default function Navigation() {
  const { user, logout } = useAuth();
  // State for mobile menu, if you plan to add one
  // const [isOpen, setIsOpen] = useState(false);

  // Helper function for dashboard link based on user role and specialite
  const getDashboardLink = () => {
    if (!user) return '/';

    // Base path for specialite-specific dashboards
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
        return '/'; // Fallback
    }
  };

  return (
    <nav className="bg-white shadow-lg py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Left section: Logo/Site Title */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">
          {/* You can replace this with an actual image logo */}
          <span className="text-blue-600">Bienvenue dans l'Unuversité Numérique du Sénégal</span> 
        </Link>
      </div>

      {/* Right section: User info and Auth buttons */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* User Info - Hidden on small screens, block on medium and up */}
            <div className="hidden md:flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 font-medium">
              <span className="truncate max-w-[150px]">{user.username}</span> {/* Added truncate */}
              {user.specialite && (
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {getNomSpecialite(user.specialite as SpecialiteKey)}
                  {user.niveau && ` - ${user.niveau}`}
                </span>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Déconnexion
            </button>
          </>
        ) : (
          /* Login Button */
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connexion
          </Link>
        )}
      </div>

      {/* You could add a mobile menu button here if needed */}
      {/* <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-800 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div> */}

      {/* Mobile Menu (conditional rendering based on isOpen state) */}
      {/* {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4">
          <div className="flex flex-col items-center space-y-4">
            {user && (
              <>
                <span className="text-gray-800 font-medium">{user.username}</span>
                {user.specialite && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {getNomSpecialite(user.specialite as SpecialiteKey)}
                    {user.niveau && ` - ${user.niveau}`}
                  </span>
                )}
              </>
            )}
            <Link href={getDashboardLink()} className="text-gray-700 hover:text-blue-600 py-2">Dashboard</Link>
            {user ? (
              <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg w-full">Déconnexion</button>
            ) : (
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full text-center">Connexion</Link>
            )}
          </div>
        </div>
      )} */}
    </nav>
  );
}