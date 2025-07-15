export default function ResultsTable() {
  const students = [
    { 
      id: 1, 
      name: "Aminata Diallo", 
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg", 
      number: "L1-2024-001", 
      grade: 16.5, 
      mention: "Bien", 
      status: "Admis" 
    },
    { 
      id: 2, 
      name: "Moussa Koné", 
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg", 
      number: "L1-2024-002", 
      grade: 14.2, 
      mention: "Assez Bien", 
      status: "Admis" 
    },
    { 
      id: 3, 
      name: "Fatou Sow", 
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg", 
      number: "L1-2024-003", 
      grade: 9.5, 
      mention: "-", 
      status: "Rattrapage" 
    },
    { 
      id: 4, 
      name: "Omar Ba", 
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg", 
      number: "L1-2024-004", 
      grade: 18.0, 
      mention: "Très Bien", 
      status: "Admis" 
    },
    { 
      id: 5, 
      name: "Aïcha Ndiaye", 
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg", 
      number: "L1-2024-005", 
      grade: 7.2, 
      mention: "-", 
      status: "Échec" 
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Résultats Licence 1 - JavaScript</h3>
          <button className="px-4 py-2 bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-900">
            <i className="fa-solid fa-download mr-2"></i>Exporter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note/20</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mention</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img src={student.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.mention}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    student.status === 'Admis' 
                      ? 'bg-green-100 text-green-800' 
                      : student.status === 'Rattrapage' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">Affichage de 1 à 5 sur 37 résultats</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500">Précédent</button>
            <button className="px-3 py-1 bg-blue-800 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}