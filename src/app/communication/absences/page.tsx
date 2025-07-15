'use client';
import { useAuth } from '@/context/AuthContext';
import { getNomSpecialite } from '@/utils/specialites';

interface Absence {
  id: number;
  date: string;
  matiere: string;
  heures: number;
  justifiee: boolean;
}

export default function AbsencesPage() {
  const { user } = useAuth();

  // Données simulées pour Communication
  const absences: Absence[] = [
    { id: 1, date: "2025-10-01", matiere: "Marketing digital", heures: 2, justifiee: false },
    { id: 2, date: "2025-10-05", matiere: "Stratégie de contenu", heures: 1, justifiee: true },
    { id: 3, date: "2025-10-10", matiere: "Gestion de communauté", heures: 3, justifiee: false },
    { id: 4, date: "2025-10-15", matiere: "Branding", heures: 2, justifiee: true },
  ];

  const totalHeures = absences.reduce((sum, abs) => sum + abs.heures, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des Absences</h1>
      <div className="mb-4">
        <p className="font-semibold">
          Spécialité: {getNomSpecialite(user?.specialite!)} | Niveau: {user?.niveau}
        </p>
        <p className="text-red-500">
          Total des heures d'absence: {totalHeures}h
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heures</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {absences.map((absence) => (
              <tr key={absence.id} className={absence.justifiee ? "bg-blue-50" : "bg-red-50"}>
                <td className="px-6 py-4 whitespace-nowrap">{absence.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{absence.matiere}</td>
                <td className="px-6 py-4 whitespace-nowrap">{absence.heures}h</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {absence.justifiee ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Justifiée
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Non justifiée
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
          Télécharger le relevé
        </button>
      </div>
    </div>
  );
}