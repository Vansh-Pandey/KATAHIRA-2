import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LearnKana = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hiragana');
    const [selectedKana, setSelectedKana] = useState(null);
    const [practiceMode, setPracticeMode] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [streak, setStreak] = useState(0);
    const [showHint, setShowHint] = useState(false);

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
        k: 'bg-stone-100 text-stone-800',
        s: 'bg-amber-100 text-amber-800',
        t: 'bg-stone-100 text-stone-800',
        n: 'bg-amber-100 text-amber-800',
        h: 'bg-stone-100 text-stone-800',
        m: 'bg-amber-100 text-amber-800',
        y: 'bg-stone-100 text-stone-800',
        r: 'bg-amber-100 text-amber-800',
        w: 'bg-stone-100 text-stone-800',
        special: 'bg-amber-100 text-amber-800',
    };

    const startPractice = () => {
        setPracticeMode(true);
        generateQuestion();
        setStreak(0);
        setFeedback(null);
        setUserAnswer('');
    };

    const generateQuestion = () => {
        const data = activeTab === 'hiragana' ? hiraganaData : katakanaData;
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentQuestion(data[randomIndex]);
        setUserAnswer('');
        setFeedback(null);
        setShowHint(false);
    };

    const checkAnswer = () => {
        if (!userAnswer) return;

        const isCorrect = userAnswer.toLowerCase() === currentQuestion.romaji.toLowerCase();
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            setStreak(streak + 1);
            setTimeout(() => {
                generateQuestion();
            }, 1000);
        } else {
            setTimeout(() => {
                setUserAnswer('');
            }, 1500);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    };

    useEffect(() => {
        if (practiceMode && currentQuestion) {
            const timer = setTimeout(() => {
                if (!feedback) setShowHint(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [practiceMode, currentQuestion, feedback]);

    return (
        
        <div className="min-h-screen bg-stone-50 p-4 md:p-8">
            
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                            Learn {activeTab === 'hiragana' ? 'Hiragana' : 'Katakana'}
                        </h1>
                        <p className="text-stone-600">
                            Master the Japanese {activeTab === 'hiragana' ? 'hiragana' : 'katakana'} characters
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

                {/* Practice Mode */}
                {practiceMode ? (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-stone-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-stone-800">Practice Mode</h2>
                            <div className="flex items-center">
                                <span className="text-amber-600 font-bold mr-2">Streak:</span>
                                <span className="text-xl font-bold text-stone-800">{streak}</span>
                            </div>
                        </div>

                        {currentQuestion && (
                            <div className="text-center">
                                <div className="text-9xl font-bold mb-8 text-stone-800">
                                    {currentQuestion.char}
                                </div>

                                <div className="max-w-md mx-auto">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Type the romaji..."
                                            className={`w-full px-4 py-3 rounded-lg border-2 text-lg ${feedback === 'correct' ? 'border-green-500 bg-green-50' : feedback === 'incorrect' ? 'border-red-500 bg-red-50' : 'border-stone-300'}`}
                                            autoFocus
                                        />
                                        {showHint && !feedback && (
                                            <div className="absolute top-full left-0 w-full mt-2 text-sm text-stone-500">
                                                Starts with: {currentQuestion.romaji.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        {feedback === 'correct' && (
                                            <div className="text-green-600 font-medium">✓ Correct! Well done!</div>
                                        )}
                                        {feedback === 'incorrect' && (
                                            <div className="text-red-600 font-medium">
                                                ✗ Incorrect. The answer is: {currentQuestion.romaji}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-center space-x-4">
                                        <button
                                            onClick={checkAnswer}
                                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
                                        >
                                            Check
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPracticeMode(false);
                                                setSelectedKana(null);
                                            }}
                                            className="border border-stone-300 hover:bg-stone-100 text-stone-700 px-6 py-2 rounded-lg font-medium"
                                        >
                                            Exit Practice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mb-8">
                        <button
                            onClick={startPractice}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                        >
                            Start Practice Session
                        </button>
                    </div>
                )}

                {/* Kana Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-stone-200">
                    <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-1 p-2">
                        {(activeTab === 'hiragana' ? hiraganaData : katakanaData).map((kana, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedKana(kana)}
                                className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${typeColors[kana.type]} ${selectedKana?.char === kana.char ? 'ring-2 ring-amber-500 scale-105' : 'hover:bg-opacity-80'}`}
                            >
                                <span className="text-2xl font-bold">{kana.char}</span>
                                <span className="text-xs opacity-80">{kana.romaji}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Kana Details */}
                {selectedKana && !practiceMode && (
                    <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-stone-200">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                                <div className={`w-32 h-32 flex items-center justify-center rounded-full ${typeColors[selectedKana.type]} text-8xl font-bold`}>
                                    {selectedKana.char}
                                </div>
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-stone-800 mb-2">
                                    {selectedKana.romaji}
                                </h3>
                                <p className="text-stone-600 mb-4">
                                    {activeTab === 'hiragana' ? 'Hiragana' : 'Katakana'} character
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold text-stone-700 mb-1">Stroke Order</h4>
                                        <div className="bg-stone-100 rounded-lg p-2 h-24 flex items-center justify-center">
                                            <img //frontend\src\strokeOrder\あ.gif
                                                src={`/strokeOrder/${selectedKana.char}.gif`} // replace with your URL
                                                alt={selectedKana.char}
                                                className="h-full object-contain"
                                            />
                                        </div>

                                    </div>

                                    <div>
                                        <h4 className="font-bold text-stone-700 mb-1">Example Words</h4>
                                        <div className="space-y-2">
                                            <div className="bg-stone-50 rounded-lg p-2">
                                                <div className="font-bold">{selectedKana.char}い</div>
                                                <div className="text-sm text-stone-500">{selectedKana.romaji}i</div>
                                            </div>
                                            <div className="bg-stone-50 rounded-lg p-2">
                                                <div className="font-bold">{selectedKana.char}ん</div>
                                                <div className="text-sm text-stone-500">{selectedKana.romaji}n</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setPracticeMode(true);
                                        setCurrentQuestion(selectedKana);
                                        setStreak(0);
                                    }}
                                    className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    Practice This Character
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Learning Tips */}
                <div className="mt-8 bg-amber-50 rounded-xl shadow-sm p-6 border border-amber-100">
                    <h3 className="text-xl font-bold text-stone-800 mb-3">Learning Tips</h3>
                    <ul className="space-y-3 text-stone-700">
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            Practice writing each character while saying the sound out loud
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            Group characters by their starting consonant (k, s, t, etc.)
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            Use mnemonics to remember tricky characters
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            Practice daily for just 10-15 minutes
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LearnKana;