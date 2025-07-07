'use client';

import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminHome() {
  const { session, loading } = useAdminAuth();

  if (loading) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to Admin Panel</h1>
      {/* Optionally show stats summary or redirect */}
    </div>
  );
}
