'use client';

import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import { useState } from 'react';
import Link from 'next/link';

export default function CoursEnseignant() {
  const { user } = useAuth();
  const [cours, setCours] = useState([
    { id: 1, titre: "Introduction à l'algorithmique", matiere: "Algorithmique", niveau: "L1", date: "2025-10-01", fichier: "algo-intro.pdf" },
    { id: 2, titre: "Structures de données", matiere: "Algorithmique", niveau: "L1", date: "2025-10-15", fichier: "structures-donnees.pdf" },
    { id: 3, titre: "Bases de SQL", matiere: "Base de données", niveau: "L2", date: "2025-09-20", fichier: "sql-base.pdf" },
    { id: 4, titre: "Normalisation des bases de données", matiere: "Base de données", niveau: "L2", date: "2025-10-05", fichier: "normalisation.pdf" },
  ]);
  const [matiere, setMatiere] = useState("Toutes");
  const [niveau, setNiveau] = useState("Tous");

  // Filtrer les cours
  const filteredCours = cours.filter(c => 
    (matiere === "Toutes" || c.matiere === matiere) &&
    (niveau === "Tous" || c.niveau === niveau)
  );

  // Obtenir les matières uniques
  const matieres = ["Toutes", ...new Set(cours.map(c => c.matiere))];
  const niveaux = ["Tous", ...new Set(cours.map(c => c.niveau))];

  return (
    <RouteGuard roles={['enseignant']}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Gestion des cours - {user?.nomSpecialite}</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={matiere}
                onChange={(e) => setMatiere(e.target.value)}
              >
                {matieres.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
              >
                {niveaux.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            
            <div className="self-end">
              <Link href="/enseignant/cours/ajouter" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Ajouter un cours
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fichier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCours.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{c.titre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{c.matiere}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {c.niveau}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{c.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href="#" className="text-blue-600 hover:text-blue-900">{c.fichier}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Modifier</button>
                      <button className="text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
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