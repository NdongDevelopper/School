"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { SPECIALITES, SpecialiteKey } from '@/utils/specialites';
import Link from 'next/link';

type UserRole = 'etudiant' | 'enseignant' | 'admin' | 'responsable';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('etudiant');
  const [specialite, setSpecialite] = useState<SpecialiteKey>('ida');
  const [niveau, setNiveau] = useState('L1');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth(); // Assuming useAuth provides a login function
  const router = useRouter(); // Assuming useRouter is for navigation after login

  // Effect to reset specialite and niveau when role changes
  useEffect(() => {
    // Only reset if the role actually implies a default specialite/niveau,
    // or if you want to clear selections when switching roles.
    // For this example, we'll keep the original logic.
    setSpecialite('ida'); // Default specialite
    setNiveau('L1'); // Default niveau
  }, [role]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Your login logic here.
    // This part remains unchanged as it's functional, not design-related.
    if (role === 'etudiant') {
      login(username, password, role, specialite, niveau);
    } else if (role === 'enseignant' || role === 'responsable') {
      login(username, password, role, specialite);
    } else {
      login(username, password, role);
    }
    // For demonstration, let's just log the credentials
    console.log({ username, password, role, specialite, niveau, rememberMe });
    // router.push('/dashboard'); // Example redirect
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Section gauche - Bleue */}
      <div className="flex-1 bg-gradient-to-br from-[#0056b3] to-[#003d80] flex flex-col justify-center items-center p-12 text-white relative">
        <div className="max-w-md text-center z-10">
          <h1 className="text-4xl font-bold mb-4">Page Authentification</h1>
          <h2 className="text-xl font-normal mb-8 leading-relaxed">
            des étudiants, prof, responsable de formation, et Administrateur Général
          </h2>

          <p className="text-lg leading-relaxed mb-12 opacity-90">
            Soyez les bienvenus dans la page authentifications de l'université Numérique du Sénégal.
          </p>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 border-2 border-white border-opacity-30 shadow-lg">
              {/* Assuming Font Awesome is available */}
              <i className="fas fa-comments text-3xl text-white"></i>
            </div>
            <p className="text-sm opacity-80">Illustration du support de tickets</p>
          </div>
        </div>
        {/* Subtle background pattern/overlay if needed, uncomment and style */}
        {/* <div className="absolute inset-0 bg-white opacity-5 pointer-events-none"></div> */}
      </div>

      {/* Section droite - Formulaire */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-12 relative overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-lg p-8 md:p-10 shadow-lg z-10">
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">Bonjour,</h3>
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">Page de Connexion</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Connectez-vous à votre compte utilisateur pour accéder à la Plateforme. Ou si vous êtes nouveau,
              <Link href="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer ml-1 transition-colors duration-200">
                S'inscrire ici
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Nom d'utilisateur */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-user text-gray-400 text-base"></i>
              </div>
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-500 text-gray-800 text-base"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400 text-base"></i>
              </div>
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-500 text-gray-800 text-base"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
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
                <i className="fas fa-user-tag text-gray-400 text-base"></i>
              </div>
              <select
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white appearance-none text-gray-800 text-base cursor-pointer"
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
                  <i className="fas fa-graduation-cap text-gray-400 text-base"></i>
                </div>
                <select
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white appearance-none text-gray-800 text-base cursor-pointer"
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value as SpecialiteKey)}
                >
                  {/* Ensure SPECIALITES is correctly imported and structured */}
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
                  <i className="fas fa-layer-group text-gray-400 text-base"></i>
                </div>
                <select
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white appearance-none text-gray-800 text-base cursor-pointer"
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
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-3 text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span>Connexion</span>
              {/* Assuming Font Awesome is available */}
              <i className="fas fa-arrow-right text-base ml-2"></i>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
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