/**
 * Translation Utility for Petal Platform
 * Handles multilingual content extraction and dynamic translation
 */

// Translation cache to avoid repeated API calls
const translationCache = new Map();

/**
 * Translate text using MyMemory free translation API
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language code
 * @param {string} targetLang - Target language code
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, sourceLang = 'en', targetLang = 'hi') => {
    // Don't translate if same language or empty text
    if (!text || sourceLang === targetLang) return text;
    
    // Check cache first
    const cacheKey = `${text.substring(0, 50)}_${sourceLang}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }
    
    // Map language codes to MyMemory format
    const langMap = {
        'en': 'en',
        'hi': 'hi',
        'mr': 'mr'
    };
    
    const from = langMap[sourceLang] || 'en';
    const to = langMap[targetLang] || 'hi';
    
    try {
        // Use MyMemory Translation API (free, no API key required)
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
        );
        
        if (!response.ok) {
            throw new Error('Translation API error');
        }
        
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
            const translatedText = data.responseData.translatedText;
            // Cache the result
            translationCache.set(cacheKey, translatedText);
            return translatedText;
        }
        
        return text; // Return original if translation failed
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original on error
    }
};

/**
 * Translate multiple texts in batch
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} sourceLang - Source language
 * @param {string} targetLang - Target language
 * @returns {Promise<Array<string>>} - Array of translated texts
 */
export const translateBatch = async (texts, sourceLang, targetLang) => {
    if (sourceLang === targetLang) return texts;
    
    // Translate in parallel with a small delay to avoid rate limiting
    const results = await Promise.all(
        texts.map((text, index) => 
            new Promise(resolve => 
                setTimeout(() => 
                    translateText(text, sourceLang, targetLang).then(resolve), 
                    index * 100 // 100ms delay between requests
                )
            )
        )
    );
    
    return results;
};

/**
 * Translate an article object
 * @param {Object} article - Article with title and content
 * @param {string} targetLang - Target language
 * @returns {Promise<Object>} - Article with translated fields
 */
export const translateArticle = async (article, targetLang) => {
    if (!article) return article;
    
    // Detect source language
    const sourceLang = detectLanguage(article.title || article.content) || 'en';
    
    if (sourceLang === targetLang) {
        return { ...article, _translated: false };
    }
    
    try {
        const [translatedTitle, translatedContent] = await Promise.all([
            article.title ? translateText(article.title, sourceLang, targetLang) : article.title,
            article.content ? translateText(article.content, sourceLang, targetLang) : article.content
        ]);
        
        return {
            ...article,
            title: translatedTitle,
            content: translatedContent,
            _originalTitle: article.title,
            _originalContent: article.content,
            _sourceLang: sourceLang,
            _translated: true
        };
    } catch (error) {
        console.error('Article translation error:', error);
        return { ...article, _translated: false };
    }
};

/**
 * Clear translation cache
 */
export const clearTranslationCache = () => {
    translationCache.clear();
};

/**
 * Extract localized text from multilingual objects
 * @param {string|Object} content - Either a string or object with language keys {en: "text", hi: "text", mr: "text"}
 * @param {string} lang - Target language code (e.g., 'en', 'hi', 'mr')
 * @param {string} fallback - Fallback text if no translation found
 * @returns {string} - Localized text
 */
export const getLocalizedText = (content, lang = 'en', fallback = '') => {
    // If content is null or undefined
    if (!content) return fallback;
    
    // If content is already a string, return it
    if (typeof content === 'string') return content;
    
    // If content is an object with language keys
    if (typeof content === 'object' && !Array.isArray(content)) {
        // Try to get text in requested language
        if (content[lang]) return content[lang];
        
        // Fallback to English
        if (content.en) return content.en;
        
        // Try any available language
        const availableLangs = Object.keys(content);
        if (availableLangs.length > 0) {
            return content[availableLangs[0]];
        }
    }
    
    // If all else fails, return fallback
    return fallback;
};

/**
 * Detect language of a text string
 * Simple heuristic-based detection for English, Hindi, and Marathi
 * @param {string} text - Text to analyze
 * @returns {string} - Detected language code ('en', 'hi', 'mr', or 'unknown')
 */
