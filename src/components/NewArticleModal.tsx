import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, AlertCircle, FileText, CheckCircle, ArrowRight,
  TrendingUp, Compass, Globe, Edit3, UploadCloud, RefreshCw, Layers
} from 'lucide-react';
import { Article, NewsCategory } from '../types';

interface NewArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleCreated: (newArticle: Article) => void;
  apiConfigured: boolean;
  initialTopic?: string;
}

const NEWSROOM_STEPS = [
  "Mengirim penugasan ke reporter AI lapangan...",
  "Mengumpulkan narasi fakta & wawancara narasumber...",
  "Menyusun draf jurnalisme khas Tebarmedia...",
  "Melakukan kurasi data & penyelarasan 'Informasi Merata'...",
  "Memverifikasi ejaan Dewan Redaktur Utama..."
];

const SUGGESTED_TOPICS = [
  "Inovasi baterai ampas kelapa karya anak SMK di Malang",
  "Festival kuliner rasa laut Nusantara terpanjang di Pantai Losari",
  "Penemuan reruntuhan candi era sebelum Majapahit di dasar sungai Blitar",
  "Startup digital Banda Naira kembangkan sistem ekominis pariwisata terumbu",
  "Peluncuran bus amfibi perkotaan pengurai banjir di Semarang"
];

interface ViralTrend {
  title: string;
  description: string;
  keywords: string;
  category: string;
}

