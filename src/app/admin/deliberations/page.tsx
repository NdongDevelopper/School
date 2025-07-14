'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/context/AuthContext';

interface Deliberation {
  id: number;
  session: string;
  filiere: string;
  niveau: string;
  date: string;
  statut: 'Terminée' | 'Validé' | 'Rejeté';
  fichier: string;
  soumisPar: string;
  dateSoumission: string;
  dateValidation?: string;
  commentaires?: string;
}

const Deliberations = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: 'fa-chart-line', path: '/admin' },
    { id: 'responsables', name: 'Gestion Responsables', icon: 'fa-users-gear', path: '/admin/gestion-responsables' },
    { id: 'enseignants', name: 'Gestion Enseignants', icon: 'fa-chalkboard-teacher', path: '/admin/gestion-enseignants' },
    { id: 'etudiants', name: 'Gestion Étudiants', icon: 'fa-user-graduate', path: '/admin/gestion-etudiants' },
    { id: 'filieres', name: 'Gestion Filières', icon: 'fa-sitemap', path: '/admin/gestion-filieres' },
    { id: 'deliberations', name: 'Délibérations', icon: 'fa-file-signature', path: '/admin/deliberations' }
  ];

  const initialDeliberations: Deliberation[] = [
    {
      id: 1,
      session: 'Session Juin 2023',
      filiere: 'MIC',
      niveau: 'L1',
      date: '15/06/2023',
      statut: 'Terminée',
      fichier: 'PV_Deliberation_MIC_L3_2024.pdf',
      soumisPar: 'Dr. Mamadou Fall',
      dateSoumission: '15/03/2024'
    },
    {
      id: 2,
      session: 'Session Juin 2023',
      filiere: 'IDA',
      niveau: 'M1',
      date: '18/06/2023',
      statut: 'Validé',
      fichier: 'PV_Deliberation_IDA_M1_2024.pdf',
      soumisPar: 'Pr. Fatou Sow',
      dateSoumission: '10/03/2024',
      dateValidation: '12/03/2024'
    },
    {
      id: 3,
      session: 'Session Rattrapage',
      filiere: 'CD',
      niveau: 'L2',
      date: '10/07/2023',
      statut: 'Rejeté',
      fichier: 'PV_Deliberation_CD_L2_Rattrapage_2024.pdf',
      soumisPar: 'Dr. Moussa Ba',
      dateSoumission: '08/03/2024',
      commentaires: 'Erreurs de calcul détectées'
    }
  ];

  const [deliberations, setDeliberations] = useState<Deliberation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [filters, setFilters] = useState({
    filiere: 'Toutes les filières',
    annee: '2023-2024',
    niveau: 'Tous les niveaux',
    session: 'Toutes les sessions'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeliberation, setSelectedDeliberation] = useState<Deliberation | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const savedDeliberations = localStorage.getItem('deliberations');
    if (savedDeliberations) {
      try {
        const parsedData = JSON.parse(savedDeliberations);
        if (Array.isArray(parsedData)) {
          setDeliberations(parsedData);
        } else {
          throw new Error('Données invalides');
        }
      } catch (error) {
        console.error('Erreur de chargement des données, utilisation des données initiales', error);
        setDeliberations(initialDeliberations);
      }
    } else {
      setDeliberations(initialDeliberations);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('deliberations', JSON.stringify(deliberations));
    sessionStorage.setItem('deliberations_backup', JSON.stringify(deliberations));
  }, [deliberations]);

  const stats = [
    {
      title: 'PV Soumis',
      value: deliberations.filter(d => d.statut === 'Terminée').length,
      icon: 'fa-file-upload',
      color: 'blue'
    },
    {
      title: 'PV Validés',
      value: deliberations.filter(d => d.statut === 'Validé').length,
      icon: 'fa-check-circle',
      color: 'green'
    },
    {
      title: 'En Attente',
      value: deliberations.filter(d => d.statut === 'Terminée').length,
      icon: 'fa-clock',
      color: 'yellow'
    },
    {
      title: 'Rejetés',
      value: deliberations.filter(d => d.statut === 'Rejeté').length,
      icon: 'fa-times-circle',
      color: 'red'
    }
  ];

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setNewFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };

  const handleAddNewPv = () => {
    if (!newFile) return;

    const newId = Math.max(0, ...deliberations.map(d => d.id)) + 1;
    const newPv: Deliberation = {
      id: newId,
      session: 'Nouvelle Session',
      filiere: 'Nouvelle Filière',
      niveau: 'Niveau Inconnu',
      date: new Date().toLocaleDateString('fr-FR'),
      statut: 'Terminée',
      fichier: newFile.name,
      soumisPar: user?.name || 'Admin Général',
      dateSoumission: new Date().toLocaleDateString('fr-FR')
    };

    setDeliberations([...deliberations, newPv]);
    setNewFile(null);
    setShowModal(false);
  };

  const handleValidate = (id: number) => {
    setDeliberations(deliberations.map(d =>
      d.id === id ? {
        ...d,
        statut: 'Validé',
        dateValidation: new Date().toLocaleDateString('fr-FR'),
        commentaires: undefined
      } : d
    ));
  };

  const handleReject = () => {
    if (!selectedDeliberation || !rejectComment) return;

    setDeliberations(deliberations.map(d =>
      d.id === selectedDeliberation.id ? {
        ...d,
        statut: 'Rejeté',
        commentaires: rejectComment,
        dateValidation: undefined
      } : d
    ));

    setRejectComment('');
    setShowRejectModal(false);
    setSelectedDeliberation(null);
  };

  const handleDelete = (id: number) => {
    setDeliberations(deliberations.filter(d => d.id !== id));
    setShowDeleteConfirmModal(false);
    setSelectedDeliberation(null);
  };

  // CORRECTION: Création et suppression immédiate du lien
  const handleDownload = (fileName: string) => {
    const link = document.createElement('a');
    link.href = `/documents/${fileName}`;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Suppression immédiate après utilisation
    setTimeout(() => {
      document.body.removeChild(link);
    }, 0);
  };

  const handleView = (fileName: string) => {
    const fileUrl = `/documents/${fileName}`;
    if (fileName.endsWith('.pdf')) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Viewing file: ${fileName}\n\nFor Excel files, direct viewing requires specific tools. The file will be downloaded.`);
      handleDownload(fileName);
    }
  };

  const filteredDeliberations = deliberations.filter(d => {
    const matchesFiliere = filters.filiere === 'Toutes les filières' || d.filiere === filters.filiere;
    const matchesNiveau = filters.niveau === 'Tous les niveaux' || d.niveau === filters.niveau;
    const matchesSession = filters.session === 'Toutes les sessions' || d.session === filters.session;
    return matchesFiliere && matchesNiveau && matchesSession;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeliberations = filteredDeliberations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDeliberations.length / itemsPerPage) || 1;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <RouteGuard roles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Mobile Menu Button */}
        <div className="md:hidden bg-[#1e40af] p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <i className="fas fa-graduation-cap text-2xl text-white"></i>
            <div>
              <h1 className="text-lg font-bold text-white">Administrateur</h1>
              <p className="text-xs text-blue-200">Université Numérique du Sénégal</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white focus:outline-none"
          >
            <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#1e40af] text-white flex flex-col">
            <div className="p-6 border-b border-[#1e3a8a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-graduation-cap text-2xl"></i>
                  <div>
                    <h1 className="text-lg font-bold">Administrateur</h1>
                    <p className="text-xs text-blue-200">Université Numérique du Sénégal</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="text-white focus:outline-none"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <nav className="mt-6 flex-1 overflow-y-auto">
              <ul className="space-y-2 px-4">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        pathname === item.path
                          ? 'bg-[#1e3a8a] text-white'
                          : 'hover:bg-[#1e3a8a]'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <i className={`fas ${item.icon}`}></i>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-[#1e3a8a]">
              <div className="flex items-center space-x-3">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                  alt="Admin"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">Administrateur Général</p>
                  <p className="text-xs text-blue-200">admin@uns.sn</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-[#1e40af] text-white flex flex-col">
          <div className="p-6 border-b border-[#1e3a8a]">
            <div className="flex items-center space-x-3">
              <i className="fas fa-graduation-cap text-2xl"></i>
              <div>
                <h1 className="text-lg font-bold">Administrateur de l'Université</h1>
                <p className="text-xs text-blue-200">Université Numérique du Sénégal</p>
              </div>
            </div>
          </div>

          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-[#1e3a8a] text-white'
                        : 'hover:bg-[#1e3a8a]'
                    }`}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t border-[#1e3a8a]">
            <div className="flex items-center space-x-3">
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                alt="Admin"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">Administrateur Général</p>
                <p className="text-xs text-blue-200">admin@uns.sn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:ml-64 flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Gestion des Délibérations</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Administration des procès-verbaux de délibérations</p>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-4 py-2 rounded-lg transition-colors font-bold shadow-md text-sm md:text-base"
                  onClick={() => setShowModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Nouveau PV
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-4 md:p-6 space-y-6">
            {/* Partie 1: Consultation des PV */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  <i className="fas fa-search mr-2 text-[#1e40af]"></i>
                  Consultation des PV de Délibérations
                </h2>
              </div>

              {/* Filtres - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Filière</label>
                    <select
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af]"
                      value={filters.filiere}
                      onChange={(e) => setFilters({...filters, filiere: e.target.value})}
                    >
                      <option>Toutes les filières</option>
                      <option>MIC</option>
                      <option>IDA</option>
                      <option>CD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Niveau</label>
                    <select
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af]"
                      value={filters.niveau}
                      onChange={(e) => setFilters({...filters, niveau: e.target.value})}
                    >
                      <option>Tous les niveaux</option>
                      <option>L1</option>
                      <option>L2</option>
                      <option>L3</option>
                      <option>M1</option>
                      <option>M2</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Année</label>
                    <select
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af]"
                      value={filters.annee}
                      onChange={(e) => setFilters({...filters, annee: e.target.value})}
                    >
                      <option>2023-2024</option>
                      <option>2022-2023</option>
                      <option>2021-2022</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Session</label>
                    <select
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af]"
                      value={filters.session}
                      onChange={(e) => setFilters({...filters, session: e.target.value})}
                    >
                      <option>Toutes les sessions</option>
                      <option>Session Juin 2023</option>
                      <option>Session Rattrapage</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cartes de statistiques - Responsive */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                {stats.map((stat, index) => (
                  <div key={index} className={`p-3 md:p-4 rounded-lg border ${
                    stat.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                    stat.color === 'green' ? 'bg-green-50 border-green-200' :
                    stat.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs md:text-sm font-medium ${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'yellow' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {stat.title}
                        </p>
                        <p className={`text-xl md:text-2xl font-bold ${
                          stat.color === 'blue' ? 'text-blue-700' :
                          stat.color === 'green' ? 'text-green-700' :
                          stat.color === 'yellow' ? 'text-yellow-700' :
                          'text-red-700'
                        }`}>
                          {stat.value}
                        </p>
                      </div>
                      <i className={`fas ${stat.icon} text-xl md:text-2xl ${
                        stat.color === 'blue' ? 'text-blue-500' :
                        stat.color === 'green' ? 'text-green-500' :
                        stat.color === 'yellow' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}></i>
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone de dépôt - Responsive */}
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                <h3 className="text-base md:text-lg font-medium text-blue-900 mb-2 md:mb-3">
                  <i className="fas fa-cloud-upload-alt mr-2"></i>
                  Dépôt des Délibérations
                </h3>
                <div
                  className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer"
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  {newFile ? (
                    <div className="flex flex-col items-center">
                      <i className="fas fa-file-pdf text-3xl md:text-4xl text-blue-400 mb-2 md:mb-3"></i>
                      <p className="text-blue-700 font-medium text-sm md:text-base truncate w-full">{newFile.name}</p>
                      <p className="text-blue-600 text-xs md:text-sm mt-1">Prêt à être soumis</p>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-file-pdf text-3xl md:text-4xl text-blue-400 mb-2 md:mb-3"></i>
                      <p className="text-blue-700 font-medium text-sm md:text-base">Glissez vos fichiers PDF ou Excel ici</p>
                      <p className="text-blue-600 text-xs md:text-sm mt-1">ou cliquez pour sélectionner</p>
                    </>
                  )}
                  <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    accept=".pdf,.xlsx,.xls"
                    onChange={handleFileSelect}
                  />
                  <button
                    className={`mt-2 md:mt-3 bg-[#1e40af] text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors font-bold text-xs md:text-sm ${!newFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!newFile}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddNewPv();
                    }}
                  >
                    Soumettre le fichier
                  </button>
                </div>
              </div>
            </div>

            {/* Partie 2: Validation des PV */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
                <i className="fas fa-tasks mr-2 text-[#1e40af]"></i>
                Validation des PV
              </h2>

              {/* Liste des PV */}
              <div className="space-y-3 md:space-y-4">
                {currentDeliberations.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">Aucune délibération ne correspond aux filtres.</p>
                ) : (
                  currentDeliberations.map((sess) => (
                    <div key={sess.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col">
                        <div className="flex-1 mb-2">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sess.statut === 'Terminée' ? 'bg-yellow-100 text-yellow-800' :
                              sess.statut === 'Validé' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {sess.statut}
                            </span>
                            <span className="text-xs md:text-sm text-gray-600">{sess.filiere} - {sess.niveau}</span>
                          </div>
                          <h3 className="font-medium text-gray-900 text-sm md:text-base break-words">{sess.fichier}</h3>
                          <p className="text-xs md:text-sm text-gray-600 mt-1">
                            {sess.statut === 'Terminée' ? `Soumis le ${sess.dateSoumission} par ${sess.soumisPar}` :
                             sess.statut === 'Validé' ? `Validé le ${sess.dateValidation} par Admin Général` :
                             `Rejeté le ${sess.dateSoumission}`}
                            {sess.statut === 'Rejeté' && sess.commentaires && (
                                <span className="ml-1 text-red-500 cursor-pointer text-xs md:text-sm"
                                      onClick={() => {
                                          setSelectedDeliberation(sess);
                                          setShowCommentsModal(true);
                                      }}>
                                        (Voir commentaires)
                                </span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {sess.statut === 'Terminée' ? (
                            <>
                              <button
                                className="bg-green-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-lg hover:bg-green-600 transition-colors text-xs md:text-sm font-bold"
                                onClick={() => handleValidate(sess.id)}
                              >
                                <i className="fas fa-check mr-1"></i>
                                Valider
                              </button>
                              <button
                                className="bg-red-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm font-bold"
                                onClick={() => {
                                  setSelectedDeliberation(sess);
                                  setShowRejectModal(true);
                                }}
                              >
                                <i className="fas fa-times mr-1"></i>
                                Rejeter
                              </button>
                            </>
                          ) : sess.statut === 'Validé' ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs md:text-sm font-bold">
                              <i className="fas fa-check-circle mr-1"></i>
                              Archivé
                            </span>
                          ) : (
                            <button
                              className="bg-blue-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-lg hover:bg-blue-600 transition-colors text-xs md:text-sm font-bold"
                              onClick={() => {
                                setSelectedDeliberation(sess);
                                setShowCommentsModal(true);
                              }}
                            >
                              <i className="fas fa-comment mr-1"></i>
                              Voir commentaires
                            </button>
                          )}
                          <button
                            className="bg-gray-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-lg hover:bg-gray-600 transition-colors text-xs md:text-sm font-bold"
                            onClick={() => handleDownload(sess.fichier)}
                          >
                            <i className="fas fa-download mr-1"></i>
                            Télécharger
                          </button>
                          <button
                            className="bg-indigo-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-lg hover:bg-indigo-600 transition-colors text-xs md:text-sm font-bold"
                            onClick={() => handleView(sess.fichier)}
                          >
                            <i className="fas fa-eye mr-1"></i>
                            Voir
                          </button>
                          <button
                            className="bg-red-700 text-white px-2 py-1 md:px-3 md:py-1 rounded-lg hover:bg-red-800 transition-colors text-xs md:text-sm font-bold"
                            onClick={() => {
                                setSelectedDeliberation(sess);
                                setShowDeleteConfirmModal(true);
                            }}
                          >
                            <i className="fas fa-trash mr-1"></i>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination - Responsive */}
              <div className="flex flex-col items-center mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
                <p className="text-xs md:text-sm text-gray-600 mb-2">
                  Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredDeliberations.length)} sur {filteredDeliberations.length} résultats
                </p>
                <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
                  <button
                    className="px-2 py-1 md:px-3 md:py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-xs md:text-sm"
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Précédent
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm min-w-[36px] ${
                        currentPage === page
                          ? 'bg-[#1e40af] text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => paginate(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="px-2 py-1 md:px-3 md:py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-xs md:text-sm"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter un nouveau PV */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 md:p-6 border-b">
              <h3 className="text-lg md:text-xl font-semibold">
                Ajouter un nouveau PV
              </h3>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer"
                   onDrop={handleFileDrop}
                   onDragOver={(e) => e.preventDefault()}
                   onClick={() => document.getElementById('file-input-modal')?.click()}>
                {newFile ? (
                  <div className="flex flex-col items-center">
                    <i className="fas fa-file-pdf text-3xl md:text-4xl text-blue-400 mb-2 md:mb-3"></i>
                    <p className="text-blue-700 font-medium text-sm md:text-base truncate w-full">{newFile.name}</p>
                    <p className="text-blue-600 text-xs md:text-sm mt-1">Fichier sélectionné</p>
                  </div>
                ) : (
                  <>
                    <i className="fas fa-file-pdf text-3xl md:text-4xl text-blue-400 mb-2 md:mb-3"></i>
                    <p className="text-blue-700 font-medium text-sm md:text-base">Glissez vos fichiers PDF ou Excel ici</p>
                    <p className="text-blue-600 text-xs md:text-sm mt-1">ou cliquez pour sélectionner</p>
                  </>
                )}
                <input
                  type="file"
                  id="file-input-modal"
                  className="hidden"
                  accept=".pdf,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            <div className="p-4 md:p-6 border-t flex justify-end space-x-2 md:space-x-3">
              <button
                className="px-3 py-1 md:px-4 md:py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md font-bold transition-colors text-xs md:text-sm"
                onClick={() => {
                  setShowModal(false);
                  setNewFile(null);
                }}
              >
                Annuler
              </button>
              <button
                className={`px-3 py-1 md:px-4 md:py-2 bg-[#1e40af] text-white rounded-md font-bold transition-colors hover:bg-[#1e3a8a] text-xs md:text-sm ${!newFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleAddNewPv}
                disabled={!newFile}
              >
                Ajouter PV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de rejet */}
      {showRejectModal && selectedDeliberation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 md:p-6 border-b">
              <h3 className="text-lg md:text-xl font-semibold">
                Rejeter la délibération : {selectedDeliberation.fichier}
              </h3>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <label htmlFor="reject-comment" className="block text-sm font-medium text-gray-700">
                Commentaires de rejet
              </label>
              <textarea
                id="reject-comment"
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={4}
                placeholder="Veuillez saisir les raisons du rejet..."
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
              ></textarea>
            </div>
            <div className="p-4 md:p-6 border-t flex justify-end space-x-2 md:space-x-3">
              <button
                className="px-3 py-1 md:px-4 md:py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md font-bold transition-colors text-xs md:text-sm"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectComment('');
                  setSelectedDeliberation(null);
                }}
              >
                Annuler
              </button>
              <button
                className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded-md font-bold transition-colors hover:bg-red-700 text-xs md:text-sm"
                onClick={handleReject}
                disabled={!rejectComment.trim()}
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation des commentaires */}
      {showCommentsModal && selectedDeliberation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 md:p-6 border-b">
              <h3 className="text-lg md:text-xl font-semibold">
                Commentaires pour : {selectedDeliberation.fichier}
              </h3>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-gray-700 text-sm md:text-base">
                {selectedDeliberation.commentaires || 'Aucun commentaire disponible.'}
              </p>
            </div>
            <div className="p-4 md:p-6 border-t flex justify-end">
              <button
                className="px-3 py-1 md:px-4 md:py-2 bg-[#1e40af] text-white rounded-md font-bold transition-colors hover:bg-[#1e3a8a] text-xs md:text-sm"
                onClick={() => {
                  setShowCommentsModal(false);
                  setSelectedDeliberation(null);
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirmModal && selectedDeliberation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 md:p-6 border-b">
              <h3 className="text-lg md:text-xl font-semibold text-red-700">
                Confirmer la suppression
              </h3>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-gray-700 text-sm md:text-base">
                Êtes-vous sûr de vouloir supprimer la délibération "{selectedDeliberation.fichier}" ? Cette action est irréversible.
              </p>
            </div>
            <div className="p-4 md:p-6 border-t flex justify-end space-x-2 md:space-x-3">
              <button
                className="px-3 py-1 md:px-4 md:py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md font-bold transition-colors text-xs md:text-sm"
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setSelectedDeliberation(null);
                }}
              >
                Annuler
              </button>
              <button
                className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded-md font-bold transition-colors hover:bg-red-700 text-xs md:text-sm"
                onClick={() => handleDelete(selectedDeliberation.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </RouteGuard>
  );
};

export default Deliberations;