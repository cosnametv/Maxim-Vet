import { useState, useEffect, FormEvent } from 'react';
import {
  LayoutDashboard, Package, Newspaper, HelpCircle, GraduationCap,
  Stethoscope, ClipboardCheck, LogOut, ArrowLeft, Plus, Pencil, Trash2,
  X, Search, Lock, CheckCircle2, AlertTriangle, Upload, ImageIcon, ChevronDown,
  BarChart3, Wallet, TrendingUp, Boxes,
} from 'lucide-react';
import { useContent } from '../store/contentStore';
import { Product, FAQItem, CPDModule } from '../types';
import { AcademyCategory, AcademyLesson, ACADEMY_ICON_OPTIONS, ACADEMY_ICON_MAP } from '../academyData';
import Toast, { ToastData, ToastType } from './Toast';
import PasswordInput from './PasswordInput';
import { compressImageFile } from '../imageUpload';
import BlogEditorPage from './BlogEditorPage';

interface AdminPortalProps {
  onBack: () => void;
}

// Simple gate. In a real deployment this would be a server-side check.
const ADMIN_PASSWORD = 'maxim-admin';
const AUTH_KEY = 'mv-admin-auth';

type Section =
  | 'overview'
  | 'products'
  | 'blogs'
  | 'faqs'
  | 'cpd'
  | 'lessons'
  | 'enrollments'
  | 'analytics';

