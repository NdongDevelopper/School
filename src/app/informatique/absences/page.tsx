"use client";

import React, { useState } from "react";

export default function Absences() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddingJustification, setIsAddingJustification] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleJustificationForm = () => {
    setIsAddingJustification(!isAddingJustification);
  };

  const absencesData = [
    {
      date: "15/07/2025",
      matiere: "Initiation à la programmation",
      horaire: "08h00 - 10h00",
      statut: "Non justifiée",
      actionText: "Justifier",
      actionClass: "text-neutral-600 hover:text-neutral-900 cursor-pointer",
    },
    {
      date: "18/07/2025",
      matiere: "Initiation à l'algorithmique",
      horaire: "10h15 - 12h15",
      statut: "Justifiée",
      actionText: "Voir justificatif",
      actionClass: "text-neutral-400 cursor-default",
    },
    {
      date: "22/07/2025",
      matiere: "Introduction aux langages HTML/CSS",
      horaire: "14h00 - 16h00",
      statut: "Non justifiée",
      actionText: "Justifier",
      actionClass: "text-neutral-600 hover:text-neutral-900 cursor-pointer",
    },
    {
      date: "25/07/2025", // corrigé ici
      matiere: "Introduction au langage JavaScript",
      horaire: "08h00 - 10h00",
      statut: "Justifiée",
      actionText: "Voir justificatif",
      actionClass: "text-neutral-400 cursor-default",
    },
    {
      date: "28/07/2025", // corrigé ici
      matiere: "Introduction aux Réseaux",
      horaire: "10h15 - 12h15",
      statut: "En attente",
      actionText: "Justifier",
      actionClass: "text-neutral-600 hover:text-neutral-900 cursor-pointer",
    },
    {
      date: "01/02/2025", // corrigé ici
      matiere: "Techniques d'expression et de communication",
      horaire: "14h00 - 16h00",
      statut: "Justifiée",
      actionText: "Voir justificatif",
      actionClass: "text-neutral-400 cursor-default",
    },
    {
      date: "05/02/2025",
      matiere: "Leadership",
      horaire: "16h15 - 18h15",
      statut: "Justifiée",
      actionText: "Voir justificatif",
      actionClass: "text-neutral-400 cursor-default",
    },
    {
      date: "08/08/2025",
      matiere: "Anglais",
      horaire: "08h00 - 10h00",
      statut: "Non justifiée",
      actionText: "Justifier",
      actionClass: "text-neutral-600 hover:text-neutral-900 cursor-pointer",
    },
  ];

  // Calculs des stats simples
  const totalAbsences = absencesData.length;
  const justifiees = absencesData.filter((a) => a.statut === "Justifiée").length;
  const nonJustifiees = absencesData.filter((a) => a.statut === "Non justifiée").length;
  const tauxAssiduite = Math.round((justifiees / totalAbsences) * 100);

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header mobile */}
      <header className="bg-white shadow-sm border-b border-neutral-200 px-4 py-3 flex items-center justify-between lg:hidden">
        <div>
          <h1 className="text-xl text-neutral-900">Gestion des Absences</h1>
          <p className="text-neutral-600 text-xs">Suivi de vos absences</p>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-neutral-600 hover:text-neutral-900"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-neutral-600 text-white flex flex-col z-20 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <h2 className="text-xl">Espace Étudiant</h2>
            <p className="text-sm text-neutral-100 mt-1">Licence 1 - Informatique</p>
          </div>

          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              <li>
                <span className="flex items-center px-4 py-3 text-neutral-100 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Emploi du temps
                </span>
              </li>
              <li>
                <span className="flex items-center px-4 py-3 text-neutral-100 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 -2-2V5a2 2 0 2-2h5.586a1 1 0 .707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Notes
                </span>
              </li>
              <li>
                <span className="flex items-center px-4 py-3 bg-neutral-800 text-white rounded-lg cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Absences
                </span>
              </li>
              <li>
                <span className="flex items-center px-4 py-3 text-neutral-100 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  Délibérations
                </span>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-neutral-500">
            <div className="flex items-center">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=12345"
                alt="Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="text-sm">Jean Dupont</p>
                <p className="text-xs text-neutral-200">ID: L1-2025-001</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Header desktop */}
          <header className="bg-white shadow-sm border-b border-neutral-200 px-4 py-4 lg:px-8 flex items-center justify-between lg:flex">
            <div>
              <h1 className="text-xl lg:text-2xl text-neutral-900">Gestion des Absences</h1>
              <p className="text-neutral-600 mt-1 text-sm lg:text-base">Suivi de vos absences et justificatifs</p>
            </div>
            <div>
              <button
                onClick={toggleJustificationForm}
                className="bg-neutral-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-neutral-700 transition-colors flex items-center text-sm lg:text-base"
                aria-label="Ajouter un justificatif"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Ajouter un justificatif
              </button>
            </div>
          </header>

          {/* Content area */}
          <section className="flex-1 p-4 lg:p-8 overflow-auto">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-neutral-200 flex items-center">
                <div className="p-2 lg:p-3 bg-neutral-100 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm text-neutral-600">Total Absences</p>
                  <p className="text-xl lg:text-2xl text-neutral-900">{totalAbsences}</p>
                </div>
              </div>

              <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-neutral-200 flex items-center">
                <div className="p-2 lg:p-3 bg-neutral-100 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm text-neutral-600">Non justifiées</p>
                  <p className="text-xl lg:text-2xl text-neutral-900">{nonJustifiees}</p>
                </div>
              </div>

              <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-neutral-200 flex items-center">
                <div className="p-2 lg:p-3 bg-neutral-100 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm text-neutral-600">Justifiées</p>
                  <p className="text-xl lg:text-2xl text-neutral-900">{justifiees}</p>
                </div>
              </div>

              <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-neutral-200 flex items-center">
                <div className="p-2 lg:p-3 bg-neutral-100 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm text-neutral-600">Taux d'assiduité</p>
                  <p className="text-xl lg:text-2xl text-neutral-900">{tauxAssiduite}%</p>
                </div>
              </div>
            </div>

            {/* Liste des absences */}
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-neutral-200">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Matière
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Horaire
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {absencesData.map((absence, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">{absence.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">{absence.matiere}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">{absence.horaire}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-neutral-900">{absence.statut}</td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${absence.actionClass}`}
                        onClick={() => {
                          if (absence.actionText === "Justifier") {
                            setIsAddingJustification(true);
                          }
                        }}
                      >
                        {absence.actionText}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formulaire de justificatif */}
            {isAddingJustification && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow border border-neutral-200 max-w-lg mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-neutral-900">Ajouter un justificatif</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Justificatif soumis !");
                    setIsAddingJustification(false);
                  }}
                >
                  <div className="mb-4">
                    <label htmlFor="dateAbsence" className="block text-sm font-medium text-neutral-700 mb-1">
                      Date de l'absence
                    </label>
                    <input
                      type="date"
                      id="dateAbsence"
                      name="dateAbsence"
                      required
                      className="w-full border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="raison" className="block text-sm font-medium text-neutral-700 mb-1">
                      Raison du justificatif
                    </label>
                    <textarea
                      id="raison"
                      name="raison"
                      rows={3}
                      required
                      className="w-full border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                      placeholder="Expliquez la raison de votre absence..."
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="fichier" className="block text-sm font-medium text-neutral-700 mb-1">
                      Joindre un fichier (optionnel)
                    </label>
                    <input
                      type="file"
                      id="fichier"
                      name="fichier"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingJustification(false)}
                      className="px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300 transition"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-neutral-600 text-white hover:bg-neutral-700 transition"
                    >
                      Soumettre
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
