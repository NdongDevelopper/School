'use client';

import { useAuth } from '@/context/AuthContext';

interface Matiere {
  nom: string;
  note: number;
  coefficient: number;
  professeur: string;
}

export default function NotesPage() {
  const { user } = useAuth();

  // Données simulées pour Communication Digitale selon le niveau
  const getMatieres = (): Matiere[] => {
    switch(user?.niveau) {
      case 'L1':
        return [
          { nom: "Introduction à la communication", note: 15, coefficient: 4, professeur: "Mme. Dubois" },
          { nom: "Rédaction web", note: 16, coefficient: 3, professeur: "M. Martin" },
          { nom: "Marketing digital", note: 14.5, coefficient: 5, professeur: "Dr. Lefevre" },
          { nom: "Design graphique", note: 13.5, coefficient: 4, professeur: "M. Bernard" }
        ];
      case 'L2':
        return [
          { nom: "Stratégie de contenu", note: 15.5, coefficient: 5, professeur: "Mme. Rousseau" },
          { nom: "Gestion de communauté", note: 16, coefficient: 4, professeur: "M. Garcia" },
          { nom: "Analytics web", note: 14, coefficient: 4, professeur: "Dr. Kim" },
          { nom: "Branding digital", note: 17, coefficient: 5, professeur: "Mme. Nguyen" }
        ];
      default: // L3, M1, M2 et autres
        return [
          { nom: "Stratégie digitale avancée", note: 16.5, coefficient: 6, professeur: "Dr. Anderson" },
          { nom: "E-réputation", note: 15, coefficient: 5, professeur: "Prof. Patel" },
          { nom: "Influence marketing", note: 17.5, coefficient: 5, professeur: "M. Dubois" },
          { nom: "Communication de crise", note: 14.5, coefficient: 6, professeur: "Mme. Martin" }
        ];
    }
  };

  const matieres = getMatieres();

  // Calcul de la moyenne pondérée
  const calculerMoyenne = () => {
    const totalPoints = matieres.reduce((sum, m) => sum + m.note * m.coefficient, 0);
    const totalCoefficients = matieres.reduce((sum, m) => sum + m.coefficient, 0);
    return totalCoefficients ? totalPoints / totalCoefficients : 0;
  };

  const moyenneGenerale = calculerMoyenne();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notes Académiques</h1>
      <div className="mb-6">
        <p className="font-semibold text-lg">
          Spécialité: Communication Digitale - Niveau: {user?.niveau || 'Inconnu'}
        </p>
        <div className="mt-4 bg-teal-50 p-4 rounded-lg">
          <p className="text-xl font-bold">
            Moyenne Générale: <span className="text-teal-700">{moyenneGenerale.toFixed(2)}/20</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coefficient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professeur</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matieres.map((matiere, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{matiere.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    matiere.note >= 16 ? 'bg-green-100 text-green-800' : 
                    matiere.note >= 12 ? 'bg-blue-100 text-blue-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {matiere.note}/20
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{matiere.coefficient}</td>
                <td className="px-6 py-4 whitespace-nowrap">{matiere.professeur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
          Télécharger le bulletin
        </button>
      </div>
    </div>
  );
}