export default function NewArticleModal({ 
  isOpen, 
  onClose, 
  onArticleCreated,
  apiConfigured,
  initialTopic = ''
}: NewArticleModalProps) {
  // Navigation tabs within writer modal
  const [activeTab, setActiveTab] = useState<'write' | 'viral'>('write');
  
  // Topic input state
  const [topic, setTopic] = useState('');

  // Sync initial topic when modal opens
  useEffect(() => {
    if (isOpen) {
      setTopic(initialTopic);
    }
  }, [isOpen, initialTopic]);
  
  // Viral trends states
  const [viralTrends, setViralTrends] = useState<ViralTrend[]>([]);
  const [isScanningViral, setIsScanningViral] = useState(false);
  const [viralScanError, setViralScanError] = useState('');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Draft review stage states (Where the user previews/edits before final upload)
  const [generatedDraft, setGeneratedDraft] = useState<{
    title: string;
    summary: string;
    content: string;
    category: NewsCategory;
    imageUrl: string;
  } | null>(null);

  // Cycle newsroom animation messages during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setStepIndex(0);
      interval = setInterval(() => {
        setStepIndex((prev) => {
          if (prev < NEWSROOM_STEPS.length - 1) {
            return prev + 1;
          }
          return prev; // hold on last step
        });
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Load trends if changing to viral tab and trends are empty
  const handleViralTabClick = async () => {
    setActiveTab('viral');
    if (viralTrends.length === 0) {
      await scanViralTrends();
    }
  };

  const scanViralTrends = async () => {
    if (isScanningViral) return;
    setIsScanningViral(true);
    setViralScanError('');
    try {
      const response = await fetch('/api/news/viral-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setViralTrends(data.trends || []);
      } else {
        setViralScanError(data.error || 'Gagal memindai tren berita viral.');
      }
    } catch (err: any) {
      setViralScanError('Kendala menghubungkan stasiun satelit tren.');
    } finally {
      setIsScanningViral(false);
    }
  };

  const handleGenerateFromTopic = async (selectedTopic: string) => {
    if (!selectedTopic.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMsg('');
    setGeneratedDraft(null);

    try {
      const response = await fetch('/api/news/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedTopic }),
      });

      const data = await response.json();
      if (response.ok) {
        const generated = data.article;
        
        // Match a beautiful Unsplash cover image based on category
        const imageThemes: Record<string, string> = {
          'Nasional': 'https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?auto=format&fit=crop&q=80&w=800',
          'Ekonomi': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800',
          'Teknologi': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800',
          'Sains': 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800',
          'Gaya Hidup': 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800',
          'Olahraga': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
          'Opini': 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800',
        };

        const categoryForImage = generated.category || 'Nasional';
        const imageUrl = imageThemes[categoryForImage] || `https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800`;

        // Advance to Draft Review screen instead of publishing immediately
        setGeneratedDraft({
          title: generated.title || `Laporan Khusus: Potensi ${selectedTopic}`,
          summary: generated.summary || `Analisis berimbang dan komprehensif mengenai perputaran informasi seputar ${selectedTopic}.`,
          content: generated.content || `Draf berita komprehensif sedang diramu...`,
          category: (generated.category as NewsCategory) || 'Nasional',
          imageUrl: imageUrl
        });
      } else {
        setErrorMsg(data.error || 'Gagal merancang draf berita AI.');
      }
    } catch (err: any) {
      setErrorMsg('Terdapat kendala koneksi ke stasiun server AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerateFromTopic(topic);
  };

  // Upload (Publish) the edited draft
  const handleUploadDraft = () => {
    if (!generatedDraft) return;

    const newArticle: Article = {
      id: `art-ai-${Date.now()}`,
      title: generatedDraft.title,
      summary: generatedDraft.summary,
      content: generatedDraft.content,
      category: generatedDraft.category,
      author: 'Pena Otomatis AI',
      publishedAt: 'Baru Saja',
      readTime: `${Math.max(2, Math.ceil(generatedDraft.content.length / 800))} menit`,
      imageUrl: generatedDraft.imageUrl,
      likes: Math.floor(Math.random() * 10) + 1,
      views: Math.floor(Math.random() * 50) + 50,
      comments: [],
      isAiGenerated: true
    };

    onArticleCreated(newArticle);
    
    // Reset states
    setTopic('');
    setGeneratedDraft(null);
    setActiveTab('write');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in" id="article-generator-modal-root">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          id="modal-card"
          className="bg-white rounded-2xl w-full max-w-2xl border border-gray-150 shadow-2xl overflow-hidden flex flex-col relative"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#2B2455] to-[#40367c] text-white flex items-center justify-between" id="modal-header">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shadow-inner text-purple-200">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base tracking-tight flex items-center gap-1.5">
                  DAPUR STASIUN REDAKSI AI
                </h3>
                <p className="text-[10px] text-purple-200 tracking-wider uppercase font-mono">Pena Otomatis berlandaskan Pakem Tebarmedia</p>
              </div>
            </div>
            
            {!isGenerating && (
              <button 
                id="btn-close-modal"
                onClick={() => {
                  setGeneratedDraft(null);
                  onClose();
                }}
                className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Conditional Layouts based on generating vs review draft vs setup forms */}
          {isGenerating ? (
            // GENERATING WORKFLOW LOADER
            <div className="p-8 py-16 flex flex-col items-center justify-center space-y-6" id="generating-pipeline">
              <div className="relative" id="pipeline-pulsar">
                <div className="w-20 h-20 bg-purple-100/40 rounded-full flex items-center justify-center animate-ping absolute inset-0" />
                <div className="relative w-16 h-16 bg-gradient-to-tr from-[#7E007E] to-[#2B2455] rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              <div className="text-center space-y-2 max-w-sm" id="pipeline-status-text">
                <h4 className="font-sans font-bold text-gray-900 text-base tracking-tight">Meramu Artikel Sesuai Pakem Tebar...</h4>
                
                {/* Dynamic Steps */}
                <div className="h-6 overflow-hidden relative text-xs font-bold text-[#7E007E]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={stepIndex}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-center italic"
                    >
                      {NEWSROOM_STEPS[stepIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="w-full max-w-xs bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-2xs" id="pipeline-progress-bar">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((stepIndex + 1) / NEWSROOM_STEPS.length) * 100}%` }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-[#7E007E] to-[#2B2455]" 
                />
              </div>
              
              <p className="text-[10px] text-gray-400 font-mono text-center">Menjaga kode etik, validasi sirkulasi informasi berimbang, & literasi daerah...</p>
            </div>

          ) : generatedDraft ? (
            // DRAFT REVIEW & MANUAL CORRECTION BEFORE UPLOAD stage
            <div className="flex-grow flex flex-col overflow-hidden max-h-[75vh]" id="draft-review-workspace">
              <div className="bg-purple-50/50 px-5 py-3 border-b border-purple-100 flex items-center justify-between" id="draft-review-header">
                <span className="text-xs text-purple-950 font-bold flex items-center gap-1.5 font-sans">
                  <Edit3 className="w-4 h-4 text-[#7E007E]" />
                  TAHAP PENYUNTINGAN & PRATINJAU DRAF RESMI
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-sans uppercase">
                  Draf AI Terbentuk
                </span>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 flex-grow" id="draft-review-fields">
                <p className="text-2xs text-gray-500 leading-relaxed">
                  Robot koresponden Anda telah menyusun laporan. Di bawah ini adalah draf jurnalisme bermutu tinggi. Harap periksa, edit jika ada penyesuaian ejaan, dan klik tombol <strong>Unggah Berita Resmi</strong> di bawah untuk memublikasikannya secara luas.
                </p>

                {/* Form Fields for user edit */}
                <div className="space-y-4">
                  {/* Category & Image Source Selector Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-900 block">Kategori Rubrikasi:</label>
                      <select
                        value={generatedDraft.category}
                        onChange={(e) => setGeneratedDraft({ ...generatedDraft, category: e.target.value as NewsCategory })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7E007E]/20 text-gray-800"
                      >
                        <option value="Nasional">Nasional</option>
                        <option value="Ekonomi">Ekonomi</option>
                        <option value="Teknologi">Teknologi</option>
                        <option value="Sains">Sains</option>
                        <option value="Gaya Hidup">Gaya Hidup</option>
                        <option value="Olahraga">Olahraga</option>
                        <option value="Opini">Opini</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-900 block">Cover Gambaran Visual:</label>
                      <select
                        value={generatedDraft.imageUrl}
                        onChange={(e) => setGeneratedDraft({ ...generatedDraft, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7E007E]/20 text-gray-800"
                      >
                        <option value="https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?auto=format&fit=crop&q=80&w=800">Visual Daerah & Nasional (Default)</option>
                        <option value="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800">Sains & Teknologi</option>
                        <option value="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800">Ekonomi & Perdagangan</option>
                        <option value="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800">Gaya Hidup & Sosial Budaya</option>
                        <option value="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200">Redaksi Jurnalisme Umum</option>
                      </select>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-900 block">Judul Berita:</label>
                    <input 
                      type="text"
                      value={generatedDraft.title}
                      onChange={(e) => setGeneratedDraft({ ...generatedDraft, title: e.target.value })}
                      className="w-full px-4.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7E007E]/20 focus:border-[#7E007E] text-gray-800 font-semibold"
                    />
                  </div>

                  {/* Summary text area */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-900 block">Ringkasan Berita:</label>
                    <textarea 
                      value={generatedDraft.summary}
                      onChange={(e) => setGeneratedDraft({ ...generatedDraft, summary: e.target.value })}
                      rows={2}
                      className="w-full px-4.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7E007E]/20 focus:border-[#7E007E] text-gray-800 resize-none"
                    />
                  </div>

                  {/* Content text area */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-900 block">Naskah Lengkap Berita (Pakem Khas Tebar):</label>
                    <textarea 
                      value={generatedDraft.content}
                      onChange={(e) => setGeneratedDraft({ ...generatedDraft, content: e.target.value })}
                      rows={8}
                      className="w-full px-4.5 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7E007E]/20 focus:border-[#7E007E] text-gray-700 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons footer for Draft */}
              <div className="p-4 bg-gray-50 border-t border-gray-150 flex items-center justify-between flex-shrink-0" id="draft-review-actions">
                <button
                  type="button"
                  onClick={() => setGeneratedDraft(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Ulangi Pembuatan
                </button>

                <button
                  type="button"
                  onClick={handleUploadDraft}
                  id="btn-confirm-upload-draft"
                  className="px-5 py-2 rounded-xl bg-[#7E007E] hover:bg-[#630063] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <UploadCloud className="w-4.5 h-4.5" />
                  Upload Berita Resmi ke Portal
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          ) : (
            // STANDARD DUAL-TAB CHOICE FOR CREATION
            <div className="flex flex-col" id="creation-tabs-view">
              
              {/* Tab Bar */}
              <div className="flex border-b border-gray-100 bg-[#2B2455]/5 px-4 pt-2" id="modal-tab-bar">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-4.5 py-2.5 font-sans font-bold text-xs flex items-center gap-1.5 transition-all outline-none border-b-2 cursor-pointer ${
                    activeTab === 'write'
                      ? 'border-[#7E007E] text-[#2B2455]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Compass className="w-4.5 h-4.5" />
                  Tulis Mandiri (AI)
                </button>
                <button
                  type="button"
                  onClick={handleViralTabClick}
                  className={`px-4.5 py-2.5 font-sans font-bold text-xs flex items-center gap-1.5 transition-all outline-none border-b-2 cursor-pointer ${
                    activeTab === 'viral'
                      ? 'border-[#7E007E] text-[#2B2455]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="w-4.5 h-4.5" />
                  Sinyal Viral Seluruh Indonesia (AI Grounded Search)
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-6 overflow-y-auto max-h-[60vh]" id="modal-tab-content">
                
                {/* Tab 1: Write Custom Topic */}
                {activeTab === 'write' && (
                  <form onSubmit={handleManualSubmit} className="space-y-6" id="generator-form">
                    
                    <div className="space-y-1.5" id="form-intro">
                      <label className="text-gray-950 font-bold block text-sm">Gagasan atau Ide Berita Anda:</label>
                      <p className="text-xs text-gray-500 leading-relaxed">Letakkan pokok pikiran atau garis besar informasi lapangan Anda. Jurnalis cerdas Tebarmedia akan mengolahnya secara berkeseimbangan tanpa bias perkotaan besar.</p>
                    </div>

                    {/* Topic Input Area */}
                    <div className="relative">
                      <textarea 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Contoh: Panen raya jagung organik kelompok tani mandiri di Kisar, kepulauan luar Maluku Tenggara Barat yang berhasil memasok pasar regional..."
                        rows={4}
                        maxLength={150}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#7E007E]/20 focus:border-[#7E007E] text-gray-800 resize-none font-medium leading-relaxed"
                        required
                        id="input-topic-area"
                      />
                      <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-mono">
                        {topic.length}/150 Karakter
                      </div>
                    </div>

                    {/* Presets and suggested prompts */}
                    <div className="space-y-2.5" id="suggestions-box">
                      <span className="text-xs font-bold text-gray-400 block">Saran Inspirasi Pakem Tebar:</span>
                      <div className="flex flex-wrap gap-2" id="topic-tags-grid">
                        {SUGGESTED_TOPICS.map((tag, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setTopic(tag)}
                            id={`btn-tag-${idx}`}
                            className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-indigo-50 hover:text-[#7E007E] hover:border-[#7E007E]/30 text-gray-600 font-semibold text-[10px] border border-gray-150 transition-colors cursor-pointer text-left leading-tight"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {!apiConfigured && (
                      <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-150 text-[11px] leading-relaxed" id="api-warning-banner">
                        <AlertCircle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold block mb-0.5">Mode Simulasi Aktif</strong>
                          Untuk mengaktifkan model Google Gemini asli, pasang API Key Anda di panel <strong className="font-mono bg-white/70 px-1 rounded-sm">Settings &gt; Secrets</strong>. Saat ini kami mensimulasikan jurnalisme bermutu tinggi.
                        </div>
                      </div>
                    )}

                    {errorMsg && (
                      <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs font-mono">
                        {errorMsg}
                      </div>
                    )}

                    {/* Submit custom topic action */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100" id="form-actions">
                      <button 
                        type="button" 
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit"
                        id="btn-confirm-generate"
                        disabled={!topic.trim()}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7E007E] to-[#2B2455] text-white hover:opacity-95 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
                      >
                        <Sparkles className="w-4.5 h-4.5 text-purple-200" />
                        Ramgkul Draf Jurnalisme AI
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </form>
                )}

                {/* Tab 2: Scanning Viral news across Indonesia */}
                {activeTab === 'viral' && (
                  <div className="space-y-5" id="viral-tab-workspace">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#2B2455]/5 to-indigo-50 rounded-xl border border-indigo-100" id="viral-overview-header">
                      <div className="space-y-0.5 max-w-sm">
                        <span className="text-xs font-extrabold text-[#2B2455] flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-[#7E007E]" />
                          PEMINDAI SINYAL TREN VIRAL INDONESIA
                        </span>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                          Sistem memindai media berita, media massa regional, dan media sosial tanah air menggunakan penelusuran search grounding Google untuk mencari topik positif, prestasi, atau momentum penting seluruh daerah.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={scanViralTrends}
                        disabled={isScanningViral}
                        id="btn-scan-radar"
                        className="px-3.5 py-2 rounded-xl bg-[#2B2455] hover:bg-[#1f1940] text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isScanningViral ? 'animate-spin' : ''}`} />
                        {isScanningViral ? 'Memindai...' : 'Pindai Ulang'}
                      </button>
                    </div>

                    {isScanningViral ? (
                      // Scanning Animation
                      <div className="py-12 flex flex-col items-center justify-center space-y-4" id="scanning-indicator">
                        <div className="animate-pulse flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full border-4 border-[#7E007E]/30 border-t-[#7E007E] animate-spin" />
                          <span className="text-xs font-bold text-[#7E007E] tracking-wider uppercase font-mono animate-bounce">Satelit Mencari Kabar Viral...</span>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center font-mono max-w-xs">Mengakses search grounding Google daerah Nusantara. Menyaring berita harian non-politik metropolitan...</p>
                      </div>

                    ) : viralScanError ? (
                      // Scan Error
                      <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 text-xs font-mono flex items-center justify-between">
                        <span>Error: {viralScanError}</span>
                        <button 
                          onClick={scanViralTrends}
                          className="px-3 py-1.5 bg-red-200 text-red-900 rounded-lg hover:underline text-[10px] font-bold"
                        >
                          Coba Lagi
                        </button>
                      </div>

                    ) : (
                      // Trends Lists cards
                      <div className="space-y-4" id="viral-trends-list">
                        <div className="text-2xs font-bold text-gray-400 tracking-wider uppercase flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                          DIREKTORI SINYAL TREN VIRAL DAERASI UTAMA
                        </div>

                        <div className="space-y-3" id="trends-cards-container">
                          {viralTrends.map((trend, idx) => (
                            <div 
                              key={idx}
                              id={`trend-card-${idx}`} 
                              className="p-4 bg-white border border-gray-150 rounded-xl hover:border-purple-200 hover:shadow-2xs transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                              <div className="space-y-1.5 max-w-md">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-[#2B2455]/10 text-[#2B2455] text-[9px] font-bold uppercase rounded">
                                    {trend.category}
                                  </span>
                                  <span className="text-[10px] text-orange-500 font-bold flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Viral Positif
                                  </span>
                                </div>
                                
                                <h4 className="font-sans font-extrabold text-[#2B2455] text-xs leading-snug">
                                  {trend.title}
                                </h4>
                                
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                  {trend.description}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleGenerateFromTopic(trend.title)}
                                id={`btn-write-trend-${idx}`}
                                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#7E007E] to-[#2B2455] hover:opacity-95 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 transition-transform"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Tulis Khas Tebar
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
