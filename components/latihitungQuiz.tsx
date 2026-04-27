import { useEffect, useRef } from 'react';
import { QuestionData } from '@/utils/mathLogic';

interface LatihitungQuizProps {
  mode: string;
  level: number;
  score: number;
  lives: number;
  questionData: QuestionData | null;
  onAnswer: (answer: number, timeTaken: number) => void;
  onEndSession: () => void;
}

export default function LatihitungQuiz({ 
  mode, level, score, lives, questionData, onAnswer, onEndSession 
}: LatihitungQuizProps) {
  const questionStartMsRef = useRef<number>(0);

  useEffect(() => {
    questionStartMsRef.current = performance.now();
  }, [questionData]);

  const handleAnswerClick = (
    answer: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const timeTaken = (e.timeStamp - questionStartMsRef.current) / 1000;
    onAnswer(answer, timeTaken);
  };

  if (!questionData) return <div>Memuat soal...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto py-8 space-y-8">
      <div className="flex justify-between w-full p-4 bg-gray-100 rounded-lg font-semibold text-gray-700">
        <div>Mode: {mode.replace('_', ' ').toUpperCase()}</div>
        <div>Level: {level}</div>
        <div>Skor: {score}</div>
        {mode === 'endless_survival' && <div>Nyawa: {"❤️".repeat(lives)}</div>}
      </div>

      <div className="text-6xl font-bold text-center py-10">
        {questionData.question} = ?
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {questionData.options.map((opt, idx) => (
          <button 
            key={idx}
            onClick={(e) => handleAnswerClick(opt, e)}
            className="p-6 text-2xl font-bold bg-white border-4 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition"
          >
            {opt}
          </button>
        ))}
      </div>

      <button 
        onClick={onEndSession}
        className="mt-8 px-6 py-2 text-red-500 underline hover:text-red-700"
      >
        Akhiri Sesi & Lihat Rekap
      </button>
    </div>
  );
}