'use client';
import React, { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { getNomSpecialite, SpecialiteKey } from '@/utils/specialites';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';

type Note = {
  id: number;
  matiere: string;
  coef: number;
  note: string;
  statut: "Validé" | "Non validé";
  ects: number;
};

type Reclamation = {
  id: number;
  matiereId: number;
  sujet: string;
  description: string;
  date: string;
  statut: "En attente" | "Traité" | "Rejeté";
};

const notesData = {
  ida: {
    L1: [
      { matiere: "Algorithmique", coef: 3, note: "16.5/20", statut: "Validé", ects: 6 },
      { matiere: "Base de données", coef: 3, note: "15.0/20", statut: "Validé", ects: 5 },
      { matiere: "Développement web", coef: 2, note: "17.2/20", statut: "Validé", ects: 4 },
      { matiere: "Mathématiques", coef: 2, note: "14.8/20", statut: "Validé", ects: 4 },
      { matiere: "Systèmes d'exploitation", coef: 2, note: "12.5/20", statut: "Validé", ects: 3 },
      { matiere: "Anglais technique", coef: 1, note: "15.5/20", statut: "Validé", ects: 3 },
    ],
    L2: [
      { matiere: "POO avancée", coef: 3, note: "14.2/20", statut: "Validé", ects: 6 },
      { matiere: "Réseaux", coef: 3, note: "13.7/20", statut: "Validé", ects: 5 },
      { matiere: "JavaScript", coef: 2, note: "16.8/20", statut: "Validé", ects: 4 },
      { matiere: "Systèmes distribués", coef: 2, note: "11.5/20", statut: "Non validé", ects: 0 },
      { matiere: "Algorithmes avancés", coef: 2, note: "12.9/20", statut: "Validé", ects: 3 },
      { matiere: "Communication technique", coef: 1, note: "14.0/20", statut: "Validé", ects: 3 },
    ],
    L3: [
      { matiere: "Intelligence Artificielle", coef: 3, note: "15.8/20", statut: "Validé", ects: 6 },
      { matiere: "Sécurité informatique", coef: 3, note: "14.5/20", statut: "Validé", ects: 5 },
      { matiere: "Cloud Computing", coef: 2, note: "17.0/20", statut: "Validé", ects: 4 },
      { matiere: "Big Data", coef: 2, note: "13.2/20", statut: "Validé", ects: 4 },
      { matiere: "Projet intégrateur", coef: 3, note: "16.3/20", statut: "Validé", ects: 6 },
      { matiere: "Gestion de projet", coef: 1, note: "15.7/20", statut: "Validé", ects: 3 },
    ],
    M1: [
      { matiere: "Machine Learning", coef: 3, note: "16.1/20", statut: "Validé", ects: 6 },
      { matiere: "DevOps", coef: 2, note: "14.8/20", statut: "Validé", ects: 4 },
      { matiere: "Architecture microservices", coef: 2, note: "15.5/20", statut: "Validé", ects: 4 },
      { matiere: "Blockchain", coef: 2, note: "13.9/20", statut: "Validé", ects: 4 },
      { matiere: "Séminaire de recherche", coef: 3, note: "17.2/20", statut: "Validé", ects: 6 },
      { matiere: "Anglais académique", coef: 1, note: "16.0/20", statut: "Validé", ects: 3 },
    ],
    M2: [
      { matiere: "Deep Learning", coef: 3, note: "15.6/20", statut: "Validé", ects: 6 },
      { matiere: "IoT", coef: 2, note: "14.3/20", statut: "Validé", ects: 4 },
      { matiere: "Cybersécurité avancée", coef: 2, note: "16.7/20", statut: "Validé", ects: 4 },
      { matiere: "Management de projet", coef: 2, note: "15.1/20", statut: "Validé", ects: 4 },
      { matiere: "Mémoire de recherche", coef: 4, note: "17.5/20", statut: "Validé", ects: 8 },
      { matiere: "Préparation professionnelle", coef: 1, note: "16.4/20", statut: "Validé", ects: 3 },
    ]
  },
  mic: {
    L1: [
      { matiere: "Design graphique", coef: 3, note: "15.2/20", statut: "Validé", ects: 6 },
      { matiere: "Photographie numérique", coef: 2, note: "14.7/20", statut: "Validé", ects: 4 },
      { matiere: "Communication visuelle", coef: 2, note: "16.3/20", statut: "Validé", ects: 4 },
      { matiere: "Infographie", coef: 3, note: "13.8/20", statut: "Validé", ects: 5 },
      { matiere: "Histoire des médias", coef: 1, note: "12.5/20", statut: "Non validé", ects: 0 },
      { matiere: "Anglais des médias", coef: 1, note: "14.0/20", statut: "Validé", ects: 3 },
    ],
    L2: [
      { matiere: "Animation 2D", coef: 3, note: "16.8/20", statut: "Validé", ects: 6 },
      { matiere: "Design d'interface", coef: 2, note: "15.3/20", statut: "Validé", ects: 4 },
      { matiere: "Vidéo numérique", coef: 3, note: "14.2/20", statut: "Validé", ects: 5 },
      { matiere: "Typographie", coef: 2, note: "13.7/20", statut: "Validé", ects: 3 },
      { matiere: "Marketing digital", coef: 1, note: "11.9/20", statut: "Non validé", ects: 0 },
      { matiere: "Expression créative", coef: 1, note: "15.5/20", statut: "Validé", ects: 3 },
    ],
    L3: [
      { matiere: "3D avancée", coef: 3, note: "17.1/20", statut: "Validé", ects: 6 },
      { matiere: "Motion design", coef: 2, note: "15.8/20", statut: "Validé", ects: 4 },
      { matiere: "Design interactif", coef: 2, note: "14.5/20", statut: "Validé", ects: 4 },
      { matiere: "Projet multimédia", coef: 3, note: "16.4/20", statut: "Validé", ects: 6 },
      { matiere: "Stratégie de contenu", coef: 1, note: "13.9/20", statut: "Validé", ects: 3 },
      { matiere: "Gestion de projet créatif", coef: 1, note: "15.2/20", statut: "Validé", ects: 3 },
    ],
    M1: [
      { matiere: "Réalité virtuelle", coef: 3, note: "16.0/20", statut: "Validé", ects: 6 },
      { matiere: "Design sonore", coef: 2, note: "14.7/20", statut: "Validé", ects: 4 },
      { matiere: "Expérience utilisateur", coef: 2, note: "15.9/20", statut: "Validé", ects: 4 },
      { matiere: "Narratologie", coef: 2, note: "13.8/20", statut: "Validé", ects: 4 },
      { matiere: "Gestion de projet", coef: 3, note: "16.5/20", statut: "Validé", ects: 6 },
      { matiere: "Anglais professionnel", coef: 1, note: "15.3/20", statut: "Validé", ects: 3 },
    ],
    M2: [
      { matiere: "Design d'exposition", coef: 3, note: "17.2/20", statut: "Validé", ects: 6 },
      { matiere: "Direction artistique", coef: 2, note: "16.1/20", statut: "Validé", ects: 4 },
      { matiere: "Projet de fin d'études", coef: 4, note: "15.8/20", statut: "Validé", ects: 8 },
      { matiere: "Séminaire professionnel", coef: 1, note: "14.9/20", statut: "Validé", ects: 3 },
      { matiere: "Veille technologique", coef: 2, note: "16.7/20", statut: "Validé", ects: 4 },
      { matiere: "Communication professionnelle", coef: 1, note: "15.4/20", statut: "Validé", ects: 3 },
    ]
  },
  cd: {
    L1: [
      { matiere: "Marketing digital", coef: 3, note: "15.5/20", statut: "Validé", ects: 6 },
      { matiere: "Réseaux sociaux", coef: 2, note: "14.2/20", statut: "Validé", ects: 4 },
      { matiere: "Stratégie de contenu", coef: 2, note: "13.8/20", statut: "Validé", ects: 4 },
      { matiere: "Branding", coef: 3, note: "16.1/20", statut: "Validé", ects: 5 },
      { matiere: "Analytics", coef: 2, note: "12.7/20", statut: "Non validé", ects: 0 },
      { matiere: "Anglais commercial", coef: 1, note: "14.3/20", statut: "Validé", ects: 3 },
    ],
    L2: [
      { matiere: "Content marketing", coef: 3, note: "16.4/20", statut: "Validé", ects: 6 },
      { matiere: "SEO/SEA", coef: 2, note: "15.0/20", statut: "Validé", ects: 4 },
      { matiere: "E-réputation", coef: 2, note: "14.5/20", statut: "Validé", ects: 4 },
      { matiere: "Inbound marketing", coef: 3, note: "13.9/20", statut: "Validé", ects: 5 },
      { matiere: "Publicité en ligne", coef: 1, note: "11.8/20", statut: "Non validé", ects: 0 },
      { matiere: "Communication digitale", coef: 1, note: "15.6/20", statut: "Validé", ects: 3 },
    ],
    L3: [
      { matiere: "Stratégie digitale", coef: 3, note: "17.0/20", statut: "Validé", ects: 6 },
      { matiere: "Growth hacking", coef: 2, note: "15.7/20", statut: "Validé", ects: 4 },
      { matiere: "Data marketing", coef: 2, note: "14.8/20", statut: "Validé", ects: 4 },
      { matiere: "Marketing automation", coef: 3, note: "16.3/20", statut: "Validé", ects: 6 },
      { matiere: "Projet campagne", coef: 2, note: "13.5/20", statut: "Validé", ects: 4 },
      { matiere: "Éthique digitale", coef: 1, note: "14.9/20", statut: "Validé", ects: 3 },
    ],
    M1: [
      { matiere: "Transformation digitale", coef: 3, note: "16.2/20", statut: "Validé", ects: 6 },
      { matiere: "Management digital", coef: 2, note: "15.4/20", statut: "Validé", ects: 4 },
      { matiere: "UX marketing", coef: 2, note: "14.7/20", statut: "Validé", ects: 4 },
      { matiere: "Stratégie social media", coef: 3, note: "17.1/20", statut: "Validé", ects: 6 },
      { matiere: "E-commerce", coef: 2, note: "13.8/20", statut: "Validé", ects: 4 },
      { matiere: "Anglais du digital", coef: 1, note: "15.5/20", statut: "Validé", ects: 3 },
    ],
    M2: [
      { matiere: "Digital business", coef: 3, note: "16.8/20", statut: "Validé", ects: 6 },
      { matiere: "Innovation digitale", coef: 2, note: "15.3/20", statut: "Validé", ects: 4 },
      { matiere: "Mémoire recherche", coef: 4, note: "17.5/20", statut: "Validé", ects: 8 },
      { matiere: "Stratégie d'entreprise", coef: 2, note: "14.6/20", statut: "Validé", ects: 4 },
      { matiere: "Préparation insertion", coef: 1, note: "16.0/20", statut: "Validé", ects: 3 },
      { matiere: "Leadership digital", coef: 1, note: "15.7/20", statut: "Validé", ects: 3 },
    ]
  }
};

const calculateSummary = (notes: Note[]) => {
  let totalECTS = 0;
  let validatedECTS = 0;
  let validatedSubjects = 0;
  let totalPoints = 0;
  let totalCoef = 0;

  notes.forEach(note => {
    totalECTS += note.ects;
    if (note.statut === "Validé") {
      validatedECTS += note.ects;
      validatedSubjects++;
      const noteValue = parseFloat(note.note.split('/')[0]);
      totalPoints += noteValue * note.coef;
      totalCoef += note.coef;
    }
  });

  const average = totalCoef > 0 ? (totalPoints / totalCoef).toFixed(2) : 0;

  return {
    average: `${average}/20`,
    validatedSubjects: `${validatedSubjects}/${notes.length}`,
    validatedECTS: `${validatedECTS}/${totalECTS}`
  };
};

export default function NotesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reclamationModalOpen, setReclamationModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [reclamationSujet, setReclamationSujet] = useState("");
  const [reclamationDescription, setReclamationDescription] = useState("");
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [reclamationSuccess, setReclamationSuccess] = useState(false);
  
  const { user } = useAuth();
  const params = useParams();
  
  if (!user || !params?.specialite) {
    return <div>Chargement...</div>;
  }
  
  const specialite = params.specialite as SpecialiteKey;
  const niveau = user.niveau as keyof typeof notesData.ida;
  
  const notes = (notesData[specialite][niveau] || []).map((note, index) => ({
    ...note,
    id: index + 1,
    statut: note.statut as "Validé" | "Non validé"
  }));
  
  const summary = calculateSummary(notes);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOpenReclamation = (note: Note) => {
    setSelectedNote(note);
    setReclamationSujet(`Réclamation note ${note.matiere}`);
    setReclamationDescription("");
    setReclamationModalOpen(true);
    setReclamationSuccess(false);
  };

  const handleSubmitReclamation = () => {
    if (!selectedNote || !reclamationSujet || !reclamationDescription) return;
    
    const newReclamation: Reclamation = {
      id: reclamations.length + 1,
      matiereId: selectedNote.id,
      sujet: reclamationSujet,
      description: reclamationDescription,
      date: new Date().toLocaleDateString('fr-FR'),
      statut: "En attente"
    };
    
    setReclamations([...reclamations, newReclamation]);
    setReclamationModalOpen(false);
    setReclamationSuccess(true);
    setTimeout(() => setReclamationSuccess(false), 5000);
  };

  const handleDownloadBulletin = () => {
    const bulletinContent = `
      Bulletin de Notes - ${getNomSpecialite(specialite)}
      Étudiant: ${user.username}
      Niveau: ${niveau}
      Année académique: 2025
      
      Moyenne générale: ${summary.average}
      Matières validées: ${summary.validatedSubjects}
      Crédits ECTS: ${summary.validatedECTS}
      
      Détail des notes:
      ${notes.map(note => `
        - ${note.matiere}: ${note.note} (${note.statut})
      `).join('')}
    `;
    
    const blob = new Blob([bulletinContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletin-${user.username}-${niveau}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <RouteGuard roles={['etudiant']}>
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
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
                <a href={`/${specialite}/cours`} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Cours</span>
                </a>
              </li>
            
              <li>
                <span className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-500 text-white font-medium cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Mes notes</span>
                </span>
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

        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        <main className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 md:px-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Notes et Évaluations - {getNomSpecialite(specialite)}
              </h1>
              <p className="text-gray-600">Niveau {niveau} - Année académique 2025</p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={handleDownloadBulletin}
                className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger le bulletin
              </button>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {reclamationSuccess && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">
                  Votre réclamation a été soumise avec succès. Elle est maintenant en attente de traitement.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              <SummaryCard 
                title="Moyenne générale" 
                value={summary.average} 
                color="blue-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
              <SummaryCard 
                title="Matières validées" 
                value={summary.validatedSubjects} 
                color="green-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <SummaryCard 
                title="Crédits ECTS" 
                value={summary.validatedECTS} 
                color="amber-600" 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Détail des notes par matière</h2>
                <p className="text-gray-600 mt-1">Semestre 1 - {getNomSpecialite(specialite)}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matière
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coefficient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crédits ECTS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {notes.map((note) => (
                      <tr key={note.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {note.matiere}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {note.coef}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {note.note}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            note.statut === "Validé" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {note.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {note.ects}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleOpenReclamation(note)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Réclamer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {reclamations.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Mes réclamations</h2>
                  <p className="text-gray-600 mt-1">Historique de vos réclamations concernant les notes</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Matière
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sujet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reclamations.map((reclamation) => {
                        const note = notes.find(n => n.id === reclamation.matiereId);
                        return (
                          <tr key={reclamation.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {note ? note.matiere : "Matière inconnue"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {reclamation.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {reclamation.sujet}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                reclamation.statut === "Traité" 
                                  ? "bg-green-100 text-green-800" 
                                  : reclamation.statut === "Rejeté"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {reclamation.statut}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">À propos de vos notes</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Votre bulletin de notes définitif sera disponible après validation par le conseil de département.
                    Pour toute question concernant vos notes, veuillez contacter le secrétariat pédagogique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modal de réclamation */}
        {reclamationModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  Réclamer une note
                </h3>
                <p className="text-gray-600 mt-1">
                  Pour la matière: <span className="font-medium">{selectedNote?.matiere}</span>
                </p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet de la réclamation
                  </label>
                  <input
                    type="text"
                    value={reclamationSujet}
                    onChange={(e) => setReclamationSujet(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Détails de la réclamation
                  </label>
                  <textarea
                    value={reclamationDescription}
                    onChange={(e) => setReclamationDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Décrivez les raisons de votre réclamation..."
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setReclamationModalOpen(false)}
                  className="px-4 py-2 text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitReclamation}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Envoyer la réclamation
                </button>
              </div>
            </div>
          </div>
        )}
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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{title}</h3>
        <p className={`text-xl md:text-2xl font-bold text-${color} truncate`}>{value}</p>
      </div>
      <div className={`ml-4 w-10 h-10 md:w-12 md:h-12 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}