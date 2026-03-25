import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, X } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const LANGUAGE_OPTIONS = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
];

const STARTER_PROMPTS = [
    "What are common PMS symptoms?",
    "How do I track my cycle accurately?",
    "Why is my period irregular?",
    "What foods help with period cramps?",
];

const Chatbot = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi there! 🌸 I'm Petal's AI health assistant. Ask me anything about menstrual health, cycle tracking, or symptoms. I'm here to help!",
        },
    ]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('en');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || isLoading) return;

        const userMsg = { role: 'user', content: trimmed };
        const history = messages.map(m => ({ role: m.role, content: m.content }));

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axiosInstance.post('/chatbot/message', {
                message: trimmed,
                conversation_history: history,
                language,
            });
            const reply = res.data?.reply || res.data?.message || res.data?.response || 'Sorry, I could not generate a response.';
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '⚠️ Something went wrong. Please try again in a moment.' },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            { role: 'assistant', content: "Hi there! 🌸 I'm Petal's AI health assistant. Ask me anything about menstrual health, cycle tracking, or symptoms. I'm here to help!" },
        ]);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto h-full flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
            {/* Header */}
            <header className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center text-[#D81B60]">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-heading font-extrabold text-[#1D1D2C]">Petal AI Assistant</h1>
                        <p className="text-xs text-gray-400 font-medium">Ask me anything about your cycle health</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="text-xs font-bold bg-[#F7F8FA] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#D81B60] transition-colors"
                    >
                        {LANGUAGE_OPTIONS.map(l => (
                            <option key={l.code} value={l.code}>{l.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={clearChat}
                        title="Clear chat"
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-200 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            </header>

            {/* Chat window */}
            <div className="flex-1 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                msg.role === 'assistant'
                                    ? 'bg-gradient-to-br from-[#D81B60] to-[#F06292] text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                            </div>
                            {/* Bubble */}
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed ${
                                msg.role === 'user'
                                    ? 'bg-[#D81B60] text-white rounded-tr-sm'
                                    : 'bg-[#F7F8FA] text-[#1D1D2C] rounded-tl-sm'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D81B60] to-[#F06292] text-white flex items-center justify-center shrink-0">
                                <Bot size={14} />
                            </div>
                            <div className="bg-[#F7F8FA] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                                <Loader2 size={14} className="text-[#D81B60] animate-spin" />
                                <span className="text-xs text-gray-400 font-medium">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Starter prompts */}
                {messages.length === 1 && (
                    <div className="px-6 pb-4">
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Try asking</p>
                        <div className="flex flex-wrap gap-2">
                            {STARTER_PROMPTS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => sendMessage(p)}
                                    className="text-xs font-bold px-3 py-1.5 rounded-full border border-[#D81B60]/30 text-[#D81B60] bg-[#FFF0F4] hover:bg-[#FFE4EE] transition-colors"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input row */}
                <div className="p-4 border-t border-gray-100 flex gap-3 shrink-0">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me about your cycle, symptoms, or health..."
                        rows={1}
                        className="flex-1 bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors resize-none scrollbar-hide"
                        style={{ fontFamily: 'inherit' }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className="w-12 h-12 rounded-xl bg-[#D81B60] hover:bg-[#C2185B] disabled:bg-gray-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0 self-end"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </div>
            </div>

            <p className="text-center text-[10px] text-gray-400 font-medium mt-3">
                AI responses are for informational purposes only. Always consult a healthcare professional. 🌸
            </p>
        </div>
    );
};

export default Chatbot;
