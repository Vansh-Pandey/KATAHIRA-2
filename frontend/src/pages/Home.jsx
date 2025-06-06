import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [roadProgress, setRoadProgress] = useState(0);
  const containerRef = useRef(null);
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setScrollY(scrollTop);
      setRoadProgress(Math.min(scrollTop / (document.body.scrollHeight - window.innerHeight), 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const learningOptions = [
    {
      id: 1,
      title: "Learn Hiragana & Katakana",
      description: "Master the fundamental Japanese writing systems with interactive lessons",
      icon: "あ",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      accentColor: "bg-amber-600",
      route: "/learn/kana",
      category: "Learn",
      side: "left"
    },
    {
      id: 2,
      title: "Learn Kanji",
      description: "Discover the meaning and writing of Japanese characters",
      icon: "漢",
      bgColor: "bg-gradient-to-br from-stone-50 to-stone-100",
      borderColor: "border-stone-200",
      textColor: "text-stone-700",
      accentColor: "bg-stone-600",
      route: "/learn/kanji",
      category: "Learn",
      side: "right"
    },
    {
      id: 3,
      title: "Practice Kana",
      description: "Reinforce your hiragana and katakana knowledge",
      icon: "カ",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      accentColor: "bg-amber-600",
      route: "/practice/kana",
      category: "Practice",
      side: "left"
    },
    {
      id: 4,
      title: "Practice Kanji",
      description: "Strengthen your kanji recognition and writing skills",
      icon: "字",
      bgColor: "bg-gradient-to-br from-stone-50 to-stone-100",
      borderColor: "border-stone-200",
      textColor: "text-stone-700",
      accentColor: "bg-stone-600",  
      route: "/practice/kanji",
      category: "Practice",
      side: "right"
    },
    {
      id: 5,
      title: "Japanese Courses",
      description: "Structured learning from beginner to advanced",
      icon: "📚",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      accentColor: "bg-amber-600",
      route: "/courses",
      category: "Courses",
      side: "left"
    },
    {
      id: 6,
      title: "Q&A Support",
      description: "Get answers to your Japanese learning questions",
      icon: "❓",
      bgColor: "bg-gradient-to-br from-stone-50 to-stone-100",
      borderColor: "border-stone-200",
      textColor: "text-stone-700",
      accentColor: "bg-stone-600",
      route: "/support",
      category: "Support",
      side: "right"
    },
    {
      id: 7,
      title: "Learning Games",
      description: "Fun and engaging ways to practice Japanese",
      icon: "🎮",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      accentColor: "bg-amber-600",
      route: "/games",
      category: "Fun",
      side: "left"
    },
    {
      id: 8,
      title: "AI Tutor",
      description: "Explore Japanese with the help of AI",
      icon: "🏮",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      borderColor: "border-red-200",
      textColor: "text-red-400",
      accentColor: "bg-red-800",
      route: "/ai-tutor",
      category: "AI",
      side: "right"
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  // Japanese learning phrases for scrolling animation
  const japaneseExamples = [
    { japanese: "日本語を学びましょう", english: "Let's learn Japanese" },
    { japanese: "カタカナとひらがなをマスター", english: "Master Katakana and Hiragana" },
    { japanese: "会話の練習をしましょう", english: "Let's practice conversation" },
    { japanese: "漢字を書いてみましょう", english: "Let's try writing kanji" },
    { japanese: "毎日の勉強が大切です", english: "Daily study is important" },
    { japanese: "言語を楽しく学ぼう", english: "Learn language in a fun way" }
  ];
  const allPhrases = [...japaneseExamples, ...japaneseExamples, ...japaneseExamples];

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
              {authUser && <><button onClick={handleLogout} className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all">
                Logout
              </button>
              <FaUserCircle
              onClick={() => navigate('/profile')}
              className="text-3xl text-stone-600 hover:text-amber-700 cursor-pointer transition-colors"
              title="Profile"
            />
              </>
              }
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-16 pb-20">
        <div
          className="text-center px-6 transform transition-all duration-1000 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        >
          <div className="mb-8">
            <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-medium mb-4 shadow-xs">
              New: JLPT N5 Course Available
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Master Japanese
            </span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-stone-600 to-stone-700 bg-clip-text">
              The Beautiful Way
            </span>
          </h1>

          <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in elegant language learning with our curated approach to Japanese mastery
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/learn/kana')}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Start Learning Now
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="bg-white border border-stone-200 text-stone-700 px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              Explore Courses
            </button>
          </div>

          {/* Scrolling phrases preview */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
            {japaneseExamples.slice(0, 3).map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-white bg-opacity-80 border border-stone-200">
                <p className="text-lg font-medium text-stone-800">{item.japanese}</p>
                <p className="text-sm text-stone-600">{item.english}</p>
              </div>
            ))}
          </div>
        </div>


      </section>

      {/* Learning Path Section */}
      <section className="relative py-24" ref={containerRef}>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-amber-200 via-amber-300 to-stone-200"></div>
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div
          className="fixed top-1/2 right-8 transform -translate-y-1/2 hidden lg:block"
          style={{ opacity: roadProgress > 0.1 && roadProgress < 0.9 ? 1 : 0 }}
        >
          <div className="h-64 w-1 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="w-full bg-gradient-to-b from-amber-600 to-amber-700 transition-all duration-300"
              style={{ height: `${roadProgress * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-stone-500 mt-2 text-center">
            {Math.round(roadProgress * 100)}% explored
          </div>
        </div>

        {/* Learning Journey */}
        <div className="max-w-6xl mx-auto px-6 space-y-32">
          <div className="text-center mb-20" data-animate id="journey-start">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                Your Learning Journey
              </span>
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Follow this carefully crafted path to Japanese mastery, with each step building on the last
            </p>
          </div>

          {learningOptions.map((option, index) => (
            <div
              key={option.id}
              id={`card-${option.id}`}
              data-animate
              className={`flex ${option.side === 'left' ? 'justify-start' : 'justify-end'} relative`}
            >
              {/* Connection line */}
              <div className={`absolute top-1/2 w-20 h-0.5 ${option.bgColor} opacity-80 ${option.side === 'left' ? 'right-0 mr-6' : 'left-0 ml-6'
                }`}></div>

              <div
                className={`w-full max-w-md transform transition-all duration-700 ease-out ${isVisible[`card-${option.id}`] ? 'translate-x-0 opacity-100' :
                  option.side === 'left' ? '-translate-x-10 opacity-0' : 'translate-x-10 opacity-0'
                  } ${option.side === 'left' ? 'mr-24' : 'ml-24'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${hoveredCard === option.id ? 'z-20 scale-[1.02]' : ''
                    }`}
                  onClick={() => handleCardClick(option.route)}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card */}
                  <div className={`relative ${option.bgColor} rounded-2xl p-6 shadow-lg border ${option.borderColor} overflow-hidden transition-all duration-300 group-hover:shadow-xl`}>
                    {/* Floating accent */}
                    <div className={`absolute top-0 right-0 w-16 h-16 ${option.accentColor} opacity-10 rounded-bl-full transition-all duration-500 group-hover:opacity-20`}></div>

                    {/* Category */}
                    <div className="absolute top-5 right-5 z-10">
                      <span className={`${option.accentColor} bg-opacity-10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold ${option.textColor} border ${option.borderColor}`}>
                        {option.category}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 ${option.accentColor} bg-opacity-10 rounded-xl flex items-center justify-center mb-6 text-3xl ${option.textColor} transform group-hover:scale-110 transition-all duration-300`}>
                      {option.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 leading-tight text-stone-800">
                      {option.title}
                    </h3>
                    <p className="text-stone-600 leading-relaxed mb-6">
                      {option.description}
                    </p>

                    {/* Action */}
                    <div className="flex items-center justify-between">
                      <button className={`${option.textColor} bg-white bg-opacity-70 border ${option.borderColor} px-5 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-xs`}>
                        Explore
                      </button>

                      <div className={`w-10 h-10 bg-white border ${option.borderColor} rounded-full flex items-center justify-center transform group-hover:translate-x-1 transition-all duration-300 shadow-xs`}>
                        <span className={`text-xl ${option.textColor}`}>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-white to-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Why Learn With KataHira?
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Our unique approach makes Japanese learning effective and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Smart Learning Path",
                description: "AI-powered recommendations adapt to your progress and goals",
                color: "bg-amber-600"
              },
              {
                icon: "🗣️",
                title: "Native Speaker Audio",
                description: "Authentic pronunciation for every word and phrase",
                color: "bg-stone-600"
              },
              {
                icon: "📊",
                title: "Progress Analytics",
                description: "Track your improvement with detailed insights",
                color: "bg-amber-600"
              },
              {
                icon: "✍️",
                title: "Writing Practice",
                description: "Master stroke order with interactive writing tools",
                color: "bg-stone-600"
              },
              {
                icon: "🎮",
                title: "Gamified Learning",
                description: "Earn points and badges as you progress",
                color: "bg-amber-600"
              },
              {
                icon: "🌐",
                title: "Cultural Context",
                description: "Learn the language through cultural understanding",
                color: "bg-stone-600"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                data-animate
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white text-xl mb-4 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              What Our Learners Say
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Join thousands of students who've transformed their Japanese skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "KataHira made learning kanji actually enjoyable. The memory techniques are brilliant!",
                author: "Akshat",
                role: "student",
                avatar: "A"
              },
              {
                quote: "Best investment I've made in my language learning journey.",
                author: "Vaibhav",
                role: "student",
                avatar: "V"
              },
              
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300"
                data-animate
              >
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white font-medium mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">{testimonial.author}</h4>
                    <p className="text-sm text-stone-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-stone-700 italic">"{testimonial.quote}"</p>
                <div className="flex mt-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-6">
            Ready to Start Your Japanese Journey?
          </h2>
          <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and experience the most beautiful way to master Japanese
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/learn/kana')}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="bg-white text-stone-700 border border-stone-200 px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              Explore All Courses
            </button>
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
                <li><Link to="/learn/kana" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Hiragana & Katakana</Link></li>
                <li><Link to="/learn/kanji" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Kanji Mastery</Link></li>
                {/* <li><Link to="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Grammar Guide</Link></li> */}
                {/* <li><Link to="#" className="text-stone-400 hover:text-amber-400 transition-colors text-sm">Vocabulary Builder</Link></li> */}
              </ul>
            </div>
            
            
          </div>
          <div className="pt-8 border-t border-stone-700 flex flex-col md:flex-row justify-between items-center">
            <div className="text-stone-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} KataHira. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/https_vansh_/" className="text-stone-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://www.instagram.com/https_vansh_/" className="text-stone-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Animations */}
      {/* Animations */}
      <style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes scroll-indicator {
    0% { transform: translateY(0); opacity: 0.4; }
    50% { transform: translateY(8px); opacity: 1; }
    100% { transform: translateY(0); opacity: 0.4; }
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

export default Home;