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
  const correctAnswers = history.filter(item => item.isCorrect).length;
  const incorrectAnswers = history.filter(item => !item.isCorrect).length;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-8 space-y-6">
      <h2 className="text-3xl font-bold">Rekap Latihan</h2>
      <div className="flex items-center justify-center gap-4">
        <div className="text-2xl font-semibold text-blue-600">Skor Akhir: {score}</div>
        <div className="text-2xl font-semibold text-blue-600">|</div>
        <div className="text-2xl font-semibold text-blue-600">Benar: {correctAnswers}</div>
        <div className="text-2xl font-semibold text-blue-600">|</div>
        <div className="text-2xl font-semibold text-blue-600">Salah: {incorrectAnswers}</div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-center w-20">Level</th>
              <th className="p-3 text-left">Soal</th>
              <th className="p-3 text-left">Jawabanmu</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 text-center font-bold text-gray-600">
                  {item.levelActive}
                </td>
                <td className="p-3">{item.question}</td>
                <td className="p-3">{item.userAnswer}</td>
                <td className="p-3 text-center">
                  {item.isCorrect ? '✅ Benar' : '❌ Salah'}
                </td>
                <td className="p-3 text-center">
                  <span className={item.timeTaken > 20 ? 'text-red-500' : 'text-gray-700'}>
                    {item.timeTaken.toFixed(1)}s
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={onRestart}
        className="px-8 py-3 text-lg font-semibold text-white bg-gray-800 rounded-lg hover:bg-black transition"
      >
        Kembali ke Menu Utama
      </button>
    </div>
  );
}