interface Field {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'image' | 'date';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

// Date helpers: the date input works in ISO (yyyy-mm-dd); we store a friendly
// display string like "14 Jul 2026" so the portals render nicely.
const pad2 = (n: number) => String(n).padStart(2, '0');
const toISODate = (s: string): string => {
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  return isNaN(d.getTime()) ? '' : `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const fromISODate = (s: string): string => {
  if (!s) return '';
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T00:00:00` : s);
  return isNaN(d.getTime())
    ? s
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const PRODUCT_TAGS = ['None', 'Best Seller', 'Recommended', 'Popular', 'New Crop', 'Highly Rated', 'Farmer Choice', '10% OFF', '15% OFF'];

const PRODUCT_FIELDS: Field[] = [
  { key: 'name', label: 'Product Name', type: 'text', required: true, placeholder: 'e.g. Duduthrin 500ml Insecticide' },
  { key: 'category', label: 'Category', type: 'select', options: ['crop-health', 'animal-health', 'equipment', 'seeds'], required: true },
  { key: 'buyingPrice', label: 'Buying Price (KSh)', type: 'number', placeholder: 'e.g. 1200' },
  { key: 'price', label: 'Selling Price (KSh)', type: 'number', required: true, placeholder: 'e.g. 1600' },
  { key: 'stockQuantity', label: 'Stock Quantity', type: 'number', required: true, placeholder: 'e.g. 20' },
  { key: 'tag', label: 'Tag', type: 'select', options: PRODUCT_TAGS },
  { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Short product description shown on the product card.' },
  { key: 'image', label: 'Product Image', type: 'image', required: true },
];

const FAQ_FIELDS: Field[] = [
  { key: 'question', label: 'Question', type: 'textarea', rows: 2, required: true, placeholder: 'e.g. Do you deliver outside Nairobi?' },
  { key: 'answer', label: 'Answer', type: 'textarea', rows: 5, required: true, placeholder: 'Provide a clear, helpful answer for customers.' },
];

const CPD_FIELDS: Field[] = [
  { key: 'title', label: 'Module Title', type: 'text', required: true, placeholder: 'e.g. Advanced Ruminant Mastitis Management' },
  { key: 'duration', label: 'Duration (hours)', type: 'number', required: true, placeholder: 'e.g. 3' },
  { key: 'ratePerDay', label: 'Rate (KSh / day)', type: 'number', required: true, placeholder: 'e.g. 500' },
  { key: 'fromDate', label: 'From Date', type: 'date', required: true },
  { key: 'toDate', label: 'To Date', type: 'date', required: true },
  { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['Foundational', 'Intermediate', 'Advanced'], required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'What the module covers and who it is for.' },
];

const inputClass =
  'w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50';

/* ----------------------------- Editor Modal ----------------------------- */
function EditorModal({
  title,
  fields,
  initial,
  onSave,
  onClose,
}: {
  title: string;
  fields: Field[];
  initial: Record<string, string>;
  onSave: (values: Record<string, string>) => void;
  onClose: () => void;
}) {
  // Seed select fields with their first option so the stored value matches
  // what is displayed (otherwise a required dropdown stays empty until touched).
  const [values, setValues] = useState<Record<string, string>>(() => {
    const seeded: Record<string, string> = { ...initial };
    for (const f of fields) {
      if (f.type === 'select' && (seeded[f.key] === undefined || seeded[f.key] === '')) {
        seeded[f.key] = f.options?.[0] ?? '';
      }
    }
    return seeded;
  });
  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  // Read a chosen image file, downscale/compress it, then store as a data URL.
  const handleImageFile = (key: string, file?: File) => {
    if (!file) return;
    compressImageFile(file).then((dataUrl) => set(key, dataUrl));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    for (const f of fields) {
      if (f.required && !String(values[f.key] ?? '').trim()) {
        return; // basic guard; field shows required
      }
    }
    onSave(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative border border-emerald-900/10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-serif text-xl font-semibold text-emerald-950">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
          {fields.map((f) => (
            <div
              key={f.key}
              className={`space-y-1.5 ${f.type === 'textarea' || f.type === 'image' ? 'sm:col-span-2' : ''}`}
            >
              <label className="text-xs font-bold text-slate-700">
                {f.label}
                {f.required && <span className="text-rose-500"> *</span>}
              </label>
              {f.type === 'image' ? (
                <div className="space-y-2">
                  {values[f.key] ? (
                    <div className="relative">
                      <img
                        src={values[f.key]}
                        alt="preview"
                        className="w-full h-40 object-cover rounded-xl border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => set(f.key, '')}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1">
                      <ImageIcon className="w-7 h-7" />
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}
                  <label className="flex items-center justify-center gap-2 cursor-pointer py-2.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-sm font-bold text-emerald-700 transition">
                    <Upload className="w-4 h-4" />
                    <span>{values[f.key] ? 'Change image' : 'Upload from device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFile(f.key, e.target.files?.[0])}
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Choose a photo from your phone or computer. (Stored locally for now — will connect to the database later.)
                  </p>
                </div>
              ) : f.type === 'date' ? (
                <input
                  type="date"
                  value={values[f.key] ?? ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  className={inputClass}
                />
              ) : f.type === 'textarea' ? (
                <textarea
                  value={values[f.key] ?? ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={f.rows ?? 3}
                  className={inputClass}
                />
              ) : f.type === 'select' ? (
                <select
                  value={values[f.key] ?? f.options?.[0] ?? ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  className={inputClass}
                >
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === 'number' ? 'number' : 'text'}
                  step="any"
                  value={values[f.key] ?? ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputClass}
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2 sm:col-span-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition shadow-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-bold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ----------------------------- Confirm Dialog ----------------------------- */
function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-emerald-900/10 p-6 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-700">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-bold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPortal({ onBack }: AdminPortalProps) {
  const store = useContent();
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [pw, setPw] = useState('');
  const [loginError, setLoginError] = useState('');
  const [section, setSection] = useState<Section>('overview');
  const [toast, setToast] = useState<ToastData | null>(null);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // URL-based sub-routing for the full-page blog editor.
  const [adminPath, setAdminPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setAdminPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const goAdmin = (path: string) => {
    window.history.pushState(null, '', path);
    setAdminPath(path);
  };

  // editor + confirm state
  const [editor, setEditor] = useState<{
    section: Section;
    fields: Field[];
    title: string;
    initial: Record<string, string>;
    save: (v: Record<string, string>) => void;
  } | null>(null);
  const [confirm, setConfirm] = useState<{ message: string; action: () => void } | null>(null);

  const showToast = (type: ToastType, message: string) =>
    setToast({ id: Date.now(), type, message });

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect admin password.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setPw('');
  };

  /* --------------------------- Login screen --------------------------- */
  if (!authed) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black font-serif text-lg shadow-md">
              M
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-emerald-950 leading-none">Maxim Vet</h1>
              <span className="text-[11px] font-bold tracking-widest text-emerald-600 uppercase">Admin Console</span>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-medium text-emerald-950">Administrator sign in</h2>
            <p className="text-sm text-slate-500">Manage products, blogs, FAQs and both academy portals.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Admin Password
              </label>
              <PasswordInput
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Enter admin password"
                required
                className={inputClass}
              />
            </div>
            {loginError && (
              <p className="text-xs text-rose-600 font-semibold">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition shadow-md"
            >
              Sign In
            </button>
          </form>
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to website
          </button>
        </div>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  /* --------------------- Full-page blog editor route --------------------- */
  const blogEditMatch = adminPath.match(/^\/maxim\/admin\/blogs\/edit\/(.+)$/);
  const isBlogNew = adminPath === '/maxim/admin/blogs/new';
  if (isBlogNew || blogEditMatch) {
    return (
      <>
        <BlogEditorPage
          postId={blogEditMatch ? decodeURIComponent(blogEditMatch[1]) : null}
          onClose={(t) => {
            setSection('blogs');
            goAdmin('/maxim/admin');
            if (t) showToast(t.type, t.message);
          }}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  /* --------------------------- CRUD helpers --------------------------- */
  const objToStr = (obj: object): Record<string, string> => {
    const out: Record<string, string> = {};
    Object.entries(obj).forEach(([k, v]) => {
      out[k] = v === undefined || v === null ? '' : String(v);
    });
    return out;
  };

  const num = (v: string, fallback = 0) => {
    const n = parseFloat(v);
    return isNaN(n) ? fallback : n;
  };

  // ---- Products
  const saveProduct = (existing: Product | null) => (v: Record<string, string>) => {
    const qty = Math.max(0, Math.round(num(v.stockQuantity, 0)));
    // Auto stock status: 0 = Out of Stock, under 5 = Low Stock, else In Stock.
    const stockStatus: Product['stockStatus'] =
      qty === 0 ? 'Out of Stock' : qty < 5 ? 'Low Stock' : 'In Stock';
    const item: Product = {
      id: existing?.id ?? `prod-${Date.now()}`,
      name: v.name.trim(),
      category: (v.category as Product['category']) || 'crop-health',
      price: num(v.price),
      buyingPrice: num(v.buyingPrice, 0),
      rating: existing?.rating ?? 0,
      reviewsCount: existing?.reviewsCount ?? 0,
      image: v.image.trim(),
      tag: v.tag && v.tag !== 'None' ? v.tag : undefined,
      description: v.description.trim(),
      stockStatus,
      stockQuantity: qty,
    };
    if (existing) {
      store.setProducts(store.products.map((p) => (p.id === existing.id ? item : p)));
      showToast('success', 'Product updated.');
    } else {
      store.setProducts([item, ...store.products]);
      showToast('success', 'Product added.');
    }
    setEditor(null);
  };

  // ---- FAQs
  const saveFaq = (index: number | null) => (v: Record<string, string>) => {
    const item: FAQItem = { question: v.question.trim(), answer: v.answer.trim() };
    if (index !== null) {
      store.setFaqs(store.faqs.map((f, i) => (i === index ? item : f)));
      showToast('success', 'FAQ updated.');
    } else {
      store.setFaqs([...store.faqs, item]);
      showToast('success', 'FAQ added.');
    }
    setEditor(null);
  };

  // ---- CPD modules
  const saveCpd = (existing: CPDModule | null) => (v: Record<string, string>) => {
    // Auto-generate a KVB code for new modules; keep the existing one on edit.
    const code =
      existing?.code ??
      `KVB-CPD-${new Date().getFullYear()}-${String(store.cpdModules.length + 1).padStart(2, '0')}`;
    const item: CPDModule = {
      id: existing?.id ?? `cpd-${Date.now()}`,
      title: v.title.trim(),
      code,
      ratePerDay: Math.max(0, Math.round(parseFloat(v.ratePerDay) || 0)),
      duration: `${parseFloat(v.duration) || 0} hours`,
      fromDate: fromISODate(v.fromDate.trim()),
      toDate: fromISODate(v.toDate.trim()),
      difficulty: v.difficulty || 'Foundational',
      description: v.description.trim(),
    };
    if (existing) {
      store.setCpdModules(store.cpdModules.map((m) => (m.id === existing.id ? item : m)));
      showToast('success', 'CPD module updated.');
    } else {
      store.setCpdModules([item, ...store.cpdModules]);
      showToast('success', 'CPD module added.');
    }
    setEditor(null);
  };

  /* --------------------------- Layout shell --------------------------- */
  const navItems: { id: Section; label: string; icon: typeof Package; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, count: store.products.length },
    { id: 'blogs', label: 'Blog Posts', icon: Newspaper, count: store.blogs.length },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle, count: store.faqs.length },
    { id: 'cpd', label: 'Vet CPD Modules', icon: Stethoscope, count: store.cpdModules.length },
    { id: 'lessons', label: 'Academy Courses', icon: GraduationCap, count: store.academyCategories.length },
    { id: 'enrollments', label: 'CPD Enrollments', icon: ClipboardCheck, count: Object.keys(store.enrollments).length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-950 text-white shrink-0 z-30">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black font-serif">
              M
            </div>
            <div className="leading-none">
              <span className="font-serif text-lg font-bold">Admin Console</span>
              <span className="hidden sm:block text-[10px] font-bold tracking-widest text-emerald-300 uppercase">Maxim Vet Management</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-xs font-bold px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Website</span>
            </button>
            <button
              onClick={logout}
              className="text-xs font-bold px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Sidebar / nav */}
        <nav className="md:w-64 md:shrink-0 md:h-full md:overflow-y-auto border-b md:border-b-0 md:border-r border-slate-200 bg-white p-3 md:p-4">
          {/* Mobile: collapsible dropdown */}
          <div className="md:hidden relative">
            {(() => {
              const activeItem = navItems.find((n) => n.id === section) ?? navItems[0];
              const ActiveIcon = activeItem.icon;
              return (
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-sm"
                >
                  <span className="flex items-center gap-2.5">
                    <ActiveIcon className="w-4 h-4 shrink-0" />
                    {activeItem.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>
              );
            })()}
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute left-0 right-0 mt-2 z-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1">
                  {navItems.map((n) => {
                    const Icon = n.icon;
                    const active = section === n.id;
                    return (
                      <button
                        key={n.id}
                        onClick={() => { setSection(n.id); setSearch(''); setMenuOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                          active ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{n.label}</span>
                        {n.count !== undefined && (
                          <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                            {n.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Desktop: vertical sidebar */}
          <div className="hidden md:flex md:flex-col gap-1.5">
            {navItems.map((n) => {
              const Icon = n.icon;
              const active = section === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => { setSection(n.id); setSearch(''); }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{n.label}</span>
                  {n.count !== undefined && (
                    <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                      {n.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main content — scrolls independently */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl">
          {section === 'overview' && <Overview store={store} setSection={setSection} />}

          {section === 'products' && (
            <CrudList
              title="Products"
              subtitle="Manage the product catalog shown on the storefront."
              search={search}
              setSearch={setSearch}
              onAdd={() =>
                setEditor({
                  section: 'products',
                  title: 'Add Product',
                  fields: PRODUCT_FIELDS,
                  initial: { category: 'crop-health', tag: 'None' },
                  save: saveProduct(null),
                })
              }
              items={store.products
                .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                .map((p) => ({
                  id: p.id,
                  primary: p.name,
                  secondary: `${p.category} · KSh ${p.price.toLocaleString()}${
                    p.buyingPrice ? ` · Profit KSh ${(p.price - p.buyingPrice).toLocaleString()}` : ''
                  } · ${p.stockStatus}`,
                  onEdit: () =>
                    setEditor({
                      section: 'products',
                      title: 'Edit Product',
                      fields: PRODUCT_FIELDS,
                      initial: objToStr({
                        ...p,
                        tag: p.tag ?? 'None',
                        stockQuantity:
                          p.stockQuantity ??
                          (p.stockStatus === 'Out of Stock' ? 0 : p.stockStatus === 'Low Stock' ? 3 : 20),
                      }),
                      save: saveProduct(p),
                    }),
                  onDelete: () =>
                    setConfirm({
                      message: `Delete product "${p.name}"?`,
                      action: () => {
                        store.setProducts(store.products.filter((x) => x.id !== p.id));
                        setConfirm(null);
                        showToast('success', 'Product deleted.');
                      },
                    }),
                }))}
            />
          )}

          {section === 'blogs' && (
            <CrudList
              title="Blog Posts"
              subtitle="Manage the Farming Academy blog articles."
              search={search}
              setSearch={setSearch}
              onAdd={() => goAdmin('/maxim/admin/blogs/new')}
              items={store.blogs
                .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
                .map((b) => ({
                  id: b.id,
                  primary: b.title,
                  secondary: `${b.category} · ${b.date}`,
                  onEdit: () => goAdmin(`/maxim/admin/blogs/edit/${encodeURIComponent(b.id)}`),
                  onDelete: () =>
                    setConfirm({
                      message: `Delete blog post "${b.title}"?`,
                      action: () => {
                        store.setBlogs(store.blogs.filter((x) => x.id !== b.id));
                        setConfirm(null);
                        showToast('success', 'Blog post deleted.');
                      },
                    }),
                }))}
            />
          )}

          {section === 'faqs' && (
            <CrudList
              title="FAQs"
              subtitle="Manage the support-desk frequently asked questions."
              search={search}
              setSearch={setSearch}
              onAdd={() =>
                setEditor({
                  section: 'faqs',
                  title: 'Add FAQ',
                  fields: FAQ_FIELDS,
                  initial: {},
                  save: saveFaq(null),
                })
              }
              items={store.faqs
                .map((f, i) => ({ f, i }))
                .filter(({ f }) => f.question.toLowerCase().includes(search.toLowerCase()))
                .map(({ f, i }) => ({
                  id: String(i),
                  primary: f.question,
                  secondary: f.answer,
                  onEdit: () =>
                    setEditor({
                      section: 'faqs',
                      title: 'Edit FAQ',
                      fields: FAQ_FIELDS,
                      initial: objToStr(f),
                      save: saveFaq(i),
                    }),
                  onDelete: () =>
                    setConfirm({
                      message: 'Delete this FAQ?',
                      action: () => {
                        store.setFaqs(store.faqs.filter((_, idx) => idx !== i));
                        setConfirm(null);
                        showToast('success', 'FAQ deleted.');
                      },
                    }),
                }))}
            />
          )}

          {section === 'cpd' && (
            <CrudList
              title="Vet CPD Modules"
              subtitle="Manage the continuous professional development modules in the Vet portal."
              search={search}
              setSearch={setSearch}
              onAdd={() =>
                setEditor({
                  section: 'cpd',
                  title: 'Add CPD Module',
                  fields: CPD_FIELDS,
                  initial: { difficulty: 'Foundational' },
                  save: saveCpd(null),
                })
              }
              items={store.cpdModules
                .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
                .map((m) => ({
                  id: m.id,
                  primary: m.title,
                  secondary: `${m.code} · ${m.fromDate} → ${m.toDate}`,
                  onEdit: () =>
                    setEditor({
                      section: 'cpd',
                      title: 'Edit CPD Module',
                      fields: CPD_FIELDS,
                      initial: {
                        ...objToStr(m),
                        duration: String(parseFloat(m.duration) || ''),
                        fromDate: toISODate(m.fromDate),
                        toDate: toISODate(m.toDate),
                      },
                      save: saveCpd(m),
                    }),
                  onDelete: () =>
                    setConfirm({
                      message: `Delete CPD module "${m.title}"?`,
                      action: () => {
                        store.setCpdModules(store.cpdModules.filter((x) => x.id !== m.id));
                        setConfirm(null);
                        showToast('success', 'CPD module deleted.');
                      },
                    }),
                }))}
            />
          )}

          {section === 'lessons' && (
            <AcademyManager store={store} showToast={showToast} setConfirm={setConfirm} />
          )}

          {section === 'enrollments' && (
            <EnrollmentsManager store={store} showToast={showToast} setConfirm={setConfirm} />
          )}

          {section === 'analytics' && <AnalyticsManager store={store} />}
          </div>
        </main>
      </div>

      {editor && (
        <EditorModal
          title={editor.title}
          fields={editor.fields}
          initial={editor.initial}
          onSave={editor.save}
          onClose={() => setEditor(null)}
        />
      )}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={confirm.action}
          onCancel={() => setConfirm(null)}
        />
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

/* ----------------------------- Overview ----------------------------- */
function Overview({
  store,
  setSection,
}: {
  store: ReturnType<typeof useContent>;
  setSection: (s: Section) => void;
}) {
  const pending = Object.values(store.enrollments).filter((e) => !e.verified).length;
  const cards = [
    { id: 'products' as Section, label: 'Products', value: store.products.length, icon: Package },
    { id: 'blogs' as Section, label: 'Blog Posts', value: store.blogs.length, icon: Newspaper },
    { id: 'faqs' as Section, label: 'FAQs', value: store.faqs.length, icon: HelpCircle },
    { id: 'cpd' as Section, label: 'CPD Modules', value: store.cpdModules.length, icon: Stethoscope },
    { id: 'lessons' as Section, label: 'Academy Categories', value: store.academyCategories.length, icon: GraduationCap },
    { id: 'enrollments' as Section, label: 'Enrollments', value: Object.keys(store.enrollments).length, icon: ClipboardCheck },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-emerald-950">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 mt-1">Manage all site content and both academy portals from one place.</p>
      </div>
      {pending > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-4 py-3 text-sm">
          <ClipboardCheck className="w-5 h-5 shrink-0" />
          <span>
            <strong>{pending}</strong> CPD enrollment{pending > 1 ? 's' : ''} awaiting payment verification.
          </span>
          <button
            onClick={() => setSection('enrollments')}
            className="ml-auto text-xs font-bold underline underline-offset-2"
          >
            Review
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setSection(c.id)}
              className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-emerald-300 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-emerald-950">{c.value}</div>
              <div className="text-xs font-semibold text-slate-500">{c.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------- Generic list ----------------------------- */
interface ListRow {
  id: string;
  primary: string;
  secondary: string;
  onEdit: () => void;
  onDelete: () => void;
}
function CrudList({
  title,
  subtitle,
  items,
  onAdd,
  search,
  setSearch,
}: {
  title: string;
  subtitle: string;
  items: ListRow[];
  onAdd: () => void;
  search: string;
  setSearch: (s: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-emerald-950">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white"
        />
      </div>

      <div className="space-y-2.5">
        {items.length === 0 && (
          <p className="text-sm text-slate-400 py-8 text-center">No items found.</p>
        )}
        {items.map((row) => (
          <div
            key={row.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 hover:shadow-sm transition"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-emerald-950 truncate">{row.primary}</div>
              <div className="text-xs text-slate-500 line-clamp-2">{row.secondary}</div>
            </div>
            <button
              onClick={row.onEdit}
              className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition shrink-0"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={row.onDelete}
              className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition shrink-0"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Academy manager ----------------------------- */
const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item';

function CategoryEditor({
  initial,
  onSave,
  onClose,
}: {
  initial: { title: string; iconKey: string; blurb: string };
  onSave: (v: { title: string; iconKey: string; blurb: string }) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [iconKey, setIconKey] = useState(initial.iconKey);
  const [blurb, setBlurb] = useState(initial.blurb);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-emerald-900/10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-serif text-xl font-semibold text-emerald-950">Category</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return; onSave({ title: title.trim(), iconKey, blurb: blurb.trim() }); }}
          className="p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Category Name <span className="text-rose-500">*</span></label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Hens & Chicks" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ACADEMY_ICON_OPTIONS.map((key) => {
                const Icon = ACADEMY_ICON_MAP[key];
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setIconKey(key)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                      iconKey === key ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={key}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Short Description</label>
            <textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} rows={2} placeholder="Brief description shown on the category card." className={inputClass} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition shadow-md">Save</button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-bold transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LessonEditor({
  initial,
  onSave,
  onClose,
}: {
  initial: AcademyLesson;
  onSave: (l: AcademyLesson) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [duration, setDuration] = useState(String(parseFloat(initial.duration) || ''));
  const [summary, setSummary] = useState(initial.summary);
  const [price, setPrice] = useState(initial.price);
  const [videoUrl, setVideoUrl] = useState(initial.videoUrl);
  const [content, setContent] = useState(initial.content.join('\n\n'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-emerald-900/10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-serif text-xl font-semibold text-emerald-950">Lesson</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            onSave({
              ...initial,
              title: title.trim(),
              duration: `${parseFloat(duration) || 0} hours`,
              summary: summary.trim(),
              price: Math.max(0, Math.round(price || 0)),
              videoUrl: videoUrl.trim(),
              content: content.split(/\n{2,}|\n/).map((s) => s.trim()).filter(Boolean),
            });
          }}
          className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto"
        >
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">Lesson Title <span className="text-rose-500">*</span></label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to Poultry Keeping" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Duration (hours)</label>
            <input type="number" min={0} step="0.5" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 1" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Pricing</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPrice(0)} className={`px-3 py-2 rounded-lg text-xs font-bold transition ${price === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Free</button>
              <button type="button" onClick={() => setPrice(price === 0 ? 200 : price)} className={`px-3 py-2 rounded-lg text-xs font-bold transition ${price > 0 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Paid</button>
              {price > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Ksh</span>
                  <input type="number" value={price} onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value || '0', 10)))} className="w-20 text-sm px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">Summary</label>
            <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One-line summary shown in the lesson list." className={inputClass} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">YouTube Video URL</label>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Blank uses the default sample video." className={inputClass} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700">Notes / Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Lesson notes. Separate paragraphs with a blank line." className={inputClass} />
          </div>
          <div className="flex gap-3 pt-1 sm:col-span-2">
            <button type="submit" className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition shadow-md">Save</button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-bold transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AcademyManager({
  store,
  showToast,
  setConfirm,
}: {
  store: ReturnType<typeof useContent>;
  showToast: (t: ToastType, m: string) => void;
  setConfirm: (c: { message: string; action: () => void } | null) => void;
}) {
  const cats = store.academyCategories;
  // category editor: { mode, category? }; lesson editor: { categoryId, lesson? }
  const [catEditor, setCatEditor] = useState<{ existing: AcademyCategory | null } | null>(null);
  const [lessonEditor, setLessonEditor] = useState<{ categoryId: string; existing: AcademyLesson | null } | null>(null);
  // Categories start collapsed; click a category to reveal its lessons.
  const [openCatId, setOpenCatId] = useState<string | null>(null);
  const toggleCat = (id: string) => setOpenCatId((prev) => (prev === id ? null : id));

  const saveCategory = (v: { title: string; iconKey: string; blurb: string }) => {
    if (catEditor?.existing) {
      store.setAcademyCategories(
        cats.map((c) => (c.id === catEditor.existing!.id ? { ...c, ...v } : c))
      );
      showToast('success', 'Category updated.');
    } else {
      const id = `${slugify(v.title)}-${Date.now().toString().slice(-4)}`;
      store.setAcademyCategories([...cats, { id, ...v, lessons: [] }]);
      showToast('success', 'Category added.');
    }
    setCatEditor(null);
  };

  const saveLesson = (categoryId: string, existing: AcademyLesson | null) => (lesson: AcademyLesson) => {
    store.setAcademyCategories(
      cats.map((c) => {
        if (c.id !== categoryId) return c;
        if (existing) {
          return { ...c, lessons: c.lessons.map((l) => (l.id === existing.id ? lesson : l)) };
        }
        return { ...c, lessons: [...c.lessons, lesson] };
      })
    );
    showToast('success', existing ? 'Lesson updated.' : 'Lesson added.');
    setLessonEditor(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-emerald-950">Farmers Academy</h2>
          <p className="text-sm text-slate-500 mt-1">Create categories, then add lessons inside each category.</p>
        </div>
        <button
          onClick={() => setCatEditor({ existing: null })}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {cats.length === 0 && <p className="text-sm text-slate-400 py-8 text-center">No categories yet.</p>}

      <div className="space-y-4">
        {cats.map((cat) => {
          const Icon = ACADEMY_ICON_MAP[cat.iconKey] ?? GraduationCap;
          const isOpen = openCatId === cat.id;
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className={`flex items-center gap-3 p-4 bg-slate-50/50 ${isOpen ? 'border-b border-slate-100' : ''}`}>
                <button
                  onClick={() => toggleCat(cat.id)}
                  className="flex items-center gap-3 min-w-0 flex-1 text-left"
                  aria-expanded={isOpen}
                >
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-emerald-950 truncate">{cat.title}</div>
                    <div className="text-xs text-slate-500 truncate">{cat.lessons.length} lesson{cat.lessons.length !== 1 ? 's' : ''}</div>
                  </div>
                </button>
                <button onClick={() => setCatEditor({ existing: cat })} className="w-9 h-9 rounded-lg bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition shrink-0 border border-slate-200" title="Edit category">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setConfirm({
                      message: `Delete category "${cat.title}" and all its lessons?`,
                      action: () => {
                        store.setAcademyCategories(cats.filter((c) => c.id !== cat.id));
                        setConfirm(null);
                        showToast('success', 'Category deleted.');
                      },
                    })
                  }
                  className="w-9 h-9 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition shrink-0 border border-slate-200"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isOpen && (
              <div className="p-3 space-y-2">
                {cat.lessons.map((l) => (
                  <div key={l.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-emerald-950 truncate">{l.title}</div>
                      <div className="text-[11px] text-slate-500">
                        {l.duration} · {l.price === 0 ? 'Free' : `Ksh ${l.price}`}{l.videoUrl ? ' · custom video' : ''}
                      </div>
                    </div>
                    <button onClick={() => setLessonEditor({ categoryId: cat.id, existing: l })} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition shrink-0" title="Edit lesson">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirm({
                          message: `Delete lesson "${l.title}"?`,
                          action: () => {
                            store.setAcademyCategories(
                              cats.map((c) => (c.id === cat.id ? { ...c, lessons: c.lessons.filter((x) => x.id !== l.id) } : c))
                            );
                            setConfirm(null);
                            showToast('success', 'Lesson deleted.');
                          },
                        })
                      }
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition shrink-0"
                      title="Delete lesson"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setLessonEditor({ categoryId: cat.id, existing: null })}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Lesson
                </button>
              </div>
              )}
            </div>
          );
        })}
      </div>

      {catEditor && (
        <CategoryEditor
          initial={
            catEditor.existing
              ? { title: catEditor.existing.title, iconKey: catEditor.existing.iconKey, blurb: catEditor.existing.blurb }
              : { title: '', iconKey: ACADEMY_ICON_OPTIONS[0], blurb: '' }
          }
          onSave={saveCategory}
          onClose={() => setCatEditor(null)}
        />
      )}
      {lessonEditor && (
        <LessonEditor
          initial={
            lessonEditor.existing ?? {
              id: `lesson-${Date.now().toString().slice(-6)}`,
              title: '',
              duration: '',
              summary: '',
              content: [],
              price: 0,
              videoUrl: '',
            }
          }
          onSave={saveLesson(lessonEditor.categoryId, lessonEditor.existing)}
          onClose={() => setLessonEditor(null)}
        />
      )}
    </div>
  );
}

/* ----------------------------- Enrollments manager ----------------------------- */
function EnrollmentsManager({
  store,
  showToast,
  setConfirm,
}: {
  store: ReturnType<typeof useContent>;
  showToast: (t: ToastType, m: string) => void;
  setConfirm: (c: { message: string; action: () => void } | null) => void;
}) {
  const records = Object.values(store.enrollments);
  const moduleTitle = (id: string) => store.cpdModules.find((m) => m.id === id)?.title ?? id;

  const setVerified = (moduleId: string, verified: boolean) => {
    const rec = store.enrollments[moduleId];
    if (!rec) return;
    store.setEnrollments({ ...store.enrollments, [moduleId]: { ...rec, verified } });
    showToast('success', verified ? 'Enrollment verified.' : 'Verification revoked.');
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-emerald-950">CPD Enrollments</h2>
        <p className="text-sm text-slate-500 mt-1">Review M-Pesa payments submitted by vets and verify their bookings.</p>
      </div>
      {records.length === 0 && (
        <p className="text-sm text-slate-400 py-8 text-center">No enrollments submitted yet.</p>
      )}
      <div className="space-y-3">
        {records.map((rec) => (
          <div key={rec.moduleId} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-bold text-emerald-950">{moduleTitle(rec.moduleId)}</div>
                <div className="text-xs text-slate-500">
                  {rec.memberName ? `${rec.memberName} · ` : ''}{rec.kvb ?? 'KVB n/a'}
                </div>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                  rec.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {rec.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-slate-400">Amount</div>
                <div className="font-bold text-emerald-950">KSh {rec.amount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-slate-400">Days</div>
                <div className="font-bold text-emerald-950">{rec.dates.length}</div>
              </div>
              <div>
                <div className="text-slate-400">M-Pesa Ref</div>
                <div className="font-bold text-emerald-950 font-mono">{rec.reference}</div>
              </div>
              <div>
                <div className="text-slate-400">Phone</div>
                <div className="font-bold text-emerald-950">{rec.phone || '—'}</div>
              </div>
            </div>
            {rec.dates.length > 0 && (
              <div className="text-xs text-slate-500">
                <span className="text-slate-400">Selected: </span>
                {rec.dates.join(', ')}
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {rec.verified ? (
                <button
                  onClick={() => setVerified(rec.moduleId, false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Revoke
                </button>
              ) : (
                <button
                  onClick={() => setVerified(rec.moduleId, true)}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verify Payment
                </button>
              )}
              <button
                onClick={() =>
                  setConfirm({
                    message: `Delete this enrollment for "${moduleTitle(rec.moduleId)}"?`,
                    action: () => {
                      const next = { ...store.enrollments };
                      delete next[rec.moduleId];
                      store.setEnrollments(next);
                      setConfirm(null);
                      showToast('success', 'Enrollment deleted.');
                    },
                  })
                }
                className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Analytics ----------------------------- */
function AnalyticsManager({ store }: { store: ReturnType<typeof useContent> }) {
  const ksh = (n: number) => `KSh ${Math.round(n).toLocaleString()}`;

  // CPD enrollments — real money (verified = earned, unverified = pending).
  const enrollments = Object.values(store.enrollments);
  const cpdEarned = enrollments.filter((e) => e.verified).reduce((s, e) => s + e.amount, 0);
  const cpdPending = enrollments.filter((e) => !e.verified).reduce((s, e) => s + e.amount, 0);

  // Products — no order tracking exists, so we report inventory potential.
  const qtyOf = (p: { stockQuantity?: number }) => p.stockQuantity ?? 0;
  const inventoryValue = store.products.reduce((s, p) => s + p.price * qtyOf(p), 0);
  const inventoryCost = store.products.reduce((s, p) => s + (p.buyingPrice ?? 0) * qtyOf(p), 0);
  const projectedProfit = inventoryValue - inventoryCost;

  const totalEarned = cpdEarned; // only confirmed cash so far

  // Revenue-by-source comparison (verified CPD vs projected product profit).
  const sources = [
    { label: 'CPD Enrollments (earned)', value: cpdEarned, color: 'bg-emerald-600' },
    { label: 'Product Profit (projected)', value: projectedProfit, color: 'bg-amber-500' },
  ];
  const maxSource = Math.max(1, ...sources.map((s) => s.value));

  const kpis = [
    { label: 'Confirmed Earnings', value: ksh(totalEarned), hint: 'Verified CPD payments', icon: Wallet, accent: 'text-emerald-700 bg-emerald-50' },
    { label: 'Pending CPD', value: ksh(cpdPending), hint: 'Awaiting verification', icon: ClipboardCheck, accent: 'text-amber-700 bg-amber-50' },
    { label: 'Inventory Value', value: ksh(inventoryValue), hint: 'Stock × selling price', icon: Boxes, accent: 'text-emerald-700 bg-emerald-50' },
    { label: 'Projected Profit', value: ksh(projectedProfit), hint: 'If all stock sells', icon: TrendingUp, accent: 'text-emerald-700 bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-emerald-950">Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Earnings and value across the storefront and academy portals.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-xl font-bold text-emerald-950">{k.value}</div>
              <div className="text-xs font-semibold text-slate-600">{k.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{k.hint}</div>
            </div>
          );
        })}
      </div>

      {/* Revenue by source */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-bold text-emerald-950">Revenue by Source</h3>
        <div className="space-y-3">
          {sources.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">{s.label}</span>
                <span className="font-bold text-emerald-950">{ksh(s.value)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${Math.max(2, (s.value / maxSource) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-950">
            <Package className="w-4 h-4" />
            <h3 className="text-sm font-bold">Product Sales</h3>
          </div>
          <Row label="Products in catalog" value={String(store.products.length)} />
          <Row label="Total units in stock" value={String(store.products.reduce((s, p) => s + qtyOf(p), 0))} />
          <Row label="Inventory value" value={ksh(inventoryValue)} />
          <Row label="Inventory cost" value={ksh(inventoryCost)} />
          <Row label="Projected profit" value={ksh(projectedProfit)} strong />
          <p className="text-[11px] text-slate-400 pt-1">
            Figures are based on current stock. Actual sales totals will appear once orders are connected to the database.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-950">
            <ClipboardCheck className="w-4 h-4" />
            <h3 className="text-sm font-bold">CPD Enrollments</h3>
          </div>
          <Row label="Total bookings" value={String(enrollments.length)} />
          <Row label="Verified bookings" value={String(enrollments.filter((e) => e.verified).length)} />
          <Row label="Pending bookings" value={String(enrollments.filter((e) => !e.verified).length)} />
          <Row label="Pending revenue" value={ksh(cpdPending)} />
          <Row label="Earned (verified)" value={ksh(cpdEarned)} strong />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={strong ? 'font-bold text-emerald-700' : 'font-semibold text-emerald-950'}>{value}</span>
    </div>
  );
}
