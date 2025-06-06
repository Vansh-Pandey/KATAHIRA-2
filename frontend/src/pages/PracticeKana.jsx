import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PracticeKana = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hiragana');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSettings, setQuizSettings] = useState({
    mode: 'flashcards',
    questionCount: 10,
    timePerQuestion: 0,
    difficulty: 'basic',
    studyMode: 'all',
    shuffle: true,
    questionTypes: ['meaning']
  });

  // Quiz state
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questionTimerRef = useRef(null);

  const hiraganaData = [
    { char: 'あ', romaji: 'a', type: 'vowel' },
    { char: 'い', romaji: 'i', type: 'vowel' },
    { char: 'う', romaji: 'u', type: 'vowel' },
    { char: 'え', romaji: 'e', type: 'vowel' },
    { char: 'お', romaji: 'o', type: 'vowel' },
    { char: 'か', romaji: 'ka', type: 'k' },
    { char: 'き', romaji: 'ki', type: 'k' },
    { char: 'く', romaji: 'ku', type: 'k' },
    { char: 'け', romaji: 'ke', type: 'k' },
    { char: 'こ', romaji: 'ko', type: 'k' },
    { char: 'さ', romaji: 'sa', type: 's' },
    { char: 'し', romaji: 'shi', type: 's' },
    { char: 'す', romaji: 'su', type: 's' },
    { char: 'せ', romaji: 'se', type: 's' },
    { char: 'そ', romaji: 'so', type: 's' },
    { char: 'た', romaji: 'ta', type: 't' },
    { char: 'ち', romaji: 'chi', type: 't' },
    { char: 'つ', romaji: 'tsu', type: 't' },
    { char: 'て', romaji: 'te', type: 't' },
    { char: 'と', romaji: 'to', type: 't' },
    { char: 'な', romaji: 'na', type: 'n' },
    { char: 'に', romaji: 'ni', type: 'n' },
    { char: 'ぬ', romaji: 'nu', type: 'n' },
    { char: 'ね', romaji: 'ne', type: 'n' },
    { char: 'の', romaji: 'no', type: 'n' },
    { char: 'は', romaji: 'ha', type: 'h' },
    { char: 'ひ', romaji: 'hi', type: 'h' },
    { char: 'ふ', romaji: 'fu', type: 'h' },
    { char: 'へ', romaji: 'he', type: 'h' },
    { char: 'ほ', romaji: 'ho', type: 'h' },
    { char: 'ま', romaji: 'ma', type: 'm' },
    { char: 'み', romaji: 'mi', type: 'm' },
    { char: 'む', romaji: 'mu', type: 'm' },
    { char: 'め', romaji: 'me', type: 'm' },
    { char: 'も', romaji: 'mo', type: 'm' },
    { char: 'や', romaji: 'ya', type: 'y' },
    { char: 'ゆ', romaji: 'yu', type: 'y' },
    { char: 'よ', romaji: 'yo', type: 'y' },
    { char: 'ら', romaji: 'ra', type: 'r' },
    { char: 'り', romaji: 'ri', type: 'r' },
    { char: 'る', romaji: 'ru', type: 'r' },
    { char: 'れ', romaji: 're', type: 'r' },
    { char: 'ろ', romaji: 'ro', type: 'r' },
    { char: 'わ', romaji: 'wa', type: 'w' },
    { char: 'を', romaji: 'wo', type: 'w' },
    { char: 'ん', romaji: 'n', type: 'special' },
  ];

  const katakanaData = [
    { char: 'ア', romaji: 'a', type: 'vowel' },
    { char: 'イ', romaji: 'i', type: 'vowel' },
    { char: 'ウ', romaji: 'u', type: 'vowel' },
    { char: 'エ', romaji: 'e', type: 'vowel' },
    { char: 'オ', romaji: 'o', type: 'vowel' },
    { char: 'カ', romaji: 'ka', type: 'k' },
    { char: 'キ', romaji: 'ki', type: 'k' },
    { char: 'ク', romaji: 'ku', type: 'k' },
    { char: 'ケ', romaji: 'ke', type: 'k' },
    { char: 'コ', romaji: 'ko', type: 'k' },
    { char: 'サ', romaji: 'sa', type: 's' },
    { char: 'シ', romaji: 'shi', type: 's' },
    { char: 'ス', romaji: 'su', type: 's' },
    { char: 'セ', romaji: 'se', type: 's' },
    { char: 'ソ', romaji: 'so', type: 's' },
    { char: 'タ', romaji: 'ta', type: 't' },
    { char: 'チ', romaji: 'chi', type: 't' },
    { char: 'ツ', romaji: 'tsu', type: 't' },
    { char: 'テ', romaji: 'te', type: 't' },
    { char: 'ト', romaji: 'to', type: 't' },
    { char: 'ナ', romaji: 'na', type: 'n' },
    { char: 'ニ', romaji: 'ni', type: 'n' },
    { char: 'ヌ', romaji: 'nu', type: 'n' },
    { char: 'ネ', romaji: 'ne', type: 'n' },
    { char: 'ノ', romaji: 'no', type: 'n' },
    { char: 'ハ', romaji: 'ha', type: 'h' },
    { char: 'ヒ', romaji: 'hi', type: 'h' },
    { char: 'フ', romaji: 'fu', type: 'h' },
    { char: 'ヘ', romaji: 'he', type: 'h' },
    { char: 'ホ', romaji: 'ho', type: 'h' },
    { char: 'マ', romaji: 'ma', type: 'm' },
    { char: 'ミ', romaji: 'mi', type: 'm' },
    { char: 'ム', romaji: 'mu', type: 'm' },
    { char: 'メ', romaji: 'me', type: 'm' },
    { char: 'モ', romaji: 'mo', type: 'm' },
    { char: 'ヤ', romaji: 'ya', type: 'y' },
    { char: 'ユ', romaji: 'yu', type: 'y' },
    { char: 'ヨ', romaji: 'yo', type: 'y' },
    { char: 'ラ', romaji: 'ra', type: 'r' },
    { char: 'リ', romaji: 'ri', type: 'r' },
    { char: 'ル', romaji: 'ru', type: 'r' },
    { char: 'レ', romaji: 're', type: 'r' },
    { char: 'ロ', romaji: 'ro', type: 'r' },
    { char: 'ワ', romaji: 'wa', type: 'w' },
    { char: 'ヲ', romaji: 'wo', type: 'w' },
    { char: 'ン', romaji: 'n', type: 'special' },
  ];

  const typeColors = {
    vowel: 'bg-amber-100 text-amber-800',
    k: 'bg-blue-100 text-blue-800',
    s: 'bg-green-100 text-green-800',
    t: 'bg-purple-100 text-purple-800',
    n: 'bg-red-100 text-red-800',
    h: 'bg-indigo-100 text-indigo-800',
    m: 'bg-pink-100 text-pink-800',
    y: 'bg-teal-100 text-teal-800',
    r: 'bg-orange-100 text-orange-800',
    w: 'bg-cyan-100 text-cyan-800',
    special: 'bg-gray-100 text-gray-800',
  };

  // Get current data safely
  const currentData = useMemo(() => (
    activeTab === 'hiragana' ? hiraganaData : katakanaData
  ), [activeTab]);

  // Filter and shuffle data based on settings
  const currentShuffledData = useMemo(() => {
    let filtered = currentData;
    if (quizSettings.studyMode !== 'all') {
      filtered = filtered.filter(item => item.type === quizSettings.studyMode);
    }
    if (quizSettings.difficulty === 'easy') {
      filtered = filtered.filter(item => !['chi', 'shi', 'tsu', 'fu'].includes(item.romaji));
    } else if (quizSettings.difficulty === 'hard') {
      filtered = filtered.filter(item => ['chi', 'shi', 'tsu', 'fu'].includes(item.romaji));
    }
    if (quizSettings.shuffle) {
      return [...filtered].sort(() => Math.random() - 0.5);
    }
    return filtered;
  }, [currentData, quizSettings.studyMode, quizSettings.difficulty, quizSettings.shuffle]);

  // Slice data based on question count
  const quizData = useMemo(() => {
    return currentShuffledData.slice(0, quizSettings.questionCount);
  }, [currentShuffledData, quizSettings.questionCount]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Question timer logic
  useEffect(() => {
    if (quizStarted && quizSettings.timePerQuestion > 0) {
      setTimeLeft(quizSettings.timePerQuestion);
      questionTimerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(questionTimerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [currentCard, quizStarted, quizSettings.timePerQuestion]);

  const handleTimeUp = () => {
    if (quizSettings.mode === 'typing' || quizSettings.mode === 'multipleChoice') {
      setIsCorrect(false);
      setQuestionsAnswered(prev => prev + 1);
      setStreak(0);
      setTimeout(() => nextCard(), 1500);
    }
  };

  // Reset quiz when settings change
  const resetQuiz = useCallback(() => {
    setCurrentCard(0);
    setShowAnswer(false);
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    setTimer(0);
    setIsTimerRunning(false);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setUserInput('');
    setSelectedOptions([]);
    setQuizCompleted(false);
  }, []);

  // Generate multiple choice options
  const generateOptions = useCallback(() => {
    if (quizData.length === 0 || currentCard >= quizData.length) return [];
    const correctAnswer = quizData[currentCard]?.romaji;
    if (!correctAnswer) return [];
    let options = [correctAnswer];
    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * quizData.length);
      const randomRomaji = quizData[randomIndex].romaji;
      if (!options.includes(randomRomaji)) {
        options.push(randomRomaji);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  }, [currentCard, quizData]);

  const [options, setOptions] = useState([]);

  // Update options when card changes
  useEffect(() => {
    if (quizStarted) {
      setOptions(generateOptions());
      setIsCorrect(null);
      setIsAnswerChecked(false);
      setSelectedOptions([]);
      setUserInput('');
    }
  }, [currentCard, generateOptions, quizStarted]);

  // Navigation functions
  const nextCard = useCallback(() => {
    if (quizData.length === 0) return;
    if (questionsAnswered >= quizSettings.questionCount) {
      setIsTimerRunning(false);
      setQuizCompleted(true);
      return;
    }
    setShowAnswer(false);
    setIsCorrect(null);
    setIsAnswerChecked(false);
    setUserInput('');
    setSelectedOptions([]);
    setCurrentCard(prev => {
      if (prev < quizData.length - 1) {
        return prev + 1;
      }
      return 0;
    });
  }, [quizData.length, questionsAnswered, quizSettings.questionCount]);

  const prevCard = useCallback(() => {
    if (quizData.length === 0) return;
    setShowAnswer(false);
    setIsCorrect(null);
    setIsAnswerChecked(false);
    setUserInput('');
    setSelectedOptions([]);
    setCurrentCard(prev => {
      if (prev > 0) {
        return prev - 1;
      }
      return quizData.length - 1;
    });
  }, [quizData.length]);

  // Answer checking functions
  const checkTypingAnswer = useCallback(() => {
    if (!userInput || !quizData[currentCard] || isAnswerChecked) return;
    const correct = userInput.toLowerCase() === quizData[currentCard].romaji.toLowerCase();
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    setQuestionsAnswered(prev => prev + 1);
    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setStreak(0);
    }
    setTimeout(() => nextCard(), 1500);
  }, [currentCard, quizData, isAnswerChecked, maxStreak, nextCard, userInput]);

  const checkMultipleChoiceAnswer = useCallback((selectedOption) => {
    if (!quizData[currentCard] || selectedOptions.includes(selectedOption)) return;
    const correct = selectedOption === quizData[currentCard].romaji;
    setIsCorrect(correct);
    setSelectedOptions([...selectedOptions, selectedOption]);
    setIsAnswerChecked(true);
    setQuestionsAnswered(prev => prev + 1);
    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setStreak(0);
    }
    setTimeout(() => nextCard(), 1500);
  }, [currentCard, quizData, maxStreak, nextCard, selectedOptions]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkTypingAnswer();
    }
  };

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setIsTimerRunning(true);
    resetQuiz();
  };

  // Restart with new settings
  const restartQuiz = () => {
    setQuizStarted(false);
    resetQuiz();
  };

  const accuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;
  const studyModeOptions = [
    { value: 'all', label: 'All Characters' },
    { value: 'vowel', label: 'Vowels' },
    { value: 'k', label: 'K Series' },
    { value: 's', label: 'S Series' },
    { value: 't', label: 'T Series' },
    { value: 'n', label: 'N Series' },
    { value: 'h', label: 'H Series' },
    { value: 'm', label: 'M Series' },
    { value: 'y', label: 'Y Series' },
    { value: 'r', label: 'R Series' },
    { value: 'w', label: 'W Series' },
    { value: 'special', label: 'Special' }
  ];

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-stone-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                Kana Quiz Setup
              </h1>
              <p className="text-stone-600">
                Configure your {activeTab === 'hiragana' ? 'Hiragana' : 'Katakana'} practice session
              </p>
            </div>

            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => setActiveTab('hiragana')}
                className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'hiragana' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'}`}
              >
                Hiragana
              </button>
              <button
                onClick={() => setActiveTab('katakana')}
                className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'katakana' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'}`}
              >
                Katakana
              </button>
            </div>
          </div>

          {/* Quiz Configuration */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Quiz Mode</label>
                <select
                  value={quizSettings.mode}
                  onChange={(e) => setQuizSettings({...quizSettings, mode: e.target.value})}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                >
                  <option value="flashcards">Flashcards</option>
                  <option value="multipleChoice">Multiple Choice</option>
                  <option value="typing">Typing Quiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Number of Questions</label>
                <select
                  value={quizSettings.questionCount}
                  onChange={(e) => setQuizSettings({...quizSettings, questionCount: parseInt(e.target.value)})}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="20">20 Questions</option>
                  <option value="30">30 Questions</option>
                  <option value="50">50 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Time per Question (seconds)</label>
                <select
                  value={quizSettings.timePerQuestion}
                  onChange={(e) => setQuizSettings({...quizSettings, timePerQuestion: parseInt(e.target.value)})}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                >
                  <option value="0">No timer</option>
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="15">15 seconds</option>
                  <option value="20">20 seconds</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Difficulty</label>
                <select
                  value={quizSettings.difficulty}
                  onChange={(e) => setQuizSettings({...quizSettings, difficulty: e.target.value})}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Study Mode</label>
                <select
                  value={quizSettings.studyMode}
                  onChange={(e) => setQuizSettings({...quizSettings, studyMode: e.target.value})}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                >
                  {studyModeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={quizSettings.shuffle}
                    onChange={() => setQuizSettings({...quizSettings, shuffle: !quizSettings.shuffle})}
                    className="h-5 w-5 text-amber-600 rounded"
                  />
                  <span className="text-sm text-stone-700">Shuffle Characters</span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={startQuiz}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium text-lg"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress or completed
  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
              Kana Practice
            </h1>
            <p className="text-stone-600">
              Master {activeTab === 'hiragana' ? 'Hiragana' : 'Katakana'} through interactive exercises
            </p>
          </div>

          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setActiveTab('hiragana')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'hiragana' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'}`}
            >
              Hiragana
            </button>
            <button
              onClick={() => setActiveTab('katakana')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'katakana' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'}`}
            >
              Katakana
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-between items-center mb-6 bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-stone-500">Score</div>
              <div className="text-xl font-bold">{score}/{questionsAnswered}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-stone-500">Accuracy</div>
              <div className="text-xl font-bold">{accuracy}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-stone-500">Streak</div>
              <div className="text-xl font-bold">{streak} (Max: {maxStreak})</div>
            </div>
          </div>
          <div className="text-stone-700">
            <span className="font-medium">Time:</span> {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            {quizSettings.timePerQuestion > 0 && (
              <span className="ml-4">
                <span className="font-medium">Question Time:</span> {timeLeft}s
              </span>
            )}
          </div>
        </div>

        {/* Quiz Area */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-stone-200">
          {quizCompleted ? (
            <div className="text-center bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <div className="text-lg mb-6">
                You scored {score} out of {quizSettings.questionCount} ({accuracy}%)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={restartQuiz}
                  className="bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium"
                >
                  Try Again with Same Settings
                </button>
                <button
                  onClick={() => {
                    setQuizStarted(false);
                    resetQuiz();
                  }}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-700 py-2 rounded-lg font-medium"
                >
                  Change Settings
                </button>
              </div>
            </div>
          ) : quizData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-600">No characters match your current filters.</p>
              <button
                onClick={() => setQuizSettings({...quizSettings, studyMode: 'all'})}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
              >
                Show All Characters
              </button>
            </div>
          ) : (
            <>
              {/* Progress Indicator */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-stone-600 mb-1">
                  <span>Progress: {currentCard + 1}/{quizData.length}</span>
                  <span>{typeColors[quizData[currentCard].type].includes('bg-') ?
                    quizData[currentCard].type.toUpperCase() + ' Series' :
                    quizData[currentCard].type.charAt(0).toUpperCase() + quizData[currentCard].type.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full"
                    style={{ width: `${((currentCard + 1) / quizData.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Flashcards Mode */}
              {quizSettings.mode === 'flashcards' && (
                <div className="text-center">
                  <div
                    className={`text-9xl font-bold mb-8 cursor-pointer ${showAnswer ? 'text-stone-800' : 'text-amber-600'}`}
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    {showAnswer ? quizData[currentCard].romaji : quizData[currentCard].char}
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={prevCard}
                      className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2 rounded-lg font-medium"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      {showAnswer ? 'Show Question' : 'Show Answer'}
                    </button>
                    <button
                      onClick={nextCard}
                      className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2 rounded-lg font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Multiple Choice Mode */}
              {quizSettings.mode === 'multipleChoice' && (
                <div className="text-center">
                  <div className="text-9xl font-bold mb-8 text-stone-800">
                    {quizData[currentCard].char}
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => checkMultipleChoiceAnswer(option)}
                        disabled={isAnswerChecked && selectedOptions.includes(option)}
                        className={`p-3 rounded-lg font-medium ${isAnswerChecked
                          ? option === quizData[currentCard].romaji
                            ? 'bg-green-500 text-white'
                            : selectedOptions.includes(option)
                              ? 'bg-red-500 text-white'
                              : 'bg-stone-200 text-stone-700'
                          : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nextCard}
                    className="mt-6 bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2 rounded-lg font-medium"
                  >
                    Skip
                  </button>
                </div>
              )}

              {/* Typing Quiz Mode */}
              {quizSettings.mode === 'typing' && (
                <div className="text-center">
                  <div className="text-9xl font-bold mb-8 text-stone-800">
                    {quizData[currentCard].char}
                  </div>

                  <div className="max-w-md mx-auto">
                    <div className="relative">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type the romaji..."
                        className={`w-full px-4 py-3 rounded-lg border-2 text-lg ${isCorrect === true
                          ? 'border-green-500 bg-green-50'
                          : isCorrect === false
                            ? 'border-red-500 bg-red-50'
                            : 'border-stone-300'
                          }`}
                        autoFocus
                        disabled={isCorrect !== null}
                      />
                    </div>

                    <div className="mt-4">
                      {isCorrect === true && (
                        <div className="text-green-600 font-medium">✓ Correct! Well done!</div>
                      )}
                      {isCorrect === false && (
                        <div className="text-red-600 font-medium">
                          ✗ Incorrect. The answer is: {quizData[currentCard].romaji}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-center space-x-4">
                      <button
                        onClick={checkTypingAnswer}
                        disabled={!userInput || isAnswerChecked}
                        className={`bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium ${isAnswerChecked ? 'opacity-50' : ''
                          }`}
                      >
                        {isAnswerChecked ? 'Answered' : 'Check'}
                      </button>
                      
                      <button
                        onClick={nextCard}
                        className="border border-stone-300 hover:bg-stone-100 text-stone-700 px-6 py-2 rounded-lg font-medium"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Reference */}
        <div className="bg-stone-50 rounded-xl shadow-sm p-6 border border-stone-200">
          <h3 className="text-xl font-bold text-stone-800 mb-4">Quick Reference</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {['vowel', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'special'].map(type => (
              <div
                key={type}
                className={`p-2 rounded-lg text-center ${typeColors[type]}`}
                onClick={() => setQuizSettings({...quizSettings, studyMode: type})}
              >
                <div className="font-bold">
                  {type === 'vowel' ? 'Vowels' :
                    type === 'k' ? 'K Series' :
                      type === 's' ? 'S Series' :
                        type === 't' ? 'T Series' :
                          type === 'n' ? 'N Series' :
                            type === 'h' ? 'H Series' :
                              type === 'm' ? 'M Series' :
                                type === 'y' ? 'Y Series' :
                                  type === 'r' ? 'R Series' :
                                    type === 'w' ? 'W Series' :
                                      'Special'}
                </div>
                <div className="text-xs">
                  {activeTab === 'hiragana'
                    ? hiraganaData.filter(c => c.type === type).slice(0, 3).map(c => c.char).join(' ')
                    : katakanaData.filter(c => c.type === type).slice(0, 3).map(c => c.char).join(' ')}
                  {hiraganaData.filter(c => c.type === type).length > 3 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Tips */}
        <div className="mt-8 bg-amber-50 rounded-xl shadow-sm p-6 border border-amber-100">
          <h3 className="text-xl font-bold text-stone-800 mb-3">Practice Tips</h3>
          <ul className="space-y-2 list-disc list-inside text-stone-700">
            <li>Practice daily for short periods rather than cramming.</li>
            <li>Say the character out loud as you answer.</li>
            <li>Focus on your weak series using the Quick Reference above.</li>
            <li>Try all quiz modes for a well-rounded review.</li>
            <li>Use the "Show All Characters" button if you get stuck.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PracticeKana;