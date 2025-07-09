'use client';

import { useAuth } from '@/context/AuthContext';

interface Ressource {
  id: number;
  titre: string;
  matiere: string;
  type: 'Cours' | 'TD' | 'TP' | 'Projet' | 'Support';
  date: string;
  taille: string;
  lien: string;
}

export default function CoursMultimediaInternet() {
  const { user } = useAuth();

  const getRessources = (): Ressource[] => {
    switch(user?.niveau) {
      case 'L1':
        return [
          { id: 1, titre: "Introduction au multimédia", matiere: "Multimédia", type: "Cours", date: "2025-10-01", taille: "2.8 MB", lien: "#" },
          { id: 2, titre: "TD HTML & CSS", matiere: "Développement Web", type: "TD", date: "2025-10-05", taille: "1.5 MB", lien: "#" },
          { id: 3, titre: "TP Photoshop de base", matiere: "Design graphique", type: "TP", date: "2025-10-09", taille: "3.0 MB", lien: "#" },
          { id: 4, titre: "Support outils numériques", matiere: "Outils Numériques", type: "Support", date: "2025-10-12", taille: "1.2 MB", lien: "#" }
        ];
      case 'L2':
        return [
          { id: 1, titre: "Production audiovisuelle", matiere: "Vidéo & Audio", type: "Cours", date: "2025-10-02", taille: "4.1 MB", lien: "#" },
          { id: 2, titre: "TD Responsive Design", matiere: "Développement Web", type: "TD", date: "2025-10-06", taille: "2.2 MB", lien: "#" },
          { id: 3, titre: "TP montage vidéo", matiere: "Montage", type: "TP", date: "2025-10-10", taille: "2.7 MB", lien: "#" },
          { id: 4, titre: "Projet site portfolio", matiere: "Projet Web", type: "Projet", date: "2025-10-14", taille: "1.9 MB", lien: "#" }
        ];
      default:
        return [
          { id: 1, titre: "UX/UI design avancé", matiere: "Expérience utilisateur", type: "Cours", date: "2025-10-04", taille: "3.8 MB", lien: "#" },
          { id: 2, titre: "Support Référencement naturel", matiere: "SEO", type: "Support", date: "2025-10-07", taille: "2.0 MB", lien: "#" },
          { id: 3, titre: "TP animation web", matiere: "CSS Animation", type: "TP", date: "2025-10-11", taille: "1.7 MB", lien: "#" },
          { id: 4, titre: "Projet final multimédia", matiere: "Projet Multimédia", type: "Projet", date: "2025-10-20", taille: "4.5 MB", lien: "#" }
        ];
    }
  };

  const ressources = getRessources();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ressources - Multimédia Internet et Communication</h1>
      <p className="font-semibold text-lg mb-2">Niveau : {user?.niveau}</p>
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Titre</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Matière</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Taille</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {ressources.map(ressource => (
            <tr key={ressource.id} className="border-t">
              <td className="px-4 py-2">{ressource.titre}</td>
              <td className="px-4 py-2">{ressource.matiere}</td>
              <td className="px-4 py-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  ressource.type === 'Cours' ? 'bg-blue-100 text-blue-800' :
                  ressource.type === 'TD' ? 'bg-green-100 text-green-800' :
                  ressource.type === 'TP' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>{ressource.type}</span>
              </td>
              <td className="px-4 py-2">{ressource.date}</td>
              <td className="px-4 py-2">{ressource.taille}</td>
              <td className="px-4 py-2">
                <a href={ressource.lien} className="text-blue-600 hover:underline">Télécharger</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
