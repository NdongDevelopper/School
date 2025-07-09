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
  const [selectedLevel, setSelectedLevel] = useState('L1');
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

  // Données simulées
  const students = [
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
  ];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  // Stats
  const stats = {
    admis: 24,
    echec: 8,
    rattrapage: 5,
    total: 37
  };

  return (
    <RouteGuard roles={['responsable']}>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" 
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed left-0 top-0 z-20 h-full w-64 bg-indigo-800 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="p-6 border-b border-indigo-600">
              <h2 className="text-xl font-bold">IDA - Filière</h2>
              <p className="text-blue-200 text-sm mt-1">Responsable de Filière</p>
            </div>
            <nav className="flex-1 px-2 py-4">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center rounded-lg px-6 py-3 text-blue-200 hover:bg-indigo-700 hover:text-white ${
                        pathname === link.href ? 'bg-indigo-700 text-white' : ''
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <i className={`fa-solid ${link.icon} mr-3`}></i>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-indigo-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full" 
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
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Délibérations</h1>
                <p className="text-gray-600 text-sm">Résultats des examens par classe</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Année Académique</p>
                  <p className="text-sm text-gray-600">2025-2026</p>
                </div>
                <img 
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full" 
                />
              </div>
            </div>
          </header>

          {/* Class Tabs */}
          <div className="bg-white border-b border-gray-200 px-6">
            <nav className="flex space-x-8">
              <button 
                className={`py-4 px-1 border-b-2 ${
                  selectedLevel === 'L1' 
                    ? 'border-indigo-800 text-indigo-800 font-medium' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } text-sm`}
                onClick={() => setSelectedLevel('L1')}
              >
                Licence 1 (L1)
              </button>
              <button 
                className={`py-4 px-1 border-b-2 ${
                  selectedLevel === 'L2' 
                    ? 'border-indigo-800 text-indigo-800 font-medium' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } text-sm`}
                onClick={() => setSelectedLevel('L2')}
              >
                Licence 2 (L2)
              </button>
              <button 
                className={`py-4 px-1 border-b-2 ${
                  selectedLevel === 'L3' 
                    ? 'border-indigo-800 text-indigo-800 font-medium' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } text-sm`}
                onClick={() => setSelectedLevel('L3')}
              >
                Licence 3 (L3)
              </button>
            </nav>
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fa-solid fa-user-check text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admis</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.admis}</p>
                  </div>
                </div>
              </div>
             
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="fa-solid fa-user-xmark text-red-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Échec</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.echec}</p>
                  </div>
                </div>
              </div>
             
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="fa-solid fa-clock text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rattrapage</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.rattrapage}</p>
                  </div>
                </div>
              </div>
             
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <i className="fa-solid fa-users text-indigo-800 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Résultats {selectedLevel} - JavaScript</h3>
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-indigo-800 text-white rounded-lg text-sm font-medium hover:bg-indigo-900">
                      <i className="fa-solid fa-download mr-2"></i>Exporter
                    </button>
                  </div>
                </div>
              </div>
             
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note/20</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mention</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={student.imageUrl} 
                              alt={student.name} 
                              className="w-8 h-8 rounded-full mr-3" 
                            />
                            <span className="text-sm font-medium text-gray-900">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.average}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.mention}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
             
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, students.length)} sur {students.length} résultats
                  </p>
                  <div className="flex space-x-2">
                    <button 
                      className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    <button 
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === 1 
                          ? 'bg-indigo-800 text-white' 
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                    {totalPages > 1 && (
                      <button 
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === 2 
                            ? 'bg-indigo-800 text-white' 
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setCurrentPage(2)}
                      >
                        2
                      </button>
                    )}
                    {totalPages > 2 && (
                      <button 
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === 3 
                            ? 'bg-indigo-800 text-white' 
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setCurrentPage(3)}
                      >
                        3
                      </button>
                    )}
                    <button 
                      className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
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
    </RouteGuard>
  );
}