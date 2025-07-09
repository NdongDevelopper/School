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
      setViewingEtudiant(null);
    }
  };

  // Gestion de la suppression d'un étudiant
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      const updatedEtudiants = etudiants.filter(e => e.id !== id);
      setEtudiants(updatedEtudiants);
      
      // Réajuster la pagination
      const newTotalPages = Math.ceil(updatedEtudiants.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
      }
    }
  };

  // Gestion de la vue détaillée
  const handleView = (id: number) => {
    const etudiant = etudiants.find(e => e.id === id);
    if (etudiant) {
      setViewingEtudiant(etudiant);
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

  return (
    <RouteGuard roles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-[#1e40af] text-white flex flex-col">
          <div className="p-6 border-b border-[#3b82f6]">
            <h1 className="text-xl font-bold">Administrateur  Général de l'Université</h1>
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
        <div className="ml-64 flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gestion des Étudiants</h2>
              <button 
                className="bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors flex items-center"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Ajouter un Étudiant
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Partie 1: Liste des étudiants */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Liste des Étudiants</h3>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    />
                    <select
                      value={filiere}
                      onChange={(e) => setFiliere(e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    >
                      <option value="Toutes">Toutes les filières</option>
                      <option value="IDA">IDA</option>
                      <option value="MIC">MIC</option>
                      <option value="CD">CD</option>
                    </select>
                    {/* <select
                      value={niveau}
                      onChange={(e) => setNiveau(e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    >
                      <option value="Tous">Tous les niveaux</option>
                      <option value="L1">L1</option>
                      <option value="L2">L2</option>
                      <option value="L3">L3</option>
                      <option value="M1">M1</option>
                      <option value="M2">M2</option>
                    </select>
                    <select
                      value={statut}
                      onChange={(e) => setStatut(e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    >
                      <option value="Tous">Tous les statuts</option>
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select> */}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Étudiant</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Filière & Niveau</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentEtudiants.map((etudiant) => (
                        <tr key={etudiant.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center cursor-pointer" onClick={() => handleView(etudiant.id)}>
                              <img 
                                src={etudiant.avatar} 
                                alt="Avatar" 
                                className="w-10 h-10 rounded-full mr-3 object-cover" 
                              />
                              <div>
                                <p className="font-medium text-gray-900">{etudiant.prenom} {etudiant.nom}</p>
                                <p className="text-sm text-gray-500">{etudiant.email}</p>
                                <p className="text-sm text-gray-500">{etudiant.telephone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
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
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              etudiant.status === 'Actif' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {etudiant.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleView(etudiant.id)}
                                title="Voir détails"
                              >
                                <i className="fa-solid fa-eye"></i>
                              </button>
                              <button 
                                className="text-[#1e40af] hover:text-[#1e3a8a]"
                                onClick={() => handleEdit(etudiant.id)}
                                title="Modifier"
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDelete(etudiant.id)}
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
                
                <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center">
                  <span className="text-sm text-gray-500 mb-2 md:mb-0">
                    Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEtudiants.length)} sur {filteredEtudiants.length} étudiants
                  </span>
                  <div className="flex gap-2">
                    <button 
                      className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    <button className="px-3 py-1 bg-[#1e40af] text-white rounded">
                      {currentPage}
                    </button>
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
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {isEditing ? 'Modifier un Étudiant' : 'Ajouter un Étudiant'}
                    </h3>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filière</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                        <select
                          name="niveau"
                          value={formData.niveau}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                          required
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date d'inscription</label>
                      <input
                        type="date"
                        name="dateInscription"
                        value={formData.dateInscription}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                        required
                      />
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
                    
                    <div className="flex gap-4 pt-4">
                      <button 
                        type="submit"
                        className="bg-[#1e40af] text-white px-6 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors"
                      >
                        <i className="fa-solid fa-save mr-2"></i>
                        Enregistrer
                      </button>
                      <button 
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <i className="fa-solid fa-times mr-2"></i>
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border flex items-center justify-center">
                  <div className="text-center p-12">
                    <i className="fa-solid fa-graduation-cap text-5xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {isEditing ? 'Modification' : 'Ajout'} d'un étudiant
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Cliquez sur "Ajouter un étudiant" pour commencer à créer un nouveau profil
                    </p>
                    <button 
                      className="bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors flex items-center mx-auto"
                      onClick={() => {
                        resetForm();
                        setShowForm(true);
                      }}
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Ajouter un Étudiant
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modale de détails */}
      {viewingEtudiant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Détails de l'étudiant</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setViewingEtudiant(null)}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={viewingEtudiant.avatar} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#1e40af]"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Matricule</p>
                      <p className="font-medium">{viewingEtudiant.matricule}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">{viewingEtudiant.prenom} {viewingEtudiant.nom}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Filière</p>
                      <p className="font-medium">{viewingEtudiant.filiere}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Niveau</p>
                      <p className="font-medium">{viewingEtudiant.niveau}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <p className="font-medium">{viewingEtudiant.status}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{viewingEtudiant.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium">{viewingEtudiant.telephone}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Date d'inscription</p>
                      <p className="font-medium">{viewingEtudiant.dateInscription}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  className="bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a]"
                  onClick={() => {
                    setViewingEtudiant(null);
                    handleEdit(viewingEtudiant.id);
                  }}
                >
                  <i className="fa-solid fa-edit mr-2"></i>
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </RouteGuard>
  );
};

export default GestionEtudiants;