import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LearnKanji = () => {
    const navigate = useNavigate();
    const [activeLevel, setActiveLevel] = useState('n5');
    const [selectedKanji, setSelectedKanji] = useState(null);
    const [practiceMode, setPracticeMode] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [streak, setStreak] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [quizType, setQuizType] = useState('meaning'); // 'meaning', 'reading', or 'writing'
    const [studyMode, setStudyMode] = useState('grid'); // 'grid' or 'list'
    const [searchTerm, setSearchTerm] = useState('');

    // JLPT Level Data
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
        n5: 'bg-amber-100 text-amber-800',
        n4: 'bg-blue-100 text-blue-800',
        n3: 'bg-green-100 text-green-800',
        n2: 'bg-purple-100 text-purple-800',
        n1: 'bg-red-100 text-red-800',
        common: 'bg-stone-100 text-stone-800'
    };

    const startPractice = (type = 'meaning') => {
        setPracticeMode(true);
        setQuizType(type);
        generateQuestion(type);
        setStreak(0);
        setFeedback(null);
        setUserAnswer('');
    };

    const generateQuestion = (type) => {
        const data = kanjiData[activeLevel];
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentQuestion(data[randomIndex]);
        setUserAnswer('');
        setFeedback(null);
        setShowHint(false);
    };

    const checkAnswer = () => {
        if (!userAnswer) return;

        let isCorrect = false;

        if (quizType === 'meaning') {
            isCorrect = userAnswer.toLowerCase() === currentQuestion.meaning.toLowerCase();
        } else if (quizType === 'reading') {
            // Check both onyomi and kunyomi
            isCorrect = userAnswer.toLowerCase() === currentQuestion.onyomi.toLowerCase() ||
                userAnswer.toLowerCase() === currentQuestion.kunyomi.toLowerCase();
        } else if (quizType === 'writing') {
            isCorrect = userAnswer === currentQuestion.kanji;
        }

        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            setStreak(streak + 1);
            setTimeout(() => {
                generateQuestion(quizType);
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

    const getQuestionPrompt = () => {
        if (!currentQuestion) return '';

        if (quizType === 'meaning') {
            return `What does ${currentQuestion.kanji} mean?`;
        } else if (quizType === 'reading') {
            return `How do you read ${currentQuestion.kanji}?`;
        } else if (quizType === 'writing') {
            return `Write the kanji for "${currentQuestion.meaning}":`;
        }
    };

    const getCorrectAnswer = () => {
        if (!currentQuestion) return '';

        if (quizType === 'meaning') {
            return currentQuestion.meaning;
        } else if (quizType === 'reading') {
            return `${currentQuestion.onyomi} (on) / ${currentQuestion.kunyomi} (kun)`;
        } else if (quizType === 'writing') {
            return currentQuestion.kanji;
        }
    };

    const filteredKanji = kanjiData[activeLevel].filter(kanji =>
        kanji.kanji.includes(searchTerm) ||
        kanji.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kanji.onyomi.includes(searchTerm) ||
        kanji.kunyomi.includes(searchTerm)
    )

    useEffect(() => {
        if (practiceMode && currentQuestion) {
            const timer = setTimeout(() => {
                if (!feedback) setShowHint(true);
            }, 5000);
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
                            Learn Kanji
                        </h1>
                        <p className="text-stone-600">
                            Master Japanese kanji characters by JLPT level
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                        <button
                            onClick={() => setActiveLevel('n5')}
                            className={`px-4 py-2 rounded-lg font-medium ${activeLevel === 'n5' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'}`}
                        >
                            N5
                        </button>
                        <button
                            onClick={() => setActiveLevel('n4')}
                            className={`px-4 py-2 rounded-lg font-medium ${activeLevel === 'n4' ? 'bg-blue-600 text-white' : 'bg-stone-200 text-stone-700'}`}
                        >
                            N4
                        </button>
                        <button
                            onClick={() => setActiveLevel('n3')}
                            className={`px-4 py-2 rounded-lg font-medium ${activeLevel === 'n3' ? 'bg-green-600 text-white' : 'bg-stone-200 text-stone-700'}`}
                        >
                            N3
                        </button>
                        <button
                            onClick={() => setActiveLevel('n2')}
                            className={`px-4 py-2 rounded-lg font-medium ${activeLevel === 'n2' ? 'bg-purple-600 text-white' : 'bg-stone-200 text-stone-700'}`}
                        >
                            N2
                        </button>
                        <button
                            onClick={() => setActiveLevel('n1')}
                            className={`px-4 py-2 rounded-lg font-medium ${activeLevel === 'n1' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-700'}`}
                        >
                            N1
                        </button>
                        <button
                            onClick={() => setActiveLevel('common')}
                            className={`px-4 py-2 rounded-lg font-medium ${activeLevel === 'common' ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'}`}
                        >
                            Common
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search kanji by character, meaning, or reading..."
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Practice Mode */}
                {practiceMode ? (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-stone-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-stone-800">
                                Practice Mode - {quizType.charAt(0).toUpperCase() + quizType.slice(1)}
                            </h2>
                            <div className="flex items-center">
                                <span className="text-amber-600 font-bold mr-2">Streak:</span>
                                <span className="text-xl font-bold text-stone-800">{streak}</span>
                            </div>
                        </div>

                        {currentQuestion && (
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-4 text-stone-700">
                                    {getQuestionPrompt()}
                                </div>

                                {quizType !== 'writing' && (
                                    <div className="text-9xl font-bold mb-8 text-stone-800">
                                        {currentQuestion.kanji}
                                    </div>
                                )}

                                <div className="max-w-md mx-auto">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder={
                                                quizType === 'meaning' ? 'Type the meaning...' :
                                                    quizType === 'reading' ? 'Type the reading...' :
                                                        'Draw/write the kanji...'
                                            }
                                            className={`w-full px-4 py-3 rounded-lg border-2 text-lg ${feedback === 'correct' ? 'border-green-500 bg-green-50' : feedback === 'incorrect' ? 'border-red-500 bg-red-50' : 'border-stone-300'}`}
                                            autoFocus
                                        />
                                        {showHint && !feedback && (
                                            <div className="absolute top-full left-0 w-full mt-2 text-sm text-stone-500">
                                                {quizType === 'meaning' ? (
                                                    `Starts with: ${currentQuestion.meaning.charAt(0).toUpperCase()}`
                                                ) : quizType === 'reading' ? (
                                                    `Onyomi starts with: ${currentQuestion.onyomi.charAt(0)}`
                                                ) : (
                                                    `Stroke count: ${currentQuestion.strokes}`
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        {feedback === 'correct' && (
                                            <div className="text-green-600 font-medium">✓ Correct! Well done!</div>
                                        )}
                                        {feedback === 'incorrect' && (
                                            <div className="text-red-600 font-medium">
                                                ✗ Incorrect. The answer is: {getCorrectAnswer()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                                        <button
                                            onClick={checkAnswer}
                                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
                                        >
                                            Check
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPracticeMode(false);
                                                setSelectedKanji(null);
                                            }}
                                            className="border border-stone-300 hover:bg-stone-100 text-stone-700 px-6 py-2 rounded-lg font-medium"
                                        >
                                            Exit Practice
                                        </button>
                                        <button
                                            onClick={() => generateQuestion(quizType)}
                                            className="border border-stone-300 hover:bg-stone-100 text-stone-700 px-6 py-2 rounded-lg font-medium"
                                        >
                                            Skip
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mb-8 flex flex-wrap gap-4">
                        <button
                            onClick={() => startPractice('meaning')}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                        >
                            Practice Meanings
                        </button>
                        <button
                            onClick={() => startPractice('reading')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                        >
                            Practice Readings
                        </button>
                        <button
                            onClick={() => startPractice('writing')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                        >
                            Practice Writing
                        </button>
                        <div className="flex items-center ml-auto">
                            <button
                                onClick={() => setStudyMode('grid')}
                                className={`px-4 py-2 rounded-l-lg ${studyMode === 'grid' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-700'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setStudyMode('list')}
                                className={`px-4 py-2 rounded-r-lg ${studyMode === 'list' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-700'}`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                )}

                {/* Kanji Display */}
                {studyMode === 'grid' ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-stone-200">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2 p-2">
                            {filteredKanji.map((kanji, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedKanji(kanji)}
                                    className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${levelColors[activeLevel]} ${selectedKanji?.kanji === kanji.kanji ? 'ring-2 ring-amber-500 scale-105' : 'hover:bg-opacity-80'}`}
                                >
                                    <span className="text-2xl font-bold">{kanji.kanji}</span>
                                    <span className="text-xs opacity-80">{kanji.meaning}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-stone-200">
                        <table className="w-full">
                            <thead className="bg-stone-100">
                                <tr>
                                    <th className="p-3 text-left">Kanji</th>
                                    <th className="p-3 text-left">Meaning</th>
                                    <th className="p-3 text-left">Onyomi</th>
                                    <th className="p-3 text-left">Kunyomi</th>
                                    <th className="p-3 text-left">Strokes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredKanji.map((kanji, index) => (
                                    <tr
                                        key={index}
                                        className={`border-t border-stone-200 hover:bg-stone-50 cursor-pointer ${selectedKanji?.kanji === kanji.kanji ? 'bg-amber-50' : ''}`}
                                        onClick={() => setSelectedKanji(kanji)}
                                    >
                                        <td className="p-3 font-bold text-xl">{kanji.kanji}</td>
                                        <td className="p-3">{kanji.meaning}</td>
                                        <td className="p-3">{kanji.onyomi}</td>
                                        <td className="p-3">{kanji.kunyomi}</td>
                                        <td className="p-3">{kanji.strokes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Selected Kanji Details */}
                {selectedKanji && !practiceMode && (
                    <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-stone-200">
                        <div className="flex flex-col md:flex-row items-start">
                            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                                <div className={`w-32 h-32 flex items-center justify-center rounded-full ${levelColors[activeLevel]} text-8xl font-bold`}>
                                    {selectedKanji.kanji}
                                </div>
                                <div className="mt-4 text-center text-sm text-stone-600">
                                    {selectedKanji.strokes} strokes
                                </div>
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-stone-800 mb-2">
                                    {selectedKanji.meaning}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <h4 className="font-bold text-stone-700 mb-1">Onyomi (Chinese Reading)</h4>
                                        <div className="bg-stone-100 rounded-lg p-3">
                                            {selectedKanji.onyomi || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-700 mb-1">Kunyomi (Japanese Reading)</h4>
                                        <div className="bg-stone-100 rounded-lg p-3">
                                            {selectedKanji.kunyomi || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-bold text-stone-700 mb-2">Example Words</h4>
                                    <div className="space-y-2">
                                        {selectedKanji.examples.map((example, index) => (
                                            <div key={index} className="bg-stone-50 rounded-lg p-3">
                                                <div className="font-bold">{example.split(' - ')[0]}</div>
                                                <div className="text-stone-600">{example.split(' - ')[1]}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => {
                                            setPracticeMode(true);
                                            setQuizType('meaning');
                                            setCurrentQuestion(selectedKanji);
                                            setStreak(0);
                                        }}
                                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium"
                                    >
                                        Practice Meaning
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPracticeMode(true);
                                            setQuizType('reading');
                                            setCurrentQuestion(selectedKanji);
                                            setStreak(0);
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                                    >
                                        Practice Reading
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPracticeMode(true);
                                            setQuizType('writing');
                                            setCurrentQuestion(selectedKanji);
                                            setStreak(0);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                                    >
                                        Practice Writing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Learning Tips */}
                <div className="mt-8 bg-amber-50 rounded-xl shadow-sm p-6 border border-amber-100">
                    <h3 className="text-xl font-bold text-stone-800 mb-3">Kanji Learning Tips</h3>
                    <ul className="space-y-3 text-stone-700">
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            Learn kanji in context with vocabulary words, not just in isolation
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            Study radicals (components) to help remember complex kanji
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            Practice writing kanji while saying the meaning and readings out loud
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            Use spaced repetition to review kanji at optimal intervals
                        </li>
                        <li className="flex items-start">
                            <span className="text-amber-600 mr-2">•</span>
                            Focus on the most common kanji and readings first
                        </li>
                    </ul>
                </div>

                {/* Radicals Reference */}
                <div className="mt-8 bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-100">
                    <h3 className="text-xl font-bold text-stone-800 mb-3">Common Radicals</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {[
                            { radical: '氵', name: 'Water', meaning: 'Related to water' },
                            { radical: '火', name: 'Fire', meaning: 'Related to fire' },
                            { radical: '木', name: 'Tree', meaning: 'Related to wood/trees' },
                            { radical: '人', name: 'Person', meaning: 'Related to people' },
                            { radical: '口', name: 'Mouth', meaning: 'Related to mouth/speech' },
                            { radical: '心', name: 'Heart', meaning: 'Related to emotions' },
                        ].map((radical, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg shadow-sm text-center">
                                <div className="text-2xl font-bold mb-1">{radical.radical}</div>
                                <div className="font-medium text-sm">{radical.name}</div>
                                <div className="text-xs text-stone-500">{radical.meaning}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnKanji;