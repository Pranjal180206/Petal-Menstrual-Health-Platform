import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Sparkles } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const STARTER_PROMPTS = [
    "What causes period cramps?",
    "How do I track my cycle?",
    "Why is my period irregular?",
    "What foods help with PMS?",
];

const LANGUAGE_OPTIONS = [
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'hi', label: '🇮🇳 HI' },
    { code: 'es', label: '🇪🇸 ES' },
    { code: 'fr', label: '🇫🇷 FR' },
];

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! 🌸 I'm Petal's AI assistant. Ask me anything about your cycle or symptoms!",
        },
    ]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('en');
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setHasUnread(false);
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                inputRef.current?.focus();
            }, 100);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || isLoading) return;

        const history = messages.map(m => ({ role: m.role, content: m.content }));
        const userMsg = { role: 'user', content: trimmed };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axiosInstance.post('/chatbot/message', {
                message: trimmed,
                conversation_history: history,
                language,
            });
            const reply =
                res.data?.reply ||
                res.data?.message ||
                res.data?.response ||
                'Sorry, I could not generate a response.';
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            if (!open) setHasUnread(true);
        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* ── Chat Window ── */}
            {open && (
                <div
                    className="fixed bottom-24 right-6 z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                    style={{
                        width: '360px',
                        height: '500px',
                        animation: 'chatWidgetIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards',
                    }}
                >
                    <style>{`
                        @keyframes chatWidgetIn {
                            from { opacity: 0; transform: scale(0.85) translateY(20px); transform-origin: bottom right; }
                            to   { opacity: 1; transform: scale(1)    translateY(0);    transform-origin: bottom right; }
                        }
                    `}</style>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#D81B60] to-[#F06292] shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                                <Sparkles size={13} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm leading-none">Petal AI</p>
                                <p className="text-white/70 text-[10px] font-medium">Ask about your health</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={language}
                                onChange={e => setLanguage(e.target.value)}
                                className="text-[10px] font-bold bg-white/20 text-white border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
                            >
                                {LANGUAGE_OPTIONS.map(l => (
                                    <option key={l.code} value={l.code} className="text-gray-800 bg-white">
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                            >
                                <Minimize2 size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                    msg.role === 'assistant'
                                        ? 'bg-gradient-to-br from-[#D81B60] to-[#F06292] text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {msg.role === 'assistant' ? <Bot size={11} /> : <User size={11} />}
                                </div>
                                <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs font-medium leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-[#D81B60] text-white rounded-tr-sm'
                                        : 'bg-[#F7F8FA] text-[#1D1D2C] rounded-tl-sm'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D81B60] to-[#F06292] text-white flex items-center justify-center shrink-0">
                                    <Bot size={11} />
                                </div>
                                <div className="bg-[#F7F8FA] rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1.5">
                                    <Loader2 size={11} className="text-[#D81B60] animate-spin" />
                                    <span className="text-[10px] text-gray-400 font-medium">Thinking…</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Starter prompts — only on first message */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                            {STARTER_PROMPTS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => sendMessage(p)}
                                    className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#D81B60]/30 text-[#D81B60] bg-[#FFF0F4] hover:bg-[#FFE4EE] transition-colors"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t border-gray-100 flex gap-2 shrink-0">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything…"
                            disabled={isLoading}
                            className="flex-1 bg-[#F7F8FA] border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#D81B60] transition-colors"
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                            className="w-9 h-9 rounded-xl bg-[#D81B60] hover:bg-[#C2185B] disabled:bg-gray-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0"
                        >
                            {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Floating Button ── */}
            <button
                onClick={() => setOpen(v => !v)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #D81B60, #F06292)' }}
                title="AI Health Assistant"
            >
                {open ? (
                    <X size={22} className="text-white" />
                ) : (
                    <>
                        <MessageSquare size={22} className="text-white" />
                        {hasUnread && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                        )}
                    </>
                )}
            </button>
        </>
    );
};

export default ChatWidget;