export const detectLanguage = (text) => {
    if (!text || typeof text !== 'string') return 'unknown';
    
    // Count character ranges
    const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
    const devanagariChars = (text.match(/[\u0900-\u097F]/g) || []).length;
    
    const totalChars = text.replace(/\s/g, '').length;
    if (totalChars === 0) return 'unknown';
    
    const latinRatio = latinChars / totalChars;
    const devanagariRatio = devanagariChars / totalChars;
    
    // If more than 50% Devanagari script
    if (devanagariRatio > 0.5) {
        // Try to distinguish Hindi vs Marathi (basic heuristic)
        // Marathi has some unique characters, but for simplicity we'll detect as 'hi' by default
        return 'hi'; // Could be extended to detect 'mr' with more sophisticated logic
    }
    
    // If more than 50% Latin script
    if (latinRatio > 0.5) return 'en';
    
    return 'unknown';
};

/**
 * Get language name from code
 * @param {string} langCode - Language code ('en', 'hi', 'mr')
 * @returns {string} - Human-readable language name
 */
export const getLanguageName = (langCode) => {
    const languageNames = {
        en: 'English',
        hi: 'हिंदी',
        mr: 'मराठी'
    };
    return languageNames[langCode] || langCode;
};

/**
 * Check if content supports multiple languages
 * @param {any} content - Content to check
 * @returns {boolean} - True if content is a multilingual object
 */
export const isMultilingual = (content) => {
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
        return false;
    }
    
    // Check if it has language keys
    const keys = Object.keys(content);
    return keys.some(key => ['en', 'hi', 'mr'].includes(key));
};

/**
 * Get available languages for multilingual content
 * @param {Object} content - Multilingual content object
 * @returns {Array<string>} - Array of available language codes
 */
export const getAvailableLanguages = (content) => {
    if (!isMultilingual(content)) return [];
    
    const supportedLangs = ['en', 'hi', 'mr'];
    return Object.keys(content).filter(key => supportedLangs.includes(key));
};

/**
 * Format multilingual content for display
 * Shows original language with indicator if translation not available
 * @param {string|Object} content - Content to format
 * @param {string} targetLang - Target language
 * @returns {Object} - {text: string, originalLang: string|null, isTranslated: boolean}
 */
export const formatContentWithLanguageInfo = (content, targetLang = 'en') => {
    const text = getLocalizedText(content, targetLang);
    
    if (!isMultilingual(content)) {
        // Detect language of plain string
        const detectedLang = detectLanguage(text);
        return {
            text,
            originalLang: detectedLang !== 'unknown' ? detectedLang : null,
            isTranslated: false
        };
    }
    
    const availableLangs = getAvailableLanguages(content);
    const hasTargetLang = availableLangs.includes(targetLang);
    
    return {
        text,
        originalLang: hasTargetLang ? null : availableLangs[0] || null,
        isTranslated: hasTargetLang
    };
};

/**
 * Create a placeholder for missing translations
 * @param {string} targetLang - Target language
 * @returns {string} - Placeholder message
 */
export const getMissingTranslationPlaceholder = (targetLang) => {
    const placeholders = {
        en: '[Translation not available]',
        hi: '[अनुवाद उपलब्ध नहीं है]',
        mr: '[भाषांतर उपलब्ध नाही]'
    };
    return placeholders[targetLang] || placeholders.en;
};

/**
 * Translate an array of items with localized text extraction
 * @param {Array} items - Array of objects with multilingual fields
 * @param {string} lang - Target language
 * @param {Array<string>} fields - Fields to translate
 * @returns {Array} - Array with translated fields
 */
export const translateArray = (items, lang, fields = []) => {
    if (!Array.isArray(items)) return items;
    
    return items.map(item => {
        const translated = { ...item };
        fields.forEach(field => {
            if (item[field]) {
                translated[field] = getLocalizedText(item[field], lang);
            }
        });
        return translated;
    });
};

/**
 * Get fallback chain for languages
 * @param {string} preferredLang - Preferred language
 * @returns {Array<string>} - Array of language codes in order of preference
 */
export const getLanguageFallbackChain = (preferredLang = 'en') => {
    const fallbackChain = [preferredLang];
    
    // Always add English as fallback if not already primary
    if (preferredLang !== 'en') {
        fallbackChain.push('en');
    }
    
    // Add other supported languages
    ['hi', 'mr'].forEach(lang => {
        if (lang !== preferredLang && !fallbackChain.includes(lang)) {
            fallbackChain.push(lang);
        }
    });
    
    return fallbackChain;
};

export default {
    translateText,
    translateBatch,
    translateArticle,
    clearTranslationCache,
    getLocalizedText,
    detectLanguage,
    getLanguageName,
    isMultilingual,
    getAvailableLanguages,
    formatContentWithLanguageInfo,
    getMissingTranslationPlaceholder,
    translateArray,
    getLanguageFallbackChain
};
