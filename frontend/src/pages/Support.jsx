import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMessageSquare, FiBookmark, FiHeart, FiSend, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSupportStore } from '../store/useSupportStore';
import { useAuthStore } from '../store/useAuthStore';

const Support = () => {
  const navigate = useNavigate();
  const { authUser, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authUser === null && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [authUser, location.pathname]);
  const {
    questions,
    loading,
    fetchQuestions,
    submitQuestion,
    submitAnswer,
    toggleAnswerLike
  } = useSupportStore();

  const [activeTab, setActiveTab] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    tags: [],
    author: authUser?.username || '',
  });
  const [newAnswer, setNewAnswer] = useState({});
  const [newTag, setNewTag] = useState('');
  const [scrollY, setScrollY] = useState(0);

  const questionsRef = useRef(null);
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);
  const filteredQuestions = questions
    .filter(q =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
          if (activeTab === 'popular') return b.votes - a.votes;
          if (activeTab === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
          return (b.answers?.length || 0) - (a.answers?.length || 0);
        }))
  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("Please login to ask a question", { autoClose: 1000 });
      return;
    }
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast.error("Please fill in all fields", { autoClose: 1000 });
      return;
    }

    const success = await submitQuestion(newQuestion);
    if (success) {
      setNewQuestion({
        title: '',
        content: '',
        tags: [],
        author: authUser.username,
      });
    }
  };

  const handleSubmitAnswer = async (questionId) => {
    if (!authUser) {
      toast.error("Please login to answer", { autoClose: 1000 });
      return;
    }
    if (!newAnswer[questionId]?.trim()) {
      toast.error("Please write an answer", { autoClose: 1000 });
      return;
    }

    await submitAnswer(questionId, {
      content: newAnswer[questionId],
      author: {
        _id: authUser._id,
        username: authUser.username,
        email: authUser.email
      }
    });
    setNewAnswer(prev => ({ ...prev, [questionId]: '' }));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (newQuestion.tags.includes(newTag.toLowerCase())) {
      toast.info("Tag already exists", { autoClose: 1000 });
      return;
    }
    setNewQuestion(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.toLowerCase()]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewQuestion(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-x-hidden">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/japanese-pattern.png')] opacity-5"></div>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-amber-300/40 rounded-full"
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
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/home')}>
              <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                日
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                KataHira
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-stone-600 hover:text-amber-700 transition-colors font-medium">Home</Link>
                            <Link to="/courses" className="text-stone-600 hover:text-amber-700 transition-colors font-medium">Courses</Link>
                            <Link to="/practice/kana" className="text-stone-600 hover:text-amber-700 transition-colors font-medium">Practice</Link>
                            <Link to="/support" className="text-stone-600 hover:text-amber-700 transition-colors font-medium">Community</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all">
                Account
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Japanese Learning
            </span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-stone-600 to-stone-700 bg-clip-text">
              Community Support
            </span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Get answers to your questions, share knowledge, and connect with fellow Japanese learners
          </p>

          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search questions about Japanese..."
              className="w-full px-6 py-4 rounded-xl border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 shadow-sm text-stone-700 pr-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-stone-400 text-xl" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="md:w-1/4 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-800 mb-4">Categories</h3>
                <ul className="space-y-3">
                  {['Grammar', 'Kanji', 'Vocabulary', 'Listening', 'Speaking', 'JLPT', 'Resources', 'Culture'].map((category) => (
                    <li key={category}>
                      <button
                        className="text-stone-600 hover:text-amber-700 transition-colors w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 flex items-center justify-between"
                        onClick={() => setSearchQuery(category.toLowerCase())}
                      >
                        <span>{category}</span>
                        <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                          {questions.filter(q => q.tags.includes(category.toLowerCase())).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-800 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(questions.flatMap(q => q.tags))).slice(0, 12).map((tag) => (
                    <button
                      key={tag}
                      className="text-xs bg-stone-100 hover:bg-amber-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200 transition-colors"
                      onClick={() => setSearchQuery(tag)}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-sm">
                <h3 className="font-bold text-amber-800 mb-3">Ask a Question</h3>
                <p className="text-amber-700 text-sm mb-4">Can't find what you're looking for? Ask our community of Japanese learners and experts.</p>
                <button
                  onClick={() => questionsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                >
                  Ask Now
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:w-3/4">
              {/* Tabs */}
              <div className="flex border-b border-stone-200 mb-6">
                <button
                  className={`px-4 py-3 font-medium ${activeTab === 'popular' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
                  onClick={() => setActiveTab('popular')}
                >
                  Popular
                </button>
                <button
                  className={`px-4 py-3 font-medium ${activeTab === 'recent' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
                  onClick={() => setActiveTab('recent')}
                >
                  Recent
                </button>
                <button
                  className={`px-4 py-3 font-medium ${activeTab === 'unanswered' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-stone-600 hover:text-stone-800'}`}
                  onClick={() => setActiveTab('unanswered')}
                >
                  Unanswered
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {loading && (
                  <div className="bg-white rounded-xl p-8 text-center border border-stone-200 shadow-sm">
                    <div className="animate-pulse flex flex-col space-y-4">
                      <div className="h-6 bg-stone-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-stone-200 rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                )}

                {!loading && filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => (
                    <div
                      key={question._id}
                      className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                    >
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => toggleQuestion(question._id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-stone-800 mb-2">{question.title}</h3>
                            {expandedQuestion === question._id && (
                              <p className="text-stone-600 mb-4">{question.content}</p>
                            )}
                          </div>
                          <button className="text-stone-400 hover:text-amber-600">
                            {expandedQuestion === question._id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded-full cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery(tag);
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-stone-500">
                          <div className="flex items-center space-x-4">
                            <button
                              className={`flex items-center space-x-1 ${question.isUpvoted ? 'text-amber-600' : 'hover:text-amber-600'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Toggle upvote logic would go here
                              }}
                            >
                              <FiHeart className={question.isUpvoted ? 'fill-current' : ''} />
                              <span>{question.votes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-amber-600">
                              <FiMessageSquare />
                              <span>{question.answers?.length || 0} answers</span>
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="block">Asked by {question.author}</span>
                            <span className="block">
                              {new Date(question.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded answer section */}
                      {expandedQuestion === question._id && (
                        <div className="border-t border-stone-200 p-6 bg-stone-50">
                          <h4 className="font-bold text-stone-800 mb-4">Answers ({question.answers?.length || 0})</h4>

                          {question.answers?.length > 0 ? (
                            question.answers.map(answer => (
                              <div key={answer._id} className="bg-white rounded-lg p-4 mb-4 border border-stone-200 shadow-xs">
                                <div className="flex items-start space-x-3 mb-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {answer.author?.charAt(0).toUpperCase() || 'A'}
                                  </div>
                                  <div>
                                    <div className="font-medium text-stone-800">{answer.authorId.username || 'Anonymous'}</div>
                                    <div className="text-xs text-stone-500">
                                      {new Date(answer.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-stone-700 mb-3">{answer.content}</p>
                                <div className="flex items-center space-x-4 text-sm text-stone-500">
                                  <button
                                    className={`flex items-center space-x-1 ${answer.likedByUser ? 'text-amber-600' : 'hover:text-amber-600'}`}
                                    onClick={() => toggleAnswerLike(question._id, answer._id)}
                                  >
                                    <FiHeart className={answer.likedByUser ? 'fill-current' : ''} />
                                    <span>{answer.likesCount || 0}</span>
                                  </button>
                                  <button className="flex items-center space-x-1 hover:text-amber-600">
                                    <FiBookmark />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="bg-white rounded-lg p-4 mb-4 border border-stone-200 shadow-xs text-center text-stone-500">
                              No answers yet. Be the first to answer!
                            </div>
                          )}

                          {/* Answer form */}
                          <div className="mt-6">
                            <h5 className="font-bold text-stone-800 mb-3">Your Answer</h5>
                            <textarea
                              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 shadow-sm text-stone-700 mb-3"
                              rows="4"
                              placeholder="Share your knowledge and help others..."
                              value={newAnswer[question._id] || ''}
                              onChange={(e) => setNewAnswer(prev => ({
                                ...prev,
                                [question._id]: e.target.value
                              }))}
                            ></textarea>
                            <button
                              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                              onClick={() => handleSubmitAnswer(question._id)}
                              disabled={loading}
                            >
                              {loading ? 'Posting...' : 'Post Answer'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  !loading && (
                    <div className="bg-white rounded-xl p-8 text-center border border-stone-200 shadow-sm">
                      <div className="text-5xl mb-4">🤔</div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">No questions found</h3>
                      <p className="text-stone-600 mb-4">Try adjusting your search or ask a new question</p>
                      <button
                        className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                        onClick={() => questionsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Ask a Question
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Ask Question Section */}
          <div ref={questionsRef} className="mt-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-200 shadow-lg">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Ask Your Japanese Learning Question</h2>
            <p className="text-amber-700 mb-6">Get help from our community of Japanese learners and native speakers</p>

            <form onSubmit={handleSubmitQuestion}>
              <div className="mb-6">
                <label htmlFor="question-title" className="block text-stone-700 font-medium mb-2">Question Title</label>
                <input
                  type="text"
                  id="question-title"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 shadow-sm text-stone-700"
                  placeholder="Be specific about your Japanese learning question"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="question-details" className="block text-stone-700 font-medium mb-2">Details</label>
                <textarea
                  id="question-details"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 shadow-sm text-stone-700"
                  rows="6"
                  placeholder="Provide more details about your question. Include examples if possible."
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion(prev => ({
                    ...prev,
                    content: e.target.value
                  }))}
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-stone-700 font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newQuestion.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full flex items-center"
                    >
                      #{tag}
                      <button
                        type="button"
                        className="ml-1 text-stone-500 hover:text-stone-700"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-lg border border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 shadow-sm text-stone-700"
                    placeholder="Add tags (grammar, kanji, etc.)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <button
                    type="button"
                    className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg transition-colors"
                    onClick={handleAddTag}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                  disabled={loading}

                >
                  {loading ? 'Posting...' : 'Post Your Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 px-6 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-8 text-center">More Learning Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Japanese Grammar Guide",
                description: "Comprehensive reference for all grammar points from beginner to advanced",
                icon: "📚",
                color: "bg-amber-600"
              },
              {
                title: "Kanji Dictionary",
                description: "Search and learn kanji with stroke order and example words",
                icon: "漢",
                color: "bg-stone-600"
              },
              {
                title: "Practice Worksheets",
                description: "Printable sheets for hiragana, katakana and kanji practice",
                icon: "✍️",
                color: "bg-amber-600"
              }
            ].map((resource, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate('/resources')}
              >
                <div className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center text-white text-xl mb-4 shadow-sm`}>
                  {resource.icon}
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">{resource.title}</h3>
                <p className="text-stone-600">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 border-t border-stone-700 py-12 px-6 text-stone-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center justify-center text-white font-bold">
                  日
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                  KataHira
                </div>
              </div>
              <p className="text-stone-400 text-sm">
                The most beautiful way to learn Japanese, designed for serious learners.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-stone-200 mb-4">Learn</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Hiragana & Katakana</a></li>
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Kanji Mastery</a></li>
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Grammar Guide</a></li>
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Vocabulary Builder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-stone-200 mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Q&A Forum</a></li>
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Study Groups</a></li>
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Language Partners</a></li>
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Expert Answers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-stone-200 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-700 flex flex-col md:flex-row justify-between items-center">
            <div className="text-stone-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} KataHira. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0-2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-scroll-indicator {
          animation: scroll-indicator 1.5s infinite ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        [data-animate] {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Support;