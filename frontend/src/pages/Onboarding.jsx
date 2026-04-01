import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';
import LanguageSelector from '../components/LanguageSelector';
import { 
    ChevronRight, 
    ChevronLeft, 
    Check, 
    Calendar,
    ArrowRight,
    Heart,
    Baby,
    User,
    Brain,
    Handshake,
    BookOpen
} from 'lucide-react';

const Onboarding = () => {
    const { t } = useTranslation();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    
    // Step state: 0 = Gender selection, 1 = Questionnaire
    const [step, setStep] = useState(0);
    const [gender, setGender] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const girlQuestions = [
        { id: 'q1', type: 'date', category: 'period', headerKey: 'q1Header', questionKey: 'q1' },
        { id: 'q2', type: 'select', category: 'period', questionKey: 'q2', optionsKey: 'q2_opts' },
        { id: 'q3', type: 'select', category: 'period', questionKey: 'q3', optionsKey: 'q3_opts' },
        { id: 'q4', type: 'select', category: 'period', questionKey: 'q4', optionsKey: 'q4_opts' },
        { id: 'q5', type: 'select', category: 'flow', headerKey: 'q5Header', introKey: 'q5Intro', questionKey: 'q5', optionsKey: 'flow_opts' },
        { id: 'q6', type: 'select', category: 'flow', questionKey: 'q6', optionsKey: 'flow_opts' },
        { id: 'q7', type: 'select', category: 'flow', questionKey: 'q7', optionsKey: 'flow_opts' },
        { id: 'q8', type: 'select', category: 'flow', questionKey: 'q8', optionsKey: 'q8_opts' },
        { id: 'q9', type: 'select', category: 'flow', questionKey: 'q9', optionsKey: 'q9_opts' },
        { id: 'q10', type: 'select', category: 'flow', questionKey: 'q10', optionsKey: 'q10_opts' },
        { id: 'q11', type: 'select', category: 'pattern', headerKey: 'q11Header', questionKey: 'q11', optionsKey: 'q11_opts' },
        { id: 'q12', type: 'select', category: 'unusual', headerKey: 'q12Header', questionKey: 'q12', optionsKey: 'q12_opts' },
        { id: 'q13', type: 'age', category: 'about', headerKey: 'q13Header', questionKey: 'q13' },
    ];

    const boyQuestions = [
        { id: 'bq1', type: 'age', category: 'about', headerKey: 'q1Header', questionKey: 'q1' },
        { id: 'bq2', type: 'select', category: 'awareness', headerKey: 'q2Header', questionKey: 'q2', optionsKey: 'q2_opts' },
        { id: 'bq3', type: 'select', category: 'awareness', questionKey: 'q3', optionsKey: 'q3_opts' },
        { id: 'bq4', type: 'select', category: 'attitute', headerKey: 'q4Header', questionKey: 'q4', optionsKey: 'q4_opts' },
        { id: 'bq5', type: 'select', category: 'attitute', questionKey: 'q5', optionsKey: 'q5_opts' },
        { id: 'bq6', type: 'select', category: 'support', headerKey: 'q6Header', questionKey: 'q6', optionsKey: 'q6_opts' },
        { id: 'bq7', type: 'select', category: 'support', questionKey: 'q7', optionsKey: 'q7_opts' },
        { id: 'bq8', type: 'select', category: 'learning', headerKey: 'q8Header', questionKey: 'q8', optionsKey: 'q8_opts' },
    ];

    const activeQuestions = gender === 'Girl' ? girlQuestions : boyQuestions;
    const progress = ((currentQuestion + 1) / activeQuestions.length) * 100;

    const handleGenderSelect = (val) => {
        setGender(val);
        setStep(1);
    };

    const handleAnswer = (answer) => {
        const currentQuestion_obj = activeQuestions[currentQuestion];
        
        // Age validation: only proceed if age is within valid range
        if (currentQuestion_obj.type === 'age') {
            const age = parseInt(answer);
            if (isNaN(age) || age < 10 || age > 120) {
                // Just update the state without proceeding
                setResponses(prev => ({ ...prev, [currentQuestion_obj.id]: answer }));
                return;
            }
        }
        
        setResponses(prev => ({ ...prev, [currentQuestion_obj.id]: answer }));
        
        // Skip logic: If girl says "Haven't started yet" (Q1), jump to Age (Q13)
        if (gender === 'Girl' && currentQuestion === 0 && answer === 'NOT_STARTED') {
            setCurrentQuestion(girlQuestions.length - 1); // Jump to last question (Age)
            return;
        }

        if (currentQuestion < activeQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handleBack = () => {
        // If we skipped from Q1 to Q13, go back to Q1
        if (gender === 'Girl' && currentQuestion === girlQuestions.length - 1 && responses['q1'] === 'NOT_STARTED') {
            setCurrentQuestion(0);
            return;
        }

        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        } else {
            setStep(0);
        }
    };

    const handleFinish = async () => {
        setSubmitting(true);
        try {
            // A girl is only "menstruating" if she didn't select 'NOT_STARTED' or 'MALE' path
            const isMenstruating = gender === 'Girl' && responses['q1'] !== 'NOT_STARTED';
            
            // Map onboarding gender to database gender values
            const genderValue = gender === 'Girl' ? 'female' : 'male';
            
            const updateData = {
                gender: genderValue,
                is_menstruating: isMenstruating,
                onboarding_complete: true,
                // We add the age from the questionnaire if available
                age: parseInt(responses[gender === 'Girl' ? 'q13' : 'bq1']) || user.age || 0
            };

            await authApi.updateProfile(updateData);
            
            // Update local user state
            const updatedUser = await authApi.getCurrentUser();
            setUser(updatedUser);
            
            // Redirect: Menstruating girls go to Tracker, others to Education
            navigate(isMenstruating ? '/cycle-tracker' : '/education');
        } catch (error) {
            console.error("Onboarding failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderSelection = (question) => {
        const pathSuffix = gender === 'Girl' ? 'girlPath' : 'boyPath';
        const options = t(`onboarding.${pathSuffix}.${question.optionsKey}`, { returnObjects: true });
        
        return (
            <div className="grid grid-cols-1 gap-3 mt-6">
                {Array.isArray(options) && options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(opt)}
                        className={`p-4 rounded-2xl text-left font-semibold transition-all border-2 flex items-center justify-between ${
                            responses[question.id] === opt 
                            ? 'bg-pink-50 border-pink-400 text-pink-700' 
                            : 'bg-white border-gray-100 hover:border-pink-200 text-gray-700'
                        }`}
                    >
                        {opt}
                        {responses[question.id] === opt && <Check size={18} className="text-pink-600" />}
                    </button>
                ))}
            </div>
        );
    };

    const renderDatePicker = (question) => {
        return (
            <div className="mt-8">
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={24} />
                    <input 
                        type="date"
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-pink-100 focus:border-pink-400 outline-none text-lg font-medium text-gray-700 mb-6"
                        onChange={(e) => handleAnswer(e.target.value)}
                        value={responses[question.id] && responses[question.id] !== 'NOT_STARTED' ? responses[question.id] : ''}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleAnswer('NOT_STARTED')}
                        className={`p-4 rounded-2xl text-left font-semibold transition-all border-2 flex items-center justify-between ${
                            responses[question.id] === 'NOT_STARTED' 
                            ? 'bg-pink-50 border-pink-400 text-pink-700 shadow-sm' 
                            : 'bg-white border-gray-100 hover:border-pink-200 text-gray-700'
                        }`}
                    >
                        {t('onboarding.girlPath.q1_not_started')}
                        {responses[question.id] === 'NOT_STARTED' && <Check size={18} className="text-pink-600" />}
                    </button>
                    
                    <p className="mt-2 text-sm text-gray-500 italic">
                        {t('onboarding.girlPath.q1_hint', 'Don\'t worry if you don\'t remember the exact date, an estimate is fine!')}
                    </p>
                </div>
            </div>
        );
    };

    const renderAgeInput = (question) => {
        const currentValue = responses[question.id] || '';
        const isValid = currentValue && parseInt(currentValue) >= 10 && parseInt(currentValue) <= 120;
        
        return (
            <div className="mt-8">
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={24} />
                    <input 
                        type="number"
                        min="7"
                        max="120"
                        placeholder="Enter your age (7-120)"
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 outline-none text-lg font-medium transition-all ${
                            isValid || !currentValue
                            ? 'border-pink-100 focus:border-pink-400 text-gray-700'
                            : 'border-red-400 bg-red-50 text-red-700 focus:border-red-500'
                        }`}
                        onChange={(e) => handleAnswer(e.target.value)}
                        value={currentValue}
                    />
                </div>
                {currentValue && !isValid && (
                    <p className="mt-3 text-sm text-red-600 font-medium">⚠️ Age must be between 7 and 120</p>
                )}
                <p className="mt-4 text-sm text-gray-500">
                    Please enter a valid age to continue.
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FFF0F4] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-xl overflow-hidden relative border border-pink-50">
                <div className="absolute top-4 right-4 z-20">
                    <LanguageSelector />
                </div>
                
                {/* Progress Bar */}
                {step === 1 && (
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-pink-400 to-pink-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {step === 0 ? (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Heart className="text-pink-500 fill-pink-500" size={40} />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 mb-2">
                                    {t('onboarding.title')}
                                </h1>
                                <p className="text-gray-500 font-medium mb-10">
                                    {t('onboarding.subtitle')}
                                </p>

                                <div className="space-y-4">
                                    <h2 className="text-sm font-black uppercase tracking-widest text-pink-400 text-left mb-2 pl-2">
                                        {t('onboarding.genderQuestion')}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => handleGenderSelect('Girl')}
                                            className="group p-6 rounded-3xl border-2 border-pink-50 hover:border-pink-300 hover:bg-pink-50 transition-all flex flex-col items-center gap-3"
                                        >
                                            <div className="p-4 bg-pink-100 rounded-2xl group-hover:bg-white transition-colors">
                                                <Baby className="text-pink-500" size={32} />
                                            </div>
                                            <span className="font-bold text-gray-700">{t('onboarding.girl')}</span>
                                        </button>
                                        <button 
                                            onClick={() => handleGenderSelect('Boy')}
                                            className="group p-6 rounded-3xl border-2 border-blue-50 hover:border-blue-200 hover:bg-blue-50 transition-all flex flex-col items-center gap-3"
                                        >
                                            <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-white transition-colors">
                                                <User className="text-blue-500" size={32} />
                                            </div>
                                            <span className="font-bold text-gray-700">{t('onboarding.boy')}</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`q-${currentQuestion}`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="min-h-[400px] flex flex-col"
                            >
                                {/* Back Button */}
                                <button 
                                    onClick={handleBack}
                                    className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors font-bold text-sm mb-8"
                                >
                                    <ChevronLeft size={18} />
                                    {t('onboarding.previous')}
                                </button>

                                {activeQuestions[currentQuestion].headerKey && (
                                    <div className="mb-2">
                                        <span className="text-pink-500 font-black text-xs uppercase tracking-[0.2em]">
                                            {t(`onboarding.${gender === 'Girl' ? 'girlPath' : 'boyPath'}.${activeQuestions[currentQuestion].headerKey}`)}
                                        </span>
                                    </div>
                                )}

                                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                    {t(`onboarding.${gender === 'Girl' ? 'girlPath' : 'boyPath'}.${activeQuestions[currentQuestion].questionKey}`)}
                                </h2>

                                {activeQuestions[currentQuestion].introKey && (
                                    <p className="mt-3 text-gray-500 font-medium italic">
                                        {t(`onboarding.${gender === 'Girl' ? 'girlPath' : 'boyPath'}.${activeQuestions[currentQuestion].introKey}`)}
                                    </p>
                                )}

                                <div className="flex-1">
                                    {activeQuestions[currentQuestion].type === 'date' 
                                        ? renderDatePicker(activeQuestions[currentQuestion])
                                        : activeQuestions[currentQuestion].type === 'age'
                                        ? renderAgeInput(activeQuestions[currentQuestion])
                                        : renderSelection(activeQuestions[currentQuestion])
                                    }
                                </div>

                                {/* Finish Button (Only shown on last question) */}
                                {currentQuestion === activeQuestions.length - 1 && (
                                    (() => {
                                        const currentQ = activeQuestions[currentQuestion];
                                        const responseValue = responses[currentQ.id];
                                        
                                        // For age type, validate age range
                                        if (currentQ.type === 'age') {
                                            const age = parseInt(responseValue);
                                            const isValidAge = !isNaN(age) && age >= 7 && age <= 120;
                                            
                                            return (
                                                <motion.button
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    onClick={handleFinish}
                                                    disabled={submitting || !isValidAge}
                                                    className={`mt-10 w-full py-5 rounded-2xl text-white font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-transform ${
                                                        isValidAge 
                                                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-[1.02] active:scale-[0.98]' 
                                                        : 'bg-gray-300 cursor-not-allowed'
                                                    } ${submitting ? 'opacity-70' : ''}`}
                                                >
                                                    {submitting ? (
                                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            {t('onboarding.finish')}
                                                            <ArrowRight size={20} />
                                                        </>
                                                    )}
                                                </motion.button>
                                            );
                                        }
                                        
                                        // For other types, just check if response exists
                                        return responseValue && (
                                            <motion.button
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                onClick={handleFinish}
                                                disabled={submitting}
                                                className={`mt-10 w-full py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] ${submitting ? 'opacity-70' : ''}`}
                                            >
                                                {submitting ? (
                                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        {t('onboarding.finish')}
                                                        <ArrowRight size={20} />
                                                    </>
                                                )}
                                            </motion.button>
                                        );
                                    })()
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-100/50 rounded-full blur-3xl -z-10" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl -z-10" />
            </div>
        </div>
    );
};

export default Onboarding;
