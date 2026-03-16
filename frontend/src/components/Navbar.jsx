import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import PetalIcon from './PetalIcon';

const Navbar = () => {
    return (
        <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-50">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                <div className="bg-brand-pink text-white p-2 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-pink-200">
                    <PetalIcon size={24} />
                </div>
                <span className="font-heading font-extrabold text-3xl text-brand-dark tracking-tighter">Petal</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-10 bg-white/50 backdrop-blur-sm px-8 py-3 rounded-full border border-pink-50 shadow-sm">
                <Link to="/education" className="text-sm font-bold text-brand-gray hover:text-brand-pink transition-colors">Education 📚</Link>
                <Link to="/community" className="text-sm font-bold text-brand-gray hover:text-brand-pink transition-colors">Community 💬</Link>
                <Link to="/risk" className="text-sm font-bold text-brand-gray hover:text-brand-pink transition-colors">Risks ⚠️</Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
                <Link
                    to="/login"
                    className="bg-gradient-pink hover:opacity-90 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-pink-100 hover:-translate-y-0.5"
                >
                    Sign In 🚀
                </Link>
                <button className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-400 border-2 border-white shadow-soft">
                    <span className="text-2xl">👩</span>
                </button>
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden text-brand-dark">
                <Menu size={28} />
            </button>
        </nav>
    );
};

export default Navbar;
