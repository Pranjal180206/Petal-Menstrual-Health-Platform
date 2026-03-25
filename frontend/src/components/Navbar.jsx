import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import PetalIcon from './PetalIcon';
import { useAuth } from '../context/AuthContext';
const Navbar = ({ isHome = false }) => {
    const { user } = useAuth();
    return (
        <nav className="w-full max-w-7xl mx-auto px-6 py-8 md:py-10 flex items-center justify-between relative z-50">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                <div className="bg-brand-pink text-white p-2 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-pink-200">
                    <PetalIcon size={32} />
                </div>
                <span className="font-heading font-extrabold text-4xl text-brand-dark tracking-tighter">Petal</span>
            </Link>

            {/* Desktop Links */}
            <div 
                data-tour-id="navbar-main"
                className="hidden md:flex items-center gap-6 lg:gap-10 text-sm px-6 lg:px-8 bg-gray-50/80 backdrop-blur-md py-4 md:py-5 rounded-full border border-gray-100 shadow-md"
            >
                <Link to="/education" className="font-bold text-brand-gray hover:text-brand-pink transition-colors">Education</Link>
                <Link to="/community" className="font-bold text-brand-gray hover:text-brand-pink transition-colors">Community</Link>
                <Link to="/cycle-tracker/tracker" className="font-bold text-brand-gray hover:text-brand-pink transition-colors">Mood Tracker</Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
                {user ? (
                    <Link to="/profile" className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-400 border-2 border-white shadow-soft hover:-translate-y-0.5 transition-transform cursor-pointer">
                        {user?.avatar_url
                          ? <img src={user.avatar_url} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
                          : <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-sm">
                              {user?.name?.[0]?.toUpperCase() ?? 'G'}
                            </div>
                        }
                    </Link>
                ) : (
                    <Link
                        to="/login"
                        className="bg-gradient-pink hover:opacity-90 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-pink-100 hover:-translate-y-0.5"
                    >
                        Sign In
                    </Link>
                )}
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden text-brand-dark">
                <Menu size={28} />
            </button>
        </nav>
    );
};

export default Navbar;
