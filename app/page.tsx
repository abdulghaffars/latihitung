'use client';

import { useState, useEffect, useRef } from 'react';
import LatihitungHome from '@/components/latihitungHome';
import LatihitungMode from '@/components/latihitungMode';
import LatihitungRules from '@/components/latihitungRules';
import LatihitungQuiz from '@/components/latihitungQuiz';
import LatihitungRecap, { HistoryItem } from '@/components/latihitungRecap';
import { generateQuestion, Operator, QuestionData } from '@/utils/mathLogic';

type PageState = 'home' | 'modeSelect' | 'gameRules' | 'quiz' | 'recap';
type ModeState = 'time_attack' | 'survival' | 'free_practice' | '';

export default function LatihitungPage() {
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [userName, setUserName] = useState<string>('');
  const [mode, setMode] = useState<ModeState>('');
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const hasSavedRef = useRef<boolean>(false);

  const [gameSettings, setGameSettings] = useState<{ operators: Operator[]; includeNegative: boolean }>({
    operators: ['+', '-', 'x', '÷'] as Operator[],
    includeNegative: false
  });

  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // CACHE: Store the next question in memory without triggering re-render
  const questionCache = useRef<Record<number, QuestionData>>({});

  useEffect(() => {
    const savedName = localStorage.getItem('latihitung_playerName');
    
    setTimeout(() => {
      if (savedName) {
        setUserName(savedName);
        setCurrentPage('modeSelect'); 
      } else {
        setCurrentPage('home'); 
      }
      
      setIsInitializing(false);
    }, 0);
  }, []);

  // Function to refill the question cache in the background
  const preloadNextQuestions = (baseLevel: number, settings: { operators: string[]; includeNegative: boolean }) => {
    const levelsToCache = [
      Math.max(1, baseLevel - 1), // Destination if down level (min 1)
      baseLevel,                  // Destination if stay
      baseLevel + 1               // Destination if up level
    ];

    // Use Set so that if baseLevel is 1, we don't generate level 1 twice
    const uniqueLevels = Array.from(new Set(levelsToCache));

    const newCache: Record<number, QuestionData> = {};
    uniqueLevels.forEach(lvl => {
      newCache[lvl] = generateQuestion(
        lvl, 
        settings.operators as Operator[], 
        settings.includeNegative, 
        settings.includeNegative
      );
    });

    questionCache.current = newCache;
  };

  const startGame = (name: string) => {
    setUserName(name);
    setCurrentPage('modeSelect');
  };

  const selectMode = (selectedMode: string) => {
    setMode(selectedMode as ModeState);
    setCurrentPage('gameRules');
  };

  const handleStartQuizWithSettings = (settings: { operators: Operator[]; includeNegative: boolean }) => {
    hasSavedRef.current = false;
    setGameSettings(settings as { operators: Operator[]; includeNegative: boolean });
    setLevel(1);
    setScore(0);
    setLives(3);
    setStreak(0);
    setHistory([]);
    
    // 1. Give the first question instantly
    setCurrentQuestion(generateQuestion(1, settings.operators as Operator[], settings.includeNegative, settings.includeNegative));
    
    // 2. Prepare the next question cache for the next possible steps (Level 1 and Level 2)
    preloadNextQuestions(1, settings);
    
    setCurrentPage('quiz');
  };

  const saveScoreToDatabase = async (finalScore: number, finalHistory: HistoryItem[]) => {
    if (!userName || finalHistory.length === 0 || hasSavedRef.current) return;
    hasSavedRef.current = true;
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
          allowedOperators: gameSettings.operators,
          correctAnswers,
          incorrectAnswers,
          historyDetail: finalHistory,
        }),
      });
      const data = await res.json();
      if (data.success) console.log("Well done! Score and history saved.");
    } catch (error) {
      console.error("Failed to fetch to API:", error);
    }
  };

  const handleAnswer = (userAnswer: number, timeTaken: number) => {
    if (!currentQuestion) return;

    const isCorrect = userAnswer === currentQuestion.correctAnswer;

    let newLevel = level;
    let newLives = lives;
    let currentScore = score;
    let currentStreak = streak;

    if (isCorrect) {
      currentStreak += 1;
      const bonusMultiplier = Math.floor(currentStreak / 3);
      currentScore += 10 + (5 * bonusMultiplier);

      if (timeTaken < 10) {
        newLevel = level + 1;
      }
    } else {
      currentStreak = 0;
      currentScore -= 10;
      newLevel = Math.max(1, level - 1);

      if (mode === 'survival') {
        newLives -= 1;
        setLives(newLives);
      }
    }

    setScore(currentScore);
    setLevel(newLevel);
    setStreak(currentStreak);

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

    if (mode === 'survival' && newLives <= 0) {
      setCurrentPage('recap');
      saveScoreToDatabase(currentScore, updatedHistory);
    } else {
      // 1. Pull the question from the cache instantly without needing to regenerate
      setCurrentQuestion(
        questionCache.current[newLevel] ?? generateQuestion(newLevel, gameSettings.operators as Operator[], gameSettings.includeNegative, gameSettings.includeNegative)
      );      
      // 2. Command the system to mix a new batch of questions in the background
      // using setTimeout to avoid blocking the render UI from the new pulled question
      setTimeout(() => {
        preloadNextQuestions(newLevel, gameSettings);
      }, 0);
    }
  };

  const endSession = () => {
    setCurrentPage('recap');
    saveScoreToDatabase(score, history);
  };

  const restartToHome = () => {
    setCurrentPage('modeSelect');
  };

  const handleChangeName = () => {
    localStorage.removeItem('latihitung_playerName');
    setUserName('');
    setCurrentPage('home');
  };

  if (isInitializing) {
    return <main className="min-h-screen bg-white" />;
  }

  return (
    <main className="min-h-screen bg-white text-black p-4 font-sans">
      {currentPage === 'home' && <LatihitungHome onStart={startGame} />}
      
      {currentPage === 'modeSelect' && (
        <LatihitungMode 
          userName={userName} 
          onSelectMode={selectMode} 
          onChangeName={handleChangeName} 
        />
      )}
      
      {currentPage === 'gameRules' && (
        <LatihitungRules 
          onBack={() => setCurrentPage('modeSelect')} 
          onStartQuiz={handleStartQuizWithSettings as (settings: { operators: string[]; includeNegative: boolean }) => void} 
        />
      )}

      {currentPage === 'quiz' && (
        <LatihitungQuiz
          mode={mode}
          level={level}
          score={score}
          lives={lives}
          streak={streak}
          questionData={currentQuestion}
          onAnswer={handleAnswer}
          onEndSession={endSession}
        />
      )}
      
      {currentPage === 'recap' && (
        <LatihitungRecap 
          history={history} 
          score={score} 
          onRestart={restartToHome} 
        />
      )}
    </main>
  );
}