'use client';

import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useEffect } from 'react';

declare global {
  interface Window {
    Highcharts: any;
  }
}

export default function AdminDashboard() {
  const { user } = useAuth();

  useEffect(() => {
    // Charger Highcharts et initialiser les graphiques
    const loadHighcharts = () => {
      const script = document.createElement('script');
      script.src = 'https://code.highcharts.com/highcharts.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.Highcharts !== 'undefined') {
          initializeCharts();
        }
      };
      document.head.appendChild(script);
    };

    const initializeCharts = () => {
      // Taux de Réussite par Filière
      window.Highcharts.chart('successChart', {
        chart: { type: 'column' },
        title: { text: null },
        xAxis: { categories: ['MIC', 'IDA', 'CD'] },
        yAxis: { title: { text: 'Taux (%)' }, max: 100 },
        series: [
          { name: 'L1', data: [75, 82, 78], color: '#1e3a8a' },
          { name: 'L2', data: [80, 76, 85], color: '#3b82f6' },
          { name: 'L3', data: [85, 88, 82], color: '#60a5fa' },
          { name: 'M1', data: [90, 85, 88], color: '#93c5fd' },
          { name: 'M2', data: [92, 89, 91], color: '#bfdbfe' }
        ]
      });

      // Taux d'Échec par Niveau
      window.Highcharts.chart('failureChart', {
        chart: { type: 'pie' },
        title: { text: null },
        series: [{
          data: [
            { name: 'L1', y: 25, color: '#dc2626' },
            { name: 'L2', y: 20, color: '#ef4444' },
            { name: 'L3', y: 15, color: '#f87171' },
            { name: 'M1', y: 10, color: '#fca5a5' },
            { name: 'M2', y: 8, color: '#fecaca' }
          ]
        }]
      });

      // Nombre d'Étudiants par Filière
      window.Highcharts.chart('studentsChart', {
        chart: { type: 'bar' },
        title: { text: null },
        xAxis: { categories: ['L1', 'L2', 'L3', 'M1', 'M2'] },
        yAxis: { title: { text: "Nombre d'étudiants" } },
        series: [
          { name: 'MIC', data: [450, 380, 320, 180, 120], color: '#1e3a8a' },
          { name: 'IDA', data: [420, 350, 290, 160, 110], color: '#3b82f6' },
          { name: 'CD', data: [380, 320, 270, 140, 95], color: '#60a5fa' }
        ]
      });

      // Enseignants et Responsables
      window.Highcharts.chart('teachersChart', {
        chart: { type: 'column' },
        title: { text: null },
        xAxis: { categories: ['MIC', 'IDA', 'CD'] },
        yAxis: { title: { text: 'Nombre' } },
        series: [
          { name: 'Enseignants', data: [52, 48, 56], color: '#1e3a8a' },
          { name: 'Responsables', data: [3, 3, 3], color: '#ef4444' }
        ]
      });

      // Taux d'Insertion Professionnelle
      window.Highcharts.chart('insertionChart', {
        chart: { type: 'line' },
        title: { text: null },
        xAxis: { categories: ['2019', '2020', '2021', '2022', '2023'] },
        yAxis: { title: { text: "Taux d'insertion (%)" }, max: 100 },
        series: [
          { name: 'MIC', data: [78, 82, 85, 88, 92], color: '#1e3a8a' },
          { name: 'IDA', data: [75, 79, 83, 86, 89], color: '#3b82f6' },
          { name: 'CD', data: [72, 76, 80, 84, 87], color: '#60a5fa' }
        ]
      });
    };

    // Charger Font Awesome
    const loadFontAwesome = () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    };

    loadHighcharts();
    loadFontAwesome();

    return () => {
      // Nettoyer si nécessaire
    };
  }, []);

  return (
    <RouteGuard roles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-[#1e3a8a] text-white z-50">
          <div className="p-6">
            <h1 className="text-xl font-bold">Administrateur  Général de l'Université</h1>
            <p className="text-blue-200 text-sm">Université Numérique du Sénégal</p>
          </div>
          
          <nav className="mt-8">
            <Link href="/admin" className="flex items-center px-6 py-3 bg-blue-700 border-r-4 border-white">
              <i className="fa-solid fa-chart-line mr-3"></i>
              <span>Tableau de Bord</span>
            </Link>
            <Link href="/admin/gestion-responsables" className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
              <i className="fa-solid fa-users mr-3"></i>
              <span>Gestion Responsables</span>
            </Link>
            <Link href="/admin/gestion-enseignants" className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
              <i className="fa-solid fa-chalkboard-teacher mr-3"></i>
              <span>Gestion Enseignants</span>
            </Link>
            <Link href="/admin/gestion-etudiants" className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
              <i className="fa-solid fa-user-graduate mr-3"></i>
              <span>Gestion Étudiants</span>
            </Link>
            <Link href="/admin/gestion-filieres" className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
              <i className="fa-solid fa-graduation-cap mr-3"></i>
              <span>Gestion Filières</span>
            </Link>
            <Link href="/admin/deliberations" className="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
              <i className="fa-solid fa-clipboard-check mr-3"></i>
              <span>Délibérations</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#1e3a8a]">Tableau de Bord</h2>
                <p className="text-gray-600">Vue d'ensemble de l'université</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <i className="fa-solid fa-bell text-gray-400 text-xl"></i>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </div>
                <img 
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" 
                  alt="Admin" 
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Partie 1: Statistiques Académiques */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#1e3a8a] mb-6">Statistiques Académiques</h3>
              
              {/* Taux de Réussite/Échec */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Taux de Réussite par Filière</h4>
                  <div id="successChart" className="h-80"></div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Taux d'Échec par Niveau</h4>
                  <div id="failureChart" className="h-80"></div>
                </div>
              </div>

              {/* Effectifs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Nombre d'Étudiants par Filière</h4>
                  <div id="studentsChart" className="h-80"></div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Enseignants et Responsables</h4>
                  <div id="teachersChart" className="h-80"></div>
                </div>
              </div>
            </div>

            {/* Partie 2: Alertes et Insertion */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#1e3a8a] mb-6">Alertes et Insertion Professionnelle</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alertes */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-red-600 mb-4">
                    <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                    Alertes Système
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <i className="fa-solid fa-user-times text-red-500 mr-3"></i>
                      <div>
                        <p className="font-medium text-red-800">12 Enseignants non affectés</p>
                        <p className="text-red-600 text-sm">Nécessite une affectation urgente</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <i className="fa-solid fa-user-graduate text-yellow-500 mr-3"></i>
                      <div>
                        <p className="font-medium text-yellow-800">8 Étudiants sans filière</p>
                        <p className="text-yellow-600 text-sm">Orientation en attente</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <i className="fa-solid fa-calendar-times text-orange-500 mr-3"></i>
                      <div>
                        <p className="font-medium text-orange-800">3 Cours sans enseignant</p>
                        <p className="text-orange-600 text-sm">Filière MIC - Niveau M1</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Taux d'Insertion */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Taux d'Insertion Professionnelle</h4>
                  <div id="insertionChart" className="h-80"></div>
                </div>
              </div>
            </div>

            {/* Résumé Rapide */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1e3a8a] text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200">Total Étudiants</p>
                    <p className="text-2xl font-bold">2,847</p>
                  </div>
                  <i className="fa-solid fa-users text-3xl text-blue-300"></i>
                </div>
              </div>
              
              <div className="bg-green-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200">Enseignants</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                  <i className="fa-solid fa-chalkboard-teacher text-3xl text-green-300"></i>
                </div>
              </div>
              
              <div className="bg-purple-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200">Filières</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <i className="fa-solid fa-graduation-cap text-3xl text-purple-300"></i>
                </div>
              </div>
              
              <div className="bg-orange-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-200">Taux Réussite</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                  <i className="fa-solid fa-chart-line text-3xl text-orange-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}