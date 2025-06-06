import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const PracticeKanji = () => {
    const navigate = useNavigate();
    const [jlptLevel, setJlptLevel] = useState('n5');
    const [quizMode, setQuizMode] = useState(null); // Start with null to show setup screen
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
    const [studyMode, setStudyMode] = useState('all');
    const [shuffle, setShuffle] = useState(true);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [showStrokeOrder, setShowStrokeOrder] = useState(false);
    const [activeTab, setActiveTab] = useState('meaning');
    const [quizSettings, setQuizSettings] = useState({
        questionCount: 10,
        timePerQuestion: 0, // 0 means no time limit
        questionTypes: ['meaning', 'onyomi', 'kunyomi'],
        difficulty: 'mixed'
    });
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [currentQuestionType, setCurrentQuestionType] = useState('meaning');
    const questionTimerRef = useRef(null);

    // Kanji data (same as before)
        const kanjiData = {
        n5: [
            { kanji: '人', meaning: 'person', onyomi: 'じん', kunyomi: 'ひと', strokes: 2, examples: ['一人 (ひとり) - one person', '人々 (ひとびと) - people'] },
            { kanji: '日', meaning: 'day, sun', onyomi: 'にち', kunyomi: 'ひ', strokes: 4, examples: ['日本 (にほん) - Japan', '休日 (きゅうじつ) - holiday'] },
            { kanji: '一', meaning: 'one', onyomi: 'いち', kunyomi: 'ひと', strokes: 1, examples: ['一人 (ひとり) - one person', '一月 (いちがつ) - January'] },
            { kanji: '二', meaning: 'two', onyomi: 'に', kunyomi: 'ふた', strokes: 2, examples: ['二月 (にがつ) - February', '二人 (ふたり) - two people'] },
            { kanji: '三', meaning: 'three', onyomi: 'さん', kunyomi: 'み', strokes: 3, examples: ['三月 (さんがつ) - March', '三つ (みっつ) - three things'] },
            { kanji: '四', meaning: 'four', onyomi: 'し', kunyomi: 'よん', strokes: 5, examples: ['四月 (しがつ) - April', '四つ (よっつ) - four things'] },
            { kanji: '五', meaning: 'five', onyomi: 'ご', kunyomi: 'いつ', strokes: 4, examples: ['五月 (ごがつ) - May', '五つ (いつつ) - five things'] },
            { kanji: '六', meaning: 'six', onyomi: 'ろく', kunyomi: 'む', strokes: 4, examples: ['六月 (ろくがつ) - June', '六つ (むっつ) - six things'] },
            { kanji: '七', meaning: 'seven', onyomi: 'しち', kunyomi: 'なな', strokes: 2, examples: ['七月 (しちがつ) - July', '七つ (ななつ) - seven things'] },
            { kanji: '八', meaning: 'eight', onyomi: 'はち', kunyomi: 'や', strokes: 2, examples: ['八月 (はちがつ) - August', '八つ (やっつ) - eight things'] },
            { kanji: '九', meaning: 'nine', onyomi: 'きゅう', kunyomi: 'ここの', strokes: 2, examples: ['九月 (くがつ) - September', '九つ (ここのつ) - nine things'] },
            { kanji: '十', meaning: 'ten', onyomi: 'じゅう', kunyomi: 'とお', strokes: 2, examples: ['十月 (じゅうがつ) - October', '十 (とお) - ten'] },
            { kanji: '月', meaning: 'moon, month', onyomi: 'げつ', kunyomi: 'つき', strokes: 4, examples: ['今月 (こんげつ) - this month', '月曜日 (げつようび) - Monday'] },
            { kanji: '火', meaning: 'fire', onyomi: 'か', kunyomi: 'ひ', strokes: 4, examples: ['火曜日 (かようび) - Tuesday', '火山 (かざん) - volcano'] },
            { kanji: '水', meaning: 'water', onyomi: 'すい', kunyomi: 'みず', strokes: 4, examples: ['水曜日 (すいようび) - Wednesday', '水 (みず) - water'] },
            { kanji: '木', meaning: 'tree, wood', onyomi: 'もく', kunyomi: 'き', strokes: 4, examples: ['木曜日 (もくようび) - Thursday', '木 (き) - tree'] },
            { kanji: '金', meaning: 'gold, money', onyomi: 'きん', kunyomi: 'かね', strokes: 8, examples: ['金曜日 (きんようび) - Friday', 'お金 (おかね) - money'] },
            { kanji: '土', meaning: 'earth, soil', onyomi: 'ど', kunyomi: 'つち', strokes: 3, examples: ['土曜日 (どようび) - Saturday', '土 (つち) - soil'] },
            { kanji: '百', meaning: 'hundred', onyomi: 'ひゃく', kunyomi: '', strokes: 6, examples: ['百円 (ひゃくえん) - 100 yen', '百 (ひゃく) - hundred'] },
            { kanji: '千', meaning: 'thousand', onyomi: 'せん', kunyomi: 'ち', strokes: 3, examples: ['千円 (せんえん) - 1000 yen', '千 (せん) - thousand'] },
            { kanji: '万', meaning: 'ten thousand', onyomi: 'まん', kunyomi: 'よろず', strokes: 3, examples: ['一万円 (いちまんえん) - 10,000 yen', '万 (まん) - ten thousand'] },
            { kanji: '円', meaning: 'circle, yen', onyomi: 'えん', kunyomi: 'まる', strokes: 4, examples: ['円 (えん) - yen', '円い (まるい) - round'] },
            { kanji: '行', meaning: 'to go, act', onyomi: 'こう', kunyomi: 'い', strokes: 6, examples: ['銀行 (ぎんこう) - bank', '行く (いく) - to go'] },
            { kanji: '来', meaning: 'to come', onyomi: 'らい', kunyomi: 'く', strokes: 7, examples: ['来週 (らいしゅう) - next week', '来る (くる) - to come'] },
            { kanji: '休', meaning: 'rest', onyomi: 'きゅう', kunyomi: 'やす', strokes: 6, examples: ['休日 (きゅうじつ) - holiday', '休む (やすむ) - to rest'] },
            { kanji: '見', meaning: 'to see', onyomi: 'けん', kunyomi: 'み', strokes: 7, examples: ['見る (みる) - to see', '見せる (みせる) - to show'] },
            { kanji: '今', meaning: 'now', onyomi: 'こん', kunyomi: 'いま', strokes: 4, examples: ['今日 (きょう) - today', '今 (いま) - now'] },
            { kanji: '大', meaning: 'big', onyomi: 'だい', kunyomi: 'おお', strokes: 3, examples: ['大学 (だいがく) - university', '大きい (おおきい) - big'] },
            { kanji: '小', meaning: 'small', onyomi: 'しょう', kunyomi: 'ちい', strokes: 3, examples: ['小学校 (しょうがっこう) - elementary school', '小さい (ちいさい) - small'] },
            { kanji: '上', meaning: 'up, above', onyomi: 'じょう', kunyomi: 'うえ', strokes: 3, examples: ['上 (うえ) - above', '上手 (じょうず) - skilled'] },
            { kanji: '下', meaning: 'down, below', onyomi: 'か', kunyomi: 'した', strokes: 3, examples: ['下 (した) - below', '地下鉄 (ちかてつ) - subway'] },
            { kanji: '中', meaning: 'middle, inside', onyomi: 'ちゅう', kunyomi: 'なか', strokes: 4, examples: ['中国 (ちゅうごく) - China', '中 (なか) - inside'] },
            { kanji: '右', meaning: 'right', onyomi: 'う', kunyomi: 'みぎ', strokes: 5, examples: ['右 (みぎ) - right', '右手 (みぎて) - right hand'] },
            { kanji: '左', meaning: 'left', onyomi: 'さ', kunyomi: 'ひだり', strokes: 5, examples: ['左 (ひだり) - left', '左手 (ひだりて) - left hand'] },
            { kanji: '山', meaning: 'mountain', onyomi: 'さん', kunyomi: 'やま', strokes: 3, examples: ['山 (やま) - mountain', '富士山 (ふじさん) - Mt. Fuji'] },
            { kanji: '川', meaning: 'river', onyomi: 'せん', kunyomi: 'かわ', strokes: 3, examples: ['川 (かわ) - river', '川口 (かわぐち) - river mouth'] },
            { kanji: '白', meaning: 'white', onyomi: 'はく', kunyomi: 'しろ', strokes: 5, examples: ['白 (しろ) - white', '白い (しろい) - white (adj)'] },
            { kanji: '本', meaning: 'book, origin', onyomi: 'ほん', kunyomi: 'もと', strokes: 5, examples: ['日本 (にほん) - Japan', '本 (ほん) - book'] },
            { kanji: '子', meaning: 'child', onyomi: 'し', kunyomi: 'こ', strokes: 3, examples: ['子供 (こども) - child', '女の子 (おんなのこ) - girl'] },
            { kanji: '男', meaning: 'man', onyomi: 'だん', kunyomi: 'おとこ', strokes: 7, examples: ['男の人 (おとこのひと) - man', '男性 (だんせい) - male'] },
            { kanji: '女', meaning: 'woman', onyomi: 'じょ', kunyomi: 'おんな', strokes: 3, examples: ['女性 (じょせい) - woman', '女の人 (おんなのひと) - woman'] },
            { kanji: '父', meaning: 'father', onyomi: 'ふ', kunyomi: 'ちち', strokes: 4, examples: ['父 (ちち) - father', 'お父さん (おとうさん) - dad'] },
            { kanji: '母', meaning: 'mother', onyomi: 'ぼ', kunyomi: 'はは', strokes: 5, examples: ['母 (はは) - mother', 'お母さん (おかあさん) - mom'] },
            { kanji: '友', meaning: 'friend', onyomi: 'ゆう', kunyomi: 'とも', strokes: 4, examples: ['友達 (ともだち) - friend', '友人 (ゆうじん) - friend'] },
            { kanji: '先', meaning: 'previous, ahead', onyomi: 'せん', kunyomi: 'さき', strokes: 6, examples: ['先生 (せんせい) - teacher', '先週 (せんしゅう) - last week'] },
            { kanji: '生', meaning: 'life, birth', onyomi: 'せい', kunyomi: 'い', strokes: 5, examples: ['学生 (がくせい) - student', '生まれる (うまれる) - to be born'] },
            { kanji: '学', meaning: 'study, learning', onyomi: 'がく', kunyomi: 'まな', strokes: 8, examples: ['学校 (がっこう) - school', '学生 (がくせい) - student'] },
            { kanji: '校', meaning: 'school', onyomi: 'こう', kunyomi: '', strokes: 10, examples: ['学校 (がっこう) - school', '高校 (こうこう) - high school'] },
            { kanji: '何', meaning: 'what', onyomi: 'か', kunyomi: 'なに', strokes: 7, examples: ['何ですか？ (なんですか) - What is it?', '何人 (なんにん) - how many people?'] },
            { kanji: '時', meaning: 'time, hour', onyomi: 'じ', kunyomi: 'とき', strokes: 10, examples: ['時計 (とけい) - clock', '時間 (じかん) - time'] },
            { kanji: '間', meaning: 'interval, space', onyomi: 'かん', kunyomi: 'あいだ', strokes: 12, examples: ['時間 (じかん) - time', '間 (あいだ) - between'] },
            { kanji: '分', meaning: 'minute, part', onyomi: 'ふん', kunyomi: 'わ', strokes: 4, examples: ['十分 (じゅっぷん) - 10 minutes', '分かる (わかる) - to understand'] },
            { kanji: '半', meaning: 'half', onyomi: 'はん', kunyomi: '', strokes: 5, examples: ['半分 (はんぶん) - half', '半年 (はんとし) - half a year'] },
            { kanji: '毎', meaning: 'every', onyomi: 'まい', kunyomi: '', strokes: 6, examples: ['毎日 (まいにち) - every day', '毎週 (まいしゅう) - every week'] },
            { kanji: '年', meaning: 'year', onyomi: 'ねん', kunyomi: 'とし', strokes: 6, examples: ['今年 (ことし) - this year', '来年 (らいねん) - next year'] },
            { kanji: '前', meaning: 'before, in front', onyomi: 'ぜん', kunyomi: 'まえ', strokes: 9, examples: ['名前 (なまえ) - name', '前 (まえ) - front'] },
            { kanji: '後', meaning: 'after, behind', onyomi: 'ご', kunyomi: 'あと', strokes: 9, examples: ['午後 (ごご) - afternoon', '後ろ (うしろ) - behind'] },
            { kanji: '午', meaning: 'noon', onyomi: 'ご', kunyomi: '', strokes: 4, examples: ['午前 (ごぜん) - morning', '午後 (ごご) - afternoon'] },
            { kanji: '名', meaning: 'name', onyomi: 'めい', kunyomi: 'な', strokes: 6, examples: ['名前 (なまえ) - name', '有名 (ゆうめい) - famous'] },
            { kanji: '車', meaning: 'car, vehicle', onyomi: 'しゃ', kunyomi: 'くるま', strokes: 7, examples: ['車 (くるま) - car', '自動車 (じどうしゃ) - automobile'] },
            { kanji: '電', meaning: 'electricity', onyomi: 'でん', kunyomi: '', strokes: 13, examples: ['電気 (でんき) - electricity', '電話 (でんわ) - telephone'] },
            { kanji: '話', meaning: 'talk, story', onyomi: 'わ', kunyomi: 'はな', strokes: 13, examples: ['話す (はなす) - to speak', '電話 (でんわ) - telephone'] },
            { kanji: '聞', meaning: 'hear, listen', onyomi: 'ぶん', kunyomi: 'き', strokes: 14, examples: ['聞く (きく) - to listen', '新聞 (しんぶん) - newspaper'] },
            { kanji: '食', meaning: 'eat', onyomi: 'しょく', kunyomi: 'た', strokes: 9, examples: ['食べる (たべる) - to eat', '食事 (しょくじ) - meal'] },
            { kanji: '飲', meaning: 'drink', onyomi: 'いん', kunyomi: 'の', strokes: 12, examples: ['飲む (のむ) - to drink', '飲み物 (のみもの) - beverage'] },
            { kanji: '買', meaning: 'buy', onyomi: 'ばい', kunyomi: 'か', strokes: 12, examples: ['買う (かう) - to buy', '買い物 (かいもの) - shopping'] },
            { kanji: '店', meaning: 'shop, store', onyomi: 'てん', kunyomi: 'みせ', strokes: 8, examples: ['店 (みせ) - shop', '本店 (ほんてん) - main store'] },
            { kanji: '長', meaning: 'long, leader', onyomi: 'ちょう', kunyomi: 'なが', strokes: 8, examples: ['長い (ながい) - long', '校長 (こうちょう) - principal'] },
            { kanji: '高', meaning: 'tall, expensive', onyomi: 'こう', kunyomi: 'たか', strokes: 10, examples: ['高い (たかい) - expensive', '高校 (こうこう) - high school'] },
            { kanji: '口', meaning: 'mouth', onyomi: 'こう', kunyomi: 'くち', strokes: 3, examples: ['入口 (いりぐち) - entrance', '出口 (でぐち) - exit'] },
            { kanji: '目', meaning: 'eye', onyomi: 'もく', kunyomi: 'め', strokes: 5, examples: ['目的 (もくてき) - purpose', '目 (め) - eye'] },
            { kanji: '手', meaning: 'hand', onyomi: 'しゅ', kunyomi: 'て', strokes: 4, examples: ['手紙 (てがみ) - letter', '上手 (じょうず) - skillful'] },
            { kanji: '足', meaning: 'foot, leg', onyomi: 'そく', kunyomi: 'あし', strokes: 7, examples: ['足 (あし) - foot', '徒歩 (とほ) - on foot'] },
            { kanji: '近', meaning: 'near', onyomi: 'きん', kunyomi: 'ちか', strokes: 7, examples: ['近い (ちかい) - near', '最近 (さいきん) - recently'] },
            { kanji: '有', meaning: 'have, exist', onyomi: 'ゆう', kunyomi: 'あ', strokes: 6, examples: ['有名 (ゆうめい) - famous', '所有 (しょゆう) - possession'] },
            { kanji: '花', meaning: 'flower', onyomi: 'か', kunyomi: 'はな', strokes: 7, examples: ['花火 (はなび) - fireworks', '花 (はな) - flower'] },
            { kanji: '赤', meaning: 'red', onyomi: 'せき', kunyomi: 'あか', strokes: 7, examples: ['赤い (あかい) - red', '赤ちゃん (あかちゃん) - baby'] },
            { kanji: '紙', meaning: 'paper', onyomi: 'し', kunyomi: 'かみ', strokes: 10, examples: ['紙 (かみ) - paper', '新聞紙 (しんぶんし) - newspaper'] },
            { kanji: '買', meaning: 'buy', onyomi: 'ばい', kunyomi: 'か', strokes: 12, examples: ['買う (かう) - to buy', '買い物 (かいもの) - shopping'] },
            { kanji: '朝', meaning: 'morning', onyomi: 'ちょう', kunyomi: 'あさ', strokes: 12, examples: ['今朝 (けさ) - this morning', '朝ごはん (あさごはん) - breakfast'] },
            { kanji: '昼', meaning: 'noon, daytime', onyomi: 'ちゅう', kunyomi: 'ひる', strokes: 9, examples: ['昼ご飯 (ひるごはん) - lunch', '昼休み (ひるやすみ) - lunch break'] },
            { kanji: '夕', meaning: 'evening', onyomi: 'せき', kunyomi: 'ゆう', strokes: 3, examples: ['夕方 (ゆうがた) - evening', '夕日 (ゆうひ) - sunset'] },
            { kanji: '夜', meaning: 'night', onyomi: 'や', kunyomi: 'よる', strokes: 8, examples: ['夜 (よる) - night', '今夜 (こんや) - tonight'] },
            { kanji: '私', meaning: 'I, private', onyomi: 'し', kunyomi: 'わたし', strokes: 7, examples: ['私 (わたし) - I', '私立 (しりつ) - private (institution)'] },
            { kanji: '家', meaning: 'house, home', onyomi: 'か', kunyomi: 'いえ', strokes: 10, examples: ['家 (いえ) - house', '大家 (おおや) - landlord'] },
            { kanji: '会', meaning: 'meet, society', onyomi: 'かい', kunyomi: 'あ', strokes: 6, examples: ['会社 (かいしゃ) - company', '会う (あう) - to meet'] },
            { kanji: '社', meaning: 'company, shrine', onyomi: 'しゃ', kunyomi: 'やしろ', strokes: 7, examples: ['会社 (かいしゃ) - company', '神社 (じんじゃ) - shrine'] },
            { kanji: '店', meaning: 'shop, store', onyomi: 'てん', kunyomi: 'みせ', strokes: 8, examples: ['店 (みせ) - store', '本店 (ほんてん) - main store'] },
            { kanji: '飲', meaning: 'drink', onyomi: 'いん', kunyomi: 'の', strokes: 12, examples: ['飲む (のむ) - to drink', '飲み物 (のみもの) - beverage'] },
            { kanji: '多', meaning: 'many, much', onyomi: 'た', kunyomi: 'おお', strokes: 6, examples: ['多い (おおい) - many', '多少 (たしょう) - more or less'] },
            { kanji: '少', meaning: 'few, little', onyomi: 'しょう', kunyomi: 'すく', strokes: 4, examples: ['少ない (すくない) - few', '少し (すこし) - a little'] },
            { kanji: '古', meaning: 'old', onyomi: 'こ', kunyomi: 'ふる', strokes: 5, examples: ['古い (ふるい) - old', '中古 (ちゅうこ) - secondhand'] },
            { kanji: '新', meaning: 'new', onyomi: 'しん', kunyomi: 'あたら', strokes: 13, examples: ['新しい (あたらしい) - new', '新聞 (しんぶん) - newspaper'] },
            { kanji: '広', meaning: 'wide, spacious', onyomi: 'こう', kunyomi: 'ひろ', strokes: 5, examples: ['広い (ひろい) - wide', '広告 (こうこく) - advertisement'] },
            { kanji: '安', meaning: 'peaceful, cheap', onyomi: 'あん', kunyomi: 'やす', strokes: 6, examples: ['安い (やすい) - cheap', '安全 (あんぜん) - safety'] },
            { kanji: '立', meaning: 'stand', onyomi: 'りつ', kunyomi: 'た', strokes: 5, examples: ['立つ (たつ) - to stand', '立場 (たちば) - position'] },
            { kanji: '知', meaning: 'know, wisdom', onyomi: 'ち', kunyomi: 'し', strokes: 8, examples: ['知る (しる) - to know', '知識 (ちしき) - knowledge'] },
            { kanji: '言', meaning: 'say, word', onyomi: 'げん', kunyomi: 'い', strokes: 7, examples: ['言う (いう) - to say', '言葉 (ことば) - word, language'] },
            { kanji: '思', meaning: 'think', onyomi: 'し', kunyomi: 'おも', strokes: 9, examples: ['思う (おもう) - to think', '思考 (しこう) - thought'] },
            { kanji: '歩', meaning: 'walk, step', onyomi: 'ほ', kunyomi: 'ある', strokes: 8, examples: ['歩く (あるく) - to walk', '散歩 (さんぽ) - stroll'] },
            { kanji: '走', meaning: 'run', onyomi: 'そう', kunyomi: 'はし', strokes: 7, examples: ['走る (はしる) - to run', '走行 (そうこう) - running'] },
            { kanji: '住', meaning: 'live, reside', onyomi: 'じゅう', kunyomi: 'す', strokes: 7, examples: ['住む (すむ) - to live', '住所 (じゅうしょ) - address'] },
            { kanji: '空', meaning: 'sky, empty', onyomi: 'くう', kunyomi: 'そら', strokes: 8, examples: ['空 (そら) - sky', '空気 (くうき) - air'] },
            { kanji: '週', meaning: 'week', onyomi: 'しゅう', kunyomi: '', strokes: 12, examples: ['今週 (こんしゅう) - this week', '週末 (しゅうまつ) - weekend'] },
            { kanji: '魚', meaning: 'fish', onyomi: 'ぎょ', kunyomi: 'さかな', strokes: 11, examples: ['魚 (さかな) - fish', '金魚 (きんぎょ) - goldfish'] },
            { kanji: '耳', meaning: 'ear', onyomi: 'じ', kunyomi: 'みみ', strokes: 6, examples: ['耳 (みみ) - ear', '耳鼻科 (じびか) - otolaryngology'] },
            { kanji: '銀', meaning: 'silver', onyomi: 'ぎん', kunyomi: '', strokes: 14, examples: ['銀行 (ぎんこう) - bank', '銀色 (ぎんいろ) - silver color'] },
            { kanji: '道', meaning: 'road, way', onyomi: 'どう', kunyomi: 'みち', strokes: 12, examples: ['道 (みち) - road', '茶道 (さどう) - tea ceremony'] },
            { kanji: '駅', meaning: 'station', onyomi: 'えき', kunyomi: '', strokes: 14, examples: ['駅 (えき) - station', '駅前 (えきまえ) - in front of the station'] },
        ]
        ,
        n4: [
            { kanji: '会', meaning: 'meeting', onyomi: 'かい', kunyomi: 'あ', strokes: 6, examples: ['会社 (かいしゃ) - company', '会う (あう) - to meet'] },
            { kanji: '社', meaning: 'company, shrine', onyomi: 'しゃ', kunyomi: 'やしろ', strokes: 7, examples: ['会社 (かいしゃ) - company', '神社 (じんじゃ) - shrine'] },
            { kanji: '駅', meaning: 'station', onyomi: 'えき', kunyomi: '', strokes: 14, examples: ['駅前 (えきまえ) - in front of station', '東京駅 (とうきょうえき) - Tokyo Station'] },

            // Body Parts / Doctor
            { kanji: '体', meaning: 'body', onyomi: 'たい, てい', kunyomi: 'からだ', strokes: 7, examples: ['体 (からだ) - body', '体育 (たいいく) - physical education'] },
            { kanji: '頭', meaning: 'head', onyomi: 'とう, ず', kunyomi: 'あたま, かしら', strokes: 16, examples: ['頭 (あたま) - head', '頭痛 (ずつう) - headache'] },
            { kanji: '首', meaning: 'neck', onyomi: 'しゅ', kunyomi: 'くび', strokes: 9, examples: ['首 (くび) - neck', '首都 (しゅと) - capital city'] },
            { kanji: '顔', meaning: 'face', onyomi: 'がん', kunyomi: 'かお', strokes: 18, examples: ['顔 (かお) - face', '笑顔 (えがお) - smiling face'] },
            { kanji: '心', meaning: 'heart, mind', onyomi: 'しん', kunyomi: 'こころ', strokes: 4, examples: ['心 (こころ) - heart', '安心 (あんしん) - relief'] },
            { kanji: '力', meaning: 'power, force', onyomi: 'りょく, りき', kunyomi: 'ちから', strokes: 2, examples: ['力 (ちから) - strength', '能力 (のうりょく) - ability'] },
            { kanji: '目', meaning: 'eye', onyomi: 'もく', kunyomi: 'め', strokes: 5, examples: ['目 (め) - eye', '目的 (もくてき) - purpose'] },
            { kanji: '耳', meaning: 'ear', onyomi: 'じ', kunyomi: 'みみ', strokes: 6, examples: ['耳 (みみ) - ear', '耳鼻科 (じびか) - ENT department'] },
            { kanji: '口', meaning: 'mouth', onyomi: 'こう, く', kunyomi: 'くち', strokes: 3, examples: ['口 (くち) - mouth', '人口 (じんこう) - population'] },
            { kanji: '手', meaning: 'hand', onyomi: 'しゅ', kunyomi: 'て', strokes: 4, examples: ['手 (て) - hand', '手紙 (てがみ) - letter'] },
            { kanji: '足', meaning: 'foot, to add', onyomi: 'そく', kunyomi: 'あし, た(りる), た(す)', strokes: 7, examples: ['足 (あし) - foot', '足りる (たりる) - to be enough'] },
            { kanji: '医', meaning: 'medicine', onyomi: 'い', kunyomi: '', strokes: 7, examples: ['医者 (いしゃ) - doctor', '医学 (いがく) - medical science'] },
            { kanji: '元', meaning: 'origin, reason', onyomi: 'げん, がん', kunyomi: 'もと', strokes: 4, examples: ['元気 (げんき) - healthy', '元日 (がんじつ) - New Year’s Day'] },
            { kanji: '病', meaning: 'illness', onyomi: 'びょう', kunyomi: 'や(む), やまい', strokes: 10, examples: ['病気 (びょうき) - illness', '病院 (びょういん) - hospital'] },
            { kanji: '薬', meaning: 'medicine', onyomi: 'やく', kunyomi: 'くすり', strokes: 16, examples: ['薬 (くすり) - medicine', '薬局 (やっきょく) - pharmacy'] },
        ],
        n3: [
            { kanji: '医', meaning: 'doctor, medicine', onyomi: 'い', kunyomi: '', strokes: 7, examples: ['医者 (いしゃ) - doctor', '医学 (いがく) - medical science'] },
            { kanji: '器', meaning: 'utensil', onyomi: 'き', kunyomi: 'うつわ', strokes: 15, examples: ['器具 (きぐ) - tools', '食器 (しょっき) - tableware'] },
            // Add more N3 kanji...
        ],
        n2: [
            { kanji: '認', meaning: 'recognize, approve', onyomi: 'にん', kunyomi: 'みと', strokes: 14, examples: ['確認 (かくにん) - confirmation', '認める (みとめる) - to recognize'] },
            { kanji: '護', meaning: 'protect', onyomi: 'ご', kunyomi: 'まも', strokes: 20, examples: ['保護 (ほご) - protection', '護る (まもる) - to protect'] },
            // Add more N2 kanji...
        ],
        n1: [
            { kanji: '鬱', meaning: 'depression', onyomi: 'うつ', kunyomi: '', strokes: 29, examples: ['鬱病 (うつびょう) - depression', '憂鬱 (ゆううつ) - melancholy'] },
            { kanji: '響', meaning: 'echo, sound', onyomi: 'きょう', kunyomi: 'ひび', strokes: 20, examples: ['影響 (えいきょう) - influence', '響く (ひびく) - to resonate'] },
            // Add more N1 kanji...
        ],
        common: [
            { kanji: '桜', meaning: 'cherry blossom', onyomi: 'おう', kunyomi: 'さくら', strokes: 10, examples: ['桜 (さくら) - cherry blossom', '桜色 (さくらいろ) - cherry blossom color'] },
            // Add more common kanji...
        ]
    };

    const levelColors = {
        n5: 'bg-blue-100 text-blue-800',
        n4: 'bg-green-100 text-green-800',
        n3: 'bg-purple-100 text-purple-800',
        n2: 'bg-orange-100 text-orange-800',
        n1: 'bg-red-100 text-red-800',
        common: 'bg-amber-100 text-amber-800'
    };

    // Get current kanji data safely
    const currentData = useMemo(() => (
        Array.isArray(kanjiData[jlptLevel]) ? kanjiData[jlptLevel] : []
    ), [jlptLevel]);

    // Filter data based on study mode
    const filteredData = useCallback(() => {
        if (!currentData.length) return [];
        if (studyMode === 'all') return currentData;

        if (quizSettings.difficulty === 'easy') {
            return currentData.filter(item => item.strokes <= 5);
        } else if (quizSettings.difficulty === 'hard') {
            return currentData.filter(item => item.strokes > 5);
        }
        return currentData;
    }, [currentData, studyMode, quizSettings.difficulty]);

    // Fisher-Yates shuffle
    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const shuffledData = useCallback(() => {
        const data = filteredData();
        return shuffle ? shuffleArray(data) : data;
    }, [filteredData, shuffle]);

    const [currentShuffledData, setCurrentShuffledData] = useState(() => shuffledData());

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
        if (quizMode === 'typing' || quizMode === 'multipleChoice') {
            setIsCorrect(false);
            setQuestionsAnswered(prev => prev + 1);
            setStreak(0);
            setTimeout(() => nextCard(), 1500);
        }
    };

    // Reset quiz and reshuffle when dependencies change
    useEffect(() => {
        setCurrentShuffledData(shuffledData());
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
        setShowStrokeOrder(false);
        setQuizCompleted(false);
    }, [jlptLevel, quizMode, studyMode, shuffle, shuffledData]);

    // Generate multiple choice options
    const generateOptions = useCallback((type = 'meaning') => {
        if (!currentShuffledData.length || currentCard >= currentShuffledData.length) return [];

        const currentKanji = currentShuffledData[currentCard];
        if (!currentKanji) return [];

        let correctAnswer;
        if (type === 'meaning') {
            correctAnswer = currentKanji.meaning;
        } else if (type === 'onyomi') {
            correctAnswer = currentKanji.onyomi;
        } else {
            correctAnswer = currentKanji.kunyomi;
        }

        let options = [correctAnswer];

        // Get 3 random incorrect options
        let attempts = 0;
        while (options.length < 4 && attempts < 20) {
            const randomIndex = Math.floor(Math.random() * currentShuffledData.length);
            let randomOption;
            if (type === 'meaning') {
                randomOption = currentShuffledData[randomIndex].meaning;
            } else if (type === 'onyomi') {
                randomOption = currentShuffledData[randomIndex].onyomi;
            } else {
                randomOption = currentShuffledData[randomIndex].kunyomi;
            }
            if (
                randomOption &&
                !options.includes(randomOption) &&
                randomOption !== ''
            ) {
                options.push(randomOption);
            }
            attempts++;
        }

        // If not enough unique options, fill with empty string
        while (options.length < 4) {
            options.push('');
        }

        return shuffleArray(options);
    }, [currentCard, currentShuffledData]);

    const [meaningOptions, setMeaningOptions] = useState(() => generateOptions('meaning'));
    const [onyomiOptions, setOnyomiOptions] = useState(() => generateOptions('onyomi'));
    const [kunyomiOptions, setKunyomiOptions] = useState(() => generateOptions('kunyomi'));

    // Reset options when card changes
    useEffect(() => {
        if (!quizStarted) return;

        // Randomly select question type for this card
        const availableTypes = quizSettings.questionTypes.filter(type => {
            if (type === 'onyomi') {
                return currentShuffledData[currentCard]?.onyomi !== '';
            }
            if (type === 'kunyomi') {
                return currentShuffledData[currentCard]?.kunyomi !== '';
            }
            return true;
        });

        if (availableTypes.length > 0) {
            const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            setCurrentQuestionType(randomType);
        }

        setMeaningOptions(generateOptions('meaning'));
        setOnyomiOptions(generateOptions('onyomi'));
        setKunyomiOptions(generateOptions('kunyomi'));
        setIsCorrect(null);
        setIsAnswerChecked(false);
        setSelectedOptions([]);
        setUserInput('');
        setShowStrokeOrder(false);
    }, [currentCard, generateOptions, quizStarted, currentShuffledData, quizSettings.questionTypes]);

    const nextCard = useCallback(() => {
        if (!currentShuffledData.length) return;

        // Reset question timer
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        if (quizSettings.timePerQuestion > 0) {
            setTimeLeft(quizSettings.timePerQuestion);
        }

        // Check if quiz is completed
        if (questionsAnswered >= quizSettings.questionCount) {
            setIsTimerRunning(false);
            if (questionTimerRef.current) clearInterval(questionTimerRef.current);
            setQuizCompleted(true);
            return;
        }

        setShowAnswer(false);
        setIsCorrect(null);
        setIsAnswerChecked(false);
        setUserInput('');
        setSelectedOptions([]);
        setShowStrokeOrder(false);

        setCurrentCard(prev => {
            if (prev < currentShuffledData.length - 1) {
                return prev + 1;
            }
            return 0;
        });
    }, [currentShuffledData.length, quizSettings.questionCount, quizSettings.timePerQuestion, questionsAnswered]);

    const prevCard = useCallback(() => {
        if (!currentShuffledData.length) return;

        // Reset question timer
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        if (quizSettings.timePerQuestion > 0) {
            setTimeLeft(quizSettings.timePerQuestion);
        }

        setShowAnswer(false);
        setIsCorrect(null);
        setIsAnswerChecked(false);
        setUserInput('');
        setSelectedOptions([]);
        setShowStrokeOrder(false);

        setCurrentCard(prev => {
            if (prev > 0) {
                return prev - 1;
            }
            return currentShuffledData.length - 1;
        });
    }, [currentShuffledData.length, quizSettings.timePerQuestion]);

    const toggleAnswer = () => {
        setShowAnswer((prev) => !prev);
    };

    const checkTypingAnswer = useCallback(() => {
        if (!userInput || !currentShuffledData[currentCard] || isAnswerChecked) return;

        let correct;
        if (currentQuestionType === 'meaning') {
            correct = userInput.trim().toLowerCase() === currentShuffledData[currentCard].meaning.toLowerCase();
        } else if (currentQuestionType === 'onyomi') {
            correct = userInput.trim().toLowerCase() === currentShuffledData[currentCard].onyomi.toLowerCase();
        } else {
            correct = userInput.trim().toLowerCase() === currentShuffledData[currentCard].kunyomi.toLowerCase();
        }

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

        // Move to next question after delay
        setTimeout(() => nextCard(), 1500);
    }, [currentCard, currentQuestionType, currentShuffledData, isAnswerChecked, maxStreak, nextCard, userInput]);

    const checkMultipleChoiceAnswer = useCallback((selectedOption, type) => {
        if (!currentShuffledData[currentCard] || selectedOptions.includes(selectedOption) || isAnswerChecked) return;

        let correct;
        if (type === 'meaning') {
            correct = selectedOption === currentShuffledData[currentCard].meaning;
        } else if (type === 'onyomi') {
            correct = selectedOption === currentShuffledData[currentCard].onyomi;
        } else {
            correct = selectedOption === currentShuffledData[currentCard].kunyomi;
        }

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

        // Move to next question after delay
        setTimeout(() => nextCard(), 1500);
    }, [currentCard, currentShuffledData, maxStreak, selectedOptions, isAnswerChecked, nextCard]);

    const resetQuiz = useCallback(() => {
        setCurrentShuffledData(shuffledData());
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
        setShowStrokeOrder(false);
        setQuizCompleted(false);
        setQuizStarted(false);
        setQuizMode(null);
    }, [shuffledData]);

    const startQuiz = (mode) => {
        console.log('[DEBUG] startQuiz called with mode:', mode);
        setQuizMode(mode);
        setQuizStarted(true);
        setIsTimerRunning(true);
        setCurrentShuffledData(shuffledData());
        setCurrentCard(0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            checkTypingAnswer();
        }
    };

    const accuracy = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

    // Stroke order animation placeholder
    const renderStrokeOrder = () => {
        return (
            <div className="relative w-full h-48 bg-stone-100 rounded-lg flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl text-stone-300">{currentShuffledData[currentCard]?.kanji}</span>
                </div>
                <div className="relative z-10 text-center">
                    <div className="text-stone-600 mb-2">Stroke Order Animation</div>
                    <div className="text-sm text-stone-500">(Would show animated strokes in a real implementation)</div>
                </div>
            </div>
        );
    };

    // Quiz setup screen
    if (!quizMode) {
        return (
            <div className="min-h-screen bg-stone-50 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                                Kanji Practice
                            </h1>
                            <p className="text-stone-600">
                                Customize your kanji practice session
                            </p>
                        </div>
                    </div>

                    {/* JLPT Level Selector */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-stone-200">
                        <h2 className="text-xl font-bold text-stone-800 mb-4">Select JLPT Level</h2>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {['n5', 'n4', 'n3', 'n2', 'n1', 'common'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setJlptLevel(level)}
                                    className={`p-3 rounded-lg font-medium ${levelColors[level]} ${jlptLevel === level ? 'ring-2 ring-offset-2 ring-amber-500' : ''}`}
                                >
                                    {level.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quiz Type Selector */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-stone-200">
                        <h2 className="text-xl font-bold text-stone-800 mb-4">Practice Mode</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button
                                onClick={() => setQuizMode('flashcards')}
                                className={`p-4 rounded-lg font-medium flex flex-col items-center ${quizMode === 'flashcards' ? 'bg-amber-600 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
                            >
                                <span className="text-2xl mb-1">📖</span>
                                Flashcards
                            </button>
                            <button
                                onClick={() => setQuizMode('multipleChoice')}
                                className={`p-4 rounded-lg font-medium flex flex-col items-center ${quizMode === 'multipleChoice' ? 'bg-amber-600 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
                            >
                                <span className="text-2xl mb-1">🔘</span>
                                Multiple Choice
                            </button>
                            <button
                                onClick={() => setQuizMode('typing')}
                                className={`p-4 rounded-lg font-medium flex flex-col items-center ${quizMode === 'typing' ? 'bg-amber-600 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
                            >
                                <span className="text-2xl mb-1">⌨️</span>
                                Typing Quiz
                            </button>
                            <button
                                onClick={() => setQuizMode('writing')}
                                className={`p-4 rounded-lg font-medium flex flex-col items-center ${quizMode === 'writing' ? 'bg-amber-600 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
                            >
                                <span className="text-2xl mb-1">✍️</span>
                                Writing Practice
                            </button>
                        </div>
                    </div>

                    {/* Quiz Settings */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-stone-200">
                        <h2 className="text-xl font-bold text-stone-800 mb-4">Quiz Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Number of Questions</label>
                                <select
                                    value={quizSettings.questionCount}
                                    onChange={(e) => setQuizSettings({ ...quizSettings, questionCount: parseInt(e.target.value) })}
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
                                    onChange={(e) => setQuizSettings({ ...quizSettings, timePerQuestion: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-stone-300 rounded-lg"
                                >
                                    <option value="0">No time limit</option>
                                    <option value="10">10 seconds</option>
                                    <option value="15">15 seconds</option>
                                    <option value="20">20 seconds</option>
                                    <option value="30">30 seconds</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Question Types</label>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={quizSettings.questionTypes.includes('meaning')}
                                            onChange={() => {
                                                const newTypes = quizSettings.questionTypes.includes('meaning')
                                                    ? quizSettings.questionTypes.filter(t => t !== 'meaning')
                                                    : [...quizSettings.questionTypes, 'meaning'];
                                                setQuizSettings({ ...quizSettings, questionTypes: newTypes });
                                            }}
                                            className="h-5 w-5 text-amber-600 rounded"
                                        />
                                        <span className="text-stone-700">Meaning</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={quizSettings.questionTypes.includes('onyomi')}
                                            onChange={() => {
                                                const newTypes = quizSettings.questionTypes.includes('onyomi')
                                                    ? quizSettings.questionTypes.filter(t => t !== 'onyomi')
                                                    : [...quizSettings.questionTypes, 'onyomi'];
                                                setQuizSettings({ ...quizSettings, questionTypes: newTypes });
                                            }}
                                            className="h-5 w-5 text-amber-600 rounded"
                                        />
                                        <span className="text-stone-700">On'yomi Reading</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={quizSettings.questionTypes.includes('kunyomi')}
                                            onChange={() => {
                                                const newTypes = quizSettings.questionTypes.includes('kunyomi')
                                                    ? quizSettings.questionTypes.filter(t => t !== 'kunyomi')
                                                    : [...quizSettings.questionTypes, 'kunyomi'];
                                                setQuizSettings({ ...quizSettings, questionTypes: newTypes });
                                            }}
                                            className="h-5 w-5 text-amber-600 rounded"
                                        />
                                        <span className="text-stone-700">Kun'yomi Reading</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Difficulty</label>
                                <select
                                    value={quizSettings.difficulty}
                                    onChange={(e) => setQuizSettings({ ...quizSettings, difficulty: e.target.value })}
                                    className="w-full p-2 border border-stone-300 rounded-lg"
                                >
                                    <option value="mixed">Mixed Difficulty</option>
                                    <option value="easy">Easy (1-5 strokes)</option>
                                    <option value="hard">Hard (6+ strokes)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="text-center">
                        <button
                            onClick={() => startQuiz('multipleChoice')}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-transform"
                        >
                            Start Practice Session
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz completed screen
    if (quizCompleted) {
        return (
            <div className="min-h-screen bg-stone-50 p-4 md:p-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
                    <h1 className="text-3xl font-bold text-stone-800 mb-6">Quiz Completed!</h1>

                    <div className="bg-amber-50 rounded-xl p-6 mb-8 border border-amber-100">
                        <h2 className="text-2xl font-bold text-amber-700 mb-4">Your Results</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="text-sm text-stone-500">Score</div>
                                <div className="text-3xl font-bold">{score}/{quizSettings.questionCount}</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="text-sm text-stone-500">Accuracy</div>
                                <div className="text-3xl font-bold">{accuracy}%</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="text-sm text-stone-500">Time</div>
                                <div className="text-3xl font-bold">
                                    {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="text-sm text-stone-500">Max Streak</div>
                                <div className="text-3xl font-bold">{maxStreak}</div>
                            </div>
                        </div>

                        <div className="w-full bg-stone-200 rounded-full h-4 mb-2">
                            <div
                                className="bg-amber-600 h-4 rounded-full"
                                style={{ width: `${accuracy}%` }}
                            ></div>
                        </div>
                        <div className="text-sm text-stone-600">You answered {accuracy}% correctly</div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={resetQuiz}
                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-3 rounded-lg font-medium"
                        >
                            Change Settings
                        </button>
                        <button
                            onClick={() => {
                                setQuizCompleted(false);
                                setQuizStarted(false);
                                startQuiz(quizMode);
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main quiz interface
    return (
        <div className="min-h-screen bg-stone-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={resetQuiz}
                        className="flex items-center text-stone-600 hover:text-stone-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Settings
                    </button>
                    <div className="text-stone-700 font-medium">
                        <span className="hidden sm:inline">Time:</span> {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                        {quizSettings.timePerQuestion > 0 && (
                            <span className="ml-4 text-amber-600">
                                <span className="hidden sm:inline">Question Time:</span> {timeLeft}s
                            </span>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-stone-600 mb-1">
                        <span>Question {questionsAnswered + 1} of {quizSettings.questionCount}</span>
                        <span>{score} Correct ({accuracy}%)</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-3">
                        <div
                            className="bg-amber-600 h-3 rounded-full"
                            style={{ width: `${((questionsAnswered) / quizSettings.questionCount) * 100}%` }}
                        ></div>
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
                            <div className="text-sm text-stone-500">Streak</div>
                            <div className="text-xl font-bold">{streak} 🔥</div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-stone-500">Current Kanji</div>
                        <div className={`text-xl font-bold ${levelColors[jlptLevel]} px-2 py-1 rounded`}>
                            {jlptLevel.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Quiz Area */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-stone-200">
                    {currentShuffledData.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-stone-600">No kanji match your current filters.</p>
                            <button
                                onClick={resetQuiz}
                                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
                            >
                                Change Settings
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Flashcards Mode */}
                            {quizMode === 'flashcards' && (
                                <div className="text-center">
                                    <div
                                        className={`text-9xl font-bold mb-8 cursor-pointer ${showAnswer ? 'text-stone-600' : 'text-amber-600'}`}
                                        onClick={toggleAnswer}
                                    >
                                        {showAnswer ? (
                                            <div className="space-y-4">
                                                <div className="text-5xl">{currentShuffledData[currentCard].kanji}</div>
                                                <div className="text-2xl">{currentShuffledData[currentCard].meaning}</div>
                                                <div className="text-xl">
                                                    <span className="text-blue-600">On: {currentShuffledData[currentCard].onyomi}</span>
                                                    {currentShuffledData[currentCard].kunyomi && currentShuffledData[currentCard].kunyomi !== '' && (
                                                        <span className="ml-4 text-purple-600">Kun: {currentShuffledData[currentCard].kunyomi}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            currentShuffledData[currentCard].kanji
                                        )}
                                    </div>

                                    <div className="flex justify-center space-x-4">
                                        <button
                                            onClick={prevCard}
                                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2 rounded-lg font-medium"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={toggleAnswer}
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

                                    {showAnswer && (
                                        <div className="mt-8 text-left">
                                            <h4 className="font-bold text-stone-800 mb-2">Example Words:</h4>
                                            <ul className="space-y-1 text-stone-700">
                                                {currentShuffledData[currentCard].examples.map((example, i) => (
                                                    <li key={i} className="flex">
                                                        <span className="text-amber-600 mr-2">•</span>
                                                        {example}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                onClick={() => setShowStrokeOrder(!showStrokeOrder)}
                                                className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                                            >
                                                {showStrokeOrder ? 'Hide Stroke Order' : 'Show Stroke Order'}
                                            </button>
                                            {showStrokeOrder && renderStrokeOrder()}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Multiple Choice Mode */}
                            {quizMode === 'multipleChoice' && (
                                <div className="text-center">
                                    <div className="text-9xl font-bold mb-8 text-amber-600">
                                        {currentShuffledData[currentCard].kanji}
                                    </div>

                                    <div className="mb-6">
                                        <div className="inline-flex rounded-md shadow-sm">
                                            <button
                                                className={`px-4 py-2 text-sm font-medium rounded-l-lg bg-amber-600 text-white`}
                                            >
                                                {currentQuestionType === 'meaning' ? 'Meaning' :
                                                    currentQuestionType === 'onyomi' ? 'On\'yomi Reading' : 'Kun\'yomi Reading'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                                        {(currentQuestionType === 'meaning' ? meaningOptions :
                                            currentQuestionType === 'onyomi' ? onyomiOptions : kunyomiOptions
                                        ).map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => checkMultipleChoiceAnswer(option, currentQuestionType)}
                                                disabled={isAnswerChecked && selectedOptions.includes(option)}
                                                className={`p-3 rounded-lg font-medium ${isAnswerChecked
                                                    ? option === (
                                                        currentQuestionType === 'meaning'
                                                            ? currentShuffledData[currentCard].meaning
                                                            : currentQuestionType === 'onyomi'
                                                                ? currentShuffledData[currentCard].onyomi
                                                                : currentShuffledData[currentCard].kunyomi
                                                    )
                                                        ? 'bg-green-500 text-white'
                                                        : selectedOptions.includes(option)
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                                                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                                                    }`}
                                            >
                                                {option || 'N/A'}
                                            </button>
                                        ))}
                                    </div>
                                    {isCorrect !== null && (
                                        <div className={`mt-6 p-3 rounded-lg font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {isCorrect ? 'Correct! 🎉' : 'Incorrect 😢'}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Typing Mode */}
                            {quizMode === 'typing' && (
                                <div className="text-center">
                                    <div className="text-9xl font-bold mb-8 text-amber-600">
                                        {currentShuffledData[currentCard].kanji}
                                    </div>

                                    <div className="mb-6">
                                        <div className="inline-flex rounded-md shadow-sm">
                                            <button
                                                className={`px-4 py-2 text-sm font-medium rounded-l-lg bg-amber-600 text-white`}
                                            >
                                                {currentQuestionType === 'meaning' ? 'Meaning' :
                                                    currentQuestionType === 'onyomi' ? 'On\'yomi Reading' : 'Kun\'yomi Reading'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="max-w-md mx-auto">
                                        <input
                                            type="text"
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={isAnswerChecked}
                                            className="w-full p-3 border border-stone-300 rounded-lg text-center text-lg mb-4"
                                            placeholder={`Type the ${currentQuestionType === 'meaning' ? 'meaning' : 'reading'} here`}
                                        />
                                        <button
                                            onClick={checkTypingAnswer}
                                            disabled={!userInput || isAnswerChecked}
                                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium"
                                        >
                                            Check Answer
                                        </button>
                                    </div>

                                    {isCorrect !== null && (
                                        <div className={`mt-6 p-3 rounded-lg font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {isCorrect ? 'Correct! 🎉' : `Incorrect 😢 The answer was: ${currentQuestionType === 'meaning' ? currentShuffledData[currentCard].meaning :
                                                    currentQuestionType === 'onyomi' ? currentShuffledData[currentCard].onyomi :
                                                        currentShuffledData[currentCard].kunyomi
                                                }`}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Writing Practice Mode */}
                            {quizMode === 'writing' && (
                                <div className="text-center">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-xl font-bold text-stone-700">
                                            {currentShuffledData[currentCard].kanji}
                                        </div>
                                        <button
                                            onClick={() => setShowStrokeOrder(!showStrokeOrder)}
                                            className="text-amber-600 hover:text-amber-700 font-medium"
                                        >
                                            {showStrokeOrder ? 'Hide Stroke Order' : 'Show Stroke Order'}
                                        </button>
                                    </div>

                                    {showStrokeOrder ? (
                                        renderStrokeOrder()
                                    ) : (
                                        <div className="relative w-full h-64 bg-stone-100 rounded-lg mb-6">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-9xl text-stone-300 opacity-50">{currentShuffledData[currentCard].kanji}</span>
                                            </div>
                                            {/* Drawing canvas would go here */}
                                            <div className="relative z-10 h-full flex items-center justify-center">
                                                <div className="text-stone-500">Drawing area (would be implemented with a canvas)</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-left space-y-4">
                                        <div>
                                            <h4 className="font-bold text-stone-800">Meaning:</h4>
                                            <p className="text-stone-700">{currentShuffledData[currentCard].meaning}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-stone-800">Readings:</h4>
                                            <p className="text-stone-700">
                                                <span className="text-blue-600">On: {currentShuffledData[currentCard].onyomi || 'N/A'}</span>
                                                {currentShuffledData[currentCard].kunyomi && currentShuffledData[currentCard].kunyomi !== '' && (
                                                    <span className="ml-4 text-purple-600">Kun: {currentShuffledData[currentCard].kunyomi}</span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-stone-800">Stroke Count:</h4>
                                            <p className="text-stone-700">{currentShuffledData[currentCard].strokes}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-stone-800">Example Words:</h4>
                                            <ul className="space-y-1 text-stone-700">
                                                {currentShuffledData[currentCard].examples.map((example, i) => (
                                                    <li key={i} className="flex">
                                                        <span className="text-amber-600 mr-2">•</span>
                                                        {example}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex justify-center space-x-4 mt-8">
                                        <button
                                            onClick={prevCard}
                                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2 rounded-lg font-medium"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={nextCard}
                                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
                                        >
                                            Next Kanji
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticeKanji;