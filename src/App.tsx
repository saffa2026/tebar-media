import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Sparkles, Search, SlidersHorizontal, BookOpen, 
  MessageSquare, Layers, Newspaper, Heart, Send, Globe, ChevronRight,
  LogIn, LogOut, Lock, User, Check, AlertCircle, Eye, EyeOff, LayoutDashboard, X
} from 'lucide-react';

import { Article, NewsCategory } from './types';
import { INITIAL_ARTICLES } from './mockData';
import { TebarLogo, TebarMark } from './components/TebarLogo';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import NewArticleModal from './components/NewArticleModal';

export default function App() {
  // Load initially from LocalStorage, otherwise fall back to rich default mock news articles
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('tebarmedia_articles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Local storage articles parse error:", e);
      }
    }
    return INITIAL_ARTICLES;
  });

  const [apiConfigured, setApiConfigured] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua Berita');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // User session state (persistent redaktur session on Tebarmedia)
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; email: string } | null>(() => {
    const saved = localStorage.getItem('tebarmedia_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Login Modal Form states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginLockMessage, setLoginLockMessage] = useState('');

  // Sync articles list to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tebarmedia_articles', JSON.stringify(articles));
  }, [articles]);

  // Check backend health and Gemini API setup status on load
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          const data = await response.json();
          setApiConfigured(data.apiConfigured);
        }
      } catch (err) {
        console.warn("Backend server not yet ready or running client-only. Using mode fallback.");
        setApiConfigured(false);
      }
    };
    checkApiStatus();
  }, []);

  // Filter lists based on category and searches
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === 'Semua Berita' || article.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate top featured article (must have highest view rate, or use first in list)
  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const standardArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : filteredArticles;

  // Find currently opened article details if any
  const selectedArticle = articles.find(a => a.id === selectedArticleId) || null;

  // Callbacks
  const handleLike = (articleId: string) => {
    setArticles((prev) => 
      prev.map((art) => {
        if (art.id === articleId) {
          return { ...art, likes: art.likes + 1 };
        }
        return art;
      })
    );
  };

  const handleAddComment = (articleId: string, commentUser: string, commentText: string) => {
    const letterInits = commentUser
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newComment = {
      id: `c-${Date.now()}`,
      user: commentUser,
      avatar: letterInits || 'P',
      content: commentText,
      timestamp: 'Baru Saja'
    };

    setArticles((prev) => 
      prev.map((art) => {
        if (art.id === articleId) {
          return { ...art, comments: [newComment, ...art.comments] };
        }
        return art;
      })
    );
  };

  const handleArticleCreated = (newArticle: Article) => {
    // Prepend to top of lists
    setArticles((prev) => [newArticle, ...prev]);
    // Automatically focus on and open the newly created AI news!
    setSelectedArticleId(newArticle.id);
  };

  const handleOpenWriter = () => {
    if (!currentUser) {
      setLoginLockMessage('Harap masuk ruang redaksi terlebih dahulu untuk mengakses fitur kepenulisan jurnalisme AI!');
      setIsLoginModalOpen(true);
    } else {
      setIsGeneratorOpen(true);
    }
  };

  const categories = [
    'Semua Berita',
    'Nasional',
    'Ekonomi',
    'Teknologi',
    'Sains',
    'Gaya Hidup',
    'Olahraga',
    'Opini'
  ];

  return (
    <div id="tebarmedia-applet" className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans">
      
      {/* Upper Top Minimal Broadcast Bar */}
      <div className="bg-[#2B2455] text-white py-2 px-4 text-center text-[10px] sm:text-xs font-medium tracking-wide flex items-center justify-center gap-2 select-none border-b border-[#7E007E]/35" id="ticker-bar">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        <span>PEMBERITAAN UTAMA: WAWASAN LUAS, ADIL, DAN INFORMASI MERATA</span>
      </div>

      {/* Main Header / Navigation rail */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3.5 shadow-xs" id="app-navbar">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo on Left */}
          <div className="cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => setSelectedArticleId(null)} id="brand-logo-trigger">
            <TebarLogo size="lg" showTagline={true} />
          </div>

          {/* Search bar inside header */}
          {!selectedArticleId && (
            <div className="relative w-full max-w-sm" id="nav-search-container">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari berita hangat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7E007E]/15 focus:border-[#7E007E] text-gray-800"
                id="search-input-field"
              />
            </div>
          )}

          {/* Configuration and Write CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3.5" id="nav-actions">
            
            {/* Status indicators */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full select-none text-[10px] font-bold text-slate-500" id="ai-status-badge">
              <span className={`w-1.5 h-1.5 rounded-full ${apiConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              <span>
                {apiConfigured ? 'REDAKSI AI AKTIF' : 'ASISTEN AI AKTIF'}
              </span>
            </div>

            {/* User Session Controller */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-purple-50/70 border border-purple-100 px-3.5 py-1.5 rounded-full" id="user-badge-profile">
                <div className="w-5 h-5 rounded-full bg-[#7E007E] text-white flex items-center justify-center text-[10px] uppercase font-bold">
                  {currentUser.name[0]}
                </div>
                <div className="hidden sm:block text-left select-none leading-none">
                  <p className="text-[10px] font-bold text-[#2B2455]">{currentUser.name}</p>
                  <p className="text-[8px] text-gray-500 font-mono font-bold uppercase">{currentUser.role}</p>
                </div>
                
                <button
                  onClick={() => {
                    localStorage.removeItem('tebarmedia_user');
                    setCurrentUser(null);
                  }}
                  title="Keluar dari Portal Redaksi"
                  id="btn-log-out-action"
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer rounded-full hover:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setLoginLockMessage('');
                  setIsLoginModalOpen(true);
                }}
                id="btn-trigger-login-flow"
                className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Masuk Redaksi</span>
              </button>
            )}

            {/* Write news CTA (Requires login validation) */}
            <button 
              onClick={handleOpenWriter}
              id="btn-trigger-ai-creator"
              className="flex items-center gap-1.5 px-4.5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#7E007E] to-[#2B2455] text-white hover:opacity-95 text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              Tulis Berita AI
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {selectedArticle ? (
            // DETAILED READING VIEW
            <ArticleDetail 
              key="details"
              article={selectedArticle}
              onBack={() => {
                setSelectedArticleId(null);
                // Scroll windows to top
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onLike={handleLike}
              onAddComment={handleAddComment}
              apiConfigured={apiConfigured}
            />
          ) : (
            // PORTAL HOMEPAGE COVER LISTS
            <motion.div
              key="homepage"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 py-8 space-y-8"
              id="homepage-view"
            >
              {/* Category Horizontal Selectors Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none border-b border-gray-100" id="category-scroller">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      id={`btn-cat-filter-${cat.replace(/\s+/g, '-')}`}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap border ${
                        isActive 
                          ? 'bg-[#2B2455] text-white border-[#2B2455] shadow-xs' 
                          : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Filtering summary headline */}
              {(searchQuery || activeCategory !== 'Semua Berita') && (
                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-xs animate-fade-in" id="filtering-indicator">
                  <div className="text-xs font-semibold text-gray-500">
                    Kategori & keyword aktif: <span className="text-[#7E007E] font-bold">{activeCategory}</span>
                    {searchQuery && <span> • kata kunci <span className="text-gray-800 font-bold">"{searchQuery}"</span></span>}
                    <span className="ml-2 py-0.5 px-2 bg-slate-50 text-slate-500 rounded-full font-mono text-[10px] font-bold">({filteredArticles.length} Berita)</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('Semua Berita');
                    }}
                    id="btn-reset-filters"
                    className="text-xs font-bold text-[#7E007E] hover:underline cursor-pointer"
                  >
                    Atur Ulang
                  </button>
                </div>
              )}

              {filteredArticles.length === 0 ? (
                // Empty State Searching
                <div className="py-16 text-center border border-gray-100 bg-white rounded-2xl p-8 max-w-xl mx-auto shadow-sm" id="empty-results">
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-gray-400 mb-4 border border-gray-100">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans font-bold text-gray-900">Naskah Berita Tidak Ditemukan</h3>
                    <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">Topik berita berkaitan belum diterbitkan. Jangan berkecil hati! Anda bisa langsung memerintahkan Robot Redaksi Tebarmedia untuk menyusun beritanya sekarang.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setTopicToSuggestAndOpenModal(searchQuery);
                    }}
                    id="btn-create-missing-news"
                    className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7E007E] to-[#2B2455] text-white font-bold text-xs shadow-sm hover:opacity-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Buat Berita tentang "{searchQuery || 'Sesuatu'}"
                  </button>
                </div>
              ) : (
                // ARTICLES RENDER GRAPHIC
                <div className="space-y-10" id="homepage-grid-container">
                  
                  {/* Hero Featured Row (only if search is empty and active category is Semua Berita) */}
                  {!searchQuery && activeCategory === 'Semua Berita' && featuredArticle && (
                    <motion.div 
                      layoutId={`card-container-${featuredArticle.id}`}
                      id={`hero-article-${featuredArticle.id}`}
                      onClick={() => setSelectedArticleId(featuredArticle.id)}
                      className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 grid grid-cols-1 lg:grid-cols-12 gap-0 cursor-pointer group"
                    >
                      {/* Left: Big high fidelity cover image */}
                      <div className="lg:col-span-7 aspect-video lg:aspect-auto h-64 lg:h-[380px] relative overflow-hidden bg-slate-50" id="hero-img-box">
                        <img 
                          src={featuredArticle.imageUrl} 
                          alt={featuredArticle.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                          onError={(e) => {
                            e.currentTarget.src = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200`;
                          }}
                        />
                        <div className="absolute top-4 left-4 flex gap-2" id="hero-badges-row">
                          <span className="px-3 py-1 bg-[#2B2455] text-white rounded-full font-bold text-[10px] uppercase tracking-wider shadow-xs">
                            Fokus Utama
                          </span>
                          <span className="px-3 py-1 bg-[#7E007E] text-white rounded-full font-bold text-[10px] uppercase tracking-wider shadow-xs">
                            {featuredArticle.category}
                          </span>
                        </div>
                      </div>

                      {/* Right: Rich editorial intro content */}
                      <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FDFDFD]" id="hero-body">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400">
                            <span>{featuredArticle.publishedAt}</span>
                            <span>•</span>
                            <span className="text-gray-600 font-bold">Oleh {featuredArticle.author}</span>
                          </div>

                          <h2 className="font-sans font-extrabold text-gray-950 text-xl sm:text-2xl leading-snug tracking-tight mb-2 group-hover:text-[#7E007E] transition-colors" id="hero-title">
                            {featuredArticle.title}
                          </h2>

                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-3" id="hero-summary">
                            {featuredArticle.summary}
                          </p>
                        </div>

                        {/* Hero details read time & comments stats */}
                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100/70" id="hero-footer">
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                            {featuredArticle.readTime}
                          </span>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                            <span className="flex items-center gap-1 text-rose-500">
                              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                              {featuredArticle.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {featuredArticle.comments.length} Komentar
                            </span>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* Bento Grid layout for standard articles */}
                  <div className="space-y-4" id="standard-grid-box">
                    <h4 className="font-sans font-bold text-gray-400 text-xs tracking-wider uppercase flex items-center gap-2 border-b border-gray-100 pb-2 mb-4">
                      <Newspaper className="w-4 h-4 text-gray-400" />
                      {(!searchQuery && activeCategory === 'Semua Berita') ? 'Sirkulasi Berita Terbaru' : 'Hasil Telusur Berita'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="articles-bento-grid">
                      {((!searchQuery && activeCategory === 'Semua Berita') ? standardArticles : filteredArticles).map((article) => (
                        <ArticleCard 
                          key={article.id}
                          article={article}
                          onClick={() => {
                            setSelectedArticleId(article.id);
                            // Scroll window to top
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Beautiful Footer */}
      <footer className="bg-[#2B2455] text-white border-t border-gray-100/10 py-10 mt-12 select-none" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div 
            onClick={() => setSelectedArticleId(null)} 
            className="cursor-pointer transition-transform hover:scale-[1.01] flex flex-col items-center md:items-start text-center md:text-left"
            id="footer-logo-trigger"
          >
            <TebarLogo size="md" showTagline={true} variant="light" />
          </div>

          <p className="text-[10px] text-gray-300 text-center md:text-right leading-relaxed max-w-sm">
            &copy; 2026 Tebarmedia Digital.<br />
            Menjamin keselarasan, literasi, dan inklusi digital untuk seluruh daerah tanah air.
          </p>
        </div>
      </footer>

      {/* WRITER GENERATOR MODAL */}
      <NewArticleModal 
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onArticleCreated={handleArticleCreated}
        apiConfigured={apiConfigured}
      />

      {/* REVOLUTIONARY REDAKSI LOGIN MODAL WITH HIGH FIDELITY DESIGN */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in" id="editorial-login-modal">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm border border-gray-150 shadow-2xl overflow-hidden flex flex-col relative"
              id="login-modal-card"
            >
              <div className="p-5 bg-gradient-to-r from-[#2B2455] to-[#40367c] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8.5 h-8.5 bg-white/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-4.5 h-4.5 text-purple-200" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-sm tracking-tight">OTENTIKASI KOORDINATOR</h3>
                    <p className="text-[9px] text-purple-200 tracking-wider uppercase font-mono font-bold">Gerbang Sistem Redaksi Tebarmedia</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4" id="login-form-submit">
                {loginLockMessage && (
                  <div className="p-3 bg-[#7E007E]/5 text-slate-800 rounded-xl border border-[#7E007E]/20 text-[11px] leading-relaxed font-sans">
                    <span className="font-extrabold text-[#7E007E] block mb-0.5">Akses Khusus Terdaftar:</span>
                    {loginLockMessage}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-900 block">Surel Redaktur / Username:</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      placeholder="Contoh: redaktur"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7E007E]/20 focus:border-[#7E007E] text-gray-800 font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-900 block">Kata Sandi Redaksi:</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 text-[10px] uppercase font-bold tracking-wider"
                    >
                      {showPassword ? "Sembunyikan" : "Tampilkan"}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Masukkan sandi..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7E007E]/20 focus:border-[#7E007E] text-gray-800 font-semibold"
                      required
                    />
                  </div>
                </div>

                {/* Indonesian Credential Tips panel */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1" id="login-helper-tips">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Kunci Demo Redaktur:</span>
                  <div className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    Nama akun: <strong className="font-mono text-slate-700 bg-white border border-slate-150 px-1 py-0.2 rounded">redaktur</strong> atau <strong className="font-mono text-slate-700 bg-white border border-slate-150 px-1 py-0.2 rounded">jurnalis</strong><br />
                    Sandi rahasia: <strong className="font-mono text-slate-700 bg-white border border-slate-150 px-1 py-0.2 rounded">tebar</strong>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs font-mono flex items-center gap-1.5" id="error-login-box">
                    <AlertCircle className="w-4 h-4" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 rounded-xl bg-[#2B2455] hover:bg-[#1e193c] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Mengotentikasi Sesi...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-purple-200" />
                      <span>Verifikasi Kunci Redaksi & Masuk</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );

  // Auth Submit Action Logic
  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    
    setTimeout(() => {
      const { username, password } = loginForm;
      const normalizedUser = username.trim().toLowerCase();
      if (
        (normalizedUser === 'redaktur' || normalizedUser === 'redaktur@tebarmedia.id' || normalizedUser === 'jurnalis') &&
        password === 'tebar'
      ) {
        const userData = {
          name: normalizedUser === 'jurnalis' ? 'Aris Setiawan' : 'Hafiz Rhiandy',
          role: normalizedUser === 'jurnalis' ? 'Koresponden Berita' : 'Senior Redaktur Utama',
          email: normalizedUser === 'jurnalis' ? 'aris@tebarmedia.id' : 'hafiz@tebarmedia.id'
        };
        localStorage.setItem('tebarmedia_user', JSON.stringify(userData));
        setCurrentUser(userData);
        setIsLoginModalOpen(false);
        setLoginForm({ username: '', password: '' });
        
        // Auto open generator upon login success if they came via a locks
        if (loginLockMessage) {
          setIsGeneratorOpen(true);
        }
      } else {
        setLoginError('Kombinasi akun redaktur / password salah.');
      }
      setIsLoggingIn(false);
    }, 700);
  }

  // Helper helper function to assign custom missing topics quickly
  function setTopicToSuggestAndOpenModal(query: string) {
    if (!currentUser) {
      setLoginLockMessage(`Harap masuk ruang redaksi terlebih dahulu untuk membuat berita AI tentang "${query}"!`);
      setIsLoginModalOpen(true);
    } else {
      setIsGeneratorOpen(true);
    }
  }
}
