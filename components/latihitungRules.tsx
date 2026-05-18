'use client';

import { cn } from '@/utils/cn';
import { useState } from 'react';

interface LatihitungRulesProps {
  onBack: () => void;
  onStartQuiz: (settings: { operators: string[]; includeNegative: boolean }) => void;
}
interface ToggleCardProps {
  title: string;
  desc: string;
  isChecked: boolean;
  onClick: () => void;
}

const ToggleCard = ({ title, desc, isChecked, onClick }: ToggleCardProps) => (
<button
  onClick={onClick}
  className={cn(
    "relative flex items-center p-4 w-full rounded-xl border-2 transition-all text-left group",
    {
      "border-blue-500 bg-blue-50 shadow-md": isChecked,
      "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50": !isChecked,
    }
  )}
>
    <div className="flex-1">
      <div className={`font-bold text-xl transition-transform ${
        isChecked ? 'text-blue-700' : 'text-gray-700 group-hover:translate-x-1 group-hover:text-blue-600'
      }`}>
        {title}
      </div>
      <div className="text-sm text-gray-500 mt-1">{desc}</div>
    </div>
  </button>
);

export default function LatihitungRules({ onBack, onStartQuiz }: LatihitungRulesProps) {
  const [plusChecked, setPlusChecked] = useState(false);
  const [minusChecked, setMinusChecked] = useState(false);
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4 py-8">
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Aturan Soal</h2>
        <p className="text-gray-500 text-sm">
          Pilih jenis operasi matematika yang ingin dilatih.
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-md">
        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-[-4px]">
          Operasi Dasar (Pilih Minimal 1)
        </span>
        
        <ToggleCard 
          title="Penjumlahan (+)" 
          desc="Contoh soal: 12 + 5" 
          isChecked={plusChecked} 
          onClick={() => setPlusChecked(!plusChecked)} 
        />
        
        <ToggleCard 
          title="Pengurangan (-)" 
          desc="Contoh soal: 15 - 7" 
          isChecked={minusChecked} 
          onClick={() => setMinusChecked(!minusChecked)} 
        />

        <div className="flex items-center space-x-4 my-2">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Tantangan Tambahan
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <ToggleCard 
          title="Bilangan Negatif" 
          desc="Melibatkan angka minus (Contoh: -5 + 8)" 
          isChecked={negativeChecked} 
          onClick={() => setNegativeChecked(!negativeChecked)} 
        />
      </div>

      <div className="h-6">
        {!isOperatorValid && (
          <p className="text-red-500 text-sm font-medium animate-pulse">
            ⚠️ Wajib memilih minimal satu operasi!
          </p>
        )}
      </div>

      <div className="flex space-x-4 w-full max-w-md gap-3">
        <button 
          onClick={onBack}
          className="flex-1 px-4 py-3 font-semibold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          Kembali
        </button>
        <button 
          onClick={handleStart}
          disabled={!isOperatorValid}
          className="flex-2 px-4 py-3 font-semibold text-white bg-blue-500 border-2 border-blue-500 rounded-xl hover:bg-blue-600 hover:border-blue-600 transition-all disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm"
        >
          Mulai Latihan 🚀
        </button>
      </div>
    </div>
  );
}