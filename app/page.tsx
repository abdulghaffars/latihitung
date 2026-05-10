'use client';

import { useState } from 'react';
import LatihitungHome from '@/components/latihitungHome';
import LatihitungMode from '@/components/latihitungMode';
import LatihitungQuiz from '@/components/latihitungQuiz';
import LatihitungRecap, { HistoryItem } from '@/components/latihitungRecap';
import { generateQuestion, QuestionData } from '@/utils/mathLogic';

type PageState = 'home' | 'modeSelect' | 'quiz' | 'recap';
type ModeState = 'time_attack' | 'endless_santai' | 'endless_survival' | '';

export default function LatihitungPage() {
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [userName, setUserName] = useState<string>('');
  const [mode, setMode] = useState<ModeState>('');
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);

  const startGame = (name: string) => {
    setUserName(name);
    setCurrentPage('modeSelect');
  };

  const selectMode = (selectedMode: string) => {
    setMode(selectedMode as ModeState);
    setLevel(1);
    setScore(0);
    setLives(3);
    setHistory([]);
    setCurrentQuestion(generateQuestion(1));
    setCurrentPage('quiz');
  };

  const saveScoreToDatabase = async (finalScore: number, finalHistory: HistoryItem[]) => {
    if (!userName || finalHistory.length === 0) return;

    const correctAnswers = finalHistory.filter(item => item.isCorrect).length;
    const incorrectAnswers = finalHistory.filter(item => !item.isCorrect).length;

    try {
      const res = await fetch('/api/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: userName,
          score: finalScore,
          mode: mode,
          correctAnswers,
          incorrectAnswers,
          historyDetail: finalHistory,
        }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Mantap! Skor dan histori berhasil disimpan ke database Neon.");
      } else {
        console.error("Gagal menyimpan dari server:", data.error);
      }
    } catch (error) {
      console.error("Gagal melakukan fetch ke API:", error);
    }
  };

  const handleAnswer = (userAnswer: number, timeTaken: number) => {
    if (!currentQuestion) return;

    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    
    let newLevel = level;
    let newLives = lives;
    let currentScore = score;

    if (isCorrect && timeTaken < 10) {
      newLevel = level + 1;
      currentScore += (10 * level);
    } else if (!isCorrect) {
      newLevel = Math.max(1, level - 1);
      if (mode === 'endless_survival') {
        newLives -= 1;
        setLives(newLives);
      }
    } else if (isCorrect) {
      currentScore += 5;
    }

    setScore(currentScore);
    setLevel(newLevel);

    const newHistoryItem: HistoryItem = {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.correctAnswer,
      userAnswer,
      isCorrect,
      timeTaken,
      levelActive: level
    };
    const updatedHistory = [...history, newHistoryItem];
    
    setHistory(updatedHistory);

    if (mode === 'endless_survival' && newLives <= 0) {
      setCurrentPage('recap');
      saveScoreToDatabase(currentScore, updatedHistory);
    } else {
      setCurrentQuestion(generateQuestion(newLevel));
    }
  };

  const endSession = () => {
    setCurrentPage('recap');
    saveScoreToDatabase(score, history); 
  };

  const restartToHome = () => {
    setCurrentPage('home');
  };

  return (
    <main className="min-h-screen bg-white text-black p-4 font-sans">
      {currentPage === 'home' && <LatihitungHome onStart={startGame} />}
      {currentPage === 'modeSelect' && <LatihitungMode onSelectMode={selectMode} />}
      {currentPage === 'quiz' && (
        <LatihitungQuiz 
          mode={mode} 
          level={level} 
          score={score} 
          lives={lives}
          questionData={currentQuestion}
          onAnswer={handleAnswer}
          onEndSession={endSession}
        />
      )}
      {currentPage === 'recap' && (
        <LatihitungRecap history={history} score={score} onRestart={restartToHome} />
      )}
    </main>
  );
}