import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Droplet, Sparkles, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PetalIcon from '../components/PetalIcon';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, register } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gender: 'female',
        age: 18,
        is_menstruating: true
    });
    const [error, setError] = useState('');

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(smoothY, [-200, 200], [20, -20]);
    const rotateY = useTransform(smoothX, [-200, 200], [-20, 20]);

    const x1 = useTransform(smoothX, v => v * 0.1);
    const y1 = useTransform(smoothY, v => v * 0.1);
    const x2 = useTransform(smoothX, v => v * 0.2);
    const y2 = useTransform(smoothY, v => v * 0.2);
    const x3 = useTransform(smoothX, v => v * 0.15);
    const y3 = useTransform(smoothY, v => v * 0.15);
    const x4 = useTransform(smoothX, v => v * -0.2);
    const y4 = useTransform(smoothY, v => v * -0.2);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleGoogleLogin = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = window.location.origin;
        const scope = 'openid email profile';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`;
        window.location.href = authUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login({ email: formData.email, password: formData.password });
            } else {
                await register(formData);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="h-screen overflow-hidden bg-white flex flex-col font-sans text-[#1D1D2C]">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#f0f0f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />

            {/* Decorative Blur Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[40%] bg-pink-50/80 rounded-full blur-3xl opacity-60 pointer-events-none" />

            {/* Header */}
            <header className="w-full px-8 py-3 flex justify-between items-center relative z-10 shrink-0">
                <Link to="/" className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="text-[#FF6B9A]">
                            <PetalIcon size={28} />
                        </div>
                        <span className="font-heading font-extrabold text-2xl tracking-tight">Petal</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 ml-10">
                        <span className="text-[15px] text-gray-500 font-medium whitespace-nowrap">by Upay</span>
                        <img src="/upay-logo.png" alt="Upay Logo" className="h-[33px] w-auto object-contain" />
                    </div>
                </Link>
                <div className="text-sm font-semibold text-gray-500">
                    {t('login.needHelp')} <Link to="/contact" className="text-[#FF6B9A] hover:underline">{t('login.askAdult')}</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-2 md:py-4 flex flex-col lg:flex-row items-center gap-8 md:gap-12 relative z-10 min-h-0">

                {/* Left Column - Copy & Vector */}
                <div className="flex-1 space-y-4 md:space-y-6 max-w-xl">


                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-heading font-extrabold leading-[1.1] tracking-tight"
                    >
                        {t('login.headline1')} <br />
                        <span className="text-[#FF6B9A]">{t('login.headline2')}</span> {t('login.headline3')}
                    </motion.h1>




                </div>

                {/* Right Column - Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md shrink-0 overflow-y-auto max-h-[80vh] scrollbar-hide pb-4"
                >
                    <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-heading font-extrabold mb-2">
                                {isLogin ? t('login.welcomeBack') : t('login.createAccount')}
                            </h2>
                            <p className="text-gray-500 text-sm font-medium">
                                {isLogin ? t('login.missedYou') : t('login.joinCommunity')}
                            </p>
                            {error && <p className="text-[#FF6B9A] font-bold text-sm mt-2">{error}</p>}
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#1D1D2C] ml-1">{t('login.nameLabel')}</label>
                                    <input
                                        type="text" name="name" required
                                        value={formData.name} onChange={handleChange}
                                        placeholder={t('login.namePlaceholder')}
                                        className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 font-medium text-[#1D1D2C]"
                                    />
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#1D1D2C] ml-1">{t('login.emailLabel')}</label>
                                <input
                                    type="email" name="email" required
                                    value={formData.email} onChange={handleChange}
                                    placeholder="your_email@example.com"
                                    className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 font-medium text-[#1D1D2C]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-[#1D1D2C]">{t('login.passwordLabel')}</label>
                                    {isLogin && <Link to="/contact" className="text-[10px] font-bold text-[#FF6B9A] hover:underline">{t('login.forgotPassword')}</Link>}
                                </div>
                                <input
                                    type="password" name="password" required
                                    value={formData.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 font-medium text-[#1D1D2C]"
                                />
                            </div>

                            {isLogin && (
                                <div className="space-y-1.5 pt-2">
                                    <label className="text-xs font-bold text-[#1D1D2C] ml-1">{t('login.genderLabel')} (One Time)</label>
                                    <select
                                        name="gender" value={formData.gender} onChange={handleChange}
                                        className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-medium text-[#1D1D2C]"
                                    >
                                        <option value="female">{t('login.genderFemale')}</option>
                                        <option value="male">{t('login.genderMale')}</option>
                                        <option value="non-binary">{t('login.genderNonBinary')}</option>
                                        <option value="other">{t('login.genderOther')}</option>
                                    </select>
                                    <p className="text-[10px] text-gray-400 ml-1">Stored to your profile later</p>
                                </div>
                            )}

                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#1D1D2C] ml-1">{t('login.ageLabel')}</label>
                                        <input
                                            type="number" 
                                            name="age" 
                                            required 
                                            min="7" 
                                            max="120"
                                            placeholder="Enter age"
                                            value={formData.age} 
                                            onChange={handleChange}
                                            className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-medium text-[#1D1D2C]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#1D1D2C] ml-1">{t('login.genderLabel')}</label>
                                        <select
                                            name="gender" value={formData.gender} onChange={handleChange}
                                            className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all font-medium text-[#1D1D2C]"
                                        >
                                            <option value="female">{t('login.genderFemale')}</option>
                                            <option value="male">{t('login.genderMale')}</option>
                                            <option value="non-binary">{t('login.genderNonBinary')}</option>
                                            <option value="other">{t('login.genderOther')}</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 ml-1 pt-2">
                                <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#FF6B9A]">
                                    {/* Custom checkbox empty state */}
                                </div>
                                <span className="text-sm font-semibold text-[#4A4A5C]">{t('login.keepLoggedIn')}</span>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-[#FF6B9A] hover:bg-[#FF8A8A] text-white rounded-xl py-3 font-bold text-base transition-all shadow-[0_4px_14px_-4px_rgba(255,107,154,0.4)] hover:-translate-y-0.5">
                                    {isLogin ? t('login.submit') : t('login.signUp')}
                                </button>
                            </div>

                            <div className="relative py-3">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase">
                                    <span className="bg-white px-2 text-gray-400 font-bold tracking-widest">{t('login.orDivider')}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-gray-50 active:scale-[0.98]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.49 12.275c0-.846-.076-1.662-.216-2.449H12v4.63h6.443a5.507 5.507 0 01-2.39 3.614v3.004h3.87c2.265-2.084 3.567-5.152 3.567-8.799z" fill="#4285F4"/>
                                    <path d="M12 24c3.24 0 5.957-1.075 7.942-2.916l-3.87-3.004c-1.072.718-2.443 1.144-4.072 1.144-3.133 0-5.786-2.115-6.733-4.96H1.296v3.103C3.27 21.315 7.377 24 12 24z" fill="#34A853"/>
                                    <path d="M5.267 14.264a7.204 7.204 0 010-4.528V6.633H1.296a11.99 11.99 0 000 10.734l3.971-3.103z" fill="#FBBC05"/>
                                    <path d="M12 4.773c1.762 0 3.344.605 4.588 1.792l3.442-3.442C17.953 1.07 15.24 0 12 0 7.377 0 3.27 2.685 1.296 6.633l3.971 3.103C6.214 6.888 8.867 4.773 12 4.773z" fill="#EA4335"/>
                                </svg>
                                {t('login.continueGoogle')}
                            </button>
                        </form>

                        <div className="mt-6 text-center space-y-3">
                            <p className="text-xs font-semibold text-gray-500">
                                {isLogin ? t('login.firstTime') : t('login.alreadyHave')}
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="w-full bg-white border-2 border-[#FF6B9A] text-[#FF6B9A] hover:bg-[#FFF5F7] rounded-xl py-2.5 text-sm font-bold transition-all"
                            >
                                {isLogin ? t('login.createLink') : t('login.loginInstead')}
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-[#8C8C9A] uppercase">
                            <Lock size={10} />
                            <span>{t('login.encrypted')}</span>
                        </div>
                    </div>

                    <p className="text-center text-[10px] text-gray-400 font-medium mt-4 max-w-xs mx-auto leading-relaxed">
                        {t('login.privacyNotice')}{' '}
                        <Link to="/privacy" className="underline">{t('login.privacyPolicy')}</Link>
                        {' '}{t('login.and')}{' '}
                        <Link to="/terms" className="underline">{t('login.termsOfService')}</Link>.
                    </p>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-100 bg-white/50 py-3 px-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-2 text-xs font-bold text-gray-400 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="bg-[#FF6B9A] p-1 rounded-md text-white">
                        <Lock size={12} />
                    </div>
                    <span>{t('login.safeSpace')}</span>
                </div>

                <div className="flex gap-6">
                    <Link to="/contact" className="hover:text-[#FF6B9A] transition-colors">{t('login.helpCenter')}</Link>
                    <Link to="/contact" className="hover:text-[#FF6B9A] transition-colors">{t('login.contact')}</Link>
                    <Link to="/education" className="hover:text-[#FF6B9A] transition-colors">{t('login.parentGuide')}</Link>
                </div>

                <div>{t('login.copyright')}</div>
            </footer>
        </div>
    );
};

export default Login;
