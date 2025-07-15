'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Etudiant {
  id: string;
  numero: string;
  nom: string;
  imageUrl: string;
  controle1: number;
  controle2: number;
  examen: number;
  moyenne: number;
  statut: string;
}

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export default function NotesEnseignant() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [niveau, setNiveau] = useState('L1');
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Etudiant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newStudent, setNewStudent] = useState({
    numero: '',
    nom: '',
    controle1: 0,
    controle2: 0,
    examen: 0,
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const itemsPerPage = 4;
  const niveauxAcademiques = ['L1', 'L2', 'L3', 'M1', 'M2'];

  useEffect(() => {
    loadStudents();
  }, [niveau, user?.nomSpecialite]);

  const loadStudents = () => {
    if (!user?.nomSpecialite) return;
    
    const key = `notes_${user.nomSpecialite}_${niveau}`;
    const savedStudents = localStorage.getItem(key);
    
    if (savedStudents) {
      setEtudiants(JSON.parse(savedStudents));
    } else {
      const initialData = getInitialData();
      setEtudiants(initialData);
      localStorage.setItem(key, JSON.stringify(initialData));
    }
    setCurrentPage(1);
  };

  const getInitialData = () => {
    const initialData: Record<string, Etudiant[]> = {
      L1: [
        { id: generateId(), numero: 'L1-001', nom: "Sarah Benali", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg", controle1: 16, controle2: 14, examen: 15, moyenne: 15.0, statut: "Admise" },
        { id: generateId(), numero: 'L1-002', nom: "Ahmed Mansouri", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg", controle1: 12, controle2: 10, examen: 11, moyenne: 11.0, statut: "Admis" },
        { id: generateId(), numero: 'L1-003', nom: "Fatima Zahra", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg", controle1: 8, controle2: 9, examen: 7, moyenne: 8.0, statut: "Rattrapage" },
        { id: generateId(), numero: 'L1-004', nom: "Youssef Alami", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg", controle1: 18, controle2: 17, examen: 19, moyenne: 18.0, statut: "Admis" },
        { id: generateId(), numero: 'L1-005', nom: "Nadia El Fassi", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg", controle1: 15, controle2: 16, examen: 14, moyenne: 15.0, statut: "Admise" },
        { id: generateId(), numero: 'L1-006', nom: "Karim Belkacem", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg", controle1: 13, controle2: 14, examen: 12, moyenne: 13.0, statut: "Admis" },
        { id: generateId(), numero: 'L1-007', nom: "Hind Mansouri", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg", controle1: 17, controle2: 16, examen: 18, moyenne: 17.0, statut: "Admise" },
        { id: generateId(), numero: 'L1-008', nom: "Leila Ndiaye", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-11.jpg", controle1: 17, controle2: 16, examen: 18, moyenne: 17.0, statut: "Admise" }
      ],
      L2: [
        { id: generateId(), numero: 'L2-001', nom: "Nadia El Fassi", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg", controle1: 15, controle2: 16, examen: 14, moyenne: 15.0, statut: "Admise" },
        { id: generateId(), numero: 'L2-002', nom: "Karim Belkacem", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg", controle1: 13, controle2: 14, examen: 12, moyenne: 13.0, statut: "Admis" },
      ],
      L3: [
        { id: generateId(), numero: 'L3-001', nom: "Hind Mansouri", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg", controle1: 17, controle2: 16, examen: 18, moyenne: 17.0, statut: "Admise" },
      ],
      M1: [
        { id: generateId(), numero: 'M1-001', nom: "Omar Benjelloun", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-12.jpg", controle1: 16, controle2: 17, examen: 18, moyenne: 17.0, statut: "Admis" },
        { id: generateId(), numero: 'M1-002', nom: "Samira Toumi", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-13.jpg", controle1: 15, controle2: 14, examen: 16, moyenne: 15.0, statut: "Admise" },
        { id: generateId(), numero: 'M1-003', nom: "Bilal Hassani", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-14.jpg", controle1: 12, controle2: 13, examen: 11, moyenne: 12.0, statut: "Admis" },
      ],
      M2: [
        { id: generateId(), numero: 'M2-001', nom: "Yassin Bouzid", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-15.jpg", controle1: 18, controle2: 17, examen: 19, moyenne: 18.0, statut: "Admis" },
        { id: generateId(), numero: 'M2-002', nom: "Nour El Houda", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-16.jpg", controle1: 15, controle2: 16, examen: 17, moyenne: 16.0, statut: "Admise" },
      ]
    };
    
    return initialData[niveau] || [];
  };

  const calculateMoyenne = (controle1: number, controle2: number, examen: number) => {
    return Number(((controle1 + controle2 + examen) / 3).toFixed(1));
  };

  const determineStatut = (moyenne: number, nom: string) => {
    if (moyenne >= 10) {
      return nom.endsWith('e') ? "Admise" : "Admis";
    }
    return "Rattrapage";
  };

  const saveStudents = (students: Etudiant[]) => {
    if (!user?.nomSpecialite) return;
    
    const key = `notes_${user.nomSpecialite}_${niveau}`;
    localStorage.setItem(key, JSON.stringify(students));
    setEtudiants(students);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    
    // Simuler un upload vers un serveur
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
        
        if (currentStudent) {
          setCurrentStudent({ ...currentStudent, imageUrl: base64Image });
        } else {
          setNewStudent({ ...newStudent, imageUrl: base64Image });
        }
        
        setUploadStatus('success');
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddStudent = () => {
    const moyenne = calculateMoyenne(
      newStudent.controle1,
      newStudent.controle2,
      newStudent.examen
    );
    
    const statut = determineStatut(moyenne, newStudent.nom);
    
    const student: Etudiant = {
      id: generateId(),
      numero: newStudent.numero,
      nom: newStudent.nom,
      imageUrl: newStudent.imageUrl || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
      controle1: newStudent.controle1,
      controle2: newStudent.controle2,
      examen: newStudent.examen,
      moyenne,
      statut
    };
    
    const updatedStudents = [...etudiants, student];
    saveStudents(updatedStudents);
    setModalOpen(false);
    resetForm();
    setImagePreview(null);
  };

  const handleUpdateStudent = () => {
    if (!currentStudent) return;
    
    const moyenne = calculateMoyenne(
      currentStudent.controle1,
      currentStudent.controle2,
      currentStudent.examen
    );
    
    const statut = determineStatut(moyenne, currentStudent.nom);
    
    const updatedStudent = {
      ...currentStudent,
      moyenne,
      statut
    };
    
    const updatedStudents = etudiants.map(s => 
      s.id === currentStudent.id ? updatedStudent : s
    );
    
    saveStudents(updatedStudents);
    setModalOpen(false);
    setCurrentStudent(null);
    setImagePreview(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      // Fermer la modal si l'étudiant en cours d'édition est supprimé
      if (currentStudent && currentStudent.id === id) {
        setModalOpen(false);
        setCurrentStudent(null);
      }
      
      const updatedStudents = etudiants.filter(s => s.id !== id);
      saveStudents(updatedStudents);
    }
  };

  const handleEditClick = (student: Etudiant) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setModalOpen(true);
    setImagePreview(student.imageUrl);
  };

  const handleViewClick = (student: Etudiant) => {
    setCurrentStudent(student);
    setIsEditing(false);
    setModalOpen(true);
  };

  const resetForm = () => {
    setNewStudent({
      numero: '',
      nom: '',
      controle1: 0,
      controle2: 0,
      examen: 0,
      imageUrl: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: name.includes('controle') || name === 'examen' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentStudent) return;
    
    const { name, value } = e.target;
    const numericValue = name.includes('controle') || name === 'examen' 
      ? parseFloat(value) || 0 
      : value;
    
    setCurrentStudent(prev => ({
      ...prev!,
      [name]: numericValue
    }));
  };

  // Calcul des statistiques
  const totalEtudiants = etudiants.length;
  const moyenneClasse = totalEtudiants > 0 
    ? Number((etudiants.reduce((acc, e) => acc + e.moyenne, 0) / totalEtudiants).toFixed(1))
    : 0;
  
  const admis = etudiants.filter(e => 
    e.statut === "Admis" || e.statut === "Admise"
  ).length;
  
  const rattrapage = etudiants.filter(e => e.statut === "Rattrapage").length;

  // Filtrage et pagination
  const filteredEtudiants = etudiants.filter(e => 
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEtudiants = filteredEtudiants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Vérifie si le lien est actif
  const isActive = (path: string) => pathname === path;

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
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  className="md:hidden mr-3 text-gray-600"
                  onClick={() => setSidebarOpen(true)}
                >
                  <i className="fa-solid fa-bars text-xl"></i>
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Notes des Étudiants</h1>
                  <p className="text-xs sm:text-sm text-gray-600">Gestion des notes - {user?.nomSpecialite}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button 
                  className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center text-xs sm:text-sm"
                  onClick={() => {
                    setIsEditing(false);
                    setModalOpen(true);
                  }}
                >
                  <i className="fa-solid fa-plus mr-1"></i>
                  <span className="hidden sm:inline">Ajouter Note</span>
                  <span className="sm:hidden">Ajouter</span>
                </button>
                <img 
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
          </header>

          {/* Onglets des niveaux */}
          <div className="bg-white border-b px-3 py-2 sm:px-6 sm:py-3 overflow-x-auto">
            <div className="flex gap-1 sm:gap-2 min-w-max">
              {niveauxAcademiques.map((niv) => (
                <button
                  key={niv}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap ${
                    niveau === niv 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-white text-blue-700 border border-blue-700 hover:bg-blue-50'
                  }`}
                  onClick={() => setNiveau(niv)}
                >
                  <span className="hidden sm:inline">{niv.startsWith('L') ? 'Licence' : 'Master'} {niv.substring(1)}</span>
                  <span className="sm:hidden">{niv}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-2 sm:p-4 md:p-6 flex-1">
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Étudiants</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{totalEtudiants}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-users text-blue-700 text-sm sm:text-base"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Moyenne Classe</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{moyenneClasse.toFixed(1)}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-chart-line text-green-600 text-sm sm:text-base"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Admis</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{admis}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-check text-green-600 text-sm sm:text-base"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Rattrapage</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">{rattrapage}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-exclamation-triangle text-orange-600 text-sm sm:text-base"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des étudiants */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-3 sm:p-4 md:p-6 border-b">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                    Notes - {niveau.startsWith('L') ? 'Licence' : 'Master'} {niveau.substring(1)} {user?.nomSpecialite}
                  </h3>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        placeholder="Rechercher étudiant..." 
                        className="pl-8 pr-3 py-1 sm:pl-10 sm:pr-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent w-full text-xs sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <i className="fa-solid fa-search absolute left-2 top-1.5 sm:left-3 sm:top-2.5 text-gray-400 text-xs"></i>
                    </div>
                    <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <i className="fa-solid fa-filter text-xs sm:text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-1 py-1 sm:px-2 sm:py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                      <th className="px-1 py-1 sm:px-2 sm:py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">C1</th>
                      <th className="px-1 py-1 sm:px-2 sm:py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">C2</th>
                      <th className="px-1 py-1 sm:px-2 sm:py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                      <th className="px-1 py-1 sm:px-2 sm:py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Moy</th>
                      <th className="px-1 py-1 sm:px-2 sm:py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-1 py-1 sm:px-2 sm:py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentEtudiants.length > 0 ? (
                      currentEtudiants.map((etudiant) => (
                        <tr key={etudiant.id} className="hover:bg-gray-50">
                          <td className="px-1 py-1 sm:px-2 sm:py-1.5 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                src={etudiant.imageUrl} 
                                alt={etudiant.nom} 
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover mr-1 sm:mr-2" 
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-gray-900 truncate max-w-[70px] sm:max-w-[120px] md:max-w-xs">{etudiant.nom}</div>
                                <div className="text-[9px] sm:text-xs text-gray-500 truncate">ID: {etudiant.numero}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-1 py-1 sm:px-2 sm:py-1.5 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">{etudiant.controle1}</td>
                          <td className="px-1 py-1 sm:px-2 sm:py-1.5 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">{etudiant.controle2}</td>
                          <td className="px-1 py-1 sm:px-2 sm:py-1.5 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-center">{etudiant.examen}</td>
                          <td className="px-1 py-1 sm:px-2 sm:py-1.5 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 text-center">
                            {etudiant.moyenne.toFixed(1)}
                          </td>
                          <td className="px-1 py-1 sm:px-2 sm:py-1.5 whitespace-nowrap text-center">
                            <span className={`px-1.5 py-0.5 text-[9px] sm:text-xs font-semibold rounded-full ${
                              etudiant.statut === "Admis" || etudiant.statut === "Admise"
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {etudiant.statut}
                            </span>
                          </td>
                          <td className="px-1 py-1 sm:px-2 sm:py-1.5 whitespace-nowrap text-xs sm:text-sm font-medium text-center">
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <button 
                                className="text-blue-700 hover:text-blue-900 p-0.5 sm:p-1"
                                onClick={() => handleEditClick(etudiant)}
                                title="Modifier"
                              >
                                <i className="fa-solid fa-pen text-xs"></i>
                              </button>
                              <button 
                                className="text-gray-500 hover:text-gray-700 p-0.5 sm:p-1"
                                onClick={() => handleViewClick(etudiant)}
                                title="Voir détails"
                              >
                                <i className="fa-solid fa-eye text-xs"></i>
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-800 p-0.5 sm:p-1"
                                onClick={() => handleDeleteStudent(etudiant.id)}
                                title="Supprimer"
                              >
                                <i className="fa-solid fa-trash text-xs"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center text-gray-500 text-sm">
                          Aucun étudiant trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {filteredEtudiants.length > 0 && (
                <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm text-gray-700">
                      Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredEtudiants.length)} sur {filteredEtudiants.length} étudiants
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <button 
                        className={`px-1.5 py-0.5 text-xs border border-gray-300 rounded ${
                          currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`px-1.5 py-0.5 text-xs rounded ${
                            currentPage === page 
                              ? 'bg-blue-700 text-white' 
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button 
                        className={`px-1.5 py-0.5 text-xs border border-gray-300 rounded ${
                          currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter/modifier/voir les étudiants */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-xs sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-sm sm:text-base font-bold">
                {isEditing ? "Modifier Étudiant" : (currentStudent ? "Détails Étudiant" : "Ajouter Note Étudiant")}
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setModalOpen(false);
                  setCurrentStudent(null);
                  resetForm();
                  setImagePreview(null);
                }}
              >
                <i className="fa-solid fa-times text-lg"></i>
              </button>
            </div>

            <div className="p-3 sm:p-4">
              {currentStudent ? (
                <div className="space-y-2 sm:space-y-3">
                  {!isEditing ? (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col items-center">
                        <img 
                          src={currentStudent.imageUrl} 
                          alt={currentStudent.nom} 
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-200"
                        />
                        <h4 className="text-xs sm:text-sm font-semibold mt-1 sm:mt-2">{currentStudent.nom}</h4>
                        <p className="text-gray-600 text-xs">ID: {currentStudent.numero}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1 sm:gap-2">
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <label className="block text-xs font-medium text-gray-700">Contrôle 1</label>
                          <p className="mt-0.5 font-semibold text-sm">{currentStudent.controle1}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <label className="block text-xs font-medium text-gray-700">Contrôle 2</label>
                          <p className="mt-0.5 font-semibold text-sm">{currentStudent.controle2}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <label className="block text-xs font-medium text-gray-700">Examen</label>
                          <p className="mt-0.5 font-semibold text-sm">{currentStudent.examen}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <label className="block text-xs font-medium text-gray-700">Moyenne</label>
                          <p className="mt-0.5 font-semibold text-blue-700 text-sm">{currentStudent.moyenne.toFixed(1)}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <label className="block text-xs font-medium text-gray-700">Statut</label>
                        <span className={`px-1.5 py-0.5 mt-0.5 inline-block text-xs font-semibold rounded-full ${
                          currentStudent.statut === "Admis" || currentStudent.statut === "Admise"
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {currentStudent.statut}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <img 
                            src={imagePreview || currentStudent.imageUrl} 
                            alt="Preview" 
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-200"
                          />
                          <button 
                            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1"
                            onClick={triggerFileInput}
                            title="Changer la photo"
                          >
                            <i className="fa-solid fa-camera text-xs"></i>
                          </button>
                        </div>
                        
                        <div className="mt-1 flex gap-1">
                          <button 
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                            onClick={triggerFileInput}
                          >
                            <i className="fa-solid fa-upload mr-1"></i> Changer photo
                          </button>
                          {uploadStatus === 'uploading' && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <i className="fa-solid fa-spinner fa-spin mr-1"></i> Chargement...
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Numéro étudiant</label>
                        <input
                          type="text"
                          name="numero"
                          value={currentStudent.numero}
                          onChange={handleStudentChange}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Nom complet</label>
                        <input
                          type="text"
                          name="nom"
                          value={currentStudent.nom}
                          onChange={handleStudentChange}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1 sm:gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">C1</label>
                          <input
                            type="number"
                            name="controle1"
                            value={currentStudent.controle1}
                            onChange={handleStudentChange}
                            min="0"
                            max="20"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">C2</label>
                          <input
                            type="number"
                            name="controle2"
                            value={currentStudent.controle2}
                            onChange={handleStudentChange}
                            min="0"
                            max="20"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Exam</label>
                          <input
                            type="number"
                            name="examen"
                            value={currentStudent.examen}
                            onChange={handleStudentChange}
                            min="0"
                            max="20"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-blue-50 p-1.5 sm:p-2 rounded-lg">
                        <div>
                          <span className="text-xs font-medium">Moyenne: </span>
                          <span className="font-semibold text-blue-700 text-xs">
                            {calculateMoyenne(
                              currentStudent.controle1,
                              currentStudent.controle2,
                              currentStudent.examen
                            ).toFixed(1)}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-medium">Statut: </span>
                          <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                            calculateMoyenne(
                              currentStudent.controle1,
                              currentStudent.controle2,
                              currentStudent.examen
                            ) >= 10
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {determineStatut(
                              calculateMoyenne(
                                currentStudent.controle1,
                                currentStudent.controle2,
                                currentStudent.examen
                              ),
                              currentStudent.nom
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        className="w-full bg-blue-700 text-white py-1.5 rounded-lg hover:bg-blue-800 transition-colors mt-1 text-xs sm:text-sm"
                        onClick={handleUpdateStudent}
                      >
                        <i className="fa-solid fa-save mr-1"></i>
                        Mettre à jour
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fa-solid fa-user text-gray-400 text-lg sm:text-xl"></i>
                        )}
                      </div>
                      <button 
                        className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1"
                        onClick={triggerFileInput}
                        title="Ajouter une photo"
                      >
                        <i className="fa-solid fa-camera text-xs"></i>
                      </button>
                    </div>
                    
                    <div className="mt-1 flex flex-col items-center">
                      <button 
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center mb-0.5"
                        onClick={triggerFileInput}
                      >
                        <i className="fa-solid fa-upload mr-1"></i> Télécharger une photo
                      </button>
                      {uploadStatus === 'uploading' && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <i className="fa-solid fa-spinner fa-spin mr-1"></i> Chargement en cours...
                        </span>
                      )}
                      {uploadStatus === 'success' && (
                        <span className="text-xs text-green-600 flex items-center">
                          <i className="fa-solid fa-check-circle mr-1"></i> Photo chargée avec succès
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Numéro étudiant</label>
                    <input
                      type="text"
                      name="numero"
                      value={newStudent.numero}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                      placeholder="Ex: L1-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nom complet</label>
                    <input
                      type="text"
                      name="nom"
                      value={newStudent.nom}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                      placeholder="Ex: Ahmed Benali"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">C1</label>
                      <input
                        type="number"
                        name="controle1"
                        value={newStudent.controle1}
                        onChange={handleInputChange}
                        min="0"
                        max="20"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">C2</label>
                      <input
                        type="number"
                        name="controle2"
                        value={newStudent.controle2}
                        onChange={handleInputChange}
                        min="0"
                        max="20"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Exam</label>
                      <input
                        type="number"
                        name="examen"
                        value={newStudent.examen}
                        onChange={handleInputChange}
                        min="0"
                        max="20"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-blue-50 p-1.5 sm:p-2 rounded-lg">
                    <div>
                      <span className="text-xs font-medium">Moyenne: </span>
                      <span className="font-semibold text-blue-700 text-xs">
                        {calculateMoyenne(
                          newStudent.controle1,
                          newStudent.controle2,
                          newStudent.examen
                        ).toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-medium">Statut: </span>
                      <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                        calculateMoyenne(
                          newStudent.controle1,
                          newStudent.controle2,
                          newStudent.examen
                        ) >= 10
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {determineStatut(
                          calculateMoyenne(
                            newStudent.controle1,
                            newStudent.controle2,
                            newStudent.examen
                          ),
                          newStudent.nom
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className="w-full bg-blue-700 text-white py-1.5 rounded-lg hover:bg-blue-800 transition-colors mt-1 flex items-center justify-center text-xs sm:text-sm"
                    onClick={handleAddStudent}
                  >
                    <i className="fa-solid fa-user-plus mr-1"></i>
                    Ajouter note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Input fichier caché */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </RouteGuard>
  );
}