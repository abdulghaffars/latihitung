interface LatihitungModeProps {
    onSelectMode: (mode: string) => void;
  }
  
  export default function LatihitungMode({ onSelectMode }: LatihitungModeProps) {
    const modes = [
      { id: 'time_attack', name: 'Time Attack', desc: 'Selesaikan sebanyak mungkin dalam 60 detik.' },
      { id: 'endless_santai', name: 'Endless Santai', desc: 'Belajar tanpa batas waktu dan nyawa.' },
      { id: 'endless_survival', name: 'Endless Survival', desc: 'Punya 3 nyawa. Salah = -1 nyawa.' }
    ];
  
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <h2 className="text-3xl font-bold">Pilih Mode Latihan</h2>
        <div className="grid gap-4 w-full max-w-md">
          {modes.map((mode) => (
            <button 
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className="p-4 border-2 border-blue-400 rounded-xl hover:bg-blue-50 transition text-left"
            >
              <div className="font-bold text-xl text-blue-700">{mode.name}</div>
              <div className="text-sm text-gray-500">{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }