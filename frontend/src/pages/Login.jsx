import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Sparkles, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PetalIcon from '../components/PetalIcon';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, register } = useAuth();
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
            navigate('/dashboard'); // route from existing original UI
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-[#1D1D2C]">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#f0f0f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />

            {/* Decorative Blur Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[40%] bg-pink-50/80 rounded-full blur-3xl opacity-60 pointer-events-none" />

            {/* Header */}
            <header className="w-full px-8 py-6 flex justify-between items-center relative z-10">
                <Link to="/" className="flex items-center gap-3">
                    <div className="text-[#FF6B9A]">
                        <PetalIcon size={28} />
                    </div>
                    <span className="font-heading font-extrabold text-2xl tracking-tight">Petal</span>
                </Link>
                <div className="text-sm font-semibold text-gray-500">
                    Need help? <Link to="/contact" className="text-[#FF6B9A] hover:underline">Ask an adult</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">

                {/* Left Column - Copy & Image */}
                <div className="flex-1 space-y-8 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-[#FFF5F7] px-4 py-2 rounded-full text-[#FF6B9A] font-bold text-sm"
                    >
                        <Sparkles size={16} />
                        For Teens, By Experts
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-heading font-extrabold leading-[1.1] tracking-tight"
                    >
                        Your body is <br />
                        <span className="text-[#FF6B9A]">amazing.</span> Let's <br />
                        track its rhythms.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[#4A4A5C] leading-relaxed max-w-md font-medium"
                    >
                        Join a community of 50,000+ others learning about their cycle health in a safe, private space.
                    </motion.p>

                    {/* Image Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-md bg-[#FFF5F7] rounded-[2.5rem] p-4 mt-8"
                    >
                        <div className="rounded-[2rem] overflow-hidden bg-gray-100 aspect-[16/9] relative">
                            <img
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60"
                                alt="Medical Professionals"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-[3rem] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-heading font-extrabold mb-3">{isLogin ? 'Welcome back! 👋' : 'Create Account ✨'}</h2>
                            <p className="text-gray-500 font-medium">{isLogin ? 'We missed you! Log in to see your updates.' : 'Join our safe community today.'}</p>
                            {error && <p className="text-[#FF6B9A] font-bold text-sm mt-2">{error}</p>}
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#1D1D2C] ml-1">Name</label>
                                    <input
                                        type="text" name="name" required
                                        value={formData.name} onChange={handleChange}
                                        placeholder="How should we call you?"
                                        className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-gray-400 font-medium text-[#1D1D2C]"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1D1D2C] ml-1">Email</label>
                                <input
                                    type="email" name="email" required
                                    value={formData.email} onChange={handleChange}
                                    placeholder="your_email@example.com"
                                    className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-gray-400 font-medium text-[#1D1D2C]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-bold text-[#1D1D2C]">Password</label>
                                    {isLogin && <Link to="/contact" className="text-xs font-bold text-[#FF6B9A] hover:underline">Forgot?</Link>}
                                </div>
                                <input
                                    type="password" name="password" required
                                    value={formData.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-gray-400 font-medium text-[#1D1D2C]"
                                />
                            </div>

                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#1D1D2C] ml-1">Age</label>
                                        <input
                                            type="number" name="age" required min="10" max="100"
                                            value={formData.age} onChange={handleChange}
                                            className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-medium text-[#1D1D2C]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#1D1D2C] ml-1">Gender</label>
                                        <select
                                            name="gender" value={formData.gender} onChange={handleChange}
                                            className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-medium text-[#1D1D2C]"
                                        >
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                            <option value="non-binary">Non-binary</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 ml-1 pt-2">
                                <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#FF6B9A]">
                                    {/* Custom checkbox empty state */}
                                </div>
                                <span className="text-sm font-semibold text-[#4A4A5C]">Keep me logged in</span>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-[#FF6B9A] hover:bg-[#FF8A8A] text-white rounded-2xl py-4 font-bold text-lg transition-all shadow-[0_8px_20px_-6px_rgba(255,107,154,0.4)] hover:-translate-y-0.5">
                                    {isLogin ? "Let's Go!" : "Sign Up"}
                                </button>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-400 font-bold tracking-widest">or</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-2xl py-4 font-bold text-base flex items-center justify-center gap-3 transition-all hover:bg-gray-50 active:scale-[0.98]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.49 12.275c0-.846-.076-1.662-.216-2.449H12v4.63h6.443a5.507 5.507 0 01-2.39 3.614v3.004h3.87c2.265-2.084 3.567-5.152 3.567-8.799z" fill="#4285F4"/>
                                    <path d="M12 24c3.24 0 5.957-1.075 7.942-2.916l-3.87-3.004c-1.072.718-2.443 1.144-4.072 1.144-3.133 0-5.786-2.115-6.733-4.96H1.296v3.103C3.27 21.315 7.377 24 12 24z" fill="#34A853"/>
                                    <path d="M5.267 14.264a7.204 7.204 0 010-4.528V6.633H1.296a11.99 11.99 0 000 10.734l3.971-3.103z" fill="#FBBC05"/>
                                    <path d="M12 4.773c1.762 0 3.344.605 4.588 1.792l3.442-3.442C17.953 1.07 15.24 0 12 0 7.377 0 3.27 2.685 1.296 6.633l3.971 3.103C6.214 6.888 8.867 4.773 12 4.773z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                        </form>

                        <div className="mt-8 text-center space-y-4">
                            <p className="text-sm font-semibold text-gray-500">{isLogin ? 'First time here?' : 'Already have an account?'}</p>
                            <button 
                                type="button" 
                                onClick={() => setIsLogin(!isLogin)}
                                className="w-full bg-white border-2 border-[#FF6B9A] text-[#FF6B9A] hover:bg-[#FFF5F7] rounded-2xl py-3.5 font-bold transition-all"
                            >
                                {isLogin ? 'Create an Account' : 'Log In Instead'}
                            </button>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-[#8C8C9A] uppercase">
                            <Lock size={12} />
                            <span>Encrypted & Private</span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 font-medium mt-8 max-w-xs mx-auto leading-relaxed">
                        By logging in, you agree to our <Link to="/privacy" className="underline">Teen Privacy Policy</Link> and <Link to="/terms" className="underline">Terms of Service</Link>.
                    </p>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-100 bg-white/50 py-6 px-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="bg-[#FF6B9A] p-1 rounded-md text-white">
                        <Lock size={12} />
                    </div>
                    <span>Safe Space Certified</span>
                </div>

                <div className="flex gap-6">
                    <Link to="/contact" className="hover:text-[#FF6B9A] transition-colors">Help Center</Link>
                    <Link to="/contact" className="hover:text-[#FF6B9A] transition-colors">Contact</Link>
                    <Link to="/education" className="hover:text-[#FF6B9A] transition-colors">Parent Guide</Link>
                </div>

                <div>
                    © 2024 Petal Platform
                </div>
            </footer>
        </div>
    );
};

export default Login;
