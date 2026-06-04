import React from 'react';
import { motion } from 'motion/react';
import { ThumbsUp, Eye, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  key?: React.Key | string;
  article: Article;
  onClick: () => void;
}

export default function ArticleCard({ article, onClick }: ArticleCardProps) {
  // Generate initials for authors
  const authorInit = article.author
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2);

  // Map categories to color badges
  const categoryColors: Record<string, string> = {
    'Nasional': 'bg-[#2B2455]/10 text-[#2B2455]',
    'Ekonomi': 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    'Teknologi': 'bg-purple-50 text-purple-700 border border-purple-200/50',
    'Sains': 'bg-teal-50 text-teal-700 border border-teal-200/50',
    'Gaya Hidup': 'bg-rose-50 text-rose-700 border border-rose-200/50',
    'Olahraga': 'bg-amber-50 text-amber-700 border border-amber-200/50',
    'Opini': 'bg-blue-50 text-blue-700 border border-blue-200/50',
  };

  const badgeColor = categoryColors[article.category] || 'bg-gray-100 text-gray-700';

  return (
    <motion.div
      layoutId={`card-container-${article.id}`}
      id={`article-card-${article.id}`}
      onClick={onClick}
      className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer h-full group"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Article Image & Badge */}
      <div className="relative h-48 overflow-hidden bg-gray-50 flex-shrink-0" id={`card-image-box-${article.id}`}>
        <img
          src={article.imageUrl}
          alt={article.title}
          id={`card-img-${article.id}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600`;
          }}
        />
        <div className="absolute top-3 left-3 flex gap-1.5" id={`card-bagde-row-${article.id}`}>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
            {article.category}
          </span>
          {article.isAiGenerated && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7E007E] text-white shadow-xs">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Tebar AI Written
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-5" id={`card-body-${article.id}`}>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2" id={`card-meta-row-${article.id}`}>
          <span className="font-medium text-gray-500">{article.publishedAt}</span>
          <span>•</span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {article.readTime}
          </span>
        </div>

        <h3 className="font-sans font-bold text-gray-800 text-lg sm:text-xl leading-snug tracking-tight mb-2 group-hover:text-[#7E007E] transition-colors line-clamp-2" id={`card-title-${article.id}`}>
          {article.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3" id={`card-summary-${article.id}`}>
          {article.summary}
        </p>

        {/* Card Footer Authorship & Stats */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100" id={`card-footer-${article.id}`}>
          {/* Author info */}
          <div className="flex items-center gap-2" id={`card-author-${article.id}`}>
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#7E007E]/20 to-[#2B2455]/20 text-[#2B2455] text-xs font-bold font-sans uppercase">
              {authorInit}
            </div>
            <span className="text-xs font-medium text-gray-600 line-clamp-1">{article.author}</span>
          </div>

          {/* Stats indicators */}
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400" id={`card-stats-${article.id}`}>
            <span className="flex items-center gap-1 hover:text-rose-500 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
              {article.likes}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              {article.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
              {article.comments.length}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
