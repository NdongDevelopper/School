'use client';

import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import RouteGuard from '@/components/RouteGuard';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Simuler un chargement initial
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Options des graphiques
  const successChartOptions: Highcharts.Options = {
    chart: { 
      type: 'column',
      height: '300px'
    },
    title: { text: undefined },
    xAxis: { categories: ['MIC', 'IDA', 'CD'] },
    yAxis: { title: { text: 'Taux (%)' }, max: 100 },
    series: [{
      name: 'L1', 
      type: 'column',
      data: [75, 82, 78], 
      color: '#1e3a8a'
    }, {
      name: 'L2', 
      type: 'column',
      data: [80, 76, 85], 
      color: '#3b82f6'
    }, {
      name: 'L3', 
      type: 'column',
      data: [85, 88, 82], 
      color: '#60a5fa'
    }, {
      name: 'M1', 
      type: 'column',
      data: [90, 85, 88], 
      color: '#93c5fd'
    }, {
      name: 'M2', 
      type: 'column',
      data: [92, 89, 91], 
      color: '#bfdbfe'
    }]
  };

  const failureChartOptions: Highcharts.Options = {
    chart: { 
      type: 'pie',
      height: '300px'
    },
    title: { text: undefined },
    series: [{
      type: 'pie',
      data: [
        { name: 'L1', y: 25, color: '#dc2626' },
        { name: 'L2', y: 20, color: '#ef4444' },
        { name: 'L3', y: 15, color: '#f87171' },
        { name: 'M1', y: 10, color: '#fca5a5' },
        { name: 'M2', y: 8, color: '#fecaca' }
      ]
    }]
  };

  const studentsChartOptions: Highcharts.Options = {
    chart: { 
      type: 'bar',
      height: '300px'
    },
    title: { text: undefined },
    xAxis: { categories: ['L1', 'L2', 'L3', 'M1', 'M2'] },
    yAxis: { title: { text: "Nombre d'étudiants" } },
    series: [{
      name: 'MIC', 
      type: 'bar',
      data: [450, 380, 320, 180, 120], 
      color: '#1e3a8a'
    }, {
      name: 'IDA', 
      type: 'bar',
      data: [420, 350, 290, 160, 110], 
      color: '#3b82f6'
    }, {
      name: 'CD', 
      type: 'bar',
      data: [380, 320, 270, 140, 95], 
      color: '#60a5fa'
    }]
  };

  const teachersChartOptions: Highcharts.Options = {
    chart: { 
      type: 'column',
      height: '300px'
    },
    title: { text: undefined },
    xAxis: { categories: ['MIC', 'IDA', 'CD'] },
    yAxis: { title: { text: 'Nombre' } },
    series: [{
      name: 'Enseignants', 
      type: 'column',
      data: [52, 48, 56], 
      color: '#1e3a8a'
    }, {
      name: 'Responsables', 
      type: 'column',
      data: [3, 3, 3], 
      color: '#ef4444'
    }]
  };

  const insertionChartOptions: Highcharts.Options = {
    chart: { 
      type: 'line',
      height: '300px'
    },
    title: { text: undefined },
    xAxis: { categories: ['2019', '2020', '2021', '2022', '2023'] },
    yAxis: { title: { text: "Taux d'insertion (%)" }, max: 100 },
    series: [{
      name: 'MIC', 
      type: 'line',
      data: [78, 82, 85, 88, 92], 
      color: '#1e3a8a'
    }, {
      name: 'IDA', 
      type: 'line',
      data: [75, 79, 83, 86, 89], 
      color: '#3b82f6'
    }, {
      name: 'CD', 
      type: 'line',
      data: [72, 76, 80, 84, 87], 
      color: '#60a5fa'
    }]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <RouteGuard roles={['administrateur']}>
      <div className="bg-gray-50 min-h-screen">
        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div 
          className={`fixed left-0 top-0 h-full w-64 bg-blue-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <div className="p-6 border-b border-blue-700">
            <h1 className="text-xl font-bold">UNS Admin</h1>
            <p className="text-blue-200 text-sm">Université Numérique du Sénégal</p>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-1">
              <li>
                <button className="flex w-full items-center px-6 py-3 bg-blue-700 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Tableau de Bord</span>
                </button>
              </li>
              <li>
                <button className="flex w-full items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Gestion Responsables</span>
                </button>
              </li>
              <li>
                <button className="flex w-full items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Gestion Enseignants</span>
                </button>
              </li>
              <li>
                <button className="flex w-full items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Gestion Étudiants</span>
                </button>
              </li>
              <li>
                <button className="flex w-full items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Gestion Filières</span>
                </button>
              </li>
              <li>
                <button className="flex w-full items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Délibérations</span>
                </button>
              </li>
            </ul>
          </nav>
          
          {/* Bouton de fermeture pour mobile */}
          <button 
            className="absolute top-4 right-4 text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className={`ml-0 transition-all duration-300 min-h-screen ${
          sidebarOpen ? 'md:ml-64' : 'ml-0'
        }`}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-4 py-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <button 
                  className="mr-2 md:mr-4 text-gray-600 hover:text-gray-900 md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-blue-800">Tableau de Bord Administrateur</h1>
                  <p className="text-gray-600 text-sm">Vue d'ensemble de l'université</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4 mt-2 md:mt-0">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-300 flex items-center justify-center">
                  <span className="text-blue-800 font-medium">A</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-4 md:p-6">
            {/* Partie 1: Statistiques Académiques */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-blue-800 mb-4 md:mb-6">Statistiques Académiques</h3>
              
              {/* Taux de Réussite/Échec */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <h4 className="font-medium text-blue-800 mb-3 md:mb-4">Taux de Réussite par Filière</h4>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={successChartOptions}
                  />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <h4 className="font-medium text-blue-800 mb-3 md:mb-4">Taux d'Échec par Niveau</h4>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={failureChartOptions}
                  />
                </div>
              </div>

              {/* Effectifs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <h4 className="font-medium text-blue-800 mb-3 md:mb-4">Nombre d'Étudiants par Filière</h4>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={studentsChartOptions}
                  />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <h4 className="font-medium text-blue-800 mb-3 md:mb-4">Enseignants et Responsables</h4>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={teachersChartOptions}
                  />
                </div>
              </div>
            </div>

            {/* Partie 2: Alertes et Insertion */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-blue-800 mb-4 md:mb-6">Alertes et Insertion Professionnelle</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Alertes */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <h4 className="font-medium text-red-600 mb-3 md:mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Alertes Système
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <div>
                        <p className="font-medium text-red-800 text-sm md:text-base">12 Enseignants non affectés</p>
                        <p className="text-red-600 text-xs md:text-sm">Nécessite une affectation urgente</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-yellow-800 text-sm md:text-base">8 Étudiants sans filière</p>
                        <p className="text-yellow-600 text-xs md:text-sm">Orientation en attente</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-orange-800 text-sm md:text-base">3 Cours sans enseignant</p>
                        <p className="text-orange-600 text-xs md:text-sm">Filière MIC - Niveau M1</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Taux d'Insertion */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <h4 className="font-medium text-blue-800 mb-3 md:mb-4">Taux d'Insertion Professionnelle</h4>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={insertionChartOptions}
                  />
                </div>
              </div>
            </div>

            {/* Résumé Rapide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-blue-800 text-white p-4 md:p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm md:text-base">Total Étudiants</p>
                    <p className="text-xl md:text-2xl font-bold">2,847</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-green-700 text-white p-4 md:p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm md:text-base">Enseignants</p>
                    <p className="text-xl md:text-2xl font-bold">156</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-purple-700 text-white p-4 md:p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm md:text-base">Filières</p>
                    <p className="text-xl md:text-2xl font-bold">3</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-amber-700 text-white p-4 md:p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-200 text-sm md:text-base">Taux Réussite</p>
                    <p className="text-xl md:text-2xl font-bold">78%</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}