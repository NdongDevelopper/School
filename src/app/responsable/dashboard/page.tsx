'use client';

import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ResponsableDashboard() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <RouteGuard roles={['responsable']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed hidden md:block left-0 top-0 h-screen w-64 bg-[#1e40af] text-white z-50">
          <div className="p-6 border-b border-[#3b82f6]">
            <h2 className="text-xl font-bold">{user?.nomSpecialite} - Filière</h2>
            <p className="text-blue-200 text-sm mt-1">Responsable de Filière</p>
          </div>
          
          <nav className="mt-6">
            <Link href="/responsable/dashboard">
              <div className={`flex items-center px-6 py-3 ${isActive('/responsable/dashboard') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-chart-line mr-3"></i>
                Tableau de Bord
              </div>
            </Link>
            
            <Link href="/responsable/programmes-cours">
              <div className={`flex items-center px-6 py-3 ${isActive('/responsable/programmes-cours') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-book mr-3"></i>
                Programmes et Cours
              </div>
            </Link>
            
            <Link href="/responsable/gestion-etudiants">
              <div className={`flex items-center px-6 py-3 ${isActive('/responsable/gestion-etudiants') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-users mr-3"></i>
                Gestion Étudiants
              </div>
            </Link>
            
            <Link href="/responsable/gestion-enseignants">
              <div className={`flex items-center px-6 py-3 ${isActive('/responsable/gestion-enseignants') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-chalkboard-teacher mr-3"></i>
                Gestion Enseignants
              </div>
            </Link>
            
            <Link href="/responsable/deliberations">
              <div className={`flex items-center px-6 py-3 ${isActive('/responsable/deliberations') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-gavel mr-3"></i>
                Délibérations
              </div>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 min-h-screen">
          {/* Header */}
          <header className="sticky top-0 bg-white shadow-sm border-b border-gray-200 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord - {user?.nomSpecialite}</h1>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span>Année Académique 2023-2024</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 hidden md:block">{user?.username}</span>
                    <img 
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6">
            {/* Stats Overview */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#1e40af]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Étudiants</p>
                      <p className="text-3xl font-bold text-gray-900">1,247</p>
                      <p className="text-sm text-gray-500 mt-1">Filles: 523 | Garçons: 724</p>
                    </div>
                    <div className="bg-[#1e40af] rounded-full p-3">
                      <i className="fa-solid fa-users text-white text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
                      <p className="text-3xl font-bold text-gray-900">78.5%</p>
                      <p className="text-sm text-green-600 mt-1">+5.2% vs année précédente</p>
                    </div>
                    <div className="bg-green-500 rounded-full p-3">
                      <i className="fa-solid fa-chart-line text-white text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Modules Enseignés</p>
                      <p className="text-3xl font-bold text-gray-900">142</p>
                      <p className="text-sm text-gray-500 mt-1">Toutes classes confondues</p>
                    </div>
                    <div className="bg-purple-500 rounded-full p-3">
                      <i className="fa-solid fa-book text-white text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Enseignants</p>
                      <p className="text-3xl font-bold text-gray-900">45</p>
                      <p className="text-sm text-gray-500 mt-1">Corps enseignant actif</p>
                    </div>
                    <div className="bg-orange-500 rounded-full p-3">
                      <i className="fa-solid fa-chalkboard-teacher text-white text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Class-wise Statistics */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Statistiques par Classe</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* L1 Class */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Licence 1 (L1)</h3>
                    <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-sm">320 étudiants</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">245 (76.6%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">35 (10.9%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">28 (8.8%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">12 (3.8%)</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">28</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">12</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* L2 Class */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Licence 2 (L2)</h3>
                    <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-sm">285 étudiants</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">218 (76.5%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">32 (11.2%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">25 (8.8%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">10 (3.5%)</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">30</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">14</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* L3 Class */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Licence 3 (L3)</h3>
                    <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-sm">265 étudiants</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">210 (79.2%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">28 (10.6%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">22 (8.3%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">5 (1.9%)</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">32</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">15</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* M1 Class */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Master 1 (M1)</h3>
                    <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-sm">195 étudiants</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">158 (81.0%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">18 (9.2%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">15 (7.7%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">4 (2.1%)</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">26</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">11</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* M2 Class */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Master 2 (M2)</h3>
                    <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-sm">182 étudiants</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">148 (81.3%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">16 (8.8%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">14 (7.7%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">4 (2.2%)</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">26</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">13</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="bg-[#1e40af] text-white p-6 rounded-lg hover:bg-[#1e3a8a] transition-colors">
                  <i className="fa-solid fa-file-pdf text-2xl mb-3"></i>
                  <h3 className="font-semibold">Générer Rapport</h3>
                  <p className="text-sm text-blue-100 mt-1">Rapport détaillé des résultats</p>
                </button>
               
                <button className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors">
                  <i className="fa-solid fa-download text-2xl mb-3"></i>
                  <h3 className="font-semibold">Exporter Données</h3>
                  <p className="text-sm text-green-100 mt-1">Export Excel/CSV</p>
                </button>
               
                <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors">
                  <i className="fa-solid fa-calendar text-2xl mb-3"></i>
                  <h3 className="font-semibold">Programmer Délibération</h3>
                  <p className="text-sm text-purple-100 mt-1">Planifier une session</p>
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}