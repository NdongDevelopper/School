'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface Enseignant {
  id: string;
  nom: string;
  specialite: string;
  email: string;
  telephone: string;
  matieres: string[];
  imageUrl: string;
}

export default function GestionEnseignants() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEnseignant, setEditingEnseignant] = useState<Enseignant | null>(null);
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
      href: '/responsable/gestion-enseignants', 
      label: 'Gestion Enseignants', 
      icon: 'fa-chalkboard-teacher' 
    },
    { 
      href: '/responsable/deliberations', 
      label: 'Délibérations', 
      icon: 'fa-gavel' 
    },
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  // Charger les enseignants depuis localStorage
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);

  useEffect(() => {
    const savedEnseignants = localStorage.getItem('enseignants');
    if (savedEnseignants) {
      setEnseignants(JSON.parse(savedEnseignants));
    } else {
      // Données par défaut
      const defaultEnseignants: Enseignant[] = [
        { 
          id: '1', 
          nom: "Pr. Ahmed Benali", 
          specialite: "IDA", 
          email: "ahmed.benali@uns.edu.sn", 
          telephone: "0612345678",
          matieres: ["Algorithmique", "Structures de données"],
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
        },
        { 
          id: '2', 
          nom: "Dr. Fatima Zahra", 
          specialite: "MIC", 
          email: "fatima.zahra@uns.edu.sn", 
          telephone: "0623456789",
          matieres: ["Base de données", "Systèmes d'information"],
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
        },
        { 
          id: '3', 
          nom: "Pr. Karim Belkacem", 
          specialite: "CD", 
          email: "karim.belkacem@uns.edu.sn", 
          telephone: "0634567890",
          matieres: ["Développement Web", "UX/UI Design"],
          imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg"
        },
      ];
      setEnseignants(defaultEnseignants);
    }
  }, []);

  // Sauvegarder les enseignants dans localStorage
  useEffect(() => {
    localStorage.setItem('enseignants', JSON.stringify(enseignants));
  }, [enseignants]);

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

  // Filtrer les enseignants par recherche
  const filteredEnseignants = enseignants.filter(e => 
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion CRUD des enseignants
  const handleAddOrUpdateEnseignant = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const nom = formData.get('nom') as string;
    const email = formData.get('email') as string;
    const telephone = formData.get('telephone') as string;
    const specialite = formData.get('specialite') as string;
    const matieres = (formData.get('matieres') as string).split(',').map(m => m.trim()).filter(m => m);
    
    // Validation de l'email
    if (!email.endsWith('@uns.edu.sn')) {
      alert("L'email doit être du format enseignant@uns.edu.sn");
      return;
    }
    
    const imageUrl = imagePreview || editingEnseignant?.imageUrl || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg";
    
    if (editingEnseignant) {
      // Mise à jour de l'enseignant existant
      setEnseignants(enseignants.map(e => 
        e.id === editingEnseignant.id ? { 
          ...e, 
          nom, 
          email, 
          telephone,
          specialite,
          matieres,
          imageUrl
        } : e
      ));
    } else {
      // Ajout d'un nouvel enseignant
      const newEnseignant: Enseignant = {
        id: Date.now().toString(),
        nom,
        email,
        telephone,
        specialite,
        matieres,
        imageUrl
      };
      setEnseignants([...enseignants, newEnseignant]);
    }
    
    setModalOpen(false);
    setEditingEnseignant(null);
    setImagePreview(null);
  };

  const handleEditEnseignant = (enseignant: Enseignant) => {
    setEditingEnseignant(enseignant);
    setImagePreview(enseignant.imageUrl);
    setModalOpen(true);
  };

  const handleDeleteEnseignant = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) {
      setEnseignants(enseignants.filter(e => e.id !== id));
    }
  };

  // Réinitialiser le formulaire quand le modal est fermé
  useEffect(() => {
    if (!modalOpen) {
      setEditingEnseignant(null);
      setImagePreview(null);
    }
  }, [modalOpen]);

  return (
    <RouteGuard roles={['responsable']}>
      <div className="flex h-screen bg-gray-50">
        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" 
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Barre latérale */}
        <aside 
          className={`fixed left-0 top-0 z-20 h-full w-64 bg-blue-800 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="p-4 border-b border-blue-600">
              <h2 className="text-xl font-bold">{user?.nomSpecialite} - Filière</h2>
              <p className="text-blue-200 text-sm">Responsable de Filière</p>
            </div>
            <nav className="flex-1 px-2 py-4">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center rounded-lg px-4 py-3 text-blue-100 hover:bg-blue-700 ${
                        pathname === link.href ? 'bg-blue-700' : ''
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <i className={`fa-solid ${link.icon} mr-3`}></i>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
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

        {/* Contenu principal */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* En-tête */}
          <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div className="flex items-center">
                {/* Bouton hamburger pour les petites écrans */}
                <button
                  className="mr-2 text-gray-500 hover:text-gray-600 md:hidden"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                >
                  <svg 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-800">Gestion des enseignants</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="hidden sm:block">{user?.username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </header>

          {/* Contenu */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full md:w-96">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un enseignant</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nom ou email de l'enseignant"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-6 md:mt-0"
                onClick={() => {
                  setEditingEnseignant(null);
                  setImagePreview(null);
                  setModalOpen(true);
                }}
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Ajouter un enseignant
              </button>
            </div>

            {/* Tableau des enseignants */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filière</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matières enseignées</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEnseignants.map((enseignant) => (
                    <tr key={enseignant.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={enseignant.imageUrl} 
                          alt={enseignant.nom}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{enseignant.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {enseignant.specialite}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{enseignant.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{enseignant.telephone}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {enseignant.matieres.map((matiere, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                              {matiere}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => handleEditEnseignant(enseignant)}
                        >
                          Modifier
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteEnseignant(enseignant.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEnseignants.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 mt-6 text-center">
                <i className="fa-solid fa-chalkboard-user text-4xl text-blue-500 mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">Aucun enseignant trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? `Aucun résultat pour "${searchTerm}"` 
                    : "Commencez par ajouter un nouvel enseignant"}
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Modal pour ajouter/modifier un enseignant */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingEnseignant ? 'Modifier Enseignant' : 'Ajouter un Enseignant'}
                </h3>
              </div>
              <form onSubmit={handleAddOrUpdateEnseignant}>
                <div className="p-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div 
                        className="w-24 h-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
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
                            <i className="fa-solid fa-user text-gray-400 text-3xl"></i>
                          </div>
                        )}
                      </div>
                      <button 
                        type="button"
                        className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet*</label>
                      <input 
                        type="text"
                        name="nom"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Ex: Pr. Ahmed Benali"
                        required
                        defaultValue={editingEnseignant?.nom || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                      <input 
                        type="email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Ex: enseignant@uns.edu.sn"
                        required
                        defaultValue={editingEnseignant?.email || ''}
                      />
                      <p className="text-xs text-gray-500 mt-1">Doit être du format @uns.edu.sn</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone*</label>
                      <input 
                        type="tel"
                        name="telephone"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Ex: 0612345678"
                        required
                        defaultValue={editingEnseignant?.telephone || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Filière*</label>
                      <select 
                        name="specialite"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                        defaultValue={editingEnseignant?.specialite || ''}
                      >
                        <option value="">Sélectionner une filière</option>
                        <option value="IDA">Informatique et Data Science</option>
                        <option value="MIC">Management et Ingénierie Commerciale</option>
                        <option value="CD">Communication Digitale</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Matières enseignées*</label>
                      <input 
                        type="text"
                        name="matieres"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Séparer par des virgules (ex: Algorithmique, Structures de données)"
                        required
                        defaultValue={editingEnseignant?.matieres.join(', ') || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => setModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingEnseignant ? 'Mettre à jour' : 'Enregistrer'}
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