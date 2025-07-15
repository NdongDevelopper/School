// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import RouteGuard from '@/components/RouteGuard';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// export default function ResponsableDashboard() {
//   const { user } = useAuth();
//   const pathname = usePathname();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(0);
  
//   const isActive = (path: string) => pathname === path;

//   // Détection de la largeur d'écran
//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     setWindowWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Fermer le menu si on passe en mode desktop
//   useEffect(() => {
//     if (windowWidth >= 768 && isMenuOpen) {
//       setIsMenuOpen(false);
//     }
//   }, [windowWidth, isMenuOpen]);

//   return (
//     <RouteGuard roles={['responsable']}>
//       <div className="flex min-h-screen bg-gray-50">
//         {/* Sidebar - Optimisé pour mobile */}
//         <div 
//           className={`fixed left-0 top-0 h-screen w-64 bg-[#1e40af] text-white z-40 transform transition-transform duration-300 ease-in-out ${
//             isMenuOpen ? 'translate-x-0' : '-translate-x-full'
//           } md:translate-x-0 md:static`}
//         >
//           <div className="p-4 sm:p-6 border-b border-[#3b82f6] relative">
//             <button 
//               className="md:hidden absolute top-4 right-4 text-white"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               <i className="fa-solid fa-times text-xl"></i>
//             </button>
//             <h2 className="text-lg sm:text-xl font-bold truncate">{user?.nomSpecialite} - Filière</h2>
//             <p className="text-blue-200 text-xs sm:text-sm mt-1 truncate">Responsable de Filière</p>
//           </div>
          
//           <nav className="mt-4 sm:mt-6">
//             <Link href="/responsable/dashboard" onClick={() => setIsMenuOpen(false)}>
//               <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/dashboard') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
//                 <i className="fa-solid fa-chart-line mr-2 sm:mr-3"></i>
//                 Tableau de Bord
//               </div>
//             </Link>
            
//             <Link href="/responsable/programmes-cours" onClick={() => setIsMenuOpen(false)}>
//               <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/programmes-cours') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
//                 <i className="fa-solid fa-book mr-2 sm:mr-3"></i>
//                 Programmes et Cours
//               </div>
//             </Link>
            
//             <Link href="/responsable/gestion-etudiants" onClick={() => setIsMenuOpen(false)}>
//               <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/gestion-etudiants') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
//                 <i className="fa-solid fa-users mr-2 sm:mr-3"></i>
//                 Gestion Étudiants
//               </div>
//             </Link>
            
//             <Link href="/responsable/gestion-enseignants" onClick={() => setIsMenuOpen(false)}>
//               <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/gestion-enseignants') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
//                 <i className="fa-solid fa-chalkboard-teacher mr-2 sm:mr-3"></i>
//                 Gestion Enseignants
//               </div>
//             </Link>
            
//             <Link href="/responsable/deliberations" onClick={() => setIsMenuOpen(false)}>
//               <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/deliberations') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
//                 <i className="fa-solid fa-gavel mr-2 sm:mr-3"></i>
//                 Délibérations
//               </div>
//             </Link>
//           </nav>
//         </div>

//         {/* Overlay pour le menu mobile */}
//         {isMenuOpen && (
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//             onClick={() => setIsMenuOpen(false)}
//           ></div>
//         )}

