import React, { useState, useEffect, useRef } from 'react';

// --- Data for all games ---
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


const wordData = [
    { japanese: '猫', english: 'cat', romaji: 'neko' },
    { japanese: '犬', english: 'dog', romaji: 'inu' },
    { japanese: '家', english: 'house', romaji: 'ie' },
    { japanese: '水', english: 'water', romaji: 'mizu' },
    { japanese: '本', english: 'book', romaji: 'hon' },
    { japanese: '車', english: 'car', romaji: 'kuruma' },
    { japanese: '花', english: 'flower', romaji: 'hana' },
    { japanese: '魚', english: 'fish', romaji: 'sakana' }
];

const kanjiData = [
    { kanji: '人', strokes: ['ノ', '\\'], meaning: 'person' },
    { kanji: '大', strokes: ['一', 'ノ', '\\'], meaning: 'big' },
    { kanji: '小', strokes: ['丨', '八'], meaning: 'small' },
    { kanji: '日', strokes: ['丨', '一', '丨', '一'], meaning: 'sun/day' }
];

const sentencePuzzleData = [
    { sentence: 'おはようございます。', words: ['おはよう', 'ございます', '。'], english: 'Good morning.' },
    { sentence: 'こんにちは。', words: ['こんにちは', '。'], english: 'Hello.' },
    { sentence: 'こんばんは。', words: ['こんばんは', '。'], english: 'Good evening.' },
    { sentence: 'さようなら。', words: ['さようなら', '。'], english: 'Goodbye.' },
    { sentence: '私はアミです。', words: ['私', 'は', 'アミ', 'です', '。'], english: 'I am Ami.' },
    { sentence: 'あなたは先生です。', words: ['あなた', 'は', '先生', 'です', '。'], english: 'You are a teacher.' },
    { sentence: '私は学生です。', words: ['私', 'は', '学生', 'です', '。'], english: 'I am a student.' },
    { sentence: '犬が好きです。', words: ['犬', 'が', '好き', 'です', '。'], english: 'I like dogs.' },
    { sentence: '猫が好きです。', words: ['猫', 'が', '好き', 'です', '。'], english: 'I like cats.' },
    { sentence: '水を飲みます。', words: ['水', 'を', '飲みます', '。'], english: 'I drink water.' },
    { sentence: '本を読みます。', words: ['本', 'を', '読みます', '。'], english: 'I read books.' },
    { sentence: 'テレビを見ます。', words: ['テレビ', 'を', '見ます', '。'], english: 'I watch TV.' },
    { sentence: '音楽を聞きます。', words: ['音楽', 'を', '聞きます', '。'], english: 'I listen to music.' },
    { sentence: 'パンを食べます。', words: ['パン', 'を', '食べます', '。'], english: 'I eat bread.' },
    { sentence: 'りんごを食べます。', words: ['りんご', 'を', '食べます', '。'], english: 'I eat apples.' },
    { sentence: 'バナナが好きです。', words: ['バナナ', 'が', '好き', 'です', '。'], english: 'I like bananas.' },
    { sentence: '学校へ行きます。', words: ['学校', 'へ', '行きます', '。'], english: 'I go to school.' },
    { sentence: '家に帰ります。', words: ['家', 'に', '帰ります', '。'], english: 'I return home.' },
    { sentence: '朝ごはんを食べます。', words: ['朝ごはん', 'を', '食べます', '。'], english: 'I eat breakfast.' },
    { sentence: '夜に寝ます。', words: ['夜', 'に', '寝ます', '。'], english: 'I sleep at night.' },
    { sentence: '友達と話します。', words: ['友達', 'と', '話します', '。'], english: 'I talk with friends.' },
    { sentence: '先生に会います。', words: ['先生', 'に', '会います', '。'], english: 'I meet the teacher.' },
    { sentence: '手紙を書きます。', words: ['手紙', 'を', '書きます', '。'], english: 'I write a letter.' },
    { sentence: '電話をします。', words: ['電話', 'を', 'します', '。'], english: 'I make a phone call.' },
    { sentence: '英語を話します。', words: ['英語', 'を', '話します', '。'], english: 'I speak English.' },
    { sentence: '日本語を勉強します。', words: ['日本語', 'を', '勉強します', '。'], english: 'I study Japanese.' },
    { sentence: 'バスに乗ります。', words: ['バス', 'に', '乗ります', '。'], english: 'I ride the bus.' },
    { sentence: '写真を撮ります。', words: ['写真', 'を', '撮ります', '。'], english: 'I take a photo.' },
    { sentence: '天気がいいです。', words: ['天気', 'が', 'いい', 'です', '。'], english: 'The weather is nice.' },
    { sentence: '雨が降ります。', words: ['雨', 'が', '降ります', '。'], english: 'It is raining.' },
    { sentence: '今日は日曜日です。', words: ['今日', 'は', '日曜日', 'です', '。'], english: 'Today is Sunday.' },
    { sentence: '今は三時です。', words: ['今', 'は', '三時', 'です', '。'], english: 'It is 3 o’clock now.' },
    { sentence: 'ここは図書館です。', words: ['ここ', 'は', '図書館', 'です', '。'], english: 'This is the library.' },
    { sentence: 'あそこに猫がいます。', words: ['あそこ', 'に', '猫', 'が', 'います', '。'], english: 'There is a cat over there.' },
    { sentence: '机の上に本があります。', words: ['机', 'の', '上', 'に', '本', 'が', 'あります', '。'], english: 'There is a book on the desk.' },
    { sentence: '私は東京に住んでいます。', words: ['私', 'は', '東京', 'に', '住んでいます', '。'], english: 'I live in Tokyo.' },
    { sentence: '彼は医者です。', words: ['彼', 'は', '医者', 'です', '。'], english: 'He is a doctor.' },
    { sentence: '彼女は学生です。', words: ['彼女', 'は', '学生', 'です', '。'], english: 'She is a student.' },
    { sentence: '兄が二人います。', words: ['兄', 'が', '二人', 'います', '。'], english: 'I have two older brothers.' },
    { sentence: '私の母は優しいです。', words: ['私', 'の', '母', 'は', '優しい', 'です', '。'], english: 'My mother is kind.' },
    { sentence: 'お水をください。', words: ['お水', 'を', 'ください', '。'], english: 'Please give me water.' },
    { sentence: '静かにしてください。', words: ['静かに', 'して', 'ください', '。'], english: 'Please be quiet.' },
    { sentence: 'もう一度言ってください。', words: ['もう一度', '言って', 'ください', '。'], english: 'Please say it again.' },
    { sentence: 'ゆっくり話してください。', words: ['ゆっくり', '話して', 'ください', '。'], english: 'Please speak slowly.' },
    { sentence: 'ドアを開けてください。', words: ['ドア', 'を', '開けて', 'ください', '。'], english: 'Please open the door.' },
    { sentence: 'ドアを閉めてください。', words: ['ドア', 'を', '閉めて', 'ください', '。'], english: 'Please close the door.' },
    { sentence: '私はバナナが好きです。', words: ['私', 'は', 'バナナ', 'が', '好き', 'です', '。'], english: 'I like bananas.' },
    { sentence: '今日は暑いです。', words: ['今日', 'は', '暑い', 'です', '。'], english: 'It is hot today.' },
    { sentence: '私は寒いです。', words: ['私', 'は', '寒い', 'です', '。'], english: 'I am cold.' },
    { sentence: 'お腹がすきました。', words: ['お腹', 'が', 'すきました', '。'], english: 'I am hungry.' },
    { sentence: 'のどが渇きました。', words: ['のど', 'が', '渇きました', '。'], english: 'I am thirsty.' }
];

