export const classes = [
  { id: 1, name: 'L1' },
  { id: 2, name: 'L2' },
  { id: 3, name: 'L3' },
  { id: 4, name: 'M1' },
  { id: 5, name: 'M2' },
];

export const modulesData = [
  // IDA
  { id: 1, name: 'Algorithmique avancée', classe: 'L1', hours: 60, teacher: 'Dr. Ahmed Khalil', status: 'Actif', semester: 'S1', specialite: 'ida' },
  { id: 2, name: 'Base de données', classe: 'L1', hours: 45, teacher: 'Prof. Fatima Zahra', status: 'Actif', semester: 'S1', specialite: 'ida' },
  { id: 3, name: 'Développement web', classe: 'L2', hours: 60, teacher: 'Dr. Martin', status: 'Actif', semester: 'S2', specialite: 'ida' },
  { id: 4, name: 'Systèmes distribués', classe: 'L3', hours: 50, teacher: 'Prof. Dubois', status: 'Actif', semester: 'S1', specialite: 'ida' },
  { id: 5, name: 'Intelligence artificielle', classe: 'M1', hours: 55, teacher: 'Dr. Leclerc', status: 'Actif', semester: 'S2', specialite: 'ida' },
  
  // MIC
  { id: 6, name: 'Design graphique', classe: 'L1', hours: 50, teacher: 'Mme. Laurent', status: 'Actif', semester: 'S1', specialite: 'mic' },
  { id: 7, name: 'Animation 3D', classe: 'L2', hours: 60, teacher: 'M. Petit', status: 'Actif', semester: 'S1', specialite: 'mic' },
  { id: 8, name: 'Montage vidéo', classe: 'L2', hours: 45, teacher: 'M. Bernard', status: 'Actif', semester: 'S2', specialite: 'mic' },
  { id: 9, name: 'Effets spéciaux', classe: 'L3', hours: 55, teacher: 'M. Dupont', status: 'Actif', semester: 'S1', specialite: 'mic' },
  { id: 10, name: 'Motion design', classe: 'M1', hours: 50, teacher: 'Mme. Robert', status: 'Actif', semester: 'S2', specialite: 'mic' },
  
  // CD
  { id: 11, name: 'Marketing digital', classe: 'L1', hours: 45, teacher: 'Dr. Ndiaye', status: 'Actif', semester: 'S1', specialite: 'cd' },
  { id: 12, name: 'Stratégie digitale', classe: 'L2', hours: 50, teacher: 'Mme. Diop', status: 'Actif', semester: 'S1', specialite: 'cd' },
  { id: 13, name: 'Gestion de communauté', classe: 'L3', hours: 40, teacher: 'M. Sarr', status: 'Actif', semester: 'S2', specialite: 'cd' },
  { id: 14, name: 'Branding', classe: 'M1', hours: 55, teacher: 'Dr. Kane', status: 'Actif', semester: 'S1', specialite: 'cd' },
  { id: 15, name: 'Stratégie de contenu', classe: 'M2', hours: 45, teacher: 'Mme. Fall', status: 'Actif', semester: 'S2', specialite: 'cd' },
];

export const teachers = [
  // IDA
  { id: 1, name: 'Dr. Ahmed Khalil', modules: 4, status: 'Actif', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', classes: ['L1', 'L2'], specialite: 'ida' },
  { id: 2, name: 'Prof. Fatima Zahra', modules: 3, status: 'Actif', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', classes: ['L1', 'L3'], specialite: 'ida' },
  { id: 3, name: 'Dr. Martin', modules: 2, status: 'Actif', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', classes: ['L2'], specialite: 'ida' },
  
  // MIC
  { id: 4, name: 'Mme. Laurent', modules: 4, status: 'Actif', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', classes: ['L1', 'L2'], specialite: 'mic' },
  { id: 5, name: 'M. Petit', modules: 3, status: 'Actif', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', classes: ['L2', 'L3'], specialite: 'mic' },
  { id: 6, name: 'M. Bernard', modules: 2, status: 'Congé', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', classes: ['L2'], specialite: 'mic' },
  
  // CD
  { id: 7, name: 'Dr. Ndiaye', modules: 3, status: 'Actif', avatar: 'https://randomuser.me/api/portraits/men/7.jpg', classes: ['L1', 'M1'], specialite: 'cd' },
  { id: 8, name: 'Mme. Diop', modules: 4, status: 'Actif', avatar: 'https://randomuser.me/api/portraits/women/8.jpg', classes: ['L2', 'L3'], specialite: 'cd' },
  { id: 9, name: 'M. Sarr', modules: 2, status: 'Actif', avatar: 'https://randomuser.me/api/portraits/men/9.jpg', classes: ['L3'], specialite: 'cd' },
];