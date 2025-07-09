'use client';
import React, { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { getNomSpecialite, SpecialiteKey } from '@/utils/specialites';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';

// Structure des données d'absence
type StatutAbsence = "Non justifiée" | "Justifiée" | "En attente";

type Absence = {
  date: string;
  matiere: string;
  horaire: string;
  statut: StatutAbsence;
};

type Niveau = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';

// Données d'absences complètes pour toutes les spécialités et niveaux
const absencesData: Record<SpecialiteKey, Record<Niveau, Absence[]>> = {
  ida: {
    L1: [
      { date: "15/01/2025", matiere: "Algorithmique", horaire: "08h00 - 10h00", statut: "Non justifiée" },
      { date: "18/01/2025", matiere: "Base de données", horaire: "10h15 - 12h15", statut: "Justifiée" },
      { date: "22/01/2025", matiere: "Développement web", horaire: "14h00 - 16h00", statut: "Non justifiée" },
      { date: "25/01/2025", matiere: "Mathématiques", horaire: "08h00 - 10h00", statut: "Justifiée" },
      { date: "28/01/2025", matiere: "Systèmes d'exploitation", horaire: "10h15 - 12h15", statut: "En attente" },
    ],
    L2: [
      { date: "10/01/2025", matiere: "POO avancée", horaire: "08h00 - 10h00", statut: "Justifiée" },
      { date: "15/01/2025", matiere: "Réseaux", horaire: "14h00 - 16h00", statut: "Non justifiée" },
      { date: "20/01/2025", matiere: "JavaScript", horaire: "08h00 - 10h00", statut: "En attente" },
      { date: "25/01/2025", matiere: "Systèmes distribués", horaire: "14h00 - 16h00", statut: "Justifiée" },
    ],
    L3: [
      { date: "12/01/2025", matiere: "Intelligence Artificielle", horaire: "14h00 - 16h00", statut: "Non justifiée" },
      { date: "19/01/2025", matiere: "Sécurité informatique", horaire: "08h00 - 10h00", statut: "Justifiée" },
      { date: "26/01/2025", matiere: "Cloud Computing", horaire: "10h15 - 12h15", statut: "En attente" },
    ],
    M1: [
      { date: "08/01/2025", matiere: "Machine Learning", horaire: "08h00 - 10h00", statut: "Justifiée" },
      { date: "15/01/2025", matiere: "DevOps", horaire: "14h00 - 16h00", statut: "Non justifiée" },
      { date: "22/01/2025", matiere: "Architecture microservices", horaire: "10h15 - 12h15", statut: "Justifiée" },
    ],
    M2: [
      { date: "05/01/2025", matiere: "Deep Learning", horaire: "10h15 - 12h15", statut: "En attente" },
      { date: "12/01/2025", matiere: "IoT", horaire: "08h00 - 10h00", statut: "Non justifiée" },
      { date: "19/01/2025", matiere: "Cybersécurité avancée", horaire: "14h00 - 16h00", statut: "Justifiée" },
    ]
  },
  mic: {
    L1: [
      { date: "14/01/2025", matiere: "Design graphique", horaire: "08h00 - 10h00", statut: "Non justifiée" },
      { date: "17/01/2025", matiere: "Photographie numérique", horaire: "14h00 - 16h00", statut: "Justifiée" },
      { date: "21/01/2025", matiere: "Communication visuelle", horaire: "10h15 - 12h15", statut: "En attente" },
    ],
    L2: [
      { date: "11/01/2025", matiere: "Animation 2D", horaire: "10h15 - 12h15", statut: "Non justifiée" },
      { date: "18/01/2025", matiere: "Design d'interface", horaire: "08h00 - 10h00", statut: "Justifiée" },
      { date: "25/01/2025", matiere: "Vidéo numérique", horaire: "14h00 - 16h00", statut: "En attente" },
    ],
    L3: [
      { date: "13/01/2025", matiere: "3D avancée", horaire: "14h00 - 16h00", statut: "Non justifiée" },
      { date: "20/01/2025", matiere: "Motion design", horaire: "10h15 - 12h15", statut: "Justifiée" },
    ],
    M1: [
      { date: "07/01/2025", matiere: "Réalité virtuelle", horaire: "08h00 - 10h00", statut: "Justifiée" },
      { date: "14/01/2025", matiere: "Design sonore", horaire: "14h00 - 16h00", statut: "Non justifiée" },
    ],
    M2: [
      { date: "04/01/2025", matiere: "Design d'exposition", horaire: "10h15 - 12h15", statut: "En attente" },
      { date: "11/01/2025", matiere: "Direction artistique", horaire: "08h00 - 10h00", statut: "Justifiée" },
    ]
  },
  cd: {
    L1: [
      { date: "16/01/2025", matiere: "Marketing digital", horaire: "14h00 - 16h00", statut: "Non justifiée" },
      { date: "19/01/2025", matiere: "Réseaux sociaux", horaire: "08h00 - 10h00", statut: "Justifiée" },
      { date: "23/01/2025", matiere: "Stratégie de contenu", horaire: "10h15 - 12h15", statut: "En attente" },
    ],
    L2: [
      { date: "12/01/2025", matiere: "Content marketing", horaire: "08h00 - 10h00", statut: "Non justifiée" },
      { date: "19/01/2025", matiere: "SEO/SEA", horaire: "14h00 - 16h00", statut: "Justifiée" },
    ],
    L3: [
      { date: "11/01/2025", matiere: "Stratégie digitale", horaire: "10h15 - 12h15", statut: "En attente" },
      { date: "18/01/2025", matiere: "Growth hacking", horaire: "08h00 - 10h00", statut: "Non justifiée" },
    ],
    M1: [
      { date: "09/01/2025", matiere: "Transformation digitale", horaire: "14h00 - 16h00", statut: "Justifiée" },
      { date: "16/01/2025", matiere: "Management digital", horaire: "10h15 - 12h15", statut: "En attente" },
    ],
    M2: [
      { date: "06/01/2025", matiere: "Digital business", horaire: "08h00 - 10h00", statut: "Non justifiée" },
      { date: "13/01/2025", matiere: "Innovation digitale", horaire: "14h00 - 16h00", statut: "Justifiée" },
    ]
  }
};

// Fonction pour calculer les statistiques d'absences
const calculateStats = (absences: Absence[]) => {
  const total = absences.length;
  const nonJustifiees = absences.filter(a => a.statut === "Non justifiée").length;
  const justifiees = absences.filter(a => a.statut === "Justifiée").length;
  const enAttente = absences.filter(a => a.statut === "En attente").length;
  
  // Calcul du taux d'assiduité (exemple simplifié)
  const tauxAssiduite = Math.max(0, 100 - (total * 2)).toFixed(0);
  
  return {
    total,
    nonJustifiees,
    justifiees,
    enAttente,
    tauxAssiduite: `${tauxAssiduite}%`
  };
};

// Fonction pour convertir la date au format input (YYYY-MM-DD)
const toInputDate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export default function AbsencesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddingJustification, setIsAddingJustification] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const { user } = useAuth();
  const params = useParams();
  
  if (!user || !params?.specialite) {
    return <div>Chargement...</div>;
  }
  
  const specialite = params.specialite as SpecialiteKey;
  const niveau = user.niveau as Niveau;
  
  // Récupérer les absences spécifiques
  const absences = absencesData[specialite][niveau] || [];
  const stats = calculateStats(absences);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleJustificationForm = (absence: Absence | null = null) => {
    setSelectedAbsence(absence);
    setIsAddingJustification(!isAddingJustification);
  };

  const handleSubmitJustification = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous enverriez normalement la justification au serveur
    // Pour cet exemple, on ferme juste le formulaire
    toggleJustificationForm(null);
  };

  return (
    <RouteGuard roles={['etudiant']}>
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 w-64 bg-blue-600 text-white shadow-lg z-20 transform transition-transform duration-300 md:translate-x-0 md:static ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 border-b border-blue-400">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Espace Étudiant</h2>
                <p className="text-blue-200 text-sm">
                  {getNomSpecialite(specialite)} - {niveau}
                </p>
              </div>
            </div>
          </div>
          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              <li>
                <a href={`/${specialite}/tableau-bord`} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Emploi du temps</span>
                </a>
              </li>
              <li>
                <a href={`/${specialite}/cours`} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Cours</span>
                </a>
              </li>
          
              <li>
                <a href={`/${specialite}/notes`} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Mes notes</span>
                </a>
              </li>
              <li>
                <span className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-500 text-white font-medium cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Mes absences</span>
                </span>
              </li>
            </ul>
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t border-blue-400">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                <span className="text-blue-800 font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-blue-200">Étudiant {niveau}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 md:px-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Gestion des Absences - {getNomSpecialite(specialite)}
              </h1>
              <p className="text-gray-600">Niveau {niveau} - Année académique 2025</p>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
              <StatsCard 
                title="Total Absences" 
                value={stats.total.toString()} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
              />
              <StatsCard 
                title="Non justifiées" 
                value={stats.nonJustifiees.toString()} 
                color="red-600"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatsCard 
                title="Justifiées" 
                value={stats.justifiees.toString()} 
                color="green-600"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatsCard 
                title="Taux d'assiduité" 
                value={stats.tauxAssiduite} 
                color="blue-600"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
            </div>

            {/* Absences Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Détail des absences</h2>
                <p className="text-gray-600 mt-1">Semestre 1 - {getNomSpecialite(specialite)}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matière
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horaire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {absences.map((absence, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {absence.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {absence.matiere}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {absence.horaire}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            absence.statut === "Non justifiée" 
                              ? "bg-red-100 text-red-800" 
                              : absence.statut === "Justifiée"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {absence.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {absence.statut === "Non justifiée" || absence.statut === "En attente" ? (
                            <button 
                              onClick={() => toggleJustificationForm(absence)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Justifier
                            </button>
                          ) : (
                            <button className="text-gray-400 cursor-default">
                              Voir justificatif
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Justification Form */}
            {isAddingJustification && selectedAbsence && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Justification d'absence - {selectedAbsence.matiere}
                  </h3>
                  <button 
                    onClick={() => toggleJustificationForm(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmitJustification}>
                  <div>
                    <label htmlFor="date-absence" className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'absence
                    </label>
                    <input
                      type="date"
                      id="date-absence"
                      value={toInputDate(selectedAbsence.date)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="matiere" className="block text-sm font-medium text-gray-700 mb-2">
                      Matière concernée
                    </label>
                    <input
                      type="text"
                      id="matiere"
                      value={selectedAbsence.matiere}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="motif" className="block text-sm font-medium text-gray-700 mb-2">
                      Motif de l'absence
                    </label>
                    <textarea
                      id="motif"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Décrivez le motif de votre absence..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="justificatif" className="block text-sm font-medium text-gray-700 mb-2">
                      Pièce justificative
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, JPG, PNG (MAX. 5MB)
                          </p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" required />
                      </label>
                    </div> 
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={() => toggleJustificationForm(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Soumettre le justificatif
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}

function StatsCard({ title, value, color = "gray-900", icon }: { 
  title: string; 
  value: string; 
  color?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
      <div className="p-2 md:p-3 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm md:text-base text-gray-600">{title}</p>
        <p className={`text-xl md:text-2xl font-bold text-${color}`}>{value}</p>
      </div>
    </div>
  );
}