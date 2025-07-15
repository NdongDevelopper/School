'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/context/AuthContext';

const STORAGE_KEY = 'etudiants-data';

interface Etudiant {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  filiere: string;
  niveau: string;
  status: string;
  email: string;
  telephone: string;
  dateInscription: string;
  avatar: string;
}

const GestionEtudiants = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [niveau, setNiveau] = useState('Tous');
  const [statut, setStatut] = useState('Tous');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingEtudiant, setViewingEtudiant] = useState<Etudiant | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          setEtudiants(parsedData);
          setIsInitialized(true);
          return;
        }
      } catch (error) {
        console.error('Error parsing etudiants data:', error);
      }
    }

    if (!isInitialized) {
      const initialData: Etudiant[] = [
        {
          id: 1,
          matricule: 'ETU2023001',
          nom: 'Diop',
          prenom: 'Mamadou',
          filiere: 'IDA',
          niveau: 'L1',
          status: 'Actif',
          email: 'mamadou.diop@uns.sn',
          telephone: '+221 77 111 2222',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
          dateInscription: '2023-09-15'
        },
        {
          id: 2,
          matricule: 'ETU2023002',
          nom: 'Niang',
          prenom: 'Aïssatou',
          filiere: 'MIC',
          niveau: 'L2',
          status: 'Actif',
          email: 'aissatou.niang@uns.sn',
          telephone: '+221 77 222 3333',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
          dateInscription: '2023-09-20'
        },
        {
          id: 3,
          matricule: 'ETU2023003',
          nom: 'Gueye',
          prenom: 'Abdoulaye',
          filiere: 'CD',
          niveau: 'M1',
          status: 'Inactif',
          email: 'abdoulaye.gueye@uns.sn',
          telephone: '+221 77 333 4444',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg',
          dateInscription: '2023-09-25'
        },
        {
          id: 4,
          matricule: 'ETU2023004',
          nom: 'Sarr',
          prenom: 'Fatim',
          filiere: 'IDA',
          niveau: 'L3',
          status: 'Actif',
          email: 'fatim.sarr@uns.sn',
          telephone: '+221 77 444 5555',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
          dateInscription: '2023-10-05'
        },
        {
          id: 5,
          matricule: 'ETU2023005',
          nom: 'Fall',
          prenom: 'Marième',
          filiere: 'MIC',
          niveau: 'M2',
          status: 'Actif',
          email: 'marieme.fall@uns.sn',
          telephone: '+221 77 555 6666',
          avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-10.jpg',
          dateInscription: '2023-10-10'
        }
      ];
      setEtudiants(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Sauvegarde des données
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(etudiants));
    }
  }, [etudiants, isInitialized]);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    filiere: '',
    niveau: '',
    dateInscription: '',
    status: 'Actif',
    avatar: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filtrage des étudiants
  const filteredEtudiants = etudiants.filter((etudiant) => {
    const matchesSearch = search === '' ||
      etudiant.nom.toLowerCase().includes(search.toLowerCase()) ||
      etudiant.prenom.toLowerCase().includes(search.toLowerCase()) ||
      etudiant.email.toLowerCase().includes(search.toLowerCase());

    const matchesFiliere = filiere === 'Toutes' || etudiant.filiere === filiere;
    const matchesNiveau = niveau === 'Tous' || etudiant.niveau === niveau;
    const matchesStatut = statut === 'Tous' || etudiant.status === statut;

    return matchesSearch && matchesFiliere && matchesNiveau && matchesStatut;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEtudiants = filteredEtudiants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion de l'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion de l'édition d'un étudiant
  const handleEdit = (id: number) => {
    const etudiant = etudiants.find(e => e.id === id);
    if (etudiant) {
      setFormData({
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        password: '',
        telephone: etudiant.telephone,
        filiere: etudiant.filiere,
        niveau: etudiant.niveau,
        dateInscription: etudiant.dateInscription,
        status: etudiant.status,
        avatar: etudiant.avatar
      });
      setImagePreview(etudiant.avatar);
      setEditingId(id);
      setIsEditing(true);
      setShowForm(true);
      setViewingEtudiant(null); // Close view when editing
    }
  };

  // Gestion de la suppression d'un étudiant
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      // --- CORRECTION APPLIQUÉE ICI ---
      // Reset any related UI states first to prevent conflicts during reconciliation
      setViewingEtudiant(null);
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      // --- FIN DE LA CORRECTION ---

      const updatedEtudiants = etudiants.filter(e => e.id !== id);
      setEtudiants(updatedEtudiants);

      // Réajuster la pagination
      const newTotalPages = Math.ceil(updatedEtudiants.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) { // Ensure newTotalPages is not 0 before setting
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1); // If no students left, go to page 1
      }
    }
  };

  // Gestion de la vue détaillée
  const handleView = (id: number) => {
    const etudiant = etudiants.find(e => e.id === id);
    if (etudiant) {
      setViewingEtudiant(etudiant);
      setShowForm(false); // Close form when viewing
      setSidebarOpen(false); // Close sidebar on mobile when viewing
    }
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      telephone: '',
      filiere: '',
      niveau: '',
      dateInscription: '',
      status: 'Actif',
      avatar: ''
    });
    setImagePreview(null);
    setEditingId(null);
    setIsEditing(false);
    setShowForm(false);
    setViewingEtudiant(null); // Ensure view is also closed

    // Réinitialiser l'input fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Utiliser l'image preview comme URL d'avatar
    let avatarUrl = formData.avatar || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg';

    if (isEditing && editingId !== null) {
      // Mise à jour de l'étudiant existant
      const updatedEtudiants = etudiants.map(e =>
        e.id === editingId ? {
          ...e,
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          filiere: formData.filiere,
          niveau: formData.niveau,
          dateInscription: formData.dateInscription,
          status: formData.status,
          avatar: avatarUrl
        } : e
      );
      setEtudiants(updatedEtudiants);
      alert('Étudiant modifié avec succès !');
    } else {
      // Ajout d'un nouvel étudiant
      const newId = etudiants.length > 0 ? Math.max(...etudiants.map(e => e.id)) + 1 : 1;

      const newEtudiant: Etudiant = {
        id: newId,
        matricule: `ETU${new Date().getFullYear()}${newId.toString().padStart(3, '0')}`,
        nom: formData.nom,
        prenom: formData.prenom,
        filiere: formData.filiere,
        niveau: formData.niveau,
        status: formData.status,
        email: formData.email,
        telephone: formData.telephone,
        dateInscription: formData.dateInscription,
        avatar: avatarUrl
      };

      setEtudiants([...etudiants, newEtudiant]);
      alert('Étudiant ajouté avec succès !');
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

  // Générer les numéros de page
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Go to specific page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <RouteGuard roles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar - Responsive */}
        <div
          className={`fixed left-0 top-0 h-full w-64 bg-[#1e40af] text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 border-b border-[#3b82f6] flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Administrateur Général de l'Université</h1>
              <p className="text-blue-200 text-sm">Université Numérique du Sénégal</p>
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fa-solid fa-times"></i>
            </button>
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
                <p className="text-sm text-blue-200">admin@uns.sn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm border-b p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  className="md:hidden text-gray-500 hover:text-gray-700 mr-4"
                  onClick={() => setSidebarOpen(true)}
                >
                  <i className="fa-solid fa-bars text-xl"></i>
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Étudiants</h2>
              </div>
              <button
                className="bg-[#1e40af] text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors flex items-center text-sm md:text-base"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                  setSidebarOpen(false); // Close sidebar when opening form on mobile
                }}
              >
                <i className="fa-solid fa-plus mr-1 md:mr-2"></i>
                <span className="hidden sm:inline">Ajouter un Étudiant</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Partie 1: Liste des étudiants */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 md:p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Liste des Étudiants</h3>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm md:text-base"
                    />
                    <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
                      <select
                        value={filiere}
                        onChange={(e) => setFiliere(e.target.value)}
                        className="px-2 py-2 md:px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm md:text-base"
                      >
                        <option value="Toutes">Toutes filières</option>
                        <option value="IDA">IDA</option>
                        <option value="MIC">MIC</option>
                        <option value="CD">CD</option>
                      </select>
                      <select
                        value={niveau}
                        onChange={(e) => setNiveau(e.target.value)}
                        className="px-2 py-2 md:px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm md:text-base"
                      >
                        <option value="Tous">Tous niveaux</option>
                        <option value="L1">L1</option>
                        <option value="L2">L2</option>
                        <option value="L3">L3</option>
                        <option value="M1">M1</option>
                        <option value="M2">M2</option>
                      </select>

                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-500">Étudiant</th>
                        <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-500">Filière & Niveau</th>
                        <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-500">Statut</th>
                        <th className="px-2 md:px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentEtudiants.map((etudiant) => (
                        <tr key={etudiant.id} className="hover:bg-gray-50">
                          <td className="px-2 md:px-4 py-3">
                            <div className="flex items-center cursor-pointer" onClick={() => handleView(etudiant.id)}>
                              <img
                                src={etudiant.avatar}
                                alt="Avatar"
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-2 md:mr-3 object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900 text-xs md:text-sm">{etudiant.prenom} {etudiant.nom}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">{etudiant.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              etudiant.filiere === 'IDA' ? 'bg-blue-100 text-blue-800' :
                                etudiant.filiere === 'MIC' ? 'bg-purple-100 text-purple-800' :
                                  'bg-orange-100 text-orange-800'
                            }`}>
                              {etudiant.filiere}
                            </span>
                            <div className="mt-1">
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                {etudiant.niveau}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              etudiant.status === 'Actif'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {etudiant.status}
                            </span>
                          </td>
                          <td className="px-2 md:px-4 py-3">
                            <div className="flex gap-1 md:gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 p-1"
                                onClick={() => handleView(etudiant.id)}
                                title="Voir détails"
                              >
                                <i className="fa-solid fa-eye text-xs md:text-base"></i>
                              </button>
                              <button
                                className="text-[#1e40af] hover:text-[#1e3a8a] p-1"
                                onClick={() => handleEdit(etudiant.id)}
                                title="Modifier"
                              >
                                <i className="fa-solid fa-edit text-xs md:text-base"></i>
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 p-1"
                                onClick={() => handleDelete(etudiant.id)}
                                title="Supprimer"
                              >
                                <i className="fa-solid fa-trash text-xs md:text-base"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 md:p-4 border-t flex flex-col sm:flex-row justify-between items-center">
                  <span className="text-xs md:text-sm text-gray-500 mb-2 sm:mb-0">
                    Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEtudiants.length)} sur {filteredEtudiants.length} étudiants
                  </span>
                  <div className="flex gap-2">
                    <button
                      className={`px-2 py-1 text-xs md:text-sm border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => goToPage(number)}
                        className={`px-2 py-1 text-xs md:text-sm border rounded ${
                          currentPage === number
                            ? 'bg-[#1e40af] text-white'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      className={`px-2 py-1 text-xs md:text-sm border rounded ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>

              {/* Partie 2: Formulaire ou Vue Détaillée */}
              {(showForm || viewingEtudiant) && (
                <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {showForm ? (isEditing ? 'Modifier l\'Étudiant' : 'Ajouter un Nouvel Étudiant') : 'Détails de l\'Étudiant'}
                  </h3>

                  {viewingEtudiant ? (
                    // Détails de l'étudiant
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <img
                          src={viewingEtudiant.avatar}
                          alt="Avatar de l'étudiant"
                          className="w-24 h-24 rounded-full object-cover mr-4 border-2 border-[#1e40af]"
                        />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{viewingEtudiant.prenom} {viewingEtudiant.nom}</p>
                          <p className="text-md text-gray-600">Matricule: {viewingEtudiant.matricule}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-gray-900">{viewingEtudiant.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Téléphone</p>
                          <p className="text-gray-900">{viewingEtudiant.telephone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Filière</p>
                          <span className={`px-2 py-1 text-sm rounded-full ${
                            viewingEtudiant.filiere === 'IDA' ? 'bg-blue-100 text-blue-800' :
                              viewingEtudiant.filiere === 'MIC' ? 'bg-purple-100 text-purple-800' :
                                'bg-orange-100 text-orange-800'
                          }`}>
                            {viewingEtudiant.filiere}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Niveau</p>
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                            {viewingEtudiant.niveau}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date d'inscription</p>
                          <p className="text-gray-900">{viewingEtudiant.dateInscription}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Statut</p>
                          <span className={`px-2 py-1 text-sm rounded-full ${
                            viewingEtudiant.status === 'Actif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {viewingEtudiant.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                          onClick={() => setViewingEtudiant(null)}
                        >
                          Fermer
                        </button>
                        <button
                          className="bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors"
                          onClick={() => handleEdit(viewingEtudiant.id)}
                        >
                          <i className="fa-solid fa-edit mr-2"></i>Modifier
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          onClick={() => handleDelete(viewingEtudiant.id)}
                        >
                          <i className="fa-solid fa-trash mr-2"></i>Supprimer
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Formulaire d'ajout/modification
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Avatar upload */}
                      <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar</label>
                        <div className="mt-1 flex items-center">
                          <img
                            src={imagePreview || formData.avatar || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg'}
                            alt="Aperçu de l'avatar"
                            className="w-20 h-20 rounded-full object-cover border border-gray-300 mr-4"
                          />
                          <input
                            type="file"
                            id="avatar"
                            name="avatar"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-[#e0e7ff] file:text-[#1e40af]
                              hover:file:bg-[#c7d2fe]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                          <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af] sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                          <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af] sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af] sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                          <input
                            type="tel"
                            id="telephone"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af] sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="filiere" className="block text-sm font-medium text-gray-700">Filière</label>
                          <select
                            id="filiere"
                            name="filiere"
                            value={formData.filiere}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af] sm:text-sm"
                          >
                            <option value="">Sélectionner une filière</option>
                            <option value="IDA">IDA (Informatique Développement d'Application)</option>
                            <option value="MIC">MIC (Multimédia Internet et Communication)</option>
                            <option value="CD">CD (Communication Digitale)</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">Niveau</label>
                          <select
                            id="niveau"
                            name="niveau"
                            value={formData.niveau}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af] sm:text-sm"
                          >
                            <option value="">Sélectionner un niveau</option>
                            <option value="L1">L1</option>
                            <option value="L2">L2</option>
                            <option value="L3">L3</option>
                            <option value="M1">M1</option>
                            <option value="M2">M2</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dateInscription" className="block text-sm font-medium text-gray-700">Date d'inscription</label>
                        <input
                          type="date"
                          id="dateInscription"
                          name="dateInscription"
                          value={formData.dateInscription}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af] sm:text-sm"
                        />
                      </div>

                      {/* Password field only for new users, not for editing */}
                      {!isEditing && (
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de Passe</label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isEditing} // Required only for new entries
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af] sm:text-sm"
                          />
                        </div>
                      )}

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1e40af] focus:border-[#1e40af] sm:text-sm"
                        >
                          <option value="Actif">Actif</option>
                          <option value="Inactif">Inactif</option>
                        </select>
                      </div>

                      <div className="flex space-x-3 mt-6">
                        <button
                          type="submit"
                          className="flex-1 bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors"
                        >
                          {isEditing ? 'Modifier l\'Étudiant' : 'Ajouter l\'Étudiant'}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default GestionEtudiants;