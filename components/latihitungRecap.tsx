export interface HistoryItem {
  question: string;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
  levelActive: number;
}

interface LatihitungRecapProps {
  history: HistoryItem[];
  score: number;
  onRestart: () => void;
}

export default function LatihitungRecap({ history, score, onRestart }: LatihitungRecapProps) {
  const totalQuestions = history.length;
  const correctAnswers = history.filter(item => item.isCorrect).length;
  const incorrectAnswers = history.filter(item => !item.isCorrect).length;
  
  // Hitung persentase akurasi
  const accuracy = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  // Hitung total durasi pengerjaan dari seluruh soal yang dijawab
  const totalSeconds = history.reduce((acc, item) => acc + item.timeTaken, 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  // Format waktu agar enak dibaca (contoh: "1m 15s" atau hanya "45s")
  const durationString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Bagian Judul */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Rekap Latihan
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          Kerja bagus! Berikut adalah detail performamu.
        </p>
      </div>

      {/* Grid Statistik - 2 Kolom di HP, 5 Kolom di Layar Besar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Skor Akhir</span>
          <span className="text-3xl sm:text-4xl font-black text-blue-600">{score}</span>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Akurasi</span>
          <span className="text-3xl sm:text-4xl font-black text-purple-600">{accuracy}%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Benar</span>
          <span className="text-3xl sm:text-4xl font-black text-green-500">{correctAnswers}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Salah</span>
          <span className="text-3xl sm:text-4xl font-black text-red-500">{incorrectAnswers}</span>
        </div>

        {/* Kartu Durasi: col-span-2 agar di HP dia melebar penuh dan simetris */}
        <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Durasi Total</span>
          <span className="text-3xl sm:text-4xl font-black text-orange-500">{durationString}</span>
        </div>
      </div>

      {/* Tabel Riwayat */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider w-16">Lvl</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider min-w-[120px]">Soal</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Jawaban</th>
                <th className="px-4 sm:px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic text-sm">
                    Belum ada soal yang dijawab.
                  </td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs font-bold text-gray-500">
                        {item.levelActive}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 text-base">
                      {item.question}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`font-bold text-base ${item.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                        {item.userAnswer}
                      </span>
                      {!item.isCorrect && (
                        <span className="ml-2 text-xs font-medium text-gray-400">
                          (seharusnya {item.correctAnswer})
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      {item.isCorrect ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          Benar
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          Salah
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <span className={`font-mono text-sm ${item.timeTaken > 10 ? 'text-orange-500 font-bold' : 'text-gray-500 font-medium'}`}>
                        {item.timeTaken.toFixed(1)}s
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* <button
        onClick={onRestart}
        className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-bold text-black bg-gray-900 rounded-xl hover:bg-gray-800 hover:shadow-lg focus:ring-4 focus:ring-gray-200 transition-all active:scale-95"
      >
        Kembali ke Menu Utama
      </button> */}
      <button
        onClick={onRestart}
        className="px-8 py-3 text-lg font-semibold text-white bg-gray-800 rounded-lg hover:bg-black transition"
      >
        Kembali ke Menu Utama
      </button>
    </div>
  );
}