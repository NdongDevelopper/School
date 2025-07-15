// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import RouteGuard from '@/components/RouteGuard';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';

// // Définition des interfaces
// interface Course {
//   id: number;
//   code: string;
//   titre: string;
//   niveau: string;
//   credits: number;
//   enseignant: string;
//   statut: string;
//   semestre: string;
//   heures: number;
//   description?: string;
// }

// interface Session {
//   id: number;
//   moduleId: number;
//   titre: string;
//   jour: string;
//   heureDebut: string;
//   heureFin: string;
//   salle: string;
//   enseignant: string;
//   niveau: string;
// }

// export default function ProgrammesCours() {
//   const { user } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [moduleModalOpen, setModuleModalOpen] = useState(false);
//   const [planningModalOpen, setPlanningModalOpen] = useState(false);
//   const [editingModule, setEditingModule] = useState<Course | null>(null);
//   const [editingSession, setEditingSession] = useState<Session | null>(null);
//   const pathname = usePathname();
//   const router = useRouter();

//   // États pour les données
//   const [cours, setCours] = useState<Course[]>([]);
//   const [filteredCours, setFilteredCours] = useState<Course[]>([]);
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [selectedNiveau, setSelectedNiveau] = useState('Tous');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const [newModule, setNewModule] = useState<Course>({
//     id: 0,
//     code: '',
//     titre: '',
//     niveau: '',
//     credits: 0,
//     enseignant: '',
//     statut: 'Actif',
//     semestre: 'Semestre 1',
//     heures: 0,
//     description: ''
//   });
  
//   const [newSession, setNewSession] = useState({
//     moduleId: '',
//     jour: 'Lundi',
//     heureDebut: '08:00',
//     heureFin: '10:00',
//     salle: '',
//     enseignant: ''
//   });

//   // Données statiques
//   const niveauxAcademiques = ['L1', 'L2', 'L3', 'M1', 'M2'];
//   const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
//   const heuresCours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

//   const navLinks = [
//     { href: '/responsable/dashboard', label: 'Tableau de bord', icon: 'fa-chart-line' },
//     { href: '/responsable/programmes-cours', label: 'Programmes et Cours', icon: 'fa-book' },
//     { href: '/responsable/gestion-etudiants', label: 'Gestion Étudiants', icon: 'fa-users' },
//     { href: '/responsable/gestion-enseignants', label: 'Gestion Enseignants', icon: 'fa-chalkboard-teacher' },
//     { href: '/responsable/deliberations', label: 'Délibérations', icon: 'fa-gavel' },
//   ];

//   // Enseignants
//   const enseignants = [
//     { id: 1, nom: "Dr. Martin", modules: 3, statut: "Actif", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" },
//     { id: 2, nom: "Prof. Dubois", modules: 2, statut: "Absent", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg" },
//     { id: 3, nom: "Dr. Leila Ndiaye", modules: 4, statut: "Actif", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" }
//   ];

//   // Objectifs et débouchés
//   const objectifs = [
//     "Maîtrise du développement web full-stack",
//     "Compétences en développement mobile",
//     "Gestion de bases de données",
//     "Conception d'architectures logicielles",
//     "Méthodes agiles de gestion de projet"
//   ];

//   const debouches = [
//     "Développeur Full-Stack",
//     "Développeur Mobile",
//     "Ingénieur Logiciel",
//     "Architecte Logiciel",
//     "Chef de Projet IT"
//   ];

//   // Charger les données depuis localStorage
//   useEffect(() => {
//     const savedCours = localStorage.getItem('cours');
//     const savedSessions = localStorage.getItem('sessions');

//     if (savedCours) {
//       setCours(JSON.parse(savedCours));
//     } else {
//       // Données par défaut si aucune donnée n'est sauvegardée
//       const defaultCours: Course[] = [
//         { id: 1, code: "ALG101", titre: "Algorithmique de base", niveau: "L1", credits: 6, enseignant: "Pr. Ahmed Benali", statut: "Actif", semestre: "Semestre 1", heures: 60 },
//         { id: 2, code: "BD201", titre: "Bases de données avancées", niveau: "L2", credits: 5, enseignant: "Dr. Fatima Zahra", statut: "Actif", semestre: "Semestre 2", heures: 45 },
//         { id: 3, code: "WEB301", titre: "Développement Web", niveau: "L3", credits: 4, enseignant: "Pr. Karim Belkacem", statut: "Actif", semestre: "Semestre 1", heures: 60 },
//         { id: 4, code: "IA401", titre: "Introduction à l'IA", niveau: "M1", credits: 6, enseignant: "Dr. Leila Ndiaye", statut: "Actif", semestre: "Semestre 2", heures: 45 },
//         { id: 5, code: "ML501", titre: "Machine Learning", niveau: "M2", credits: 6, enseignant: "Pr. Youssef Chahdi", statut: "Actif", semestre: "Semestre 1", heures: 60 },
//       ];
//       setCours(defaultCours);
//     }

//     if (savedSessions) {
//       setSessions(JSON.parse(savedSessions));
//     } else {
//       const defaultSessions: Session[] = [
//         { id: 1, moduleId: 3, titre: "Développement Web", jour: "Lundi", heureDebut: "08:00", heureFin: "10:00", salle: "A12", enseignant: "Pr. Karim Belkacem", niveau: "L3" },
//         { id: 2, moduleId: 2, titre: "Bases de données", jour: "Mercredi", heureDebut: "10:30", heureFin: "12:30", salle: "B07", enseignant: "Dr. Fatima Zahra", niveau: "L2" },
//         { id: 3, moduleId: 1, titre: "Algorithmique", jour: "Mardi", heureDebut: "08:00", heureFin: "10:00", salle: "D15", enseignant: "Pr. Ahmed Benali", niveau: "L1" },
//         { id: 4, moduleId: 5, titre: "Machine Learning", jour: "Jeudi", heureDebut: "10:30", heureFin: "12:30", salle: "E09", enseignant: "Pr. Youssef Chahdi", niveau: "M2" },
//         { id: 5, moduleId: 4, titre: "Introduction à l'IA", jour: "Vendredi", heureDebut: "14:00", heureFin: "16:00", salle: "C22", enseignant: "Dr. Leila Ndiaye", niveau: "M1" }
//       ];
//       setSessions(defaultSessions);
//     }
//   }, []);

//   // Sauvegarder les données dans localStorage
//   useEffect(() => {
//     localStorage.setItem('cours', JSON.stringify(cours));
//   }, [cours]);

//   useEffect(() => {
//     localStorage.setItem('sessions', JSON.stringify(sessions));
//   }, [sessions]);

//   // Filtrer les cours
//   useEffect(() => {
//     let result = cours;
    
//     if (selectedNiveau !== 'Tous') {
//       result = result.filter(c => c.niveau === selectedNiveau);
//     }
    
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(c => 
//         c.code.toLowerCase().includes(term) || 
//         c.titre.toLowerCase().includes(term) ||
//         c.enseignant.toLowerCase().includes(term)
//       );
//     }
    
//     setFilteredCours(result);
//   }, [selectedNiveau, searchTerm, cours]);

//   // Gestion des modules
//   const handleAddModule = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const form = e.currentTarget as HTMLFormElement;
//     const formData = new FormData(form);
    
//     const code = formData.get('code') as string ?? '';
//     const titre = formData.get('titre') as string ?? '';
//     const niveau = formData.get('niveau') as string ?? '';
//     const credits = parseInt(formData.get('credits') as string ?? '0');
//     const enseignant = formData.get('enseignant') as string ?? '';
//     const statut = formData.get('statut') as string ?? 'Actif';
//     const semestre = formData.get('semestre') as string ?? 'Semestre 1';
//     const heures = parseInt(formData.get('heures') as string ?? '0');
//     const description = formData.get('description') as string ?? '';

//     if (editingModule) {
//       const updatedModule: Course = {
//         ...editingModule,
//         code,
//         titre,
//         niveau,
//         credits,
//         enseignant,
//         statut,
//         semestre,
//         heures,
//         description
//       };
//       setCours(cours.map(c => c.id === editingModule.id ? updatedModule : c));
//       setEditingModule(null);
//     } else {
//       const newId = Math.max(0, ...cours.map(c => c.id)) + 1;
//       const newCourse: Course = {
//         id: newId,
//         code,
//         titre,
//         niveau,
//         credits,
//         enseignant,
//         statut,
//         semestre,
//         heures,
//         description
//       };
//       setCours([...cours, newCourse]);
//     }
//     setModuleModalOpen(false);
//   };

//   const handleEditModule = (module: Course) => {
//     setEditingModule(module);
//     setNewModule(module);
//     setModuleModalOpen(true);
//   };

//   const handleDeleteModule = (id: number) => {
//     if (confirm("Êtes-vous sûr de vouloir supprimer ce module ?")) {
//       const updatedCours = cours.filter(c => c.id !== id);
//       setCours(updatedCours);
      
//       // Supprimer aussi les sessions associées
//       const updatedSessions = sessions.filter(s => s.moduleId !== id);
//       setSessions(updatedSessions);
//     }
//   };

//   // Gestion des sessions de planning
//   const handleAddSession = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const form = e.currentTarget as HTMLFormElement;
//     const formData = new FormData(form);
    
//     const moduleId = parseInt(formData.get('moduleId') as string ?? '0');
//     const jour = formData.get('jour') as string ?? 'Lundi';
//     const heureDebut = formData.get('heureDebut') as string ?? '08:00';
//     const heureFin = formData.get('heureFin') as string ?? '10:00';
//     const salle = formData.get('salle') as string ?? '';
//     const enseignant = formData.get('enseignant') as string ?? '';

//     const module = cours.find(m => m.id === moduleId);
    
//     if (editingSession) {
//       const updatedSession: Session = {
//         ...editingSession,
//         moduleId,
//         jour,
//         heureDebut,
//         heureFin,
//         salle,
//         enseignant,
//         titre: module?.titre || editingSession.titre,
//         niveau: module?.niveau || editingSession.niveau
//       };
//       setSessions(sessions.map(s => s.id === editingSession.id ? updatedSession : s));
//       setEditingSession(null);
//     } else {
//       const newId = Math.max(0, ...sessions.map(s => s.id)) + 1;
//       const newSession: Session = {
//         id: newId,
//         moduleId,
//         titre: module?.titre || '',
//         niveau: module?.niveau || '',
//         jour,
//         heureDebut,
//         heureFin,
//         salle,
//         enseignant
//       };
//       setSessions([...sessions, newSession]);
//     }
//     setPlanningModalOpen(false);
//   };

//   const handleEditSession = (session: Session) => {
//     setEditingSession(session);
//     setNewSession({ 
//       moduleId: session.moduleId.toString(),
//       jour: session.jour,
//       heureDebut: session.heureDebut,
//       heureFin: session.heureFin,
//       salle: session.salle,
//       enseignant: session.enseignant
//     });
//     setPlanningModalOpen(true);
//   };

//   const handleDeleteSession = (id: number) => {
//     if (confirm("Êtes-vous sûr de vouloir supprimer cette session ?")) {
//       setSessions(sessions.filter(s => s.id !== id));
//     }
//   };

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//   const handleLogout = () => router.push('/login');

//   return (
//     <RouteGuard roles={['responsable']}>
//       <div className="flex h-screen bg-gray-50">
//         {/* Mobile sidebar overlay */}
//         {sidebarOpen && (
//           <div 
//             className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" 
//             onClick={toggleSidebar}
//           ></div>
//         )}

//         {/* Sidebar */}
//         <aside 
//           className={`fixed left-0 top-0 z-20 h-full w-64 bg-indigo-800 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
//             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           }`}
//         >
//           <div className="flex h-full flex-col">
//             <div className="p-6 border-b border-indigo-600">
//               <div className="flex items-center space-x-3">
//                 <i className="fa-solid fa-graduation-cap text-2xl"></i>
//                 <div>
//                   <h2 className="font-bold text-lg">Responsable de Formation</h2>
//                   <p className="text-indigo-300 text-sm">Filière IDA</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-4 bg-indigo-900">
//               <div className="flex items-center space-x-3">
//                 <img 
//                   src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
//                   alt="Profile" 
//                   className="w-10 h-10 rounded-full" 
//                 />
//                 <div>
//                   <p className="font-medium text-sm">Responsable de Filière</p>
//                   <p className="text-xs text-indigo-300">Informatique (Développement Web & Mobile)</p>
//                 </div>
//               </div>
//             </div>

//             <nav className="flex-1 px-2 py-4">
//               <ul className="space-y-1">
//                 {navLinks.map((link) => (
//                   <li key={link.href}>
//                     <Link
//                       href={link.href}
//                       className={`flex items-center rounded-lg px-6 py-3 text-indigo-200 hover:bg-indigo-700 hover:text-white ${
//                         pathname === link.href ? 'bg-indigo-700 text-white' : ''
//                       }`}
//                       onClick={() => setSidebarOpen(false)}
//                     >
//                       <i className={`fa-solid ${link.icon} mr-3`}></i>
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//             <div className="p-4 border-t border-indigo-600">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <img 
//                     src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
//                     alt="Profile" 
//                     className="w-10 h-10 rounded-full" 
//                   />
//                   <div className="ml-3">
//                     <div className="text-sm font-medium">{user?.username}</div>
//                     <div className="text-xs text-indigo-300">Responsable</div>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={handleLogout}
//                   className="text-indigo-300 hover:text-white"
//                   title="Déconnexion"
//                 >
//                   <i className="fa-solid fa-right-from-bracket"></i>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main content */}
//         <div className="flex flex-1 flex-col overflow-hidden">
//           {/* Header */}
//           <header className="bg-white shadow-sm border-b p-4 sm:p-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 {/* Bouton hamburger pour les petites écrans */}
//                 <button
//                   className="mr-2 text-gray-500 hover:text-gray-600 md:hidden"
//                   onClick={toggleSidebar}
//                   aria-label="Toggle sidebar"
//                 >
//                   <svg 
//                     className="h-6 w-6" 
//                     fill="none" 
//                     viewBox="0 0 24 24" 
//                     stroke="currentColor"
//                   >
//                     <path 
//                       strokeLinecap="round" 
//                       strokeLinejoin="round" 
//                       strokeWidth={2} 
//                       d="M4 6h16M4 12h16M4 18h16" 
//                     />
//                   </svg>
//                 </button>
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-800">Programmes et Cours</h1>
//                   <p className="text-gray-600 text-sm hidden sm:block">Gestion des modules et planning académique</p>
//                 </div>
//               </div>
//               <button 
//                 className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-indigo-900 transition-colors flex items-center"
//                 onClick={() => {
//                   setEditingModule(null);
//                   setModuleModalOpen(true);
//                 }}
//               >
//                 <i className="fa-solid fa-plus mr-2"></i>
//                 <span className="hidden sm:inline">Nouveau Module</span>
//                 <span className="sm:hidden">Ajouter</span>
//               </button>
//             </div>
//           </header>

//           {/* Modal pour ajouter/modifier un module */}
//           {moduleModalOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//               <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
//                 <div className="p-6 border-b">
//                   <h2 className="text-xl font-bold">
//                     {editingModule ? 'Modifier Module' : 'Ajouter Nouveau Module'}
//                   </h2>
//                 </div>
                
//                 <div className="overflow-y-auto flex-1 p-6">
//                   <form id="module-form" onSubmit={handleAddModule}>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Code du Module*</label>
//                         <input
//                           type="text"
//                           name="code"
//                           defaultValue={editingModule?.code || ''}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           placeholder="Ex: WEB301"
//                           required
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Titre du Module*</label>
//                         <input
//                           type="text"
//                           name="titre"
//                           defaultValue={editingModule?.titre || ''}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           placeholder="Ex: Développement Web"
//                           required
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Niveau Académique*</label>
//                         <select
//                           name="niveau"
//                           defaultValue={editingModule?.niveau || ''}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           required
//                         >
//                           <option value="">Sélectionner un niveau</option>
//                           {niveauxAcademiques.map(niveau => (
//                             <option key={niveau} value={niveau}>{niveau}</option>
//                           ))}
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Crédits*</label>
//                         <input
//                           type="number"
//                           name="credits"
//                           defaultValue={editingModule?.credits || 0}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           min="1"
//                           max="10"
//                           required
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant*</label>
//                         <select
//                           name="enseignant"
//                           defaultValue={editingModule?.enseignant || ''}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           required
//                         >
//                           <option value="">Sélectionner un enseignant</option>
//                           {enseignants.map(ens => (
//                             <option key={ens.id} value={ens.nom}>{ens.nom}</option>
//                           ))}
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Statut*</label>
//                         <select
//                           name="statut"
//                           defaultValue={editingModule?.statut || 'Actif'}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           required
//                         >
//                           <option value="Actif">Actif</option>
//                           <option value="Inactif">Inactif</option>
//                           <option value="En attente">En attente</option>
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Semestre*</label>
//                         <select
//                           name="semestre"
//                           defaultValue={editingModule?.semestre || 'Semestre 1'}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           required
//                         >
//                           <option value="Semestre 1">Semestre 1</option>
//                           <option value="Semestre 2">Semestre 2</option>
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Heures*</label>
//                         <input
//                           type="number"
//                           name="heures"
//                           defaultValue={editingModule?.heures || 0}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           min="10"
//                           max="120"
//                           required
//                         />
//                       </div>
                      
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Description du Module</label>
//                         <textarea
//                           name="description"
//                           defaultValue={editingModule?.description || ''}
//                           rows={3}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           placeholder="Décrivez les objectifs et contenus du module..."
//                         ></textarea>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
                
//                 <div className="sticky bottom-0 p-6 border-t bg-gray-50 z-10">
//                   <div className="flex justify-end space-x-3">
//                     <button
//                       type="button"
//                       className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
//                       onClick={() => {
//                         setModuleModalOpen(false);
//                         setEditingModule(null);
//                       }}
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       type="submit"
//                       form="module-form"
//                       className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 font-medium shadow-md"
//                     >
//                       {editingModule ? 'Mettre à jour' : 'Enregistrer'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Modal pour ajouter/modifier une session de planning */}
//           {planningModalOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//               <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
//                 <div className="p-6 border-b">
//                   <h2 className="text-xl font-bold">
//                     {editingSession ? 'Modifier Session' : 'Ajouter Nouvelle Session'}
//                   </h2>
//                 </div>
//                 <form onSubmit={handleAddSession}>
//                   <div className="overflow-y-auto p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Module*</label>
//                         <select
//                           name="moduleId"
//                           value={newSession.moduleId}
//                           onChange={(e) => setNewSession({...newSession, moduleId: e.target.value})}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           required
//                         >
//                           <option value="">Sélectionner un module</option>
//                           {cours.map(c => (
//                             <option key={c.id} value={c.id}>{c.titre} ({c.code})</option>
//                           ))}
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Jour*</label>
//                         <select
//                           name="jour"
//                           value={newSession.jour}
//                           onChange={(e) => setNewSession({...newSession, jour: e.target.value})}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           required
//                         >
//                           {joursSemaine.map(jour => (
//                             <option key={jour} value={jour}>{jour}</option>
//                           ))}
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début*</label>
//                         <select
//                           name="heureDebut"
//                           value={newSession.heureDebut}
//                           onChange={(e) => setNewSession({...newSession, heureDebut: e.target.value})}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           required
//                         >
//                           {heuresCours.map(heure => (
//                             <option key={heure} value={heure}>{heure}</option>
//                           ))}
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin*</label>
//                         <select
//                           name="heureFin"
//                           value={newSession.heureFin}
//                           onChange={(e) => setNewSession({...newSession, heureFin: e.target.value})}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           required
//                         >
//                           {heuresCours.map(heure => (
//                             <option key={heure} value={heure}>{heure}</option>
//                           ))}
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Salle*</label>
//                         <input
//                           type="text"
//                           name="salle"
//                           value={newSession.salle}
//                           onChange={(e) => setNewSession({...newSession, salle: e.target.value})}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           placeholder="Ex: A12"
//                           required
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant*</label>
//                         <select
//                           name="enseignant"
//                           value={newSession.enseignant}
//                           onChange={(e) => setNewSession({...newSession, enseignant: e.target.value})}
//                           className="w-full border rounded-lg px-3 py-2 text-sm"
//                           required
//                         >
//                           <option value="">Sélectionner un enseignant</option>
//                           {enseignants.map(ens => (
//                             <option key={ens.id} value={ens.nom}>{ens.nom}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
//                     <button
//                       type="button"
//                       className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
//                       onClick={() => {
//                         setPlanningModalOpen(false);
//                         setEditingSession(null);
//                       }}
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-900"
//                     >
//                       {editingSession ? 'Mettre à jour' : 'Ajouter Session'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {/* Content */}
//           <main className="flex-1 overflow-y-auto">
//             {/* Stats Cards */}
//             <div className="p-4 sm:p-6">
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
//                 <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs sm:text-sm font-medium text-gray-600">Modules Totaux</p>
//                       <p className="text-xl sm:text-2xl font-bold text-indigo-800">{cours.length}</p>
//                       <p className="text-xs text-gray-500">modules</p>
//                     </div>
//                     <i className="fa-solid fa-book text-indigo-800 text-xl"></i>
//                   </div>
//                 </div>
//                 <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs sm:text-sm font-medium text-gray-600">Sessions Planifiées</p>
//                       <p className="text-xl sm:text-2xl font-bold text-indigo-800">{sessions.length}</p>
//                       <p className="text-xs text-gray-500">sessions</p>
//                     </div>
//                     <i className="fa-solid fa-calendar-alt text-indigo-800 text-xl"></i>
//                   </div>
//                 </div>
//                 <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs sm:text-sm font-medium text-gray-600">Enseignants</p>
//                       <p className="text-xl sm:text-2xl font-bold text-indigo-800">{enseignants.length}</p>
//                       <p className="text-xs text-gray-500">actifs</p>
//                     </div>
//                     <i className="fa-solid fa-chalkboard-teacher text-indigo-800 text-xl"></i>
//                   </div>
//                 </div>
//                 <div className="hidden lg:block bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs sm:text-sm font-medium text-gray-600">Niveaux</p>
//                       <p className="text-xl sm:text-2xl font-bold text-indigo-800">{niveauxAcademiques.length}</p>
//                       <p className="text-xs text-gray-500">académiques</p>
//                     </div>
//                     <i className="fa-solid fa-layer-group text-indigo-800 text-xl"></i>
//                   </div>
//                 </div>
//                 <div className="hidden lg:block bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs sm:text-sm font-medium text-gray-600">Étudiants</p>
//                       <p className="text-xl sm:text-2xl font-bold text-indigo-800">248</p>
//                       <p className="text-xs text-gray-500">inscrits</p>
//                     </div>
//                     <i className="fa-solid fa-users text-indigo-800 text-xl"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Main Content Grid */}
//             <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Modules Management */}
//               <div className="lg:col-span-2">
//                 <div className="bg-white rounded-lg shadow-sm border">
//                   <div className="p-4 sm:p-6 border-b">
//                     <h3 className="text-lg font-semibold text-gray-800">Gestion des Modules</h3>
//                     <p className="text-gray-600 text-sm">Ajouter/modifier les modules par classe</p>
//                   </div>
//                   <div className="p-4 sm:p-6">
//                     <div className="flex flex-col md:flex-row gap-3 mb-4 sm:mb-6">
//                       <select 
//                         className="border rounded-lg px-3 py-2 text-sm w-full"
//                         value={selectedNiveau}
//                         onChange={(e) => setSelectedNiveau(e.target.value)}
//                       >
//                         <option value="Tous">Toutes les classes</option>
//                         {niveauxAcademiques.map((n) => (
//                           <option key={n} value={n}>{n}</option>
//                         ))}
//                       </select>
//                       <input 
//                         type="text" 
//                         placeholder="Rechercher un module..." 
//                         className="border rounded-lg px-3 py-2 text-sm flex-1 w-full"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>

//                     <div className="space-y-3">
//                       {filteredCours.length > 0 ? (
//                         filteredCours.map((c) => (
//                           <div key={c.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
//                             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
//                               <div className="flex-1">
//                                 <h4 className="font-medium text-gray-800">{c.titre}</h4>
//                                 <p className="text-sm text-gray-600">{c.niveau} - {c.heures}h - {c.enseignant}</p>
//                                 <div className="flex flex-wrap gap-2 mt-2">
//                                   <span className={`px-2 py-1 text-xs rounded ${
//                                     c.statut === 'Actif' 
//                                       ? 'bg-green-100 text-green-800' 
//                                       : c.statut === 'Inactif'
//                                         ? 'bg-red-100 text-red-800'
//                                         : 'bg-yellow-100 text-yellow-800'
//                                   }`}>
//                                     {c.statut}
//                                   </span>
//                                   <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
//                                     {c.semestre}
//                                   </span>
//                                   <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
//                                     {c.credits} crédits
//                                   </span>
//                                 </div>
//                               </div>
//                               <div className="flex space-x-2 sm:self-start">
//                                 <button 
//                                   className="text-indigo-800 hover:text-indigo-900"
//                                   onClick={() => handleEditModule(c)}
//                                 >
//                                   <i className="fa-solid fa-edit"></i>
//                                 </button>
//                                 <button 
//                                   className="text-red-500 hover:text-red-700"
//                                   onClick={() => handleDeleteModule(c.id)}
//                                 >
//                                   <i className="fa-solid fa-trash"></i>
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-center py-8 text-gray-500">
//                           <i className="fa-solid fa-book-open-reader text-4xl mb-3"></i>
//                           <p>Aucun module trouvé</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Planning Section */}
//                 <div className="bg-white rounded-lg shadow-sm border mt-6">
//                   <div className="p-4 sm:p-6 border-b">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-800">Planning des Cours</h3>
//                         <p className="text-gray-600 text-sm">Organisation et suivi des emplois du temps</p>
//                       </div>
//                       <button 
//                         className="text-indigo-800 hover:text-indigo-900 flex items-center text-sm sm:text-base"
//                         onClick={() => {
//                           setNewSession({
//                             moduleId: '',
//                             jour: 'Lundi',
//                             heureDebut: '08:00',
//                             heureFin: '10:00',
//                             salle: '',
//                             enseignant: ''
//                           });
//                           setEditingSession(null);
//                           setPlanningModalOpen(true);
//                         }}
//                       >
//                         <i className="fa-solid fa-plus mr-2"></i>
//                         Ajouter une session
//                       </button>
//                     </div>
//                   </div>
//                   <div className="p-3 sm:p-6">
//                     <div className="overflow-x-auto">
//                       <div className="min-w-[700px]">
//                         <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs">
//                           {/* En-têtes des jours */}
//                           <div className="font-medium text-center p-2">Heure</div>
//                           {joursSemaine.map(jour => (
//                             <div key={jour} className="font-medium text-center p-2">{jour}</div>
//                           ))}
                          
//                           {/* Lignes horaires */}
//                           {heuresCours.map(heure => (
//                             <React.Fragment key={heure}>
//                               <div className="font-medium text-center p-2 border-t">{heure}</div>
//                               {joursSemaine.map(jour => (
//                                 <div 
//                                   key={`${jour}-${heure}`}
//                                   className="p-2 border-t relative min-h-[70px] sm:min-h-[80px]"
//                                 >
//                                   {sessions
//                                     .filter(s => s.jour === jour && s.heureDebut === heure)
//                                     .map(session => (
//                                       <div 
//                                         key={session.id}
//                                         className="absolute inset-1 bg-indigo-800 text-white p-1 sm:p-2 rounded cursor-pointer hover:bg-indigo-900"
//                                         onClick={() => handleEditSession(session)}
//                                       >
//                                         <div className="font-medium truncate text-xs sm:text-sm">{session.titre}</div>
//                                         <div className="text-xs">{session.salle}</div>
//                                         <div className="text-xs">{session.enseignant.split(' ')[0]}</div>
//                                         <div className="text-xs">{session.niveau}</div>
//                                       </div>
//                                     ))
//                                   }
//                                 </div>
//                               ))}
//                             </React.Fragment>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="mt-6">
//                       <h4 className="font-medium text-gray-800 mb-2">Sessions Planifiées</h4>
//                       <div className="space-y-3">
//                         {sessions.map(session => (
//                           <div 
//                             key={session.id}
//                             className="border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:bg-gray-50 cursor-pointer"
//                             onClick={() => handleEditSession(session)}
//                           >
//                             <div className="flex-1">
//                               <div className="font-medium">{session.titre}</div>
//                               <div className="text-sm text-gray-600">
//                                 {session.jour} • {session.heureDebut} - {session.heureFin} • {session.salle}
//                               </div>
//                               <div className="text-sm">{session.enseignant} • {session.niveau}</div>
//                             </div>
//                             <div className="flex space-x-2 self-end">
//                               <button 
//                                 className="text-indigo-800 hover:text-indigo-900"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleEditSession(session);
//                                 }}
//                               >
//                                 <i className="fa-solid fa-edit"></i>
//                               </button>
//                               <button 
//                                 className="text-red-500 hover:text-red-700"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDeleteSession(session.id);
//                                 }}
//                               >
//                                 <i className="fa-solid fa-trash"></i>
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Sidebar */}
//               <div className="space-y-6">
//                 {/* Teacher Assignments */}
//                 <div className="bg-white rounded-lg shadow-sm border">
//                   <div className="p-4 sm:p-6 border-b">
//                     <h3 className="text-lg font-semibold text-gray-800">Affectation Enseignants</h3>
//                   </div>
//                   <div className="p-4 sm:p-6 space-y-4">
//                     {enseignants.map((enseignant) => (
//                       <div key={enseignant.id} className="flex items-center space-x-3">
//                         <img 
//                           src={enseignant.imageUrl} 
//                           alt="Teacher" 
//                           className="w-10 h-10 rounded-full" 
//                         />
//                         <div className="flex-1">
//                           <p className="font-medium text-sm">{enseignant.nom}</p>
//                           <p className="text-xs text-gray-600">{enseignant.modules} modules</p>
//                         </div>
//                         <span className={`px-2 py-1 text-xs rounded ${
//                           enseignant.statut === 'Actif' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {enseignant.statut}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Objectives */}
//                 <div className="bg-white rounded-lg shadow-sm border">
//                   <div className="p-4 sm:p-6 border-b">
//                     <h3 className="text-lg font-semibold text-gray-800">Objectifs Pédagogiques</h3>
//                   </div>
//                   <div className="p-4 sm:p-6">
//                     <ul className="space-y-3 text-sm">
//                       {objectifs.map((objectif, index) => (
//                         <li key={`obj-${index}`} className="flex items-start space-x-2">
//                           <i className="fa-solid fa-check text-green-500 mt-1"></i>
//                           <span>{objectif}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//                 {/* Career Prospects */}
//                 <div className="bg-white rounded-lg shadow-sm border">
//                   <div className="p-4 sm:p-6 border-b">
//                     <h3 className="text-lg font-semibold text-gray-800">Débouchés Professionnels</h3>
//                   </div>
//                   <div className="p-4 sm:p-6">
//                     <div className="space-y-3 text-sm">
//                       {debouches.map((debouche, index) => (
//                         <div key={`deb-${index}`} className="flex items-center space-x-2">
//                           <i className={`fa-solid ${
//                             debouche.includes('Full-Stack') ? 'fa-code' :
//                             debouche.includes('Mobile') ? 'fa-mobile-alt' : 
//                             debouche.includes('Logiciel') ? 'fa-cog' : 'fa-user-tie'
//                           } text-indigo-800`}></i>
//                           <span>{debouche}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </RouteGuard>
//   );
// }




'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// Définition des interfaces
interface Course {
  id: number;
  code: string;
  titre: string;
  niveau: string;
  credits: number;
  enseignant: string;
  statut: string;
  semestre: string;
  heures: number;
  description?: string;
}

interface Session {
  id: number;
  moduleId: number;
  titre: string;
  jour: string;
  heureDebut: string;
  heureFin: string;
  salle: string;
  enseignant: string;
  niveau: string;
}

export default function ProgrammesCours() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [planningModalOpen, setPlanningModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Course | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // États pour les données
  const [cours, setCours] = useState<Course[]>([]);
  const [filteredCours, setFilteredCours] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedNiveau, setSelectedNiveau] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const [newModule, setNewModule] = useState<Course>({
    id: 0,
    code: '',
    titre: '',
    niveau: '',
    credits: 0,
    enseignant: '',
    statut: 'Actif',
    semestre: 'Semestre 1',
    heures: 0,
    description: ''
  });

  const [newSession, setNewSession] = useState({
    moduleId: '',
    jour: 'Lundi',
    heureDebut: '08:00',
    heureFin: '10:00',
    salle: '',
    enseignant: ''
  });

  // Données statiques
  const niveauxAcademiques = ['L1', 'L2', 'L3', 'M1', 'M2'];
  const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const heuresCours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const navLinks = [
    { href: '/responsable/dashboard', label: 'Tableau de bord', icon: 'fa-chart-line' },
    { href: '/responsable/programmes-cours', label: 'Programmes et Cours', icon: 'fa-book' },
    { href: '/responsable/gestion-etudiants', label: 'Gestion Étudiants', icon: 'fa-users' },
    { href: '/responsable/gestion-enseignants', label: 'Gestion Enseignants', icon: 'fa-chalkboard-teacher' },
    { href: '/responsable/deliberations', label: 'Délibérations', icon: 'fa-gavel' },
  ];

  // Enseignants
  const enseignants = [
    { id: 1, nom: "Dr. Martin", modules: 3, statut: "Actif", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" },
    { id: 2, nom: "Prof. Dubois", modules: 2, statut: "Absent", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg" },
    { id: 3, nom: "Dr. Leila Ndiaye", modules: 4, statut: "Actif", imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" }
  ];

  // Objectifs et débouchés
  const objectifs = [
    "Maîtrise du développement web full-stack",
    "Compétences en développement mobile",
    "Gestion de bases de données",
    "Conception d'architectures logicielles",
    "Méthodes agiles de gestion de projet"
  ];

  const debouches = [
    "Développeur Full-Stack",
    "Développeur Mobile",
    "Ingénieur Logiciel",
    "Architecte Logiciel",
    "Chef de Projet IT"
  ];

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedCours = localStorage.getItem('cours');
    const savedSessions = localStorage.getItem('sessions');

    if (savedCours) {
      setCours(JSON.parse(savedCours));
    } else {
      // Données par défaut si aucune donnée n'est sauvegardée
      const defaultCours: Course[] = [
        { id: 1, code: "ALG101", titre: "Algorithmique de base", niveau: "L1", credits: 6, enseignant: "Pr. Ahmed Benali", statut: "Actif", semestre: "Semestre 1", heures: 60 },
        { id: 2, code: "BD201", titre: "Bases de données avancées", niveau: "L2", credits: 5, enseignant: "Dr. Fatima Zahra", statut: "Actif", semestre: "Semestre 2", heures: 45 },
        { id: 3, code: "WEB301", titre: "Développement Web", niveau: "L3", credits: 4, enseignant: "Pr. Karim Belkacem", statut: "Actif", semestre: "Semestre 1", heures: 60 },
        { id: 4, code: "IA401", titre: "Introduction à l'IA", niveau: "M1", credits: 6, enseignant: "Dr. Leila Ndiaye", statut: "Actif", semestre: "Semestre 2", heures: 45 },
        { id: 5, code: "ML501", titre: "Machine Learning", niveau: "M2", credits: 6, enseignant: "Pr. Youssef Chahdi", statut: "Actif", semestre: "Semestre 1", heures: 60 },
      ];
      setCours(defaultCours);
    }

    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      const defaultSessions: Session[] = [
        { id: 1, moduleId: 3, titre: "Développement Web", jour: "Lundi", heureDebut: "08:00", heureFin: "10:00", salle: "A12", enseignant: "Pr. Karim Belkacem", niveau: "L3" },
        { id: 2, moduleId: 2, titre: "Bases de données", jour: "Mercredi", heureDebut: "10:30", heureFin: "12:30", salle: "B07", enseignant: "Dr. Fatima Zahra", niveau: "L2" },
        { id: 3, moduleId: 1, titre: "Algorithmique", jour: "Mardi", heureDebut: "08:00", heureFin: "10:00", salle: "D15", enseignant: "Pr. Ahmed Benali", niveau: "L1" },
        { id: 4, moduleId: 5, titre: "Machine Learning", jour: "Jeudi", heureDebut: "10:30", heureFin: "12:30", salle: "E09", enseignant: "Pr. Youssef Chahdi", niveau: "M2" },
        { id: 5, moduleId: 4, titre: "Introduction à l'IA", jour: "Vendredi", heureDebut: "14:00", heureFin: "16:00", salle: "C22", enseignant: "Dr. Leila Ndiaye", niveau: "M1" }
      ];
      setSessions(defaultSessions);
    }
  }, []);

  // Sauvegarder les données dans localStorage
  useEffect(() => {
    localStorage.setItem('cours', JSON.stringify(cours));
  }, [cours]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Filtrer les cours
  useEffect(() => {
    let result = cours;

    if (selectedNiveau !== 'Tous') {
      result = result.filter(c => c.niveau === selectedNiveau);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.code.toLowerCase().includes(term) ||
        c.titre.toLowerCase().includes(term) ||
        c.enseignant.toLowerCase().includes(term)
      );
    }

    setFilteredCours(result);
  }, [selectedNiveau, searchTerm, cours]);

  // Gestion des modules
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const code = formData.get('code') as string ?? '';
    const titre = formData.get('titre') as string ?? '';
    const niveau = formData.get('niveau') as string ?? '';
    const credits = parseInt(formData.get('credits') as string ?? '0');
    const enseignant = formData.get('enseignant') as string ?? '';
    const statut = formData.get('statut') as string ?? 'Actif';
    const semestre = formData.get('semestre') as string ?? 'Semestre 1';
    const heures = parseInt(formData.get('heures') as string ?? '0');
    const description = formData.get('description') as string ?? '';

    if (editingModule) {
      const updatedModule: Course = {
        ...editingModule,
        code,
        titre,
        niveau,
        credits,
        enseignant,
        statut,
        semestre,
        heures,
        description
      };
      setCours(cours.map(c => c.id === editingModule.id ? updatedModule : c));
      setEditingModule(null);
    } else {
      const newId = Math.max(0, ...cours.map(c => c.id)) + 1;
      const newCourse: Course = {
        id: newId,
        code,
        titre,
        niveau,
        credits,
        enseignant,
        statut,
        semestre,
        heures,
        description
      };
      setCours([...cours, newCourse]);
    }
    setModuleModalOpen(false);
  };

  const handleEditModule = (module: Course) => {
    setEditingModule(module);
    setNewModule(module);
    setModuleModalOpen(true);
  };

  const handleDeleteModule = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce module ?")) {
      const updatedCours = cours.filter(c => c.id !== id);
      setCours(updatedCours);

      // Supprimer aussi les sessions associées
      const updatedSessions = sessions.filter(s => s.moduleId !== id);
      setSessions(updatedSessions);
    }
  };

  // Gestion des sessions de planning
  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const moduleId = parseInt(formData.get('moduleId') as string ?? '0');
    const jour = formData.get('jour') as string ?? 'Lundi';
    const heureDebut = formData.get('heureDebut') as string ?? '08:00';
    const heureFin = formData.get('heureFin') as string ?? '10:00';
    const salle = formData.get('salle') as string ?? '';
    const enseignant = formData.get('enseignant') as string ?? '';

    const module = cours.find(m => m.id === moduleId);

    if (editingSession) {
      const updatedSession: Session = {
        ...editingSession,
        moduleId,
        jour,
        heureDebut,
        heureFin,
        salle,
        enseignant,
        titre: module?.titre || editingSession.titre,
        niveau: module?.niveau || editingSession.niveau
      };
      setSessions(sessions.map(s => s.id === editingSession.id ? updatedSession : s));
      setEditingSession(null);
    } else {
      const newId = Math.max(0, ...sessions.map(s => s.id)) + 1;
      const newSession: Session = {
        id: newId,
        moduleId,
        titre: module?.titre || '',
        niveau: module?.niveau || '',
        jour,
        heureDebut,
        heureFin,
        salle,
        enseignant
      };
      setSessions([...sessions, newSession]);
    }
    setPlanningModalOpen(false);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setNewSession({
      moduleId: session.moduleId.toString(),
      jour: session.jour,
      heureDebut: session.heureDebut,
      heureFin: session.heureFin,
      salle: session.salle,
      enseignant: session.enseignant
    });
    setPlanningModalOpen(true);
  };

  const handleDeleteSession = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette session ?")) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => router.push('/login');

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
            <div className="p-6 border-b border-indigo-600">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-graduation-cap text-2xl"></i>
                <div>
                  <h2 className="font-bold text-lg">Responsable de Formation</h2>
                  <p className="text-indigo-300 text-sm">Filière IDA</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-900">
              <div className="flex items-center space-x-3">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">Responsable de Filière</p>
                  <p className="text-xs text-indigo-300">Informatique (Développement Web & Mobile)</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-2 py-4">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center rounded-lg px-6 py-3 text-indigo-200 hover:bg-indigo-700 hover:text-white ${
                        pathname === link.href ? 'bg-indigo-700 text-white' : ''
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
            <div className="p-4 border-t border-indigo-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium">{user?.username}</div>
                    <div className="text-xs text-indigo-300">Responsable</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-indigo-300 hover:text-white"
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
          <header className="bg-white shadow-sm border-b p-4 sm:p-6">
            <div className="flex items-center justify-between">
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
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Programmes et Cours</h1>
                  <p className="text-gray-600 text-sm hidden sm:block">Gestion des modules et planning académique</p>
                </div>
              </div>
              <button
                className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-indigo-900 transition-colors flex items-center"
                onClick={() => {
                  setEditingModule(null);
                  setModuleModalOpen(true);
                }}
              >
                <i className="fa-solid fa-plus mr-2"></i>
                <span className="hidden sm:inline">Nouveau Module</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
            </div>
          </header>

          {/* Modal pour ajouter/modifier un module */}
          {moduleModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">
                    {editingModule ? 'Modifier Module' : 'Ajouter Nouveau Module'}
                  </h2>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                  <form id="module-form" onSubmit={handleAddModule}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code du Module*</label>
                        <input
                          type="text"
                          name="code"
                          defaultValue={editingModule?.code || ''}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Ex: WEB301"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre du Module*</label>
                        <input
                          type="text"
                          name="titre"
                          defaultValue={editingModule?.titre || ''}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Ex: Développement Web"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Niveau Académique*</label>
                        <select
                          name="niveau"
                          defaultValue={editingModule?.niveau || ''}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Sélectionner un niveau</option>
                          {niveauxAcademiques.map(niveau => (
                            <option key={niveau} value={niveau}>{niveau}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Crédits*</label>
                        <input
                          type="number"
                          name="credits"
                          defaultValue={editingModule?.credits || 0}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          min="1"
                          max="30"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant*</label>
                        <select
                          name="enseignant"
                          defaultValue={editingModule?.enseignant || ''}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Sélectionner un enseignant</option>
                          {enseignants.map(ens => (
                            <option key={ens.id} value={ens.nom}>{ens.nom}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut*</label>
                        <select
                          name="statut"
                          defaultValue={editingModule?.statut || 'Actif'}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        >
                          <option value="Actif">Actif</option>
                          <option value="Inactif">Inactif</option>
                          <option value="En attente">En attente</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Semestre*</label>
                        <select
                          name="semestre"
                          defaultValue={editingModule?.semestre || 'Semestre 1'}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        >
                          <option value="Semestre 1">Semestre 1</option>
                          <option value="Semestre 2">Semestre 2</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heures*</label>
                        <input
                          type="number"
                          name="heures"
                          defaultValue={editingModule?.heures || 0}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          min="10"
                          max="120"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description du Module</label>
                        <textarea
                          name="description"
                          defaultValue={editingModule?.description || ''}
                          rows={3}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Décrivez les objectifs et contenus du module..."
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="sticky bottom-0 p-6 border-t bg-gray-50 z-10">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setModuleModalOpen(false);
                        setEditingModule(null);
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      form="module-form"
                      className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 font-medium shadow-md"
                    >
                      {editingModule ? 'Mettre à jour' : 'Enregistrer'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal pour ajouter/modifier une session de planning */}
          {planningModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">
                    {editingSession ? 'Modifier Session' : 'Ajouter Nouvelle Session'}
                  </h2>
                </div>
                <form onSubmit={handleAddSession}>
                  <div className="overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Module*</label>
                        <select
                          name="moduleId"
                          value={newSession.moduleId}
                          onChange={(e) => setNewSession({...newSession, moduleId: e.target.value})}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Sélectionner un module</option>
                          {cours.map(c => (
                            <option key={c.id} value={c.id}>{c.titre} ({c.code})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jour*</label>
                        <select
                          name="jour"
                          value={newSession.jour}
                          onChange={(e) => setNewSession({...newSession, jour: e.target.value})}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        >
                          {joursSemaine.map(jour => (
                            <option key={jour} value={jour}>{jour}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début*</label>
                        <select
                          name="heureDebut"
                          value={newSession.heureDebut}
                          onChange={(e) => setNewSession({...newSession, heureDebut: e.target.value})}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        >
                          {heuresCours.map(heure => (
                            <option key={heure} value={heure}>{heure}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin*</label>
                        <select
                          name="heureFin"
                          value={newSession.heureFin}
                          onChange={(e) => setNewSession({...newSession, heureFin: e.target.value})}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        >
                          {heuresCours.map(heure => (
                            <option key={heure} value={heure}>{heure}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salle*</label>
                        <input
                          type="text"
                          name="salle"
                          value={newSession.salle}
                          onChange={(e) => setNewSession({...newSession, salle: e.target.value})}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Ex: A12"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant*</label>
                        <select
                          name="enseignant"
                          value={newSession.enseignant}
                          onChange={(e) => setNewSession({...newSession, enseignant: e.target.value})}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Sélectionner un enseignant</option>
                          {enseignants.map(ens => (
                            <option key={ens.id} value={ens.nom}>{ens.nom}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setPlanningModalOpen(false);
                        setEditingSession(null);
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-900"
                    >
                      {editingSession ? 'Mettre à jour' : 'Ajouter Session'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            {/* Stats Cards */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Modules Totaux</p>
                      <p className="text-xl sm:text-2xl font-bold text-indigo-800">{cours.length}</p>
                      <p className="text-xs text-gray-500">modules</p>
                    </div>
                    <i className="fa-solid fa-book text-indigo-800 text-xl"></i>
                  </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Sessions Planifiées</p>
                      <p className="text-xl sm:text-2xl font-bold text-indigo-800">{sessions.length}</p>
                      <p className="text-xs text-gray-500">sessions</p>
                    </div>
                    <i className="fa-solid fa-calendar-alt text-indigo-800 text-xl"></i>
                  </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Crédits Totaux (L1)</p>
                      <p className="text-xl sm:text-2xl font-bold text-indigo-800">
                        {cours
                          .filter(c => c.niveau === 'L1')
                          .reduce((sum, c) => sum + c.credits, 0)}
                      </p>
                      <p className="text-xs text-gray-500">crédits</p>
                    </div>
                    <i className="fa-solid fa-star text-indigo-800 text-xl"></i>
                  </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Modules Actifs</p>
                      <p className="text-xl sm:text-2xl font-bold text-indigo-800">
                        {cours.filter(c => c.statut === 'Actif').length}
                      </p>
                      <p className="text-xs text-gray-500">modules</p>
                    </div>
                    <i className="fa-solid fa-circle-check text-indigo-800 text-xl"></i>
                  </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Enseignants Disponibles</p>
                      <p className="text-xl sm:text-2xl font-bold text-indigo-800">
                        {enseignants.filter(e => e.statut === 'Actif').length}
                      </p>
                      <p className="text-xs text-gray-500">enseignants</p>
                    </div>
                    <i className="fa-solid fa-user-tie text-indigo-800 text-xl"></i>
                  </div>
                </div>
              </div>

              {/* Section Programme */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Programme de la Filière Informatique (IDA)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Objectifs du Programme</h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {objectifs.map((obj, index) => (
                        <li key={index}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Débouchés Professionnels</h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {debouches.map((deb, index) => (
                        <li key={index}>{deb}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section Modules */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Gestion des Modules de Cours</h2>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                  <div className="w-full sm:w-1/3">
                    <label htmlFor="niveau-filter" className="sr-only">Filtrer par niveau</label>
                    <select
                      id="niveau-filter"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={selectedNiveau}
                      onChange={(e) => setSelectedNiveau(e.target.value)}
                    >
                      <option value="Tous">Tous les Niveaux</option>
                      {niveauxAcademiques.map(niveau => (
                        <option key={niveau} value={niveau}>{niveau}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-2/3">
                    <label htmlFor="search-module" className="sr-only">Rechercher un module</label>
                    <input
                      type="text"
                      id="search-module"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      placeholder="Rechercher par code, titre, enseignant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Modules Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="py-3 px-4 rounded-tl-lg">Code</th>
                        <th className="py-3 px-4">Titre du Module</th>
                        <th className="py-3 px-4">Niveau</th>
                        <th className="py-3 px-4">Crédits</th>
                        <th className="py-3 px-4">Enseignant</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4">Semestre</th>
                        <th className="py-3 px-4">Heures</th>
                        <th className="py-3 px-4 rounded-tr-lg text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredCours.length > 0 ? (
                        filteredCours.map((module) => (
                          <tr key={module.id} className="hover:bg-gray-50 text-sm text-gray-700">
                            <td className="py-3 px-4">{module.code}</td>
                            <td className="py-3 px-4">{module.titre}</td>
                            <td className="py-3 px-4">{module.niveau}</td>
                            <td className="py-3 px-4">{module.credits}</td>
                            <td className="py-3 px-4">{module.enseignant}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  module.statut === 'Actif' ? 'bg-green-100 text-green-800' :
                                  module.statut === 'Inactif' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {module.statut}
                              </span>
                            </td>
                            <td className="py-3 px-4">{module.semestre}</td>
                            <td className="py-3 px-4">{module.heures}h</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleEditModule(module)}
                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                                title="Modifier"
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteModule(module.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Supprimer"
                              >
                                <i className="fa-solid fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="py-6 text-center text-gray-500">
                            Aucun module trouvé pour les critères sélectionnés.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section Planning */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Planning des Sessions de Cours</h2>
                  <button
                    className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-indigo-900 transition-colors flex items-center text-sm"
                    onClick={() => {
                      setEditingSession(null);
                      setNewSession({
                        moduleId: '',
                        jour: 'Lundi',
                        heureDebut: '08:00',
                        heureFin: '10:00',
                        salle: '',
                        enseignant: ''
                      });
                      setPlanningModalOpen(true);
                    }}
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    <span className="hidden sm:inline">Nouvelle Session</span>
                    <span className="sm:hidden">Ajouter</span>
                  </button>
                </div>

                {/* Planning Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="py-3 px-4 rounded-tl-lg">Module</th>
                        <th className="py-3 px-4">Niveau</th>
                        <th className="py-3 px-4">Jour</th>
                        <th className="py-3 px-4">Heure Début</th>
                        <th className="py-3 px-4">Heure Fin</th>
                        <th className="py-3 px-4">Salle</th>
                        <th className="py-3 px-4">Enseignant</th>
                        <th className="py-3 px-4 rounded-tr-lg text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessions.length > 0 ? (
                        sessions.map((session) => (
                          <tr key={session.id} className="hover:bg-gray-50 text-sm text-gray-700">
                            <td className="py-3 px-4">{session.titre}</td>
                            <td className="py-3 px-4">{session.niveau}</td>
                            <td className="py-3 px-4">{session.jour}</td>
                            <td className="py-3 px-4">{session.heureDebut}</td>
                            <td className="py-3 px-4">{session.heureFin}</td>
                            <td className="py-3 px-4">{session.salle}</td>
                            <td className="py-3 px-4">{session.enseignant}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleEditSession(session)}
                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                                title="Modifier"
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteSession(session.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Supprimer"
                              >
                                <i className="fa-solid fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-gray-500">
                            Aucune session planifiée pour le moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}