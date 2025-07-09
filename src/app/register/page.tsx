'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { SPECIALITES, SpecialiteKey } from '@/utils/specialites';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'etudiant' | 'enseignant' | 'responsable'>('etudiant');
  const [specialite, setSpecialite] = useState<SpecialiteKey>('ida');
  const [niveau, setNiveau] = useState('L1');
  const [error, setError] = useState('');
  const { 
    registerStudent, 
    registerTeacher,
    registerResponsable,
    isUsernameTaken 
  } = useAuth();
  const router = useRouter();

  const niveauxAcademiques = ['L1', 'L2', 'L3', 'M1', 'M2'];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isUsernameTaken(username)) {
      setError("Ce nom d'utilisateur est déjà pris.");
      return;
    }

    let success = false;
    
    if (role === 'etudiant') {
      success = registerStudent(username, password, specialite, niveau);
    } else if (role === 'enseignant') {
      success = registerTeacher(username, password, specialite);
    } else if (role === 'responsable') {
      success = registerResponsable(username, password, specialite);
    }

    if (success) {
      router.push('/login');
    } else {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              id="role"
              name="role"
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="etudiant">Étudiant</option>
              <option value="enseignant">Enseignant</option>
              <option value="responsable">Responsable de filière</option>
            </select>
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Nom d'utilisateur</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="specialite" className="block text-sm font-medium text-gray-700">
              {role === 'etudiant' ? 'Filière' : role === 'enseignant' ? 'Filière enseignée' : 'Filière responsable'}
            </label>
            <select
              id="specialite"
              name="specialite"
              required
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={specialite}
              onChange={(e) => setSpecialite(e.target.value as SpecialiteKey)}
            >
              {Object.entries(SPECIALITES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          {role === 'etudiant' && (
            <div>
              <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">Niveau</label>
              <select
                id="niveau"
                name="niveau"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
              >
                {niveauxAcademiques.map((niv) => (
                  <option key={niv} value={niv}>{niv}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              S'inscrire
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}