'use client';

import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import { useEffect, useState } from 'react';

interface Cours {
  id: string;
  jour: string;
  heure: string;
  matiere: string;
  niveau: string;
  salle: string;
}

export default function EmploiTempsEnseignant() {
  const { user } = useAuth();
  const [cours, setCours] = useState<Cours[]>([]);
  const [selectedJour, setSelectedJour] = useState<string>('Tous');
  const [selectedNiveau, setSelectedNiveau] = useState<string>('Tous');

  const jours = ['Tous', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const niveaux = ['Tous', 'L1', 'L2', 'L3', 'M1', 'M2'];

  useEffect(() => {
    const data = [
      { id: '1', jour: "Lundi", heure: "08:00 - 10:00", matiere: "Algorithmique", niveau: "L1", salle: "A101" },
      { id: '2', jour: "Lundi", heure: "10:30 - 12:30", matiere: "Base de données", niveau: "L2", salle: "B205" },
      { id: '3', jour: "Mardi", heure: "08:00 - 10:00", matiere: "Programmation Web", niveau: "L3", salle: "C302" },
      { id: '4', jour: "Mardi", heure: "14:00 - 16:00", matiere: "Systèmes d'exploitation", niveau: "M1", salle: "D401" },
      { id: '5', jour: "Mercredi", heure: "10:30 - 12:30", matiere: "Machine Learning", niveau: "M2", salle: "E205" },
      { id: '6', jour: "Jeudi", heure: "08:00 - 10:00", matiere: "Cloud Computing", niveau: "M1", salle: "F305" },
      { id: '7', jour: "Vendredi", heure: "14:00 - 16:00", matiere: "Projet de fin d'études", niveau: "M2", salle: "G103" },
    ];
    setCours(data);
  }, []);

  const filteredCours = cours.filter(c => 
    (selectedJour === 'Tous' || c.jour === selectedJour) &&
    (selectedNiveau === 'Tous' || c.niveau === selectedNiveau)
  );

  return (
    <RouteGuard roles={['enseignant']}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Emploi du temps - {user?.nomSpecialite}</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedJour}
                onChange={(e) => setSelectedJour(e.target.value)}
              >
                {jours.map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedNiveau}
                onChange={(e) => setSelectedNiveau(e.target.value)}
              >
                {niveaux.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salle</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCours.map((coursItem) => (
                  <tr key={coursItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{coursItem.jour}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{coursItem.heure}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{coursItem.matiere}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coursItem.niveau.startsWith('M') 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {coursItem.niveau}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{coursItem.salle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
