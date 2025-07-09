'use client';

import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Interface pour les données des étudiants
interface Etudiant {
  id: string;
  numero: string;
  nom: string;
  moyenne: number;
  imageUrl: string;
  statut: string;
  mention: string;
  specialite: string;
  niveau: string;
}

// Fonction pour télécharger un fichier sans file-saver
const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Nettoyer
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

export default function DeliberationsEnseignant() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [niveau, setNiveau] = useState('L1');
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  
  // Niveaux académiques
  const niveauxAcademiques = ['L1', 'L2', 'L3', 'M1', 'M2'];

  // Fonction pour calculer la mention
  const calculerMention = (moyenne: number) => {
    if (moyenne >= 16) return 'Très Bien';
    if (moyenne >= 14) return 'Bien';
    if (moyenne >= 12) return 'Assez Bien';
    return '';
  };

  // Fonction pour générer un bulletin PDF (simulé)
  const genererBulletin = (etudiant: Etudiant) => {
    // Simulation de génération de PDF
    const pdfContent = `
      Bulletin de Notes
      =================
      
      Université: Université Internationale de Rabat
      Faculté: Faculté d'Informatique
      
      Étudiant: ${etudiant.nom}
      Numéro: ${etudiant.numero}
      Spécialité: ${etudiant.specialite}
      Niveau: ${etudiant.niveau}
      
      Moyenne Générale: ${etudiant.moyenne.toFixed(2)}/20
      Statut: ${etudiant.statut}
      Mention: ${etudiant.mention || 'Aucune'}
      
      Décision du Jury: ${etudiant.statut === 'Admis' ? 'Admis' : 'Non Admis'}
      
      Fait à Rabat, le ${new Date().toLocaleDateString()}
      Le Directeur des Études
    `;
    
    downloadFile(pdfContent, `bulletin-${etudiant.numero}.txt`, 'text/plain');
  };

  // Fonction pour exporter les résultats au format Excel (simulé)
  const exporterResultats = () => {
    // Création d'un CSV fictif
    let csvContent = "Nom,Numéro,Moyenne,Statut,Mention,Spécialité,Niveau\n";
    
    etudiants.forEach(etudiant => {
      csvContent += `${etudiant.nom},${etudiant.numero},${etudiant.moyenne.toFixed(2)},${etudiant.statut},${etudiant.mention},${etudiant.specialite},${etudiant.niveau}\n`;
    });
    
    downloadFile(csvContent, `resultats-${niveau}-${user?.nomSpecialite}.csv`, 'text/csv');
  };

  useEffect(() => {
    setLoading(true);
    
    // Simuler un chargement
    setTimeout(() => {
      // Charger les données depuis le localStorage
      const loadStudents = () => {
        if (!user?.nomSpecialite) return [];
        
        const key = `notes_${user.nomSpecialite}_${niveau}`;
        const savedStudents = localStorage.getItem(key);
        
        if (savedStudents) {
          const students = JSON.parse(savedStudents);
          
          // Convertir les données pour les délibérations
          const etudiantsAvecStatut = students.map((etudiant: any) => {
            let statut = "Admis";
            if (etudiant.moyenne < 10) statut = "Redouble";
            else if (etudiant.moyenne < 12) statut = "Rattrapage";
            
            return {
              id: etudiant.id,
              numero: etudiant.numero,
              nom: etudiant.nom,
              moyenne: etudiant.moyenne,
              imageUrl: etudiant.imageUrl,
              statut,
              mention: calculerMention(etudiant.moyenne),
              specialite: user.nomSpecialite,
              niveau
            };
          });
          
          return etudiantsAvecStatut;
        } else {
          // Charger les données initiales si rien n'est trouvé
          return getInitialData();
        }
      };
      
      const data = loadStudents();
      setEtudiants(data);
      setLoading(false);
    }, 500);
  }, [niveau, user?.nomSpecialite]);

  // Fonction pour obtenir les données initiales
  const getInitialData = (): Etudiant[] => {
    const data = {
      L1: [
        { id: '1', numero: 'L1-2024-001', nom: "Sarah Benali", moyenne: 16.5, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" },
        { id: '2', numero: 'L1-2024-002', nom: "Ahmed Mansouri", moyenne: 9.5, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" },
        { id: '3', numero: 'L1-2024-003', nom: "Fatima Zahra", moyenne: 14.0, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" },
        { id: '4', numero: 'L1-2024-004', nom: "Karim Belkacem", moyenne: 18.0, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg" },
        { id: '5', numero: 'L1-2024-005', nom: "Leila Ndiaye", moyenne: 7.2, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg" },
        { id: '6', numero: 'L1-2024-006', nom: "Youssef Chahdi", moyenne: 13.7, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg" },
        { id: '7', numero: 'L1-2024-007', nom: "Nadia El Amrani", moyenne: 15.8, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg" },
        { id: '8', numero: 'L1-2024-008', nom: "Mehdi Bouzid", moyenne: 11.3, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg" },
      ],
      L2: [
        { id: '3', numero: 'L2-2024-001', nom: "Fatima Zahra", moyenne: 15.0, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" },
        { id: '4', numero: 'L2-2024-002', nom: "Karim Belkacem", moyenne: 8.2, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg" },
        { id: '9', numero: 'L2-2024-003', nom: "Samira Toumi", moyenne: 16.7, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-10.jpg" },
        { id: '10', numero: 'L2-2024-004', nom: "Bilal Hassani", moyenne: 12.4, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-11.jpg" },
      ],
      L3: [
        { id: '5', numero: 'L3-2024-001', nom: "Leila Ndiaye", moyenne: 16.5, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg" },
        { id: '6', numero: 'L3-2024-002', nom: "Youssef Chahdi", moyenne: 12.3, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg" },
        { id: '11', numero: 'L3-2024-003', nom: "Omar Benjelloun", moyenne: 17.2, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-12.jpg" },
      ],
      M1: [
        { id: '12', numero: 'M1-2024-001', nom: "Lina Bouazza", moyenne: 15.5, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-13.jpg" },
        { id: '13', numero: 'M1-2024-002', nom: "Karim El Fassi", moyenne: 14.2, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-14.jpg" },
        { id: '14', numero: 'M1-2024-003', nom: "Sofia Amrani", moyenne: 16.8, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-15.jpg" },
        { id: '15', numero: 'M1-2024-004', nom: "Hakim Belhaj", moyenne: 11.7, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-16.jpg" },
      ],
      M2: [
        { id: '16', numero: 'M2-2024-001', nom: "Mehdi Zaoui", moyenne: 17.0, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-17.jpg" },
        { id: '17', numero: 'M2-2024-002', nom: "Nour El Houda", moyenne: 15.3, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-18.jpg" },
        { id: '18', numero: 'M2-2024-003', nom: "Yassin Benjelloun", moyenne: 18.5, imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-19.jpg" },
      ],
    };

    const etudiantsAvecStatut = (data[niveau as keyof typeof data] || []).map(etudiant => {
      let statut = "Admis";
      if (etudiant.moyenne < 10) statut = "Redouble";
      else if (etudiant.moyenne < 12) statut = "Rattrapage";
      
      return {
        ...etudiant,
        statut,
        mention: calculerMention(etudiant.moyenne),
        specialite: user?.nomSpecialite || "Inconnu",
        niveau
      };
    });

    return etudiantsAvecStatut;
  };

  // Calcul des statistiques
  const stats = etudiants.reduce((acc, etudiant) => {
    if (etudiant.statut === "Admis") acc.admis++;
    else if (etudiant.statut === "Rattrapage") acc.rattrapage++;
    else if (etudiant.statut === "Redouble") acc.redouble++;
    return acc;
  }, { admis: 0, rattrapage: 0, redouble: 0, total: etudiants.length });

  // Filtrage des étudiants
  const filteredEtudiants = etudiants.filter(e => 
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEtudiants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEtudiants = filteredEtudiants.slice(startIndex, startIndex + itemsPerPage);

  // Vérifie si le lien est actif
  const isActive = (path: string) => pathname === path;

  return (
    <RouteGuard roles={['enseignant']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-blue-800 text-white shadow-lg z-40">
          <div className="p-6 border-b border-blue-700">
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
          
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/enseignant/dashboard">
                  <div className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/enseignant/dashboard') ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white'} transition-colors cursor-pointer`}>
                    <i className="fa-solid fa-calendar-days text-lg"></i>
                    <span>Emploi du temps</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/notes">
                  <div className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/enseignant/notes') ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white'} transition-colors cursor-pointer`}>
                    <i className="fa-solid fa-file-lines text-lg"></i>
                    <span>Notes des Étudiants</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/absences">
                  <div className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/enseignant/absences') ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white'} transition-colors cursor-pointer`}>
                    <i className="fa-solid fa-user-xmark text-lg"></i>
                    <span>Absences</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/enseignant/deliberations">
                  <div className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/enseignant/deliberations') ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white'} transition-colors cursor-pointer`}>
                    <i className="fa-solid fa-clipboard-check text-lg"></i>
                    <span>Délibérations</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="absolute bottom-0 w-64 p-4 border-t border-blue-600">
            <div className="flex items-center space-x-3">
              <img 
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                alt="Professeur" 
                className="w-8 h-8 rounded-full" 
              />
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-blue-200">Enseignant {user?.nomSpecialite}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">Délibérations</h1>
                <p className="text-gray-600 text-sm">Résultats des examens par classe</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Année Académique</p>
                  <p className="text-sm text-gray-600">2023-2024</p>
                </div>
                <img 
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </div>
          </header>

          {/* Class Tabs */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex flex-wrap gap-2 py-4">
              {niveauxAcademiques.map((niv) => (
                <button
                  key={niv}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    niveau === niv 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-white text-blue-700 border border-blue-700 hover:bg-blue-50'
                  }`}
                  onClick={() => setNiveau(niv)}
                >
                  {niv.startsWith('L') ? 'Licence' : 'Master'} {niv.substring(1)} ({niv})
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 md:p-6 flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fa-solid fa-user-check text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admis</p>
                    <p className="text-xl font-bold text-gray-900">{stats.admis}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="fa-solid fa-user-xmark text-red-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Échec</p>
                    <p className="text-xl font-bold text-gray-900">{stats.redouble}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="fa-solid fa-clock text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rattrapage</p>
                    <p className="text-xl font-bold text-gray-900">{stats.rattrapage}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <i className="fa-solid fa-users text-blue-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Résultats {niveau.startsWith('L') ? 'Licence' : 'Master'} {niveau.substring(1)} - {user?.nomSpecialite}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Rechercher étudiant..." 
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                    <button 
                      className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
                      onClick={exporterResultats}
                    >
                      <i className="fa-solid fa-download mr-2"></i>Exporter
                    </button>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">Chargement des résultats...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note/20</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mention</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentEtudiants.length > 0 ? (
                          currentEtudiants.map((etudiant) => (
                            <tr key={etudiant.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img 
                                    src={etudiant.imageUrl} 
                                    alt={etudiant.nom} 
                                    className="w-8 h-8 rounded-full mr-3 object-cover" 
                                  />
                                  <span className="text-sm font-medium text-gray-900">{etudiant.nom}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {etudiant.numero}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {etudiant.moyenne.toFixed(1)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {etudiant.mention}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  etudiant.statut === "Admis" 
                                    ? 'bg-green-100 text-green-800' 
                                    : etudiant.statut === "Rattrapage"
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  {etudiant.statut}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <button 
                                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                                  onClick={() => genererBulletin(etudiant)}
                                  title="Télécharger le bulletin"
                                >
                                  <i className="fa-solid fa-download mr-1"></i> PDF
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                              Aucun étudiant trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-4 md:p-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <p className="text-sm text-gray-700">
                        Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredEtudiants.length)} sur {filteredEtudiants.length} résultats
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          className={`px-3 py-1 border border-gray-300 rounded text-sm ${
                            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Précédent
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            className={`px-3 py-1 rounded text-sm ${
                              currentPage === page 
                                ? 'bg-blue-700 text-white' 
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button 
                          className={`px-3 py-1 border border-gray-300 rounded text-sm ${
                            currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}