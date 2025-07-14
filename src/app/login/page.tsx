"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { SPECIALITES, SpecialiteKey } from '@/utils/specialites'; // Assurez-vous que ce chemin est correct
import Link from 'next/link';

type UserRole = 'etudiant' | 'enseignant' | 'admin' | 'responsable';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('etudiant');
  const [specialite, setSpecialite] = useState<SpecialiteKey>('ida');
  const [niveau, setNiveau] = useState('L1');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Effect to reset specialite and niveau when role changes
  useEffect(() => {
    // These defaults ensure consistent behavior,
    // adjust if you want different default selections based on role switch.
    setSpecialite('ida'); // Default specialite
    setNiveau('L1'); // Default niveau
  }, [role]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Your login logic here.
    if (role === 'etudiant') {
      login(username, password, role, specialite, niveau);
    } else if (role === 'enseignant' || role === 'responsable') {
      login(username, password, role, specialite);
    } else {
      login(username, password, role);
    }
    console.log({ username, password, role, specialite, niveau, rememberMe });
    // router.push('/dashboard'); // Example redirect, uncomment when ready
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Section gauche - Bleue */}
      {/* Masquée sur les très petits écrans, visible à partir de sm */}
      <div className="hidden sm:flex md:flex-1 bg-gradient-to-br from-[#0056b3] to-[#003d80] flex-col justify-center items-center p-8 md:p-12 text-white relative min-h-[250px] md:min-h-screen">
        <div className="max-w-md text-center z-10 p-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Page Authentification</h1>
          <h2 className="text-base sm:text-lg md:text-xl font-normal mb-4 md:mb-8 leading-relaxed">
            des étudiants, Enseignant, responsable de formation, et Administrateur Général
          </h2>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-6 md:mb-12 opacity-90">
            Soyez les bienvenus dans la page authentifications de l'université Numérique du Sénégal.
          </p>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 md:mb-4 border-2 border-white border-opacity-30 shadow-lg">
              {/* Assurez-vous que Font Awesome est bien inclus dans votre projet */}
              <i className="fas fa-comments text-2xl sm:text-3xl text-white"></i>
            </div>
            <p className="text-xs sm:text-sm opacity-80">Illustration du support de tickets</p>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire */}
      <div className="flex-1 md:flex-1 bg-white flex flex-col justify-center items-center p-6 md:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-lg p-6 md:p-10 shadow-lg z-10 my-auto"> {/* Added my-auto for vertical centering */}
          <div className="mb-6 md:mb-8 text-center md:text-left">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 md:mb-2">Bonjour,</h3>
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2 md:mb-4">Page de Connexion</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Connectez-vous à votre compte utilisateur pour accéder à la Plateforme. Ou si vous êtes nouveau,
              <Link href="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer ml-1 transition-colors duration-200">
                S'inscrire ici
              </Link>
            </p>
          </div>

          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            {/* Nom d'utilisateur */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-user text-gray-400 text-sm md:text-base"></i>
              </div>
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 text-sm md:text-base"
                // J'ai supprimé l'attribut 'placeholder' ici
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400 text-sm md:text-base"></i>
              </div>
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-800 text-sm md:text-base"
                // J'ai supprimé l'attribut 'placeholder' ici
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 text-gray-700 select-none">
                  Se souvenir de moi
                </label>
              </div>
              <Link href="/forgot-password" className="text-blue-600 hover:underline cursor-pointer font-medium">
                Mot de passe oublié
              </Link>
            </div>

            {/* Role (moved above conditional fields for better flow, adjust if needed) */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-user-tag text-gray-400 text-sm md:text-base"></i>
              </div>
              <select
                required
                className="w-full pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white appearance-none text-gray-800 text-sm md:text-base cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="etudiant">Étudiant</option>
                <option value="enseignant">Enseignant</option>
                <option value="admin">Administrateur</option>
                <option value="responsable">Responsable de filière</option>
              </select>
              {/* Custom arrow for select dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z"/></svg>
              </div>
            </div>

            {/* Filière (conditionnelle) */}
            {(role === 'etudiant' || role === 'enseignant' || role === 'responsable') && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-graduation-cap text-gray-400 text-sm md:text-base"></i>
                </div>
                <select
                  required
                  className="w-full pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white appearance-none text-gray-800 text-sm md:text-base cursor-pointer"
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value as SpecialiteKey)}
                >
                  {Object.entries(SPECIALITES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                {/* Custom arrow for select dropdown */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z"/></svg>
                </div>
              </div>
            )}

            {/* Niveau (conditionnel) */}
            {role === 'etudiant' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-layer-group text-gray-400 text-sm md:text-base"></i>
                </div>
                <select
                  required
                  className="w-full pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white appearance-none text-gray-800 text-sm md:text-base cursor-pointer"
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value)}
                >
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                  <option value="L3">L3</option>
                  <option value="M1">M1</option>
                  <option value="M2">M2</option>
                </select>
                {/* Custom arrow for select dropdown */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z"/></svg>
                </div>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2 md:space-x-3 text-base md:text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span>Connexion</span>
              <i className="fas fa-arrow-right text-sm md:text-base ml-1 md:ml-2"></i>
            </button>
          </form>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Besoin d'aide ?
              <Link href="/support" className="text-blue-600 hover:underline font-medium cursor-pointer ml-1">
                Contactez le support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}