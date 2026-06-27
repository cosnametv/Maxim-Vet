import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import {
  Product,
  BlogPost,
  FAQItem,
  CPDModule,
  Workshop,
  EnrollmentRecord,
  LessonSetting,
} from '../types';
import {
  PRODUCTS,
  BLOGS,
  FAQS,
  DEFAULT_CPD_MODULES,
  DEFAULT_WORKSHOPS,
} from '../data';
import { AcademyCategory, DEFAULT_ACADEMY_CATEGORIES } from '../academyData';

const STORAGE_KEY = 'mv-content-v1';

export interface ContentState {
  products: Product[];
  blogs: BlogPost[];
  faqs: FAQItem[];
  cpdModules: CPDModule[];
  workshops: Workshop[];
  academyCategories: AcademyCategory[];
  lessonSettings: Record<string, LessonSetting>;
  enrollments: Record<string, EnrollmentRecord>;
}

// Deep clone so default content is never mutated by edits.
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const defaultState = (): ContentState => ({
  products: clone(PRODUCTS),
  blogs: clone(BLOGS),
  faqs: clone(FAQS),
  cpdModules: clone(DEFAULT_CPD_MODULES),
  workshops: clone(DEFAULT_WORKSHOPS),
  academyCategories: clone(DEFAULT_ACADEMY_CATEGORIES),
  lessonSettings: {},
  enrollments: {},
});

function loadState(): ContentState {
  const base = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<ContentState>;
    // Merge so newly added default slices still appear for existing users.
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

interface ContentContextValue extends ContentState {
  setProducts: (next: Product[]) => void;
  setBlogs: (next: BlogPost[]) => void;
  setFaqs: (next: FAQItem[]) => void;
  setCpdModules: (next: CPDModule[]) => void;
  setWorkshops: (next: Workshop[]) => void;
  setAcademyCategories: (next: AcademyCategory[]) => void;
  setLessonSettings: (next: Record<string, LessonSetting>) => void;
  setEnrollments: (
    next:
      | Record<string, EnrollmentRecord>
      | ((prev: Record<string, EnrollmentRecord>) => Record<string, EnrollmentRecord>)
  ) => void;
  resetAll: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>(loadState);
  const isFirst = useRef(true);

  // Persist on every change (skip the very first render).
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    try {
      const serialized = JSON.stringify(state);
      // Avoid redundant writes (also prevents a cross-tab sync echo loop).
      if (localStorage.getItem(STORAGE_KEY) !== serialized) {
        localStorage.setItem(STORAGE_KEY, serialized);
      }
    } catch {
      /* storage full / unavailable — ignore */
    }
  }, [state]);

  // Keep other open tabs (e.g. the public site while editing in the admin) in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        setState({ ...defaultState(), ...(JSON.parse(e.newValue) as Partial<ContentState>) });
      } catch {
        /* ignore malformed payloads */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const patch = <K extends keyof ContentState>(key: K, value: ContentState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const value: ContentContextValue = {
    ...state,
    setProducts: (next) => patch('products', next),
    setBlogs: (next) => patch('blogs', next),
    setFaqs: (next) => patch('faqs', next),
    setCpdModules: (next) => patch('cpdModules', next),
    setWorkshops: (next) => patch('workshops', next),
    setAcademyCategories: (next) => patch('academyCategories', next),
    setLessonSettings: (next) => patch('lessonSettings', next),
    setEnrollments: (next) =>
      setState((prev) => ({
        ...prev,
        enrollments:
          typeof next === 'function'
            ? (next as (p: Record<string, EnrollmentRecord>) => Record<string, EnrollmentRecord>)(
                prev.enrollments
              )
            : next,
      })),
    resetAll: () => {
      const fresh = defaultState();
      setState(fresh);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      } catch {
        /* ignore */
      }
    },
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
}
