'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface Etudiant {
  id: string;
  nom: string;
  niveau: string;
  specialite: string;
  email: string;
  telephone: string;
  groupe: string;
  competences: string[];
  statut: 'Actif' | 'Archivé';
  imageUrl: string;
}

export default function GestionEtudiants() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [niveau, setNiveau] = useState('Tous les niveaux');
  const [specialite, setSpecialite] = useState('Toutes les spécialités');
  const [promotion, setPromotion] = useState('2023-2024');
  const [groupe, setGroupe] = useState('Tous les groupes');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEtudiant, setEditingEtudiant] = useState<Etudiant | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleLogout = () => {
    router.push('/login');
  };

  // Charger les étudiants depuis localStorage ou utiliser les données par défaut
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);

  useEffect(() => {
    // Charger les étudiants depuis localStorage
    const savedEtudiants = localStorage.getItem('etudiants');
    if (savedEtudiants) {
      setEtudiants(JSON.parse(savedEtudiants));
    } else {
      // Données par défaut si aucune donnée n'est sauvegardée
      const defaultEtudiants: Etudiant[] = [
        { 
          id: '1', 
          nom: "Sarah Benali", 
          niveau: "L3", 
          specialite: "IDA", 
          email: "sarah@uns.edu.sn", 
          telephone: "0612345678",
          groupe: "Groupe A",
          competences: ["React", "Node.js"],
          statut: "Actif",
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
        },
        { 
          id: '2', 
          nom: "Ahmed Mansouri", 
          niveau: "M1", 
          specialite: "IDA", 
          email: "ahmed@uns.edu.sn", 
          telephone: "0623456789",
          groupe: "Groupe B",
          competences: ["Vue.js", "Docker"],
          statut: "Actif",
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
        },
        { 
          id: '3', 
          nom: "Fatima Zahra", 
          niveau: "M2", 
          specialite: "MIC", 
          email: "fatima@uns.edu.sn", 
          telephone: "0634567890",
          groupe: "Groupe A",
          competences: ["Angular", "Spring"],
          statut: "Archivé",
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
        },
        { 
          id: '4', 
          nom: "Karim Belkacem", 
          niveau: "L2", 
          specialite: "MIC", 
          email: "karim@uns.edu.sn", 
          telephone: "0645678901",
          groupe: "Groupe C",
          competences: ["Python", "Django"],
          statut: "Actif",
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg"
        },
        { 
          id: '5', 
          nom: "Leila Ndiaye", 
          niveau: "L1", 
          specialite: "CD", 
          email: "leila@uns.edu.sn", 
          telephone: "0656789012",
          groupe: "Groupe B",
          competences: ["Java", "Spring"],
          statut: "Actif",
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg"
        },
        { 
          id: '6', 
          nom: "Moussa Diop", 
          niveau: "L3", 
          specialite: "IDA", 
          email: "moussa@uns.edu.sn", 
          telephone: "0667890123",
          groupe: "Groupe C",
          competences: ["JavaScript", "TypeScript"],
          statut: "Actif",
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-11.jpg"
        },
        { 
          id: '7', 
          nom: "Aminata Sow", 
          niveau: "M1", 
          specialite: "CD", 
          email: "aminata@uns.edu.sn", 
          telephone: "0678901234",
          groupe: "Groupe A",
          competences: ["UX/UI Design", "Figma"],
          statut: "Actif",
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-13.jpg"
        },
      ];
      setEtudiants(defaultEtudiants);
    }
  }, []);

  // Sauvegarder les étudiants dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('etudiants', JSON.stringify(etudiants));
  }, [etudiants]);

  // Gestion de l'upload d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Filtrer les étudiants
  const filteredEtudiants = etudiants.filter(e => 
    (niveau === 'Tous les niveaux' || e.niveau === niveau) &&
    (specialite === 'Toutes les spécialités' || e.specialite === specialite) &&
    (groupe === 'Tous les groupes' || e.groupe === groupe) &&
    (e.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
     e.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredEtudiants.length);
  const etudiantsToShow = filteredEtudiants.slice(startIndex, endIndex);

  // Gestion CRUD des étudiants
  const handleAddOrUpdateEtudiant = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const nom = formData.get('nom') as string;
    const email = formData.get('email') as string;
    const niveau = formData.get('niveau') as string;
    const specialite = formData.get('specialite') as string;
    const groupe = formData.get('groupe') as string;
    const telephone = formData.get('telephone') as string;
    
    // Validation de l'email
    if (!email.endsWith('@uns.edu.sn')) {
      alert("L'email doit être du format etudiant@uns.edu.sn");
      return;
    }
    
    const imageUrl = imagePreview || editingEtudiant?.imageUrl || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg";
    
    if (editingEtudiant) {
      // Mise à jour de l'étudiant existant
      setEtudiants(etudiants.map(e => 
        e.id === editingEtudiant.id ? { 
          ...e, 
          nom, 
          email, 
          niveau, 
          specialite, 
          groupe,
          telephone,
          imageUrl
        } : e
      ));
    } else {
      // Ajout d'un nouvel étudiant
      const newEtudiant: Etudiant = {
        id: Date.now().toString(),
        nom,
        email,
        niveau,
        specialite,
        groupe,
        telephone,
        competences: [],
        statut: "Actif",
        imageUrl
      };
      setEtudiants([...etudiants, newEtudiant]);
    }
    
    setModalOpen(false);
    setEditingEtudiant(null);
    setImagePreview(null);
  };

  const handleEditEtudiant = (etudiant: Etudiant) => {
    setEditingEtudiant(etudiant);
    setImagePreview(null);
    setModalOpen(true);
  };

  const handleDeleteEtudiant = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      setEtudiants(etudiants.filter(e => e.id !== id));
    }
  };

  // Réinitialiser le formulaire quand le modal est fermé
  useEffect(() => {
    if (!modalOpen) {
      setEditingEtudiant(null);
      setImagePreview(null);
    } else if (editingEtudiant) {
      setImagePreview(editingEtudiant.imageUrl);
    }
  }, [modalOpen, editingEtudiant]);

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
            <div className="p-4 sm:p-6 border-b border-indigo-600">
              <h2 className="text-xl font-bold">IDA - Filière</h2>
              <p className="text-blue-200 text-sm mt-1">Responsable de Filière</p>
            </div>
            <nav className="flex-1 px-2 py-4">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center rounded-lg px-4 sm:px-6 py-3 text-blue-200 hover:bg-indigo-700 hover:text-white ${
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
            <div className="p-4 border-t border-indigo-600">
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
          {/* Header */}
          <header className="bg-white border-b border-gray-300 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {/* Bouton hamburger visible uniquement sur mobile */}
                <button 
                  onClick={toggleSidebar}
                  className="md:hidden text-gray-500 hover:text-gray-700"
                >
                  <i className="fa-solid fa-bars"></i>
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Étudiants</h1>
                  <p className="text-gray-600 text-sm">Formation Développement Web & Mobile</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    setEditingEtudiant(null);
                    setModalOpen(true);
                  }}
                  className="bg-indigo-800 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-900 transition-colors flex items-center justify-center w-full sm:w-auto"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  <span className="text-sm sm:text-base">Ajouter Étudiant</span>
                </button>
                <img 
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                  alt="Profile" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hidden sm:block" 
                />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres et Recherche</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                  >
                    <option>Tous les niveaux</option>
                    <option>L1</option>
                    <option>L2</option>
                    <option>L3</option>
                    <option>M1</option>
                    <option>M2</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                    value={specialite}
                    onChange={(e) => setSpecialite(e.target.value)}
                  >
                    <option>Toutes les spécialités</option>
                    <option>IDA</option>
                    <option>MIC</option>
                    <option>CD</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promotion</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                    value={promotion}
                    onChange={(e) => setPromotion(e.target.value)}
                  >
                    <option>2025-2026</option>
                    <option>2024-2025</option>
                    <option>2023-2024</option>
                    <option>2022-2023</option>
                    <option>2021-2022</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Groupe</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                    value={groupe}
                    onChange={(e) => setGroupe(e.target.value)}
                  >
                    <option>Tous les groupes</option>
                    <option>Groupe A</option>
                    <option>Groupe B</option>
                    <option>Groupe C</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                  <input
                    type="text"
                    placeholder="Nom ou email..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Liste des Étudiants</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{filteredEtudiants.length} étudiants</span>
                    <button className="text-indigo-800 hover:text-indigo-900">
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">Étudiant</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">Niveau</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">Spécialité</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">Groupe</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">Compétences</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">Statut</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-300">
                    {etudiantsToShow.map((etudiant) => (
                      <tr key={etudiant.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap border-b border-gray-300">
                          <div className="flex items-center">
                            <img 
                              src={etudiant.imageUrl} 
                              alt="Student" 
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3" 
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{etudiant.nom}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{etudiant.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap border-b border-gray-300">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            etudiant.niveau === 'L1' ? 'bg-blue-100 text-blue-800' :
                            etudiant.niveau === 'L2' ? 'bg-purple-100 text-purple-800' :
                            etudiant.niveau === 'L3' ? 'bg-indigo-100 text-indigo-800' :
                            etudiant.niveau === 'M1' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {etudiant.niveau}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300">
                          {etudiant.specialite}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-300">
                          {etudiant.groupe}
                        </td>
                        <td className="px-4 sm:px-6 py-4 border-b border-gray-300">
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {etudiant.competences.map((competence, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                              >
                                {competence}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap border-b border-gray-300">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            etudiant.statut === 'Actif' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {etudiant.statut}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium border-b border-gray-300">
                          <div className="flex space-x-2">
                            <button 
                              className="text-indigo-800 hover:text-indigo-900"
                              onClick={() => handleEditEtudiant(etudiant)}
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteEtudiant(etudiant.id)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4 border-t border-gray-300">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Affichage de {startIndex + 1} à {endIndex} sur {filteredEtudiants.length} résultats
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button 
                      className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    
                    {totalPages <= 5 ? (
                      Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === page 
                              ? 'bg-indigo-800 text-white' 
                              : 'border border-gray-300 text-gray-700'
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))
                    ) : (
                      <>
                        {currentPage > 2 && (
                          <button
                            className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700"
                            onClick={() => setCurrentPage(1)}
                          >
                            1
                          </button>
                        )}
                        {currentPage > 3 && <span className="px-2 py-1">...</span>}
                        {[
                          currentPage - 1,
                          currentPage,
                          currentPage + 1
                        ].filter(page => page >= 1 && page <= totalPages).map(page => (
                          <button
                            key={page}
                            className={`px-3 py-1 rounded text-sm ${
                              currentPage === page 
                                ? 'bg-indigo-800 text-white' 
                                : 'border border-gray-300 text-gray-700'
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ))}
                        {currentPage < totalPages - 2 && <span className="px-2 py-1">...</span>}
                        {currentPage < totalPages - 1 && (
                          <button
                            className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700"
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </button>
                        )}
                      </>
                    )}
                    
                    <button 
                      className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

        {/* Add/Edit Student Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4 border border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingEtudiant ? 'Modifier Étudiant' : 'Ajouter un Étudiant'}
              </h3>
              <form className="space-y-4" onSubmit={handleAddOrUpdateEtudiant}>
                <div className="flex justify-center">
                  <div className="relative">
                    <div 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
                      onClick={triggerFileInput}
                    >
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <i className="fa-solid fa-user text-gray-400 text-2xl sm:text-3xl"></i>
                        </div>
                      )}
                    </div>
                    <button 
                      type="button"
                      className="absolute bottom-0 right-0 bg-indigo-800 text-white rounded-full p-1 hover:bg-indigo-900"
                      onClick={triggerFileInput}
                    >
                      <i className="fa-solid fa-camera text-xs"></i>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet*</label>
                  <input 
                    type="text" 
                    name="nom"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                    placeholder="Ex: Ahmed Benali"
                    required
                    defaultValue={editingEtudiant?.nom || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                    placeholder="Ex: etudiant@uns.edu.sn"
                    required
                    defaultValue={editingEtudiant?.email || ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">Doit être du format @uns.edu.sn</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau*</label>
                    <select 
                      name="niveau"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                      required
                      defaultValue={editingEtudiant?.niveau || ''}
                    >
                      <option value="">Sélectionner</option>
                      <option>L1</option>
                      <option>L2</option>
                      <option>L3</option>
                      <option>M1</option>
                      <option>M2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité*</label>
                    <select 
                      name="specialite"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                      required
                      defaultValue={editingEtudiant?.specialite || ''}
                    >
                      <option value="">Sélectionner</option>
                      <option>IDA</option>
                      <option>MIC</option>
                      <option>CD</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Groupe*</label>
                    <select 
                      name="groupe"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                      required
                      defaultValue={editingEtudiant?.groupe || ''}
                    >
                      <option value="">Sélectionner</option>
                      <option>Groupe A</option>
                      <option>Groupe B</option>
                      <option>Groupe C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone*</label>
                    <input 
                      type="tel" 
                      name="telephone"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-800 focus:border-transparent text-sm sm:text-base"
                      placeholder="Ex: 771234567"
                      required
                      defaultValue={editingEtudiant?.telephone || ''}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
                  <button 
                    type="button" 
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                    onClick={() => setModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="px-3 sm:px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-900 text-sm sm:text-base"
                  >
                    {editingEtudiant ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}