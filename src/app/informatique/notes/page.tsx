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

  // Matières simulées selon le niveau de l'utilisateur
  const getMatieres = (): Matiere[] => {
    switch(user?.niveau) {
      case 'L1':
        return [
          { nom: "Algorithmique", note: 15.5, coefficient: 4, professeur: "Dr. Smith" },
          { nom: "Mathématiques discrètes", note: 12, coefficient: 3, professeur: "Prof. Johnson" },
          { nom: "Introduction à la programmation", note: 17, coefficient: 5, professeur: "Mme. Dupont" },
          { nom: "Bases de données", note: 14, coefficient: 4, professeur: "Dr. Garcia" }
        ];
      case 'L2':
        return [
          { nom: "Structures de données", note: 16, coefficient: 5, professeur: "Dr. Martin" },
          { nom: "Réseaux informatiques", note: 13.5, coefficient: 4, professeur: "Prof. Lee" },
          { nom: "Systèmes d'exploitation", note: 15, coefficient: 4, professeur: "M. Bernard" },
          { nom: "Développement web", note: 18, coefficient: 5, professeur: "Mme. Rousseau" }
        ];
      case 'L3':
      case 'M1':
      case 'M2':
      default:
        return [
          { nom: "Intelligence artificielle", note: 16.5, coefficient: 6, professeur: "Dr. Kim" },
          { nom: "Sécurité informatique", note: 14.5, coefficient: 5, professeur: "Prof. Anderson" },
          { nom: "Cloud computing", note: 17, coefficient: 5, professeur: "M. Dubois" },
          { nom: "Big Data", note: 15, coefficient: 6, professeur: "Dr. Nguyen" }
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
          Spécialité: {user?.specialite || 'Inconnue'} - Niveau: {user?.niveau || 'Inconnu'}
        </p>

        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <p className="text-xl font-bold">
            Moyenne Générale : <span className="text-blue-700">{moyenneGenerale.toFixed(2)}/20</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Calculée sur la base des coefficients de chaque matière
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appréciation</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matieres.map((matiere, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {matiere.note >= 16 ? 'Excellent' :
                   matiere.note >= 14 ? 'Très bien' :
                   matiere.note >= 12 ? 'Bien' :
                   matiere.note >= 10 ? 'Passable' : 'Insuffisant'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-between">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Télécharger le bulletin
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
          Consulter les archives
        </button>
      </div>
    </div>
  );
}
