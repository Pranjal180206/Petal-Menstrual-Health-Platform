import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const educationCards = [
    {
        id: 1,
        category: "Fundamentals",
        emoji: "🌸",
        accent: "#FF6B9D",
        bg: "from-pink-50 to-rose-100",
        darkBg: "from-[#2a1520] to-[#321825]",
        borderColor: "border-pink-300",
        darkBorder: "#FF6B9D40",
        badgeBg: "bg-pink-500",
        title: "Understanding Your Menstrual Cycle",
        subtitle: "The 4-phase guide",
        description: "Your menstrual cycle is divided into four phases. The menstrual phase (days 1–5) is when the uterine lining sheds. The follicular phase follows, where estrogen rises and an egg matures inside a follicle. Ovulation (around day 14) is when the egg is released — your most fertile window. Finally, the luteal phase prepares the uterus for possible pregnancy. If no fertilization occurs, hormone levels drop and the cycle restarts. A 'normal' cycle ranges from 21 to 35 days — not everyone is 28 days.",
        readTime: "8 min",
        link: "https://www.plannedparenthood.org/learn/health-and-wellness/menstruation/what-menstrual-cycle",
        icon: "cycle",
    },
    {
        id: 2,
        category: "Health Signals",
        emoji: "🔔",
        accent: "#E63888",
        bg: "from-red-50 to-pink-100",
        darkBg: "from-[#281020] to-[#2e1525]",
        borderColor: "border-red-300",
        darkBorder: "#E6388840",
        badgeBg: "bg-rose-600",
        title: "When to See a Doctor",
        subtitle: "Know your warning signs",
        description: "Not every period irregularity is an emergency, but some signs should not be ignored. Heavy bleeding that soaks through a pad or tampon every hour for several hours, periods lasting longer than 7 days, or severe cramping that doesn't respond to over-the-counter pain relief are all worth a doctor's visit. Cycles that suddenly become very irregular may signal hormonal imbalances such as PCOS or thyroid issues. Missing periods for 3 or more months can also indicate that something needs attention. Unusual discharge or persistent pelvic pain outside of your period are additional signs to bring up with a healthcare provider.",
        readTime: "5 min",
        link: "https://www.mayoclinic.org/diseases-conditions/menorrhagia/symptoms-causes/syc-20352829",
        icon: "alert",
    },
    {
        id: 3,
        category: "Wellness",
        emoji: "🌿",
        accent: "#34C77B",
        bg: "from-green-50 to-emerald-100",
        darkBg: "from-[#0f2318] to-[#122b1e]",
        borderColor: "border-green-300",
        darkBorder: "#34C77B40",
        badgeBg: "bg-emerald-500",
        title: "Stress, Sleep & Your Period",
        subtitle: "The lifestyle connection",
        description: "Chronic stress raises cortisol levels, which can disrupt the hormonal signals that regulate your cycle — causing late, skipped, or painful periods. Poor sleep interferes with melatonin and reproductive hormones like LH and FSH. Even short-term stress (like exams or travel) can delay ovulation. To support your cycle: aim for 7–9 hours of sleep nightly, practice stress reduction techniques like deep breathing or gentle yoga, and maintain a consistent daily routine. Your body's hormonal system is sensitive — small lifestyle changes make a real difference.",
        readTime: "6 min",
        link: "https://www.healthline.com/health/womens-health/how-stress-affects-menstrual-cycle",
        icon: "leaf",
    },
    {
        id: 4,
        category: "Nutrition",
        emoji: "🥗",
        accent: "#F7A934",
        bg: "from-amber-50 to-orange-100",
        darkBg: "from-[#261a08] to-[#2e2010]",
        borderColor: "border-amber-300",
        darkBorder: "#F7A93440",
        badgeBg: "bg-amber-500",
        title: "Eating for Your Cycle",
        subtitle: "Phase-by-phase nutrition",
        description: "During menstruation, focus on iron-rich foods like lentils, spinach, and lean meat to replace what's lost through bleeding. In the follicular phase, eat light and fresh — leafy greens, eggs, and fermented foods support estrogen metabolism. Around ovulation, anti-inflammatory foods like berries, flaxseeds, and zinc-rich pumpkin seeds are ideal. During the luteal phase (PMS time), complex carbs help stabilize mood, magnesium-rich foods (like dark chocolate and almonds) reduce cramps, and reducing caffeine and salt can ease bloating.",
        readTime: "7 min",
        link: "https://www.medicalnewstoday.com/articles/foods-to-eat-during-period",
        icon: "nutrition",
    },
    {
        id: 5,
        category: "Myth Busting",
        emoji: "💡",
        accent: "#8B5CF6",
        bg: "from-violet-50 to-purple-100",
        darkBg: "from-[#1a1030] to-[#20153a]",
        borderColor: "border-violet-300",
        darkBorder: "#8B5CF640",
        badgeBg: "bg-violet-500",
        title: "Period Myths — Busted",
        subtitle: "Science over stigma",
        description: "Myth: Everyone has a 28-day cycle. Fact: Normal cycles range from 21–35 days — every body is different. Myth: Exercise makes cramps worse. Fact: Light movement like walking or stretching releases endorphins that actually reduce pain. Myth: Period blood is dirty or impure. Fact: It is simply a mix of blood, uterine lining, and cervical mucus — a completely natural and healthy bodily process. Myth: You should not bathe or wash your hair during your period. Fact: Hygiene is especially important during menstruation. Myth: Periods should always be painful. Fact: Mild discomfort is normal, but severe pain is not — it may signal a condition like endometriosis worth discussing with a doctor.",
        readTime: "4 min",
        link: "https://www.unicef.org/rosa/stories/busting-myths-about-menstruation",
        icon: "myth",
    },
    {
        id: 6,
        category: "Products",
        emoji: "🛍️",
        accent: "#EC4899",
        bg: "from-fuchsia-50 to-pink-100",
        darkBg: "from-[#271020] to-[#2e1528]",
        borderColor: "border-fuchsia-300",
        darkBorder: "#EC489940",
        badgeBg: "bg-fuchsia-500",
        title: "Choosing Your Period Product",
        subtitle: "No-judgment comparison",
        description: "Pads are the most beginner-friendly option — they attach to the inside of underwear and require no insertion. They come in different sizes for light, medium, or heavy flow days. Tampons are compact and good for active days or swimming. Menstrual cups are small, reusable silicone cups that collect flow rather than absorbing it; they can be worn for up to 12 hours and are an eco-friendly, cost-effective long-term choice. Period underwear looks and feels like regular underwear but has built-in absorbent layers — great as a backup or standalone option. The best product is simply the one you feel most comfortable, safe, and confident using.",
        readTime: "9 min",
        link: "https://www.healthline.com/health/womens-health/menstrual-cup-vs-tampon",
        icon: "products",
    },
    {
        id: 7,
        category: "Mental Health",
        emoji: "🧠",
        accent: "#0EA5E9",
        bg: "from-sky-50 to-blue-100",
        darkBg: "from-[#0c1e2e] to-[#0e2438]",
        borderColor: "border-sky-300",
        darkBorder: "#0EA5E940",
        badgeBg: "bg-sky-500",
        title: "Mood, Mind & Your Cycle",
        subtitle: "The emotional side",
        description: "Hormonal fluctuations throughout your cycle directly affect brain chemistry. In the first half, rising estrogen boosts serotonin — many people feel more energetic and social. After ovulation, progesterone rises and some people experience irritability, anxiety, or low mood — this is PMS. For a smaller group, these symptoms are severe enough to be classified as PMDD (Premenstrual Dysphoric Disorder), a real medical condition that responds well to treatment. Tracking your mood alongside your cycle helps identify patterns. If emotional symptoms significantly affect your daily life, speak with a doctor — you don't have to just push through it.",
        readTime: "6 min",
        link: "https://www.nimh.nih.gov/health/publications/premenstrual-dysphoric-disorder-pmdd",
        icon: "mind",
    },
];

