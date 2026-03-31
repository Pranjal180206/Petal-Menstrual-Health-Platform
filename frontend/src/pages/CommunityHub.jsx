import React, { useState, useEffect } from 'react';
import { Edit3, Heart, MessageCircle, Sparkles, MoreHorizontal, X, Send, Smile, Flag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { detectLanguage, getLanguageName } from '../utils/translation';

const AVATAR_COLORS = ['#FF6B9A', '#A78BFA', '#34D399', '#60A5FA', '#FBBF24', '#F87171'];
const ANONYMOUS_NAMES = ['MoonPetal', 'SilverWave', 'CosmicBloom', 'StarDust', 'NightBlossom', 'CrystalDew'];

// Deterministic color from a string (post id or username)
const getAvatarColor = (str = '') => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const AFFIRMATIONS = {
    en: [
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
    ],
    hi: [
        "आपका शरीर कुछ अविश्वसनीय कर रहा है। आज खुद के प्रति दयालु रहें। 💗",
        "आप जगह लेने के हकदार हैं। आपकी भावनाएँ मान्य हैं। 🌸",
        "हर चक्र आपके शरीर की शांत शक्ति की याद दिलाता है। ✨",
        "आराम कमजोरी नहीं है — यह बुद्धिमत्ता है। आज खुद का ख्याल रखें। 🌙",
        "आप जितना सोचते हैं उससे अधिक लचीले हैं। एक समय में एक दिन आगे बढ़ते रहें। 🌷",
        "सब कुछ गहराई से महसूस करना ठीक है। यही आपकी महाशक्ति है। 💫",
        "आपका शरीर धैर्य का हकदार है, पूर्णता का नहीं। 🤍",
        "आप यहाँ हैं। आपकी कहानी मायने रखती है। 🌺",
        "छोटे कदम भी आपको आगे बढ़ाते हैं। आप बहुत अच्छा कर रहे हैं। 🦋",
        "आज, कोमलता चुनें — खासकर अपने साथ। 🌿",
        "कठिन दिनों में भी आप बढ़ रहे हैं। प्रक्रिया पर भरोसा करें। 🌱",
        "थोड़ा अलग महसूस कर रहे हैं? कोई बात नहीं। कल एक नई शुरुआत है। 🌅",
        "आपको हर समय ठीक रहने की जरूरत नहीं है। इसीलिए यह स्थान है। 💜",
        "आपकी कीमत आपकी उत्पादकता से नहीं जुड़ी है। स्वतंत्र रूप से आराम करें। ☁️",
        "आपका हर संस्करण — थका हुआ, खुश, अनिश्चित — प्यार के योग्य है। 💖",
        "आपने अब तक हर कठिन दिन पार कर लिया है। यह 100% है। 🌟",
        "आपकी भावनाएँ बहुत अधिक नहीं हैं। वे पूरी तरह से आप हैं। 🎀",
        "अपने लिए वही दोस्त बनें जो आप दूसरों के लिए हैं। 🤗",
        "उपचार रैखिक नहीं है, और यह पूरी तरह से ठीक है। 🌊",
        "आपको देखा जाता है, आपको सुना जाता है, आप यहाँ अकेले नहीं हैं। 💞",
        "आज गर्व करने का अच्छा दिन है कि आप कितनी दूर आ गए हैं। 🏵️",
        "आपकी संवेदनशीलता एक उपहार है, दोष नहीं। 🌸",
        "साँस लें। आप यह कर सकते हैं। एक समय में एक क्षण। 🍃",
        "दयालुता भीतर से शुरू होती है। आज आप खुद के लिए कैसे उपस्थित होंगे? 🌼",
        "आप पर्याप्त हैं — बिल्कुल जैसे आप हैं, अभी। ✨",
        "ऐंठन, मूड स्विंग, सूजन — आप बहुत कुछ संभालते हैं। आप अद्भुत हैं। 💪",
        "आपका चक्र आपको परिभाषित नहीं करता, लेकिन इसे समझना आपको सशक्त बनाता है। 🔮",
        "हर दिन जब आप दिखाई देते हैं तो यह जश्न मनाने लायक जीत है। 🎉",
        "मदद माँगना ठीक है। शक्ति में पहुँचना शामिल है। 🤝",
        "आप खिल रहे हैं, भले ही ऐसा न लगे। 🌻",
    ],
    mr: [
        "तुमचे शरीर काहीतरी अविश्वसनीय करत आहे. आज स्वतःशी दयाळू व्हा. 💗",
        "तुम्हाला जागा घेण्याची परवानगी आहे. तुमच्या भावना वैध आहेत. 🌸",
        "प्रत्येक चक्र तुमच्या शरीराच्या शांत शक्तीची आठवण करून देते. ✨",
        "विश्रांती ही कमकुवतपणा नहीं — ती शहाणपण आहे. आज स्वतःची काळजी घ्या. 🌙",
        "तुम्ही तुम्हाला माहीत असेल त्यापेक्षा अधिक लवचिक आहात. एका वेळी एक दिवस पुढे जा. 🌷",
        "सर्वकाही खोलवर अनुभवणे ठीक आहे. तीच तुमची महासत्ता आहे. 💫",
        "तुमचे शरीर धैर्याला पात्र आहे, परिपूर्णतेला नाही. 🤍",
        "तुम्ही येथे आहात. तुमची कथा महत्त्वाची आहे. 🌺",
        "छोटी पावले देखील तुम्हाला पुढे नेतात. तुम्ही उत्तम करत आहात. 🦋",
        "आज, सौम्यता निवडा — विशेषतः स्वतःशी. 🌿",
        "कठीण दिवसांतही तुम्ही वाढत आहात. प्रक्रियेवर विश्वास ठेवा. 🌱",
        "थोडे वेगळे वाटत आहे? काही हरकत नाही. उद्या एक नवीन सुरुवात आहे. 🌅",
        "तुम्हाला सर्व वेळ ठीक असण्याची गरज नाही. म्हणूनच ही जागा आहे. 💜",
        "तुमची किंमत तुमच्या उत्पादकतेशी जोडलेली नाही. मुक्तपणे विश्रांती घ्या. ☁️",
        "तुमची प्रत्येक आवृत्ती — थकलेली, आनंदी, अनिश्चित — प्रेमासाठी योग्य आहे. 💖",
        "तुम्ही आतापर्यंत प्रत्येक कठीण दिवस पार केला आहे. ते 100% आहे. 🌟",
        "तुमच्या भावना जास्त नाहीत. त्या पूर्णपणे तुमच्या आहेत. 🎀",
        "तुम्ही इतरांसाठी जे मित्र आहात ते स्वतःसाठी व्हा. 🤗",
        "बरे होणे रेषीय नाही, आणि ते पूर्णपणे ठीक आहे. 🌊",
        "तुम्हाला पाहिले जाते, तुम्हाला ऐकले जाते, तुम्ही येथे एकटे नाही. 💞",
        "आज अभिमान बाळगण्याचा चांगला दिवस आहे की तुम्ही किती दूर आलात. 🏵️",
        "तुमची संवेदनशीलता एक भेट आहे, दोष नाही. 🌸",
        "श्वास घ्या. तुम्ही हे करू शकता. एका वेळी एक क्षण. 🍃",
        "दयाळूपणा आतून सुरू होतो. आज तुम्ही स्वतःसाठी कसे उपस्थित राहाल? 🌼",
        "तुम्ही पुरेसे आहात — तुम्ही जसे आहात तसे, आत्ता. ✨",
        "पेटके, मूड स्विंग, सूज — तुम्ही खूप काही हाताळता. तुम्ही आश्चर्यकारक आहात. 💪",
        "तुमचे चक्र तुम्हाला परिभाषित करत नाही, परंतु ते समजून घेणे तुम्हाला सक्षम करते. 🔮",
        "तुम्ही दिसता तो प्रत्येक दिवस साजरा करण्यासारखा विजय आहे. 🎉",
        "मदत मागणे ठीक आहे. शक्तीमध्ये पोहोचणे समाविष्ट आहे. 🤝",
        "तुम्ही फुलत आहात, जरी तसे वाटत नसले तरी. 🌻",
    ]
};

const getDailyAffirmation = (lang = 'en') => {
    const today = new Date();
    const dayIndex = Math.floor(today.getTime() / 86400000); // changes every 24h
    const affirmationsForLang = AFFIRMATIONS[lang] || AFFIRMATIONS.en;
    return affirmationsForLang[dayIndex % affirmationsForLang.length];
};

const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const normalizedIso = isoString.endsWith('Z') ? isoString : `${isoString}Z`;
    const now = new Date();
    const date = new Date(normalizedIso);
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

const PostCard = ({ post, onLike, onReply, onFlag, currentLang }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSendingReply, setIsSendingReply] = useState(false);

    const handleReplySubmit = async () => {
        const trimmed = replyText.trim();
        if (!trimmed) return;
        setIsSendingReply(true);
        await onReply(post.id, trimmed);
        setReplyText('');
        setShowReplyBox(false);
        setIsSendingReply(false);
    };

    // Detect post language
    const detectedLang = detectLanguage(post.content);
    const showLangIndicator = detectedLang !== 'unknown' && detectedLang !== currentLang;

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
                            {showLangIndicator && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-blue-600" style={{ background: 'rgba(59,130,246,0.1)' }}>
                                    {getLanguageName(detectedLang)}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">{formatTimestamp(post.createdAt)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {(post.isUserPost || post.isAdmin) ? (
                        <button
                            onClick={() => onFlag(post.id, true)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                            title="Delete post"
                        >
                            <Trash2 size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => onFlag(post.id, false)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                            title="Flag post"
                        >
                            <MoreHorizontal size={18} />
                        </button>
                    )}
                </div>
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

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => onLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 ${
                            post.liked ? 'text-[#FF6B9A]' : 'text-gray-400 hover:text-[#FF6B9A]'
                        }`}
                        style={{ background: post.liked ? '#FFF0F4' : '#F9F9F9' }}
                    >
                        <Heart size={13} fill={post.liked ? 'currentColor' : 'none'} strokeWidth={post.liked ? 0 : 1.5} />
                        {post.likesCount}
                    </button>
                </div>
                <button
                    onClick={() => setShowReplyBox(v => !v)}
                    className="flex items-center gap-1.5 text-gray-400 text-xs font-bold hover:text-[#FF6B9A] transition-colors"
                >
                    <MessageCircle size={14} /> {post.replyCount} Replies
                </button>
            </div>

            {/* Reply panel */}
            {showReplyBox && (
                <div className="mt-4">
                    {/* Existing replies */}
                    {post.replies && post.replies.length > 0 && (
                        <div className="space-y-3 mb-4">
                            {post.replies.map(reply => (
                                <div key={reply.id} className="flex gap-3 items-start">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                                        style={{ background: '#A78BFA' }}
                                    >
                                        {reply.is_anonymous ? 'A' : (reply.author?.name?.charAt(0).toUpperCase() || 'U')}
                                    </div>
                                    <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-[#1D1D2C]">
                                                {reply.is_anonymous ? 'Anonymous' : (reply.author?.name || 'User')}
                                            </span>
                                            <span className="text-[10px] text-gray-400 ml-2">{formatTimestamp(reply.created_at)}</span>
                                            {(reply.author?.user_id === post.currentUserId || post.isAdmin) && (
                                                <button
                                                    onClick={() => onFlag(post.id, true, reply.id)}
                                                    className="ml-auto text-gray-300 hover:text-red-500 transition-colors"
                                                    title="Delete reply"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-[#4A4A5C] leading-relaxed">{reply.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reply input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleReplySubmit()}
                            placeholder="Write a reply..."
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-xs outline-none focus:border-[#FF6B9A] transition-colors"
                            style={{ fontFamily: 'inherit' }}
                            disabled={isSendingReply}
                        />
                        <button
                            onClick={handleReplySubmit}
                            disabled={!replyText.trim() || isSendingReply}
                            className="px-3 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            style={{ background: 'linear-gradient(135deg, #FF9DBB, #FF6B9A)' }}
                        >
                            <Send size={13} />
                        </button>
                    </div>
                </div>
            )}
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
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'en';
    const currentUserId = user?._id || user?.id || null;
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedMood, setSelectedMood] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => setToast({ message, type });

    const filters = ['All', 'Trending', 'New', 'My Posts'];
    const moodEmojis = ['😔', '😐', '🙂', '😊', '🌟'];

    const mapPost = (p, overrides = {}) => ({
        id: p.id,
        initials: p.author?.name ? p.author.name.charAt(0).toUpperCase() : 'A',
        color: getAvatarColor(String(p.id || p.author?.name || 'anon')),
        username: p.author?.name || 'Anonymous',
        createdAt: p.created_at,
        content: p.content,
        tags: p.category && p.category !== "General" ? [p.category] : [],
        likesCount: p.likes_count || 0,
        liked: currentUserId ? (p.likes || []).includes(currentUserId) : false,
        replies: p.replies || [],
        replyCount: p.replies ? p.replies.length : 0,
        isUserPost: currentUserId && (p.user_id === currentUserId || p.author?.id === currentUserId || p.author?.user_id === currentUserId),
        isAdmin: user?.is_admin || false,
        currentUserId: currentUserId,
        ...overrides,
    });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get('/community/');
                setPosts(response.data.map(p => mapPost(p)));
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [currentLang]); // Re-fetch when language changes

    const handleLike = async (postId) => {
        try {
            const res = await axiosInstance.patch(`/community/${postId}/like`);
            const updated = res.data;
            setPosts(prev => prev.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        likesCount: updated.likes_count,
                        liked: currentUserId ? (updated.likes || []).includes(currentUserId) : false,
                      }
                    : p
            ));
        } catch (err) {
            if (err.response?.status === 401) {
                showToast('Please sign in to like posts', 'error');
            } else {
                console.error('Like failed:', err);
            }
        }
    };

    const handleReply = async (postId, content) => {
        try {
            const res = await axiosInstance.post(`/community/${postId}/reply`, {
                content,
                is_anonymous: true,
            });
            const updated = res.data;
            setPosts(prev => prev.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        replies: updated.replies || p.replies,
                        replyCount: updated.replies ? updated.replies.length : p.replyCount,
                      }
                    : p
            ));
        } catch (err) {
            console.error('Reply failed:', err);
        }
    };

    const handleFlag = async (postId, isDelete = false, replyId = null) => {
        try {
            if (isDelete) {
                const confirmDelete = window.confirm("Are you sure you want to delete this?");
                if (!confirmDelete) return;
                
                if (replyId) {
                    await axiosInstance.delete(`/community/${postId}/reply/${replyId}`);
                    setPosts(prev => prev.map(p => {
                        if (p.id !== postId) return p;
                        const newReplies = p.replies.filter(r => r.id !== replyId);
                        return { ...p, replies: newReplies, replyCount: newReplies.length };
                    }));
                    showToast('Reply deleted successfully', 'success');
                } else {
                    await axiosInstance.delete(`/community/${postId}`);
                    setPosts(prev => prev.filter(p => p.id !== postId));
                    showToast('Post deleted successfully', 'success');
                }
            } else {
                await axiosInstance.patch(`/community/${postId}/flag`);
                showToast('Post flagged for review. Thank you! 🧡', 'success');
            }
        } catch (err) {
            if (err.response?.status === 409 && !isDelete) {
                showToast('You already flagged this post.', 'info');
                return;
            }
            console.error('Action failed:', err);
            showToast('Failed to perform action', 'error');
        }
    };

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

    const handleNewPost = async (content, tags) => {
        try {
            const payload = {
                title: content.substring(0, 40) + (content.length > 40 ? "..." : ""),
                content: content,
                category: tags.length > 0 ? tags[0] : "General",
                is_anonymous: true
            };
            const response = await axiosInstance.post('/community/', payload);
            setPosts(prev => [mapPost(response.data, { isUserPost: true }), ...prev]);
        } catch (error) {
            console.error('Failed to submit post:', error);
        }
    };

    // Filter logic — My Posts fetches from API using user_id
    const [myPosts, setMyPosts] = useState([]);
    const [myPostsLoading, setMyPostsLoading] = useState(false);

    const handleFilterChange = async (f) => {
        setActiveFilter(f);
        if (f === 'My Posts' && currentUserId) {
            setMyPostsLoading(true);
            try {
                const res = await axiosInstance.get(`/community/?user_id=${currentUserId}`);
                setMyPosts(res.data.map(p => mapPost(p, { isUserPost: true })));
            } catch (err) {
                console.error('Failed to fetch my posts:', err);
            } finally {
                setMyPostsLoading(false);
            }
        }
    };

    const displayedPosts = (() => {
        if (activeFilter === 'My Posts') return myPosts;
        if (activeFilter === 'New') return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (activeFilter === 'Trending') return [...posts].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        return posts;
    })();

    // Real stats
    const totalStories = posts.length;
    const totalMembers = [...new Set(posts.map(p => p.username))].length;
    const totalReactions = posts.reduce((sum, p) => sum + (p.likesCount || 0), 0);

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
                                        onClick={() => handleFilterChange(f)}
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
                            {isLoading || myPostsLoading ? (
                                <div className="text-center py-20 text-gray-400">Loading...</div>
                            ) : displayedPosts.length === 0 ? (
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
                                        <PostCard
                                            post={post}
                                            onLike={handleLike}
                                            onReply={handleReply}
                                            onFlag={handleFlag}
                                            currentLang={currentLang}
                                        />
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
                                "{getDailyAffirmation(currentLang)}"
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

                {/* Toast */}
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </div>
        </>
    );
};

export default CommunityHub;
