import { useState, useEffect, useRef } from 'react';
import { useAiStore } from '../store/useAiStore'; // adjust path
import { useAuthStore } from '../store/useAuthStore';
const AiTutor = () => {
    const { messages, addMessage, loadHistory, clearHistory, userId, setUserId } = useAiStore();
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTranslation, setShowTranslation] = useState({});
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { authUser, checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (authUser === null && location.pathname !== "/") {
            navigate("/", { replace: true });
        }
    }, [authUser, location.pathname]);
    // Sample conversation starters
    useEffect(() => {
        if (authUser?._id) {
            setUserId(authUser._id);           // <-- store the userId in Zustand
            // loadHistory(authUser._id);         // <-- optional: load previous chat history
        }
    }, [authUser, setUserId, loadHistory]);

    const conversationStarters = [
        "How do I introduce myself in Japanese?",
        "What's the difference between は and が?",
        "Teach me basic greetings",
        "How do I count in Japanese?",
        "Explain hiragana to me",
        "What are some common phrases?",
        "How do I say 'thank you' politely?",
        "Tell me about Japanese culture"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;
        setIsLoading(true);

        const userMessage = { 
            type: 'student',
            content: inputMessage,
            timestamp: new Date()
        };

        try {
            await addMessage(userMessage);
            setInputMessage('');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleTranslation = (messageId) => {
        setShowTranslation(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

    const handleStarterClick = (starter) => {
        setInputMessage(starter);
        inputRef.current?.focus();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-md border-b border-amber-100">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            田
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-stone-800">田中先生 (Tanaka-sensei)</h1>
                            <p className="text-stone-600">Your Personal Japanese Tutor</p>
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-stone-600">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'student' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-3xl ${message.type === 'student' ? 'order-2' : 'order-1'}`}>
                                {message.type === 'tutor' && (
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            田
                                        </div>
                                        <span className="text-sm font-medium text-stone-700">田中先生</span>
                                        <span className="text-xs text-stone-500">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}

                                <div className={`px-6 py-4 rounded-2xl shadow-sm ${message.type === 'student'
                                    ? 'bg-amber-600 text-white ml-12'
                                    : 'bg-white text-stone-800 border border-amber-100'
                                    }`}>
                                    <div className="prose prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                    </div>

                                    {message.translation && (
                                        <div className="mt-3 pt-3 border-t border-amber-200">
                                            <button
                                                onClick={() => toggleTranslation(message.id)}
                                                className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                                            >
                                                {showTranslation[message.id] ? 'Hide Translation' : 'Show Translation'}
                                            </button>
                                            {showTranslation[message.id] && (
                                                <p className="text-sm text-amber-700 mt-2 italic">{message.translation}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {message.type === 'student' && (
                                    <div className="flex items-center justify-end space-x-2 mt-2">
                                        <span className="text-xs text-stone-500">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <div className="w-6 h-6 bg-stone-300 rounded-full flex items-center justify-center text-xs font-bold text-stone-600">
                                            You
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-3xl order-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        田
                                    </div>
                                    <span className="text-sm font-medium text-stone-700">田中先生</span>
                                    <span className="text-xs text-stone-500">typing...</span>
                                </div>

                                <div className="px-6 py-4 rounded-2xl bg-white text-stone-800 border border-amber-100 shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Conversation Starters */}
                {messages.length === 1 && (
                    <div className="mb-6">
                        <p className="text-sm text-stone-600 mb-3 text-center">💡 Try asking me about:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {conversationStarters.slice(0, 4).map((starter, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleStarterClick(starter)}
                                    className="px-3 py-2 text-sm bg-white hover:bg-amber-50 text-stone-700 rounded-full border border-amber-200 transition-all duration-200 hover:shadow-sm hover:border-amber-300"
                                >
                                    {starter}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-4">
                    <div className="flex space-x-4 items-end">
                        <div className="flex-1">
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about Japanese! (in English or Japanese)"
                                className="w-full resize-none border-none outline-none text-stone-800 placeholder-stone-500 bg-transparent"
                                rows="1"
                                style={{ minHeight: '24px', maxHeight: '120px' }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white p-3 rounded-xl transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                        <div className="flex items-center space-x-4 text-xs text-stone-500">
                            <span>Press Enter to send</span>
                            <span>•</span>
                            <span>Shift + Enter for new line</span>
                        </div>
                        <div className="text-xs text-stone-500">
                            Powered by AI • Learning Japanese made easy
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Help Button */}
            <div className="fixed bottom-6 right-6">
                <button className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
            </div>

            {/* Custom styles for animations */}
            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .message-enter {
          animation: fadeInUp 0.3s ease-out;
        }
        
        .typing-indicator {
          animation: pulse 1.5s infinite;
        }
      `}</style>
        </div>
    );
};

export default AiTutor;