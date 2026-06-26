import { useState, MouseEvent, useEffect } from 'react';
import { BLOGS } from '../data';
import { BlogPost } from '../types';
import { BookOpen, Calendar, Clock, X, Heart, MessageSquare, ChevronRight } from 'lucide-react';
import { handleImageError } from '../imageFallback';

interface BlogSectionProps {
  onSelectArticle?: (blog: BlogPost) => void;
  onViewAll?: () => void;
  variant?: 'home' | 'page';
}

export default function BlogSection({ onSelectArticle, onViewAll, variant = 'home' }: BlogSectionProps) {
  const isPage = variant === 'page';
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedList, setLikedList] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial database/API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedList[id];
    setLikedList({ ...likedList, [id]: !isLiked });
    setLikes({
      ...likes,
      [id]: (likes[id] || 0) + (isLiked ? -1 : 1)
    });
  };

  return (
    <section id="blog-section-wrapper" className={isPage ? 'py-12 md:py-16 bg-emerald-50 min-h-screen' : 'py-20 bg-emerald-50'}>
      <div className="container mx-auto px-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-4 max-w-2xl text-left">
            <span className="text-xs md:text-sm font-bold tracking-widest text-emerald-600 uppercase">Farming Academy</span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-emerald-950">
              {isPage ? 'Maxim Vet Academy Blog' : 'Latest From Our Agronomist Blog'}
            </h2>
            <p className="text-emerald-800 text-sm md:text-base">
              Stay up-to-date with crop planting checklists, modern livestock supplement guides, and early pest warning signs in East Africa.
            </p>
          </div>
          {!isPage && (
            <button
              onClick={() => onViewAll?.()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-500 shrink-0 transition group cursor-pointer"
            >
              <span>Read All Blogs</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                id={`blog-skeleton-${index}`}
                key={`blog-skeleton-${index}`}
                className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm flex flex-col h-full animate-pulse"
              >
                {/* Blog Image Skeleton */}
                <div className="relative aspect-[16/10] bg-emerald-100/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-200/20 animate-ping" />
                </div>

                {/* Body Details Skeleton */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Date / ReadTime row */}
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-16 bg-emerald-100/40 rounded" />
                      <div className="h-3.5 w-3 bg-emerald-100/20 rounded" />
                      <div className="h-3 w-12 bg-emerald-100/40 rounded" />
                    </div>

                    {/* Title */}
                    <div className="h-5 w-5/6 bg-emerald-200/20 rounded mt-2" />

                    {/* Excerpt lines */}
                    <div className="space-y-1.5 pt-1">
                      <div className="h-3 w-full bg-emerald-50/70 rounded" />
                      <div className="h-3 w-full bg-emerald-50/70 rounded" />
                      <div className="h-3 w-2/3 bg-emerald-50/70 rounded" />
                    </div>
                  </div>

                  {/* Likes/Comments/CTA Section */}
                  <div className="pt-4 border-t border-emerald-50 flex items-center justify-between">
                    <div className="h-3.5 w-24 bg-emerald-100/40 rounded" />
                    <div className="flex space-x-3">
                      <div className="h-3.5 w-8 bg-emerald-100/30 rounded" />
                      <div className="h-3.5 w-8 bg-emerald-100/30 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {BLOGS.map((blog) => {
              const hasLiked = likedList[blog.id];
              const likeCount = (likes[blog.id] || 0) + 12; // default 12 starting likes
              return (
                <article
                  id={`blog-card-${blog.id}`}
                  key={blog.id}
                  onClick={() => {
                    if (onSelectArticle) {
                      onSelectArticle(blog);
                    } else {
                      setSelectedArticle(blog);
                    }
                  }}
                  className="group bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
                >
                  {/* Blog Image */}
                  <div className="relative aspect-[16/10] bg-emerald-50 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={handleImageError}
                    />
                    <div className="absolute top-4 left-4 bg-emerald-950/80 text-emerald-300 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {blog.category}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 md:p-6 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-x-2 gap-y-1 flex-wrap text-[10px] text-emerald-600 font-bold mb-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>{blog.date}</span>
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{blog.readTime}</span>
                        </span>
                      </div>

                      <h3 className="font-serif text-base md:text-lg font-medium text-emerald-950 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-emerald-800/80 text-xs md:text-sm line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    {/* Like/Comment metrics */}
                    <div className="pt-3 border-t border-emerald-50 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-emerald-700 group-hover:text-emerald-600 transition-colors flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>Read Guide</span>
                      </span>

                      <div className="flex items-center space-x-3 text-xs text-emerald-600">
                        <button
                          id={`btn-like-${blog.id}`}
                          onClick={(e) => handleLike(blog.id, e)}
                          className={`flex items-center space-x-1 font-bold ${
                            hasLiked ? 'text-rose-500' : 'text-emerald-600/70 hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500' : ''}`} />
                          <span>{likeCount}</span>
                        </button>
                        <span className="flex items-center space-x-1 text-emerald-600/70">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{blog.id === 'blog-1' ? 4 : blog.id === 'blog-2' ? 7 : 3}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Article Full Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
            <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl relative border border-emerald-900/10 max-h-[90vh] flex flex-col">
              
              {/* Close Button */}
              <button
                id="article-modal-close"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-center transition shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto flex-1">
                {/* Cover Hero */}
                <div className="relative h-64 bg-emerald-50">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-600 px-3 py-1.5 rounded-full inline-block">
                      {selectedArticle.category}
                    </span>
                    <h4 className="font-serif text-xl md:text-2xl font-semibold leading-tight text-white drop-shadow-sm">
                      {selectedArticle.title}
                    </h4>
                  </div>
                </div>

                {/* Article Core Content */}
                <div className="p-8 space-y-6 text-emerald-950 text-xs md:text-sm leading-relaxed">
                  <div className="flex items-center space-x-3 text-xs text-emerald-600 font-bold border-b border-emerald-50 pb-4">
                    <span>By Lead Agronomist • Dr. James Ndungu</span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                  </div>

                  <p className="font-medium text-emerald-900 text-sm md:text-base">
                    {selectedArticle.excerpt}
                  </p>

                  <p>
                    Successful agriculture depends heavily on precision. Over the last 15 years, farming parameters across Kenyan highlands (such as Nakuru, Kericho, and Eldoret) have adjusted significantly. In order to maximize maize crops or vegetable yields, growers must analyze their soil chemistry before investing in secondary urea inputs.
                  </p>

                  <h5 className="font-serif text-base md:text-lg font-bold text-emerald-900 pt-2">Key Management Recommendations</h5>
                  
                  <ul className="list-disc pl-5 space-y-2 text-emerald-800">
                    <li>
                      <strong>Soil Testing First:</strong> Never apply basal compounds blindly. A basic pH analysis (ideally in February or March) guarantees that soil acidity is appropriate for standard seedling germination.
                    </li>
                    <li>
                      <strong>Timing Compound Fertilizers:</strong> Basal nitrogen-heavy fertilizers like NPK (17:17:17) are best applied immediately on seed bedding. If applied late, seedlings lose essential primary vigor.
                    </li>
                    <li>
                      <strong>Selective Pest Spraying:</strong> Spray selective chemicals like Duduthrin only in late-evening or early-morning cycles to avoid stressing beneficial insect pollinators.
                    </li>
                  </ul>

                  <p className="pt-2 bg-emerald-50 p-4 rounded-xl text-[11px] text-emerald-800 border-l-4 border-emerald-600 font-semibold">
                    💡 Disclaimer: Agricultural chemical applications carry compliance requirements. Always read official PCPB manuals on chemical dilution thresholds before spraying. For customized agronomy guidelines, schedule a soil sampling visit.
                  </p>

                  <div className="pt-6 border-t border-emerald-50 flex items-center justify-between">
                    <span className="text-xs text-emerald-600">© 2026 Maxim Vet Agriculture Institute</span>
                    <button
                      id="btn-article-modal-close-bottom"
                      onClick={() => setSelectedArticle(null)}
                      className="px-5 py-2.5 bg-emerald-100 hover:bg-emerald-600 text-emerald-900 hover:text-white text-xs font-bold rounded-xl transition"
                    >
                      Done Reading
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
