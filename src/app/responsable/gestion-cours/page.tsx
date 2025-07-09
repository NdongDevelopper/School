'use client';

import { useAuth } from '@/context/AuthContext';
import RouteGuard from '@/components/RouteGuard';
import ProgrammesEtCours from '@/components/ProgrammesEtCours';

export default function GestionCoursPage() {
  const { user } = useAuth();

  return (
    <RouteGuard roles={['responsable']}>
      <ProgrammesEtCours />
    </RouteGuard>
  );
}