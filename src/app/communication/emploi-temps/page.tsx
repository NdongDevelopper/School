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

export default function EmploiDuTempsCommDigitalePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getEmploiDuTemps = (): Cours[] => {
    switch(user?.niveau) {
      case 'L1':
        return [
          { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Fondamentaux de la communication", type: "Cours", salle: "C101", professeur: "Mme. Dubois" },
          { jour: "Lundi", heure: "10:15 - 12:15", matiere: "Rédaction web", type: "TD", salle: "C102", professeur: "M. Martin" },
          { jour: "Mardi", heure: "08:00 - 10:00", matiere: "Marketing digital", type: "TP", salle: "C103", professeur: "Dr. Lefevre" },
          { jour: "Mercredi", heure: "14:00 - 16:00", matiere: "Design graphique", type: "Cours", salle: "C104", professeur: "M. Bernard" },
          { jour: "Jeudi", heure: "10:15 - 12:15", matiere: "Réseaux sociaux", type: "TD", salle: "C105", professeur: "Mme. Rousseau" },
          { jour: "Vendredi", heure: "08:00 - 10:00", matiere: "Stratégie digitale", type: "Cours", salle: "C106", professeur: "Prof. Lee" }
        ];
      case 'L2':
        return [
          { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Gestion de communauté", type: "Cours", salle: "C201", professeur: "Mme. Martin" },
          { jour: "Mardi", heure: "10:15 - 12:15", matiere: "Analytics web", type: "TP", salle: "C202", professeur: "M. Garcia" },
          { jour: "Mardi", heure: "14:00 - 16:00", matiere: "Branding digital", type: "TD", salle: "C203", professeur: "Dr. Kim" },
          { jour: "Mercredi", heure: "08:00 - 10:00", matiere: "Communication de crise", type: "Cours", salle: "C204", professeur: "Dr. Nguyen" },
          { jour: "Jeudi", heure: "10:15 - 12:15", matiere: "E-réputation", type: "TD", salle: "C205", professeur: "Mme. Patel" },
          { jour: "Vendredi", heure: "08:00 - 10:00", matiere: "Influence marketing", type: "Cours", salle: "C206", professeur: "M. Dubois" }
        ];
      default:
        return [
          { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Stratégie digitale avancée", type: "Cours", salle: "C301", professeur: "Dr. Anderson" },
          { jour: "Lundi", heure: "10:15 - 12:15", matiere: "Projet digital", type: "Réunion", salle: "Salle Projet", professeur: "Mme. Martin" },
          { jour: "Mardi", heure: "14:00 - 16:00", matiere: "Marketing d’influence", type: "Cours", salle: "C302", professeur: "Dr. Patel" },
          { jour: "Mercredi", heure: "08:00 - 10:00", matiere: "Communication mobile", type: "TD", salle: "C303", professeur: "M. Taylor" },
          { jour: "Jeudi", heure: "10:15 - 12:15", matiere: "Analyse des données", type: "TP", salle: "Labo Data", professeur: "Prof. Lee" },
          { jour: "Vendredi", heure: "08:00 - 10:00", matiere: "Communication de crise", type: "Cours", salle: "C304", professeur: "Mme. Nguyen" }
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
      <h1 className="text-2xl font-bold mb-4">Emploi du temps - Communication Digitale</h1>
      <p className="text-gray-600 mb-4">
        Niveau: {user?.niveau || "N/A"}
      </p>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-indigo-700 text-white">
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
        &copy; 2025 EduPlatform - Communication Digitale
      </footer>
    </div>
  );
}
