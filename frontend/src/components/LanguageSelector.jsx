import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative" id="language-selector">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Select language"
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-pink-100 shadow-sm hover:shadow-md hover:border-brand-pink/40 transition-all duration-200 group"
      >
        <Globe
          size={15}
          className="text-brand-pink group-hover:rotate-12 transition-transform duration-300"
        />
        <span className="text-xs font-bold text-brand-dark font-sans leading-none">
          {currentLang.flag} {currentLang.nativeLabel}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-gray"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-pink-50 overflow-hidden z-[200]"
          >
            {/* Header */}
            <div className="px-4 pt-3 pb-2 border-b border-gray-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray/70 font-sans">
                🌐 Choose Language
              </p>
            </div>

            {/* Options */}
            <div className="p-1.5 space-y-0.5">
              {LANGUAGES.map((lang) => {
                const isActive = i18n.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-brand-pink'
                          : 'hover:bg-gray-50 text-brand-dark'
                      }`}
                  >
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold font-sans leading-tight">
                        {lang.nativeLabel}
                      </span>
                      <span
                        className={`text-[10px] font-medium leading-tight ${
                          isActive ? 'text-brand-pink/70' : 'text-brand-gray'
                        }`}
                      >
                        {lang.label}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeLangDot"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-pink"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
