'use client';

import RouteGuard from '@/components/RouteGuard';

export default function UnauthorizedPage() {
  return (
    <RouteGuard roles={[]}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Accès non autorisé</h1>
          <p className="text-gray-700">Vous n'avez pas la permission d'accéder à cette page.</p>
        </div>
      </div>
    </RouteGuard>
  );
}
