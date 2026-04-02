import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { getLocalizedText } from "../utils/translation";

const ArticleDetail = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (id) {
            const res = await axiosInstance.get(`/education/blogs/${id}`);
            setArticle(res.data);
        } else if (slug) {
            const res = await axiosInstance.get(`/education/articles/${slug}`);
            setArticle(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, id]);

  // Helper function to check if content is a URL
  const isURL = (str) => {
    if (!str) return false;
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    const trimmedStr = str.trim();
    return urlPattern.test(trimmedStr) || trimmedStr.startsWith('http://') || trimmedStr.startsWith('https://');
  };

  const getArticleContent = () => {
    const content = getLocalizedText(article.content, lang);
    return content;
  };

  const isContentURL = () => {
    const content = getArticleContent();
    return isURL(content);
  };

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="font-display min-h-screen bg-white">
      <Navbar />
      <main className="max-w-[800px] mx-auto w-full px-6 py-12" style={{ marginTop: '80px' }}>
        <button onClick={() => navigate("/education")} className="mb-6 text-pink-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:text-pink-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Articles
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-pink-500 bg-pink-50 px-3 py-1 rounded-full mb-4 inline-block">
          {article.category || "General"}
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
          {getLocalizedText(article.title, lang)}
        </h1>
        
        {/* Author / Date Info */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
           <div>
             <p className="font-bold text-slate-800">{article.author_name || "Petal Team"}</p>
             <p className="text-sm text-slate-500">{new Date(article.created_at).toLocaleDateString()}</p>
           </div>
        </div>

        {/* Content or Link Button */}
        {isContentURL() ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-slate-600 mb-6 font-medium">
              This article contains an external resource
            </p>
            <a
              href={getArticleContent().startsWith('http') ? getArticleContent() : `https://${getArticleContent()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-full hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-lg">Visit Resource</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
            <p className="text-sm text-slate-400 mt-4 font-medium">
              {getArticleContent()}
            </p>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none prose-p:font-medium prose-p:text-slate-600 prose-headings:font-black prose-headings:text-slate-900 whitespace-pre-wrap">
             {getArticleContent()}
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
           <div className="mt-12 pt-8 border-t border-slate-100 flex gap-2 flex-wrap">
              {article.tags.map(tag => (
                 <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-sm font-bold uppercase tracking-widest">
                    #{tag}
                 </span>
              ))}
           </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
