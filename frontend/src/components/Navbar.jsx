import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import PetalIcon from './PetalIcon';

const Navbar = () => {
    return (
        <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
                <div className="bg-brand-pink text-white p-1.5 rounded-full flex items-center justify-center">
                    <PetalIcon size={20} />
                </div>
                <span className="font-heading font-bold text-2xl text-brand-dark tracking-tight">Petal</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-10">
                <Link to="/education" className="text-sm font-semibold text-brand-gray hover:text-brand-pink transition-colors">Learn</Link>
                <Link to="/community" className="text-sm font-semibold text-brand-gray hover:text-brand-pink transition-colors">Community</Link>
                <Link to="/risk" className="text-sm font-semibold text-brand-gray hover:text-brand-pink transition-colors">Safety</Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
                <Link
                    to="/login"
                    className="bg-[#FF6B9A] hover:bg-[#FF8A8A] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-soft"
                >
                    Sign Up
                </Link>
                <button className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-400">
                    <span className="text-xl">👩</span>
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
