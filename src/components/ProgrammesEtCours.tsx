'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { classes, modulesData, teachers } from '@/data/coursData';


export default function ProgrammesEtCours() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('Toutes les classes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModules, setFilteredModules] = useState<any[]>([]);
  const [classStats, setClassStats] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.specialite) {
      // Calculer les statistiques
      const stats = classes.map(classe => {
        const modulesForClass = modulesData.filter(m => 
          m.classe === classe.name && 
          m.specialite === user.specialite
        );
        
        const teachersForClass = teachers.filter(t => 
          t.classes.includes(classe.name) &&
          t.specialite === user.specialite
        );

        return {
          ...classe,
          moduleCount: modulesForClass.length,
          teacherCount: teachersForClass.length
        };
      });
      
      setClassStats(stats);

      // Filtrer les modules
      let filtered = modulesData.filter(module => 
        module.specialite === user.specialite
      );
      
      if (selectedClass !== 'Toutes les classes') {
        filtered = filtered.filter(module => module.classe === selectedClass);
      }
      
      if (searchTerm) {
        filtered = filtered.filter(module => 
          module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.teacher.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredModules(filtered);
    }
  }, [user, selectedClass, searchTerm]);

  const getSpecialiteName = () => {
    if (!user?.specialite) return "Filière Inconnue";
    switch(user.specialite) {
      case 'ida': return "Informatique (Développement Web & Mobile)";
      case 'mic': return "Multimédia et Ingénierie des Contenus";
      case 'cd': return "Communication Digitale";
      default: return "Filière Inconnue";
    }
  };

  // Ajout d'un état de chargement
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      
      <header className="bg-white shadow-sm border-b p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Cours</h1>
            <p className="text-gray-600 text-sm">Filière {getSpecialiteName()}</p>
          </div>
          <button 
            className="bg-[#1E40AF] text-white px-4 py-2 rounded-lg hover:bg-[#1E3A8A] transition-colors self-start"
            onClick={() => alert('Fonctionnalité à implémenter')}
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Nouveau Module
          </button>
        </div>
      </header>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
          {classStats.map((classe) => (
            <div key={classe.id} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{classe.name}</p>
                  <p className="text-xl md:text-2xl font-bold text-[#1E40AF]">
                    {classe.moduleCount}
                  </p>
                  <p className="text-xs text-gray-500">modules</p>
                </div>
                <i className="fa-solid fa-book text-[#1E40AF] text-lg md:text-xl"></i>
              </div>
              <div className="mt-1 md:mt-2 text-xs text-gray-600">
                {classe.teacherCount} enseignants
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 md:p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Gestion des Modules</h3>
            <p className="text-gray-600 text-sm">Ajouter/modifier les modules par classe</p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4 md:mb-6">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option>Toutes les classes</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.name}>{classe.name}</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Rechercher un module..." 
                className="border rounded-lg px-3 py-2 text-sm flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredModules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun module trouvé</p>
                <button 
                  className="mt-4 text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setSelectedClass('Toutes les classes');
                    setSearchTerm('');
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {filteredModules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div className="mb-2 sm:mb-0">
                        <h4 className="font-medium text-gray-800">{module.name}</h4>
                        <p className="text-sm text-gray-600">
                          {module.classe} - {module.hours}h - {module.teacher}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <span className={`px-2 py-1 ${
                            module.status === 'Actif' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          } text-xs rounded`}>
                            {module.status}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {module.semester}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 self-end">
                        <button 
                          className="text-[#1E40AF] hover:text-[#1E3A8A]"
                          onClick={() => alert(`Modifier ${module.name}`)}
                        >
                          <i className="fa-solid fa-edit"></i> Modifier
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            if (confirm(`Supprimer le module ${module.name} ?`)) {
                              alert(`Module ${module.name} supprimé`);
                            }
                          }}
                        >
                          <i className="fa-solid fa-trash"></i> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border mt-6">
          <div className="p-4 md:p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Affectation Enseignants</h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers
                .filter(teacher => teacher.specialite === user.specialite)
                .map((teacher) => (
                  <div key={teacher.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={teacher.avatar} 
                        alt={teacher.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{teacher.name}</p>
                        <p className="text-sm text-gray-600">
                          {teacher.modules} modules - {teacher.classes.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 ${
                        teacher.status === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : teacher.status === 'Congé'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      } text-xs rounded`}>
                        {teacher.status}
                      </span>
                      <button 
                        className="text-[#1E40AF] text-sm hover:underline"
                        onClick={() => alert(`Modifier ${teacher.name}`)}
                      >
                        <i className="fa-solid fa-edit mr-1"></i> Modifier
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}