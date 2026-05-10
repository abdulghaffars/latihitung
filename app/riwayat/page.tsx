import { prisma } from '@/lib/prisma'; 
import Link from 'next/link';

export default async function RiwayatPage() {
  const sessions = await prisma.session.findMany({
    orderBy: {
      score: 'desc'
    },
    take: 50 
  });

  return (
    <main className="min-h-screen bg-gray-50 text-black p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Papan Skor Latihitung</h1>
            <p className="text-gray-500">Daftar 50 skor tertinggi dari semua pemain.</p>
          </div>
          <Link 
            href="/" 
            className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition shadow-sm"
          >
            Kembali ke Home
          </Link>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-center w-20">Rank</th>
                <th className="p-4 text-left">Nama Pemain</th>
                <th className="p-4 text-left">Mode</th>
                <th className="p-4 text-center">Skor</th>
                <th className="p-4 text-center">Benar / Salah</th>
                <th className="p-4 text-left">Waktu Selesai</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 text-lg">
                    Belum ada data riwayat. Ayo jadilah yang pertama bermain!
                  </td>
                </tr>
              ) : (
                sessions.map((session, index) => (
                  <tr 
                    key={session.id} 
                    className="border-b border-gray-100 hover:bg-blue-50 transition"
                  >
                    <td className="p-4 text-center font-bold text-gray-500">
                      #{index + 1}
                    </td>
                    
                    <td className="p-4 font-semibold text-gray-900 text-lg">
                      {session.playerName}
                    </td>
                    
                    <td className="p-4 text-gray-600 capitalize">
                      {session.mode.replace('_', ' ')}
                    </td>
                    
                    <td className="p-4 text-center font-black text-blue-600 text-xl">
                      {session.score}
                    </td>
                    
                    <td className="p-4 text-center">
                      <span className="text-green-600 font-bold" title="Jawaban Benar">
                        {session.correctAnswers}
                      </span>
                      <span className="text-gray-300 mx-2">/</span>
                      <span className="text-red-500 font-bold" title="Jawaban Salah">
                        {session.incorrectAnswers}
                      </span>
                    </td>
                    
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(session.createdAt).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })} WIB
                    </td>
                    
                    <td className="p-4 text-center">
                      <Link 
                        href={`/riwayat/${session.id}`}
                        className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition text-sm whitespace-nowrap"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}