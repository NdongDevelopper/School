"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { getNomSpecialite, SpecialiteKey } from '@/utils/specialites';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';

// Structure des données d'étudiant
type Student = {
  id: number;
  name: string;
  studentId: string;
  grades: number[];
  average: number;
  status: "Admis" | "Admise" | "Rattrapage" | "Échec";
};

// Structure des données de classe
type ClassData = {
  [key: string]: Student[];
};

// Données complètes pour toutes les spécialités et niveaux
const classesData = {
  ida: {
    L1: [
      { id: 1, name: "Sarah Benali", studentId: "L1-001", grades: [16, 14, 15], average: 15.0, status: "Admise" },
      { id: 2, name: "Ahmed Mansouri", studentId: "L1-002", grades: [12, 10, 11], average: 11.0, status: "Admis" },
      { id: 3, name: "Fatima Zahra", studentId: "L1-003", grades: [8, 9, 7], average: 8.0, status: "Rattrapage" },
      { id: 4, name: "Youssef Alami", studentId: "L1-004", grades: [18, 17, 19], average: 18.0, status: "Admis" },
    ],
    L2: [
      { id: 8, name: "Mohamed Ali", studentId: "L2-001", grades: [15, 14, 16], average: 15.0, status: "Admis" },
      { id: 9, name: "Amina Toumi", studentId: "L2-002", grades: [13, 12, 14], average: 13.0, status: "Admise" },
    ],
    L3: [
      { id: 11, name: "Samir Bouzid", studentId: "L3-001", grades: [16, 15, 17], average: 16.0, status: "Admis" },
      { id: 12, name: "Lina Maroc", studentId: "L3-002", grades: [14, 13, 15], average: 14.0, status: "Admise" },
    ]
  },
  mic: {
    L1: [
      { id: 14, name: "Zineb Rahmani", studentId: "L1-101", grades: [15, 16, 14], average: 15.0, status: "Admise" },
      { id: 15, name: "Omar El Fassi", studentId: "L1-102", grades: [12, 13, 11], average: 12.0, status: "Admis" },
    ],
    L2: [
      { id: 17, name: "Yasmine Belhaj", studentId: "L2-101", grades: [17, 16, 18], average: 17.0, status: "Admise" },
      { id: 18, name: "Mehdi Zaoui", studentId: "L2-102", grades: [14, 15, 13], average: 14.0, status: "Admis" },
    ],
  },
  cd: {
    L1: [
      { id: 21, name: "Nora Saidi", studentId: "L1-201", grades: [15, 14, 16], average: 15.0, status: "Admise" },
      { id: 22, name: "Khalid Benjelloun", studentId: "L1-202", grades: [12, 11, 13], average: 12.0, status: "Admis" },
    ],
    L2: [
      { id: 24, name: "Rania El Khatib", studentId: "L2-201", grades: [16, 15, 17], average: 16.0, status: "Admise" },
      { id: 25, name: "Anas Berrada", studentId: "L2-202", grades: [14, 13, 15], average: 14.0, status: "Admis" },
    ],
  }
};

