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

export default function CoursCommunicationDigitale() {
  const { user } = useAuth();

  const getRessources = (): Ressource[] => {
    switch(user?.niveau) {
      case 'L1':
        return [
          { id: 1, titre: "Bases de la communication", matiere: "Communication", type: "Cours", date: "2025-10-10", taille: "2.5 MB", lien: "#" },
          { id: 2, titre: "TD Rédaction Web", matiere: "Rédaction web", type: "TD", date: "2025-10-12", taille: "1.3 MB", lien: "#" },
          { id: 3, titre: "Initiation au design", matiere: "Design graphique", type: "Support", date: "2025-10-15", taille: "3.0 MB", lien: "#" },
          { id: 4, titre: "TP - Outils Canva", matiere: "Marketing digital", type: "TP", date: "2025-10-18", taille: "1.1 MB", lien: "#" }
        ];
      case 'L2':
        return [
          { id: 1, titre: "Cours Branding Digital", matiere: "Branding", type: "Cours", date: "2025-10-05", taille: "2.7 MB", lien: "#" },
          { id: 2, titre: "Support Réseaux Sociaux", matiere: "Community Management", type: "Support", date: "2025-10-08", taille: "2.9 MB", lien: "#" },
          { id: 3, titre: "TP Analytics", matiere: "Analytics Web", type: "TP", date: "2025-10-12", taille: "2.1 MB", lien: "#" },
          { id: 4, titre: "Projet Campagne Digitale", matiere: "Stratégie de contenu", type: "Projet", date: "2025-10-20", taille: "1.4 MB", lien: "#" }
        ];
      default:
        return [
          { id: 1, titre: "E-réputation & gestion de crise", matiere: "Communication de crise", type: "Cours", date: "2025-10-03", taille: "3.6 MB", lien: "#" },
          { id: 2, titre: "Support Influence Marketing", matiere: "Influence", type: "Support", date: "2025-10-07", taille: "2.4 MB", lien: "#" },
          { id: 3, titre: "TP SEO Avancé", matiere: "SEO", type: "TP", date: "2025-10-11", taille: "2.3 MB", lien: "#" },
          { id: 4, titre: "Projet Communication Digitale", matiere: "Projet", type: "Projet", date: "2025-10-22", taille: "4.2 MB", lien: "#" }
        ];
    }
  };

  const ressources = getRessources();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ressources - Communication Digitale</h1>
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
