interface LatihitungHomeProps {
    onStart: () => void;
  }
  
  export default function LatihitungHome({ onStart }: LatihitungHomeProps) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="text-5xl font-bold text-blue-600">Latihitung</h1>
        <p className="text-xl text-gray-600">Asah Logika Matematikamu Secara Dinamis!</p>
        <button 
          onClick={onStart}
          className="px-8 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Mulai Belajar
        </button>
      </div>
    );
  }