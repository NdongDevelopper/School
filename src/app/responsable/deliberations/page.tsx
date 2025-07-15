'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DeliberationsPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof studentsByLevel>('L1');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const navLinks = [
    { 
      href: '/responsable/dashboard', 
      label: 'Tableau de bord', 
      icon: 'fa-chart-line' 
    },
    { 
      href: '/responsable/programmes-cours', 
      label: 'Programmes et Cours', 
      icon: 'fa-book' 
    },
    { 
      href: '/responsable/gestion-etudiants', 
      label: 'Gestion Étudiants', 
      icon: 'fa-users' 
    },
    { 
      href: '/responsable/deliberations', 
      label: 'Délibérations', 
      icon: 'fa-gavel' 
    },
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  // Données simulées par niveau
  const studentsByLevel = {
    L1: [
      { 
        id: 1, 
        name: 'Aminata Diallo', 
        studentId: 'L1-2024-001',
        average: 16.5, 
        mention: 'Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg' 
      },
      { 
        id: 2, 
        name: 'Moussa Koné', 
        studentId: 'L1-2024-002',
        average: 14.2, 
        mention: 'Assez Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg' 
      },
      { 
        id: 3, 
        name: 'Fatou Sow', 
        studentId: 'L1-2024-003',
        average: 9.5, 
        mention: '-', 
        status: 'Rattrapage', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' 
      },
      { 
        id: 4, 
        name: 'Omar Ba', 
        studentId: 'L1-2024-004',
        average: 18.0, 
        mention: 'Très Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg' 
      },
      { 
        id: 5, 
        name: 'Aïcha Ndiaye', 
        studentId: 'L1-2024-005',
        average: 7.2, 
        mention: '-', 
        status: 'Échec', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg' 
      },
      { 
        id: 6, 
        name: 'Karim Belkacem', 
        studentId: 'L1-2024-006',
        average: 15.8, 
        mention: 'Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg' 
      },
      { 
        id: 7, 
        name: 'Sarah Mansouri', 
        studentId: 'L1-2024-007',
        average: 8.9, 
        mention: '-', 
        status: 'Rattrapage', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg' 
      },
    ],
    L2: [
      { 
        id: 1, 
        name: 'Jean Dupont', 
        studentId: 'L2-2024-101',
        average: 15.2, 
        mention: 'Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg' 
      },
      { 
        id: 2, 
        name: 'Marie Curie', 
        studentId: 'L2-2024-102',
        average: 17.8, 
        mention: 'Très Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-10.jpg' 
      },
    ],
    L3: [
      { 
        id: 1, 
        name: 'Paul Martin', 
        studentId: 'L3-2024-201',
        average: 12.5, 
        mention: 'Assez Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-11.jpg' 
      },
      { 
        id: 2, 
        name: 'Sophie Lambert', 
        studentId: 'L3-2024-202',
        average: 16.3, 
        mention: 'Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-12.jpg' 
      },
    ],
    M1: [
      { 
        id: 1, 
        name: 'Thomas Bernard', 
        studentId: 'M1-2024-301',
        average: 14.7, 
        mention: 'Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-13.jpg' 
      },
      { 
        id: 2, 
        name: 'Élise Dubois', 
        studentId: 'M1-2024-302',
        average: 18.2, 
        mention: 'Très Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-14.jpg' 
      },
      { 
        id: 3, 
        name: 'Nicolas Petit', 
        studentId: 'M1-2024-303',
        average: 8.4, 
        mention: '-', 
        status: 'Échec', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-15.jpg' 
      },
      { 
        id: 4, 
        name: 'Laura Moreau', 
        studentId: 'M1-2024-304',
        average: 9.1, 
        mention: '-', 
        status: 'Rattrapage', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-16.jpg' 
      },
    ],
    M2: [
      { 
        id: 1, 
        name: 'David Leroy', 
        studentId: 'M2-2024-401',
        average: 16.9, 
        mention: 'Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-17.jpg' 
      },
      { 
        id: 2, 
        name: 'Camille Richard', 
        studentId: 'M2-2024-402',
        average: 15.3, 
        mention: 'Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-18.jpg' 
      },
      { 
        id: 3, 
        name: 'Antoine Martin', 
        studentId: 'M2-2024-403',
        average: 12.8, 
        mention: 'Assez Bien', 
        status: 'Admis', 
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-19.jpg' 
      },
    ]
  };

  const currentStudents = studentsByLevel[selectedLevel] ?? [];
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentStudents.length / itemsPerPage);

  // Calcul des stats dynamiquement
  const calculateStats = () => {
    return {
      admis: currentStudents.filter(s => s.status === 'Admis').length,
      echec: currentStudents.filter(s => s.status === 'Échec').length,
      rattrapage: currentStudents.filter(s => s.status === 'Rattrapage').length,
      total: currentStudents.length
    };
  };

  const stats = calculateStats();

  // Fonction d'exportation
  const handleExport = () => {
    // Créer un fichier CSV
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nom,Numéro Étudiant,Note,Mention,Statut\n"
      + currentStudents.map(student => 
          `"${student.name}",${student.studentId},${student.average},${student.mention},${student.status}`
        ).join("\n");
    
    // Créer un lien de téléchargement
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `resultats-${selectedLevel}.csv`);
    document.body.appendChild(link);
    
    // Déclencher le téléchargement
    link.click();
    document.body.removeChild(link);
  };

  return (
    <RouteGuard roles={['responsable']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" 
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed left-0 top-0 z-20 h-screen w-64 bg-indigo-800 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 sm:p-6 border-b border-indigo-600">
              <h2 className="text-xl font-bold">IDA - Filière</h2>
              <p className="text-blue-200 text-sm mt-1">Responsable de Filière</p>
            </div>
            
            {/* Navigation */}
            <nav className="flex-grow overflow-y-auto py-4">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 sm:px-6 py-3 text-blue-200 hover:bg-indigo-700 hover:text-white ${
                        pathname === link.href ? 'bg-indigo-700 text-white' : ''
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <i className={`fa-solid ${link.icon} mr-3`}></i>
                      <span className="text-sm sm:text-base">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Footer */}
            <div className="p-4 border-t border-indigo-600 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                    alt="Profile" 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" 
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium">{user?.username}</div>
                    <div className="text-xs text-blue-300">Responsable</div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-blue-300 hover:text-white"
                  title="Déconnexion"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header responsive */}
          <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button 
                  className="md:hidden text-gray-500 hover:text-gray-700"
                  onClick={toggleSidebar}
                >
                  <i className="fa-solid fa-bars text-xl"></i>
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Délibérations</h1>
                  <p className="text-gray-600 text-sm">Résultats des examens par classe</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Année Académique</p>
                  <p className="text-sm text-gray-600">2025-2026</p>
                </div>
                <img 
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                  alt="Profile" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" 
                />
              </div>
            </div>
          </header>

          {/* Class Tabs responsive */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
            <nav className="flex overflow-x-auto py-2 hide-scrollbar">
              <div className="flex space-x-4 min-w-max">
                <button 
                  className={`px-3 py-2 rounded-lg text-sm sm:text-base ${
                    selectedLevel === 'L1' 
                      ? 'bg-indigo-800 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedLevel('L1')}
                >
                  Licence 1 (L1)
                </button>
                <button 
                  className={`px-3 py-2 rounded-lg text-sm sm:text-base ${
                    selectedLevel === 'L2' 
                      ? 'bg-indigo-800 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedLevel('L2')}
                >
                  Licence 2 (L2)
                </button>
                <button 
                  className={`px-3 py-2 rounded-lg text-sm sm:text-base ${
                    selectedLevel === 'L3' 
                      ? 'bg-indigo-800 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedLevel('L3')}
                >
                  Licence 3 (L3)
                </button>
                <button 
                  className={`px-3 py-2 rounded-lg text-sm sm:text-base ${
                    selectedLevel === 'M1' 
                      ? 'bg-indigo-800 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedLevel('M1')}
                >
                  Master 1 (M1)
                </button>
                <button 
                  className={`px-3 py-2 rounded-lg text-sm sm:text-base ${
                    selectedLevel === 'M2' 
                      ? 'bg-indigo-800 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedLevel('M2')}
                >
                  Master 2 (M2)
                </button>
              </div>
            </nav>
          </div>

          {/* Content responsive */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Stats Cards responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fa-solid fa-user-check text-green-600 text-lg sm:text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Admis</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.admis}</p>
                  </div>
                </div>
              </div>
             
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="fa-solid fa-user-xmark text-red-600 text-lg sm:text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Échec</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.echec}</p>
                  </div>
                </div>
              </div>
             
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="fa-solid fa-clock text-yellow-600 text-lg sm:text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Rattrapage</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.rattrapage}</p>
                  </div>
                </div>
              </div>
             
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <i className="fa-solid fa-users text-indigo-800 text-lg sm:text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Table responsive */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Résultats {selectedLevel} - JavaScript</h3>
                  <button 
                    onClick={handleExport}
                    className="px-3 sm:px-4 py-2 bg-indigo-800 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-900 flex-shrink-0 flex items-center"
                  >
                    <i className="fa-solid fa-download mr-2"></i>Exporter
                  </button>
                </div>
              </div>
             
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note/20</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mention</th>
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={student.imageUrl} 
                              alt={student.name} 
                              className="w-8 h-8 rounded-full mr-2 sm:mr-3" 
                            />
                            <span className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.studentId}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.average}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.mention}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            student.status === 'Admis' 
                              ? 'bg-green-100 text-green-800' 
                              : student.status === 'Rattrapage' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             
              <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-gray-700">
                    Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, currentStudents.length)} sur {currentStudents.length} résultats
                  </p>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button 
                      className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm text-gray-500 hover:bg-gray-50"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    
                    {/* Pagination simplifiée */}
                    <div className="flex">
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm mx-0.5 ${
                              currentPage === page 
                                ? 'bg-indigo-800 text-white' 
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      {totalPages > 3 && (
                        <span className="px-2 py-1 text-xs sm:text-sm text-gray-500">...</span>
                      )}
                    </div>
                    
                    <button 
                      className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </RouteGuard>
  );
}