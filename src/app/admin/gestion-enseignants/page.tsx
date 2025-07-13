'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/context/AuthContext';

const STORAGE_KEY = 'enseignants-data';

interface Enseignant {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  filiere: string;
  niveaux: string[];
  status: string;
  email: string;
  telephone: string;
  avatar: string;
}

const GestionEnseignants = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const navItems = [
    { 
      id: 'dashboard',
      name: 'Tableau de Bord',
      icon: 'fa-solid fa-chart-line',
      path: '/admin'
    },
    { 
      id: 'responsables',
      name: 'Gestion Responsables',
      icon: 'fa-solid fa-users-gear',
      path: '/admin/gestion-responsables'
    },
    { 
      id: 'enseignants',
      name: 'Gestion Enseignants',
      icon: 'fa-solid fa-chalkboard-user',
      path: '/admin/gestion-enseignants'
    },
    { 
      id: 'etudiants',
      name: 'Gestion Étudiants',
      icon: 'fa-solid fa-graduation-cap',
      path: '/admin/gestion-etudiants'
    },
    { 
      id: 'filieres',
      name: 'Gestion Filières',
      icon: 'fa-solid fa-sitemap',
      path: '/admin/gestion-filieres'
    },
    { 
      id: 'deliberations',
      name: 'Délibérations',
      icon: 'fa-solid fa-clipboard-check',
      path: '/admin/deliberations'
    }
  ];

  // États
  const [filiere, setFiliere] = useState('Toutes');
  const [statut, setStatut] = useState('Tous');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Chargement initial des données
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          setEnseignants(parsedData);
          setIsInitialized(true);
          return;
        }
      } catch (error) {
        console.error('Error parsing enseignants data:', error);
      }
    }
    
    if (!isInitialized) {
      const initialData: Enseignant[] = [
        { 
          id: 1, 
          matricule: 'ENS2023001', 
          nom: 'Diallo', 
          prenom: 'Aminata', 
          filiere: 'IDA', 
          niveaux: ['L1', 'L2', 'M1'], 
          status: 'Actif',
          email: 'aminata.diallo@uns.sn',
          telephone: '+221 77 123 4567',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg'
        },
        { 
          id: 2, 
          matricule: 'ENS2023002', 
          nom: 'Sow', 
          prenom: 'Moussa', 
          filiere: 'MIC', 
          niveaux: ['L2', 'L3', 'M2'], 
          status: 'Actif',
          email: 'moussa.sow@uns.sn',
          telephone: '+221 77 234 5678',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
        },
        { 
          id: 3, 
          matricule: 'ENS2023003', 
          nom: 'Ndiaye', 
          prenom: 'Fatou', 
          filiere: 'CD', 
          niveaux: ['M1', 'M2'], 
          status: 'Inactif',
          email: 'fatou.ndiaye@uns.sn',
          telephone: '+221 77 345 6789',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
        },
        { 
          id: 4, 
          matricule: 'ENS2023004', 
          nom: 'Kane', 
          prenom: 'Ibrahima', 
          filiere: 'IDA', 
          niveaux: ['L3', 'M1'], 
          status: 'Actif',
          email: 'ibrahima.kane@uns.sn',
          telephone: '+221 77 456 7890',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg'
        },
        { 
          id: 5, 
          matricule: 'ENS2023005', 
          nom: 'Gueye', 
          prenom: 'Rokhaya', 
          filiere: 'MIC', 
          niveaux: ['L1', 'M2'], 
          status: 'Inactif',
          email: 'rokhaya.gueye@uns.sn',
          telephone: '+221 77 567 8901',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg'
        }
      ];
      setEnseignants(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Sauvegarde des données
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enseignants));
    }
  }, [enseignants, isInitialized]);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    filiere: '',
    niveaux: [] as string[],
    dateDebut: '',
    dateFin: '',
    status: 'Actif',
    avatar: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filtrage des enseignants
  const filteredEnseignants = enseignants.filter((enseignant) => {
    const matchesSearch = search === '' || 
      enseignant.nom.toLowerCase().includes(search.toLowerCase()) || 
      enseignant.prenom.toLowerCase().includes(search.toLowerCase()) || 
      enseignant.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesFiliere = filiere === 'Toutes' || enseignant.filiere === filiere;
    const matchesStatut = statut === 'Tous' || enseignant.status === statut;
    
    return matchesSearch && matchesFiliere && matchesStatut;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnseignants = filteredEnseignants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnseignants.length / itemsPerPage);

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion de l'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion des niveaux sélectionnés
  const handleNiveauChange = (niveau: string) => {
    setFormData(prev => {
      const niveaux = prev.niveaux.includes(niveau)
        ? prev.niveaux.filter(n => n !== niveau)
        : [...prev.niveaux, niveau];
      
      return { ...prev, niveaux };
    });
  };

  // Gestion de l'édition d'un enseignant
  const handleEdit = (id: number) => {
    const enseignant = enseignants.find(e => e.id === id);
    if (enseignant) {
      setFormData({
        nom: enseignant.nom,
        prenom: enseignant.prenom,
        email: enseignant.email,
        password: '',
        telephone: enseignant.telephone,
        filiere: enseignant.filiere,
        niveaux: enseignant.niveaux,
        dateDebut: '2023-01-01',
        dateFin: '',
        status: enseignant.status,
        avatar: enseignant.avatar
      });
      setImagePreview(enseignant.avatar);
      setEditingId(id);
      setIsEditing(true);
      setShowForm(true);
      setViewingId(null);
    }
  };

  // Gestion de la suppression d'un enseignant
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      setViewingId(null);
      setIsEditing(false);
      setShowForm(false);
      setEditingId(null);
      
      setTimeout(() => {
        setEnseignants(prevEnseignants => {
          const updatedEnseignants = prevEnseignants.filter(e => e.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEnseignants));
          const newTotalPages = Math.ceil(updatedEnseignants.length / itemsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }
          return updatedEnseignants;
        });
      }, 50);
    }
  };

  // Gestion de la vue détaillée
  const handleView = (id: number) => {
    setViewingId(id);
    setShowForm(false);
    setSidebarOpen(false);
  };

  // Réinitialisation du formulaire
  const resetForm = useCallback(() => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      telephone: '',
      filiere: '',
      niveaux: [],
      dateDebut: '',
      dateFin: '',
      status: 'Actif',
      avatar: ''
    });
    setImagePreview(null);
    setEditingId(null);
    setIsEditing(false);
    setShowForm(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let avatarUrl = formData.avatar || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg';
    
    if (isEditing && editingId !== null) {
      setEnseignants(prev => prev.map(e => 
        e.id === editingId ? {
          ...e,
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          filiere: formData.filiere,
          niveaux: formData.niveaux,
          status: formData.status,
          avatar: avatarUrl
        } : e
      ));
      alert('Enseignant modifié avec succès !');
    } else {
      const newId = enseignants.length > 0 ? Math.max(...enseignants.map(e => e.id)) + 1 : 1;
      
      const newEnseignant: Enseignant = {
        id: newId,
        matricule: `ENS${new Date().getFullYear()}${newId.toString().padStart(3, '0')}`,
        nom: formData.nom,
        prenom: formData.prenom,
        filiere: formData.filiere,
        niveaux: formData.niveaux,
        status: formData.status,
        email: formData.email,
        telephone: formData.telephone,
        avatar: avatarUrl
      };
      
      setEnseignants(prev => [...prev, newEnseignant]);
      alert('Enseignant ajouté avec succès !');
    }
    
    resetForm();
  };

  // Pagination précédente
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pagination suivante
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Gestion du changement de page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Générer les numéros de page
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Trouver l'enseignant en cours de visualisation
  const viewingEnseignant = viewingId 
    ? enseignants.find(e => e.id === viewingId) 
    : null;

  return (
    <RouteGuard roles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Overlay pour la sidebar mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e40af] text-white flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6 border-b border-[#3b82f6]">
            <h1 className="text-xl font-bold">Administrateur Général de l'Université</h1>
            <p className="text-blue-200 text-sm">Université Numérique du Sénégal</p>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-[#3b82f6] text-white'
                        : 'hover:bg-[#3b82f6]'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className={`${item.icon} mr-3`}></i>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-[#3b82f6]">
            <div className="flex items-center">
              <img 
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                alt="Admin" 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">Admin Général</p>
                <p className="text-sm text-blue-200">admin@uns.edu.sn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Menu Button */}
          <div className="md:hidden p-4 bg-[#1e40af] text-white flex justify-between items-center">
            <button 
              className="text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <h1 className="text-lg font-bold">Gestion Enseignants</h1>
            <div className="w-8"></div> {/* Spacer */}
          </div>

          {/* Header */}
          <header className="bg-white shadow-sm border-b p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Enseignants</h2>
              <button 
                className="bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors flex items-center"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                  setSidebarOpen(false);
                }}
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Ajouter un Enseignant
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-4 md:p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Partie 1: Liste des enseignants */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 md:p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Liste des Enseignants</h3>
                  <div className="flex flex-col gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <select
                        value={filiere}
                        onChange={(e) => setFiliere(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                      >
                        <option value="Toutes">Toutes les filières</option>
                        <option value="IDA">IDA</option>
                        <option value="MIC">MIC</option>
                        <option value="CD">CD</option>
                      </select>
                      <select
                        value={statut}
                        onChange={(e) => setStatut(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                      >
                        <option value="Tous">Tous les statuts</option>
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Vue Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Enseignant</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Filière & Niveaux</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentEnseignants.map((enseignant) => (
                        <tr key={enseignant.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center cursor-pointer" onClick={() => handleView(enseignant.id)}>
                              <img 
                                src={enseignant.avatar} 
                                alt="Avatar" 
                                className="w-10 h-10 rounded-full mr-3 object-cover" 
                              />
                              <div>
                                <p className="font-medium text-gray-900">{enseignant.prenom} {enseignant.nom}</p>
                                <p className="text-sm text-gray-500">{enseignant.email}</p>
                                <p className="text-sm text-gray-500">{enseignant.telephone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              enseignant.filiere === 'IDA' ? 'bg-blue-100 text-blue-800' :
                              enseignant.filiere === 'MIC' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {enseignant.filiere}
                            </span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {enseignant.niveaux.map((n) => (
                                <span key={n} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                  {n}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              enseignant.status === 'Actif' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {enseignant.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleView(enseignant.id)}
                                title="Voir détails"
                              >
                                <i className="fa-solid fa-eye"></i>
                              </button>
                              <button 
                                className="text-[#1e40af] hover:text-[#1e3a8a]"
                                onClick={() => handleEdit(enseignant.id)}
                                title="Modifier"
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDelete(enseignant.id)}
                                title="Supprimer"
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
                
                {/* Vue Mobile */}
                <div className="md:hidden">
                  {currentEnseignants.map((enseignant) => (
                    <div key={enseignant.id} className="border-b p-4 hover:bg-gray-50">
                      <div className="flex items-center cursor-pointer mb-3" onClick={() => handleView(enseignant.id)}>
                        <img 
                          src={enseignant.avatar} 
                          alt="Avatar" 
                          className="w-12 h-12 rounded-full mr-3 object-cover" 
                        />
                        <div>
                          <p className="font-medium text-gray-900">{enseignant.prenom} {enseignant.nom}</p>
                          <p className="text-sm text-gray-500">{enseignant.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Téléphone</p>
                          <p className="text-sm">{enseignant.telephone}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500">Filière</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            enseignant.filiere === 'IDA' ? 'bg-blue-100 text-blue-800' :
                            enseignant.filiere === 'MIC' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {enseignant.filiere}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500">Niveaux</p>
                          <div className="flex flex-wrap gap-1">
                            {enseignant.niveaux.map((n) => (
                              <span key={n} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500">Statut</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            enseignant.status === 'Actif' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {enseignant.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-2 border-t">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleView(enseignant.id)}
                          title="Voir détails"
                        >
                          <i className="fa-solid fa-eye mr-1"></i> Voir
                        </button>
                        <button 
                          className="text-[#1e40af] hover:text-[#1e3a8a]"
                          onClick={() => handleEdit(enseignant.id)}
                          title="Modifier"
                        >
                          <i className="fa-solid fa-edit mr-1"></i> Modifier
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(enseignant.id)}
                          title="Supprimer"
                        >
                          <i className="fa-solid fa-trash mr-1"></i> Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEnseignants.length)} sur {filteredEnseignants.length} enseignants
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button 
                      className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    
                    <div className="flex flex-wrap gap-1">
                      {pageNumbers.map(number => (
                        <button
                          key={number}
                          className={`px-3 py-1 border rounded ${
                            currentPage === number 
                              ? 'bg-[#1e40af] text-white' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => goToPage(number)}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>

              {/* Partie 2: Formulaire */}
              {showForm ? (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4 md:p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {isEditing ? 'Modifier un Enseignant' : 'Ajouter un Enseignant'}
                    </h3>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img 
                          src={imagePreview || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg"} 
                          alt="Preview" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-[#1e40af]"
                        />
                        <label 
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer"
                          title="Changer l'image"
                        >
                          <i className="fa-solid fa-camera text-[#1e40af]"></i>
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          ref={fileInputRef}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Cliquez sur l'icône pour changer la photo</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                        <input
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Professionnel</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de Passe</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                        required={!isEditing}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filière Associée</label>
                      <select
                        name="filiere"
                        value={formData.filiere}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                        required
                      >
                        <option value="">Sélectionner une filière</option>
                        <option value="IDA">IDA</option>
                        <option value="MIC">MIC</option>
                        <option value="CD">CD</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Niveaux enseignés</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['L1', 'L2', 'L3', 'M1', 'M2'].map((niv) => (
                          <label key={niv} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.niveaux.includes(niv)}
                              onChange={() => handleNiveauChange(niv)}
                              className="mr-2 h-4 w-4 text-[#1e40af] focus:ring-[#1e40af] border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{niv}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date de Début</label>
                        <input
                          type="date"
                          name="dateDebut"
                          value={formData.dateDebut}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date de Fin (Optionnel)</label>
                        <input
                          type="date"
                          name="dateFin"
                          value={formData.dateFin}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                      >
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button 
                        type="submit"
                        className="bg-[#1e40af] text-white px-6 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors flex-1 flex justify-center items-center"
                      >
                        <i className="fa-solid fa-save mr-2"></i>
                        Enregistrer
                      </button>
                      <button 
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex-1"
                      >
                        <i className="fa-solid fa-times mr-2"></i>
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border flex items-center justify-center">
                  <div className="text-center p-8 md:p-12">
                    <i className="fa-solid fa-chalkboard-user text-5xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {isEditing ? 'Modification' : 'Ajout'} d'un enseignant
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Cliquez sur "Ajouter un enseignant" pour commencer à créer un nouveau profil
                    </p>
                    <button 
                      className="bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors flex items-center mx-auto"
                      onClick={() => {
                        resetForm();
                        setShowForm(true);
                      }}
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Ajouter un Enseignant
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modale de détails */}
      {viewingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
             onClick={() => setViewingId(null)}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto" 
               onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Détails de l'enseignant</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setViewingId(null)}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              
              {viewingEnseignant ? (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 flex justify-center">
                    <img 
                      src={viewingEnseignant.avatar} 
                      alt="Avatar" 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#1e40af]"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Matricule</p>
                        <p className="font-medium">{viewingEnseignant.matricule}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">{viewingEnseignant.prenom} {viewingEnseignant.nom}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Filière</p>
                        <p className="font-medium">{viewingEnseignant.filiere}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Statut</p>
                        <p className="font-medium">{viewingEnseignant.status}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{viewingEnseignant.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{viewingEnseignant.telephone}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Niveaux enseignés</p>
                        <p className="font-medium">{viewingEnseignant.niveaux.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Les informations de l'enseignant ne sont plus disponibles</p>
                  <button 
                    className="mt-4 bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a]"
                    onClick={() => setViewingId(null)}
                  >
                    Fermer
                  </button>
                </div>
              )}
              
              {viewingEnseignant && (
                <div className="mt-6 flex justify-end">
                  <button 
                    className="bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a]"
                    onClick={() => {
                      setViewingId(null);
                      handleEdit(viewingEnseignant.id);
                    }}
                  >
                    <i className="fa-solid fa-edit mr-2"></i>
                    Modifier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </RouteGuard>
  );
};

export default GestionEnseignants;