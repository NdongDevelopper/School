

'use client';
import React, { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { getNomSpecialite, SpecialiteKey } from '@/utils/specialites';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';

// Définition des niveaux académiques
type Niveau = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';

// Données d'emploi du temps complètes pour toutes les spécialités et niveaux
const emploisDuTemps = {
  ida: {
    L1: [
      { jour: "Lundi", slot: "08:00 - 10:00", title: "Algorithmique", room: "Salle 101" },
      { jour: "Mardi", slot: "10:15 - 12:15", title: "Base de données", room: "Salle 102" },
      { jour: "Mercredi", slot: "14:00 - 16:00", title: "Développement web", room: "Labo 1" },
      { jour: "Jeudi", slot: "10:15 - 12:15", title: "Mathématiques", room: "Salle 103" },
      { jour: "Vendredi", slot: "08:00 - 10:00", title: "Systèmes d'exploitation", room: "Salle 104" }
    ],
    L2: [
      { jour: "Lundi", slot: "10:15 - 12:15", title: "POO avancée", room: "Salle 201" },
      { jour: "Mardi", slot: "14:00 - 16:00", title: "Réseaux", room: "Labo 2" },
      { jour: "Mercredi", slot: "08:00 - 10:00", title: "JavaScript", room: "Salle 202" },
      { jour: "Jeudi", slot: "14:00 - 16:00", title: "Systèmes distribués", room: "Salle 203" },
      { jour: "Vendredi", slot: "10:15 - 12:15", title: "Algorithmes avancés", room: "Salle 204" }
    ],
    L3: [
      { jour: "Lundi", slot: "14:00 - 16:00", title: "Intelligence Artificielle", room: "Salle 301" },
      { jour: "Mardi", slot: "08:00 - 10:00", title: "Sécurité informatique", room: "Salle 302" },
      { jour: "Mercredi", slot: "10:15 - 12:15", title: "Cloud Computing", room: "Labo 3" },
      { jour: "Jeudi", slot: "14:00 - 16:00", title: "Big Data", room: "Salle 303" },
      { jour: "Vendredi", slot: "08:00 - 10:00", title: "Projet intégrateur", room: "Salle Projet" }
    ],
    M1: [
      { jour: "Lundi", slot: "08:00 - 10:00", title: "Machine Learning", room: "Salle 401" },
      { jour: "Mardi", slot: "14:00 - 16:00", title: "DevOps", room: "Labo 4" },
      { jour: "Mercredi", slot: "10:15 - 12:15", title: "Architecture microservices", room: "Salle 402" },
      { jour: "Jeudi", slot: "08:00 - 10:00", title: "Blockchain", room: "Salle 403" },
      { jour: "Vendredi", slot: "14:00 - 16:00", title: "Séminaire de recherche", room: "Amphi A" }
    ],
    M2: [
      { jour: "Lundi", slot: "10:15 - 12:15", title: "Deep Learning", room: "Salle 501" },
      { jour: "Mardi", slot: "08:00 - 10:00", title: "IoT", room: "Labo 5" },
      { jour: "Mercredi", slot: "14:00 - 16:00", title: "Cybersécurité avancée", room: "Salle 502" },
      { jour: "Jeudi", slot: "10:15 - 12:15", title: "Management de projet", room: "Salle 503" },
      { jour: "Vendredi", slot: "08:00 - 10:00", title: "Préparation mémoire", room: "Salle Recherche" }
    ]
  },
  mic: {
    L1: [
      { jour: "Lundi", slot: "08:00 - 10:00", title: "Design graphique", room: "Atelier 1" },
      { jour: "Mardi", slot: "14:00 - 16:00", title: "Photographie numérique", room: "Studio photo" },
      { jour: "Mercredi", slot: "10:15 - 12:15", title: "Communication visuelle", room: "Salle 301" },
      { jour: "Jeudi", slot: "08:00 - 10:00", title: "Infographie", room: "Labo graphique" },
      { jour: "Vendredi", slot: "14:00 - 16:00", title: "Histoire des médias", room: "Salle 302" }
    ],
    L2: [
      { jour: "Lundi", slot: "10:15 - 12:15", title: "Animation 2D", room: "Labo Animation" },
      { jour: "Mardi", slot: "08:00 - 10:00", title: "Design d'interface", room: "Salle UI/UX" },
      { jour: "Mercredi", slot: "14:00 - 16:00", title: "Vidéo numérique", room: "Studio vidéo" },
      { jour: "Jeudi", slot: "10:15 - 12:15", title: "Typographie", room: "Atelier 2" },
      { jour: "Vendredi", slot: "08:00 - 10:00", title: "Marketing digital", room: "Salle 303" }
    ],
    L3: [
      { jour: "Lundi", slot: "14:00 - 16:00", title: "3D avancée", room: "Labo 3D" },
      { jour: "Mardi", slot: "10:15 - 12:15", title: "Motion design", room: "Studio motion" },
      { jour: "Mercredi", slot: "08:00 - 10:00", title: "Design interactif", room: "Salle Interac" },
      { jour: "Jeudi", slot: "14:00 - 16:00", title: "Projet multimédia", room: "Labo projet" },
      { jour: "Vendredi", slot: "10:15 - 12:15", title: "Stratégie de contenu", room: "Salle Stratégie" }
    ],
    M1: [
      { jour: "Lundi", slot: "08:00 - 10:00", title: "Réalité virtuelle", room: "Labo VR" },
      { jour: "Mardi", slot: "14:00 - 16:00", title: "Design sonore", room: "Studio son" },
      { jour: "Mercredi", slot: "10:15 - 12:15", title: "Expérience utilisateur", room: "Salle UX" },
      { jour: "Jeudi", slot: "08:00 - 10:00", title: "Narratologie", room: "Salle Narration" },
      { jour: "Vendredi", slot: "14:00 - 16:00", title: "Gestion de projet", room: "Salle Gestion" }
    ],
    M2: [
      { jour: "Lundi", slot: "10:15 - 12:15", title: "Design d'exposition", room: "Atelier 3" },
      { jour: "Mardi", slot: "08:00 - 10:00", title: "Direction artistique", room: "Salle Direction" },
      { jour: "Mercredi", slot: "14:00 - 16:00", title: "Projet de fin d'études", room: "Labo M2" },
      { jour: "Jeudi", slot: "10:15 - 12:15", title: "Séminaire professionnel", room: "Amphi B" },
      { jour: "Vendredi", slot: "08:00 - 10:00", title: "Veille technologique", room: "Salle Veille" }
    ]
  },
  cd: {
    L1: [
      { jour: "Lundi", slot: "14:00 - 16:00", title: "Marketing digital", room: "Salle 401" },
      { jour: "Mardi", slot: "08:00 - 10:00", title: "Réseaux sociaux", room: "Salle 402" },
      { jour: "Mercredi", slot: "10:15 - 12:15", title: "Stratégie de contenu", room: "Salle 403" },
      { jour: "Jeudi", slot: "14:00 - 16:00", title: "Branding", room: "Salle 404" },
      { jour: "Vendredi", slot: "08:00 - 10:00", title: "Analytics", room: "Salle 405" }
    ],
    L2: [
      { jour: "Lundi", slot: "08:00 - 10:00", title: "Content marketing", room: "Salle 501" },
      { jour: "Mardi", slot: "14:00 - 16:00", title: "SEO/SEA", room: "Labo Digital" },
      { jour: "Mercredi", slot: "10:15 - 12:15", title: "E-réputation", room: "Salle 502" },
      { jour: "Jeudi", slot: "08:00 - 10:00", title: "Inbound marketing", room: "Salle 503" },
      { jour: "Vendredi", slot: "14:00 - 16:00", title: "Publicité en ligne", room: "Salle Pub" }
    ],
    L3: [
      { jour: "Lundi", slot: "10:15 - 12:15", title: "Stratégie digitale", room: "Salle Stratégie" },
      { jour: "Mardi", slot: "08:00 - 10:00", title: "Growth hacking", room: "Labo Growth" },
      { jour: "Mercredi", slot: "14:00 - 16:00", title: "Data marketing", room: "Salle Data" },
      { jour: "Jeudi", slot: "10:15 - 12:15", title: "Marketing automation", room: "Salle Automation" },
      { jour: "Vendredi", slot: "08:00 - 10:00", title: "Projet campagne", room: "Salle Projet" }
    ],
    M1: [
      { jour: "Lundi", slot: "14:00 - 16:00", title: "Transformation digitale", room: "Salle Transformation" },
      { jour: "Mardi", slot: "10:15 - 12:15", title: "Management digital", room: "Salle Management" },
      { jour: "Mercredi", slot: "08:00 - 10:00", title: "UX marketing", room: "Salle UX" },
      { jour: "Jeudi", slot: "14:00 - 16:00", title: "Stratégie social media", room: "Salle Social" },
      { jour: "Vendredi", slot: "10:15 - 12:15", title: "E-commerce", room: "Salle E-commerce" }
    ],
    M2: [
      { jour: "Lundi", slot: "08:00 - 10:00", title: "Digital business", room: "Salle Business" },
      { jour: "Mardi", slot: "14:00 - 16:00", title: "Innovation digitale", room: "Salle Innovation" },
      { jour: "Mercredi", slot: "10:15 - 12:15", title: "Mémoire recherche", room: "Salle Recherche" },
      { jour: "Jeudi", slot: "08:00 - 10:00", title: "Stratégie d'entreprise", room: "Salle Stratégie" },
      { jour: "Vendredi", slot: "14:00 - 16:00", title: "Préparation insertion", room: "Salle Carrière" }
    ]
  }
};

export default function EmploiDuTempsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const params = useParams();
  
  if (!user || !params?.specialite) {
    return <div>Chargement...</div>;
  }
  
  const specialite = params.specialite as SpecialiteKey;
  const niveau = user.niveau as keyof typeof emploisDuTemps.ida;
  
  // Récupérer l'emploi du temps spécifique
  const edt = emploisDuTemps[specialite][niveau] || [];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
                  <span>Tableau de bord</span>
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
                <span className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-500 text-white font-medium cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Emploi du temps</span>
                </span>
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
                <a href={`/${specialite}/absences`} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Mes absences</span>
                </a>
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
                Emploi du temps - {getNomSpecialite(specialite)}
              </h1>
              <p className="text-gray-600">Niveau {niveau} - Semaine du 18 au 22 Juillet 2025</p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm md:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimer
              </button>
              <button className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm md:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter
              </button>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="overflow-x-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-w-[800px]">
                <div className="grid grid-cols-6 bg-blue-600 text-white">
                  <div className="p-3 md:p-4 font-semibold border-r border-blue-500 text-xs md:text-sm">Horaires</div>
                  <div className="p-3 md:p-4 font-semibold border-r border-blue-500 text-center text-xs md:text-sm">Lundi</div>
                  <div className="p-3 md:p-4 font-semibold border-r border-blue-500 text-center text-xs md:text-sm">Mardi</div>
                  <div className="p-3 md:p-4 font-semibold border-r border-blue-500 text-center text-xs md:text-sm">Mercredi</div>
                  <div className="p-3 md:p-4 font-semibold border-r border-blue-500 text-center text-xs md:text-sm">Jeudi</div>
                  <div className="p-3 md:p-4 font-semibold text-center text-xs md:text-sm">Vendredi</div>
                </div>

                {/* Time slot rows */}
                {[
                  { slot: "08:00 - 10:00" },
                  { slot: "10:15 - 12:15" },
                  { slot: "14:00 - 16:00" },
                  { slot: "16:15 - 18:15" }
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-6 border-b border-gray-200">
                    <div className="p-3 md:p-4 bg-gray-50 font-medium border-r border-gray-200 text-xs md:text-sm">
                      {row.slot}
                    </div>
                    
                    {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map(jour => {
                      const cours = edt.find(c => 
                        c.jour === jour && 
                        c.slot === row.slot
                      );
                      
                      return (
                        <div key={jour} className="p-2 md:p-4 border-r border-gray-200 min-h-[100px]">
                          {cours ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3 h-full">
                              <h4 className="font-semibold text-blue-600 text-sm md:text-base">
                                {cours.title}
                              </h4>
                              <p className="text-xs md:text-sm text-gray-600 mt-1">{cours.room}</p>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <SummaryCard 
                title="Total des heures" 
                value={`${edt.length * 2}h`} 
                color="blue-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <SummaryCard 
                title="Cours cette semaine" 
                value={edt.length.toString()} 
                color="blue-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />
              <SummaryCard 
                title="Prochain cours" 
                value={edt.length > 0 ? 
                  `${edt[0].title} (${edt[0].jour} ${edt[0].slot})` : 
                  "Aucun cours cette semaine"} 
                color="blue-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}

function SummaryCard({ title, value, color, icon }: { 
  title: string; 
  value: string; 
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{title}</h3>
        <p className={`text-xl md:text-2xl font-bold text-${color} truncate`}>{value}</p>
      </div>
      <div className={`ml-4 w-10 h-10 md:w-12 md:h-12 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}