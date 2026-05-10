interface LatihitungModeProps {
  userName: string; 
  onSelectMode: (mode: string) => void;
  onChangeName: () => void; 
}

export default function LatihitungMode({ userName, onSelectMode, onChangeName }: LatihitungModeProps) {
  const modes = [
    { id: 'time_attack', name: 'Time Attack', desc: 'Selesaikan sebanyak mungkin dalam 60 detik.' },
    { id: 'endless_santai', name: 'Endless Santai', desc: 'Belajar tanpa batas waktu dan nyawa.' },
    { id: 'endless_survival', name: 'Endless Survival', desc: 'Punya 3 nyawa. Salah = -1 nyawa.' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4 py-8">
      
      <div className="flex items-center justify-between w-full max-w-md p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="text-gray-700">
          Halo, <span className="font-bold text-blue-600">{userName}</span>! 👋
        </div>
        <button 
          onClick={onChangeName}
          className="text-sm font-medium text-gray-500 hover:text-blue-600 hover:underline transition-colors"
        >
          Ganti Pemain
        </button>
      </div>

      <h2 className="text-3xl font-bold text-center">Pilih Mode Latihan</h2>
      
      <div className="grid gap-4 w-full max-w-md">
        {modes.map((mode) => (
          <button 
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className="p-4 bg-white border-2 border-blue-400 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all text-left group"
          >
            <div className="font-bold text-xl text-blue-700 group-hover:translate-x-1 transition-transform">
              {mode.name}
            </div>
            <div className="text-sm text-gray-500 mt-1">{mode.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}