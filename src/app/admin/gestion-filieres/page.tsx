'use client'; // Indique que ce composant est un Client Component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import de useRouter
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/context/AuthContext'; // Assurez-vous que useAuth fournit `logout`

// Définition des types
interface Responsable {
  nom: string;
  image: string;
}

interface Filiere {
  id: number;
  code: string;
  nom: string;
  niveau: string;
  responsable: Responsable;
  etudiants: number;
  statut: 'active' | 'suspendue';
}

const GestionFilieres = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialisation de useRouter
  const { user, logout } = useAuth(); // Récupération de l'utilisateur et de la fonction de déconnexion
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items
  const navItems = [
    {
      id: 'dashboard',
      name: 'Tableau de Bord',
      icon: 'fa-chart-line',
      path: '/admin'
    },
    {
      id: 'responsables',
      name: 'Gestion Responsables',
      icon: 'fa-user-tie',
      path: '/admin/gestion-responsables'
    },
    {
      id: 'enseignants',
      name: 'Gestion Enseignants',
      icon: 'fa-chalkboard-teacher',
      path: '/admin/gestion-enseignants'
    },
    {
      id: 'etudiants',
      name: 'Gestion Étudiants',
      icon: 'fa-user-graduate',
      path: '/admin/gestion-etudiants'
    },
    {
      id: 'filieres',
      name: 'Gestion Filières',
      icon: 'fa-sitemap',
      path: '/admin/gestion-filieres'
    },
    {
      id: 'deliberations',
      name: 'Délibérations',
      icon: 'fa-gavel',
      path: '/admin/deliberations'
    }
  ];

  // Données initiales des filières avec typage
  const initialFilieres: Filiere[] = [
    {
      id: 1,
      code: 'IDA',
      nom: 'Licence3',
      niveau: 'Licence 3 ans',
      responsable: {
        nom: 'Dr. Amadou Diallo',
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
      },
      etudiants: 0,
      statut: 'active'
    },
    {
      id: 2,
      code: 'MIC',
      nom: 'Master1',
      niveau: 'Master 1 an',
      responsable: {
        nom: 'Pr. Fatou Sow',
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg'
      },
      etudiants: 48,
      statut: 'suspendue'
    },
    {
      id: 3,
      code: 'HTML',
      nom: 'Licence3',
      niveau: 'Licence 3 ans',
      responsable: {
        nom: 'Dr. Amadou Diallo',
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
      },
      etudiants: 0,
      statut: 'active'
    }
  ];

  // États pour la gestion des données
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentFiliere, setCurrentFiliere] = useState<Filiere>({
    id: 0,
    code: '',
    nom: '',
    niveau: 'Licence 3 ans',
    responsable: {
      nom: 'Dr. Amadou Diallo',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
    },
    etudiants: 0,
    statut: 'active'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Charger les données depuis localStorage au montage
  useEffect(() => {
    const savedFilieres = localStorage.getItem('filieres');
    if (savedFilieres) {
      try {
        const parsedData = JSON.parse(savedFilieres);

        // Validation et correction complète des données
        const validatedData = parsedData.map((filiere: any) => {
          // S'assurer que la structure de base existe
          const defaultFiliere = {
            id: filiere.id || 0,
            code: filiere.code || '',
            nom: filiere.nom || '',
            niveau: filiere.niveau || 'Licence 3 ans',
            responsable: {
              nom: filiere.responsable?.nom || 'Responsable inconnu',
              image: filiere.responsable?.image || 'https://via.placeholder.com/40'
            },
            etudiants: filiere.etudiants || 0,
            statut: filiere.statut === 'active' || filiere.statut === 'suspendue'
                        ? filiere.statut
                        : 'active'
          };

          return defaultFiliere;
        });

        setFilieres(validatedData);
      } catch (error) {
        console.error('Erreur de chargement des données, utilisation des données initiales', error);
        localStorage.setItem('filieres', JSON.stringify(initialFilieres));
        setFilieres(initialFilieres);
      }
    } else {
      // Première initialisation - sauvegarde des données initiales
      localStorage.setItem('filieres', JSON.stringify(initialFilieres));
      setFilieres(initialFilieres);
    }
  }, []);

  // Sauvegarder dans localStorage quand les filières changent
  useEffect(() => {
    if (filieres.length > 0) {
      localStorage.setItem('filieres', JSON.stringify(filieres));
    }
  }, [filieres]);

  // Calculer les statistiques
  const stats = [
    {
      title: 'Total Filières',
      value: filieres.length,
      icon: 'fa-sitemap',
      color: 'blue'
    },
    {
      title: 'Filières Actives',
      value: filieres.filter(f => f.statut === 'active').length,
      icon: 'fa-check-circle',
      color: 'green'
    },
    {
      title: 'Suspendues',
      value: filieres.filter(f => f.statut === 'suspendue').length,
      icon: 'fa-pause-circle',
      color: 'orange'
    },
    {
      title: 'Étudiants Inscrits',
      value: filieres.reduce((sum, f) => sum + f.etudiants, 0),
      icon: 'fa-user-graduate',
      color: 'blue'
    }
  ];

  // Gestion de l'ajout/modification
  const handleAddEditFiliere = () => {
    if (currentFiliere.id) {
      // Modification
      const updatedFilieres = filieres.map(f =>
        f.id === currentFiliere.id ? currentFiliere : f
      );
      setFilieres(updatedFilieres);
    } else {
      // Ajout
      const newId = Math.max(0, ...filieres.map(f => f.id)) + 1;
      const newFilieres = [...filieres, { ...currentFiliere, id: newId }];
      setFilieres(newFilieres);
    }
    setShowModal(false);
  };

  // Gestion de la suppression
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
      const newFilieres = filieres.filter(filiere => filiere.id !== id);
      setFilieres(newFilieres);
    }
  };

  // Gestion de la vue détaillée
  const handleView = (filiere: Filiere) => {
    alert(`Détails de la filière:\n\nNom: ${filiere.nom}\nCode: ${filiere.code}\nNiveau: ${filiere.niveau}\nResponsable: ${filiere.responsable.nom}\nÉtudiants: ${filiere.etudiants}\nStatut: ${filiere.statut === 'active' ? 'Active' : 'Suspendue'}`);
  };

  // Gestion de la pagination
  const filteredFilieres = filieres.filter(filiere => {
    const matchesSearch = filiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          filiere.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || filiere.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilieres = filteredFilieres.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFilieres.length / itemsPerPage) || 1;

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <RouteGuard roles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Bouton de menu mobile (Hamburger principal) */}
        <button
          className="md:hidden fixed top-4 right-4 z-50 p-2 bg-[#1e40af] text-white rounded-lg shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className="fas fa-bars"></i> {/* Les trois barres pour le menu principal */}
        </button>

        {/* Overlay pour fermer la sidebar sur mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 w-64 bg-[#1e40af] text-white flex flex-col z-50 transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:static md:translate-x-0 h-screen`}
        >
          <div className="p-6 border-b border-[#1e3a8a]">
            <div className="flex items-center space-x-3">
              <i className="fas fa-university text-2xl"></i>
              <div>
                <h1 className="text-lg font-bold">Administrateur Général de l'Université</h1>
                <p className="text-xs text-blue-200">Université Numérique du Sénégal</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex-1">
            <div className="px-4 mb-4">
              <p className="text-xs uppercase text-blue-200 font-semibold tracking-wider">Menu Principal</p>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center px-6 py-3 transition-colors ${
                  pathname === item.path
                    ? 'bg-[#1e3a8a] text-white border-r-4 border-white'
                    : 'text-blue-200 hover:bg-[#1e3a8a] hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`fas ${item.icon} w-5 mr-3`}></i>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Bouton de déconnexion dans la sidebar (visible sur mobile quand sidebar ouverte) */}
            <div className="mt-auto px-4 py-3 md:hidden">
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full px-2 py-2 text-blue-200 hover:bg-[#1e3a8a] hover:text-white rounded-lg transition-colors"
              >
                <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                <span>Déconnexion</span>
              </button>
            </div>
          </nav>

          <div className="p-6 border-t border-[#1e3a8a]">
            <div className="flex items-center space-x-3">
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                alt="Admin"
                className="w-10 h-10 rounded-full"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')}
              />
              <div>
                <p className="text-sm font-medium">Administrateur Général</p>
                <p className="text-xs text-blue-200">admin@uns.sn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Gestion des Filières</h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Gérer les filières et programmes d'études</p>
              </div>

              <div className="flex items-center space-x-2 md:space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900">
                  <i className="fas fa-bell text-lg"></i>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>

                {/* NOUVEAU: Bouton de déconnexion avec icône "trois barres" dans le header pour petit écran */}
                <button
                  className="md:hidden p-2 text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                >
                  <i className="fas fa-bars text-lg"></i> {/* Icône "trois barres" pour la déconnexion */}
                  <span className="text-sm">Déconnexion</span> {/* Texte pour clarifier */}
                </button>

                {/* Info Admin et déconnexion pour grand écran */}
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Bonjour, Admin</span>
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                    alt="Admin"
                    className="w-8 h-8 rounded-full"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')}
                  />
                  {/* Bouton de déconnexion avec icône porte pour grand écran */}
                  <button
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={() => {
                      logout();
                      router.push('/login');
                    }}
                  >
                    <i className="fas fa-sign-out-alt text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content (inchangé) */}
          <main className="flex-1 p-4 md:p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4 md:gap-6 md:mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">{stat.title}</p>
                      <p className={`text-xl md:text-3xl font-bold ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        'text-orange-600'
                      }`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      'bg-orange-100'
                    }`}>
                      <i className={`fas ${stat.icon} ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        'text-orange-600'
                      } text-base md:text-xl`}></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filières Management Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Liste des Filières</h2>
                  <button
                    className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-md justify-center"
                    onClick={() => {
                      setCurrentFiliere({
                        id: 0,
                        code: '',
                        nom: '',
                        niveau: 'Licence 3 ans',
                        responsable: {
                          nom: 'Dr. Amadou Diallo',
                          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
                        },
                        etudiants: 0,
                        statut: 'active'
                      });
                      setShowModal(true);
                    }}
                  >
                    <i className="fas fa-plus"></i>
                    <span>Ajouter Filière</span>
                  </button>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 relative">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Rechercher une filière..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Toutes les filières</option>
                    <option value="active">Actives</option>
                    <option value="suspendue">Suspendues</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filière</th>
                      <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiants</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentFilieres.map((fil) => (
                      <tr key={fil.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mr-3 ${
                              fil.code === 'IDA' ? 'bg-blue-100' :
                              fil.code === 'MIC' ? 'bg-green-100' :
                              'bg-purple-100'
                            }`}>
                              <i className={`fas ${
                                fil.code === 'IDA' ? 'fa-laptop-code text-blue-600' :
                                fil.code === 'MIC' ? 'fa-calculator text-green-600' :
                                'fa-chart-line text-purple-600'
                              } text-sm md:text-base`}></i>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{fil.nom}</div>
                              <div className="text-xs text-gray-500 sm:hidden">{fil.code} - {fil.niveau}</div>
                              <div className="text-xs md:text-sm text-gray-500 hidden sm:block">{fil.niveau}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 py-4 text-sm text-gray-900">{fil.code}</td>
                        <td className="hidden md:table-cell px-4 py-4">
                          <div className="flex items-center">
                            <img
                              src={fil.responsable.image}
                              alt="Responsable"
                              className="w-8 h-8 rounded-full mr-2"
                              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')}
                            />
                            <div className="text-sm text-gray-900">{fil.responsable.nom}</div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-900">{fil.etudiants}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            fil.statut === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {fil.statut === 'active' ? 'Active' : 'Suspendue'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 flex-shrink-0"
                              onClick={() => {
                                setCurrentFiliere(fil);
                                setShowModal(true);
                              }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="text-green-600 hover:text-green-900 flex-shrink-0"
                              onClick={() => handleView(fil)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 flex-shrink-0"
                              onClick={() => handleDelete(fil.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-4 md:px-6 md:py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredFilieres.length)} sur {filteredFilieres.length} filières
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Précédent
                  </button>

                  <div className="hidden sm:flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === page
                            ? 'bg-[#1e40af] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <span className="sm:hidden mx-2">Page {currentPage}/{totalPages}</span>

                  <button
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal d'ajout/modification (inchangé) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4 md:p-6 border-b">
              <h3 className="text-lg md:text-xl font-semibold">
                {currentFiliere.id ? 'Modifier Filière' : 'Ajouter Filière'}
              </h3>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentFiliere.code}
                  onChange={(e) => setCurrentFiliere({...currentFiliere, code: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentFiliere.nom}
                  onChange={(e) => setCurrentFiliere({...currentFiliere, nom: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentFiliere.niveau}
                  onChange={(e) => setCurrentFiliere({...currentFiliere, niveau: e.target.value})}
                >
                  <option>Licence1</option>
                  <option>Licence2</option>
                  <option>Licence3</option>
                  <option>Master1</option>
                  <option>Master2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentFiliere.responsable.nom}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    let image = '';

                    if (selectedValue === 'Dr. Amadou Diallo') {
                      image = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg';
                    } else if (selectedValue === 'Pr. Fatou Sow') {
                      image = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg';
                    } else if (selectedValue === 'Dr. Moussa Ba') {
                      image = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg';
                    } else {
                      image = 'https://via.placeholder.com/40';
                    }

                    setCurrentFiliere({
                      ...currentFiliere,
                      responsable: {
                        nom: selectedValue,
                        image: image
                      }
                    });
                  }}
                >
                  <option value="Dr. Amadou Diallo">Dr. Amadou Diallo</option>
                  <option value="Pr. Fatou Sow">Pr. Fatou Sow</option>
                  <option value="Dr. Moussa Ba">Dr. Moussa Ba</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'étudiants</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentFiliere.etudiants}
                  onChange={(e) => setCurrentFiliere({...currentFiliere, etudiants: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={currentFiliere.statut}
                  onChange={(e) => setCurrentFiliere({...currentFiliere, statut: e.target.value as 'active' | 'suspendue'})}
                >
                  <option value="active">Active</option>
                  <option value="suspendue">Suspendue</option>
                </select>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md font-bold transition-colors"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-md font-bold shadow-md transition-colors"
                onClick={handleAddEditFiliere}
              >
                {currentFiliere.id ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </RouteGuard>
  );
};

export default GestionFilieres;