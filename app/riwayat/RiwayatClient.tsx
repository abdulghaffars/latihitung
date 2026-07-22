'use client';

import { useState } from 'react';
import Link from 'next/link';

type SessionData = {
  id: string;
  playerName: string;
  mode: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  createdAt: Date;
};

export default function RiwayatClient({ initialData }: { initialData: SessionData[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'score'>('time'); // Default berdasarkan waktu

  const filteredData = initialData.filter((session) =>
    session.playerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'time') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.score - a.score;
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Papan Skor Latihitung</h1>
          <p className="text-gray-500">Lihat riwayat dan performa semua pemain.</p>
        </div>
        <Link 
          href="/" 
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition shadow-sm whitespace-nowrap"
        >
          Kembali ke Home
        </Link>
      </div>

      {/* Bar Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        
        {/* Input Search */}
        <div className="flex-1 relative flex">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            🔍
          </div>
          <input
            type="text"
            placeholder="Cari nama pemain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-500 uppercase">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'time' | 'score')}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white font-semibold text-gray-700 cursor-pointer"
          >
            <option value="time">Waktu Selesai (Terbaru)</option>
            <option value="score">Skor (Tertinggi)</option>
          </select>
        </div>

      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
        <table className="w-full border-collapse min-w-[800px]">
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
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 text-lg">
                  {searchTerm ? 'Pemain tidak ditemukan.' : 'Belum ada data riwayat.'}
                </td>
              </tr>
            ) : (
              sortedData.map((session, index) => (
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
  );
}