'use client';

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Cours {
  jour: string;
  heure: string;
  matiere: string;
  type: 'Cours' | 'TD' | 'TP' | 'Réunion';
  salle: string;
  professeur: string;
}

export default function EmploiDuTempsMultimediaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getEmploiDuTemps = (): Cours[] => {
    switch(user?.niveau) {
      case 'L1':
        return [
          { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Introduction au multimédia", type: "Cours", salle: "M101", professeur: "Mme. Lefevre" },
          { jour: "Lundi", heure: "10:15 - 12:15", matiere: "Bases du design web", type: "TD", salle: "M102", professeur: "M. Bernard" },
          { jour: "Mardi", heure: "08:00 - 10:00", matiere: "Techniques vidéo", type: "TP", salle: "Studio 1", professeur: "Mme. Dupont" },
          { jour: "Mercredi", heure: "14:00 - 16:00", matiere: "Photographie numérique", type: "Cours", salle: "M103", professeur: "Dr. Garcia" },
          { jour: "Jeudi", heure: "10:15 - 12:15", matiere: "Communication visuelle", type: "TD", salle: "M104", professeur: "M. Taylor" },
          { jour: "Vendredi", heure: "08:00 - 10:00", matiere: "Montage et postproduction", type: "TP", salle: "Studio 2", professeur: "Prof. Lee" }
        ];
      case 'L2':
        return [
          { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Narration multimédia", type: "Cours", salle: "M201", professeur: "Mme. Martin" },
          { jour: "Mardi", heure: "10:15 - 12:15", matiere: "Animation 2D", type: "TP", salle: "Labo Animation", professeur: "M. Garcia" },
          { jour: "Mardi", heure: "14:00 - 16:00", matiere: "Développement web interactif", type: "TD", salle: "M202", professeur: "Mme. Rousseau" },
          { jour: "Mercredi", heure: "08:00 - 10:00", matiere: "Communication multimédia", type: "Cours", salle: "M203", professeur: "Dr. Kim" },
          { jour: "Jeudi", heure: "10:15 - 12:15", matiere: "Projet multimédia", type: "Réunion", salle: "Salle Projet", professeur: "Prof. Anderson" },
          { jour: "Vendredi", heure: "08:00 - 10:00", matiere: "Ergonomie et UX", type: "TD", salle: "M204", professeur: "Dr. Patel" }
        ];
      default:
        return [
          { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Conception avancée multimédia", type: "Cours", salle: "M301", professeur: "Dr. Nguyen" },
          { jour: "Lundi", heure: "10:15 - 12:15", matiere: "Réalité virtuelle", type: "TP", salle: "Labo VR", professeur: "Mme. Dupuis" },
          { jour: "Mardi", heure: "14:00 - 16:00", matiere: "Stratégie digitale", type: "Cours", salle: "M302", professeur: "M. Dubois" },
          { jour: "Mercredi", heure: "08:00 - 10:00", matiere: "Projet de recherche", type: "Réunion", salle: "Salle R&D", professeur: "Mme. Martin" },
          { jour: "Jeudi", heure: "10:15 - 12:15", matiere: "Innovation multimédia", type: "TD", salle: "M303", professeur: "Prof. Lee" },
          { jour: "Vendredi", heure: "08:00 - 10:00", matiere: "Management de projets", type: "Cours", salle: "M304", professeur: "Dr. Patel" }
        ];
    }
  };

  const emploiDuTemps = getEmploiDuTemps();

  const horaires = [
    "08:00 - 10:00",
    "10:15 - 12:15",
    "14:00 - 16:00",
    "16:15 - 18:15"
  ];
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

  const getCoursParHeureEtJour = (heure: string, jour: string) => {
    return emploiDuTemps.find(c => c.heure === heure && c.jour === jour);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Emploi du temps - Multimédia Internet et Communication</h1>
      <p className="text-gray-600 mb-4">
        Niveau: {user?.niveau || "N/A"}
      </p>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-teal-700 text-white">
            <th className="border border-gray-300 px-2 py-1">Heure</th>
            {jours.map(jour => (
              <th key={jour} className="border border-gray-300 px-2 py-1">{jour}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horaires.map(heure => (
            <tr key={heure} className="bg-white hover:bg-gray-50">
              <td className="border border-gray-300 px-2 py-1 font-medium">{heure}</td>
              {jours.map(jour => {
                const cours = getCoursParHeureEtJour(heure, jour);
                return (
                  <td key={jour} className="border border-gray-300 px-2 py-2 align-top">
                    {cours ? (
                      <div>
                        <strong>{cours.matiere}</strong><br />
                        <span className="text-xs text-gray-700">{cours.type} — {cours.professeur}</span><br />
                        <span className="text-xs text-gray-500">Salle: {cours.salle}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">&mdash;</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="mt-6 text-center text-gray-500 text-sm">
        &copy; 2025 EduPlatform - Multimédia Internet et Communication
      </footer>
    </div>
  );
}
