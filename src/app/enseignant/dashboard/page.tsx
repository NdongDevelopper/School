'use client';

import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Cours {
  id: string;
  jour: string;
  heure: string;
  matiere: string;
  niveau: string;
  salle: string;
  etudiants: number;
}

export default function EmploiTempsEnseignant() {
  const { user } = useAuth();
  const [cours, setCours] = useState<Cours[]>([]);
  const pathname = usePathname();
  
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const creneauxHoraires = ['08:00 - 10:00', '10:15 - 12:15', '14:00 - 16:00', '16:15 - 18:15'];
  
  // Statistiques
  const [stats, setStats] = useState({
    totalHeures: 0,
    classes: 0,
    etudiants: 0
  });

  useEffect(() => {
    // Simuler le chargement de l'emploi du temps
    const data = [
      { id: '1', jour: "Lundi", heure: "08:00 - 10:00", matiere: "JavaScript Avancé", niveau: "L3", salle: "205", etudiants: 25 },
      { id: '2', jour: "Lundi", heure: "14:00 - 16:00", matiere: "TP JavaScript", niveau: "L1", salle: "Lab Info 1", etudiants: 15 },
      { id: '3', jour: "Mardi", heure: "10:15 - 12:15", matiere: "Frameworks JS", niveau: "L2", salle: "203", etudiants: 28 },
      { id: '4', jour: "Mardi", heure: "16:15 - 18:15", matiere: "TP Frameworks", niveau: "L2", salle: "Lab Info 2", etudiants: 14 },
      { id: '5', jour: "Mercredi", heure: "08:00 - 10:00", matiere: "JavaScript Base", niveau: "L1", salle: "101", etudiants: 30 },
      { id: '6', jour: "Mercredi", heure: "14:00 - 16:00", matiere: "React.js", niveau: "L2", salle: "204", etudiants: 22 },
      { id: '7', jour: "Jeudi", heure: "10:15 - 12:15", matiere: "Node.js", niveau: "L3", salle: "Lab Info", etudiants: 20 },
      { id: '8', jour: "Vendredi", heure: "14:00 - 16:00", matiere: "Projet JS", niveau: "L3", salle: "Salle Projet", etudiants: 18 },
    ];
    
    setCours(data);
    
    // Calculer les statistiques
    const totalHeures = data.length * 2; // Chaque cours dure 2h
    const classes = new Set(data.map(c => c.niveau)).size;
    const etudiants = data.reduce((sum, c) => sum + c.etudiants, 0);
    
    setStats({ totalHeures, classes, etudiants });
  }, []);

  // Trouver le cours pour un jour et un créneau donné
  const getCours = (jour: string, heure: string) => {
    return cours.find(c => c.jour === jour && c.heure === heure);
  };

  // Vérifie si le lien est actif
  const isActive = (path: string) => pathname === path;

  return (
    <RouteGuard roles={['enseignant']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Barre latérale - Correction complète de la hauteur */}
        <aside className="hidden md:flex flex-col w-64 bg-blue-800 text-white shadow-lg h-full min-h-screen sticky top-0">
          <div className="p-6 border-b border-blue-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-blue-800 text-lg"></i>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Espace Enseignant</h2>
                <p className="text-blue-200 text-sm">{user?.nomSpecialite}</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6 flex-1">
            <ul className="space-y-2 px-4">
              <li>
                <Link href="/enseignant/dashboard">
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive('/enseignant/dashboard') ? 'bg-blue-500' : 'hover:bg-blue-500'} transition-colors cursor-pointer`}>
                    <i className="fa-solid fa-calendar-days"></i>
                    <span>Emploi du temps</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/notes">
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive('/enseignant/notes') ? 'bg-blue-500' : 'hover:bg-blue-500'} transition-colors cursor-pointer`}>
                    <i className="fa-solid fa-file-lines"></i>
                    <span>Notes des Étudiants</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/absences">
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive('/enseignant/absences') ? 'bg-blue-500' : 'hover:bg-blue-500'} transition-colors cursor-pointer`}>
                    <i className="fa-solid fa-user-xmark"></i>
                    <span>Absences</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/deliberations">
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive('/enseignant/deliberations') ? 'bg-blue-500' : 'hover:bg-blue-500'} transition-colors cursor-pointer`}>
                    <i className="fa-solid fa-clipboard-check"></i>
                    <span>Délibérations</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-blue-500 mt-auto">
            <div className="flex items-center space-x-3">
              <img 
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
                alt="Professeur" 
                className="w-8 h-8 rounded-full" 
              />
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-blue-200">Enseignant {user?.nomSpecialite}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col min-h-0">
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Emploi du temps</h1>
                <p className="text-gray-600">Semaine du 18 au 22 Décembre 2023</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
                  <i className="fa-solid fa-print mr-2"></i>
                  Imprimer
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <i className="fa-solid fa-download mr-2"></i>
                  Exporter
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {/* Grille d'emploi du temps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-6 bg-blue-800 text-white">
                <div className="p-4 font-semibold border-r border-blue-500">Horaires</div>
                {jours.map(jour => (
                  <div key={jour} className="p-4 font-semibold border-r border-blue-500 text-center">
                    {jour}
                  </div>
                ))}
              </div>

              {creneauxHoraires.map(creneau => (
                <div key={creneau} className="grid grid-cols-6 border-b border-gray-200">
                  <div className="p-4 bg-gray-50 font-medium border-r border-gray-200">
                    {creneau}
                  </div>
                  
                  {jours.map(jour => {
                    const coursItem = getCours(jour, creneau);
                    return (
                      <div key={`${jour}-${creneau}`} className="p-4 border-r border-gray-200">
                        {coursItem ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 h-full">
                            <h4 className="font-semibold text-blue-800">{coursItem.matiere}</h4>
                            <p className="text-sm text-gray-600">Licence {coursItem.niveau.substring(1)}</p>
                            <p className="text-xs text-gray-500">Salle {coursItem.salle}</p>
                            <div className="flex items-center mt-2">
                              <i className="fa-solid fa-users text-blue-800 text-xs mr-1"></i>
                              <span className="text-xs text-gray-600">{coursItem.etudiants} étudiants</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Statistiques */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Total Heures</h3>
                    <p className="text-3xl font-bold text-blue-800">{stats.totalHeures}h</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-clock text-blue-800 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Classes</h3>
                    <p className="text-3xl font-bold text-blue-800">{stats.classes}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-chalkboard text-blue-800 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Étudiants</h3>
                    <p className="text-3xl font-bold text-blue-800">{stats.etudiants}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-users text-blue-800 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}