const IconShape = ({ type, color }) => {
    switch (type) {
        case "cycle": return (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="10" stroke={color} strokeWidth="2.5" strokeDasharray="4 2" />
                <circle cx="16" cy="16" r="4" fill={color} opacity="0.3" />
                <path d="M16 6 L18 9 L14 9 Z" fill={color} />
            </svg>
        );
        case "alert": return (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <path d="M16 4 L28 26 H4 Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill={color} fillOpacity="0.1" />
                <line x1="16" y1="13" x2="16" y2="19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="16" cy="22" r="1.2" fill={color} />
            </svg>
        );
        case "leaf": return (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <path d="M8 24 C8 24 10 12 22 8 C22 8 24 18 14 24 Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.15" strokeLinejoin="round" />
                <line x1="8" y1="24" x2="16" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
        case "nutrition": return (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="14" width="20" height="12" rx="4" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
                <path d="M10 14 C10 10 14 8 16 8 C18 8 22 10 22 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="14" x2="16" y2="26" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        );
        case "myth": return (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="13" r="7" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
                <line x1="16" y1="20" x2="16" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="16" cy="27" r="1.2" fill={color} />
            </svg>
        );
        case "products": return (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <rect x="8" y="12" width="16" height="14" rx="3" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
                <path d="M12 12 C12 8 20 8 20 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="18" x2="20" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="21" x2="17" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        );
        case "mind": return (
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <path d="M10 20 C6 18 6 10 12 8 C14 7 18 7 20 8 C26 10 26 18 22 20 L22 25 H10 Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" strokeLinejoin="round" />
                <line x1="13" y1="14" x2="13" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="12" x2="16" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="19" y1="14" x2="19" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        );
        default: return null;
    }
};

const CARD_LINKS = {
    1: "https://www.healthline.com/health/womens-health/stages-of-menstrual-cycle",
    2: "https://www.healthline.com/health/menstrual-periods-heavy-prolonged-or-irregular",
    3: "https://www.healthline.com/health/stress/can-stress-mess-up-your-period",
    4: "https://www.healthline.com/health/womens-health/what-to-eat-during-period",
    5: "https://www.healthline.com/health/womens-health/period-myths",
    6: "https://www.healthline.com/health/tampons-vs-pads",
    7: "https://www.healthline.com/health/pms-mood-swings",
};

const EducationCard = ({ card, darkMode }) => {
    const [flipped, setFlipped] = useState(false);

    // Flip the card on click
    const handleCardClick = () => setFlipped(f => !f);

    return (
        <div
            className="relative h-[340px] cursor-pointer select-none"
            style={{ perspective: '1200px' }}
            onClick={handleCardClick}
        >
            <div
                className="w-full h-full relative"
                style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.65s cubic-bezier(0.4,0.2,0.2,1)',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* FRONT */}
                <div
                    className={`absolute inset-0 rounded-3xl p-6 flex flex-col justify-between overflow-hidden ${darkMode
                            ? `bg-gradient-to-br ${card.darkBg}`
                            : `bg-gradient-to-br ${card.bg} border-2 ${card.borderColor}`
                        }`}
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        ...(darkMode && { border: `2px solid ${card.darkBorder}` }),
                    }}
                >
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none" style={{ background: card.accent }} />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10 blur-xl pointer-events-none" style={{ background: card.accent }} />

                    <div className="flex items-start justify-between relative z-10">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-md ${card.badgeBg}`}>
                            {card.category}
                        </span>
                        <span className="text-3xl">{card.emoji}</span>
                    </div>

                    <div className="flex items-center justify-center py-2 relative z-10">
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md"
                            style={{
                                background: `${card.accent}${darkMode ? '25' : '18'}`,
                                border: `2px solid ${card.accent}${darkMode ? '50' : '30'}`,
                            }}
                        >
                            <IconShape type={card.icon} color={card.accent} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: card.accent }}>
                            {card.subtitle}
                        </p>
                        <h4 className={`text-base font-black leading-tight mb-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                            {card.title}
                        </h4>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                {card.readTime} read
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1" style={{ color: card.accent }}>
                                Tap to explore
                                <span className="material-symbols-outlined text-xs">flip</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div
                    className="absolute inset-0 rounded-3xl p-5 flex flex-col overflow-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: darkMode
                            ? `linear-gradient(135deg, ${card.accent}18, ${card.accent}30)`
                            : `linear-gradient(135deg, ${card.accent}12, ${card.accent}28)`,
                        border: `2px solid ${card.accent}${darkMode ? '60' : '50'}`,
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(${card.accent} 1px, transparent 1px)`,
                            backgroundSize: '16px 16px',
                        }}
                    />

                    <div className="relative z-10 flex flex-col h-full gap-3">
                        {/* Header */}
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{card.emoji}</span>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: card.accent }}>
                                    {card.category}
                                </p>
                                <h4 className={`text-sm font-black leading-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                    {card.title}
                                </h4>
                            </div>
                        </div>

                        {/* Scrollable description */}
                        <div
                            className="flex-1 overflow-y-auto pr-1"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: `${card.accent}40 transparent` }}
                        >
                            <p className={`text-[11px] font-medium leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {card.description}
                            </p>
                        </div>

                        {/* Read Full Article */}
                        <a
                            href={CARD_LINKS[card.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-lg text-center flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 mt-auto"
                            style={{ background: card.accent, textDecoration: 'none' }}
                        >
                            Read Full Article
                            <span className="material-symbols-outlined text-sm" style={{ pointerEvents: 'none' }}>open_in_new</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Education = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [onboardingDone, setOnboardingDone] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const heroRef = React.useRef(null);
    const cardsRef = React.useRef(null);

    const handleSkipIntro = () => {
        cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleFinishOnboarding = () => {
        setOnboardingDone(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
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
                    <div ref={heroRef} className="flex flex-col items-start gap-6 mb-16 px-4 max-w-2xl">
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
                            No taboos, just the real talk you need about your body and health.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div ref={cardsRef} className="relative">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <h3
                                className="text-2xl font-black flex items-center gap-2"
                                style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ color: darkMode ? '#f472b6' : '#e63888' }}
                                >
                                    library_books
                                </span>
                                Educational Documents
                            </h3>
                            <span
                                className="text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest hidden sm:block"
                                style={{
                                    background: darkMode ? '#1e293b' : 'white',
                                    color: '#94a3b8',
                                    border: darkMode ? '1px solid #334155' : '1px solid #fda4af',
                                }}
                            >
                                Tap cards to explore ✦
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {educationCards.map((card) => (
                                <EducationCard key={card.id} card={card} darkMode={darkMode} />
                            ))}
                        </div>
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
                                Skip Intro
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