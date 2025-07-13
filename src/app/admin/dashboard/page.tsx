'use client';

import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react'; // Import useState for better control

declare global {
  interface Window {
    Highcharts: any;
  }
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const successChartRef = useRef(null);
  const failureChartRef = useRef(null);
  const studentsChartRef = useRef(null);
  const teachersChartRef = useRef(null);
  const insertionChartRef = useRef(null);

  // State to track if Highcharts is loaded and charts can be initialized
  const [highchartsReady, setHighchartsReady] = useState(false);

  useEffect(() => {
    let highchartsInstance: any;

    const loadHighcharts = () => {
      if (typeof window.Highcharts !== 'undefined') {
        highchartsInstance = window.Highcharts;
        setHighchartsReady(true); // Highcharts is ready
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://code.highcharts.com/highcharts.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.Highcharts !== 'undefined') {
          highchartsInstance = window.Highcharts;
          // Dynamically load the 'exporting' module for responsiveness features
          const exportingScript = document.createElement('script');
          exportingScript.src = 'https://code.highcharts.com/modules/exporting.js';
          exportingScript.async = true;
          exportingScript.onload = () => {
            const accessibilityScript = document.createElement('script');
            accessibilityScript.src = 'https://code.highcharts.com/modules/accessibility.js';
            accessibilityScript.async = true;
            accessibilityScript.onload = () => {
              setHighchartsReady(true); // Set state to true when all Highcharts scripts are loaded
            };
            document.head.appendChild(accessibilityScript);
          };
          document.head.appendChild(exportingScript);
        }
      };
      script.onerror = () => {
        console.error("Failed to load Highcharts script.");
      };
      document.head.appendChild(script);
    };

    const loadFontAwesome = () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
      script.crossOrigin = 'anonymous';
      script.onerror = () => {
        console.error("Failed to load Font Awesome script.");
      };
      document.head.appendChild(script);
    };

    loadHighcharts();
    loadFontAwesome();

    return () => {
      // Cleanup Highcharts instances if needed on component unmount
      // Highcharts generally cleans up its internal references when the DOM element is removed,
      // but if you stored actual chart objects, you'd destroy them here.
    };
  }, []); // Run once on mount to load scripts

  // New useEffect to initialize charts ONLY when Highcharts is ready AND refs are available
  useEffect(() => {
    if (highchartsReady && typeof window.Highcharts !== 'undefined') {
      const highchartsInstance = window.Highcharts; // Get the global instance

      // Initialize all charts
      // Taux de Réussite par Filière
      if (successChartRef.current) {
        highchartsInstance.chart(successChartRef.current, {
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
          ],
          responsive: {
            rules: [{
              condition: { maxWidth: 500 },
              chartOptions: {
                legend: { align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
                yAxis: { labels: { align: 'left', x: 0, y: -5 }, title: { text: null } },
                subtitle: { text: null },
                credits: { enabled: false }
              }
            }]
          }
        });
      }

      // Taux d'Échec par Niveau
      if (failureChartRef.current) {
        highchartsInstance.chart(failureChartRef.current, {
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
          }],
          responsive: {
            rules: [{
              condition: { maxWidth: 500 },
              chartOptions: {
                legend: { align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
                yAxis: { labels: { align: 'left', x: 0, y: -5 }, title: { text: null } },
                subtitle: { text: null },
                credits: { enabled: false }
              }
            }]
          }
        });
      }

      // Nombre d'Étudiants par Filière
      if (studentsChartRef.current) {
        highchartsInstance.chart(studentsChartRef.current, {
          chart: { type: 'bar' },
          title: { text: null },
          xAxis: { categories: ['L1', 'L2', 'L3', 'M1', 'M2'] },
          yAxis: { title: { text: "Nombre d'étudiants" } },
          series: [
            { name: 'MIC', data: [450, 380, 320, 180, 120], color: '#1e3a8a' },
            { name: 'IDA', data: [420, 350, 290, 160, 110], color: '#3b82f6' },
            { name: 'CD', data: [380, 320, 270, 140, 95], color: '#60a5fa' }
          ],
          responsive: {
            rules: [{
              condition: { maxWidth: 500 },
              chartOptions: {
                legend: { align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
                yAxis: { labels: { align: 'left', x: 0, y: -5 }, title: { text: null } },
                subtitle: { text: null },
                credits: { enabled: false }
              }
            }]
          }
        });
      }

      // Enseignants et Responsables
      if (teachersChartRef.current) {
        highchartsInstance.chart(teachersChartRef.current, {
          chart: { type: 'column' },
          title: { text: null },
          xAxis: { categories: ['MIC', 'IDA', 'CD'] },
          yAxis: { title: { text: 'Nombre' } },
          series: [
            { name: 'Enseignants', data: [52, 48, 56], color: '#1e3a8a' },
            { name: 'Responsables', data: [3, 3, 3], color: '#ef4444' }
          ],
          responsive: {
            rules: [{
              condition: { maxWidth: 500 },
              chartOptions: {
                legend: { align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
                yAxis: { labels: { align: 'left', x: 0, y: -5 }, title: { text: null } },
                subtitle: { text: null },
                credits: { enabled: false }
              }
            }]
          }
        });
      }

      // Taux d'Insertion Professionnelle
      if (insertionChartRef.current) {
        highchartsInstance.chart(insertionChartRef.current, {
          chart: { type: 'line' },
          title: { text: null },
          xAxis: { categories: ['2019', '2020', '2021', '2022', '2023'] },
          yAxis: { title: { text: "Taux d'insertion (%)" }, max: 100 },
          series: [
            { name: 'MIC', data: [78, 82, 85, 88, 92], color: '#1e3a8a' },
            { name: 'IDA', data: [75, 79, 83, 86, 89], color: '#3b82f6' },
            { name: 'CD', data: [72, 76, 80, 84, 87], color: '#60a5fa' }
          ],
          responsive: {
            rules: [{
              condition: { maxWidth: 500 },
              chartOptions: {
                legend: { align: 'center', verticalAlign: 'bottom', layout: 'horizontal' },
                yAxis: { labels: { align: 'left', x: 0, y: -5 }, title: { text: null } },
                credits: { enabled: false }
              }
            }]
          }
        });
      }
    }
  }, [highchartsReady]); // Re-run this effect when highchartsReady state changes

  return (
    <RouteGuard roles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Mobile menu button */}
        <button
          className="lg:hidden fixed top-20 left-2 z-50 p-2 rounded-md bg-white text-[#1e3a8a]"
          onClick={() => {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar) sidebar.classList.toggle('-translate-x-full');
            if (overlay) overlay.classList.toggle('hidden');
          }}
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* Sidebar */}
        <div
          className="fixed top-0 left-0 h-full w-64 bg-[#1e3a8a] text-white z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out"
          id="sidebar"
        >
          <div className="p-6">
            <h1 className="text-xl font-bold">Administrateur Général de l'Université</h1>
            <p className="text-blue-200 text-sm">Université Numérique du Sénégal</p>
          </div>

          <nav className="mt-8">
            <Link href="/admin" className="flex items-center px-6 py-3 bg-blue-700 border-r-4 border-white whitespace-nowrap">
              <i className="fa-solid fa-chart-line mr-3"></i>
              <span className="ml-1">Tableau de Bord</span> {/* Added ml-1 here */}
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

        {/* Overlay for small screens */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden lg:hidden"
          id="sidebar-overlay"
          onClick={() => {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar) sidebar.classList.add('-translate-x-full');
            if (overlay) overlay.classList.add('hidden');
          }}
        ></div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-6 py-6">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Taux de Réussite par Filière</h4>
                  <div ref={successChartRef} className="h-80 w-full"></div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Taux d'Échec par Niveau</h4>
                  <div ref={failureChartRef} className="h-80 w-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Nombre d'Étudiants par Filière</h4>
                  <div ref={studentsChartRef} className="h-80 w-full"></div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Enseignants et Responsables</h4>
                  <div ref={teachersChartRef} className="h-80 w-full"></div>
                </div>
              </div>
            </div>

            {/* Partie 2: Alertes et Insertion */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#1e3a8a] mb-6">Alertes et Insertion Professionnelle</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-medium text-[#1e3a8a] mb-4">Taux d'Insertion Professionnelle</h4>
                  <div ref={insertionChartRef} className="h-80 w-full"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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