// Fonction pour calculer les statistiques de classe
const calculateClassStats = (students: Student[]) => {
  const totalStudents = students.length;
  const averages = students.map(s => s.average);
  const classAverage = averages.length > 0 
    ? (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(2)
    : "0.00";
  
  const admitted = students.filter(s => s.status === "Admis" || s.status === "Admise").length;
  const remedial = students.filter(s => s.status === "Rattrapage").length;
  
  return {
    totalStudents,
    classAverage,
    admitted,
    remedial
  };
};

// Mapping des couleurs de statut
const statusColors = {
  "Admis": "bg-green-100 text-green-800",
  "Admise": "bg-green-100 text-green-800",
  "Rattrapage": "bg-orange-100 text-orange-800",
  "Échec": "bg-red-100 text-red-800"
};

export default function NoteEtudiantPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLevel, setCurrentLevel] = useState("L1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  
  const { user } = useAuth();
  const params = useParams();
  
  useEffect(() => {
    // Simuler un chargement asynchrone
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!user || !params?.specialite) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }
  
  const specialite = params.specialite as SpecialiteKey;
  
  // Vérifier si la spécialité existe dans les données
  if (!classesData[specialite as keyof typeof classesData]) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold mt-4 text-gray-800">Spécialité non trouvée</h2>
          <p className="mt-2 text-gray-600">La spécialité "{specialite}" n'existe pas dans nos registres.</p>
        </div>
      </div>
    );
  }
  
  const classData = classesData[specialite as keyof typeof classesData] as ClassData;
  
  // Vérifier la taille de l'écran au montage
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Obtenir les étudiants pour le niveau actuel
  const students = classData[currentLevel] || [];
  
  // Filtrer les étudiants
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = calculateClassStats(students);
  
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <RouteGuard roles={['enseignant']}>
      <div className="bg-gray-50 min-h-screen">
        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        <div className="flex">
          {/* Sidebar */}
          <aside 
            className={`bg-blue-600 text-white fixed left-0 top-0 h-full transition-all duration-300 z-20 ${
              sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
            }`}
          >
            <div className="p-6 border-b border-blue-500">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{user.username}</h2>
                  <p className="text-blue-200 text-sm">Enseignant</p>
                </div>
              </div>
            </div>
            <nav className="mt-6">
              <ul className="space-y-2 px-4">
                {[
                  { icon: 'calendar', label: 'Emploi du temps' },
                  { icon: 'clipboard', label: 'Notes des Étudiants', active: true },
                  { icon: 'user-clock', label: 'Absences' },
                  { icon: 'gavel', label: 'Délibérations' }
                ].map((item, index) => (
                  <li key={index}>
                    <a className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      item.active ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 transition-colors'
                    } cursor-pointer`}>
                      {item.icon === 'calendar' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      {item.icon === 'clipboard' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      )}
                      {item.icon === 'user-clock' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {item.icon === 'gavel' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      )}
                      <span className="text-sm sm:text-base">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className={`flex-1 transition-all duration-300 min-h-screen ${
            sidebarOpen ? 'md:ml-64' : 'ml-0'
          }`}>
            <header className="bg-white shadow-sm border-b px-4 py-4 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <button 
                    onClick={toggleSidebar}
                    className="mr-2 md:mr-4 text-gray-600 hover:text-gray-900 md:hidden"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                      Notes des Étudiants - {getNomSpecialite(specialite)}
                    </h1>
                    <p className="text-gray-600 text-sm">Enseignant: {user.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 mt-2 md:mt-0">
                  <button className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm md:text-base">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter Note
                  </button>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-300 flex items-center justify-center">
                    <span className="text-blue-800 font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <section className="p-4 md:p-6">
              {/* Sélecteur de niveau */}
              <div className="mb-4 md:mb-6 flex flex-wrap gap-2 md:gap-4">
                {Object.keys(classData).map((level, index) => (
                  <button 
                    key={index}
                    onClick={() => {
                      setCurrentLevel(level);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm md:text-base ${
                      currentLevel === level 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              {/* Cartes de statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
                <StatsCard 
                  title="Total Étudiants" 
                  value={stats.totalStudents.toString()} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                  color="blue"
                />
                <StatsCard 
                  title="Moyenne Classe" 
                  value={stats.classAverage} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                  color="green"
                />
                <StatsCard 
                  title="Admis" 
                  value={stats.admitted.toString()} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  }
                  color="green"
                />
                <StatsCard 
                  title="En Rattrapage" 
                  value={stats.remedial.toString()} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                  color="orange"
                />
              </div>

              {/* Tableau des étudiants */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 md:p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notes - {getNomSpecialite(specialite)} {currentLevel}
                  </h3>
                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Rechercher étudiant..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrôle 1</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrôle 2</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examen</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moyenne</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedStudents.length > 0 ? (
                        paginatedStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 md:w-10 md:h-10 mr-2 md:mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                  <div className="text-xs text-gray-500">ID: {student.studentId}</div>
                                </div>
                              </div>
                            </td>
                            {student.grades.map((grade, index) => (
                              <td key={index} className="px-4 py-3 text-sm text-gray-900">{grade}</td>
                            ))}
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.average}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[student.status]}`}>
                                {student.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800" title="Modifier">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="text-gray-600 hover:text-gray-800" title="Voir détails">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-6 text-center text-gray-500 text-sm md:text-base">
                            Aucun étudiant trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
                  <p className="text-xs md:text-sm text-gray-700">
                    Affichage {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredStudents.length)} sur {filteredStudents.length} étudiants
                  </p>
                  <div className="flex space-x-1 md:space-x-2">
                    <button 
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === page 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button 
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}

function StatsCard({ title, value, icon, color = "blue" }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  color?: string;
}) {
  // Mapping des couleurs pour les classes Tailwind
  const colorClasses = {
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-100"
    },
    green: {
      text: "text-green-600",
      bg: "bg-green-100"
    },
    orange: {
      text: "text-orange-600",
      bg: "bg-orange-100"
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-100"
    }
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm md:text-base font-medium text-gray-600">{title}</h3>
        <p className={`text-xl md:text-2xl font-bold ${colors.text}`}>{value}</p>
      </div>
      <div className={`ml-4 w-10 h-10 md:w-12 md:h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}