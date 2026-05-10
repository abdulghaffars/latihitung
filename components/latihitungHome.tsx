import { useState } from 'react';

interface LatihitungHomeProps {
  onStart: (name: string) => void;
}

export default function LatihitungHome({ onStart }: LatihitungHomeProps) {
  const [name, setName] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-5xl font-bold text-blue-600">Latihitung</h1>
      <p className="text-xl text-gray-600">Asah Kemampuan Berhitungmu di Sini!</p>
      
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Masukkan namamu di sini..." 
        className="px-4 py-3 min-w-[300px] border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 text-center"
      />

      <button 
        onClick={() => onStart(name)}
        disabled={!name.trim()}
        className="px-8 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Mulai Belajar
      </button>
    </div>
  );
}