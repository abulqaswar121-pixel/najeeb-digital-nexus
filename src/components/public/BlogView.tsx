import React, { useState } from 'react';
import { dbService, DatabaseBlogArticle } from '../../lib/databaseStore';
import {
  BookOpen,
  Search,
  Clock,
  Heart,
  Share2,
  Sparkles,
  ArrowRight,
  User,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

interface BlogViewProps {
  onOpenBriefWizard: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onOpenBriefWizard }) => {
  const [blogs, setBlogs] = useState<DatabaseBlogArticle[]>(dbService.getBlogs());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<DatabaseBlogArticle | null>(null);

  const categories = ['All', 'Fintech', 'AI & Engineering', 'Design Systems', 'Pan-African Business'];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dbService.likeBlog(id);
    setBlogs([...dbService.getBlogs()]);
  };

  return (
    <div className="min-h-screen bg-[#070A14] text-slate-100 py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>NDH Intelligence &amp; Technical Engineering Blog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Insights on FinTech, Sovereign Tech &amp; Scaling in Africa.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Architectural teardowns, low-bandwidth AI pipelines, high-conversion design systems, and regulatory strategies curated by NDH Principal Engineers and Brand Strategists.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles &amp; topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((post) => (
            <article
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/70 overflow-hidden shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-blue-300 border border-blue-500/30">
                    {post.category}
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{post.readTimeMinutes} min read</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-[11px] font-bold text-slate-200">{post.author.name}</div>
                    <div className="text-[9px] text-slate-500">{post.publishedAt}</div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleLike(post.id, e)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-red-500/20 text-red-400" />
                  <span className="font-mono text-[11px]">{post.likesCount}</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Full Article Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans overflow-y-auto">
            <div className="w-full max-w-3xl rounded-3xl bg-[#0F172A] border border-blue-500/40 p-6 sm:p-10 shadow-2xl relative space-y-6 my-8 overflow-hidden max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>

              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-mono font-bold border border-blue-800">
                  {activeArticle.category}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  {activeArticle.title}
                </h1>

                <div className="flex items-center gap-3 pt-2 text-xs text-slate-400 border-b border-slate-800 pb-4">
                  <img
                    src={activeArticle.author.avatarUrl}
                    alt={activeArticle.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{activeArticle.author.name}</div>
                    <div className="text-xs text-slate-400">{activeArticle.author.role} • {activeArticle.publishedAt}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden h-64 bg-slate-950">
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 whitespace-pre-line">
                {activeArticle.content}
              </div>

              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={(e) => handleLike(activeArticle.id, e)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 text-xs text-slate-300 hover:text-red-400 transition-all"
                >
                  <Heart className="w-4 h-4 fill-red-500/20 text-red-400" />
                  <span>Liked by {activeArticle.likesCount} founders &amp; engineers</span>
                </button>

                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onOpenBriefWizard();
                  }}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <span>Engage NDH for Your Build</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