const listeningGameData = [
    {
        audio: '/audio/neko.mp3',
        answer: '猫',
        options: ['猫', '犬', '魚', '花'],
        english: 'cat'
    },
    {
        audio: '/audio/inu.mp3',
        answer: '犬',
        options: ['犬', '家', '水', '本'],
        english: 'dog'
    },
    {
        audio: '/audio/mizu.mp3',
        answer: '水',
        options: ['水', '車', '花', '魚'],
        english: 'water'
    },
    {
        audio: '/audio/hana.mp3',
        answer: '花',
        options: ['花', '魚', '猫', '犬'],
        english: 'flower'
    }
];

// --- Main Games List ---
const games = [
    {
        id: 'hiragana-match',
        title: 'Hiragana Memory Match',
        description: 'Match hiragana characters with their romaji pronunciation',
        icon: 'あ',
        difficulty: 'Beginner',
        color: 'from-pink-400 to-rose-500',
        bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
        textColor: 'text-pink-600'
    },
    // {
    //     id: 'word-builder',
    //     title: 'Word Builder Challenge',
    //     description: 'Build Japanese words from character components',
    //     icon: '漢',
    //     difficulty: 'Intermediate',
    //     color: 'from-blue-400 to-indigo-500',
    //     bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    //     textColor: 'text-blue-600'
    // },
    // {
    //     id: 'kanji-draw',
    //     title: 'Kanji Stroke Master',
    //     description: 'Learn proper kanji stroke order through interactive drawing',
    //     icon: '書',
    //     difficulty: 'Advanced',
    //     color: 'from-green-400 to-emerald-500',
    //     bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
    //     textColor: 'text-green-600'
    // },
    {
        id: 'speed-translate',
        title: 'Lightning Translation',
        description: 'Quick-fire translation challenge with time pressure',
        icon: '⚡',
        difficulty: 'All Levels',
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-100',
        textColor: 'text-yellow-600'
    },
    {
        id: 'sentence-puzzle',
        title: 'Sentence Puzzle',
        description: 'Arrange words to form correct Japanese sentences',
        icon: '文',
        difficulty: 'Intermediate',
        color: 'from-purple-400 to-violet-500',
        bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100',
        textColor: 'text-purple-600'
    },
    // {
    //     id: 'listening-game',
    //     title: 'Sound Detective',
    //     description: 'Identify Japanese words and phrases by sound',
    //     icon: '👂',
    //     difficulty: 'All Levels',
    //     color: 'from-teal-400 to-cyan-500',
    //     bgColor: 'bg-gradient-to-br from-teal-50 to-cyan-100',
    //     textColor: 'text-teal-600'
    // }
];

