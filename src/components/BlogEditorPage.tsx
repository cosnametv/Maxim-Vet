import { useState } from 'react';
import { ArrowLeft, Upload, ImageIcon, X, Save } from 'lucide-react';
import { useContent } from '../store/contentStore';
import { BlogPost } from '../types';
import { ToastType } from './Toast';
import { compressImageFile } from '../imageUpload';
import RichTextEditor from './RichTextEditor';

export const BLOG_CATEGORIES = [
  'Agronomy Guides',
  'Pest Control',
  'Animal Health',
  'Crop Health',
  'Equipment',
  'Seeds',
  'Market Trends',
];

const inputClass =
  'w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50';

interface BlogEditorPageProps {
  postId: string | null; // null = new post
  onClose: (toast?: { type: ToastType; message: string }) => void;
}

export default function BlogEditorPage({ postId, onClose }: BlogEditorPageProps) {
  const store = useContent();
  const existing = postId ? store.blogs.find((b) => b.id === postId) ?? null : null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [category, setCategory] = useState(existing?.category ?? BLOG_CATEGORIES[0]);
  const [readTime, setReadTime] = useState(existing ? String(parseFloat(existing.readTime) || '') : '');
  const [image, setImage] = useState(existing?.image ?? '');
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [error, setError] = useState('');

  const handleImage = (file?: File) => {
    if (!file) return;
    compressImageFile(file).then(setImage);
  };

  const save = () => {
    if (!title.trim() || !category || !image.trim() || !excerpt.trim() || !content.trim()) {
      setError('Please fill in the title, category, cover image, excerpt and body.');
      return;
    }
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const item: BlogPost = {
      id: existing?.id ?? `blog-${Date.now()}`,
      title: title.trim(),
      excerpt: excerpt.trim(),
      date: existing?.date ?? today,
      readTime: `${parseFloat(readTime) || 5} min read`,
      category,
      image: image.trim(),
      content: content.trim(),
    };
    if (existing) {
      store.setBlogs(store.blogs.map((b) => (b.id === existing.id ? item : b)));
      onClose({ type: 'success', message: 'Blog post updated.' });
    } else {
      store.setBlogs([item, ...store.blogs]);
      onClose({ type: 'success', message: 'Blog post added.' });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="shrink-0 bg-emerald-950 text-white">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => onClose()}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-200 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to blog posts
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onClose()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-100 bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-white hover:bg-emerald-50 transition shadow cursor-pointer"
            >
              <Save className="w-4 h-4" /> {existing ? 'Save changes' : 'Publish post'}
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-emerald-950">
              {existing ? 'Edit Blog Post' : 'New Blog Post'}
            </h1>
            <p className="text-sm text-slate-500">Write and publish a Farming Academy article.</p>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Title <span className="text-rose-500">*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to Correctly Apply NPK Fertilizer"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Category <span className="text-rose-500">*</span></label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Read Time (minutes)</label>
              <input
                type="number"
                min={1}
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 5"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Excerpt <span className="text-rose-500">*</span></label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Short summary shown on the blog card."
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Full article <span className="text-rose-500">*</span></label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your article… Use the toolbar for subtitles, lists, and formatting."
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Cover Image <span className="text-rose-500">*</span></label>
              {image ? (
                <div className="relative">
                  <img src={image} alt="cover preview" className="w-full h-52 object-cover rounded-xl border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-52 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1">
                  <ImageIcon className="w-7 h-7" />
                  <span className="text-xs">No image selected</span>
                </div>
              )}
              <label className="flex items-center justify-center gap-2 cursor-pointer py-2.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-sm font-bold text-emerald-700 transition">
                <Upload className="w-4 h-4" />
                <span>{image ? 'Change image' : 'Upload from device'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
              </label>
              <p className="text-[11px] text-slate-400">
                Choose a photo from your phone or computer. (Stored locally for now — will connect to the database later.)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
