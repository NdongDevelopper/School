'use client';

import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/context/AuthContext';
import { getNomSpecialite, SpecialiteKey } from '@/utils/specialites'; // Utilisation du type correct
import { useParams } from 'next/navigation';

export default function TableauBord() {
  const { user, logout } = useAuth();
  const params = useParams();
  
  // Vérifier que params n'est pas null et que specialite est bien présent
  if (!params || !params.specialite) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 text-xl">Erreur: Paramètres de spécialité manquants</p>
    </div>;
  }
  
  // S'assurer que specialite est une chaîne
  const specialiteParam = Array.isArray(params.specialite) 
    ? params.specialite[0] 
    : params.specialite;
  
  // Vérifier que la spécialité est valide en utilisant SpecialiteKey
  const validSpecialites: SpecialiteKey[] = ['ida', 'mic', 'cd'];
  if (!validSpecialites.includes(specialiteParam as SpecialiteKey)) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 text-xl">Erreur: Spécialité non valide</p>
    </div>;
  }

  const specialite = specialiteParam as SpecialiteKey;

  return (
    <RouteGuard roles={['etudiant']}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-blue-800">
                {getNomSpecialite(specialite)} - Tableau de bord
              </h1>
              <p className="text-gray-600">
                {user?.nomSpecialite} • Niveau {user?.niveau}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.username}</span>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Mes cours</h2>
              <ul className="space-y-2">
                <li className="flex justify-between items-center border-b pb-2">
                  <span>Algorithmique avancée</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">En cours</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span>Base de données</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Terminé</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span>Développement web</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">En cours</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Emploi du temps</h2>
              <div className="bg-gray-100 p-4 rounded text-center text-gray-500">
                <p>Lundi: 08h-10h - Algorithmique</p>
                <p>Mardi: 10h-12h - Développement web</p>
                <p>Mercredi: 14h-16h - Base de données</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Notes récentes</h2>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Algorithmique avancée</span>
                  <span className="font-bold">16/20</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Base de données</span>
                  <span className="font-bold">14/20</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Mathématiques</span>
                  <span className="font-bold">18/20</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Prochaines échéances</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Cours</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Date limite</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3">Algorithmique avancée</td>
                    <td className="px-4 py-3">Projet</td>
                    <td className="px-4 py-3">15/06/2024</td>
                    <td className="px-4 py-3">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        À rendre
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Développement web</td>
                    <td className="px-4 py-3">Devoir</td>
                    <td className="px-4 py-3">10/06/2024</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Rendu
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}