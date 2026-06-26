import { useState, MouseEvent } from 'react';
import { BlogPost } from '../types';
import { BLOGS } from '../data';
import { handleImageError } from '../imageFallback';
import { 
  Calendar, Clock, Heart, 
  Share2, CheckCircle2, User, Sparkles, BookOpen, ChevronRight 
} from 'lucide-react';

interface BlogDetailProps {
  post: BlogPost;
  onSelectPost: (post: BlogPost) => void;
  onViewAll?: () => void;
}

export default function BlogDetail({ post, onSelectPost, onViewAll }: BlogDetailProps) {
  const [likes, setLikes] = useState<number>(24);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Filter out current post to show related posts
  const relatedPosts = BLOGS.filter(b => b.id !== post.id).slice(0, 2);

  return (
    <main id="blog-detail-view" className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
        
        {/* Article Container */}
        <article className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-emerald-950/5 mb-12">
          
          {/* Cover Hero */}
          <div className="relative aspect-[21/9] w-full bg-emerald-50">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 md:left-10 bg-emerald-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              {post.category}
            </div>
          </div>

          {/* Article Header Details */}
          <div className="px-6 md:px-12 pt-8 md:pt-12 pb-6 border-b border-emerald-50">
            <h1 className="font-serif text-2xl md:text-4xl font-semibold leading-tight text-emerald-950 mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-xs text-emerald-800/80 font-bold">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <User className="w-4 h-4" />
                </div>
                <span>By Dr. James Ndungu • Lead Agronomist</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Core Content */}
          <div className="px-6 md:px-12 py-8 md:py-10 space-y-6 md:space-y-8 text-emerald-950 text-sm md:text-base leading-relaxed text-left">
            <p className="font-medium text-emerald-900 text-base md:text-lg leading-relaxed border-l-4 border-emerald-600 pl-4 bg-emerald-50/50 py-3 rounded-r-xl">
              {post.excerpt}
            </p>

            <p>
              Successful agriculture depends heavily on precision. Over the last 15 years, farming parameters across Kenyan highlands (such as Nakuru, Kericho, and Eldoret) have adjusted significantly due to weather variations. In order to maximize maize crops or vegetable yields, growers must analyze their soil chemistry and adopt scientific, proven guidelines.
            </p>

            <p>
              At Maxim Vet, our cooperative training and soil laboratory service have mapped nutrient variations on over 2,500 smallholder farms. The data points to a single recurring error: the timing of basal application versus top-dressing. Feeding crops correctly at specific root development stages increases harvest weight by up to 45%.
            </p>

            {/* Sub-heading & Detailed Sections */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-emerald-950 pt-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Key Agronomy &amp; Crop Management Rules</span>
              </h3>
              <p>
                Whether you are managing large community acres or a backyard greenhouse, applying the following certified standards will keep your soil active and chemical costs balanced:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-900/5">
                  <span className="font-black text-lg text-emerald-800 block mb-2">01</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950 mb-2">Soil Testing First</h4>
                  <p className="text-xs text-emerald-900/80 leading-relaxed">
                    Never apply basal chemical compounds blindly. A simple pH analysis in early spring guarantees proper fertilizer absorption.
                  </p>
                </div>
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-900/5">
                  <span className="font-black text-lg text-emerald-800 block mb-2">02</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950 mb-2">NPK Vigor</h4>
                  <p className="text-xs text-emerald-900/80 leading-relaxed">
                    Basal compounds like NPK 17:17:17 are strictly for planting bedding. Late application is ineffective as Nitrogen vaporizes.
                  </p>
                </div>
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-900/5">
                  <span className="font-black text-lg text-emerald-800 block mb-2">03</span>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950 mb-2">Precise Spraying</h4>
                  <p className="text-xs text-emerald-900/80 leading-relaxed">
                    Spray selective pesticides like Duduthrin only during early morning or late evening to protect beneficial bees.
                  </p>
                </div>
              </div>
            </div>

            <p>
              In addition, farmers should maintain accurate crop records. Documenting exact planting dates, rain onset periods, and chemical application quantities helps identify yield bottlenecks. Over-application of chemicals can lead to soil acidification, turning productive fields sterile over multiple cycles.
            </p>

            {/* Callout Info Box */}
            <div className="p-6 bg-emerald-950 text-emerald-100 rounded-3xl border border-emerald-500/10 shadow-inner space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700/10 rounded-full blur-xl pointer-events-none" />
              <h4 className="font-serif text-lg font-medium text-emerald-300">PCPB Government Warning</h4>
              <p className="text-xs md:text-sm leading-relaxed text-emerald-200/85">
                All agricultural chemicals distributed by Maxim Vet are licensed by the Pest Control Products Board (PCPB). Always follow strict dilution instructions on official bottles to avoid environmental toxicity.
              </p>
            </div>

            {/* Social Share & Likes */}
            <div className="pt-8 border-t border-emerald-50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  id="btn-like-post"
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                    hasLiked 
                      ? 'bg-rose-50 text-rose-600 border-rose-200' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-900/5 hover:bg-emerald-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{likes} Likes</span>
                </button>

                <button
                  id="btn-share-post"
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold transition border border-slate-900/5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {isCopied && (
                <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1 animate-pulse bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Link copied to clipboard!</span>
                </span>
              )}
            </div>

          </div>
        </article>

        {/* Read Next Section */}
        <section id="read-next-section" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg md:text-xl font-semibold text-emerald-950">Academy: What to Read Next</h3>
            <button
              onClick={() => onViewAll?.()}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-500 transition cursor-pointer group"
            >
              <span>More Tips</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {relatedPosts.map((related) => (
              <div
                key={related.id}
                onClick={() => {
                  onSelectPost(related);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-white rounded-2xl overflow-hidden border border-emerald-950/5 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between"
              >
                <div className="aspect-[21/9] bg-emerald-50 relative overflow-hidden">
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <div className="absolute top-3 left-3 bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                    {related.category}
                  </div>
                </div>
                <div className="p-4 md:p-5 text-left flex-1 flex flex-col justify-between gap-2">
                  <h4 className="font-serif text-sm md:text-base font-semibold text-emerald-950 leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
                    {related.title}
                  </h4>
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-emerald-600 font-bold pt-2 border-t border-slate-50">
                    <span>{related.date}</span>
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Read Guide</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        </div>
      </div>
    </main>
  );
}
