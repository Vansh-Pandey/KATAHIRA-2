import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import { useProfileStore } from '../store/useProfileStore';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import { useAuthStore } from '../store/useAuthStore';

const Courses = () => {
    const navigate = useNavigate();
    const { authUser, checkAuth } = useAuthStore();
    const { profile, fetchProfile, isFetchingProfile } = useProfileStore();
    const {
        courses,
        currentCourse,
        isLoading,
        fetchAllCourses,
        fetchCourseById,
        createCourse,
        enrollInCourse,
        addQuiz,
        addQuestion,
        addQuizQuestion,
        addNote,
        addPracticePaper,
        addForumAnswer
    } = useCourseStore();
    const isTeacher = profile?.role === "teacher";
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseSection, setCourseSection] = useState('overview');
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
    const [newCourseData, setNewCourseData] = useState({
        title: '',
        description: '',
        level: 'beginner',
        category: 'hiragana',
        coverImage: '',
    });
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        questions: [
            {
                question: '',
                options: ['', '', '', ''],
                answer: ''
            }
        ]
    });
    const [newPracticePaper, setNewPracticePaper] = useState({
        title: '',
        description: '',
        file: '',
    });
    const [showAddQuizModal, setShowAddQuizModal] = useState(false);
    const [showAddPaperModal, setShowAddPaperModal] = useState(false);
    const [answersMap, setAnswersMap] = useState({});
    const [quizScores, setQuizScores] = useState([]);
    const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
    const isUserEnrolled = (course, userId) => {
        return course?.students?.includes(userId);
    };
    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (authUser === null && location.pathname !== "/") {
            navigate("/", { replace: true });
        }
    }, [authUser, location.pathname]);

    useEffect(() => {
        fetchProfile();
        fetchAllCourses();
    }, [fetchProfile, fetchAllCourses]);

    useEffect(() => {
        if (selectedCourse) {
            fetchCourseById(selectedCourse._id);
        }
    }, [selectedCourse, fetchCourseById]);

    const handleCreateCourse = async () => {
        await createCourse(newCourseData);
        setShowCreateCourseModal(false);
        setNewCourseData({
            title: '',
            description: '',
            level: 'beginner',
            category: 'hiragana',
            coverImage: '',
        });
    };

    const handleEnroll = async (courseId) => {
        if (!courseId) {
            console.error("❌ Cannot enroll: courseId is undefined!");
            return;
        }
        await enrollInCourse(courseId);
    };


    const handleQuizSubmit = () => {
    if (!currentCourse?.quizzes) return;

    const quiz = currentCourse.quizzes.find(q => q._id === activeQuiz);
    if (!quiz) return;

    let score = 0;

    quiz.questions.forEach((q,index) => {
        const userAnswer = quizAnswers[index]; // this is the selected option index (as string)

        if (userAnswer === q.options[q.options.correctAnswer]) {
            score++;
        }

        // Alternative if `q.answer` is the **text** not the index:
        // if (q.options[parseInt(userAnswer)] === q.answer) score++;
    });

    setQuizScore({
        correct: score,
        total: quiz.questions.length,
        percentage: Math.round((score / quiz.questions.length) * 100)
    });

    setQuizSubmitted(true);
};

    const addNewQuestion = () => {
        setQuizData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    question: '',
                    options: ['', '', '', ''],
                    answer: ''
                }
            ]
        }));
    };

    const removeQuestion = (index) => {
        if (quizData.questions.length > 1) {
            setQuizData(prev => ({
                ...prev,
                questions: prev.questions.filter((_, i) => i !== index)
            }));
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        setQuizData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuizData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const isFormValid = () => {
        return (
            quizData.title.trim() &&
            quizData.questions.every(q =>
                q.question.trim() &&
                q.options.every(o => o.trim()) &&
                q.answer !== ''
            )
        );
    };

    const handleAddNote = async () => {
        if (newNote.trim() && selectedCourse) {
            await addNote(selectedCourse._id, {
                content: newNote
            });
            setNewNote('');
        }
    };

    const handleAddQuestion = async () => {
        if (newQuestion.trim() && selectedCourse) {
            await addQuestion(selectedCourse._id, {
                question: newQuestion,
                answers: []
            });
            setNewQuestion('');
        }
    };
    const handlePostAnswer = async (questionId) => {
        const content = answersMap[questionId]?.trim();
        if (!content) {
            toast.error("Answer can't be empty!");
            return;
        }

        await addForumAnswer(questionId, { content });

        // Clear the input
        setAnswersMap((prev) => ({ ...prev, [questionId]: "" }));
    };

    const handleAddCompleteQuiz = async (quizData) => {
        setIsSubmittingQuiz(true);
        if (selectedCourse && quizData.title.trim()) {
            try {
                // First create the quiz with basic info
                const createdQuiz = await addQuiz(selectedCourse._id, {
                    title: quizData.title,
                    description: quizData.description,
                    questions: [], // Start with empty questions array
                    createdBy: authUser._id,
                });
                if (!createdQuiz || !createdQuiz._id) {
                    toast.error("Quiz creation failed. No quiz ID returned.");
                    setIsSubmittingQuiz(false);
                    return;
                }
                // Then add all questions to the quiz
                for (const question of quizData.questions) {
                    await addQuizQuestion(
                        selectedCourse._id,
                        createdQuiz._id, // Use the ID of the newly created quiz
                        {
                            question: question.question,
                            options: question.options,
                            answer: question.answer
                        }
                    );
                }

                // Refresh the course data to show the new quiz
                fetchCourseById(selectedCourse._id);

                setQuizData({
                    title: '',
                    description: '',
                    questions: [{
                        question: '',
                        options: ['', '', '', ''],
                        answer: ''
                    }]
                });
                setIsSubmittingQuiz(false);
            } catch (error) {
                console.error("Failed to create quiz:", error);
                toast.error('Failed to create quiz. Please try again.');
            }
        }
    };


    const handleAddPracticePaper = async () => {
        if (selectedCourse && newPracticePaper.title.trim()) {
            const paperData = {
                title: newPracticePaper.title,
                description: newPracticePaper.description,
                file: newPracticePaper.file, // This is a URL now
            };

            await addPracticePaper(selectedCourse._id, paperData);
            setShowAddPaperModal(false);
            setNewPracticePaper({
                title: '',
                description: '',
                file: '' // Reset to empty string instead of null
            });
        }
    };


    const filteredCourses = courses.filter(course =>
        (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    const enrolledCourses = courses.filter(course =>
        course.students.includes(authUser._id)
    );
    const teachingCourses = courses.filter(course => course.instructorId === profile?._id);

    // Course categories with Japanese translations
    const categories = [
        { id: 'hiragana', name: 'Hiragana', japanese: 'ひらがな' },
        { id: 'katakana', name: 'Katakana', japanese: 'カタカナ' },
        { id: 'kanji', name: 'Kanji', japanese: '漢字' },
        { id: 'grammar', name: 'Grammar', japanese: '文法' },
        { id: 'vocabulary', name: 'Vocabulary', japanese: '語彙' },
        { id: 'conversation', name: 'Conversation', japanese: '会話' }
    ];

    // Difficulty levels with Japanese translations
    const levels = [
        { id: 'beginner', name: 'Beginner', japanese: '初心者' },
        { id: 'intermediate', name: 'Intermediate', japanese: '中級' },
        { id: 'advanced', name: 'Advanced', japanese: '上級' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-stone-50 text-stone-800">
            <Header />

            <main className="flex-1 p-4 md:p-8">
                {/* Search and Filter Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-stone-800">
                            {isTeacher ? 'Your Teaching Courses' : 'Available Courses'}
                            <span className="block text-xl text-amber-600">
                                {isTeacher ? '教えているコース' : '利用可能なコース'}
                            </span>
                        </h1>

                        <div className="w-full md:w-auto flex gap-2">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {isTeacher && (
                                <button
                                    onClick={() => setShowCreateCourseModal(true)}
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    + New Course
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            className={`px-4 py-2 rounded-full ${!selectedCourse ? 'bg-amber-600 text-white' : 'bg-stone-200 hover:bg-stone-300'}`}
                            onClick={() => setSelectedCourse(null)}
                        >
                            All Courses
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`px-4 py-2 rounded-full ${selectedCourse?.category === cat.id ? 'bg-amber-600 text-white' : 'bg-stone-200 hover:bg-stone-300'}`}
                                onClick={() => setSelectedCourse(null)}
                            >
                                {cat.name} ({cat.japanese})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Course List Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                            <h3 className="font-bold text-lg mb-3 text-stone-800">
                                {isTeacher ? 'Your Courses' : 'Your Learning'}
                                <span className="block text-sm text-amber-600">
                                    {isTeacher ? 'あなたのコース' : 'あなたの学習'}
                                </span>
                            </h3>
                            <div className="space-y-2">
                                {isTeacher ? (
                                    teachingCourses.length > 0 ? (
                                        teachingCourses.map(course => (
                                            <div
                                                key={course._id}
                                                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCourse?._id === course._id ? 'bg-amber-100 border-l-4 border-amber-600' : 'hover:bg-stone-100'}`}
                                                onClick={() => setSelectedCourse(course)}
                                            >
                                                <h4 className="font-medium">{course.title}</h4>
                                                <p className="text-sm text-stone-600 truncate">{course.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-stone-500">You're not teaching any courses yet</p>
                                    )
                                ) : (
                                    enrolledCourses.length > 0 ? (
                                        enrolledCourses.map(course => (
                                            <div
                                                key={course._id}
                                                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCourse?._id === course._id ? 'bg-amber-100 border-l-4 border-amber-600' : 'hover:bg-stone-100'}`}
                                                onClick={() => setSelectedCourse(course)}
                                            >
                                                <h4 className="font-medium">{course.title}</h4>
                                                <p className="text-sm text-stone-600 truncate">{course.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-stone-500">You're not enrolled in any courses yet</p>
                                    )
                                )}
                            </div>
                        </div>

                        {!isTeacher && (
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                                <h3 className="font-bold text-lg mb-3 text-stone-800">
                                    Recommended Courses
                                    <span className="block text-sm text-amber-600">おすすめのコース</span>
                                </h3>
                                <div className="space-y-2">
                                    {filteredCourses.slice(0, 3).map(course => (
                                        <div
                                            key={course._id}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCourse?._id === course._id ? 'bg-amber-100 border-l-4 border-amber-600' : 'hover:bg-stone-100'}`}
                                            onClick={() => setSelectedCourse(course)}
                                        >
                                            <h4 className="font-medium">{course.title}</h4>
                                            <p className="text-sm text-stone-600 truncate">{course.description}</p>
                                            {!isTeacher && isUserEnrolled(course, authUser._id) ? (
                                                <span className="text-green-600">Enrolled</span>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEnroll(course._id);
                                                    }}
                                                    className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-full transition-colors"
                                                >
                                                    Enroll Now
                                                </button>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Course Detail Area */}
                    <div className="lg:col-span-3">
                        {selectedCourse ? (
                            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                                {/* Course Header */}
                                <div className="relative">
                                    <div className="h-48 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                                        <h2 className="text-3xl font-bold text-white text-center p-4">
                                            {selectedCourse.title}
                                            <span className="block text-xl font-normal mt-2">
                                                {categories.find(c => c.id === selectedCourse.category)?.japanese}
                                            </span>
                                        </h2>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
                                </div>

                                {/* Course Navigation */}
                                <div className="border-b border-stone-200">
                                    <nav className="flex overflow-x-auto">
                                        {['overview', 'lessons', 'quizzes', 'scores', 'notes', 'questions', 'papers'].map((tab) => (
                                            <button
                                                key={tab}
                                                className={`px-6 py-3 font-medium whitespace-nowrap ${courseSection === tab ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-600 hover:text-stone-900'}`}
                                                onClick={() => setCourseSection(tab)}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Course Content */}
                                <div className="p-6">
                                    {/* Overview Section */}
                                    {courseSection === 'overview' && (
                                        <div>
                                            <h3 className="text-xl font-bold mb-4 text-stone-800">Course Overview</h3>
                                            <p className="mb-6 text-stone-700">{selectedCourse.description}</p>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                                    <h4 className="font-bold text-amber-800 mb-1">Level</h4>
                                                    <p>{levels.find(l => l.id === selectedCourse.level)?.name} ({levels.find(l => l.id === selectedCourse.level)?.japanese})</p>
                                                </div>
                                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                                    <h4 className="font-bold text-amber-800 mb-1">Category</h4>
                                                    <p>{categories.find(c => c.id === selectedCourse.category)?.name} ({categories.find(c => c.id === selectedCourse.category)?.japanese})</p>
                                                </div>
                                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                                    <h4 className="font-bold text-amber-800 mb-1">Enrolled Students</h4>
                                                    <p>{selectedCourse.students.length || 0} students</p>
                                                </div>
                                            </div>

                                            {!isTeacher && (
                                                <button
                                                    disabled={selectedCourse.students?.includes(authUser._id)}
                                                    onClick={() => handleEnroll(selectedCourse._id)}
                                                    className={`px-6 py-2 rounded-lg transition-colors ${selectedCourse.students?.includes(authUser._id)
                                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                                                        }`}
                                                >
                                                    {selectedCourse.students?.includes(authUser._id) ? "Enrolled" : "Enroll in this Course"}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Lessons Section */}
                                    {courseSection === 'lessons' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-stone-800">Lessons</h3>
                                                {isTeacher && (
                                                    <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                                        + Add Lesson
                                                    </button>
                                                )}
                                            </div>

                                            {currentCourse?.lessons?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {currentCourse.lessons.map((lesson, index) => (
                                                        <div key={index} className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
                                                            <div className="flex items-start">
                                                                <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center mr-4 font-bold">
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-stone-800">{lesson.title}</h4>
                                                                    <p className="text-stone-600 text-sm">{lesson.description}</p>
                                                                    <div className="mt-2 flex gap-2">
                                                                        {lesson.videoUrl && (
                                                                            <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 text-sm flex items-center">
                                                                                <span className="mr-1">▶️</span> Watch Video
                                                                            </a>
                                                                        )}
                                                                        {lesson.documentUrl && (
                                                                            <a href={lesson.documentUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 text-sm flex items-center">
                                                                                <span className="mr-1">📄</span> View Document
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-stone-500">
                                                    <p>No lessons available yet.</p>
                                                    {isTeacher && (
                                                        <button className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                                            Create First Lesson
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Quizzes Section */}
                                    {courseSection === 'quizzes' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-stone-800">Quizes</h3>
                                                {isTeacher && (
                                                    <button
                                                        onClick={() => setShowAddQuizModal(true)}
                                                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                    >
                                                        + Add Quiz
                                                    </button>
                                                )}
                                            </div>

                                            {currentCourse?.quizzes?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {currentCourse.quizzes.map((quiz) => (
                                                        <div key={quiz._id} className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-bold text-stone-800">{quiz.title}</h4>
                                                                    <p className="text-stone-600 text-sm">{quiz.description}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        setActiveQuiz(quiz._id);
                                                                        setQuizSubmitted(false);
                                                                        setQuizScore(null);
                                                                        setQuizAnswers({});
                                                                    }}
                                                                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                                                >
                                                                    {activeQuiz === quiz._id ? 'In Progress' : 'Take Quiz'}
                                                                </button>
                                                            </div>

                                                            {activeQuiz === quiz._id && (
                                                                <div className="mt-4 pt-4 border-t border-stone-200">
                                                                    {quizSubmitted ? (
                                                                        <div className="bg-amber-50 p-4 rounded-lg">
                                                                            <h5 className="font-bold text-amber-800 mb-2">Quiz Results</h5>
                                                                            <p>You scored {quizScore.correct} out of {quizScore.total} ({quizScore.percentage}%)</p>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setQuizSubmitted(false);
                                                                                    setQuizAnswers({});
                                                                                }}
                                                                                className="mt-3 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                                                            >
                                                                                Retake Quiz
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            {quiz.questions?.map((question, qIndex) => (
                                                                                <div key={qIndex} className="mb-6">
                                                                                    <p className="font-medium mb-2">{qIndex + 1}. {question.questionText}</p>
                                                                                    <div className="space-y-2">
                                                                                        {question.options.map((option, oIndex) => (
                                                                                            <label key={oIndex} className="flex items-center space-x-2 cursor-pointer">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`quiz-${quiz._id}-question-${qIndex}`} // make name unique per quiz + question
                                                                                                    className="text-amber-600 focus:ring-amber-500"
                                                                                                    checked={quizAnswers[qIndex] === oIndex.toString()}
                                                                                                    onChange={() =>
                                                                                                        setQuizAnswers((prev) => ({
                                                                                                            ...prev,
                                                                                                            [qIndex]: oIndex.toString(),
                                                                                                        }))
                                                                                                    }
                                                                                                />

                                                                                                <span>{option}</span>
                                                                                            </label>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                            <button
                                                                                onClick={handleQuizSubmit}
                                                                                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                                                                            >
                                                                                Submit Quiz
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                            ) : (
                                                <div className="text-center py-8 text-stone-500">
                                                    <p>No quizzes available yet.</p>
                                                    {isTeacher && (
                                                        <button
                                                            onClick={() => setShowAddQuizModal(true)}
                                                            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                        >
                                                            Create First Quiz
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Notes Section */}
                                    {courseSection === 'notes' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-stone-800">Notes</h3>
                                                <button
                                                    onClick={() => document.getElementById('noteTextarea').focus()}
                                                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                >
                                                    + Add Note
                                                </button>
                                            </div>

                                            <div className="mb-6">
                                                <textarea
                                                    id="noteTextarea"
                                                    className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    rows="3"
                                                    placeholder="Write your note here..."
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                ></textarea>
                                                <button
                                                    onClick={handleAddNote}
                                                    className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                                                    disabled={!newNote.trim()}
                                                >
                                                    Save Note
                                                </button>
                                            </div>

                                            {currentCourse?.notes?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {currentCourse.notes.map((note, index) => (
                                                        <div key={index} className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
                                                            <div className="flex items-start mb-2">
                                                                <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                                                                    {profile?.name?.charAt(0) || 'Y'}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-stone-800">{profile?.name || 'You'}</h4>
                                                                    <p className="text-stone-500 text-xs">{new Date(note.createdAt).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-stone-700 whitespace-pre-line">{note.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-stone-500">
                                                    <p>No notes yet. Add your first note above!</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Questions Section */}
                                    {courseSection === 'questions' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-stone-800">Questions</h3>
                                                <button
                                                    onClick={() => document.getElementById('questionTextarea').focus()}
                                                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                >
                                                    + Ask Question
                                                </button>
                                            </div>

                                            <div className="mb-6">
                                                <textarea
                                                    id="questionTextarea"
                                                    className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    rows="5"
                                                    placeholder="Ask your question here..."
                                                    value={newQuestion}
                                                    onChange={(e) => setNewQuestion(e.target.value)}
                                                ></textarea>
                                                <button
                                                    onClick={handleAddQuestion}
                                                    className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                                                    disabled={!newQuestion.trim()}
                                                >
                                                    Post Question
                                                </button>
                                            </div>

                                            {currentCourse?.forum?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {currentCourse.forum.map((question, index) => (
                                                        <div key={index} className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
                                                            <div className="flex items-start mb-2">
                                                                <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                                                                    {question.author?.username?.charAt(0) || 'Q'}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-stone-800">{question.author?.username || 'Anonymous'}</h4>
                                                                    <p className="text-stone-500 text-xs">{new Date(question.createdAt).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-stone-700 font-medium mb-3">{question.question}</p>

                                                            {question.answers?.length > 0 ? (
                                                                <div className="ml-10 space-y-3">
                                                                    {question.answers.map((answer, aIndex) => (
                                                                        <div key={aIndex} className="border-l-2 border-amber-300 pl-3 py-1">
                                                                            <div className="flex items-start mb-1">
                                                                                <div className="bg-stone-100 text-stone-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold text-xs">
                                                                                    {answer.author?.username?.charAt(0) || 'A'}
                                                                                </div>
                                                                                <div>
                                                                                    <h5 className="font-medium text-stone-800 text-sm">{answer.author.username || 'Anonymous'}</h5>
                                                                                    <h5 className="font-medium text-stone-800 text-sm">{answer.author.username.role || ''}</h5>
                                                                                    <p className="text-stone-500 text-xs">{new Date(answer.createdAt).toLocaleString()}</p>
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-stone-700 text-sm">{answer.content}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-stone-500 text-sm ml-10">No answers yet</p>
                                                            )}

                                                            <div className="mt-3 ml-10">
                                                                <textarea
                                                                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                                                                    rows="2"
                                                                    placeholder="Write your answer..."
                                                                    value={answersMap[question._id] || ''}
                                                                    onChange={(e) =>
                                                                        setAnswersMap((prev) => ({ ...prev, [question._id]: e.target.value }))
                                                                    }
                                                                ></textarea>
                                                                <button
                                                                    className="mt-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                                                                    onClick={() => handlePostAnswer(question._id)}
                                                                >
                                                                    Post Answer
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-stone-500">
                                                    <p>No questions yet. Ask your first question above!</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/*Quiz Scores Sections*/}
                                    {courseSection === 'scores' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-stone-800">Your Quiz Scores</h3>

                                            </div>

                                            {quizScores.length > 0 ? (
                                                <div>
                                                    {/* Performance Summary */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                            <h4 className="font-bold text-green-800 mb-1">Average Score</h4>
                                                            <p className="text-2xl font-bold">
                                                                {Math.round(quizScores.reduce((acc, score) => acc + score.score, 0) / quizScores.length)}%
                                                            </p>
                                                        </div>
                                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                            <h4 className="font-bold text-blue-800 mb-1">Quizzes Taken</h4>
                                                            <p className="text-2xl font-bold">{quizScores.length}</p>
                                                        </div>
                                                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                                            <h4 className="font-bold text-amber-800 mb-1">Best Score</h4>
                                                            <p className="text-2xl font-bold">
                                                                {Math.max(...quizScores.map(score => score.score))}%
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Detailed Scores */}
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full border-collapse">
                                                            <thead>
                                                                <tr className="bg-stone-100 text-left">
                                                                    <th className="p-3 border-b border-stone-200">Quiz</th>
                                                                    <th className="p-3 border-b border-stone-200">Date</th>
                                                                    <th className="p-3 border-b border-stone-200">Score</th>
                                                                    <th className="p-3 border-b border-stone-200">Correct</th>
                                                                    <th className="p-3 border-b border-stone-200">Performance</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {quizScores.map((score, index) => (
                                                                    <tr key={index} className="hover:bg-stone-50">
                                                                        <td className="p-3 border-b border-stone-200">{score.quizTitle}</td>
                                                                        <td className="p-3 border-b border-stone-200">{score.date}</td>
                                                                        <td className="p-3 border-b border-stone-200">
                                                                            <span className={`font-bold ${score.score >= 80 ? 'text-green-600' :
                                                                                score.score >= 60 ? 'text-amber-600' : 'text-red-600'
                                                                                }`}>
                                                                                {score.score}%
                                                                            </span>
                                                                        </td>
                                                                        <td className="p-3 border-b border-stone-200">
                                                                            {score.correctAnswers}/{score.totalQuestions}
                                                                        </td>
                                                                        <td className="p-3 border-b border-stone-200">
                                                                            <div className="w-full bg-stone-200 rounded-full h-2.5">
                                                                                <div
                                                                                    className={`h-2.5 rounded-full ${score.score >= 80 ? 'bg-green-600' :
                                                                                        score.score >= 60 ? 'bg-amber-600' : 'bg-red-600'
                                                                                        }`}
                                                                                    style={{ width: `${score.score}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Performance Chart (placeholder - would use a charting library in real app) */}
                                                    <div className="mt-8 bg-stone-50 p-4 rounded-lg border border-stone-200">
                                                        <h4 className="font-bold text-stone-800 mb-3">Performance Over Time</h4>
                                                        <div className="h-64 flex items-end justify-between">
                                                            {quizScores.map((score, index) => (
                                                                <div key={index} className="flex flex-col items-center">
                                                                    <div
                                                                        className={`w-8 rounded-t-sm ${score.score >= 80 ? 'bg-green-600' :
                                                                            score.score >= 60 ? 'bg-amber-600' : 'bg-red-600'
                                                                            }`}
                                                                        style={{ height: `${score.score * 0.6}%` }}
                                                                    ></div>
                                                                    <span className="text-xs mt-1">{score.date.split('-')[2]}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-stone-500">
                                                    <p>No quiz scores yet. Complete some quizzes to see your progress!</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Practice Papers Section */}
                                    {courseSection === 'papers' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-stone-800">Practice Papers</h3>
                                                {isTeacher && (
                                                    <button
                                                        onClick={() => setShowAddPaperModal(true)}
                                                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                    >
                                                        + Add Paper
                                                    </button>
                                                )}
                                            </div>

                                            {currentCourse?.practicePapers?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {currentCourse.practicePapers.map((paper, index) => (
                                                        <div key={index} className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-bold text-stone-800 flex items-center">
                                                                        <span className="mr-2">📝</span> {paper.title}
                                                                    </h4>
                                                                    <p className="text-stone-600 text-sm">{paper.description}</p>
                                                                </div>
                                                                <a
                                                                    href={paper.fileUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                                                >
                                                                    Link
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-stone-500">
                                                    <p>No practice papers available yet.</p>
                                                    {isTeacher && (
                                                        <button
                                                            onClick={() => setShowAddPaperModal(true)}
                                                            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                        >
                                                            Upload First Paper
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                                <h2 className="text-2xl font-bold mb-4 text-stone-800">
                                    {isTeacher ? 'All Courses' : 'Available Courses'}
                                </h2>

                                {filteredCourses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredCourses.map((course) => (
                                            <div
                                                key={course._id}
                                                className="border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => setSelectedCourse(course)}
                                            >
                                                <div className="h-40 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                                                    <h3 className="text-xl font-bold text-white text-center p-2">
                                                        {course.title}
                                                        <span className="block text-sm font-normal mt-1">
                                                            {categories.find(c => c.id === course.category)?.japanese}
                                                        </span>
                                                    </h3>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-stone-600 mb-3 line-clamp-2">{course.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                                            {levels.find(l => l.id === course.level)?.name}
                                                        </span>
                                                        {!isTeacher && isUserEnrolled(course, authUser._id) ? (
                                                            <span className="text-green-600">Enrolled</span>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEnroll(course._id);
                                                                }}
                                                                className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-full transition-colors"
                                                            >
                                                                Enroll Now
                                                            </button>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-stone-500">No courses found matching your search.</p>
                                        {isTeacher && (
                                            <button
                                                onClick={() => setShowCreateCourseModal(true)}
                                                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Create Your First Course
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Create Course Modal */}
            {showCreateCourseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-4 text-stone-800">Create New Course</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Course Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        value={newCourseData.title}
                                        onChange={(e) => setNewCourseData({ ...newCourseData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        rows="3"
                                        value={newCourseData.description}
                                        onChange={(e) => setNewCourseData({ ...newCourseData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                                    <select
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        value={newCourseData.category}
                                        onChange={(e) => setNewCourseData({ ...newCourseData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name} ({cat.japanese})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Level</label>
                                    <select
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        value={newCourseData.level}
                                        onChange={(e) => setNewCourseData({ ...newCourseData, level: e.target.value })}
                                    >
                                        {levels.map(level => (
                                            <option key={level.id} value={level.id}>
                                                {level.name} ({level.japanese})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Cover Image URL (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        value={newCourseData.coverImage}
                                        onChange={(e) => setNewCourseData({ ...newCourseData, coverImage: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateCourseModal(false)}
                                    className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateCourse}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    disabled={!newCourseData.title.trim()}
                                >
                                    Create Course
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Quiz Modal */}
            {showAddQuizModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-stone-800">Create New Quiz</h3>
                                <button
                                    onClick={() => setShowAddQuizModal(false)}
                                    className="text-stone-500 hover:text-stone-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Quiz Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        value={quizData.title}
                                        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        rows="3"
                                        value={quizData.description}
                                        onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="border-t border-stone-200 pt-4">
                                    <h4 className="font-medium text-stone-800 mb-3">Quiz Questions</h4>

                                    {quizData.questions.map((question, qIndex) => (
                                        <div key={qIndex} className="mb-6 p-4 border border-stone-200 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">Question {qIndex + 1}</span>
                                                <button
                                                    onClick={() => removeQuestion(qIndex)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                    disabled={quizData.questions.length <= 1}
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-stone-700 mb-1">Question Text</label>
                                                <textarea
                                                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    rows="2"
                                                    value={question.question}
                                                    onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                                ></textarea>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-stone-700 mb-1">Options</label>
                                                {question.options.map((option, oIndex) => (
                                                    <div key={oIndex} className="flex items-center mb-2">
                                                        <input
                                                            type="radio"
                                                            name={`correct-answer-${qIndex}`}
                                                            className="mr-2 text-amber-600 focus:ring-amber-500"
                                                            checked={question.answer === oIndex.toString()}
                                                            onChange={() => handleQuestionChange(qIndex, 'answer', oIndex.toString())}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="flex-1 p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                            placeholder={`Option ${oIndex + 1}`}
                                                            value={option}
                                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={addNewQuestion}
                                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        + Add Another Question
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddQuizModal(false)}
                                    className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAddCompleteQuiz(quizData)}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    disabled={!isFormValid() || isSubmittingQuiz}
                                >
                                    {isSubmittingQuiz ? 'Creating...' : 'Create Quiz'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Add Practice Paper Modal */}
            {showAddPaperModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-4 text-stone-800">Add Practice Paper</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Paper Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        value={newPracticePaper.title}
                                        onChange={(e) => setNewPracticePaper({ ...newPracticePaper, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        rows="3"
                                        value={newPracticePaper.description}
                                        onChange={(e) => setNewPracticePaper({ ...newPracticePaper, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        Practice Paper Link
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/paper.pdf"
                                        className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        onChange={(e) =>
                                            setNewPracticePaper({ ...newPracticePaper, file: e.target.value })
                                        }
                                    />
                                    <p className="text-xs text-stone-500 mt-1">
                                        Paste a valid PDF/DOC link (e.g., Google Drive, Dropbox)
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddPaperModal(false)}
                                    className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddPracticePaper}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    disabled={!newPracticePaper.title.trim()}
                                >
                                    Add Paper
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;