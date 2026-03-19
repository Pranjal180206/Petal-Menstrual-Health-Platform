import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosInstance from '../api/axiosInstance';

const Education = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [onboardingDone, setOnboardingDone] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const heroRef = React.useRef(null);
    const contentRef = React.useRef(null);

    // Active Tab: 'articles', 'myths', 'quizzes', 'quizDetail'
    const [activeTab, setActiveTab] = useState('articles');

    // Data States
    const [articles, setArticles] = useState([]);
    const [isArticlesLoading, setIsArticlesLoading] = useState(true);

    const [myths, setMyths] = useState([]);
    const [isMythsLoading, setIsMythsLoading] = useState(true);

    const [quizzes, setQuizzes] = useState([]);
    const [isQuizzesLoading, setIsQuizzesLoading] = useState(true);

    // active quiz states
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [isQuizDetailLoading, setIsQuizDetailLoading] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
    const [quizResult, setQuizResult] = useState(null);

    const handleSkipIntro = () => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleFinishOnboarding = () => {
        setOnboardingDone(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
    };

    // On mount
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axiosInstance.get('/education/articles');
                setArticles(res.data);
            } catch (err) {
                console.error("Error fetching articles:", err);
            } finally {
                setIsArticlesLoading(false);
            }
        };

        const fetchMyths = async () => {
            try {
                const res = await axiosInstance.get('/education/myth-facts');
                setMyths(res.data);
            } catch (err) {
                console.error("Error fetching myths:", err);
            } finally {
                setIsMythsLoading(false);
            }
        };

        const fetchQuizzes = async () => {
            try {
                const res = await axiosInstance.get('/quizzes/');
                setQuizzes(res.data);
            } catch (err) {
                console.error("Error fetching quizzes:", err);
            } finally {
                setIsQuizzesLoading(false);
            }
        };

        fetchArticles();
        fetchMyths();
        fetchQuizzes();
    }, []);

    const handleOpenQuiz = async (quizId) => {
        setIsQuizDetailLoading(true);
        setActiveQuiz(null);
        setQuizAnswers({});
        setQuizResult(null);
        setActiveTab('quizDetail');
        try {
            const res = await axiosInstance.get(`/quizzes/${quizId}`);
            setActiveQuiz(res.data);
        } catch (err) {
            console.error("Error fetching quiz detail:", err);
        } finally {
            setIsQuizDetailLoading(false);
        }
    };

    const handleSelectOption = (questionId, optionId) => {
        if (quizResult) return; // Cannot change after submit
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmitQuiz = async () => {
        if (!activeQuiz) return;
        setIsSubmittingQuiz(true);
        try {
            const formattedAnswers = Object.entries(quizAnswers).map(([qId, optId]) => ({
                question_id: qId,
                selected_option_id: optId
            }));
            const res = await axiosInstance.post(`/quizzes/${activeQuiz.id}/submit`, {
                answers: formattedAnswers
            });
            setQuizResult(res.data);
        } catch (err) {
            console.error("Error submitting quiz:", err);
        } finally {
            setIsSubmittingQuiz(false);
        }
    };

    // UI Helpers
    const tabClass = (tabName) => {
        const isActive = activeTab === tabName;
        return `px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
            isActive 
                ? (darkMode ? 'bg-pink-500 text-white shadow-lg' : 'bg-[#FF6B9D] text-white shadow-lg')
                : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
        }`;
    };

    return (
        <div
            className="font-display min-h-screen relative transition-colors duration-500"
            style={{ background: darkMode ? '#0f1117' : undefined }}
        >
            <Navbar />

            {/* Success Toast */}
            {showToast && (
                <div
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl"
                    style={{ background: darkMode ? '#1e293b' : '#0f172a' }}
                >
                    <span className="material-symbols-outlined" style={{ color: '#f472b6' }}>check_circle</span>
                    <span className="text-sm font-black uppercase tracking-widest text-white">
                        Onboarding Complete! Welcome to the Hub 🎉
                    </span>
                </div>
            )}

            <div className="layout-container flex h-full grow flex-col">
                <main className="max-w-[1400px] mx-auto w-full px-6 py-10">
                    
                    {/* Hero */}
                    <div ref={heroRef} className="flex flex-col items-start gap-6 mb-12 px-4 max-w-2xl">
                        <span
                            className="inline-block px-5 py-2 rounded-full text-base font-black uppercase tracking-widest"
                            style={{
                                background: darkMode ? 'rgba(244,114,182,0.15)' : 'rgba(255,107,157,0.15)',
                                color: darkMode ? '#f472b6' : '#e63888',
                            }}
                        >
                            Education Hub
                        </span>
                        <h1
                            className="text-5xl md:text-6xl font-black leading-[1.1]"
                            style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                        >
                            Learn your rhythm.{' '}
                            <span style={{ color: darkMode ? '#f472b6' : '#FF6B9D' }}>
                                Live your flow.
                            </span>
                        </h1>
                        <p
                            className="text-lg font-medium leading-relaxed"
                            style={{ color: darkMode ? '#94a3b8' : '#475569' }}
                        >
                            No taboos, just the real talk you need about your body and health. Choose a section below to get started.
                        </p>
                    </div>

                    <div ref={contentRef} className="mb-8 flex flex-wrap gap-4 px-2">
                        <button onClick={() => setActiveTab('articles')} className={tabClass('articles')}>Articles</button>
                        <button onClick={() => setActiveTab('myths')} className={tabClass('myths')}>Myths & Facts</button>
                        <button onClick={() => setActiveTab('quizzes')} className={tabClass('quizzes')}>Quizzes</button>
                        {activeTab === 'quizDetail' && (
                            <button className={tabClass('quizDetail')}>Active Quiz</button>
                        )}
                    </div>

                    <div className="min-h-[400px]">
                        {/* ARTICLES SECTION */}
                        {activeTab === 'articles' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isArticlesLoading ? (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Loading articles...</p>
                                ) : articles.length > 0 ? (
                                    articles.map(a => (
                                        <div key={a.id} className={`p-6 rounded-3xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} shadow-sm`}>
                                            <h3 className={`text-xl font-black mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{a.title}</h3>
                                            <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{a.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>No articles found.</p>
                                )}
                            </div>
                        )}

                        {/* MYTHS & FACTS SECTION */}
                        {activeTab === 'myths' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isMythsLoading ? (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Loading myths and facts...</p>
                                ) : myths.length > 0 ? (
                                    myths.map(m => (
                                        <div key={m.id} className={`p-6 rounded-3xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} flex flex-col gap-4 shadow-sm`}>
                                            <div>
                                                <span className="text-xs font-black uppercase tracking-widest text-pink-500 mb-1 block">Myth</span>
                                                <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{m.myth}</p>
                                            </div>
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-900' : 'bg-green-50'}`}>
                                                <span className="text-xs font-black uppercase tracking-widest text-green-600 mb-1 block">Fact</span>
                                                <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{m.fact}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>No myths found.</p>
                                )}
                            </div>
                        )}

                        {/* QUIZZES LIST SECTION */}
                        {activeTab === 'quizzes' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isQuizzesLoading ? (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Loading quizzes...</p>
                                ) : quizzes.length > 0 ? (
                                    quizzes.map(q => (
                                        <div key={q.id} className={`p-6 rounded-3xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} flex flex-col shadow-sm`}>
                                            <h3 className={`text-xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{q.title?.en || 'Untitled Quiz'}</h3>
                                            <p className={`text-sm mb-6 flex-grow ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{q.description?.en || ''}</p>
                                            <button 
                                                onClick={() => handleOpenQuiz(q.id)}
                                                className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${darkMode ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-[#FF6B9D] text-white hover:opacity-90'}`}
                                            >
                                                Start Quiz
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>No quizzes found.</p>
                                )}
                            </div>
                        )}

                        {/* ACTIVE QUIZ DETAIL SECTION */}
                        {activeTab === 'quizDetail' && (
                            <div className="max-w-3xl">
                                {isQuizDetailLoading ? (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Loading quiz details...</p>
                                ) : activeQuiz ? (
                                    <div className={`p-8 rounded-3xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} shadow-sm`}>
                                        <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{activeQuiz.title?.en || 'Quiz'}</h2>
                                        <p className={`text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{activeQuiz.description?.en || ''}</p>
                                        
                                        <div className="flex flex-col gap-8">
                                            {activeQuiz.questions?.map((q, idx) => {
                                                const resultForQuestion = quizResult?.results?.find(r => r.question_id === q.id);
                                                return (
                                                    <div key={q.id} className="flex flex-col gap-4">
                                                        <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                                            {idx + 1}. {q.text?.en ?? q.text}
                                                        </h4>
                                                        <div className="flex flex-col gap-3">
                                                            {q.options?.map(opt => {
                                                                const isSelected = quizAnswers[q.id] === opt.id;
                                                                const isCorrectOption = resultForQuestion?.is_correct && isSelected;
                                                                const isWrongOption = resultForQuestion && !resultForQuestion.is_correct && isSelected;

                                                                let bgClass = darkMode ? 'bg-slate-900 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100';
                                                                if (isSelected) bgClass = darkMode ? 'bg-slate-700 ring-2 ring-pink-500' : 'bg-pink-50 ring-2 ring-pink-500';
                                                                if (quizResult && isCorrectOption) bgClass = 'bg-green-100 ring-2 ring-green-500 text-green-900';
                                                                if (quizResult && isWrongOption) bgClass = 'bg-red-100 ring-2 ring-red-500 text-red-900';

                                                                return (
                                                                    <button
                                                                        key={opt.id}
                                                                        disabled={!!quizResult}
                                                                        onClick={() => handleSelectOption(q.id, opt.id)}
                                                                        className={`text-left p-4 rounded-2xl transition-all ${bgClass} ${darkMode && !quizResult && !isSelected ? 'text-slate-300' : (isSelected && !quizResult && !darkMode && 'text-slate-900')} ${!darkMode && !isSelected && 'text-slate-700'}`}
                                                                    >
                                                                        {opt.text?.en ?? opt.text}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                        {resultForQuestion && (
                                                            <div className={`p-4 rounded-xl mt-2 text-sm ${resultForQuestion.is_correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                                                <span className="font-bold block mb-1">
                                                                    {resultForQuestion.is_correct ? '✅ Correct' : '❌ Incorrect'}
                                                                </span>
                                                                {resultForQuestion.explanation?.en}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {!quizResult ? (
                                            <button 
                                                onClick={handleSubmitQuiz}
                                                disabled={isSubmittingQuiz || Object.keys(quizAnswers).length < (activeQuiz.questions?.length || 0)}
                                                className={`mt-10 w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isSubmittingQuiz || Object.keys(quizAnswers).length < (activeQuiz.questions?.length || 0) ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-500' : 'bg-pink-500 text-white hover:bg-pink-600 shadow-lg'}`}
                                            >
                                                {isSubmittingQuiz ? 'Submitting...' : 'Submit Answers'}
                                            </button>
                                        ) : (
                                            <div className="mt-10 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
                                                <h3 className="text-2xl font-black mb-2 dark:text-white">Results: {quizResult.score_percentage}%</h3>
                                                <p className={`font-bold text-lg ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                    {quizResult.passed ? 'You passed!' : 'Keep learning and try again!'}
                                                </p>
                                                <button 
                                                    onClick={() => setActiveTab('quizzes')}
                                                    className="mt-6 px-6 py-2 rounded-full border-2 border-slate-300 dark:border-slate-600 font-bold dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                                >
                                                    Back to Quizzes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Quiz not found.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Accessibility Bar */}
                    <div
                        className="mt-16 rounded-3xl p-8 border-2 flex flex-col md:flex-row items-center justify-between gap-8 transition-colors duration-500"
                        style={{
                            background: darkMode ? '#1e293b' : 'white',
                            borderColor: darkMode ? '#334155' : '#fda4af',
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <h5
                                className="text-lg font-black"
                                style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                            >
                                Accessibility First
                            </h5>
                            <p
                                className="text-sm font-medium"
                                style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                            >
                                {darkMode
                                    ? '🌙 Dark mode is on — easy on the eyes.'
                                    : 'Customize your reading experience for maximum comfort.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                            {/* Dark Mode Toggle */}
                            <label
                                className="inline-flex items-center cursor-pointer px-4 py-2 rounded-2xl transition-colors"
                                style={{
                                    background: darkMode ? '#0f172a' : '#f8fafc',
                                    border: darkMode ? '1px solid #334155' : '1px solid transparent',
                                }}
                            >
                                <input
                                    className="sr-only peer"
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={() => setDarkMode(v => !v)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500 relative"></div>
                                <span
                                    className="ms-3 text-sm font-bold"
                                    style={{ color: darkMode ? '#e2e8f0' : '#374151' }}
                                >
                                    🌙 Dark Mode
                                </span>
                            </label>

                            {/* Skip Intro */}
                            <button
                                onClick={handleSkipIntro}
                                className="font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
                                style={{ color: '#94a3b8' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#f472b6'}
                                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                            >
                                Check Content
                                <span className="material-symbols-outlined text-sm">fast_forward</span>
                            </button>

                            {/* Finish Onboarding */}
                            <button
                                onClick={handleFinishOnboarding}
                                disabled={onboardingDone}
                                className="px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all"
                                style={
                                    onboardingDone
                                        ? {
                                            background: darkMode ? '#1e293b' : '#e2e8f0',
                                            color: darkMode ? '#475569' : '#94a3b8',
                                            cursor: 'not-allowed',
                                        }
                                        : {
                                            background: '#FF6B9D',
                                            color: 'white',
                                            boxShadow: '0 8px 24px rgba(255,107,157,0.3)',
                                        }
                                }
                            >
                                {onboardingDone ? '✓ Completed' : 'Finish Onboarding'}
                            </button>
                        </div>
                    </div>

                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Education;