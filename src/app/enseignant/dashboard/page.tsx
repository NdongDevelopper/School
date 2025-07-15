'use client';

import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faGraduationCap,
  faCalendarDays,
  faFileLines,
  faUserXmark,
  faClipboardCheck,
  faPrint,
  faDownload,
  faClock,
  faChalkboard,
  faUsers, // Added for the students icon
  faSignOutAlt, // Assuming you might want a logout option eventually
  faChevronDown, // For potential dropdowns
  faEllipsisV, // For mobile options menu
} from '@fortawesome/free-solid-svg-icons';

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
  const { user, logout } = useAuth(); // Assuming logout is available from useAuth
  const [cours, setCours] = useState<Cours[]>([]);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false); // State for header dropdown menu

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const creneauxHoraires = ['08:00 - 10:00', '10:15 - 12:15', '14:00 - 16:00', '16:15 - 18:15'];

  // Statistiques
  const [stats, setStats] = useState({
    totalHeures: 0,
    classes: 0,
    etudiants: 0,
  });

  useEffect(() => {
    // Simuler le chargement de l'emploi du temps
    const data = [
      { id: '1', jour: 'Lundi', heure: '08:00 - 10:00', matiere: 'JavaScript Avancé', niveau: 'L3', salle: '205', etudiants: 25 },
      { id: '2', jour: 'Lundi', heure: '14:00 - 16:00', matiere: 'TP JavaScript', niveau: 'L1', salle: 'Lab Info 1', etudiants: 15 },
      { id: '3', jour: 'Mardi', heure: '10:15 - 12:15', matiere: 'Frameworks JS', niveau: 'L2', salle: '203', etudiants: 28 },
      { id: '4', jour: 'Mardi', heure: '16:15 - 18:15', matiere: 'TP Frameworks', niveau: 'L2', salle: 'Lab Info 2', etudiants: 14 },
      { id: '5', jour: 'Mercredi', heure: '08:00 - 10:00', matiere: 'JavaScript Base', niveau: 'L1', salle: '101', etudiants: 30 },
      { id: '6', jour: 'Mercredi', heure: '14:00 - 16:00', matiere: 'React.js', niveau: 'L2', salle: '204', etudiants: 22 },
      { id: '7', jour: 'Jeudi', heure: '10:15 - 12:15', matiere: 'Node.js', niveau: 'L3', salle: 'Lab Info', etudiants: 20 },
      { id: '8', jour: 'Vendredi', heure: '14:00 - 16:00', matiere: 'Projet JS', niveau: 'L3', salle: 'Salle Projet', etudiants: 18 },
    ];

    setCours(data);

    // Calculer les statistiques
    const totalHeures = data.length * 2; // Chaque cours dure 2h
    const classes = new Set(data.map((c) => c.niveau)).size;
    const etudiants = data.reduce((sum, c) => sum + c.etudiants, 0);

    setStats({ totalHeures, classes, etudiants });
  }, []);

  // Trouver le cours pour un jour et un créneau donné
  const getCours = (jour: string, heure: string) => {
    return cours.find((c) => c.jour === jour && c.heure === heure);
  };

  // Vérifie si le lien est actif
  const isActive = (path: string) => pathname === path;

  // Handle Logout (assuming it's available from useAuth context)
  const handleLogout = () => {
    logout();
    // Redirect to login page or home
    // router.push('/login'); // If you want to redirect
  };

  return (
    <RouteGuard roles={['enseignant']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Overlay pour mobile lorsque la barre latérale est ouverte */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Barre latérale (Sidebar) */}
        <aside
          className={`
            fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0
            flex flex-col w-64 bg-blue-800 text-white shadow-lg transition-transform duration-300 ease-in-out
            z-50 md:z-auto md:min-h-screen
          `}
        >
          <div className="p-6 border-b border-blue-500 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-blue-800 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Espace Enseignant</h2>
                <p className="text-blue-200 text-sm">{user?.nomSpecialite}</p>
              </div>
            </div>
            {/* Bouton pour fermer la sidebar sur mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-white text-xl hover:text-gray-200 focus:outline-none"
              aria-label="Fermer le menu"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <nav className="mt-6 flex-1">
            <ul className="space-y-2 px-4">
              <li>
                <Link href="/enseignant/dashboard" onClick={() => setIsSidebarOpen(false)}>
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive('/enseignant/dashboard') ? 'bg-blue-500' : 'hover:bg-blue-500'
                    } transition-colors cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <span>Emploi du temps</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/notes" onClick={() => setIsSidebarOpen(false)}>
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive('/enseignant/notes') ? 'bg-blue-500' : 'hover:bg-blue-500'
                    } transition-colors cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faFileLines} />
                    <span>Notes des Étudiants</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/absences" onClick={() => setIsSidebarOpen(false)}>
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive('/enseignant/absences') ? 'bg-blue-500' : 'hover:bg-blue-500'
                    } transition-colors cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faUserXmark} />
                    <span>Absences</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/deliberations" onClick={() => setIsSidebarOpen(false)}>
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive('/enseignant/deliberations') ? 'bg-blue-500' : 'hover:bg-blue-500'
                    } transition-colors cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faClipboardCheck} />
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
        <div className="flex-1 flex flex-col md:ml-0"> {/* Adjusted margin for large screens */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center">
              {/* Hamburger menu for mobile */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden mr-4 p-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Ouvrir le menu de navigation"
              >
                <FontAwesomeIcon icon={faBars} className="text-xl" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Emploi du temps</h1>
                <p className="text-gray-600 text-sm">Semaine du 18 au 22 Juillet 2025</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                className="p-2 bg-gray-100 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                aria-label="Options du menu"
              >
                <span className="hidden sm:inline mr-2">Actions</span> {/* Text on larger screens */}
                <FontAwesomeIcon icon={faEllipsisV} className="sm:hidden text-lg" /> {/* Icon on small screens */}
                <FontAwesomeIcon icon={faChevronDown} className="hidden sm:inline text-sm" />
              </button>
              {isHeaderMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      /* handle print */ setIsHeaderMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faPrint} className="mr-2" />
                    Imprimer
                  </button>
                  <button
                    onClick={() => {
                      /* handle export */ setIsHeaderMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Exporter
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsHeaderMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {/* Statistiques */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Total Heures</h3>
                    <p className="text-3xl font-bold text-blue-800">{stats.totalHeures}h</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faClock} className="text-blue-800 text-xl" />
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
                    <FontAwesomeIcon icon={faChalkboard} className="text-blue-800 text-xl" />
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
                    <FontAwesomeIcon icon={faUsers} className="text-blue-800 text-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Grille d'emploi du temps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto"> {/* Enable horizontal scrolling on small screens */}
                <div className="min-w-[700px]"> {/* Ensure min-width for grid content */}
                  <div className="grid grid-cols-[120px_repeat(5,1fr)] bg-blue-800 text-white"> {/* Custom grid for fixed time column */}
                    <div className="p-4 font-semibold border-r border-blue-500">Horaires</div>
                    {jours.map((jour) => (
                      <div key={jour} className="p-4 font-semibold border-r border-blue-500 text-center">
                        {jour}
                      </div>
                    ))}
                  </div>

                  {creneauxHoraires.map((creneau) => (
                    <div key={creneau} className="grid grid-cols-[120px_repeat(5,1fr)] border-b border-gray-200">
                      <div className="p-4 bg-gray-50 font-medium border-r border-gray-200">
                        {creneau}
                      </div>

                      {jours.map((jour) => {
                        const coursItem = getCours(jour, creneau);
                        return (
                          <div key={`${jour}-${creneau}`} className="p-2 md:p-4 border-r border-gray-200"> {/* Reduced padding for small screens */}
                            {coursItem ? (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 h-full text-sm"> {/* Reduced padding and font size */}
                                <h4 className="font-semibold text-blue-800">{coursItem.matiere}</h4>
                                <p className="text-gray-600 text-xs">Licence {coursItem.niveau.substring(1)}</p> {/* Smaller text */}
                                <p className="text-gray-500 text-xs">Salle {coursItem.salle}</p>
                                <div className="flex items-center mt-1"> {/* Reduced margin-top */}
                                  <FontAwesomeIcon icon={faUsers} className="text-blue-800 text-xs mr-1" />
                                  <span className="text-gray-600 text-xs">{coursItem.etudiants} étudiants</span>
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
              </div>
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}