//         {/* Contenu Principal */}
//         <div className="flex-1 min-h-screen md:ml-0 overflow-x-hidden">
//           {/* Header - Pleinement responsive */}
//           <header className="sticky top-0 bg-white shadow-sm border-b border-gray-200 z-20">
//             <div className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center flex-1 min-w-0">
//                   <button 
//                     className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
//                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                   >
//                     <i className="fa-solid fa-bars text-xl"></i>
//                   </button>
//                   <div className="min-w-0">
//                     <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
//                       Tableau de Bord
//                     </h1>
//                     <p className="text-xs text-gray-600 truncate md:hidden">
//                       {user?.nomSpecialite}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2 sm:space-x-3">
//                   <div className="hidden sm:block text-xs sm:text-sm text-gray-600 whitespace-nowrap">
//                     <span>Année 2025-202</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="hidden md:block text-xs sm:text-sm text-gray-600 truncate max-w-[100px] sm:max-w-xs">
//                       {user?.username}
//                     </span>
//                     <div className="relative">
//                       <img 
//                         src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
//                         alt="Profile" 
//                         className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
//                       />
//                       <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border border-white"></span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* Contenu du Dashboard */}
//           <main className="p-2 sm:p-3 md:p-4 lg:p-6">
//             {/* Statistiques Générales */}
//             <section className="mb-4 sm:mb-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
//                 {/* Carte Étudiants */}
//                 <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4 border-l-4 border-[#1e40af]">
//                   <div className="flex items-center justify-between">
//                     <div className="min-w-0">
//                       <p className="text-xs font-medium text-gray-600 truncate">Total Étudiants</p>
//                       <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">1,247</p>
//                       <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">Filles: 523 | Garçons: 724</p>
//                     </div>
//                     <div className="bg-[#1e40af] rounded-full p-1 sm:p-2 ml-2">
//                       <i className="fa-solid fa-users text-white text-sm sm:text-base"></i>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Carte Réussite */}
//                 <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4 border-l-4 border-green-500">
//                   <div className="flex items-center justify-between">
//                     <div className="min-w-0">
//                       <p className="text-xs font-medium text-gray-600 truncate">Taux de Réussite</p>
//                       <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">78.5%</p>
//                       <p className="text-[10px] sm:text-xs text-green-600 mt-1 truncate">+5.2% vs année précédente</p>
//                     </div>
//                     <div className="bg-green-500 rounded-full p-1 sm:p-2 ml-2">
//                       <i className="fa-solid fa-chart-line text-white text-sm sm:text-base"></i>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Carte Modules */}
//                 <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4 border-l-4 border-purple-500">
//                   <div className="flex items-center justify-between">
//                     <div className="min-w-0">
//                       <p className="text-xs font-medium text-gray-600 truncate">Modules Enseignés</p>
//                       <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">142</p>
//                       <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">Toutes classes confondues</p>
//                     </div>
//                     <div className="bg-purple-500 rounded-full p-1 sm:p-2 ml-2">
//                       <i className="fa-solid fa-book text-white text-sm sm:text-base"></i>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Carte Enseignants */}
//                 <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4 border-l-4 border-orange-500">
//                   <div className="flex items-center justify-between">
//                     <div className="min-w-0">
//                       <p className="text-xs font-medium text-gray-600 truncate">Enseignants</p>
//                       <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">45</p>
//                       <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">Corps enseignant actif</p>
//                     </div>
//                     <div className="bg-orange-500 rounded-full p-1 sm:p-2 ml-2">
//                       <i className="fa-solid fa-chalkboard-teacher text-white text-sm sm:text-base"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Statistiques par Classe */}
//             <section className="mb-4 sm:mb-6">
//               <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Statistiques par Classe</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
//                 {/* L1 */}
//                 <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
//                     <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Licence 1 (L1)</h3>
//                     <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">320 étudiants</span>
//                   </div>
//                   <div className="space-y-1 sm:space-y-2">
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Réussis</span>
//                       <span className="text-green-600 font-medium">245 (76.6%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Échoués</span>
//                       <span className="text-red-600 font-medium">35 (10.9%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Rattrapage</span>
//                       <span className="text-yellow-600 font-medium">28 (8.8%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Absents</span>
//                       <span className="text-gray-600 font-medium">12 (3.8%)</span>
//                     </div>
//                     <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
//                       <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Modules</span>
//                         <span className="text-[#1e40af] font-medium">28</span>
//                       </div>
//                       <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Enseignants</span>
//                         <span className="text-[#1e40af] font-medium">12</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* L2 */}
//                 <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
//                     <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Licence 2 (L2)</h3>
//                     <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">285 étudiants</span>
//                   </div>
//                   <div className="space-y-1 sm:space-y-2">
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Réussis</span>
//                       <span className="text-green-600 font-medium">218 (76.5%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Échoués</span>
//                       <span className="text-red-600 font-medium">32 (11.2%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Rattrapage</span>
//                       <span className="text-yellow-600 font-medium">25 (8.8%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Absents</span>
//                       <span className="text-gray-600 font-medium">10 (3.5%)</span>
//                     </div>
//                     <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
//                       <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Modules</span>
//                         <span className="text-[#1e40af] font-medium">30</span>
//                       </div>
//                       <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Enseignants</span>
//                         <span className="text-[#1e40af] font-medium">14</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* L3 */}
//                 <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
//                     <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Licence 3 (L3)</h3>
//                     <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">265 étudiants</span>
//                   </div>
//                   <div className="space-y-1 sm:space-y-2">
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Réussis</span>
//                       <span className="text-green-600 font-medium">210 (79.2%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Échoués</span>
//                       <span className="text-red-600 font-medium">28 (10.6%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Rattrapage</span>
//                       <span className="text-yellow-600 font-medium">22 (8.3%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Absents</span>
//                       <span className="text-gray-600 font-medium">5 (1.9%)</span>
//                     </div>
//                     <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
//                       <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Modules</span>
//                         <span className="text-[#1e40af] font-medium">32</span>
//                       </div>
//                       <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Enseignants</span>
//                         <span className="text-[#1e40af] font-medium">15</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* M1 */}
//                 <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
//                     <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Master 1 (M1)</h3>
//                     <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">195 étudiants</span>
//                   </div>
//                   <div className="space-y-1 sm:space-y-2">
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Réussis</span>
//                       <span className="text-green-600 font-medium">158 (81.0%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Échoués</span>
//                       <span className="text-red-600 font-medium">18 (9.2%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Rattrapage</span>
//                       <span className="text-yellow-600 font-medium">15 (7.7%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Absents</span>
//                       <span className="text-gray-600 font-medium">4 (2.1%)</span>
//                     </div>
//                     <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
//                       <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Modules</span>
//                         <span className="text-[#1e40af] font-medium">26</span>
//                       </div>
//                       <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Enseignants</span>
//                         <span className="text-[#1e40af] font-medium">11</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* M2 */}
//                 <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
//                     <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Master 2 (M2)</h3>
//                     <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">182 étudiants</span>
//                   </div>
//                   <div className="space-y-1 sm:space-y-2">
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Réussis</span>
//                       <span className="text-green-600 font-medium">148 (81.3%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Échoués</span>
//                       <span className="text-red-600 font-medium">16 (8.8%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Rattrapage</span>
//                       <span className="text-yellow-600 font-medium">14 (7.7%)</span>
//                     </div>
//                     <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                       <span className="text-gray-600">Absents</span>
//                       <span className="text-gray-600 font-medium">4 (2.2%)</span>
//                     </div>
//                     <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
//                       <div className="flex justify-between items-center text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Modules</span>
//                         <span className="text-[#1e40af] font-medium">26</span>
//                       </div>
//                       <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
//                         <span className="text-gray-600">Enseignants</span>
//                         <span className="text-[#1e40af] font-medium">13</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Actions Rapides */}
//             <section className="mb-4 sm:mb-6">
//               <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Actions Rapides</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
//                 <button className="bg-[#1e40af] text-white p-3 rounded-lg hover:bg-[#1e3a8a] transition-colors flex flex-col items-center">
//                   <i className="fa-solid fa-file-pdf text-lg sm:text-xl mb-1 sm:mb-2"></i>
//                   <h3 className="font-semibold text-xs sm:text-sm text-center">Générer Rapport</h3>
//                   <p className="text-[10px] sm:text-xs text-blue-100 mt-1 text-center">Rapport détaillé des résultats</p>
//                 </button>
               
