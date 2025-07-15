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
  
  // Données simulées pour Multimédia
  const getMatieres = () => {
    switch(user?.niveau) {
      case 'L1':
        return [
          { nom: "Design graphique", note: 16, coefficient: 4, professeur: "M. Dupont" },
          { nom: "Photographie numérique", note: 14, coefficient: 3, professeur: "Mme. Leroy" },
          { nom: "Introduction au multimédia", note: 15.5, coefficient: 5, professeur: "Dr. Martin" },
          { nom: "Communication visuelle", note: 13, coefficient: 4, professeur: "M. Bernard" }
        ];
      case 'L2':
        return [
          { nom: "Animation 2D", note: 17, coefficient: 5, professeur: "M. Rousseau" },
          { nom: "Vidéo production", note: 15, coefficient: 4, professeur: "Mme. Dubois" },
          { nom: "Design d'interface", note: 14.5, coefficient: 4, professeur: "Dr. Kim" },
          { nom: "Motion design", note: 16.5, coefficient: 5, professeur: "M. Garcia" }
        ];
      default:
        return [
          { nom: "Design interactif", note: 15.5, coefficient: 6, professeur: "Dr. Anderson" },
          { nom: "Réalité virtuelle", note: 16, coefficient: 5, professeur: "Prof. Nguyen" },
          { nom: "Production audiovisuelle", note: 17.5, coefficient: 5, professeur: "M. Dubois" },
          { nom: "Marketing digital", note: 14, coefficient: 6, professeur: "Mme. Martin" }
        ];
    }
  };

  const matieres: Matiere[] = getMatieres();
  
  const calculerMoyenne = () => {
    const totalPoints = matieres.reduce((sum, matiere) => sum + (matiere.note * matiere.coefficient), 0);
    const totalCoefficients = matieres.reduce((sum, matiere) => sum + matiere.coefficient, 0);
    return totalPoints / totalCoefficients;
  };

  const moyenneGenerale = calculerMoyenne();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notes Académiques</h1>
      <div className="mb-6">
        <p className="font-semibold text-lg">
          Spécialité: Multimédia - Niveau: {user?.niveau}
        </p>
        <div className="mt-4 bg-purple-50 p-4 rounded-lg">
          <p className="text-xl font-bold">
            Moyenne Générale: <span className="text-purple-700">{moyenneGenerale.toFixed(2)}/20</span>
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
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
          Télécharger le bulletin
        </button>
      </div>
    </div>
  );
}