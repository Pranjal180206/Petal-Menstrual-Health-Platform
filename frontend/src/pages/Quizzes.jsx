import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosInstance from '../api/axiosInstance';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../utils/translation';

const Quizzes = () => {
    const darkMode = false;
    const { t, i18n } = useTranslation();
    const lang = i18n.language || 'en';

    // quiz states
    const [quizzes, setQuizzes] = useState([]);
    const [isQuizzesLoading, setIsQuizzesLoading] = useState(true);

    const [activeQuiz, setActiveQuiz] = useState(null);
    const [isQuizDetailLoading, setIsQuizDetailLoading] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
    const [quizResult, setQuizResult] = useState(null);

    // On mount and language change
    useEffect(() => {
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

        fetchQuizzes();
    }, [lang]); // Re-fetch when language changes

    const handleOpenQuiz = async (quizId) => {
        setIsQuizDetailLoading(true);
        setActiveQuiz(null);
        setQuizAnswers({});
        setQuizResult(null);
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
        if (quizResult) return; 
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

    return (
        <div
            className="font-display min-h-screen relative transition-colors duration-500"
            style={{ background: darkMode ? '#0f1117' : undefined }}
        >
            <Navbar />

            <div className="layout-container flex h-full grow flex-col">
                <main className="max-w-[1400px] mx-auto w-full px-6 py-10">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-start gap-6 mb-12 px-4 max-w-2xl">
                        <span
                            className="inline-block px-5 py-2 rounded-full text-base font-black uppercase tracking-widest"
                            style={{
                                background: darkMode ? 'rgba(244,114,182,0.15)' : 'rgba(255,107,157,0.15)',
                                color: darkMode ? '#f472b6' : '#e63888',
                            }}
                        >
                            {t('quizzes.badge')}
                        </span>
                        <h1
                            className="text-5xl md:text-6xl font-black leading-[1.1]"
                            style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                        >
                            {t('quizzes.title')}
                        </h1>
                        <p
                            className="text-lg font-medium leading-relaxed"
                            style={{ color: darkMode ? '#94a3b8' : '#475569' }}
                        >
                            {t('quizzes.subtitle')}
                        </p>
                    </div>

                    <div className="min-h-[400px]">
                        {!activeQuiz && !isQuizDetailLoading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isQuizzesLoading ? (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('quizzes.loading')}</p>
                                ) : quizzes.length > 0 ? (
                                    quizzes.map(q => {
                                        const quizTitle = getLocalizedText(q.title, lang, t('quizzes.untitledQuiz'));
                                        const quizDesc = getLocalizedText(q.description, lang, '');
                                        
                                        return (
                                        <div key={q.id} className={`p-6 rounded-3xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} flex flex-col shadow-sm`}>
                                            <h3 className={`text-xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{quizTitle}</h3>
                                            <p className={`text-sm mb-4 flex-grow ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{quizDesc}</p>
                                            
                                            <div className="flex justify-between items-center mb-6 text-sm">
                                                <span className={`px-3 py-1 rounded-full font-bold bg-pink-100 text-pink-600`}>
                                                    {q.questions?.length > 0 ? `${q.questions.length} ${t('quizzes.questionsSuffix')}` : `5 ${t('quizzes.questionsSuffix')}`}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full font-bold bg-blue-100 text-blue-600`}>
                                                    {q.difficulty || t('quizzes.defaultDifficulty')}
                                                </span>
                                            </div>

                                            <button 
                                                onClick={() => handleOpenQuiz(q.id)}
                                                className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${darkMode ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-[#FF6B9D] text-white hover:opacity-90'}`}
                                            >
                                                {t('quizzes.startQuiz')}
                                            </button>
                                        </div>
                                        );
                                    })
                                ) : (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('quizzes.noQuizzes')}</p>
                                )}
                            </div>
                        )}

                        {/* ACTIVE QUIZ DETAIL SECTION */}
                        {isQuizDetailLoading && <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('quizzes.loadingDetails')}</p>}

                        {activeQuiz && (
                            <div className="max-w-3xl">
                                <button 
                                    onClick={() => { setActiveQuiz(null); setQuizResult(null); setQuizAnswers({}); }}
                                    className="mb-6 flex items-center gap-2 text-pink-500 font-bold hover:text-pink-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                    {t('quizzes.backToAll')}
                                </button>

                                <div className={`p-8 rounded-3xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} shadow-sm`}>
                                    <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {getLocalizedText(activeQuiz.title, lang, t('quizzes.defaultQuizTitle'))}
                                    </h2>
                                    <p className={`text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {getLocalizedText(activeQuiz.description, lang, '')}
                                    </p>
                                    
                                    <div className="flex flex-col gap-8">
                                        {activeQuiz.questions?.map((q, idx) => {
                                            const resultForQuestion = quizResult?.results?.find(r => r.question_id === q.id);
                                            const questionText = getLocalizedText(q.text, lang);
                                            
                                            return (
                                                <div key={q.id} className="flex flex-col gap-4">
                                                    <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                                        {idx + 1}. {questionText}
                                                    </h4>
                                                    <div className="flex flex-col gap-3">
                                                        {q.options?.map(opt => {
                                                            const isSelected = quizAnswers[q.id] === opt.id;
                                                            const isCorrectOption = resultForQuestion?.is_correct && isSelected;
                                                            const isWrongOption = resultForQuestion && !resultForQuestion.is_correct && isSelected;
                                                            const optionText = getLocalizedText(opt.text, lang);

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
                                                                    {optionText}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                    {resultForQuestion && (
                                                        <div className={`p-4 rounded-xl mt-2 text-sm ${resultForQuestion.is_correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                                            <span className="font-bold block mb-1">
                                                                {resultForQuestion.is_correct ? t('quizzes.correct') : t('quizzes.incorrect')}
                                                            </span>
                                                            {getLocalizedText(resultForQuestion.explanation, lang)}
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
                                            {isSubmittingQuiz ? t('quizzes.submitting') : t('quizzes.submitAnswers')}
                                        </button>
                                    ) : (
                                        <div className="mt-10 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
                                            <h3 className="text-2xl font-black mb-2 dark:text-white">{t('quizzes.results')} {quizResult.score_percentage}%</h3>
                                            <p className={`font-bold text-lg ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                {quizResult.passed ? t('quizzes.passed') : t('quizzes.failed')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Quizzes;
