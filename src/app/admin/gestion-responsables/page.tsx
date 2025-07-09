'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/context/AuthContext';

// Types pour les données
type Responsable = {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  filiere: string;
  niveau: string;
  status: string;
  duree: string;
  image: string | null;
};

type Filiere = {
  id: string;
  nom: string;
};

// Fonction pour générer un ID unique
const generateId = () => {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Clés de stockage
const RESPONSABLES_STORAGE_KEY = 'gestion-responsables:responsables';
const FILIERES_STORAGE_KEY = 'gestion-responsables:filieres';

const GestionResponsables = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Navigation items
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
      icon: 'fa-solid fa-users',
      path: '/admin/gestion-responsables'
    },
    { 
      id: 'enseignants',
      name: 'Gestion Enseignants',
      icon: 'fa-solid fa-chalkboard-teacher',
      path: '/admin/gestion-enseignants'
    },
    { 
      id: 'etudiants',
      name: 'Gestion Étudiants',
      icon: 'fa-solid fa-user-graduate',
      path: '/admin/gestion-etudiants'
    },
    { 
      id: 'filieres',
      name: 'Gestion Filières',
      icon: 'fa-solid fa-graduation-cap',
      path: '/admin/gestion-filieres'
    },
    { 
      id: 'deliberations',
      name: 'Délibérations',
      icon: 'fa-solid fa-clipboard-check',
      path: '/admin/deliberations'
    }
  ];

  // États pour les données
  const [filieres, setFilieres] = useState<Filiere[]>([
    { id: '1', nom: 'MIC' },
    { id: '2', nom: 'IDA' },
    { id: '3', nom: 'CD' },
  ]);
  
  const [filiereFilter, setFiliereFilter] = useState('Toutes');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResponsable, setCurrentResponsable] = useState<Responsable | null>(null);
  const [newResponsable, setNewResponsable] = useState<Omit<Responsable, 'id'>>({
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    filiere: '',
    niveau: 'Responsable',
    status: 'Actif',
    duree: '',
    image: null
  });
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [formError, setFormError] = useState('');

  // Charger les données depuis localStorage au montage
  useEffect(() => {
    const savedResponsables = localStorage.getItem(RESPONSABLES_STORAGE_KEY);
    const savedFilieres = localStorage.getItem(FILIERES_STORAGE_KEY);
    
    if (savedResponsables) {
      try {
        const parsedData = JSON.parse(savedResponsables);
        if (Array.isArray(parsedData)) {
          setResponsables(parsedData);
        }
      } catch (error) {
        console.error('Error parsing responsables data:', error);
      }
    }
    
    if (savedFilieres) {
      try {
        const parsedData = JSON.parse(savedFilieres);
        if (Array.isArray(parsedData)) {
          setFilieres(parsedData);
        }
      } catch (error) {
        console.error('Error parsing filieres data:', error);
      }
    } else {
      // Sauvegarder les filières par défaut
      localStorage.setItem(FILIERES_STORAGE_KEY, JSON.stringify(filieres));
    }
    
    setIsInitialized(true);
  }, []);

  // Sauvegarder les données dans localStorage à chaque modification
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(RESPONSABLES_STORAGE_KEY, JSON.stringify(responsables));
    }
  }, [responsables, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(FILIERES_STORAGE_KEY, JSON.stringify(filieres));
    }
  }, [filieres, isInitialized]);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNewResponsable({
      matricule: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      filiere: '',
      niveau: 'Responsable',
      status: 'Actif',
      duree: '',
      image: null
    });
    setFormError('');
  };

  // Gestion de l'ajout de responsable
  const handleAddResponsable = () => {
    if (!newResponsable.matricule || !newResponsable.nom || !newResponsable.prenom || !newResponsable.filiere) {
      setFormError('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    // Générer l'email si non fourni
    const email = newResponsable.email || 
                 `${newResponsable.prenom.toLowerCase()}.${newResponsable.nom.toLowerCase()}@uns.edu.sn`;

    const newId = generateId();

    const responsableToAdd: Responsable = {
      id: newId,
      ...newResponsable,
      email
    };

    setResponsables([...responsables, responsableToAdd]);
    setShowAddModal(false);
    resetForm();
  };

  // Ouvrir le modal d'édition
  const handleEditClick = (responsable: Responsable) => {
    setCurrentResponsable(responsable);
    setShowEditModal(true);
    setFormError('');
  };

  // Mettre à jour un responsable
  const handleUpdateResponsable = () => {
    if (!currentResponsable) return;
    
    if (!currentResponsable.matricule || !currentResponsable.nom || !currentResponsable.prenom || !currentResponsable.filiere) {
      setFormError('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    const updatedResponsables = responsables.map(r => 
      r.id === currentResponsable.id ? currentResponsable : r
    );

    setResponsables(updatedResponsables);
    setShowEditModal(false);
    setFormError('');
  };

  // Gestion de la suppression de responsable
  const handleDeleteResponsable = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce responsable ?')) {
      const updatedResponsables = responsables.filter(r => r.id !== id);
      setResponsables(updatedResponsables);
    }
  };

  // Gestion de l'upload d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        if (isEdit && currentResponsable) {
          setCurrentResponsable({...currentResponsable, image: imageData});
        } else {
          setNewResponsable({...newResponsable, image: imageData});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtrer les responsables
  const filteredResponsables = responsables.filter(r => {
    const matchesFiliere = filiereFilter === 'Toutes' || r.filiere === filiereFilter;
    const matchesSearch = search === '' || 
      r.nom.toLowerCase().includes(search.toLowerCase()) || 
      r.prenom.toLowerCase().includes(search.toLowerCase()) ||
      r.matricule.toLowerCase().includes(search.toLowerCase());
    return matchesFiliere && matchesSearch;
  });

  return (
    <RouteGuard roles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-[#1e40af] text-white z-40" style={{ top: '64px' }}>
            <div className="p-4 border-b border-blue-400">
              <h2 className="text-lg font-semibold text-white">Administrateur Général de l'Université</h2>
              <p className="text-xs text-blue-200">Université Numérique du Sénégal</p>
            </div>
            
            <nav className="mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex w-full items-center px-6 py-3 transition-colors ${
                    pathname === item.path 
                      ? 'bg-blue-700 border-r-4 border-white' 
                      : 'hover:bg-blue-700'
                  }`}
                >
                  <i className={`${item.icon} mr-3`}></i>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-blue-400 mt-auto">
              <div className="flex items-center">
                <img 
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                  alt="Admin" 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-medium">Admin Général</p>
                  <p className="text-xs text-blue-200">admin@uns.sn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="ml-64 flex-1 mt-16">
            {/* Content */}
            <div className="p-4 md:p-6">
              {/* En-tête de page avec bouton d'action */}
              <div className="bg-white shadow-sm border-b p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des Responsables</h2>
                    <p className="text-gray-600 text-sm">Administration des responsables de filière</p>
                  </div>
                  <button 
                    className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] flex items-center transition-colors"
                    onClick={() => {
                      setShowAddModal(true);
                      setShowEditModal(false);
                      resetForm();
                    }}
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Ajouter un Responsable
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Partie 1: Liste des Responsables */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Liste des Responsables</h3>
                    <div className="flex gap-4 mb-4">
                      <input 
                        type="text" 
                        placeholder="Rechercher par nom, prénom ou matricule..." 
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <select 
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                        value={filiereFilter}
                        onChange={(e) => setFiliereFilter(e.target.value)}
                      >
                        <option value="Toutes">Toutes les filières</option>
                        {filieres.map(filiere => (
                          <option key={filiere.id} value={filiere.nom}>
                            {filiere.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Responsable</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Matricule</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Filière</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredResponsables.length > 0 ? (
                          filteredResponsables.map((responsable) => (
                            <tr key={responsable.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4">
                                <div className="flex items-center">
                                  {responsable.image ? (
                                    <img 
                                      src={responsable.image} 
                                      alt={responsable.nom} 
                                      className="w-8 h-8 rounded-full mr-3 object-cover"
                                    />
                                  ) : (
                                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                      <i className="fa-solid fa-user text-gray-400"></i>
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-900">{responsable.nom} {responsable.prenom}</p>
                                    <p className="text-sm text-gray-500">{responsable.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-gray-700">{responsable.matricule}</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {responsable.filiere}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  responsable.status === 'Actif' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {responsable.status}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => handleEditClick(responsable)}
                                  >
                                    <i className="fa-solid fa-edit"></i>
                                  </button>
                                  <button 
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleDeleteResponsable(responsable.id)}
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              Aucun responsable trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-4 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Affichage 1-{filteredResponsables.length} sur {filteredResponsables.length} responsables
                    </span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>
                        Précédent
                      </button>
                      <button className="px-3 py-1 bg-[#1e40af] text-white rounded">1</button>
                      <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>

                {/* Partie 2: Formulaire */}
                {(showAddModal || showEditModal) && (
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {showEditModal ? "Modifier un Responsable" : "Ajouter un Responsable"}
                      </h3>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {formError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                          <i className="fa-solid fa-exclamation-circle mr-2"></i>
                          {formError}
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                        <div className="flex items-center">
                          {showEditModal && currentResponsable?.image ? (
                            <img 
                              src={currentResponsable.image} 
                              alt="Preview" 
                              className="w-16 h-16 rounded-full mr-4 object-cover"
                            />
                          ) : newResponsable.image ? (
                            <img 
                              src={newResponsable.image} 
                              alt="Preview" 
                              className="w-16 h-16 rounded-full mr-4 object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center mr-4">
                              <i className="fa-solid fa-user text-gray-400"></i>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, showEditModal)}
                            className="text-sm"
                            ref={fileInputRef}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Matricule <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={showEditModal ? currentResponsable?.matricule || '' : newResponsable.matricule}
                          onChange={(e) => 
                            showEditModal && currentResponsable 
                              ? setCurrentResponsable({...currentResponsable, matricule: e.target.value})
                              : setNewResponsable({...newResponsable, matricule: e.target.value})
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                          placeholder="Ex: RES-12345"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={showEditModal ? currentResponsable?.nom || '' : newResponsable.nom}
                            onChange={(e) => 
                              showEditModal && currentResponsable 
                                ? setCurrentResponsable({...currentResponsable, nom: e.target.value})
                                : setNewResponsable({...newResponsable, nom: e.target.value})
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                            placeholder="Ex: Diop"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prénom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={showEditModal ? currentResponsable?.prenom || '' : newResponsable.prenom}
                            onChange={(e) => 
                              showEditModal && currentResponsable 
                                ? setCurrentResponsable({...currentResponsable, prenom: e.target.value})
                                : setNewResponsable({...newResponsable, prenom: e.target.value})
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                            placeholder="Ex: Fatou"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Professionnel <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={showEditModal ? currentResponsable?.email || '' : newResponsable.email}
                          onChange={(e) => 
                            showEditModal && currentResponsable 
                              ? setCurrentResponsable({...currentResponsable, email: e.target.value})
                              : setNewResponsable({...newResponsable, email: e.target.value})
                          }
                          placeholder="ex: prenom.nom@uns.edu.sn"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                          required
                        />
                      </div>
                     
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                          type="text"
                          value={showEditModal ? currentResponsable?.telephone || '' : newResponsable.telephone}
                          onChange={(e) => 
                            showEditModal && currentResponsable 
                              ? setCurrentResponsable({...currentResponsable, telephone: e.target.value})
                              : setNewResponsable({...newResponsable, telephone: e.target.value})
                          }
                          placeholder="Ex: +221 77 123 45 67"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                        />
                      </div>
                     
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Filière Associée <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={showEditModal ? currentResponsable?.filiere || '' : newResponsable.filiere}
                          onChange={(e) => 
                            showEditModal && currentResponsable 
                              ? setCurrentResponsable({...currentResponsable, filiere: e.target.value})
                              : setNewResponsable({...newResponsable, filiere: e.target.value})
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                          required
                        >
                          <option value="">Sélectionner une filière</option>
                          {filieres.map(filiere => (
                            <option key={filiere.id} value={filiere.nom}>
                              {filiere.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                     
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                          <input
                            type="text"
                            value={showEditModal ? currentResponsable?.duree || '' : newResponsable.duree}
                            onChange={(e) => 
                              showEditModal && currentResponsable 
                                ? setCurrentResponsable({...currentResponsable, duree: e.target.value})
                                : setNewResponsable({...newResponsable, duree: e.target.value})
                            }
                            placeholder="Ex: 2 ans"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                          <select 
                            value={showEditModal ? currentResponsable?.status || '' : newResponsable.status}
                            onChange={(e) => 
                              showEditModal && currentResponsable 
                                ? setCurrentResponsable({...currentResponsable, status: e.target.value})
                                : setNewResponsable({...newResponsable, status: e.target.value})
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                          >
                            <option value="Actif">Actif</option>
                            <option value="Inactif">Inactif</option>
                          </select>
                        </div>
                      </div>
                     
                      <div className="flex gap-4 pt-4">
                        <button 
                          type="button" 
                          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                          onClick={() => {
                            setShowAddModal(false);
                            setShowEditModal(false);
                            resetForm();
                          }}
                        >
                          <i className="fa-solid fa-times mr-2"></i>
                          Annuler
                        </button>
                        <button 
                          type="button" 
                          className="bg-[#1e40af] text-white px-6 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors flex items-center"
                          onClick={showEditModal ? handleUpdateResponsable : handleAddResponsable}
                        >
                          <i className="fa-solid fa-save mr-2"></i>
                          {showEditModal ? "Mettre à jour" : "Enregistrer"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default GestionResponsables;