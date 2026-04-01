
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-[#FAFAFA] border-t border-gray-100 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">

                {/* Brand/Logo Column */}
                <div className="max-w-xs space-y-6">
                    <div className="flex items-center gap-3">
                        <img src="/upay-logo.png" alt="Upay Logo" className="h-[44px] w-auto object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="font-heading font-bold text-xl text-brand-dark tracking-tight">Petal</span>
                            <span className="text-xs text-gray-500 font-medium mt-1">by Upay</span>
                        </div>
                    </div>
                    <p className="text-sm text-brand-gray leading-relaxed">
                        Making health and body education inclusive, fun, and empowering for everyone.
                    </p>

                </div>

                {/* Links Columns */}
                <div className="flex gap-16 md:gap-24">

                    <div className="space-y-4">
                        <h4 className="font-heading font-bold text-brand-dark">About</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about-upay" className="text-sm text-brand-gray hover:text-brand-pink">About Upay</Link></li>
                            <li><a href="https://upayngo.org" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-gray hover:text-brand-pink">Upay Website</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-heading font-bold text-brand-dark">Privacy</h4>
                        <ul className="space-y-3">
                            <li><Link to="/privacy" className="text-sm text-brand-gray hover:text-brand-pink">Your Data</Link></li>
                            <li><Link to="/terms" className="text-sm text-brand-gray hover:text-brand-pink">Safety Rules</Link></li>
                            <li><Link to="/terms" className="text-sm text-brand-gray hover:text-brand-pink">Terms</Link></li>
                            <li><Link to="/contact" className="text-sm text-brand-gray hover:text-brand-pink">Help Center</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-200/60 pt-8 text-center">
                <p className="text-xs text-brand-gray font-medium">
                    © 2024 Petal Health. Made with ✨ for you.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
