'use client';
import React, { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { getNomSpecialite, SpecialiteKey } from '@/utils/specialites';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import dynamic from 'next/dynamic';

// Structure des données de cours
type Cours = {
  id: string;
  matiere: string;
  enseignant: string;
  volumeHoraire: string;
  description: string;
  semestre: "S1" | "S2";
};

// Définition du type pour les clés de niveau
type NiveauKey = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';

// Données de cours complètes pour toutes les spécialités et niveaux
const coursData: Record<SpecialiteKey, Record<NiveauKey, Cours[]>> = {
  ida: {
    L1: [
      { id: "c1", matiere: "Algorithmique", enseignant: "Dr. Martin", volumeHoraire: "60h", description: "Fondements des algorithmes et structures de données", semestre: "S1" },
      { id: "c2", matiere: "Base de données", enseignant: "Prof. Dubois", volumeHoraire: "45h", description: "Conception et gestion de bases de données relationnelles", semestre: "S1" },
      { id: "c3", matiere: "Développement web", enseignant: "Mme. Laurent", volumeHoraire: "75h", description: "HTML, CSS, JavaScript et frameworks frontend", semestre: "S2" },
      { id: "c4", matiere: "Mathématiques", enseignant: "Dr. Bernard", volumeHoraire: "60h", description: "Mathématiques discrètes et algèbre linéaire", semestre: "S1" },
      { id: "c5", matiere: "Systèmes d'exploitation", enseignant: "Prof. Moreau", volumeHoraire: "45h", description: "Fonctionnement des systèmes d'exploitation modernes", semestre: "S2" },
    ],
    L2: [
      { id: "c6", matiere: "POO avancée", enseignant: "Dr. Martin", volumeHoraire: "60h", description: "Programmation orientée objet avec Java et C++", semestre: "S1" },
      { id: "c7", matiere: "Réseaux", enseignant: "Prof. Lefevre", volumeHoraire: "45h", description: "Architecture réseau et protocoles de communication", semestre: "S1" },
      { id: "c8", matiere: "JavaScript avancé", enseignant: "Mme. Laurent", volumeHoraire: "60h", description: "JavaScript moderne et frameworks backend", semestre: "S2" },
      { id: "c9", matiere: "Systèmes distribués", enseignant: "Prof. Moreau", volumeHoraire: "45h", description: "Conception de systèmes distribués et microservices", semestre: "S2" },
    ],
    L3: [
      { id: "c10", matiere: "Intelligence Artificielle", enseignant: "Dr. Bernard", volumeHoraire: "60h", description: "Algorithmes d'IA et machine learning", semestre: "S1" },
      { id: "c11", matiere: "Sécurité informatique", enseignant: "Prof. Lefevre", volumeHoraire: "45h", description: "Fondements de la cybersécurité", semestre: "S1" },
      { id: "c12", matiere: "Cloud Computing", enseignant: "Prof. Moreau", volumeHoraire: "60h", description: "Architectures cloud et services AWS/Azure", semestre: "S2" },
      { id: "c13", matiere: "Big Data", enseignant: "Dr. Martin", volumeHoraire: "45h", description: "Traitement des données massives", semestre: "S2" },
    ],
    M1: [
      { id: "c14", matiere: "Machine Learning", enseignant: "Dr. Bernard", volumeHoraire: "60h", description: "Algorithmes avancés de machine learning", semestre: "S1" },
      { id: "c15", matiere: "DevOps", enseignant: "Prof. Moreau", volumeHoraire: "45h", description: "Intégration continue et déploiement", semestre: "S1" },
      { id: "c16", matiere: "Architecture microservices", enseignant: "Prof. Dubois", volumeHoraire: "60h", description: "Conception d'architectures microservices", semestre: "S2" },
    ],
    M2: [
      { id: "c17", matiere: "Deep Learning", enseignant: "Dr. Bernard", volumeHoraire: "60h", description: "Réseaux de neurones profonds", semestre: "S1" },
      { id: "c18", matiere: "IoT", enseignant: "Prof. Lefevre", volumeHoraire: "45h", description: "Internet des Objets et systèmes embarqués", semestre: "S1" },
      { id: "c19", matiere: "Cybersécurité avancée", enseignant: "Prof. Moreau", volumeHoraire: "60h", description: "Techniques avancées de sécurité informatique", semestre: "S2" },
    ]
  },
  mic: {
    L1: [
      { id: "c20", matiere: "Design graphique", enseignant: "Mme. Dupont", volumeHoraire: "60h", description: "Principes fondamentaux du design", semestre: "S1" },
      { id: "c21", matiere: "Photographie numérique", enseignant: "M. Leroy", volumeHoraire: "45h", description: "Techniques de photographie et retouche", semestre: "S1" },
      { id: "c22", matiere: "Communication visuelle", enseignant: "Mme. Dupont", volumeHoraire: "60h", description: "Théorie et pratique de la communication visuelle", semestre: "S2" },
    ],
    L2: [
      { id: "c23", matiere: "Animation 2D", enseignant: "M. Petit", volumeHoraire: "75h", description: "Animation 2D avec After Effects", semestre: "S1" },
      { id: "c24", matiere: "Design d'interface", enseignant: "Mme. Lambert", volumeHoraire: "60h", description: "Design UI/UX pour applications", semestre: "S1" },
      { id: "c25", matiere: "Vidéo numérique", enseignant: "M. Leroy", volumeHoraire: "60h", description: "Production vidéo et montage", semestre: "S2" },
    ],
    L3: [
      { id: "c26", matiere: "3D avancée", enseignant: "M. Petit", volumeHoraire: "90h", description: "Modélisation et animation 3D", semestre: "S1" },
      { id: "c27", matiere: "Motion design", enseignant: "Mme. Lambert", volumeHoraire: "60h", description: "Design d'animations interactives", semestre: "S2" },
    ],
    M1: [
      { id: "c28", matiere: "Réalité virtuelle", enseignant: "M. Petit", volumeHoraire: "75h", description: "Développement d'applications VR", semestre: "S1" },
      { id: "c29", matiere: "Design sonore", enseignant: "M. Dubois", volumeHoraire: "45h", description: "Création et intégration sonore", semestre: "S2" },
    ],
    M2: [
      { id: "c30", matiere: "Design d'exposition", enseignant: "Mme. Dupont", volumeHoraire: "60h", description: "Scénographie et design d'exposition", semestre: "S1" },
      { id: "c31", matiere: "Direction artistique", enseignant: "Mme. Lambert", volumeHoraire: "60h", description: "Management de projets créatifs", semestre: "S2" },
    ]
  },
  cd: {
    L1: [
      { id: "c32", matiere: "Marketing digital", enseignant: "M. Robert", volumeHoraire: "60h", description: "Fondements du marketing numérique", semestre: "S1" },
      { id: "c33", matiere: "Réseaux sociaux", enseignant: "Mme. Durand", volumeHoraire: "45h", description: "Stratégies de présence sur les réseaux sociaux", semestre: "S1" },
      { id: "c34", matiere: "Stratégie de contenu", enseignant: "M. Robert", volumeHoraire: "60h", description: "Création et gestion de contenu digital", semestre: "S2" },
    ],
    L2: [
      { id: "c35", matiere: "Content marketing", enseignant: "Mme. Durand", volumeHoraire: "60h", description: "Stratégies de contenu engageant", semestre: "S1" },
      { id: "c36", matiere: "SEO/SEA", enseignant: "M. Robert", volumeHoraire: "45h", description: "Optimisation pour les moteurs de recherche", semestre: "S2" },
    ],
    L3: [
      { id: "c37", matiere: "Stratégie digitale", enseignant: "M. Thomas", volumeHoraire: "60h", description: "Planification stratégique digitale", semestre: "S1" },
      { id: "c38", matiere: "Growth hacking", enseignant: "Mme. Durand", volumeHoraire: "45h", description: "Techniques de croissance rapide", semestre: "S2" },
    ],
    M1: [
      { id: "c39", matiere: "Transformation digitale", enseignant: "M. Thomas", volumeHoraire: "60h", description: "Gestion de la transformation numérique", semestre: "S1" },
      { id: "c40", matiere: "Management digital", enseignant: "M. Robert", volumeHoraire: "45h", description: "Leadership en environnement digital", semestre: "S2" },
    ],
    M2: [
      { id: "c41", matiere: "Digital business", enseignant: "M. Thomas", volumeHoraire: "60h", description: "Modèles d'affaires numériques", semestre: "S1" },
      { id: "c42", matiere: "Innovation digitale", enseignant: "Mme. Durand", volumeHoraire: "45h", description: "Processus d'innovation en contexte digital", semestre: "S2" },
    ]
  }
};

// Fonction pour calculer les résumés
const calculateSummary = (cours: Cours[]) => {
  const totalHeures = cours.reduce((acc, cours) => {
    const heures = parseInt(cours.volumeHoraire);
    return acc + (isNaN(heures) ? 0 : heures);
  }, 0);
  
  const semestre1 = cours.filter(c => c.semestre === "S1").length;
  const semestre2 = cours.filter(c => c.semestre === "S2").length;
  
  return {
    totalCours: cours.length,
    totalHeures: `${totalHeures}h`,
    semestre1: `${semestre1} cours`,
    semestre2: `${semestre2} cours`
  };
};

// Fonction pour générer le PDF d'un cours
const generateCoursePDF = async (cours: Cours) => {
  const PDFDoc = await import('jspdf');
  const doc = new PDFDoc.jsPDF();
  
  // Style du titre
  doc.setFontSize(20);
  doc.setTextColor(33, 37, 41); // Couleur gris foncé
  doc.text(cours.matiere, 105, 20, { align: 'center' });
  
  // Informations de base
  doc.setFontSize(12);
  doc.setTextColor(73, 80, 87); // Couleur gris moyen
  doc.text(`Enseignant: ${cours.enseignant}`, 20, 40);
  doc.text(`Volume horaire: ${cours.volumeHoraire}`, 20, 50);
  doc.text(`Semestre: ${cours.semestre}`, 20, 60);
  
  // Description
  doc.setFontSize(14);
  doc.setTextColor(33, 37, 41);
  doc.text("Description du cours:", 20, 80);
  
  doc.setFontSize(12);
  doc.setTextColor(73, 80, 87);
  const splitDescription = doc.splitTextToSize(cours.description, 170);
  doc.text(splitDescription, 20, 90);
  
  // Pied de page
  doc.setFontSize(10);
  doc.setTextColor(108, 117, 125); // Couleur gris clair
  doc.text("Université XYZ - Faculté des Sciences", 105, 280, { align: 'center' });
  
  // Enregistrement du PDF
  doc.save(`${cours.matiere.replace(/\s+/g, '_')}_cours.pdf`);
};

export default function CoursPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<'Tous' | 'S1' | 'S2'>('Tous');
  const { user } = useAuth();
  const params = useParams();
  
  if (!user || !params?.specialite) {
    return <div>Chargement...</div>;
  }
  
  const specialite = params.specialite as SpecialiteKey;
  const niveau = user.niveau as NiveauKey;
  
  // Récupérer les cours spécifiques
  const cours = coursData[specialite]?.[niveau] || [];
  
  // Filtrer les cours par semestre
  const filteredCours = selectedSemester === 'Tous' 
    ? cours 
    : cours.filter(c => c.semestre === selectedSemester);
  
  const summary = calculateSummary(cours);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Télécharger tout le programme
  const handleDownloadProgram = async () => {
    const PDFDoc = await import('jspdf');
    const doc = new PDFDoc.jsPDF();
    
    // Titre principal
    doc.setFontSize(22);
    doc.setTextColor(33, 37, 41);
    doc.text(`Programme des cours - ${getNomSpecialite(specialite)} ${niveau}`, 105, 20, { align: 'center' });
    
    // Informations générales
    doc.setFontSize(14);
    doc.setTextColor(73, 80, 87);
    doc.text(`Année académique 2025 - Total des cours: ${summary.totalCours}`, 105, 30, { align: 'center' });
    
    let yPosition = 50;
    
    // Ajouter chaque cours
    cours.forEach((coursItem, index) => {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Titre du cours
      doc.setFontSize(16);
      doc.setTextColor(33, 37, 41);
      doc.text(`${index + 1}. ${coursItem.matiere}`, 20, yPosition);
      
      // Détails du cours
      doc.setFontSize(12);
      doc.setTextColor(73, 80, 87);
      doc.text(`Enseignant: ${coursItem.enseignant}`, 30, yPosition + 10);
      doc.text(`Volume horaire: ${coursItem.volumeHoraire}`, 30, yPosition + 20);
      doc.text(`Semestre: ${coursItem.semestre}`, 30, yPosition + 30);
      
      // Description
      doc.text("Description:", 30, yPosition + 45);
      const splitDescription = doc.splitTextToSize(coursItem.description, 170);
      doc.text(splitDescription, 30, yPosition + 55);
      
      // Ligne séparatrice
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition + 70, 190, yPosition + 70);
      
      yPosition += 85;
    });
    
    doc.save(`Programme_${getNomSpecialite(specialite)}_${niveau}.pdf`);
  };

  return (
    <RouteGuard roles={['etudiant']}>
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 w-64 bg-blue-600 text-white shadow-lg z-20 transform transition-transform duration-300 md:translate-x-0 md:static ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 border-b border-blue-400">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Espace Étudiant</h2>
                <p className="text-blue-200 text-sm">
                  {getNomSpecialite(specialite)} - {niveau}
                </p>
              </div>
            </div>
          </div>
          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              <li>
                <a href={`/${specialite}/tableau-bord`} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Emploi du temps</span>
                </a>
              </li>
              <li>
                <span className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-500 text-white font-medium cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Cours</span>
                </span>
              </li>
            
              <li>
                <a href={`/${specialite}/notes`} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Mes notes</span>
                </a>
              </li>
              <li>
                <a href={`/${specialite}/absences`} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Mes absences</span>
                </a>
              </li>
            </ul>
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t border-blue-400">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center">
                <span className="text-blue-800 font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-blue-200">Étudiant {niveau}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center">
              {/* Hamburger menu for mobile */}
              <button 
                className="mr-3 md:hidden text-gray-600"
                onClick={toggleSidebar}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Cours - {getNomSpecialite(specialite)}
                </h1>
                <p className="text-gray-600 hidden sm:block">Niveau {niveau} - Année académique 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={handleDownloadProgram}
                className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Télécharger le programme</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {/* Summary Cards - responsive grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
              <SummaryCard 
                title="Total cours" 
                value={summary.totalCours.toString()} 
                color="blue-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />
              <SummaryCard 
                title="Heures" 
                value={summary.totalHeures} 
                color="blue-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <SummaryCard 
                title="S1" 
                value={summary.semestre1} 
                color="blue-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <SummaryCard 
                title="S2" 
                value={summary.semestre2} 
                color="blue-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>

            {/* Filtres par semestre */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                  selectedSemester === 'Tous' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedSemester('Tous')}
              >
                Tous
              </button>
              <button 
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                  selectedSemester === 'S1' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedSemester('S1')}
              >
                Semestre 1
              </button>
              <button 
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                  selectedSemester === 'S2' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedSemester('S2')}
              >
                Semestre 2
              </button>
            </div>

            {/* Cours Table - responsive design */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Liste des cours</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {getNomSpecialite(specialite)} {niveau} 
                  {selectedSemester !== 'Tous' && ` - Semestre ${selectedSemester}`}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matière
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Enseignant
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Volume
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sem.
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Description
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCours.map((coursItem) => (
                      <tr key={coursItem.id} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">
                          {coursItem.matiere}
                          <div className="md:hidden text-xs text-gray-500 mt-1">
                            {coursItem.enseignant}
                          </div>
                          <div className="md:hidden text-xs text-gray-500">
                            {coursItem.volumeHoraire}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                          {coursItem.enseignant}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {coursItem.volumeHoraire}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            coursItem.semestre === 'S1' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {coursItem.semestre}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          {coursItem.description}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => generateCoursePDF(coursItem)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                            aria-label="Télécharger le cours"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="hidden md:inline ml-1">PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Programme Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3 md:mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-base md:text-lg font-medium text-blue-800">À propos de votre programme</h3>
                  <p className="text-blue-700 text-sm md:text-base mt-2">
                    Le programme de {getNomSpecialite(specialite)} niveau {niveau} est conçu pour vous donner les compétences 
                    nécessaires dans votre domaine. Vous trouverez ci-dessus la liste complète des cours 
                    pour l'année académique en cours.
                  </p>
                  <div className="mt-3">
                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm md:text-base">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Contacter le responsable pédagogique
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}

function SummaryCard({ title, value, color, icon }: { 
  title: string; 
  value: string; 
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-xs md:text-base font-semibold text-gray-900 truncate">{title}</h3>
        <p className={`text-base md:text-xl font-bold text-${color} truncate`}>{value}</p>
      </div>
      <div className={`ml-2 w-8 h-8 md:w-10 md:h-10 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}