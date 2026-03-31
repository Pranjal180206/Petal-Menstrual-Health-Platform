import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosInstance from '../api/axiosInstance';
import { useTranslation } from 'react-i18next';

const Education = () => {
    const { t, i18n } = useTranslation();
    const darkMode = false;
    const heroRef = React.useRef(null);
    const contentRef = React.useRef(null);

    // Active Tab: 'articles', 'myths', 'videos'
    const [activeTab, setActiveTab] = useState('articles');

    // Data States
    const [articles, setArticles] = useState([]);
    const [isArticlesLoading, setIsArticlesLoading] = useState(true);

    const [myths, setMyths] = useState([
        {
            id: 'm1',
            mythKey: 'education.mythsList.m1.myth',
            factKey: 'education.mythsList.m1.fact'
        },
        {
            id: 'm2',
            mythKey: 'education.mythsList.m2.myth',
            factKey: 'education.mythsList.m2.fact'
        },
        {
            id: 'm3',
            mythKey: 'education.mythsList.m3.myth',
            factKey: 'education.mythsList.m3.fact'
        },
        {
            id: 'm4',
            mythKey: 'education.mythsList.m4.myth',
            factKey: 'education.mythsList.m4.fact'
        },
        {
            id: 'm5',
            mythKey: 'education.mythsList.m5.myth',
            factKey: 'education.mythsList.m5.fact'
        },
        {
            id: 'm6',
            mythKey: 'education.mythsList.m6.myth',
            factKey: 'education.mythsList.m6.fact'
        }
    ]);
    const [isMythsLoading, setIsMythsLoading] = useState(false);

    // Videos states
    const [videos, setVideos] = useState([
        {
            id: 1,
            titleKey: "education.videos.v1Title",
            descKey: "education.videos.v1Desc",
            thumbnail: "https://img.youtube.com/vi/vFjao9F1RII/hqdefault.jpg",
            videoUrl: "https://www.youtube.com/embed/vFjao9F1RII"
        },
        {
            id: 2,
            titleKey: "education.videos.v2Title",
            descKey: "education.videos.v2Desc",
            thumbnail: "https://img.youtube.com/vi/W4mI9-ZzB3A/hqdefault.jpg",
            videoUrl: "https://www.youtube.com/embed/W4mI9-ZzB3A"
        },
        {
            id: 3,
            titleKey: "education.videos.v3Title",
            descKey: "education.videos.v3Desc",
            thumbnail: "https://img.youtube.com/vi/qEMO_bU5YyA/hqdefault.jpg",
            videoUrl: "https://www.youtube.com/embed/qEMO_bU5YyA"
        }
    ]);
    const [activeVideo, setActiveVideo] = useState(null);
    const lang = i18n.language || 'en';

    // On mount
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axiosInstance.get('/education/articles');
                setArticles(res.data);
            } catch (err) {
                console.error("Error fetching articles:", err);
            } finally {
                setIsArticlesLoading(false);
            }
        };

        const fetchMyths = async () => {
            setIsMythsLoading(true);
            try {
                const res = await axiosInstance.get('/education/myth-facts');
                if (res.data && res.data.length > 0) {
                    setMyths(prev => {
                        const newMyths = res.data.filter(newM => !prev.some(p => p.id === newM.id));
                        return [...prev, ...newMyths];
                    });
                }
            } catch (err) {
                console.error("Error fetching myths:", err);
            } finally {
                setIsMythsLoading(false);
            }
        };

        fetchArticles();
        fetchMyths();
    }, []);



    // UI Helpers
    const tabClass = (tabName) => {
        const isActive = activeTab === tabName;
        return `px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
            isActive 
                ? (darkMode ? 'bg-pink-500 text-white shadow-lg' : 'bg-[#FF6B9D] text-white shadow-lg')
                : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
        }`;
    };

    return (
        <div
            className="font-display min-h-screen relative transition-colors duration-500"
            style={{ background: darkMode ? '#0f1117' : undefined }}
        >
            <Navbar />

            <div className="layout-container flex h-full grow flex-col">
                <main className="max-w-[1400px] mx-auto w-full px-6 py-10">
                    
                    {/* Hero */}
                    <div ref={heroRef} className="flex flex-col items-start gap-6 mb-12 px-4 max-w-2xl">
                        <span
                            className="inline-block px-5 py-2 rounded-full text-base font-black uppercase tracking-widest"
                            style={{
                                background: darkMode ? 'rgba(244,114,182,0.15)' : 'rgba(255,107,157,0.15)',
                                color: darkMode ? '#f472b6' : '#e63888',
                            }}
                        >
                            {t('education.badge')}
                        </span>
                        <h1
                            className="text-5xl md:text-6xl font-black leading-[1.1]"
                            style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                        >
                            {t('education.title1')}{' '}
                            <span style={{ color: darkMode ? '#f472b6' : '#FF6B9D' }}>
                                {t('education.title2')}
                            </span>
                        </h1>
                        <p
                            className="text-lg font-medium leading-relaxed"
                            style={{ color: darkMode ? '#94a3b8' : '#475569' }}
                        >
                            {t('education.subtitle')}
                        </p>
                    </div>

                    <div ref={contentRef} className="mb-8 flex flex-wrap gap-4 px-2 items-center">
                        <button onClick={() => setActiveTab('articles')} className={tabClass('articles')}>{t('education.articlesTab')}</button>
                        <button onClick={() => setActiveTab('videos')} className={tabClass('videos')}>{t('education.videosTab')}</button>
                        <button onClick={() => setActiveTab('myths')} className={tabClass('myths')}>{t('education.mythsTab')}</button>
                        
                        {/* Standalone Quizzes Page Link */}
                        <Link 
                            to="/quizzes" 
                            className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} flex items-center gap-2`}
                        >
                            {t('education.quizzesTab')}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </Link>
                    </div>

                    <div className="min-h-[400px]">
                        {/* ARTICLES SECTION */}
                        {activeTab === 'articles' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isArticlesLoading ? (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('education.loadingArticles')}</p>
                                ) : articles.length > 0 ? (
                                    articles.map(a => (
                                        <div key={a.id} className={`p-6 rounded-3xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} shadow-sm`}>
                                            <h3 className={`text-xl font-black mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{a.title?.[lang] || a.title?.en || a.title}</h3>
                                            <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{a.content?.[lang] || a.content?.en || a.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('education.noArticles')}</p>
                                )}
                            </div>
                        )}

                        {/* MYTHS & FACTS SECTION */}
                        {activeTab === 'myths' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isMythsLoading ? (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('education.loadingMyths')}</p>
                                ) : myths.length > 0 ? (
                                    myths.map(m => {
                                        const mythText = m.mythKey ? t(m.mythKey) : (m.myth?.[lang] || m.myth?.en || m.myth);
                                        const factText = m.factKey ? t(m.factKey) : (m.fact?.[lang] || m.fact?.en || m.fact);
                                        return (
                                        <div key={m.id} className={`p-6 rounded-3xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} flex flex-col gap-4 shadow-sm`}>
                                            <div>
                                                <span className="text-xs font-black uppercase tracking-widest text-pink-500 mb-1 block">{t('education.mythLabel')}</span>
                                                <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{mythText}</p>
                                            </div>
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-900' : 'bg-green-50'}`}>
                                                <span className="text-xs font-black uppercase tracking-widest text-green-600 mb-1 block">{t('education.factLabel')}</span>
                                                <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{factText}</p>
                                            </div>
                                        </div>
                                        );
                                    })
                                ) : (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('education.noMyths')}</p>
                                )}
                            </div>
                        )}

                        {/* VIDEOS SECTION */}
                        {activeTab === 'videos' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.length > 0 ? (
                                    videos.map(v => (
                                        <div key={v.id} className={`p-0 overflow-hidden rounded-3xl border-2 flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} shadow-sm`}>
                                            <div className="relative w-full aspect-video bg-slate-900 group">
                                                <img src={v.thumbnail} alt={t(v.titleKey)} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="bg-black/50 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm">
                                                        <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className={`text-xl font-black mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t(v.titleKey)}</h3>
                                                <p className={`text-sm mb-6 flex-grow line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t(v.descKey)}</p>
                                                <button 
                                                    onClick={() => setActiveVideo(v)}
                                                    className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${darkMode ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-[#FF6B9D] text-white hover:opacity-90'}`}
                                                >
                                                    {t('education.watchNow')}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('education.noVideos')}</p>
                                )}
                            </div>
                        )}

                    </div>

                </main>
            </div>
            <Footer />

            {/* VIDEO MODAL */}
            {activeVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                        {/* Close button */}
                        <button 
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        
                        {/* Video Container (16:9 aspect ratio) */}
                        <div className="relative w-full pt-[56.25%]">
                            <iframe 
                                className="absolute inset-0 w-full h-full"
                                src={activeVideo.videoUrl} 
                                title={t(activeVideo.titleKey)}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className={`p-6 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                            <h2 className="text-2xl font-black mb-2">{t(activeVideo.titleKey)}</h2>
                            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t(activeVideo.descKey)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Education;