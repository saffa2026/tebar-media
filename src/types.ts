export interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export type NewsCategory = 
  | 'Nasional'
  | 'Ekonomi'
  | 'Teknologi'
  | 'Sains'
  | 'Gaya Hidup'
  | 'Olahraga'
  | 'Opini';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  author: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  likes: number;
  views: number;
  aiSummary?: string;
  comments: Comment[];
  isAiGenerated?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
