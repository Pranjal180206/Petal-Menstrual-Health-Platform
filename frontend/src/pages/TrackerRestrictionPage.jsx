import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, ArrowLeft, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';

const TrackerRestrictionPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans">
            <Navbar />
            <main className="max-w-2xl mx-auto px-6 py-20 text-center">
                <div className="w-24 h-24 bg-pink-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Lock className="text-pink-500" size={40} />
                </div>
                
                <h1 className="text-3xl font-heading font-extrabold text-[#1D1D2C] mb-4">
                    {t('onboarding.restrictionTitle', 'Tracker Not Available')}
                </h1>
                
                <div className="bg-white rounded-[2.5rem] p-10 shadow-card border border-gray-100 text-gray-600 text-lg leading-relaxed mb-10">
                    <p>
                        {t('onboarding.restrictionMessage', 'The cycle tracker is designed for people who experience periods. You can still explore learning resources and support content 🌼')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate('/education')}
                        className="flex items-center gap-2 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-2xl shadow-lg transition-all"
                    >
                        <BookOpen size={20} />
                        {t('common.exploreResources', 'Explore Resources')}
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-100 hover:border-pink-200 text-gray-600 font-black rounded-2xl transition-all"
                    >
                        <ArrowLeft size={20} />
                        {t('common.backToHome', 'Back to Home')}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default TrackerRestrictionPage;
