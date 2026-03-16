import React, { useState, useEffect } from 'react';
import { Edit3, Heart, MessageCircle, Sparkles, MoreHorizontal, X, Send, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STORAGE_KEY = 'community_hub_posts';

const AVATAR_COLORS = ['#FF6B9A', '#A78BFA', '#34D399', '#60A5FA', '#FBBF24', '#F87171'];
const ANONYMOUS_NAMES = ['MoonPetal', 'SilverWave', 'CosmicBloom', 'StarDust', 'NightBlossom', 'CrystalDew'];

const AFFIRMATIONS = [
    "Your body is doing something incredible. Be kind to yourself today. 💗",
    "You are allowed to take up space. Your feelings are valid. 🌸",
    "Every cycle is a reminder of your body's quiet strength. ✨",
    "Rest is not weakness — it's wisdom. Take care of yourself today. 🌙",
    "You are more resilient than you know. Keep going, one day at a time. 🌷",
    "It's okay to feel everything deeply. That's your superpower. 💫",
    "Your body deserves patience, not perfection. 🤍",
    "You belong here. Your story matters. 🌺",
    "Small steps still move you forward. You're doing great. 🦋",
    "Today, choose gentleness — especially with yourself. 🌿",
    "You are growing even on the hard days. Trust the process. 🌱",
    "Feeling off? That's okay. Tomorrow is a fresh start. 🌅",
    "You don't have to be okay all the time. That's what this space is for. 💜",
    "Your worth is not tied to your productivity. Rest freely. ☁️",
    "Every version of you — tired, happy, unsure — is worthy of love. 💖",
    "You've made it through every hard day so far. That's 100%. 🌟",
    "Your emotions are not too much. They're perfectly you. 🎀",
    "Be the friend to yourself that you are to others. 🤗",
    "Healing isn't linear, and that's completely fine. 🌊",
    "You are seen, you are heard, you are not alone here. 💞",
    "Today is a good day to be proud of how far you've come. 🏵️",
    "Your sensitivity is a gift, not a flaw. 🌸",
    "Breathe. You've got this. One moment at a time. 🍃",
    "Kindness starts within. How will you show up for yourself today? 🌼",
    "You are enough — exactly as you are, right now. ✨",
    "Cramps, mood swings, bloating — you handle so much. You're amazing. 💪",
    "Your cycle doesn't define you, but understanding it empowers you. 🔮",
    "Every day you show up is a win worth celebrating. 🎉",
    "It's okay to ask for help. Strength includes reaching out. 🤝",
    "You are blooming, even when it doesn't feel like it. 🌻",
];

const getDailyAffirmation = () => {
    const today = new Date();
    const dayIndex = Math.floor(today.getTime() / 86400000); // changes every 24h
    return AFFIRMATIONS[dayIndex % AFFIRMATIONS.length];
};

const formatTimestamp = (isoString) => {
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const PostCard = ({ post }) => {
    const [localReactions, setLocalReactions] = useState(post.reactions);

    const handleReact = (type) => {
        setLocalReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
    };

    return (
        <div
            className="post-card bg-white rounded-3xl p-6 border border-gray-100"
            style={{
                boxShadow: '0 4px 24px rgba(255,107,154,0.07)',
                animation: 'fadeSlideIn 0.5s ease forwards',
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: post.color }}
                    >
                        {post.initials}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1D1D2C]">{post.username}</h4>
                            {post.isUserPost && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-[#FF6B9A]" style={{ background: 'rgba(255,107,154,0.1)' }}>You</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">{formatTimestamp(post.createdAt)}</p>
                    </div>
                </div>
                <button className="text-gray-300 hover:text-gray-500 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content */}
            <p className="text-[#4A4A5C] leading-relaxed mb-4 text-sm">{post.content}</p>

            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags.map(tag => (
                        <span
                            key={tag}
                            className="text-[#FF6B9A] text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{ background: 'rgba(255,107,154,0.08)' }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Reactions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex gap-2">
                    {localReactions.heart > 0 && (
                        <button
                            onClick={() => handleReact('heart')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                            style={{ background: '#FFF0F4', color: '#FF6B9A' }}
                        >
                            <Heart size={13} fill="currentColor" strokeWidth={0} /> {localReactions.heart}
                        </button>
                    )}
                    {localReactions.hug > 0 && (
                        <button
                            onClick={() => handleReact('hug')}
                            className="flex items-center gap-1.5 bg-blue-50 text-blue-500 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-100 transition-all hover:scale-105"
                        >
                            🫂 {localReactions.hug}
                        </button>
                    )}
                    {localReactions.sparkle > 0 && (
                        <button
                            onClick={() => handleReact('sparkle')}
                            className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-100 transition-all hover:scale-105"
                        >
                            ✨ {localReactions.sparkle}
                        </button>
                    )}
                </div>
                <button className="flex items-center gap-1.5 text-gray-400 text-xs font-bold hover:text-[#FF6B9A] transition-colors">
                    <MessageCircle size={14} /> {post.replies} Replies
                </button>
            </div>
        </div>
    );
};

const ShareStoryModal = ({ onClose, onSubmit }) => {
    const [story, setStory] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const t = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
            if (!tags.includes(t)) setTags([...tags, t]);
            setTagInput('');
        }
    };

    const removeTag = (t) => setTags(tags.filter(x => x !== t));

    const handleSubmit = () => {
        if (!story.trim()) return;
        onSubmit(story.trim(), tags);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(29,29,44,0.45)', backdropFilter: 'blur(6px)' }}
        >
            <div
                className="bg-white rounded-3xl p-7 w-full max-w-lg shadow-2xl"
                style={{ animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-extrabold text-[#1D1D2C]">Share Your Story 💬</h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">You're completely anonymous here 🌸</p>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Avatar preview */}
                <div className="flex items-center gap-3 mb-5">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: '#FF6B9A' }}
                    >
                        Y
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1D1D2C]">You (Anonymous)</p>
                        <p className="text-xs text-gray-400">Your identity stays private</p>
                    </div>
                </div>

                <textarea
                    value={story}
                    onChange={e => setStory(e.target.value)}
                    placeholder="What's on your mind? Share freely — this is a safe space 💗"
                    rows={5}
                    className="w-full rounded-2xl border border-gray-200 p-4 text-sm text-[#4A4A5C] resize-none outline-none focus:border-[#FF6B9A] transition-colors leading-relaxed"
                    style={{ fontFamily: 'inherit' }}
                />

                {/* Tag input */}
                <div className="mt-3">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Add tags and press Enter (e.g. #CrampHacks)"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs outline-none focus:border-[#FF6B9A] transition-colors"
                        style={{ fontFamily: 'inherit' }}
                    />
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2.5">
                            {tags.map(t => (
                                <span
                                    key={t}
                                    className="flex items-center gap-1 text-[#FF6B9A] text-xs font-bold px-3 py-1.5 rounded-full"
                                    style={{ background: 'rgba(255,107,154,0.08)' }}
                                >
                                    {t}
                                    <button onClick={() => removeTag(t)} className="ml-1 text-[#FF6B9A] hover:text-[#E11D48]">
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!story.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-bold transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #FF79A8, #F0457A)' }}
                    >
                        <Send size={14} /> Post Anonymously
                    </button>
                </div>
            </div>
        </div>
    );
};

const CommunityHub = () => {
    const [posts, setPosts] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedMood, setSelectedMood] = useState(null);

    const filters = ['All', 'Trending', 'New', 'My Posts'];
    const moodEmojis = ['😔', '😐', '🙂', '😊', '🌟'];

    // Persist to localStorage whenever posts change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        } catch {}
    }, [posts]);

    const [emojiPop, setEmojiPop] = useState(null);

    const triggerEmojiPop = (emoji) => {
        // Remove any existing pop
        const existing = document.getElementById('ch-emoji-pop');
        if (existing) existing.remove();
        const existingStyle = document.getElementById('ch-emoji-pop-style');
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = 'ch-emoji-pop-style';
        style.textContent = `
            @keyframes chEmojiPop {
                0%   { transform: scale(0.3) rotate(-15deg); opacity: 0; }
                18%  { transform: scale(1.25) rotate(8deg);  opacity: 1; }
                35%  { transform: scale(0.95) rotate(-4deg); opacity: 1; }
                50%  { transform: scale(1.08) rotate(2deg);  opacity: 1; }
                65%  { transform: scale(1.0)  rotate(0deg);  opacity: 0.9; }
                100% { transform: scale(1.15) rotate(5deg);  opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        const el = document.createElement('div');
        el.id = 'ch-emoji-pop';
        el.innerHTML = emoji;
        Object.assign(el.style, {
            position:      'fixed',
            right:         '32px',
            top:           '50%',
            transform:     'translateY(-50%)',
            fontSize:      '6rem',
            lineHeight:    '1',
            pointerEvents: 'none',
            userSelect:    'none',
            zIndex:        '99999',
            opacity:       '0',
            animation:     'chEmojiPop 2.8s cubic-bezier(0.34,1.56,0.64,1) forwards',
            filter:        'drop-shadow(0 8px 24px rgba(255,107,154,0.35))',
            willChange:    'transform, opacity',
        });
        document.body.appendChild(el);

        setTimeout(() => {
            el.remove();
            const s = document.getElementById('ch-emoji-pop-style');
            if (s) s.remove();
        }, 3000);
    };

    const handleMoodSelect = (emoji, index) => {
        setSelectedMood(index);
        triggerEmojiPop(String(emoji));
    };

    const handleNewPost = (content, tags) => {
        const randomName = ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
        const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
        const newPost = {
            id: Date.now(),
            initials: 'Y',
            color: randomColor,
            username: randomName,
            createdAt: new Date().toISOString(),
            content,
            tags,
            reactions: { heart: 0, hug: 0, sparkle: 0 },
            replies: 0,
            isUserPost: true,
        };
        setPosts(prev => [newPost, ...prev]);
    };

    // Filter logic
    const displayedPosts = (() => {
        if (activeFilter === 'My Posts') return posts.filter(p => p.isUserPost);
        if (activeFilter === 'New') return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (activeFilter === 'Trending') return [...posts].sort((a, b) => {
            const totalA = Object.values(a.reactions).reduce((s, v) => s + v, 0);
            const totalB = Object.values(b.reactions).reduce((s, v) => s + v, 0);
            return totalB - totalA;
        });
        return posts; // All
    })();

    // Real stats
    const totalStories = posts.length;
    const totalMembers = [...new Set(posts.map(p => p.username))].length;
    const totalReactions = posts.reduce((sum, p) => sum + Object.values(p.reactions).reduce((a, b) => a + b, 0), 0);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:wght@400;500;600;700&display=swap');

                .community-root { font-family: 'DM Sans', sans-serif; }
                .font-display { font-family: 'Fraunces', serif; }

                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes floatBubble {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(3deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,154,0.3); }
                    50% { box-shadow: 0 0 0 12px rgba(255,107,154,0); }
                }
                .float-1 { animation: floatBubble 6s ease-in-out infinite; }
                .float-2 { animation: floatBubble 8s ease-in-out infinite 1s; }
                .float-3 { animation: floatBubble 7s ease-in-out infinite 2s; }

                .share-btn { animation: pulse-glow 2.5s ease-in-out infinite; }

                .filter-pill.active {
                    background: #1D1D2C;
                    color: white;
                }

                .empty-state {
                    animation: fadeSlideIn 0.4s ease forwards;
                }

                .mood-btn-active {
                    background: rgba(255,107,154,0.15) !important;
                    transform: scale(1.2);
                    box-shadow: 0 0 0 3px rgba(255,107,154,0.25);
                }
            `}</style>

            <div className="community-root min-h-screen flex flex-col bg-[#FDF7F9] text-[#1D1D2C]">

                {/* Decorative blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="float-1 absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle, #FF6B9A, transparent)' }} />
                    <div className="float-2 absolute top-1/3 -left-20 w-48 h-48 rounded-full opacity-15"
                        style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }} />
                    <div className="float-3 absolute bottom-20 right-10 w-56 h-56 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #34D399, transparent)' }} />
                </div>

                <div className="relative z-50">
                    <Navbar />
                </div>

                <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-20 pb-56 flex flex-col lg:flex-row gap-10 relative z-10" style={{ minHeight: 'calc(100vh - 80px)' }}>

                    {/* LEFT — Feed */}
                    <div className="flex-1 max-w-2xl">

                        {/* Hero header */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-[#FF6B9A] uppercase mb-2">✦ Safe &amp; Anonymous</p>
                                    <h1 className="font-display text-4xl md:text-5xl font-black text-[#1D1D2C] leading-tight mb-2">
                                        Community Hub
                                    </h1>
                                    <p className="text-gray-400 font-medium text-sm mt-2 max-w-xs leading-relaxed">
                                        A warm, judgment-free space to share, learn, and grow 🌸
                                    </p>
                                </div>

                                {/* Share button */}
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="share-btn hidden sm:flex items-center gap-2 text-white px-5 py-3 rounded-full font-bold text-sm transition-all shrink-0 mt-2"
                                    style={{ background: 'linear-gradient(135deg, #FF9DBB, #FF6B9A)' }}
                                >
                                    <Edit3 size={15} /> Share Your Story
                                </button>
                            </div>

                            {/* Filter pills */}
                            <div className="flex gap-2 mt-6 flex-wrap">
                                {filters.map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`filter-pill px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeFilter === f ? 'active border-transparent' : 'border-gray-200 text-gray-500 bg-white hover:border-[#1D1D2C] hover:text-[#1D1D2C]'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile share button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="sm:hidden w-full flex items-center justify-center gap-2 text-white px-5 py-3 rounded-2xl font-bold text-sm mb-6"
                            style={{ background: 'linear-gradient(135deg, #FF9DBB, #FF6B9A)' }}
                        >
                            <Edit3 size={15} /> Share Your Story
                        </button>

                        {/* Posts */}
                        <div className="space-y-5">
                            {displayedPosts.length === 0 ? (
                                <div className="empty-state flex flex-col items-center justify-center py-40 text-center">
                                    <div className="text-5xl mb-4">🌸</div>
                                    <h3 className="font-display font-bold text-xl text-[#1D1D2C] mb-2">No posts yet</h3>
                                    <p className="text-gray-400 text-sm max-w-xs">Be the first to share your story in this space!</p>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="mt-5 px-6 py-2.5 rounded-full text-white text-sm font-bold"
                                        style={{ background: 'linear-gradient(135deg, #FF9DBB, #FF6B9A)' }}
                                    >
                                        Share Now
                                    </button>
                                </div>
                            ) : (
                                displayedPosts.map((post, i) => (
                                    <div key={post.id} style={{ animationDelay: `${i * 0.08}s` }}>
                                        <PostCard post={post} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Sidebar */}
                    <aside className="w-full lg:w-72 space-y-5">

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { emoji: '💬', count: totalStories, label: 'Stories' },
                                { emoji: '🌸', count: totalMembers, label: 'Members' },
                                { emoji: '💗', count: totalReactions, label: 'Reactions' },
                            ].map(s => (
                                <div key={s.label} className="bg-white rounded-2xl p-3 text-center border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(255,107,154,0.06)' }}>
                                    <div className="text-lg mb-1">{s.emoji}</div>
                                    <div className="font-display font-black text-base text-[#1D1D2C]">{s.count}</div>
                                    <div className="text-[10px] text-gray-400 font-semibold">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Mood check */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100" style={{ boxShadow: '0 4px 24px rgba(255,107,154,0.06)' }}>
                            <h3 className="font-display font-bold text-base text-[#1D1D2C] mb-1">How are you today?</h3>
                            <p className="text-xs text-gray-400 font-medium mb-4">No pressure — just checking in 🤍</p>
                            <div className="grid grid-cols-5 gap-1.5">
                                {moodEmojis.map((emoji, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleMoodSelect(emoji, i)}
                                        className={`text-xl py-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${selectedMood === i ? 'mood-btn-active' : 'hover:bg-pink-50'}`}
                                        title={['Not great', 'Okay', 'Good', 'Happy', 'Amazing!'][i]}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                            {selectedMood !== null && (
                                <p className="text-center text-xs text-[#FF6B9A] font-bold mt-3 animate-pulse">
                                    {['Sending you a big hug 🤍', 'It\'s okay to feel okay 🌿', 'Glad you\'re here 🌸', 'Love that energy 💛', 'You\'re absolutely shining ✨'][selectedMood]}
                                </p>
                            )}
                        </div>

                        {/* Affirmation */}
                        <div
                            className="rounded-3xl p-5 border border-dashed border-pink-200"
                            style={{ background: 'linear-gradient(135deg, #FFF0F4, #FDF7F9)' }}
                        >
                            <p className="font-display text-sm font-bold text-[#E11D48] italic leading-relaxed">
                                "{getDailyAffirmation()}"
                            </p>
                            <p className="text-xs text-gray-400 font-medium mt-2">Daily affirmation</p>
                        </div>
                    </aside>
                </main>

                <div className="relative z-50">
                    <Footer />
                </div>

                {/* Modal */}
                {showModal && (
                    <ShareStoryModal
                        onClose={() => setShowModal(false)}
                        onSubmit={handleNewPost}
                    />
                )}
            </div>
        </>
    );
};

export default CommunityHub;
