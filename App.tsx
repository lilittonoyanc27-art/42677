/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  QUESTIONS_DATA,
  QuestionItem,
  checkAnswerMatch,
} from './questions.ts';
import { soundManager } from './sound.ts';
import {
  Volume2,
  VolumeX,
  Eye,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  List,
  CircleDot,
  Languages,
  Play,
  Pause,
  Clock,
  Volume1,
} from 'lucide-react';

type QuestionStatus = 'unanswered' | 'correct' | 'wrong' | 'passed' | 'revealed';

interface QuestionState {
  status: QuestionStatus;
  userAnswer?: string;
  attempts: number;
  revealed: boolean;
}

const TOTAL_TIME_SECONDS = 30 * 60; // 30 minutes = 1800 seconds

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [states, setStates] = useState<Record<number, QuestionState>>(() => {
    const initial: Record<number, QuestionState> = {};
    QUESTIONS_DATA.forEach((q) => {
      initial[q.id] = {
        status: 'unanswered',
        attempts: 0,
        revealed: false,
      };
    });
    return initial;
  });

  const [inputVal, setInputVal] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | 'revealed' | 'passed' | null;
    messageArm: string;
    messageEsp: string;
  }>({ type: null, messageArm: '', messageEsp: '' });

  // Translation visibility (toggled upon clicking on Spanish text)
  const [showArmenianTranslation, setShowArmenianTranslation] = useState<boolean>(false);
  const [alwaysShowTranslation, setAlwaysShowTranslation] = useState<boolean>(false);

  // View mode: 'rosco' or 'list'
  const [viewMode, setViewMode] = useState<'rosco' | 'list'>('rosco');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [selectedListFilter, setSelectedListFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');

  // 30-Minute Timer State: starts ONLY on click "Начать"
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentQ: QuestionItem = QUESTIONS_DATA[currentIndex] || QUESTIONS_DATA[0];
  const currentState = states[currentQ.id] || { status: 'unanswered', attempts: 0, revealed: false };

  // Calculate statistics
  const totalQuestions = QUESTIONS_DATA.length;
  const correctCount = Object.values(states).filter((s) => s.status === 'correct').length;
  const wrongCount = Object.values(states).filter((s) => s.status === 'wrong').length;
  const passedCount = Object.values(states).filter((s) => s.status === 'passed').length;
  const revealedCount = Object.values(states).filter((s) => s.revealed).length;
  const answeredTotal = Object.values(states).filter(
    (s) => s.status === 'correct' || s.status === 'wrong' || s.revealed
  ).length;

  // 30-Minute Timer Countdown Effect
  useEffect(() => {
    if (!isTimerRunning || isGameOver || isTimeUp) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          soundManager.playTimeUp();
          return 0;
        }
        if (prev <= 10 && prev > 1) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isGameOver, isTimeUp]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // When changing questions, reset feedback and input
  useEffect(() => {
    setInputVal('');
    setFeedback({ type: null, messageArm: '', messageEsp: '' });
    setShowArmenianTranslation(alwaysShowTranslation);
    if (viewMode === 'rosco' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, alwaysShowTranslation, viewMode]);

  // Check if all questions are finished
  useEffect(() => {
    const allDone = QUESTIONS_DATA.every((q) => {
      const st = states[q.id]?.status;
      return st === 'correct' || states[q.id]?.revealed;
    });
    if (allDone && answeredTotal === totalQuestions && !isGameOver) {
      soundManager.playVictory();
      setIsGameOver(true);
      setIsTimerRunning(false);
    }
  }, [states, answeredTotal, totalQuestions, isGameOver]);

  const handleStartGame = () => {
    soundManager.playClick();
    setHasStarted(true);
    setIsTimerRunning(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
  };

  const toggleTimer = () => {
    soundManager.playClick();
    if (!hasStarted) {
      setHasStarted(true);
      setIsTimerRunning(true);
      return;
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleSpeak = (text: string, lang: 'es-ES' | 'hy-AM' = 'es-ES') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Check user answer
  const handleCheckAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    if (!hasStarted) {
      setHasStarted(true);
      setIsTimerRunning(true);
    }

    const isMatch = checkAnswerMatch(inputVal, currentQ);

    if (isMatch) {
      soundManager.playCorrect();
      setStates((prev) => ({
        ...prev,
        [currentQ.id]: {
          ...prev[currentQ.id],
          status: 'correct',
          userAnswer: inputVal.trim(),
          attempts: (prev[currentQ.id]?.attempts || 0) + 1,
        },
      }));
      setFeedback({
        type: 'correct',
        messageArm: `¡Ճիշտ է! Պատասխան՝ ${currentQ.spanishAnswer} (${currentQ.armenianAnswer})`,
        messageEsp: `¡Correcto! ${currentQ.spanishAnswer}`,
      });
      // Automatically advance after brief celebration delay
      setTimeout(() => {
        moveToNextUnanswered();
      }, 1400);
    } else {
      // User says: "и если ответ неверный всё равно продолжить играть"
      soundManager.playWrong();
      setStates((prev) => ({
        ...prev,
        [currentQ.id]: {
          ...prev[currentQ.id],
          status: 'wrong',
          attempts: (prev[currentQ.id]?.attempts || 0) + 1,
        },
      }));
      setFeedback({
        type: 'wrong',
        messageArm: `Ոչ այնքան ճիշտ է։ Կարող ես փորձել կրկին, տեսնել պատասխանը կամ շարունակել խաղալ:`,
        messageEsp: `¡Incorrecto! Puedes volver a intentarlo, ver la respuesta o continuar jugando.`,
      });
    }
  };

  // Reveal Answer button ("отдельно кнопка посмотреть ответ")
  const handleRevealAnswer = () => {
    soundManager.playReveal();
    setStates((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        revealed: true,
        status: prev[currentQ.id]?.status === 'correct' ? 'correct' : 'revealed',
      },
    }));
    setShowArmenianTranslation(true);
    setFeedback({
      type: 'revealed',
      messageArm: `Ճիշտ պատասխանն է՝ «${currentQ.spanishAnswer}» (${currentQ.armenianAnswer})`,
      messageEsp: `Respuesta correcta: ${currentQ.spanishAnswer}`,
    });
    handleSpeak(currentQ.spanishAnswer, 'es-ES');
  };

  // Pasapalabra (skip to next and return later)
  const handlePasapalabra = () => {
    soundManager.playPasapalabra();
    setStates((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        status: prev[currentQ.id]?.status === 'unanswered' ? 'passed' : prev[currentQ.id].status,
      },
    }));
    setFeedback({
      type: 'passed',
      messageArm: 'Պասապալաբրա: Տառը հետաձգվեց, կարող ես վերադառնալ դրան ավելի ուշ:',
      messageEsp: '¡Pasapalabra! Pasamos a la siguiente letra.',
    });
    moveToNextUnanswered();
  };

  // Move to next unanswered or next circle index
  const moveToNextUnanswered = () => {
    let nextIdx = (currentIndex + 1) % totalQuestions;
    let found = false;
    for (let i = 0; i < totalQuestions; i++) {
      const idx = (currentIndex + 1 + i) % totalQuestions;
      const qId = QUESTIONS_DATA[idx].id;
      const st = states[qId]?.status;
      if (st !== 'correct' && !states[qId]?.revealed) {
        nextIdx = idx;
        found = true;
        break;
      }
    }
    setCurrentIndex(found ? nextIdx : (currentIndex + 1) % totalQuestions);
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    setCurrentIndex((prev) => (prev + 1) % totalQuestions);
  };

  const handlePrevQuestion = () => {
    soundManager.playClick();
    setCurrentIndex((prev) => (prev - 1 + totalQuestions) % totalQuestions);
  };

  const insertChar = (char: string) => {
    setInputVal((prev) => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Reset entire game
  const handleResetGame = () => {
    soundManager.playClick();
    const initial: Record<number, QuestionState> = {};
    QUESTIONS_DATA.forEach((q) => {
      initial[q.id] = {
        status: 'unanswered',
        attempts: 0,
        revealed: false,
      };
    });
    setStates(initial);
    setCurrentIndex(0);
    setInputVal('');
    setFeedback({ type: null, messageArm: '', messageEsp: '' });
    setTimeLeft(TOTAL_TIME_SECONDS);
    setHasStarted(false);
    setIsTimerRunning(false);
    setIsGameOver(false);
    setIsTimeUp(false);
  };

  // Mathematical Rosco Geometry: 100% round, perfectly symmetrical
  const SVG_SIZE = 500;
  const CENTER = SVG_SIZE / 2; // 250
  const ROSCO_RADIUS = 196; // Circle center radius
  const NODE_RADIUS = 18; // Radius of each letter circle

  // Letter color helper
  const getNodeFill = (status: QuestionStatus, isCurrent: boolean, revealed: boolean) => {
    if (isCurrent) return '#f59e0b'; // Radiant amber/yellow for active
    if (status === 'correct') return '#16a34a'; // TV show emerald green
    if (revealed || status === 'revealed') return '#9333ea'; // Purple for revealed
    if (status === 'wrong') return '#dc2626'; // Television red for mistakes
    if (status === 'passed') return '#ea580c'; // Pasapalabra amber
    return '#1d4ed8'; // Default Pasapalabra deep blue
  };

  const getNodeStroke = (status: QuestionStatus, isCurrent: boolean) => {
    if (isCurrent) return '#fef08a';
    if (status === 'correct') return '#86efac';
    if (status === 'wrong') return '#fca5a5';
    if (status === 'passed') return '#fde047';
    return '#60a5fa';
  };

  const getNodeTextColor = (isCurrent: boolean) => {
    if (isCurrent) return '#0f172a'; // Dark crisp font on bright amber
    return '#ffffff'; // White font for all other states
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Studio Lighting Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Bar Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/25">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  PASAPALABRA <span className="text-amber-400 font-bold">·</span> Գուշակիր բառը
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                El Rosco (A–Z) · 27 տառ իսպաներեն և հայերեն · Ժամանակ՝ 30 րոպե
              </p>
            </div>
          </div>

          {/* 30-Minute Timer in Top Bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!hasStarted ? (
              <button
                onClick={handleStartGame}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-95 animate-pulse"
                title="Սեղմիր՝ խաղը և 30 րոպեանոց ժամանակաչափը սկսելու համար"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Սկսել (Начать · 30:00)</span>
              </button>
            ) : (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  timeLeft <= 60
                    ? 'bg-red-950/80 border-red-500/80 text-red-200 animate-pulse'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-base sm:text-lg font-black tracking-wider text-amber-400">
                  {formatTime(timeLeft)}
                </span>
                <button
                  onClick={toggleTimer}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title={isTimerRunning ? 'Դադար (Пауза)' : 'Շարունակել (Старт)'}
                  aria-label="Toggle Timer"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Quick Controls */}
            <button
              onClick={() => setViewMode(viewMode === 'rosco' ? 'list' : 'rosco')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Փոխել տեսքը"
            >
              {viewMode === 'rosco' ? (
                <>
                  <List className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Բոլոր տառերը (A–Z)</span>
                  <span className="sm:hidden">Ցանկ</span>
                </>
              ) : (
                <>
                  <CircleDot className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">El Rosco (Շրջան)</span>
                  <span className="sm:hidden">Rosco</span>
                </>
              )}
            </button>

            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg text-xs font-semibold border transition ${
                soundEnabled
                  ? 'bg-slate-800 text-blue-400 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Ձայնն անջատել' : 'Ձայնը միացնել'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleResetGame}
              className="p-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition"
              title="Վերսկսել խաղը (30 րոպե)"
              aria-label="Restart game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {viewMode === 'rosco' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Perfectly Round El Rosco Wheel (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center p-2">
                {/* SVG Pure Mathematical Circle: 100% round & perfectly even */}
                <svg
                  viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                  className="w-full h-full filter drop-shadow-2xl"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Outer Studio Track */}
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={ROSCO_RADIUS}
                    fill="none"
                    stroke="#1e3a8a"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    opacity="0.45"
                  />
                  {/* Inner Track Glow */}
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={ROSCO_RADIUS - 36}
                    fill="rgba(15, 23, 42, 0.75)"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />

                  {/* 27 Circles around the Rosco: Pure Trigonometry, LETTERS instead of numbers! */}
                  {QUESTIONS_DATA.map((q, idx) => {
                    const angle = (idx / totalQuestions) * 2 * Math.PI - Math.PI / 2;
                    const x = CENTER + ROSCO_RADIUS * Math.cos(angle);
                    const y = CENTER + ROSCO_RADIUS * Math.sin(angle);
                    const isCurrent = idx === currentIndex;
                    const st = states[q.id]?.status || 'unanswered';
                    const isRev = states[q.id]?.revealed || false;

                    const fill = getNodeFill(st, isCurrent, isRev);
                    const stroke = getNodeStroke(st, isCurrent);
                    const textColor = getNodeTextColor(isCurrent);

                    return (
                      <g
                        key={q.id}
                        onClick={() => {
                          soundManager.playClick();
                          setCurrentIndex(idx);
                        }}
                        className="cursor-pointer transition-transform duration-150 select-none"
                        style={{
                          transformOrigin: `${x}px ${y}px`,
                        }}
                      >
                        {/* Active Glowing Aura Ring */}
                        {isCurrent && (
                          <circle
                            cx={x}
                            cy={y}
                            r={NODE_RADIUS + 7}
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="3"
                            opacity="0.8"
                            className="animate-pulse"
                          />
                        )}

                        {/* Node Base Circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r={NODE_RADIUS}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth={isCurrent ? '3' : '1.8'}
                          filter={isCurrent ? 'url(#glow)' : undefined}
                        />

                        {/* Node Letter (A, B, C, D... Z) */}
                        <text
                          x={x}
                          y={y + 1}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={textColor}
                          fontSize="15"
                          fontWeight="900"
                          fontFamily="'Outfit', sans-serif"
                          pointerEvents="none"
                        >
                          {q.letter}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Center of El Rosco: TV Studio Contestant Badge & Live HUD */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {!hasStarted ? (
                    <button
                      onClick={handleStartGame}
                      className="pointer-events-auto group flex flex-col items-center justify-center text-center p-4 rounded-full w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-b from-blue-900/95 via-slate-900/95 to-indigo-950/95 border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                      title="Սեղմիր՝ խաղը և 30 րոպեանոց ժամանակաչափը սկսելու համար"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition shadow-amber-500/40">
                        <Play className="w-7 h-7 fill-slate-950 ml-1" />
                      </div>
                      <span className="text-base sm:text-lg font-black text-white tracking-wide">
                        ՍԿՍԵԼ ԽԱՂԸ
                      </span>
                      <span className="text-xs font-bold text-amber-300">
                        Начать игру
                      </span>
                      <span className="text-[11px] text-slate-300 mt-1 font-mono flex items-center gap-1 bg-slate-950/70 px-2.5 py-0.5 rounded-full border border-slate-700/60">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>30:00 րոպե</span>
                      </span>
                    </button>
                  ) : (
                    <div className="pointer-events-auto flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-full w-48 h-48 sm:w-56 sm:h-56 bg-slate-900/95 border-2 border-slate-700 shadow-2xl backdrop-blur-md">
                      {/* Big Active Letter Indicator */}
                      <div className="flex items-center gap-1.5 text-xs text-blue-300 font-semibold uppercase tracking-wider">
                        <span>Տառ</span>
                      </div>

                      <div className="my-0.5 text-4xl sm:text-5xl font-black text-amber-400 tracking-tight drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">
                        {currentQ.letter}
                      </div>

                      <span className="text-[11px] font-bold text-slate-300 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                        {currentQ.letterRule === 'starts'
                          ? `Empieza por ${currentQ.letter}`
                          : `Contiene la ${currentQ.letter}`}
                      </span>

                      {/* TV Score Display (Like Rosa photo: green aciertos, orange pasapalabra/errors) */}
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className="flex items-center gap-1 bg-emerald-950/90 border border-emerald-500/50 px-2 py-0.5 rounded-full text-emerald-300 text-xs font-black"
                          title="Ճիշտ (Aciertos)"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{correctCount}</span>
                        </div>

                        <div
                          className="flex items-center gap-1 bg-amber-950/90 border border-amber-500/50 px-2 py-0.5 rounded-full text-amber-300 text-xs font-black"
                          title="Հետաձգված (Pasapalabra)"
                        >
                          <span>🟠</span>
                          <span>{passedCount}</span>
                        </div>

                        {wrongCount > 0 && (
                          <div
                            className="flex items-center gap-1 bg-red-950/90 border border-red-500/50 px-2 py-0.5 rounded-full text-red-300 text-xs font-black"
                            title="Սխալներ (Fallos)"
                          >
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            <span>{wrongCount}</span>
                          </div>
                        )}
                      </div>

                      {/* 30-Minute Timer Badge in Rosco Center */}
                      <div className="mt-2 text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{formatTime(timeLeft)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rosco Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                  <span>Ճիշտ ({correctCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span>Ընթացիկ ({currentQ.letter})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
                  <span>Pasapalabra ({passedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-purple-600 inline-block" />
                  <span>Տեսած ({revealedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                  <span>Սպասող ({totalQuestions - answeredTotal})</span>
                </div>
              </div>
            </div>

            {/* Right Column: Question Card & Game Actions (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Question Header & Navigation */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-sm font-black tracking-wide flex items-center gap-1.5">
                      <span>LETRA</span>
                      <span className="text-amber-400 text-base">{currentQ.letter}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      {currentQ.letterRule === 'starts' ? 'Սկսվում է տառով' : 'Պարունակում է տառը'} (
                      {currentQ.id} / 27)
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevQuestion}
                      className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                      title="Նախորդ տառը"
                    >
                      ←
                    </button>
                    <span className="text-xs text-slate-400 px-1 font-mono font-bold">
                      {currentQ.letter}
                    </span>
                    <button
                      onClick={handleNextQuestion}
                      className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                      title="Հաջորդ տառը"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* THE SPANISH QUESTION (Clickable to open Armenian translation as requested!) */}
                <div
                  onClick={() => setShowArmenianTranslation(!showArmenianTranslation)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setShowArmenianTranslation(!showArmenianTranslation);
                    }
                  }}
                  className="group relative cursor-pointer p-4 rounded-xl bg-gradient-to-br from-blue-950/70 to-slate-900/90 border border-blue-500/30 hover:border-blue-400/60 transition-all shadow-inner"
                  title="Սեղմիր՝ հայերեն թարգմանությունը բացելու համար (Haz clic para ver la traducción)"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇪🇸</span>
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                        Իսպաներեն հարց (Letra {currentQ.letter})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(currentQ.spanishQuestion, 'es-ES');
                        }}
                        className="p-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 text-xs flex items-center gap-1 transition"
                        title="Լսել իսպաներեն արտասանությունը"
                      >
                        <Volume1 className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">Լսել</span>
                      </button>

                      <span className="text-[11px] text-amber-300/90 group-hover:text-amber-300 flex items-center gap-1 bg-amber-950/50 px-2.5 py-0.5 rounded border border-amber-500/30">
                        <Languages className="w-3 h-3" />
                        <span>{showArmenianTranslation ? 'Փակել թարգմանությունը' : 'Սեղմիր՝ հայերենի համար 👆'}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                    {currentQ.spanishQuestion}
                  </p>
                </div>

                {/* THE ARMENIAN TRANSLATION (Toggled on click of Spanish or button) */}
                {showArmenianTranslation && (
                  <div className="mt-3 p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🇦🇲</span>
                        <span className="text-xs font-bold text-indigo-300 tracking-wide">
                          Հայերեն թարգմանություն (Թարգմանություն)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeak(currentQ.armenianQuestion, 'hy-AM')}
                        className="p-1 rounded text-indigo-300 hover:text-white text-xs flex items-center gap-1"
                        title="Լսել հայերեն"
                      >
                        <Volume1 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm sm:text-base text-indigo-100 font-normal leading-relaxed">
                      {currentQ.armenianQuestion}
                    </p>
                  </div>
                )}

                {/* Always-show translation preference toggle */}
                <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={() => setShowArmenianTranslation(!showArmenianTranslation)}
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1.5"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>
                      {showArmenianTranslation ? 'Թաքցնել հայերեն թարգմանությունը' : 'Ցույց տալ հայերեն թարգմանությունը'}
                    </span>
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={alwaysShowTranslation}
                      onChange={(e) => setAlwaysShowTranslation(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11px]">Միշտ բաց պահել թարգմանությունը</span>
                  </label>
                </div>

                {/* Feedback message banner */}
                {feedback.type && (
                  <div
                    className={`mt-4 p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                      feedback.type === 'correct'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                        : feedback.type === 'wrong'
                        ? 'bg-red-950/60 border-red-500/50 text-red-200'
                        : feedback.type === 'revealed'
                        ? 'bg-purple-950/60 border-purple-500/50 text-purple-200'
                        : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                    }`}
                  >
                    {feedback.type === 'correct' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : feedback.type === 'wrong' ? (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm">
                      <p className="font-semibold">{feedback.messageArm}</p>
                      {feedback.messageEsp && (
                        <p className="text-xs opacity-90 mt-0.5">{feedback.messageEsp}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Answer Revealed Box (if looked up or already answered) */}
                {(currentState.revealed || currentState.status === 'correct') && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Պատասխանը (Respuesta):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSpeak(currentQ.spanishAnswer, 'es-ES')}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Լսել</span>
                      </button>
                    </div>
                    <div className="mt-1 flex flex-wrap items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-bold text-amber-400">
                        {currentQ.spanishAnswer}
                      </span>
                      <span className="text-slate-400 text-sm">—</span>
                      <span className="text-base text-slate-200 font-medium">
                        {currentQ.armenianAnswer}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Հուշում՝ {currentQ.armenianHint} ({currentQ.hint})
                    </p>
                  </div>
                )}

                {/* Input Form */}
                {!hasStarted && (
                  <div className="mt-4 p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-300">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>30 րոպե ժամանակը կսկսի հաշվարկվել «Սկսել» կոճակը սեղմելիս</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartGame}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition shadow shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Սկսել (Начать)</span>
                    </button>
                  </div>
                )}

                <form onSubmit={handleCheckAnswer} className="mt-5 space-y-3">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder={`Գրիր պատասխանը (${currentQ.letterRule === 'starts' ? `տառը՝ ${currentQ.letter}...` : `պարունակում է ${currentQ.letter}...`})`}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 text-base font-medium outline-none transition"
                    />
                    {inputVal && (
                      <button
                        type="button"
                        onClick={() => setInputVal('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 px-1.5 py-0.5 rounded"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Spanish Special Characters Keyboard Helper */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Իսպաներեն տառեր՝</span>
                      {['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿'].map((char) => (
                        <button
                          key={char}
                          type="button"
                          onClick={() => insertChar(char)}
                          className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition active:scale-95"
                          title={`Տեղադրել ${char}`}
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2">
                    {/* 1. Comprobar / Ստուգել */}
                    <button
                      type="submit"
                      disabled={!inputVal.trim()}
                      className={`sm:col-span-2 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                        inputVal.trim()
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-[0.98]'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ստուգել (Comprobar)</span>
                    </button>

                    {/* 2. Pasapalabra (skip to next letter) */}
                    <button
                      type="button"
                      onClick={handlePasapalabra}
                      className="py-3 px-3 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 transition active:scale-[0.98] shadow-lg shadow-amber-500/20"
                      title="Բաց թողնել և վերադառնալ ավելի ուշ"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Pasapalabra</span>
                    </button>

                    {/* 3. Separate "Посмотреть ответ" button requested by user! */}
                    <button
                      type="button"
                      onClick={handleRevealAnswer}
                      className="py-3 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 hover:border-purple-500/60 flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                      title="Տեսնել ճիշտ պատասխանը"
                    >
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span>Տեսնել պատասխանը</span>
                    </button>
                  </div>

                  {/* If incorrect, explicitly reassure the user they can keep playing ("продолжить играть") */}
                  {feedback.type === 'wrong' && (
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs flex items-center justify-between gap-3">
                      <span className="text-slate-300">
                        Խաղը չի կանգնում: Կարող ես կրկին գրել, տեսնել պատասխանը կամ անցնել հաջորդ տառին:
                      </span>
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs whitespace-nowrap transition"
                      >
                        Հաջորդ տառը →
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-slate-400">Կատարված՝ </span>
                    <strong className="text-white font-mono text-sm">
                      {answeredTotal} / {totalQuestions}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Ճիշտ՝ </span>
                    <strong className="text-emerald-400 font-mono text-sm">
                      {correctCount}
                    </strong>
                  </div>
                  {wrongCount > 0 && (
                    <div>
                      <span className="text-slate-400">Սխալ՝ </span>
                      <strong className="text-red-400 font-mono text-sm">
                        {wrongCount}
                      </strong>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">Մնացած ժամանակ՝ </span>
                    <strong className="text-amber-400 font-mono text-sm">
                      {formatTime(timeLeft)}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      moveToNextUnanswered();
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <span>Անցնել չպատասխանած տառին</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* List Mode: View all 27 questions & answers with filter */
          <div className="space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <List className="w-5 h-5 text-blue-400" />
                  <span>Բոլոր 27 տառերը A–Z (Las 27 letras y preguntas)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Սեղմիր ցանկացած տառի վրա՝ այն Rosco-ում խաղալու համար
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                {(['all', 'correct', 'wrong', 'unanswered'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedListFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      selectedListFilter === filter
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter === 'all' && 'Բոլորը (27)'}
                    {filter === 'correct' && `Ճիշտ (${correctCount})`}
                    {filter === 'wrong' && `Սխալ (${wrongCount})`}
                    {filter === 'unanswered' && `Մնացած (${totalQuestions - answeredTotal})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {QUESTIONS_DATA.filter((q) => {
                const st = states[q.id]?.status || 'unanswered';
                if (selectedListFilter === 'correct') return st === 'correct';
                if (selectedListFilter === 'wrong') return st === 'wrong';
                if (selectedListFilter === 'unanswered')
                  return st !== 'correct' && !states[q.id]?.revealed;
                return true;
              }).map((q) => {
                const st = states[q.id]?.status || 'unanswered';
                const isRev = states[q.id]?.revealed;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      st === 'correct'
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : isRev
                        ? 'bg-purple-950/20 border-purple-500/30'
                        : st === 'wrong'
                        ? 'bg-red-950/20 border-red-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-sm font-black flex items-center justify-center">
                          {q.letter}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                            {q.letterRule === 'starts' ? 'Սկսվում է' : 'Պարունակում է'}
                          </span>
                          {st === 'correct' && (
                            <span className="text-[11px] text-emerald-400 font-semibold">Ճիշտ ✓</span>
                          )}
                          {st === 'wrong' && (
                            <span className="text-[11px] text-red-400 font-semibold">Սխալ ✕</span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-blue-200 font-medium mb-1.5">
                        {q.spanishQuestion}
                      </p>

                      <p className="text-xs text-indigo-300/90 italic mb-3">
                        {q.armenianQuestion}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-amber-300">
                          {q.spanishAnswer}
                        </span>
                        <span className="text-xs text-slate-400 ml-1.5">
                          ({q.armenianAnswer})
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentIndex(q.id - 1);
                          setViewMode('rosco');
                        }}
                        className="p-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs transition"
                        title="Խաղալ այս տառը"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Victory Modal */}
        {isGameOver && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                <Trophy className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-white">
                ¡EL BOTE DE PASAPALABRA!
              </h3>
              <p className="text-base text-amber-300 font-semibold mt-1">
                Շնորհավորում ենք, Rosco-ն ավարտվեց:
              </p>

              <div className="grid grid-cols-3 gap-2.5 my-5">
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl">
                  <div className="text-2xl font-black text-emerald-400">{correctCount}</div>
                  <div className="text-[11px] text-emerald-300 font-medium">Ճիշտ</div>
                </div>
                <div className="p-3 bg-purple-950/50 border border-purple-500/30 rounded-xl">
                  <div className="text-2xl font-black text-purple-400">{revealedCount}</div>
                  <div className="text-[11px] text-purple-300 font-medium">Տեսած</div>
                </div>
                <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-xl">
                  <div className="text-2xl font-black text-red-400">{wrongCount}</div>
                  <div className="text-[11px] text-red-300 font-medium">Սխալ</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-6">
                Մնացած ժամանակ՝ <strong className="text-amber-400">{formatTime(timeLeft)}</strong> (30 րոպեից):
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleResetGame}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white transition shadow-lg shadow-blue-600/30"
                >
                  Խաղալ նորից (30 րոպե)
                </button>
                <button
                  onClick={() => setIsGameOver(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Դիտել արդյունքները
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Time Up Modal */}
        {isTimeUp && !isGameOver && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-red-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
                <Clock className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-white">
                ¡TIEMPO TERMINADO!
              </h3>
              <p className="text-base text-amber-300 font-semibold mt-1">
                30 րոպեն ավարտվեց:
              </p>

              <div className="my-5 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-sm">
                <div className="flex justify-between items-center py-1 text-slate-300">
                  <span>Ճիշտ պատասխաններ՝</span>
                  <strong className="text-emerald-400 font-mono text-base">{correctCount} / 27</strong>
                </div>
                <div className="flex justify-between items-center py-1 text-slate-300">
                  <span>Սխալ պատասխաններ՝</span>
                  <strong className="text-red-400 font-mono text-base">{wrongCount}</strong>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleResetGame}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white transition shadow-lg shadow-blue-600/30"
                >
                  Վերսկսել 30 րոպեով (Reiniciar)
                </button>
                <button
                  onClick={() => {
                    setTimeLeft(10 * 60); // Add 10 extra minutes
                    setIsTimeUp(false);
                    setIsTimerRunning(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Ավելացնել +10 րոպե և շարունակել
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          Pasapalabra 🇪🇸 🇦🇲 · El Rosco A–Z · 30 րոպե ժամանակաչափ · Իսպաներեն լեզվի ուսուցում
        </p>
      </footer>
    </div>
  );
}
