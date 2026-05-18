import { useState } from 'react';

interface LatihitungRulesProps {
  onBack: () => void;
  onStartQuiz: (settings: { operators: string[]; includeNegative: boolean }) => void;
}

export default function LatihitungRules({ onBack, onStartQuiz }: LatihitungRulesProps) {
  const [plusChecked, setPlusChecked] = useState(true);
  const [minusChecked, setMinusChecked] = useState(true);
  const [negativeChecked, setNegativeChecked] = useState(false);

  const isOperatorValid = plusChecked || minusChecked;

  const handleStart = () => {
    if (!isOperatorValid) return;

    const operators: string[] = [];
    if (plusChecked) operators.push('+');
    if (minusChecked) operators.push('-');

    onStartQuiz({
      operators,
      includeNegative: negativeChecked,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4 py-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800">Aturan & Jenis Soal</h2>
      <p className="text-gray-500 text-center text-sm">
        Sesuaikan jenis operasi matematika yang ingin kamu latih kali ini.
      </p>

      <div className="w-full bg-white p-6 border-2 border-gray-200 rounded-2xl shadow-sm space-y-4">
        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Pilih Operasi (Minimal 1)</span>
        
        <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
          <input 
            type="checkbox" 
            checked={plusChecked}
            onChange={(e) => setPlusChecked(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Penjumlahan (+)</span>
            <span className="text-xs text-gray-400">Contoh: 12 + 5</span>
          </div>
        </label>

        <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
          <input 
            type="checkbox" 
            checked={minusChecked}
            onChange={(e) => setMinusChecked(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Pengurangan (-)</span>
            <span className="text-xs text-gray-400">Contoh: 15 - 7</span>
          </div>
        </label>

        <hr className="border-gray-100 my-2" />
        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori Tambahan</span>

        <label className="flex items-center space-x-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
          <input 
            type="checkbox" 
            checked={negativeChecked}
            onChange={(e) => setNegativeChecked(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Melibatkan Bilangan Negatif</span>
            <span className="text-xs text-gray-400">Contoh: -5 + 8 atau 3 - (-2)</span>
          </div>
        </label>
      </div>

      {!isOperatorValid && (
        <p className="text-red-500 text-sm font-medium animate-bounce">
          ⚠️ Kamu harus memilih minimal satu operasi (+ atau -)!
        </p>
      )}

      <div className="flex space-x-4 w-full">
        <button 
          onClick={onBack}
          className="flex-1 px-4 py-3 font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
        >
          Kembali
        </button>
        <button 
          onClick={handleStart}
          disabled={!isOperatorValid}
          className="flex-[2] px-4 py-3 font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
        >
          Mulai Kuis 🚀
        </button>
      </div>
    </div>
  );
}