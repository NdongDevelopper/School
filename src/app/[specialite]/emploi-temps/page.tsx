'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { getNomSpecialite, SpecialiteKey } from '@/utils/specialites';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';

type Niveau = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const params = useParams();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user || !params?.specialite) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-700">Chargement des données...</p>
      </div>
    );
  }

  const specialite = params.specialite as SpecialiteKey;
  const niveau = user.niveau as keyof typeof emploisDuTemps.ida;
  const edt = emploisDuTemps[specialite]?.[niveau] || [];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (sidebarOpen) setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/connexion';
  };

  return (
    <RouteGuard roles={['etudiant']}>
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar avec bouton hamburger intégré */}
        <aside
          className={`fixed md:static inset-y-0 left-0 w-64 bg-blue-600 text-white shadow-lg z-40 md:z-auto transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <div className="p-4 md:p-6 border-b border-blue-400 flex items-center justify-between">
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
            <button
              onClick={toggleSidebar}
              className="md:hidden text-white"
              aria-label="Fermer le menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-2 px-2 md:px-4">
              <li>
                <a href={`/${specialite}/tableau-bord`} className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Tableau de bord</span>
                </a>
              </li>
              <li>
                <a href={`/${specialite}/cours`} className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Cours</span>
                </a>
              </li>
              <li>
                <span className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-blue-500 text-white font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Emploi du temps</span>
                </span>
              </li>
              <li>
                <a href={`/${specialite}/notes`} className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Mes notes</span>
                </a>
              </li>
              <li>
                <a href={`/${specialite}/absences`} className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-blue-500 transition-colors">
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

        <div className="flex-1 flex flex-col min-h-screen md:ml-0 pb-16 md:pb-0">
          {/* Header avec bouton hamburger visible sur mobile */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                {/* Bouton Hamburger - Visible uniquement sur mobile */}
                <button
                  onClick={toggleSidebar}
                  className="md:hidden text-gray-500 mr-3 p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                  aria-label="Ouvrir le menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div>
                  <h1 className="text-lg font-bold text-gray-900 md:text-xl">
                    Emploi du temps
                  </h1>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {getNomSpecialite(specialite)} - Niveau {niveau}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-sm rounded-full focus:outline-none"
                  aria-label="Menu utilisateur"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-700 font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">Étudiant {niveau}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Contenu principal */}
          <main className="flex-1 p-4 overflow-auto bg-gray-50 pb-20 md:pb-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Votre emploi du temps
                <span className="block text-sm font-normal text-gray-600 mt-1">
                  Semaine du 18 au 22 Juillet 2025
                </span>
              </h2>

              <div className="flex justify-end gap-2 mb-4">
                <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m7 5l-3-3m0 0l-3 3m3-3v8" />
                  </svg>
                  Imprimer
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exporter
                </button>
              </div>
              
              {/* Affichage mobile */}
              <div className="md:hidden space-y-4">
                {edt.length > 0 ? (
                  edt.map((cours, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{cours.title}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {cours.jour} • {cours.slot}
                          </div>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {cours.room}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">Aucun cours prévu pour cette semaine.</p>
                )}
              </div>
              
              {/* Affichage desktop */}
              <div className="hidden md:block overflow-x-auto">
                {edt.length > 0 ? (
                  <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-3 text-left text-sm font-semibold rounded-tl-lg">Jour</th>
                        <th className="p-3 text-left text-sm font-semibold">Horaire</th>
                        <th className="p-3 text-left text-sm font-semibold">Cours</th>
                        <th className="p-3 text-left text-sm font-semibold rounded-tr-lg">Salle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {edt.map((cours, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3 text-sm font-medium text-gray-900">{cours.jour}</td>
                          <td className="p-3 text-sm text-gray-700">{cours.slot}</td>
                          <td className="p-3 text-sm font-semibold text-blue-600">{cours.title}</td>
                          <td className="p-3">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {cours.room}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600 text-center py-8 bg-white rounded-lg shadow-sm">Aucun cours prévu pour cette semaine.</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SummaryCard
                title="Total des heures"
                value={`${edt.length * 2}h`}
                color="blue"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <SummaryCard
                title="Cours cette semaine"
                value={edt.length.toString()}
                color="blue"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />
              <SummaryCard
                title="Prochain cours"
                value={edt.length > 0 ? `${edt[0].title} (${edt[0].jour})` : "Aucun cours"}
                color="blue"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>
          </main>
          
          {/* Barre de navigation mobile en bas */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
              <div className="flex justify-around py-3">
                <NavItem 
                  href={`/${specialite}/emploi-du-temps`}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  label="Emploi"
                  active={true}
                />
                <NavItem 
                  href={`/${specialite}/cours`}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                  label="Cours"
                  active={false}
                />
                <NavItem 
                  href={`/${specialite}/notes`}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  label="Notes"
                  active={false}
                />
                <NavItem 
                  href={`/${specialite}/absences`}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Absences"
                  active={false}
                />
              </div>
            </div>
          )}
        </div>
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
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-200">
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className={`text-lg font-bold text-${color}-600`}>{value}</p>
      </div>
      <div className={`ml-3 w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <a 
      href={href}
      className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors ${
        active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <div className="mb-1">
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </a>
  );
}