//                 <button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex flex-col items-center">
//                   <i className="fa-solid fa-download text-lg sm:text-xl mb-1 sm:mb-2"></i>
//                   <h3 className="font-semibold text-xs sm:text-sm text-center">Exporter Données</h3>
//                   <p className="text-[10px] sm:text-xs text-green-100 mt-1 text-center">Export Excel/CSV</p>
//                 </button>
               
//                 <button className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex flex-col items-center">
//                   <i className="fa-solid fa-calendar text-lg sm:text-xl mb-1 sm:mb-2"></i>
//                   <h3 className="font-semibold text-xs sm:text-sm text-center">Programmer Délibération</h3>
//                   <p className="text-[10px] sm:text-xs text-purple-100 mt-1 text-center">Planifier une session</p>
//                 </button>
//               </div>
//             </section>
//           </main>
//         </div>
//       </div>
//     </RouteGuard>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ResponsableDashboard() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  
  const isActive = (path: string) => pathname === path;

  // Détection de la largeur d'écran
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fermer le menu si on passe en mode desktop
  useEffect(() => {
    if (windowWidth >= 768 && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [windowWidth, isMenuOpen]);

  return (
    <RouteGuard roles={['responsable']}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - Optimisé pour mobile */}
        <div 
          className={`fixed left-0 top-0 h-screen w-64 bg-[#1e40af] text-white z-40 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static`}
        >
          <div className="p-4 sm:p-6 border-b border-[#3b82f6] relative">
            <button 
              className="md:hidden absolute top-4 right-4 text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
            <h2 className="text-lg sm:text-xl font-bold truncate">{user?.nomSpecialite} - Filière</h2>
            <p className="text-blue-200 text-xs sm:text-sm mt-1 truncate">Responsable de Filière</p>
          </div>
          
          <nav className="mt-4 sm:mt-6">
            <Link href="/responsable/dashboard" onClick={() => setIsMenuOpen(false)}>
              <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/dashboard') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-chart-line mr-2 sm:mr-3"></i>
                Tableau de Bord
              </div>
            </Link>
            
            <Link href="/responsable/programmes-cours" onClick={() => setIsMenuOpen(false)}>
              <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/programmes-cours') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-book mr-2 sm:mr-3"></i>
                Programmes et Cours
              </div>
            </Link>
            
            <Link href="/responsable/gestion-etudiants" onClick={() => setIsMenuOpen(false)}>
              <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/gestion-etudiants') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-users mr-2 sm:mr-3"></i>
                Gestion Étudiants
              </div>
            </Link>
            
            <Link href="/responsable/gestion-enseignants" onClick={() => setIsMenuOpen(false)}>
              <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/gestion-enseignants') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-chalkboard-teacher mr-2 sm:mr-3"></i>
                Gestion Enseignants
              </div>
            </Link>
            
            <Link href="/responsable/deliberations" onClick={() => setIsMenuOpen(false)}>
              <div className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base ${isActive('/responsable/deliberations') ? 'bg-[#3b82f6] text-white' : 'text-blue-200 hover:bg-[#3b82f6] hover:text-white'} transition-colors cursor-pointer`}>
                <i className="fa-solid fa-gavel mr-2 sm:mr-3"></i>
                Délibérations
              </div>
            </Link>
          </nav>
        </div>

        {/* Overlay pour le menu mobile */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Contenu Principal */}
        <div className="flex-1 min-h-screen md:ml-0 overflow-x-hidden">
          {/* Header - Pleinement responsive */}
          <header className="sticky top-0 bg-white shadow-sm border-b border-gray-200 z-20">
            <div className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  <button 
                    className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <i className="fa-solid fa-bars text-xl"></i>
                  </button>
                  <div className="min-w-0">
                    <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                      Tableau de Bord
                    </h1>
                    <p className="text-xs text-gray-600 truncate md:hidden">
                      {user?.nomSpecialite}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="hidden sm:block text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                    <span>Année 2025-202</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="hidden md:block text-xs sm:text-sm text-gray-600 truncate max-w-[100px] sm:max-w-xs">
                      {user?.username}
                    </span>
                    <div className="relative">
                      <img 
                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                        alt="Profile" 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border border-white"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Contenu du Dashboard */}
          <main className="p-2 sm:p-3 md:p-4 lg:p-6">
            {/* Statistiques Générales */}
            <section className="mb-4 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {/* Carte Étudiants */}
                <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4 border-l-4 border-[#1e40af]">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-600 truncate">Total Étudiants</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">1,247</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">Filles: 523 | Garçons: 724</p>
                    </div>
                    <div className="bg-[#1e40af] rounded-full p-1 sm:p-2 ml-2">
                      <i className="fa-solid fa-users text-white text-sm sm:text-base"></i>
                    </div>
                  </div>
                </div>

                {/* Carte Réussite */}
                <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-600 truncate">Taux de Réussite</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">78.5%</p>
                      <p className="text-[10px] sm:text-xs text-green-600 mt-1 truncate">+5.2% vs année précédente</p>
                    </div>
                    <div className="bg-green-500 rounded-full p-1 sm:p-2 ml-2">
                      <i className="fa-solid fa-chart-line text-white text-sm sm:text-base"></i>
                    </div>
                  </div>
                </div>

                {/* Carte Modules */}
                <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-600 truncate">Modules Enseignés</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">142</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">Toutes classes confondues</p>
                    </div>
                    <div className="bg-purple-500 rounded-full p-1 sm:p-2 ml-2">
                      <i className="fa-solid fa-book text-white text-sm sm:text-base"></i>
                    </div>
                  </div>
                </div>

                {/* Carte Enseignants */}
                <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-600 truncate">Enseignants</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">45</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">Corps enseignant actif</p>
                    </div>
                    <div className="bg-orange-500 rounded-full p-1 sm:p-2 ml-2">
                      <i className="fa-solid fa-chalkboard-teacher text-white text-sm sm:text-base"></i>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Statistiques par Classe */}
            <section className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Statistiques par Classe</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {/* L1 */}
                <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Licence 1 (L1)</h3>
                    <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">320 étudiants</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">245 (76.6%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">35 (10.9%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">28 (8.8%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">12 (3.8%)</span>
                    </div>
                    <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
                      <div className="flex justify-between items-center text-[10px] sm:text-xs">
                        <span className="text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">28</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
                        <span className="text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">12</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* L2 */}
                <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Licence 2 (L2)</h3>
                    <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">285 étudiants</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">218 (76.5%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">32 (11.2%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">25 (8.8%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">10 (3.5%)</span>
                    </div>
                    <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
                      <div className="flex justify-between items-center text-[10px] sm:text-xs">
                        <span className="text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">30</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
                        <span className="text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">14</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* L3 */}
                <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Licence 3 (L3)</h3>
                    <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">265 étudiants</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">210 (79.2%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">28 (10.6%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">22 (8.3%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">5 (1.9%)</span>
                    </div>
                    <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
                      <div className="flex justify-between items-center text-[10px] sm:text-xs">
                        <span className="text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">32</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
                        <span className="text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">15</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* M1 */}
                <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Master 1 (M1)</h3>
                    <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">195 étudiants</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">158 (81.0%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">18 (9.2%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">15 (7.7%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">4 (2.1%)</span>
                    </div>
                    <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
                      <div className="flex justify-between items-center text-[10px] sm:text-xs">
                        <span className="text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">26</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
                        <span className="text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">11</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* M2 */}
                <div className="bg-white rounded-lg shadow-xs sm:shadow-sm p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Master 2 (M2)</h3>
                    <span className="bg-[#1e40af] text-white px-2 py-1 rounded-full text-xs mt-1 sm:mt-0">182 étudiants</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Réussis</span>
                      <span className="text-green-600 font-medium">148 (81.3%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Échoués</span>
                      <span className="text-red-600 font-medium">16 (8.8%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Rattrapage</span>
                      <span className="text-yellow-600 font-medium">14 (7.7%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-gray-600">Absents</span>
                      <span className="text-gray-600 font-medium">4 (2.2%)</span>
                    </div>
                    <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
                      <div className="flex justify-between items-center text-[10px] sm:text-xs">
                        <span className="text-gray-600">Modules</span>
                        <span className="text-[#1e40af] font-medium">26</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[10px] sm:text-xs">
                        <span className="text-gray-600">Enseignants</span>
                        <span className="text-[#1e40af] font-medium">13</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions Rapides */}
            <section className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Actions Rapides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <button className="bg-[#1e40af] text-white p-3 rounded-lg hover:bg-[#1e3a8a] transition-colors flex flex-col items-center">
                  <i className="fa-solid fa-file-pdf text-lg sm:text-xl mb-1 sm:mb-2"></i>
                  <h3 className="font-semibold text-xs sm:text-sm text-center">Générer Rapport</h3>
                  <p className="text-[10px] sm:text-xs text-blue-100 mt-1 text-center">Rapport détaillé des résultats</p>
                </button>
               
                <button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex flex-col items-center">
                  <i className="fa-solid fa-download text-lg sm:text-xl mb-1 sm:mb-2"></i>
                  <h3 className="font-semibold text-xs sm:text-sm text-center">Exporter Données</h3>
                  <p className="text-[10px] sm:text-xs text-green-100 mt-1 text-center">Export Excel/CSV</p>
                </button>
               
                <button className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex flex-col items-center">
                  <i className="fa-solid fa-calendar text-lg sm:text-xl mb-1 sm:mb-2"></i>
                  <h3 className="font-semibold text-xs sm:text-sm text-center">Programmer Délibération</h3>
                  <p className="text-[10px] sm:text-xs text-purple-100 mt-1 text-center">Planifier une session</p>
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}