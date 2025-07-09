'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { SPECIALITES, SpecialiteKey } from '@/utils/specialites';

type UserRole = 'etudiant' | 'enseignant' | 'admin' | 'responsable';

export interface User {
  username: string;
  name: string; // ✅ Propriété ajoutée
  role: UserRole;
  specialite: SpecialiteKey | null;
  nomSpecialite: string | null;
  niveau: string | null;
}

interface Student {
  username: string;
  password: string;
  specialite: SpecialiteKey;
  niveau: string;
}

interface Teacher {
  username: string;
  password: string;
  specialite: SpecialiteKey;
}

interface Responsable {
  username: string;
  password: string;
  specialite: SpecialiteKey;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    username: string,
    password: string,
    role: UserRole,
    specialite?: SpecialiteKey,
    niveau?: string
  ) => void;
  logout: () => void;
  isUsernameTaken: (username: string) => boolean;
  registerStudent: (
    username: string,
    password: string,
    specialite: SpecialiteKey,
    niveau: string
  ) => boolean;
  registerTeacher: (
    username: string,
    password: string,
    specialite: SpecialiteKey
  ) => boolean;
  registerResponsable: (
    username: string,
    password: string,
    specialite: SpecialiteKey
  ) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedStudents = localStorage.getItem('students');
    const storedTeachers = localStorage.getItem('teachers');
    const storedResponsables = localStorage.getItem('responsables');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    if (storedTeachers) setTeachers(JSON.parse(storedTeachers));
    if (storedResponsables) setResponsables(JSON.parse(storedResponsables));

    setLoading(false);
  }, []);

  const isUsernameTaken = (username: string) => {
    return (
      students.some((s) => s.username === username) ||
      teachers.some((t) => t.username === username) ||
      responsables.some((r) => r.username === username)
    );
  };

  const registerStudent = (
    username: string,
    password: string,
    specialite: SpecialiteKey,
    niveau: string
  ) => {
    if (isUsernameTaken(username)) return false;

    const newStudent = { username, password, specialite, niveau };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    return true;
  };

  const registerTeacher = (
    username: string,
    password: string,
    specialite: SpecialiteKey
  ) => {
    if (isUsernameTaken(username)) return false;

    const newTeacher = { username, password, specialite };
    const updatedTeachers = [...teachers, newTeacher];
    setTeachers(updatedTeachers);
    localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
    return true;
  };

  const registerResponsable = (
    username: string,
    password: string,
    specialite: SpecialiteKey
  ) => {
    if (isUsernameTaken(username)) return false;

    const newResponsable = { username, password, specialite };
    const updatedResponsables = [...responsables, newResponsable];
    setResponsables(updatedResponsables);
    localStorage.setItem('responsables', JSON.stringify(updatedResponsables));
    return true;
  };

  const login = (
    username: string,
    password: string,
    role: UserRole,
    specialite?: SpecialiteKey,
    niveau?: string
  ) => {
    // Admin login
    if (role === 'admin') {
      if (username === 'admin' && password === 'admin123') {
        const userData: User = {
          username,
          name: 'Administrateur',
          role,
          specialite: null,
          nomSpecialite: null,
          niveau: null
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/admin/dashboard');
        return;
      } else {
        alert('Identifiants admin incorrects');
        return;
      }
    }

    // Étudiant
    if (role === 'etudiant') {
      const student = students.find(
        (s) => s.username === username && s.password === password
      );

      if (student) {
        const userData: User = {
          username,
          name: username,
          role,
          specialite: student.specialite,
          nomSpecialite: SPECIALITES[student.specialite],
          niveau: student.niveau
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push(`/${student.specialite}/tableau-bord`);
        return;
      } else {
        alert('Identifiants étudiants incorrects ou compte non trouvé');
        return;
      }
    }

    // Enseignant
    if (role === 'enseignant') {
      const teacher = teachers.find(
        (t) => t.username === username && t.password === password
      );

      if (teacher) {
        const userData: User = {
          username,
          name: username,
          role,
          specialite: teacher.specialite,
          nomSpecialite: SPECIALITES[teacher.specialite],
          niveau: null
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/enseignant/dashboard');
        return;
      } else {
        alert('Identifiants enseignant incorrects ou compte non trouvé');
        return;
      }
    }

    // Responsable
    if (role === 'responsable') {
      const responsable = responsables.find(
        (r) => r.username === username && r.password === password
      );

      if (responsable) {
        const userData: User = {
          username,
          name: username,
          role,
          specialite: responsable.specialite,
          nomSpecialite: SPECIALITES[responsable.specialite],
          niveau: null
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/responsable/tableau-bord');
        return;
      } else {
        alert('Identifiants responsable incorrects ou compte non trouvé');
        return;
      }
    }

    alert('Rôle non pris en charge');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isUsernameTaken,
    registerStudent,
    registerTeacher,
    registerResponsable
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