// --- Hiragana Memory Match Game ---
const HiraganaMatchGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        initializeGame();
        // eslint-disable-next-line
    }, []);

    const initializeGame = () => {
        const gameCards = [];
        const selectedData = hiraganaData.slice(0, 6);

        selectedData.forEach((item, index) => {
            gameCards.push({ id: index * 2, type: 'hiragana', content: item.hiragana, pair: index });
            gameCards.push({ id: index * 2 + 1, type: 'romaji', content: item.romaji, pair: index });
        });

        setCards(gameCards.sort(() => Math.random() - 0.5));
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setScore(0);
    };

    const handleCardClick = (id) => {
        if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(moves + 1);
            const [first, second] = newFlipped;
            const firstCard = cards.find(card => card.id === first);
            const secondCard = cards.find(card => card.id === second);

            if (firstCard.pair === secondCard.pair) {
                setMatched([...matched, first, second]);
                setScore(score + 10);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-pink-600">Hiragana Memory Match</h3>
                <div className="flex gap-4 text-sm">
                    <span className="bg-white px-3 py-1 rounded-full text-pink-600 font-medium">Score: {score}</span>
                    <span className="bg-white px-3 py-1 rounded-full text-pink-600 font-medium">Moves: {moves}</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl font-bold ${flipped.includes(card.id) || matched.includes(card.id)
                                ? 'bg-white text-pink-600 shadow-lg scale-105'
                                : 'bg-gradient-to-br from-pink-200 to-rose-300 text-white hover:scale-105'
                            } ${matched.includes(card.id) ? 'ring-4 ring-green-400' : ''}`}
                    >
                        {flipped.includes(card.id) || matched.includes(card.id) ? card.content : '?'}
                    </div>
                ))}
            </div>

            {matched.length === cards.length && (
                <div className="mt-6 text-center">
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <h4 className="text-xl font-bold text-green-600 mb-2">🎉 Congratulations!</h4>
                        <p className="text-gray-600">You completed the game in {moves} moves!</p>
                        <button
                            onClick={initializeGame}
                            className="mt-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Word Builder Challenge Game ---
const WordBuilderGame = () => {
    // For each round, show a Japanese word with its characters shuffled, and the user must arrange them in the correct order.
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [shuffled, setShuffled] = useState([]);
    const [selected, setSelected] = useState([]);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        startRound();
        // eslint-disable-next-line
    }, [currentWordIndex]);

    const startRound = () => {
        setSelected([]);
        setShowResult(false);
        const word = wordData[currentWordIndex].japanese.split('');
        setShuffled(word.sort(() => Math.random() - 0.5));
    };

    const handleSelect = (char, idx) => {
        setSelected([...selected, { char, idx }]);
    };

    const handleSubmit = () => {
        const answer = selected.map(s => s.char).join('');
        if (answer === wordData[currentWordIndex].japanese) {
            setScore(score + 10);
        }
        setShowResult(true);
    };

    const handleNext = () => {
        if (currentWordIndex < wordData.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        setCurrentWordIndex(0);
        setScore(0);
        setIsFinished(false);
        setSelected([]);
        setShowResult(false);
        startRound();
    };

    const currentWord = wordData[currentWordIndex];

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-blue-600">Word Builder Challenge</h3>
                <span className="bg-white px-3 py-1 rounded-full text-blue-600 font-medium text-sm">
                    Score: {score}
                </span>
            </div>
            {isFinished ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h4 className="text-xl font-bold text-blue-600 mb-2">All Done!</h4>
                    <p className="text-gray-600 mb-4">Final Score: {score} points</p>
                    <button
                        onClick={handleRestart}
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl p-8 mb-6 shadow-lg text-center">
                        <div className="text-lg text-gray-600 mb-2">Build this word:</div>
                        <div className="text-4xl font-bold text-gray-800 mb-2">{currentWord.english}</div>
                        <div className="text-lg text-gray-500 mb-2">({currentWord.romaji})</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {shuffled.map((char, idx) => (
                            <button
                                key={idx}
                                disabled={selected.find(s => s.idx === idx)}
                                onClick={() => handleSelect(char, idx)}
                                className={`text-2xl font-bold px-4 py-2 rounded-lg border-2 border-blue-200 bg-white shadow-sm transition-all hover:bg-blue-50 ${selected.find(s => s.idx === idx) ? 'opacity-50' : 'hover:scale-105'}`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-[48px]">
                        {selected.map((s, idx) => (
                            <span key={idx} className="text-2xl font-bold px-4 py-2 rounded-lg bg-blue-100 text-blue-700 border border-blue-300">{s.char}</span>
                        ))}
                    </div>
                    {!showResult ? (
                        <button
                            disabled={selected.length !== currentWord.japanese.length}
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
                        >
                            Submit
                        </button>
                    ) : (
                        <div className="text-center mt-4">
                            {selected.map(s => s.char).join('') === currentWord.japanese ? (
                                <div className="text-green-600 font-bold text-lg mb-2">Correct! 🎉</div>
                            ) : (
                                <div className="text-red-600 font-bold text-lg mb-2">Incorrect. 😢</div>
                            )}
                            <div className="mb-2">
                                <span className="text-gray-700">Answer: </span>
                                <span className="font-bold text-blue-700">{currentWord.japanese}</span>
                            </div>
                            <button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all mt-2"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// --- Kanji Stroke Master Game ---
const KanjiDrawGame = () => {
    const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
    const [currentStroke, setCurrentStroke] = useState(0);
    const [completed, setCompleted] = useState(false);

    const currentKanji = kanjiData[currentKanjiIndex];

    const nextKanji = () => {
        if (currentKanjiIndex < kanjiData.length - 1) {
            setCurrentKanjiIndex(currentKanjiIndex + 1);
            setCurrentStroke(0);
            setCompleted(false);
        } else {
            setCompleted(true);
        }
    };

    const handleStrokeComplete = () => {
        if (currentStroke < currentKanji.strokes.length - 1) {
            setCurrentStroke(currentStroke + 1);
        } else {
            setTimeout(() => {
                nextKanji();
            }, 1000);
        }
    };

    const handleRestart = () => {
        setCurrentKanjiIndex(0);
        setCurrentStroke(0);
        setCompleted(false);
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-green-600">Kanji Stroke Master</h3>
                <span className="bg-white px-3 py-1 rounded-full text-green-600 font-medium text-sm">
                    {completed ? 'Complete!' : `Stroke ${currentStroke + 1} of ${currentKanji.strokes.length}`}
                </span>
            </div>
            {completed ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h4 className="text-xl font-bold text-green-600 mb-2">All Kanji Complete!</h4>
                    <button
                        onClick={handleRestart}
                        className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <>
                    <div className="text-center mb-8">
                        <div className="bg-white rounded-xl p-8 shadow-lg mb-4">
                            <div className="text-8xl font-bold text-gray-800 mb-4">{currentKanji.kanji}</div>
                            <div className="text-lg text-gray-600">{currentKanji.meaning}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-md">
                            <p className="text-gray-600 mb-2">Next stroke to draw:</p>
                            <div className="text-3xl font-bold text-green-600">{currentKanji.strokes[currentStroke]}</div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="bg-white rounded-xl p-8 mb-4 shadow-lg">
                            <div className="w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                <span className="text-gray-400">Draw the stroke here</span>
                            </div>
                        </div>
                        <button
                            onClick={handleStrokeComplete}
                            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            Complete Stroke
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// --- Lightning Translation Game ---
const SpeedTranslateGame = () => {
    const [currentWord, setCurrentWord] = useState(null);
    const [options, setOptions] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameScore, setGameScore] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
    }, [isActive, timeLeft]);

    const startGame = () => {
        setIsActive(true);
        setTimeLeft(30);
        setGameScore(0);
        generateQuestion();
    };

    const generateQuestion = () => {
        const randomWord = wordData[Math.floor(Math.random() * wordData.length)];
        let wrongOptions = wordData.filter(w => w !== randomWord);
        wrongOptions = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        const allOptions = [randomWord, ...wrongOptions].sort(() => Math.random() - 0.5);

        setCurrentWord(randomWord);
        setOptions(allOptions);
    };

    const handleAnswer = (selected) => {
        if (selected.japanese === currentWord.japanese) {
            setGameScore(gameScore + 10);
        }
        if (timeLeft > 0) {
            generateQuestion();
        }
    };

    return (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-yellow-600">Lightning Translation</h3>
                <div className="flex gap-4 text-sm">
                    <span className="bg-white px-3 py-1 rounded-full text-yellow-600 font-medium">Score: {gameScore}</span>
                    <span className="bg-white px-3 py-1 rounded-full text-yellow-600 font-medium">Time: {timeLeft}s</span>
                </div>
            </div>
            {!isActive && timeLeft === 30 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">⚡</div>
                    <h4 className="text-xl font-bold text-yellow-600 mb-4">Ready for Lightning Speed?</h4>
                    <p className="text-gray-600 mb-6">Translate as many words as you can in 30 seconds!</p>
                    <button
                        onClick={startGame}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        Start Game
                    </button>
                </div>
            ) : timeLeft === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h4 className="text-xl font-bold text-green-600 mb-2">Game Over!</h4>
                    <p className="text-gray-600 mb-4">Final Score: {gameScore} points</p>
                    <button
                        onClick={startGame}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <div className="bg-white rounded-xl p-8 mb-6 shadow-lg">
                        <p className="text-gray-600 mb-2">What does this mean?</p>
                        <div className="text-4xl font-bold text-gray-800 mb-2">{currentWord?.japanese}</div>
                        <div className="text-lg text-gray-500">({currentWord?.romaji})</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                className="bg-white hover:bg-yellow-50 text-gray-800 py-4 px-6 rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-yellow-300"
                            >
                                {option.english}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sentence Puzzle Game ---
const SentencePuzzleGame = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffledWords, setShuffledWords] = useState([]);
    const [selected, setSelected] = useState([]);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [shuffledData, setShuffledData] = useState([]);

    // Shuffle the full data only once when the component mounts
    useEffect(() => {
        const shuffled = [...sentencePuzzleData].sort(() => Math.random() - 0.5);
        setShuffledData(shuffled);
    }, []);

    // Shuffle the words of current sentence on every new round
    useEffect(() => {
        if (shuffledData.length > 0) {
            startRound();
        }
        // eslint-disable-next-line
    }, [currentIndex, shuffledData]);

    const startRound = () => {
        setSelected([]);
        setShowResult(false);
        const words = [...shuffledData[currentIndex].words];
        setShuffledWords(words.sort(() => Math.random() - 0.5));
    };

    const handleSelect = (word, idx) => {
        setSelected([...selected, { word, idx }]);
    };

    const handleSubmit = () => {
        const answer = selected.map(s => s.word).join('');
        if (answer === shuffledData[currentIndex].sentence) {
            setScore(score + 10);
        }
        setShowResult(true);
    };

    const handleNext = () => {
        if (currentIndex < shuffledData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        const reshuffled = [...sentencePuzzleData].sort(() => Math.random() - 0.5);
        setShuffledData(reshuffled);
        setCurrentIndex(0);
        setScore(0);
        setIsFinished(false);
        setSelected([]);
        setShowResult(false);
    };

    const current = shuffledData[currentIndex];

    return (
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-purple-600">Sentence Puzzle</h3>
                <span className="bg-white px-3 py-1 rounded-full text-purple-600 font-medium text-sm">
                    Score: {score}
                </span>
            </div>
            {isFinished ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h4 className="text-xl font-bold text-purple-600 mb-2">All Done!</h4>
                    <p className="text-gray-600 mb-4">Final Score: {score} points</p>
                    <button
                        onClick={handleRestart}
                        className="bg-gradient-to-r from-purple-400 to-violet-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Play Again
                    </button>
                </div>
            ) : shuffledData.length > 0 ? (
                <>
                    <div className="bg-white rounded-xl p-8 mb-6 shadow-lg text-center">
                        <div className="text-lg text-gray-600 mb-2">Arrange the words to form:</div>
                        <div className="text-2xl font-bold text-gray-800 mb-2">{current.english}</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {shuffledWords.map((word, idx) => (
                            <button
                                key={idx}
                                disabled={selected.find(s => s.idx === idx)}
                                onClick={() => handleSelect(word, idx)}
                                className={`text-lg font-bold px-4 py-2 rounded-lg border-2 border-purple-200 bg-white shadow-sm transition-all hover:bg-purple-50 ${selected.find(s => s.idx === idx) ? 'opacity-50' : 'hover:scale-105'}`}
                            >
                                {word}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-[48px]">
                        {selected.map((s, idx) => (
                            <span key={idx} className="text-lg font-bold px-4 py-2 rounded-lg bg-purple-100 text-purple-700 border border-purple-300">{s.word}</span>
                        ))}
                    </div>
                    {!showResult ? (
                        <button
                            disabled={selected.length !== current.words.length}
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-purple-400 to-violet-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
                        >
                            Submit
                        </button>
                    ) : (
                        <div className="text-center mt-4">
                            {selected.map(s => s.word).join('') === current.sentence ? (
                                <div className="text-green-600 font-bold text-lg mb-2">Correct! 🎉</div>
                            ) : (
                                <div className="text-red-600 font-bold text-lg mb-2">Incorrect. 😢</div>
                            )}
                            <div className="mb-2">
                                <span className="text-gray-700">Answer: </span>
                                <span className="font-bold text-purple-700">{current.sentence}</span>
                            </div>
                            <button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-purple-400 to-violet-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all mt-2"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-gray-500">Loading game...</div>
            )}
        </div>
    );
};

// --- Sound Detective (Listening Game) ---
const ListeningGame = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const audioRef = useRef();

    useEffect(() => {
        setSelected(null);
        setShowResult(false);
    }, [currentIndex]);

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    const handleSelect = (option) => {
        setSelected(option);
        if (option === listeningGameData[currentIndex].answer) {
            setScore(score + 10);
        }
        setShowResult(true);
    };

    const handleNext = () => {
        if (currentIndex < listeningGameData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setIsFinished(false);
        setSelected(null);
        setShowResult(false);
    };

    const current = listeningGameData[currentIndex];

    return (
        <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-teal-600">Sound Detective</h3>
                <span className="bg-white px-3 py-1 rounded-full text-teal-600 font-medium text-sm">
                    Score: {score}
                </span>
            </div>
            {isFinished ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h4 className="text-xl font-bold text-teal-600 mb-2">All Done!</h4>
                    <p className="text-gray-600 mb-4">Final Score: {score} points</p>
                    <button
                        onClick={handleRestart}
                        className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl p-8 mb-6 shadow-lg text-center">
                        <div className="text-lg text-gray-600 mb-2">Listen and choose the correct word:</div>
                        <button
                            onClick={handlePlay}
                            className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105 mb-4"
                        >
                            ▶️ Play Sound
                        </button>
                        <audio ref={audioRef} src={current.audio} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {current.options.map((option, idx) => (
                            <button
                                key={idx}
                                disabled={!!selected}
                                onClick={() => handleSelect(option)}
                                className={`bg-white hover:bg-cyan-50 text-gray-800 py-4 px-6 rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-cyan-300 ${selected && option === current.answer ? 'ring-4 ring-green-400' : ''} ${selected && option !== current.answer && option === selected ? 'ring-4 ring-red-400' : ''}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {showResult && (
                        <div className="text-center mt-4">
                            {selected === current.answer ? (
                                <div className="text-green-600 font-bold text-lg mb-2">Correct! 🎉</div>
                            ) : (
                                <div className="text-red-600 font-bold text-lg mb-2">Incorrect. 😢</div>
                            )}
                            <div className="mb-2">
                                <span className="text-gray-700">Answer: </span>
                                <span className="font-bold text-teal-700">{current.answer}</span>
                                <span className="ml-2 text-gray-500">({current.english})</span>
                            </div>
                            <button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all mt-2"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// --- Main App Component ---
const Games = () => {
    const [activeGame, setActiveGame] = useState(null);

    const renderGame = () => {
        switch (activeGame) {
            case 'hiragana-match':
                return <HiraganaMatchGame />;
            case 'word-builder':
                return <WordBuilderGame />;
            case 'kanji-draw':
                return <KanjiDrawGame />;
            case 'speed-translate':
                return <SpeedTranslateGame />;
            case 'sentence-puzzle':
                return <SentencePuzzleGame />;
            case 'listening-game':
                return <ListeningGame />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 relative overflow-x-hidden">
            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('/images/japanese-pattern.png')] opacity-5"></div>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-amber-300/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${8 + Math.random() * 12}s infinite ease-in-out`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-40 backdrop-blur-lg bg-white/80 border-b border-stone-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                                日
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                                KataHira Games
                            </div>
                        </div>
                        {activeGame && (
                            <button
                                onClick={() => setActiveGame(null)}
                                className="bg-gradient-to-r from-stone-600 to-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
                            >
                                Back to Games
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="pt-20">
                {!activeGame ? (
                    <>
                        {/* Hero Section */}
                        <section className="py-16 px-6 text-center">
                            <div className="max-w-4xl mx-auto">
                                <div className="mb-8">
                                    <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-medium mb-4 shadow-xs">
                                        🎮 Learn Japanese Through Play
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                                        Japanese Learning
                                    </span>
                                    <br />
                                    <span className="text-transparent bg-gradient-to-r from-stone-600 to-stone-700 bg-clip-text">
                                        Games Collection
                                    </span>
                                </h1>

                                <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                    Master Japanese through engaging, stress-free games designed to make learning fun and effective
                                </p>

                                <div className="flex flex-wrap justify-center gap-4 mb-12">
                                    <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
                                        <span className="text-green-600 font-medium">✨ Stress-Free Learning</span>
                                    </div>
                                    <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
                                        <span className="text-blue-600 font-medium">🎯 Skill Building</span>
                                    </div>
                                    <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
                                        <span className="text-purple-600 font-medium">🏆 Progress Tracking</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Games Grid */}
                        <section className="py-12 px-6">
                            <div className="max-w-7xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {games.map((game, index) => (
                                        <div
                                            key={game.id}
                                            className={`group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                                            onClick={() => setActiveGame(game.id)}
                                        >
                                            <div className={`${game.bgColor} rounded-2xl p-6 shadow-lg border border-white/50 overflow-hidden relative h-full`}>
                                                {/* Floating accent */}
                                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${game.color} opacity-10 rounded-bl-full transition-all duration-500 group-hover:opacity-20`}></div>

                                                {/* Difficulty badge */}
                                                <div className="absolute top-4 right-4">
                                                    <span className={`bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold ${game.textColor} border border-white/30`}>
                                                        {game.difficulty}
                                                    </span>
                                                </div>

                                                {/* Icon */}
                                                <div className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 text-3xl transform group-hover:scale-110 transition-all duration-300`}>
                                                    {game.icon}
                                                </div>

                                                {/* Content */}
                                                <h3 className="text-xl font-bold mb-3 leading-tight text-stone-800">
                                                    {game.title}
                                                </h3>
                                                <p className="text-stone-600 leading-relaxed mb-6 flex-grow">
                                                    {game.description}
                                                </p>

                                                {/* Action */}
                                                <div className="flex items-center justify-between mt-auto">
                                                    <button className={`${game.textColor} bg-white/70 backdrop-blur-sm border border-white/30 px-5 py-2.5 rounded-lg font-medium hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] shadow-xs`}>
                                                        Play Now
                                                    </button>

                                                    <div className={`w-10 h-10 bg-white/70 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center transform group-hover:translate-x-1 transition-all duration-300 shadow-xs`}>
                                                        <span className={`text-xl ${game.textColor}`}>→</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Stats Section */}
                        <section className="py-16 px-6 bg-gradient-to-br from-white to-stone-50">
                            <div className="max-w-4xl mx-auto text-center">
                                <h2 className="text-3xl font-bold text-stone-800 mb-12">
                                    <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                                        Learning Stats
                                    </span>
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    {[
                                        { number: '1000+', label: 'Words Learned', icon: '📚' },
                                        { number: '50+', label: 'Games Played', icon: '🎮' },
                                        { number: '25', label: 'Streak Days', icon: '🔥' },
                                        { number: '95%', label: 'Accuracy Rate', icon: '🎯' }
                                    ].map((stat, index) => (
                                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
                                            <div className="text-3xl mb-2">{stat.icon}</div>
                                            <div className="text-2xl font-bold text-stone-800 mb-1">{stat.number}</div>
                                            <div className="text-sm text-stone-600">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    <section className="py-12 px-6">
                        <div className="max-w-4xl mx-auto">
                            {renderGame()}
                        </div>
                    </section>
                )}
            </div>

            <style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`}</style>
        </div>
    );
};

export default Games;