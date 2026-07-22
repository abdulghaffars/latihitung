import { prisma } from '@/lib/prisma'; 
import RiwayatClient from './RiwayatClient';

// Matikan cache agar data selalu ter-update (real-time)
export const dynamic = 'force-dynamic';

export default async function RiwayatPage() {
  const sessions = await prisma.session.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 500 
  });

  return (
    <main className="min-h-screen bg-gray-50 text-black p-4 sm:p-8 font-sans">
      <RiwayatClient initialData={sessions} />
    </main>
  );
}