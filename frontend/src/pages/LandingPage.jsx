import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuthStore } from '../store/useAuthStore.js';
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Login from "./Login";
const LandingPage = () => {
  // Japanese learning phrases
  const { authUser, checkAuth } = useAuthStore();
  const navigate = useNavigate(); // Initialize navigate
  useEffect(() => {
    const verifyUser = async () => {
      await checkAuth();

      // If not logged in and trying to access a protected route
      if (!authUser && location.pathname !== "/") {
        navigate("/", { replace: true });
      }
    };

    verifyUser();
  }, [location.pathname]);
  const japaneseExamples = [
    { japanese: "日本語を学びましょう", english: "Let's learn Japanese" },
    { japanese: "カタカナとひらがなをマスター", english: "Master Katakana and Hiragana" },
    { japanese: "会話の練習をしましょう", english: "Let's practice conversation" },
    { japanese: "漢字を書いてみましょう", english: "Let's try writing kanji" },
    { japanese: "毎日の勉強が大切です", english: "Daily study is important" },
    { japanese: "言語を楽しく学ぼう", english: "Learn language in a fun way" },
    { japanese: "文法の基礎を固めよう", english: "Build a foundation in grammar" },
    { japanese: "発音を練習しよう", english: "Let's practice pronunciation" },
    { japanese: "単語力を高めよう", english: "Improve your vocabulary" },
    { japanese: "読解力を伸ばそう", english: "Develop your reading comprehension" },
    { japanese: "日本語でアニメを見よう", english: "Watch anime in Japanese" },
    { japanese: "日本の文化を学ぼう", english: "Learn about Japanese culture" }
  ];

  // Triple the phrases for continuous scrolling
  const allPhrases = [...japaneseExamples, ...japaneseExamples, ...japaneseExamples];

  // Features list
  const features = [
    {
      title: "Interactive Kana Practice",
      description: "Master hiragana and katakana with our interactive writing practice tool. Get instant feedback on your strokes.",
      icon: "✏️",
    },
    {
      title: "Vocabulary Builder",
      description: "Build your Japanese vocabulary with our spaced repetition system designed for optimal memory retention.",
      icon: "📚",
    },
    {
      title: "Conversation Scenarios",
      description: "Practice real-life Japanese conversations with interactive dialogues and pronunciation feedback.",
      icon: "💬",
    },
    {
      title: "Kanji Recognition",
      description: "Learn to recognize and write kanji characters with our progressive learning system.",
      icon: "🈁",
    },
    {
      title: "Grammar Lessons",
      description: "Learn Japanese grammar through clear explanations and practical examples.",
      icon: "📝",
    },
    {
      title: "Cultural Insights",
      description: "Understand the cultural context behind the language with interesting cultural notes.",
      icon: "🏮",
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Akshat.",
      comment: "KataHira helped me learn hiragana and katakana in just two weeks! The practice exercises make it stick.",
      role: "Beginner Learner",
      avatar: "A"
    },
    {
      name: "Vaibhav",
      comment: "As someone who already knew basic Japanese, KataHira's intermediate and advanced lessons really helped me improve my grammar.",
      role: "Intermediate Learner",
      avatar: "M"
    },
    
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Hiragana & Katakana lessons",
        "Basic vocabulary builder",
        "Limited practice exercises",
        "Community forum access"
      ],
      buttonText: "Start Free",
      highlighted: false
    },
    {
      name: "Premium",
      price: "$9.99/month",
      features: [
        "All Basic features",
        "Full kanji courses",
        "Unlimited practice exercises",
        "Conversation scenarios",
        "Progress tracking",
        "No ads"
      ],
      buttonText: "Try Free for 7 Days",
      highlighted: true
    },
    {
      name: "Pro",
      price: "$19.99/month",
      features: [
        "All Premium features",
        "1-on-1 tutor sessions",
        "Personalized learning path",
        "Pronunciation feedback",
        "Certificate of completion",
        "Priority support"
      ],
      buttonText: "Try Free for 14 Days",
      highlighted: false
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "How long does it take to learn basic Japanese?",
      answer: "With consistent practice on KataHira, most users can learn hiragana and katakana in 2-4 weeks, and basic conversational Japanese in 3-6 months."
    },
    {
      question: "Do I need any prior knowledge to start?",
      answer: "Not at all! KataHira is designed for complete beginners with no prior Japanese knowledge, but also has content for intermediate and advanced learners."
    },
    {
      question: "Can I use KataHira on my mobile device?",
      answer: "Yes, KataHira is fully responsive and works on all devices. "
    },
    {
      question: "How is KataHira different from other language learning apps?",
      answer: "KataHira focuses specifically on Japanese with specialized tools for learning kana and kanji. We also incorporate cultural context and real-world usage scenarios."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 30-day money-back guarantee for all paid subscriptions if you're not completely satisfied with your experience."
    }
  ];

  // Add custom CSS for animations on component mount
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes scrollUp {
        0% { transform: translateY(0); }
        100% { transform: translateY(-33.33%); }
      }
      
      .animate-scroll-1 {
        animation: scrollUp 20s linear infinite;
      }
      
      .animate-scroll-2 {
        animation: scrollUp 10s linear infinite;
      }
      
      .animate-scroll-3 {
        animation: scrollUp 15s linear infinite;
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
      }
      
      .animate-delay-1 {
        animation-delay: 0.2s;
      }
      
      .animate-delay-2 {
        animation-delay: 0.4s;
      }
      
      .animate-delay-3 {
        animation-delay: 0.6s;
      }
      
      .hover-scale:hover {
        transform: scale(1.03);
      }
      
      .hover-underline-animation {
        display: inline-block;
        position: relative;
      }
      
      .hover-underline-animation:after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 2px;
        bottom: -2px;
        left: 0;
        background-color: #b45309;
        transform-origin: bottom right;
        transition: transform 0.25s ease-out;
      }
      
      .hover-underline-animation:hover:after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };
  const openPanel = () => {
    if (authUser) {
      navigate("/home"); // Redirect to /home if user is already authenticated
    } else {
      setIsPanelOpen(true); // Otherwise, open login panel
    }
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-stone-50 text-stone-800">
      {/* Header - fixed at top */}
      <Header />

      {/* Hero section */}
      <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 px-4 bg-gradient-to-b from-stone-50 to-amber-50">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center max-w-4xl animate-fade-in">
          Master Japanese.
          <br className="hidden md:block" />
          <span className="text-amber-700">カタカナとひらがなを学びましょう。</span>
        </h1>

        <p className="text-lg md:text-xl mb-8 max-w-2xl text-center text-stone-600 animate-fade-in animate-delay-1">
          Free to use. Easy to learn. Just start and KataHira can help with writing, speaking, reading, and more.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in animate-delay-2">
          <button onClick={openPanel} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-medium flex items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            Start now <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>

        </div>
        {isPanelOpen && <Login closePanel={closePanel} />}
        {/* Scrolling examples - in hero section */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8" style={{ height: "400px" }}>
          {/* Left column */}
          <div className="relative h-full overflow-hidden rounded-xl shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-50 to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent z-10"></div>

            <div className="animate-scroll-1 absolute w-full">
              {allPhrases.map((item, index) => (
                <div key={`col1-${index}`} className="p-4 mb-3 rounded-lg bg-white bg-opacity-80 hover:bg-amber-50 transition-all duration-300 hover:shadow-sm">
                  <p className="text-lg font-medium text-stone-800">{item.japanese}</p>
                  <p className="text-sm text-stone-600">{item.english}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Middle column */}
          <div className="relative h-full overflow-hidden rounded-xl shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-50 to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent z-10"></div>

            <div className="animate-scroll-2 absolute w-full" style={{ animationDelay: '-10s' }}>
              {allPhrases.slice(4).concat(allPhrases.slice(0, 4)).map((item, index) => (
                <div key={`col2-${index}`} className="p-4 mb-3 rounded-lg bg-white bg-opacity-80 hover:bg-amber-50 transition-all duration-300 hover:shadow-sm">
                  <p className="text-lg font-medium text-stone-800">{item.japanese}</p>
                  <p className="text-sm text-stone-600">{item.english}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="relative h-full overflow-hidden rounded-xl shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-50 to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent z-10"></div>

            <div className="animate-scroll-3 absolute w-full" style={{ animationDelay: '-5s' }}>
              {allPhrases.slice(8).concat(allPhrases.slice(0, 8)).map((item, index) => (
                <div key={`col3-${index}`} className="p-4 mb-3 rounded-lg bg-white bg-opacity-80 hover:bg-amber-50 transition-all duration-300 hover:shadow-sm">
                  <p className="text-lg font-medium text-stone-800">{item.japanese}</p>
                  <p className="text-sm text-stone-600">{item.english}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-5xl font-bold mb-2 text-amber-700">1M+</div>
              <p className="text-lg text-stone-600">Active Learners</p>
            </div>
            <div className="text-center animate-fade-in animate-delay-1">
              <div className="text-5xl font-bold mb-2 text-amber-700">50K+</div>
              <p className="text-lg text-stone-600">Japanese Characters Mastered</p>
            </div>
            <div className="text-center animate-fade-in animate-delay-2">
              <div className="text-5xl font-bold mb-2 text-amber-700">4.8/5</div>
              <p className="text-lg text-stone-600">Average User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="w-full py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800">
            Everything You Need to Master Japanese
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl transition-all duration-300 hover-scale bg-white shadow-md hover:shadow-lg border border-stone-100 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4 text-amber-600">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-stone-800">{feature.title}</h3>
                <p className="text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning steps section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800">
            How KataHira Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div className="w-16 h-16 flex items-center justify-center rounded-full text-xl font-bold mb-4 bg-amber-600 text-white animate-float">1</div>
              <h3 className="text-xl font-bold mb-2 text-stone-800">Start With Kana</h3>
              <p className="text-stone-600">Begin by mastering hiragana and katakana through interactive exercises and memory games.</p>
            </div>

            <div className="flex flex-col items-center text-center animate-fade-in animate-delay-1">
              <div className="w-16 h-16 flex items-center justify-center rounded-full text-xl font-bold mb-4 bg-amber-600 text-white animate-float" style={{ animationDelay: '0.3s' }}>2</div>
              <h3 className="text-xl font-bold mb-2 text-stone-800">Build Vocabulary</h3>
              <p className="text-stone-600">Expand your vocabulary with our spaced repetition system and context-based learning.</p>
            </div>

            <div className="flex flex-col items-center text-center animate-fade-in animate-delay-2">
              <div className="w-16 h-16 flex items-center justify-center rounded-full text-xl font-bold mb-4 bg-amber-600 text-white animate-float" style={{ animationDelay: '0.6s' }}>3</div>
              <h3 className="text-xl font-bold mb-2 text-stone-800">Practice & Perfect</h3>
              <p className="text-stone-600">Apply what you've learned with conversation scenarios, writing practice, and cultural insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section id="testimonials" className="w-full py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800">
            What Our Learners Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white shadow-md transition-all duration-300 hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4 bg-amber-600 text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800">{testimonial.name}</h3>
                    <p className="text-sm text-stone-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-stone-600">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-stone-800">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg mb-12 text-center max-w-2xl mx-auto text-stone-600">
            Choose the plan that fits your learning goals. All plans include access to our community forum.
          </p>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl flex flex-col justify-between transition-all duration-300 hover-scale ${plan.highlighted
                  ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-xl transform hover:-translate-y-2'
                  : 'bg-white border border-stone-200 shadow-md'
                  } animate-fade-in`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-4">{plan.price}</div>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={openPanel}
                  className={`w-full py-3 rounded-full font-medium mt-4 transition-all duration-300 ${plan.highlighted
                    ? 'bg-white text-amber-600 hover:bg-stone-100 hover:shadow-md'
                    : 'bg-amber-600 hover:bg-amber-700 text-white hover:shadow-md'
                    }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* FAQ section */}
      <section id="faq" className="w-full py-16 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden bg-white shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  className={`w-full p-4 text-left font-medium flex justify-between items-center hover-underline-animation ${activeAccordion === index ? 'text-amber-700' : 'text-stone-800'}`}
                  onClick={() => toggleAccordion(index)}
                >
                  {item.question}
                  <span className="text-amber-600">{activeAccordion === index ? '−' : '+'}</span>
                </button>
                {activeAccordion === index && (
                  <div className="p-4 pt-0 text-stone-600 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-16 bg-gradient-to-br from-amber-600 to-amber-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Ready to Start Your Japanese Journey?
          </h2>
          <p className="text-lg mb-8 animate-fade-in animate-delay-1">
            Join over 1 million learners who are mastering Japanese with KataHira today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in animate-delay-2">
            <button onClick={()=>navigate("/home")} className="bg-white hover:bg-stone-100 text-amber-700 px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Get Started for Free
            </button>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-stone-800 text-stone-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4 text-amber-500">KataHira</div>
              <p className="mb-4">Making Japanese language learning accessible, effective, and enjoyable for everyone.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-amber-400 transition-colors">📘</a>
                <a href="#" className="hover:text-amber-400 transition-colors">📱</a>
                <a href="#" className="hover:text-amber-400 transition-colors">🐦</a>
                <a href="#" className="hover:text-amber-400 transition-colors">📸</a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Learn</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Hiragana</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Katakana</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Kanji</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Vocabulary</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Grammar</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about"  className="hover:text-amber-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact"  className="hover:text-amber-400 transition-colors">Contact</Link></li>
                
              </ul>
            </div>

            
          </div>
          <div className="pt-8 border-t border-stone-700 flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">© 2025 KataHira. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-amber-400 transition-colors">English</a>
              <a href="#" className="hover:text-amber-400 transition-colors">日本語</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;