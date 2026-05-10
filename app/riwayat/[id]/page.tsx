import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Interface untuk membaca data JSON yang disimpan
interface HistoryItem {
  question: string;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
  levelActive: number;
}

// PERHATIKAN: Tipe params sekarang dibungkus Promise
export default async function DetailRiwayatPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Wajib di-await sebelum mengekstrak .id
  const resolvedParams = await params;
  const sessionId = parseInt(resolvedParams.id);

  // 2. Validasi jika URL yang dimasukkan bukan angka
  if (isNaN(sessionId)) {
    return notFound();
  }

  // 3. Cari data sesi berdasarkan ID
  const session = await prisma.session.findUnique({
    where: { id: sessionId }
  });

  // Jika data tidak ditemukan di Neon, tampilkan halaman 404
  if (!session) {
    return notFound();
  }

  // Konversi JSON dari database kembali menjadi array
  const historyDetails = session.historyDetail as unknown as HistoryItem[];

  return (
    <main className="min-h-screen bg-gray-50 text-black p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">
            Detail Jawaban: {session.playerName}
          </h1>
          <Link 
            href="/riwayat" 
            className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition"
          >
            Kembali
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex gap-6 text-lg">
          <div><strong>Mode:</strong> <span className="capitalize">{session.mode.replace('_', ' ')}</span></div>
          <div><strong>Skor:</strong> {session.score}</div>
          <div className="text-green-600"><strong>Benar:</strong> {session.correctAnswers}</div>
          <div className="text-red-500"><strong>Salah:</strong> {session.incorrectAnswers}</div>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Level</th>
                <th className="p-4">Soal</th>
                <th className="p-4">Jawaban User</th>
                <th className="p-4">Kunci Jawaban</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {historyDetails.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-500">{item.levelActive}</td>
                  <td className="p-4 text-xl font-medium">{item.question}</td>
                  <td className={`p-4 font-bold ${item.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {item.userAnswer}
                  </td>
                  <td className="p-4">{item.correctAnswer}</td>
                  <td className="p-4 text-center">
                    {item.isCorrect ? '✅' : '❌'}
                  </td>
                  <td className="p-4 text-right text-gray-600">
                    {item.timeTaken.toFixed(1)}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}