import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosInstance from '../api/axiosInstance';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getLocalizedText, formatContentWithLanguageInfo, getLanguageName, translateArticle, detectLanguage } from '../utils/translation';

const getEmbedUrl = (url) => {
    if (!url) return "";
    // Handle watch?v=, youtu.be/, embed/, and shorts/
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : url;
};

const Education = () => {
    const { t, i18n } = useTranslation();
    const darkMode = false;
    const heroRef = React.useRef(null);
    const contentRef = React.useRef(null);

    // Active Tab: 'articles', 'myths', 'videos'
    const [activeTab, setActiveTab] = useState('articles');

    // Data States
    const [articles, setArticles] = useState([]);
    const [originalArticles, setOriginalArticles] = useState([]); // Keep original for re-translation
    const [isArticlesLoading, setIsArticlesLoading] = useState(true);
    const [isTranslating, setIsTranslating] = useState(false);
    const [featured, setFeatured] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

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
    const [videos, setVideos] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [activeArticle, setActiveArticle] = useState(null);
    const lang = i18n.language || 'en';

    // On mount and language change
    useEffect(() => {

        const fetchArticles = async () => {
            try {
                const [articlesRes, featuredRes] = await Promise.all([
                    axiosInstance.get('/education/articles'),
                    axiosInstance.get('/education/articles/featured').catch(() => ({ data: [] }))
                ]);
                setOriginalArticles(articlesRes.data);
                setArticles(articlesRes.data);
                setFeatured(featuredRes.data);
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
                    // Replace all myths with backend + hardcoded (backend has priority)
                    const backendMyths = res.data.map(m => ({
                        ...m,
                        id: m.id || m._id
                    }));
                    
                    // Keep hardcoded myths that aren't in backend
                    const hardcodedMyths = [
                        { id: 'm1', mythKey: 'education.mythsList.m1.myth', factKey: 'education.mythsList.m1.fact' },
                        { id: 'm2', mythKey: 'education.mythsList.m2.myth', factKey: 'education.mythsList.m2.fact' },
                        { id: 'm3', mythKey: 'education.mythsList.m3.myth', factKey: 'education.mythsList.m3.fact' },
                        { id: 'm4', mythKey: 'education.mythsList.m4.myth', factKey: 'education.mythsList.m4.fact' },
                        { id: 'm5', mythKey: 'education.mythsList.m5.myth', factKey: 'education.mythsList.m5.fact' },
                        { id: 'm6', mythKey: 'education.mythsList.m6.myth', factKey: 'education.mythsList.m6.fact' }
                    ];
                    
                    const backendIds = backendMyths.map(m => m.id);
                    const remainingHardcoded = hardcodedMyths.filter(m => !backendIds.includes(m.id));
                    
                    setMyths([...backendMyths, ...remainingHardcoded]);
                } else {
                    // No backend myths, use hardcoded only
                    setMyths([
                        { id: 'm1', mythKey: 'education.mythsList.m1.myth', factKey: 'education.mythsList.m1.fact' },
                        { id: 'm2', mythKey: 'education.mythsList.m2.myth', factKey: 'education.mythsList.m2.fact' },
                        { id: 'm3', mythKey: 'education.mythsList.m3.myth', factKey: 'education.mythsList.m3.fact' },
                        { id: 'm4', mythKey: 'education.mythsList.m4.myth', factKey: 'education.mythsList.m4.fact' },
                        { id: 'm5', mythKey: 'education.mythsList.m5.myth', factKey: 'education.mythsList.m5.fact' },
                        { id: 'm6', mythKey: 'education.mythsList.m6.myth', factKey: 'education.mythsList.m6.fact' }
                    ]);
                }
            } catch (err) {
                console.error("Error fetching myths:", err);
                // Fallback to hardcoded on error
                setMyths([
                    { id: 'm1', mythKey: 'education.mythsList.m1.myth', factKey: 'education.mythsList.m1.fact' },
                    { id: 'm2', mythKey: 'education.mythsList.m2.myth', factKey: 'education.mythsList.m2.fact' },
                    { id: 'm3', mythKey: 'education.mythsList.m3.myth', factKey: 'education.mythsList.m3.fact' },
                    { id: 'm4', mythKey: 'education.mythsList.m4.myth', factKey: 'education.mythsList.m4.fact' },
                    { id: 'm5', mythKey: 'education.mythsList.m5.myth', factKey: 'education.mythsList.m5.fact' },
                    { id: 'm6', mythKey: 'education.mythsList.m6.myth', factKey: 'education.mythsList.m6.fact' }
                ]);
            } finally {
                setIsMythsLoading(false);
            }
        };

        const fetchVideos = async () => {
            try {
                const res = await axiosInstance.get('/education/videos');
                setVideos(res.data);
            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        };

        fetchArticles();
        fetchMyths();
        fetchVideos();
    }, []); // Only fetch on mount


    // Translate articles when language changes
    useEffect(() => {
        const translateAllArticles = async () => {
            if (originalArticles.length === 0) return;
            
            // If language is English, show originals (most content is in English)
            if (lang === 'en') {
                setArticles(originalArticles);
                return;
            }
            
            setIsTranslating(true);
            try {
                // Translate articles in parallel
                const translatedArticles = await Promise.all(
                    originalArticles.map(article => translateArticle(article, lang))
                );
                setArticles(translatedArticles);
            } catch (error) {
                console.error('Error translating articles:', error);
                setArticles(originalArticles); // Fallback to originals
            } finally {
                setIsTranslating(false);
            }
        };

        translateAllArticles();
    }, [lang, originalArticles]); // Re-translate when language or originals change


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
                    <div ref={heroRef} className="flex flex-col items-start gap-6 mb-12 px-4 max-w-2xl" data-tour-id="education-hero">
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
                        {activeTab === 'articles' && (() => {
                            const categories = [
                                "all",
                                ...new Set(articles.map(a => a.category).filter(Boolean))
                            ];

                            const filteredArticles = articles
                                .filter(a => selectedCategory === "all" || a.category === selectedCategory)
                                .filter(a => {
                                    if (!searchQuery) return true;
                                    const titleStr = typeof a.title === 'string' ? a.title : getLocalizedText(a.title, lang) || "";
                                    const summaryStr = typeof a.summary === 'string' ? a.summary : getLocalizedText(a.summary, lang) || "";
                                    return titleStr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                           summaryStr.toLowerCase().includes(searchQuery.toLowerCase());
                                });

                            return (
                                <div>
                                    {isTranslating && (
                                        <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-sm font-medium text-blue-700">{t('education.translating')}</span>
                                        </div>
                                    )}

                                    {/* Featured articles */}
                                    {featured.length > 0 && !isArticlesLoading && (
                                    <div className="mb-8">
                                        <h2 className={`text-lg font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-yellow-400' : 'text-amber-500'}`}>
                                        ⭐ {t('education.featured', 'Featured')}
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {featured.map(article => (
                                            <div 
                                                key={article.id}
                                                onClick={() => navigate(article.slug ? `/education/${article.slug}` : `/education`)}
                                                className={`p-6 bg-yellow-50 border-2 border-yellow-200 rounded-3xl cursor-pointer hover:shadow-md transition-all flex flex-col`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    {article.category && (
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">{article.category}</span>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-black text-slate-800 line-clamp-2">{getLocalizedText(article.title, lang)}</h3>
                                                {article.summary && (
                                                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{getLocalizedText(article.summary, lang)}</p>
                                                )}
                                                <div className="mt-4 text-xs font-bold text-amber-600 flex justify-between items-center">
                                                    <span>By {article.author_name || "Petal Team"}</span>
                                                    <span>Read →</span>
                                                </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    )}

                                    {/* Search & Categories */}
                                    {!isArticlesLoading && (
                                        <div className="mb-8">
                                            <input
                                                type="text"
                                                placeholder={t('education.searchPlaceholder', "Search articles...")}
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                className={`w-full px-6 py-4 rounded-2xl border-2 font-medium focus:outline-none transition-colors mb-4 ${
                                                    darkMode 
                                                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-pink-500' 
                                                        : 'bg-white border-slate-100 text-slate-800 placeholder-slate-400 focus:border-pink-300'
                                                }`}
                                            />
                                            <div className="flex gap-2 flex-wrap">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setSelectedCategory(cat)}
                                                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                                                            selectedCategory === cat
                                                                ? 'bg-pink-500 text-white shadow-md'
                                                                : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-pink-300')
                                                        }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {isArticlesLoading ? (
                                        <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('education.loadingArticles')}</p>
                                    ) : filteredArticles.length > 0 ? (
                                        filteredArticles.map(article => {
                                            const isTranslatedArticle = article._translated;
                                            return (
                                            <div key={article.id} className={`p-6 rounded-3xl border-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 hover:border-pink-200'} shadow-sm flex flex-col transition-all cursor-pointer`} onClick={() => navigate(article.slug ? `/education/${article.slug}` : `/article/${article.id}`)}>
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className={`text-xl font-black flex-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-pink-500 transition-colors`}>
                                                        {getLocalizedText(article.title, lang)}
                                                    </h3>
                                                    {isTranslatedArticle && (
                                                        <span className="ml-2 px-2 py-1 text-[10px] font-black uppercase bg-green-100 text-green-600 rounded-full">
                                                            {t('education.translated')}
                                                        </span>
                                                    )}
                                                </div>
                                                {article.summary && (
                                                    <p className={`text-sm leading-relaxed mb-4 line-clamp-3 flex-grow ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        {getLocalizedText(article.summary, lang)}
                                                    </p>
                                                )}
                                                {!article.summary && (
                                                    <p className={`text-sm leading-relaxed mb-4 line-clamp-3 flex-grow ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        {getLocalizedText(article.content, lang).replace(/<[^>]*>?/gm, '')}
                                                    </p>
                                                )}
                                                
                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                                    <span className={`text-xs font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {article.author_name || "Petal Team"}
                                                    </span>
                                                    <button onClick={(e) => { e.stopPropagation(); navigate(`/article/${article._id || article.id}`); }} className="text-xs font-black uppercase text-pink-500 hover:text-pink-600 transition-colors">
                                                        READ →
                                                    </button>
                                                </div>
                                            </div>
                                            );
                                        })
                                    ) : (
                                        <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('education.noArticles', 'No articles found.')}</p>
                                    )}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* MYTHS & FACTS SECTION */}
                        {activeTab === 'myths' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isMythsLoading ? (
                                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{t('education.loadingMyths')}</p>
                                ) : myths.length > 0 ? (
                                    myths.map(m => {
                                        const mythText = m.mythKey ? t(m.mythKey) : getLocalizedText(m.myth, lang);
                                        const factText = m.factKey ? t(m.factKey) : getLocalizedText(m.fact, lang);
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
                                    videos.map(video => (
                                        <div key={video.id} className={`p-0 overflow-hidden rounded-3xl border-2 flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-100'} shadow-sm`}>
                                            <div className="relative w-full aspect-video bg-slate-900 group">
                                                <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="bg-black/50 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm">
                                                        <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className={`text-xl font-black mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{getLocalizedText(video.title, lang)}</h3>
                                                <p className={`text-sm mb-6 flex-grow line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{getLocalizedText(video.description, lang)}</p>
                                                <button 
                                                    onClick={() => setActiveVideo({
                                                        title: getLocalizedText(video.title, lang),
                                                        description: getLocalizedText(video.description, lang),
                                                        videoUrl: video.youtube_url || video.video_url
                                                    })}
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
                                src={getEmbedUrl(activeVideo.videoUrl)} 
                                title={activeVideo.title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                            ></iframe>
                        </div>
                        <div className={`p-6 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                            <h2 className="text-2xl font-black mb-2">{activeVideo.title}</h2>
                            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{activeVideo.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ARTICLE MODAL (Floating full-screen) */}
            {activeArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`relative w-full max-w-4xl h-[90vh] md:h-auto max-h-[85vh] overflow-hidden rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}
                    >
                        {/* Header */}
                        <div className={`px-10 py-8 border-b ${darkMode ? 'border-slate-800' : 'border-slate-50'} flex items-start justify-between bg-gradient-to-r ${darkMode ? 'from-slate-900 to-slate-800' : 'from-white to-pink-50/30'}`}>
                            <div className="pr-8">
                                <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${darkMode ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                                    {activeArticle.category}
                                </div>
                                <h2 className={`text-3xl md:text-4xl font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {activeArticle.title}
                                </h2>
                            </div>
                            <button 
                                onClick={() => setActiveArticle(null)}
                                className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${darkMode ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-10 md:p-12 overflow-y-auto custom-scrollbar flex-grow bg-white/50 backdrop-blur-sm">
                            <div className={`prose prose-lg max-w-none prose-headings:font-black prose-p:font-medium prose-p:leading-relaxed ${darkMode ? 'prose-invert' : 'prose-slate'}`}>
                                <p className={`whitespace-pre-wrap text-lg md:text-xl font-medium leading-relaxed opacity-90 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {activeArticle.content}
                                </p>
                            </div>
                            
                            {activeArticle.isTranslated && (
                                <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'} text-sm italic opacity-60`}>
                                    {t('education.originalLanguage')}: {getLanguageName(activeArticle.sourceLang)}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Education;
