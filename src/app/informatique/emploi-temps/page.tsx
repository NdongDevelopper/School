"use client";

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

export default function EmploiDuTempsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getEmploiDuTemps = (): Cours[] => {
    switch(user?.niveau) {
      case 'L1':
        return [
          { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Algorithmique", type: "Cours", salle: "A101", professeur: "Dr. Smith" },
          { jour: "Lundi", heure: "10:15 - 12:15", matiere: "Mathématiques", type: "TD", salle: "B203", professeur: "Prof. Johnson" },
          { jour: "Mardi", heure: "08:00 - 10:00", matiere: "Programmation", type: "TP", salle: "Labo Info 1", professeur: "Mme. Dupont" },
          { jour: "Mercredi", heure: "14:00 - 16:00", matiere: "Bases de données", type: "Cours", salle: "A102", professeur: "Dr. Garcia" },
          { jour: "Jeudi", heure: "10:15 - 12:15", matiere: "Anglais technique", type: "TD", salle: "C305", professeur: "M. Taylor" },
          { jour: "Vendredi", heure: "08:00 - 10:00", matiere: "Architecture", type: "Cours", salle: "A103", professeur: "Prof. Lee" }
        ];
      case 'L2':
        return [
          { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Structures de données", type: "Cours", salle: "A201", professeur: "Dr. Martin" },
          { jour: "Mardi", heure: "10:15 - 12:15", matiere: "Réseaux", type: "TP", salle: "Labo Réseaux", professeur: "Prof. Lee" },
          { jour: "Mardi", heure: "14:00 - 16:00", matiere: "Systèmes d'exploitation", type: "TD", salle: "B205", professeur: "M. Bernard" },
          { jour: "Mercredi", heure: "08:00 - 10:00", matiere: "Développement web", type: "TP", salle: "Labo Info 2", professeur: "Mme. Rousseau" },
          { jour: "Jeudi", heure: "10:15 - 12:15", matiere: "Gestion de projet", type: "Cours", salle: "A202", professeur: "Dr. Kim" },
          { jour: "Vendredi", heure: "08:00 - 10:00", matiere: "Bases de données avancées", type: "Cours", salle: "A203", professeur: "Dr. Garcia" }
        ];
      case 'M2':
      default:
        return [
          { jour: "Lundi", heure: "08:00 - 10:00", matiere: "Intelligence artificielle", type: "Cours", salle: "A301", professeur: "Dr. Kim" },
          { jour: "Lundi", heure: "10:15 - 12:15", matiere: "Machine Learning", type: "TP", salle: "Labo IA", professeur: "Prof. Anderson" },
          { jour: "Mardi", heure: "14:00 - 16:00", matiere: "Sécurité informatique", type: "Cours", salle: "A302", professeur: "Dr. Nguyen" },
          { jour: "Mercredi", heure: "08:00 - 10:00", matiere: "Cloud computing", type: "TD", salle: "B305", professeur: "M. Dubois" },
          { jour: "Jeudi", heure: "10:15 - 12:15", matiere: "Big Data", type: "TP", salle: "Labo Big Data", professeur: "Dr. Patel" },
          { jour: "Vendredi", heure: "08:00 - 10:00", matiere: "Projet de fin d'études", type: "Réunion", salle: "Salle Projet", professeur: "Mme. Martin" }
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
      <h1 className="text-2xl font-bold mb-4">Emploi du temps</h1>
      <p className="text-gray-600 mb-4">
        Spécialité: {user?.specialite || "Informatique"} — Niveau: {user?.niveau || "N/A"}
      </p>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
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
        &copy; 2025 EduPlatform - {user?.specialite || "Informatique"}
      </footer>
    </div>
  );
}
