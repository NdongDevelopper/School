'use client';

import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Absence {
  id: string;
  date: string;
  motif: string;
}

interface Etudiant {
  id: string;
  nom: string;
  absences: Absence[];
}

export default function AbsencesEnseignant() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [niveau, setNiveau] = useState('L1');
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);
  const [newAbsence, setNewAbsence] = useState({ date: '', motif: '' });
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const niveauxAcademiques = ['L1', 'L2', 'L3', 'M1', 'M2'];

  useEffect(() => {
    const loadData = () => {
      if (!user?.nomSpecialite) return;
      
      const key = `absences_${user.nomSpecialite}_${niveau}`;
      const savedData = localStorage.getItem(key);
      
      if (savedData) {
        setEtudiants(JSON.parse(savedData));
      } else {
        const initialData = getInitialData();
        setEtudiants(initialData);
      }
    };

    loadData();
  }, [niveau, user?.nomSpecialite]);

  const getInitialData = () => {
    const data = {
      L1: [
        { 
          id: '1', 
          nom: "Sarah Benali", 
          absences: [
            { id: 'a1', date: "2025-10-15", motif: "Absence non justifiée" },
            { id: 'a2', date: "2025-10-10", motif: "Maladie" }
          ] 
        },
        { 
          id: '2', 
          nom: "Ahmed Mansouri", 
          absences: [] 
        },
      ],
      L2: [
        { 
          id: '3', 
          nom: "Fatima Zahra", 
          absences: [
            { id: 'a3', date: "2025-10-20", motif: "Problème de transport" }
          ] 
        },
        { 
          id: '4', 
          nom: "Karim Belkacem", 
          absences: [
            { id: 'a4', date: "2025-10-18", motif: "Absence non justifiée" },
            { id: 'a5', date: "2025-10-12", motif: "Rendez-vous médical" },
            { id: 'a6', date: "2025-10-05", motif: "Maladie" }
          ] 
        },
      ],
      L3: [
        { 
          id: '5', 
          nom: "Leila Ndiaye", 
          absences: [] 
        },
        { 
          id: '6', 
          nom: "Youssef Chahdi", 
          absences: [
            { id: 'a7', date: "2025-10-22", motif: "Absence non justifiée" },
            { id: 'a8', date: "2025-10-15", motif: "Problème familial" }
          ] 
        },
      ],
      M1: [
        { 
          id: '7', 
          nom: "Nadia El Fassi", 
          absences: [
            { id: 'a9', date: "2025-10-19", motif: "Maladie" }
          ] 
        },
        { 
          id: '8', 
          nom: "Mehdi Zaoui", 
          absences: [] 
        },
      ],
      M2: [
        { 
          id: '9', 
          nom: "Samira Bennis", 
          absences: [
            { id: 'a10', date: "2025-10-21", motif: "Absence non justifiée" },
            { id: 'a11', date: "2025-10-14", motif: "Rendez-vous médical" },
            { id: 'a12', date: "2025-10-07", motif: "Problème familial" }
          ] 
        },
        { 
          id: '10', 
          nom: "Omar Kaddouri", 
          absences: [
            { id: 'a13', date: "2025-10-17", motif: "Maladie" }
          ] 
        },
      ]
    };

    return data[niveau as keyof typeof data] || [];
  };

  const handleAddAbsence = (etudiant: Etudiant) => {
    setSelectedStudent(etudiant);
    setNewAbsence({ date: new Date().toISOString().split('T')[0], motif: '' });
    setModalOpen(true);
  };

  const confirmAddAbsence = () => {
    if (!selectedStudent || !newAbsence.date || !newAbsence.motif) return;
    
    const updatedStudents = etudiants.map(etud => {
      if (etud.id === selectedStudent.id) {
        const newAbsenceWithId = {
          ...newAbsence,
          id: `abs-${Date.now()}`
        };
        return {
          ...etud,
          absences: [...etud.absences, newAbsenceWithId]
        };
      }
      return etud;
    });
    
    setEtudiants(updatedStudents);
    
    if (user?.nomSpecialite) {
      const key = `absences_${user.nomSpecialite}_${niveau}`;
      localStorage.setItem(key, JSON.stringify(updatedStudents));
    }
    
    setModalOpen(false);
  };

  const viewDetails = (etudiant: Etudiant) => {
    setSelectedStudent(etudiant);
    setDetailsModalOpen(true);
  };

  const filteredEtudiants = etudiants.filter(e => 
    e.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDerniereAbsence = (absences: Absence[]) => {
    if (absences.length === 0) return "";
    const dates = absences.map(a => new Date(a.date).getTime());
    const lastDate = new Date(Math.max(...dates));
    return lastDate.toLocaleDateString('fr-FR');
  };

  const isActive = (path: string) => pathname === path;

  const totalStudents = etudiants.length;
  const withoutAbsences = etudiants.filter(e => e.absences.length === 0).length;
  const withAbsences = totalStudents - withoutAbsences;
  const totalAbsences = etudiants.reduce((acc, etud) => acc + etud.absences.length, 0);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <RouteGuard roles={['enseignant']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar - Responsive */}
        <aside 
          className={`fixed md:relative z-50 md:z-auto inset-y-0 left-0 w-64 bg-blue-800 text-white shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b border-blue-600 md:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-blue-800 text-lg"></i>
              </div>
              <h2 className="text-lg font-semibold">Espace Enseignant</h2>
            </div>
            <button 
              className="text-white text-xl"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          <div className="p-4 md:p-6 border-b border-blue-600 hidden md:block">
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
          
          <nav className="mt-4 flex-1 overflow-y-auto">
            <ul className="space-y-1 px-2">
              <li>
                <Link href="/enseignant/dashboard">
                  <div 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive('/enseignant/dashboard') 
                        ? 'bg-blue-700' 
                        : 'hover:bg-blue-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className="fa-solid fa-calendar-days w-5 text-center"></i>
                    <span>Emploi du temps</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/notes">
                  <div 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive('/enseignant/notes') 
                        ? 'bg-blue-700' 
                        : 'hover:bg-blue-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className="fa-solid fa-file-lines w-5 text-center"></i>
                    <span>Notes des Étudiants</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/absences">
                  <div 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive('/enseignant/absences') 
                        ? 'bg-blue-700' 
                        : 'hover:bg-blue-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className="fa-solid fa-user-xmark w-5 text-center"></i>
                    <span>Absences</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/deliberations">
                  <div 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive('/enseignant/deliberations') 
                        ? 'bg-blue-700' 
                        : 'hover:bg-blue-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className="fa-solid fa-clipboard-check w-5 text-center"></i>
                    <span>Délibérations</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-blue-600">
            <div className="flex items-center space-x-3">
              <img 
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
                alt="Professeur" 
                className="w-8 h-8 rounded-full" 
              />
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-blue-200 truncate">Enseignant {user?.nomSpecialite}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b p-4 md:p-6">
            <div className="flex justify-between items-center mb-4 md:mb-0">
              <div className="flex items-center">
                <button 
                  className="md:hidden text-gray-500 mr-3"
                  onClick={() => setSidebarOpen(true)}
                >
                  <i className="fa-solid fa-bars text-xl"></i>
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Gestion des Absences</h1>
              </div>
              <button className="md:hidden bg-blue-600 text-white p-2 rounded-lg">
                <i className="fa-solid fa-download"></i>
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
              <p className="text-gray-600 text-sm md:text-base">Enregistrer et suivre les absences des étudiants</p>
              <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
                <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">Aujourd'hui: {formattedDate}</span>
                <button className="hidden md:flex bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <i className="fa-solid fa-download mr-2"></i>
                  Exporter
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="border-b border-gray-200 mb-4 md:mb-6">
              <nav className="-mb-px flex space-x-4 overflow-x-auto pb-1">
                {niveauxAcademiques.map((niv) => (
                  <button
                    key={niv}
                    className={`py-2 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                      niveau === niv
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setNiveau(niv)}
                  >
                    {niv}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4">Rechercher un étudiant</h3>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Nom de l'étudiant"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4">Filtrer par date</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Date de début</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4 md:mb-6">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">Liste des étudiants - {niveau}</h3>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs md:text-sm">
                      <i className="fa-solid fa-check-double mr-1"></i>
                      <span className="hidden sm:inline">Tout marquer présent</span>
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm">
                      <i className="fa-solid fa-save mr-1 md:mr-2"></i>
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                      <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Absences</th>
                      <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Dernière</th>
                      <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEtudiants.map((etudiant) => (
                      <tr key={etudiant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={`https://i.pravatar.cc/150?u=${etudiant.id}`} 
                              alt={etudiant.nom} 
                              className="w-8 h-8 rounded-full mr-2 md:mr-3" 
                            />
                            <div className="truncate max-w-[120px] md:max-w-none">
                              <div className="font-medium text-gray-900 text-sm md:text-base truncate">{etudiant.nom}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            etudiant.absences.length === 0 
                              ? 'bg-green-100 text-green-800' 
                              : etudiant.absences.length < 3 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {etudiant.absences.length} {etudiant.absences.length === 1 ? 'absence' : 'absences'}
                          </span>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-gray-500 hidden sm:table-cell">
                          {etudiant.absences.length > 0 
                            ? getDerniereAbsence(etudiant.absences) 
                            : "Aucune"}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap space-x-1 md:space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded-md text-xs md:text-sm"
                            onClick={() => handleAddAbsence(etudiant)}
                          >
                            <i className="fa-solid fa-plus mr-1"></i>
                            <span className="hidden sm:inline">Ajouter</span>
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-800 px-2 py-1 bg-gray-50 rounded-md text-xs md:text-sm"
                            onClick={() => viewDetails(etudiant)}
                          >
                            <i className="fa-solid fa-eye mr-1"></i>
                            <span className="hidden sm:inline">Détails</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <i className="fa-solid fa-users text-blue-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs md:text-sm font-medium text-gray-500">Total étudiants</p>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900">{totalStudents}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fa-solid fa-user-check text-green-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs md:text-sm font-medium text-gray-500">Sans absence</p>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900">{withoutAbsences}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="fa-solid fa-user-xmark text-red-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs md:text-sm font-medium text-gray-500">Avec absence</p>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900">{withAbsences}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="fa-solid fa-clock text-yellow-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs md:text-sm font-medium text-gray-500">Total absences</p>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900">{totalAbsences}</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal pour ajouter une absence */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg md:text-xl font-bold">Ajouter une absence</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                <i className="fa-solid fa-times text-lg"></i>
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="mb-3 md:mb-4">
                <p className="text-base md:text-lg font-medium mb-1 md:mb-2">Étudiant: <span className="text-blue-600">{selectedStudent.nom}</span></p>
              </div>
              
              <div className="mb-3 md:mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'absence</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm md:text-base"
                  value={newAbsence.date}
                  onChange={(e) => setNewAbsence({...newAbsence, date: e.target.value})}
                />
              </div>
              
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif de l'absence</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 h-20 md:h-24 text-sm md:text-base"
                  placeholder="Entrez le motif de l'absence..."
                  value={newAbsence.motif}
                  onChange={(e) => setNewAbsence({...newAbsence, motif: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-2 md:gap-3">
                <button 
                  className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm md:text-base"
                  onClick={() => setModalOpen(false)}
                >
                  Annuler
                </button>
                <button 
                  className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm md:text-base"
                  onClick={confirmAddAbsence}
                  disabled={!newAbsence.date || !newAbsence.motif}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour voir les détails des absences */}
      {detailsModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg md:text-xl font-bold">Détails des absences</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setDetailsModalOpen(false)}
              >
                <i className="fa-solid fa-times text-lg"></i>
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="mb-3 md:mb-4">
                <p className="text-base md:text-lg font-medium mb-1">Étudiant: <span className="text-blue-600">{selectedStudent.nom}</span></p>
                <p className="text-xs md:text-sm text-gray-600">
                  Total d'absences: <span className="font-semibold">{selectedStudent.absences.length}</span>
                </p>
              </div>
              
              {selectedStudent.absences.length > 0 ? (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                  {selectedStudent.absences.map((absence) => (
                    <div key={absence.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 text-sm md:text-base">
                            {new Date(absence.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-gray-600 text-xs md:text-sm">{absence.motif}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 md:py-8 text-gray-500">
                  <i className="fa-solid fa-check-circle text-2xl md:text-3xl text-green-500 mb-2 md:mb-3"></i>
                  <p className="text-sm md:text-base">Aucune absence enregistrée</p>
                </div>
              )}
              
              <div className="mt-4 md:mt-6 flex justify-end">
                <button 
                  className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base"
                  onClick={() => setDetailsModalOpen(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </RouteGuard>
  );
}