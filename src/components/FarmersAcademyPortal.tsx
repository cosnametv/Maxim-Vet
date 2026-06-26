import { useState, useEffect, FormEvent } from 'react';
import { 
  Sprout, Award, HelpCircle, ArrowLeft, BookOpen, Calculator, Calendar, 
  MapPin, CheckCircle, Wheat, ShoppingBag, Leaf, PhoneCall,
  Home, Bird, Milk, PawPrint, PlayCircle, Clock, ChevronRight, LogOut,
  Lock, ShieldCheck, Smartphone, Video, FileText, Loader2, Trophy
} from 'lucide-react';
import PasswordInput from './PasswordInput';
import LessonVideoPlayer from './LessonVideoPlayer';
import CertificateModal from './CertificateModal';
import { KENYA_COUNTIES } from '../data';

interface AcademyLesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  content: string[];
  price?: number;     // 0 = free; omit to use default (paid)
  videoUrl?: string;  // admin-provided YouTube link
}

// Default sample video (admin replaces per lesson via `videoUrl`)
const SAMPLE_VIDEO_URL = 'https://www.youtube.com/watch?v=u8XOGg1pch0';
const PAID_LESSON_PRICE = 200;

// Intro lessons are free; everything else is paid by default. Admin can
// override per lesson by setting an explicit `price`.
const getLessonPrice = (l: AcademyLesson) =>
  l.price ?? (l.id.endsWith('-intro') ? 0 : PAID_LESSON_PRICE);
const getLessonVideoUrl = (l: AcademyLesson) => l.videoUrl ?? SAMPLE_VIDEO_URL;

interface AcademyCategory {
  id: string;
  title: string;
  icon: typeof Home;
  blurb: string;
  lessons: AcademyLesson[];
}

const ACADEMY_CATEGORIES: AcademyCategory[] = [
  {
    id: 'poultry',
    title: 'Hens & Chicks',
    icon: Bird,
    blurb: 'Raise healthy poultry from day-old chicks to productive layers and broilers.',
    lessons: [
      {
        id: 'poultry-intro',
        title: 'Introduction to Poultry Keeping',
        duration: '6 min read',
        summary: 'Understand the basics of starting a profitable poultry unit.',
        content: [
          'Poultry keeping is one of the fastest ways for smallholder farmers to earn a steady income from eggs and meat. Before buying birds, decide whether you want layers (for eggs), broilers (for meat), or dual-purpose breeds such as Kienyeji improved kuku.',
          'Start small with a number of birds you can comfortably feed and house. Source day-old chicks from certified hatcheries only, and ensure you have a clean, warm brooder ready before the chicks arrive.',
        ],
      },
      {
        id: 'poultry-brooding',
        title: 'Brooding & Chick Care',
        duration: '7 min read',
        summary: 'Keep chicks warm, fed, and disease-free in the first weeks.',
        content: [
          'Chicks cannot regulate their own body temperature for the first 3-4 weeks, so provide a brooder at about 32-35°C in week one, reducing by roughly 3°C each week. Watch the chicks: if they huddle under the heat source they are cold, if they move to the edges they are too hot.',
          'Provide clean water with a vitamin/glucose supplement on arrival, followed by chick starter mash. Keep litter dry and vaccinate against Marek’s, Gumboro, and Newcastle disease on schedule.',
        ],
      },
      {
        id: 'poultry-feeding',
        title: 'Feeding & Nutrition',
        duration: '5 min read',
        summary: 'Match feed type and quantity to each growth stage.',
        content: [
          'Feed chick starter (high protein) for the first 8 weeks, then growers mash, and finally layers mash once birds begin laying at around 18-20 weeks. Broilers stay on starter then finisher rations for fast weight gain.',
          'Always provide clean water and add calcium (such as crushed limestone or oyster shell) for strong egg shells. Avoid sudden feed changes, which stress birds and reduce production.',
        ],
      },
      {
        id: 'poultry-health',
        title: 'Disease Control & Vaccination',
        duration: '6 min read',
        summary: 'Prevent the diseases that wipe out flocks.',
        content: [
          'Newcastle disease is the biggest killer of village chickens — vaccinate routinely. Practice strict biosecurity: limit visitors, disinfect footwear, and isolate new or sick birds.',
          'Watch for warning signs such as drooping wings, greenish droppings, coughing, or sudden deaths, and consult a vet early. Deworm regularly and control external parasites like mites and lice.',
        ],
      },
    ],
  },
  {
    id: 'housing',
    title: 'Housing',
    icon: Home,
    blurb: 'Design clean, well-ventilated structures that protect livestock and boost output.',
    lessons: [
      {
        id: 'housing-intro',
        title: 'Introduction to Animal Housing',
        duration: '5 min read',
        summary: 'Why good housing is the foundation of healthy livestock.',
        content: [
          'Good housing protects animals from harsh weather, predators, and disease while making feeding and cleaning easier. A well-designed structure improves comfort, which directly increases milk, egg, and meat production.',
          'Always build on well-drained ground, orient the building to capture morning sun, and allow enough space per animal to avoid overcrowding and stress.',
        ],
      },
      {
        id: 'housing-poultry',
        title: 'Poultry House Design',
        duration: '6 min read',
        summary: 'Build a secure, airy chicken house.',
        content: [
          'A good poultry house is dry, well-ventilated, and predator-proof. Allow about 1 square metre for every 3-4 adult birds, and raise the floor or use deep litter to keep it dry.',
          'Include nesting boxes for layers, perches for roosting, and wire mesh for airflow while keeping out wild birds and rodents that spread disease.',
        ],
      },
      {
        id: 'housing-cattle',
        title: 'Cattle Sheds & Zero-Grazing Units',
        duration: '7 min read',
        summary: 'Set up a practical zero-grazing dairy unit.',
        content: [
          'A zero-grazing unit keeps dairy cows in one place where feed and water are brought to them. It should have a feeding trough, a resting cubicle with soft bedding, a milking area, and a sloped concrete floor for easy cleaning.',
          'Good drainage and a slurry channel keep the unit hygienic and reduce mastitis and hoof problems. Provide shade and constant clean water to maintain high milk yields.',
        ],
      },
    ],
  },
  {
    id: 'cattle',
    title: 'Cattle',
    icon: Milk,
    blurb: 'Manage dairy and beef cattle for higher milk yields and healthy herds.',
    lessons: [
      {
        id: 'cattle-intro',
        title: 'Introduction to Cattle Farming',
        duration: '6 min read',
        summary: 'Choose between dairy, beef, and dual-purpose systems.',
        content: [
          'Cattle farming can focus on milk (dairy), meat (beef), or both. Your choice depends on your land, capital, market, and climate. Dairy breeds like Friesian and Ayrshire suit high-rainfall areas, while hardy breeds like Boran do well in drier regions.',
          'Begin with a few quality animals rather than many poor ones. Healthy, well-fed cattle from good genetics will always outperform a large, poorly managed herd.',
        ],
      },
      {
        id: 'cattle-feeding',
        title: 'Feeding & Pasture Management',
        duration: '7 min read',
        summary: 'Feed for maximum milk and weight gain.',
        content: [
          'A dairy cow needs energy, protein, minerals, and plenty of clean water. Grow quality fodder such as Napier grass, lucerne, and desmodium, and conserve excess as silage or hay for the dry season.',
          'Supplement with dairy meal during milking and provide mineral licks. Sudden feed shortages cause sharp drops in milk, so plan feed budgets ahead of each season.',
        ],
      },
      {
        id: 'cattle-milk',
        title: 'Milk Production & Hygiene',
        duration: '5 min read',
        summary: 'Produce clean, high-quality milk buyers trust.',
        content: [
          'Milk at consistent times each day, wash your hands and the udder before milking, and use clean, food-grade containers. Practice full milking to prevent mastitis and maintain yield.',
          'Cool milk quickly and deliver it fast to keep quality high. Test regularly for mastitis using a strip cup or California Mastitis Test and treat affected cows promptly.',
        ],
      },
      {
        id: 'cattle-health',
        title: 'Common Diseases & Treatment',
        duration: '6 min read',
        summary: 'Spot and prevent the major cattle diseases.',
        content: [
          'Control ticks through regular spraying or dipping to prevent East Coast Fever, anaplasmosis, and other tick-borne diseases. Vaccinate against Foot and Mouth Disease, Lumpy Skin Disease, and Anthrax as advised by your vet.',
          'Deworm routinely and watch for signs like loss of appetite, reduced milk, lameness, or diarrhoea. Call a licensed veterinary officer early rather than waiting for the condition to worsen.',
        ],
      },
    ],
  },
  {
    id: 'shoats',
    title: 'Sheep & Goats',
    icon: PawPrint,
    blurb: 'Keep productive sheep and goats (shoats) for milk, meat, and quick income.',
    lessons: [
      {
        id: 'shoats-intro',
        title: 'Introduction to Sheep & Goats',
        duration: '5 min read',
        summary: 'Why shoats are ideal for smallholder farmers.',
        content: [
          'Sheep and goats — often called shoats — are affordable, reproduce quickly, and thrive on small pieces of land. Goats can be kept for milk (e.g. dairy breeds like Saanen and Toggenburg) or meat (e.g. Galla), while sheep are mainly kept for meat and wool.',
          'They are a great entry point into livestock farming because they need less feed and capital than cattle while still giving steady returns.',
        ],
      },
      {
        id: 'shoats-housing',
        title: 'Breeds, Housing & Selection',
        duration: '6 min read',
        summary: 'Pick the right breed and shelter your shoats well.',
        content: [
          'Choose breeds based on your goal and climate. Provide a raised, slatted-floor house that stays dry and protects animals from cold, rain, and predators.',
          'Select breeding stock that is healthy, well-formed, and from productive lines. Avoid inbreeding by rotating or sourcing unrelated bucks and rams.',
        ],
      },
      {
        id: 'shoats-feeding',
        title: 'Feeding & Grazing',
        duration: '5 min read',
        summary: 'Balance grazing with supplementary feed.',
        content: [
          'Shoats are browsers and grazers — they enjoy shrubs, leaves, and pasture. Supplement with hay, crop residues, and mineral licks, especially during the dry season and for pregnant or lactating animals.',
          'Always provide clean water. Rotate grazing areas to reduce worm build-up and maintain good pasture.',
        ],
      },
      {
        id: 'shoats-health',
        title: 'Health, Deworming & Breeding',
        duration: '6 min read',
        summary: 'Keep shoats healthy and breeding well.',
        content: [
          'Internal worms are the biggest health challenge for shoats, so deworm regularly and practice pasture rotation. Vaccinate against diseases such as PPR (goat plague) and CCPP as advised by your vet, and control external parasites.',
          'A doe or ewe can produce young twice a year with good management. Keep breeding records, provide extra feed during pregnancy, and ensure newborns get colostrum within the first hours of life.',
        ],
      },
    ],
  },
];

interface FarmersAcademyPortalProps {
  onBack: () => void;
  onBuyAgrochemicals?: () => void; // Option to trigger going to the shop
}

export default function FarmersAcademyPortal({ onBack, onBuyAgrochemicals }: FarmersAcademyPortalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [membershipId, setMembershipId] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('Nakuru County');
  const [loginError, setLoginError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<'planting' | 'calculator' | 'workshops'>('planting');

  // Academy learning states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const activeCategory = ACADEMY_CATEGORIES.find((c) => c.id === selectedCategoryId) ?? null;
  const activeLesson = activeCategory?.lessons.find((l) => l.id === selectedLessonId) ?? null;
  const ActiveCategoryIcon = activeCategory?.icon ?? Home;

  // Lesson completion + certificates (persisted per member)
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [certificateCategoryId, setCertificateCategoryId] = useState<string | null>(null);

  const progressStorageKey = `mv-academy-progress::${membershipId || 'guest'}`;

  // Load saved completion whenever a member signs in.
  useEffect(() => {
    if (!isLoggedIn) return;
    try {
      const raw = localStorage.getItem(`mv-academy-progress::${membershipId || 'guest'}`);
      setCompletedLessons(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setCompletedLessons([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, membershipId]);

  const isLessonComplete = (lessonId: string) => completedLessons.includes(lessonId);

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      try {
        localStorage.setItem(progressStorageKey, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  const categoryCompletion = (cat: AcademyCategory) => {
    const done = cat.lessons.filter((l) => completedLessons.includes(l.id)).length;
    return { done, total: cat.lessons.length, complete: done === cat.lessons.length };
  };

  // Paid-lesson unlocking (simulated M-Pesa)
  const [unlockedLessons, setUnlockedLessons] = useState<string[]>([]);
  const [payingLessonId, setPayingLessonId] = useState<string | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState('');

  const isLessonUnlocked = (l: AcademyLesson) =>
    getLessonPrice(l) === 0 || unlockedLessons.includes(l.id);

  const handlePayForLesson = (e: FormEvent, lessonId: string) => {
    e.preventDefault();
    setPayingLessonId(lessonId);
    // Simulate an M-Pesa STK push confirmation
    setTimeout(() => {
      setUnlockedLessons((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
      setPayingLessonId(null);
      setMpesaPhone('');
    }, 1800);
  };

  // Content protection: deter screenshots, screen recording and downloads
  // while a lesson is open. (Browsers cannot fully block OS-level capture,
  // but these measures remove the easy paths and blur content when hidden.)
  const [contentObscured, setContentObscured] = useState(false);
  const [captureBlocked, setCaptureBlocked] = useState(false);

  useEffect(() => {
    if (!activeLesson) return;

    const triggerBlackout = () => {
      navigator.clipboard?.writeText('').catch(() => {});
      setCaptureBlocked(true);
      window.setTimeout(() => setCaptureBlocked(false), 2000);
    };

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // PrintScreen (fires on keydown or keyup depending on OS)
      if (e.key === 'PrintScreen') {
        triggerBlackout();
      }
      // Block Save (Ctrl/Cmd+S), Print (Ctrl/Cmd+P), Win/Cmd+Shift+S snip
      if ((e.ctrlKey || e.metaKey) && (key === 's' || key === 'p')) {
        e.preventDefault();
        triggerBlackout();
      }
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && key === 's') {
        e.preventDefault();
        triggerBlackout();
      }
    };
    const onVisibility = () => setContentObscured(document.hidden);
    const onBlur = () => {
      // Focus moving INTO our own video iframe is normal playback, not a tab
      // switch — pull focus back instead of blacking out the lesson.
      if (document.activeElement?.tagName === 'IFRAME') {
        window.focus();
        return;
      }
      setContentObscured(true);
    };
    const onFocus = () => setContentObscured(false);

    document.addEventListener('keydown', onKey);
    document.addEventListener('keyup', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('keyup', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [activeLesson]);

  const displayName = fullName.trim() || 'Farmer';

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setSelectedCategoryId(null);
    setSelectedLessonId(null);
    setUnlockedLessons([]);
    setCompletedLessons([]);
    setCertificateCategoryId(null);
    setMembershipId('');
    setPhone('');
    setLoginError('');
  };
  
  // Fertilizer Calculator states
  const [cropType, setCropType] = useState<'maize' | 'potatoes' | 'coffee' | 'tomatoes'>('maize');
  const [acreage, setAcreage] = useState(2); // acres
  
  // Workshops list
  const WORKSHOPS = [
    {
      id: 'ws-1',
      title: 'Maximizing Maize Yield with Certified NPK and Selective Boosters',
      county: 'Nakuru County',
      venue: 'Nakuru Town Agricultural Hall',
      date: 'July 05, 2026',
      time: '9:00 AM - 1:00 PM',
      agronomist: 'Dr. Julius Rotich, Senior Crop Protection Lead'
    },
    {
      id: 'ws-2',
      title: 'Clinical Tick Control & Vaccine Calendars for Smallholder Dairy Cows',
      county: 'Kiambu County',
      venue: 'Githunguri Cooperative Grounds',
      date: 'July 12, 2026',
      time: '10:00 AM - 3:00 PM',
      agronomist: 'Dr. Evelyn Wanjiku, Licensed Vet Practitioner'
    },
    {
      id: 'ws-3',
      title: 'Eco-Friendly Biological Soil Fungicides & Seed Treatment Pathways',
      county: 'Nairobi County',
      venue: 'Industrial Area Training Hub',
      date: 'July 18, 2026',
      time: '2:00 PM - 5:00 PM',
      agronomist: 'Agnes Mwelu, Senior Agronomist'
    }
  ];

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!membershipId.trim()) {
      setLoginError('Please enter your mobile phone number or email.');
      return;
    }
    if (!phone.trim()) {
      setLoginError('Please enter your password.');
      return;
    }
    setLoginError('');
    setIsLoggedIn(true);
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setLoginError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setLoginError('Please enter your mobile phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setLoginError('Password must be at least 4 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLoginError('Passwords do not match.');
      return;
    }
    
    // Auto-generate cooperative membership ID for login
    const generatedId = `M-${Math.floor(10000 + Math.random() * 90000)}`;
    setMembershipId(generatedId);
    
    setLoginError('');
    setSuccessInfo(`Registration successful for ${fullName}! Your assigned Academy ID is ${generatedId}. Please use it to Sign In.`);
    setIsRegistering(false);
    setTimeout(() => {
      setSuccessInfo('');
    }, 10000);
  };

  // Fertilizer calculator helper values
  const getNutritionAdvice = () => {
    switch (cropType) {
      case 'maize':
        return {
          dap: acreage * 1, // 1 bag per acre
          npk: acreage * 1.5, // 1.5 bags per acre
          can: acreage * 1,
          tips: 'Apply DAP at the exact time of planting near seed rows (but not touching). Top-dress with CAN fertilizer when maize reaches knee height (approx. 5-6 weeks).'
        };
      case 'potatoes':
        return {
          dap: acreage * 1.5,
          npk: acreage * 2,
          can: acreage * 0.5,
          tips: 'Potatoes are heavy potassium and nitrogen consumers. Use premium certified high-potash NPK compound lines at earthing-up to maximize tuber counts.'
        };
      case 'coffee':
        return {
          dap: acreage * 0.5,
          npk: acreage * 2.5,
          can: acreage * 1.5,
          tips: 'Incorporate certified organic compost along with balanced NPK blends during the early rain shower cycle. Spray approved biological crop boosters to prevent Coffee Berry Disease.'
        };
      case 'tomatoes':
        return {
          dap: acreage * 1,
          npk: acreage * 1.5,
          can: acreage * 1,
          tips: 'Use certified phosphorus-rich fertilizer initially for sturdy roots. Apply secondary calcium-rich foliar sprays weekly to prevent blossom-end rot.'
        };
    }
  };

  const advice = getNutritionAdvice();

  const isViewingProtected = !!activeLesson && isLessonUnlocked(activeLesson);

  return (
    <div className="min-h-screen bg-emerald-50/40 text-slate-900 font-sans flex flex-col">
      {/* Full-screen capture guard: paints solid black over everything the
          instant a screenshot/recording is attempted or the window is hidden. */}
      {isViewingProtected && (contentObscured || captureBlocked) && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center px-6 select-none">
          <ShieldCheck className="w-10 h-10 text-emerald-500 mb-3" />
          <p className="text-base font-bold text-white">Protected content</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Screenshots and screen recording are disabled for academy lessons.
            Return focus to this window to continue watching.
          </p>
        </div>
      )}

      {/* Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            id="farmers-portal-back-btn"
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-bold text-emerald-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing Page</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-serif font-black text-base">
              M
            </div>
            <span className="font-serif text-sm font-bold tracking-tight">Farmers Academy</span>
          </div>
        </div>
      </header>

      {!isLoggedIn ? (
        /* LOGIN / REGISTRATION SCREEN */
        <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-24">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-800">
                <Sprout className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                {isRegistering ? 'Register Farmer Account' : 'Farmers Academy Portal'}
              </h1>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                {isRegistering
                  ? 'Join the academy circle to access certified planting calendars, workshops, and soil health calculators.'
                  : 'Access certified planting schedules, county workshop details, and local fertilizer calculations customized for Kenyan smallholders.'}
              </p>
            </div>

            {successInfo && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successInfo}</span>
              </div>
            )}

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                {loginError}
              </div>
            )}

            {isRegistering ? (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Full Name
                  </label>
                  <input 
                    id="farmer-register-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Kamau"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mobile Phone Number
                  </label>
                  <input 
                    id="farmer-register-phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0722XXXXXX"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Email Address
                  </label>
                  <input 
                    id="farmer-register-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john.kamau@example.com"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Farming County
                  </label>
                  <select
                    id="farmer-register-county"
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-800"
                  >
                    {KENYA_COUNTIES.map(co => (
                      <option key={co} value={co}>{co}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Password
                    </label>
                    <PasswordInput
                      id="farmer-register-pass"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Confirm Password
                    </label>
                    <PasswordInput
                      id="farmer-register-confirm-pass"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                    />
                  </div>
                </div>

                <button
                  id="farmer-register-submit"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer shadow-md"
                >
                  Create Farmers Academy Account
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setLoginError('');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Already registered? Sign in here
                  </button>
                </div>
              </form>
            ) : (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mobile Phone Number or Email
                  </label>
                  <input 
                    id="farmer-login-id"
                    type="text"
                    value={membershipId}
                    onChange={(e) => setMembershipId(e.target.value)}
                    placeholder="e.g. 0722XXXXXX or you@email.com"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password
                  </label>
                  <PasswordInput
                    id="farmer-login-password"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <button
                  id="farmer-login-submit"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer shadow-md"
                >
                  Sign In to Farmers Academy
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setLoginError('');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Don't have an academy account? Register here
                  </button>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-[10px] text-slate-500">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free Academy Access for Registered Cooperatives</span>
            </div>
          </div>
        </div>
      ) : (
        /* DASHBOARD SCREEN */
        <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
          {/* Dashboard Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                <Leaf className="w-3 h-3 text-emerald-300" />
                <span>Smallholder Member</span>
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold tracking-tight">
                Welcome Back, {displayName}
              </h2>
              <p className="text-xs text-emerald-100/80">
                Cooperative ID: <span className="font-mono text-emerald-300 font-bold">{(membershipId || 'MV-FARMER').toUpperCase()}</span> | Verified Nairobi Agronomy Circle
              </p>
            </div>
            
            <button
              id="farmer-sign-out"
              onClick={handleSignOut}
              className="inline-flex items-center space-x-2 bg-emerald-900/60 hover:bg-emerald-900 px-4 py-2.5 rounded-2xl border border-emerald-800 text-xs font-bold text-emerald-100 hover:text-white transition cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4 text-emerald-300" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* ACADEMY LEARNING CONTENT */}
          {activeLesson && activeCategory ? (
            /* LESSON DETAIL */
            <div className="max-w-3xl mx-auto space-y-6">
              <button
                onClick={() => setSelectedLessonId(null)}
                className="group inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 hover:text-emerald-600 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to {activeCategory.title} lessons</span>
              </button>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <ActiveCategoryIcon className="w-3 h-3" />
                      <span>{activeCategory.title}</span>
                    </span>
                    {getLessonPrice(activeLesson) === 0 ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Free</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>Paid · Ksh {getLessonPrice(activeLesson)}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 leading-snug">{activeLesson.title}</h3>
                  <p className="inline-flex items-center space-x-1 text-[11px] text-slate-500 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{activeLesson.duration}</span>
                  </p>
                </div>

                {isLessonUnlocked(activeLesson) ? (
                  /* PROTECTED CONTENT: video + notes */
                  <div
                    onContextMenu={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    className="protected-lesson relative border-t border-slate-100 pt-5 space-y-5 select-none"
                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                  >
                    <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Protected lesson — screenshots, screen recording and downloads are disabled.</span>
                    </div>

                    {/* Video */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                        <Video className="w-4 h-4 text-emerald-700" />
                        <span>Lesson Video</span>
                      </div>
                      <LessonVideoPlayer
                        video={getLessonVideoUrl(activeLesson)}
                        storageKey={`mv-academy::${membershipId || 'guest'}::${activeLesson.id}`}
                        onEnded={() => markLessonComplete(activeLesson.id)}
                      />
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        <span>Lesson Notes</span>
                      </div>
                      {activeLesson.content.map((para, i) => (
                        <p key={i} className="text-sm text-slate-700 leading-relaxed">{para}</p>
                      ))}
                    </div>

                    {/* Obscure overlay when the tab/window is hidden (deters recording) */}
                    {contentObscured && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center bg-emerald-950/70 backdrop-blur-xl rounded-2xl p-6 space-y-2">
                        <Lock className="w-7 h-7 text-emerald-200" />
                        <p className="text-sm font-bold text-white">Content hidden</p>
                        <p className="text-[11px] text-emerald-100/80 max-w-xs">Return focus to this window to continue. Protected content is hidden while the tab is inactive.</p>
                      </div>
                    )}

                    {/* Flash overlay when a screenshot key is pressed */}
                    {captureBlocked && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center bg-slate-900 rounded-2xl p-6 space-y-2">
                        <ShieldCheck className="w-8 h-8 text-amber-400" />
                        <p className="text-sm font-bold text-white">Screenshots are disabled</p>
                        <p className="text-[11px] text-slate-300">This lesson is protected content.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* PAYWALL */
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <p className="text-sm text-slate-700 leading-relaxed">{activeLesson.summary}</p>

                    <form
                      onSubmit={(e) => handlePayForLesson(e, activeLesson.id)}
                      className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-900">Premium Lesson</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Unlock to watch the video and read the full notes. One-time payment of{' '}
                            <strong className="text-emerald-800">Ksh {getLessonPrice(activeLesson)}</strong> via M-Pesa.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="mpesa-phone" className="text-[11px] font-bold text-slate-700 block">
                          M-Pesa Mobile Number
                        </label>
                        <input
                          id="mpesa-phone"
                          type="tel"
                          required
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value)}
                          placeholder="e.g. 0722XXXXXX"
                          className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={payingLessonId === activeLesson.id}
                        className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-70 text-white rounded-xl font-bold transition flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-wait"
                      >
                        {payingLessonId === activeLesson.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Confirm the STK push on your phone…</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-4 h-4" />
                            <span>Pay Ksh {getLessonPrice(activeLesson)} with M-Pesa</span>
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-slate-400 text-center">Secure payment · You will receive an M-Pesa prompt to enter your PIN.</p>
                    </form>
                  </div>
                )}

                {isLessonUnlocked(activeLesson) && (
                  <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {isLessonComplete(activeLesson.id) ? (
                      <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Lesson completed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => markLessonComplete(activeLesson.id)}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 rounded-xl transition cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark as Complete</span>
                      </button>
                    )}

                    {(() => {
                      const idx = activeCategory.lessons.findIndex((l) => l.id === activeLesson.id);
                      const next = activeCategory.lessons[idx + 1];
                      return next ? (
                        <button
                          onClick={() => setSelectedLessonId(next.id)}
                          className="group inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-600 transition cursor-pointer"
                        >
                          <span>Next: {next.title}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Certificate CTA when the whole category is complete */}
              {categoryCompletion(activeCategory).complete && (
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-7 h-7 text-amber-300 shrink-0" />
                    <div>
                      <p className="font-serif text-base font-bold">Category complete!</p>
                      <p className="text-xs text-emerald-100/80">
                        You've finished all {activeCategory.lessons.length} lessons in {activeCategory.title}.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCertificateCategoryId(activeCategory.id)}
                    className="inline-flex items-center justify-center space-x-1.5 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
                  >
                    <Award className="w-4 h-4" />
                    <span>Get Certificate</span>
                  </button>
                </div>
              )}

              {/* Lesson quick-switch within category */}
              <div className="flex flex-wrap gap-2.5">
                {activeCategory.lessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLessonId(l.id)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-full border transition cursor-pointer ${
                      l.id === activeLesson.id
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-800'
                    }`}
                  >
                    {l.title}
                  </button>
                ))}
              </div>
            </div>
          ) : activeCategory ? (
            /* LESSONS LIST */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="group inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 hover:text-emerald-600 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Categories</span>
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shrink-0">
                  <ActiveCategoryIcon className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-serif text-xl font-bold text-slate-900">{activeCategory.title}</h3>
                  <p className="text-xs text-slate-600">{activeCategory.blurb}</p>
                </div>
              </div>

              {/* Progress + certificate */}
              {(() => {
                const { done, total, complete } = categoryCompletion(activeCategory);
                const pct = total ? Math.round((done / total) * 100) : 0;
                return (
                  <div className={`rounded-2xl border p-4 space-y-3 ${complete ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">Your progress</span>
                      <span className="text-emerald-700">{done}/{total} lessons · {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200/70 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {complete && (
                      <button
                        onClick={() => setCertificateCategoryId(activeCategory.id)}
                        className="inline-flex items-center justify-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Get Your Certificate</span>
                      </button>
                    )}
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCategory.lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className="group bg-white rounded-2xl border border-slate-200 p-5 text-left flex items-start space-x-4 hover:border-emerald-600/40 hover:shadow-md transition cursor-pointer"
                  >
                    <span className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${isLessonComplete(lesson.id) ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                      {isLessonComplete(lesson.id) ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">{lesson.title}</h4>
                        {getLessonPrice(lesson) === 0 ? (
                          <span className="inline-flex items-center space-x-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                            <span>Free</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Ksh {getLessonPrice(lesson)}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{lesson.summary}</p>
                      <span className="inline-flex items-center space-x-2 text-[10px] font-bold pt-1">
                        <span className="inline-flex items-center space-x-1 text-emerald-700">
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Video</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 text-slate-500">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Notes</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                        </span>
                      </span>
                    </div>
                    {isLessonComplete(lesson.id) ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    ) : getLessonPrice(lesson) === 0 || isLessonUnlocked(lesson) ? (
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition shrink-0 mt-1" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-500/70 group-hover:text-amber-600 transition shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* CATEGORIES GRID */
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-slate-900">Learning Categories</h3>
                <p className="text-xs text-slate-600">Choose a topic to access free, practical lessons curated for Kenyan smallholder farmers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ACADEMY_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const prog = categoryCompletion(cat);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategoryId(cat.id); setSelectedLessonId(null); }}
                      className="group relative bg-white rounded-3xl border border-slate-200 p-6 text-left flex flex-col h-full hover:border-emerald-600/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      {prog.complete && (
                        <span className="absolute top-4 right-4 inline-flex items-center space-x-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                          <Trophy className="w-3 h-3" />
                          <span>Certified</span>
                        </span>
                      )}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h4 className="font-serif text-lg font-bold text-slate-900 mt-5">{cat.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2 flex-1">{cat.blurb}</p>
                      {prog.done > 0 && !prog.complete && (
                        <div className="mt-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${Math.round((prog.done / prog.total) * 100)}%` }}
                          />
                        </div>
                      )}
                      <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 mt-5">
                        <BookOpen className="w-4 h-4" />
                        <span>{prog.done > 0 ? `${prog.done}/${cat.lessons.length} Lessons` : `${cat.lessons.length} Lessons`}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      )}

      {/* Certificate */}
      {certificateCategoryId && (() => {
        const cat = ACADEMY_CATEGORIES.find((c) => c.id === certificateCategoryId);
        if (!cat) return null;
        return (
          <CertificateModal
            recipientName={displayName === 'Farmer' ? (membershipId || 'Academy Member') : displayName}
            categoryTitle={cat.title}
            lessonCount={cat.lessons.length}
            dateIssued={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            certificateId={`MV-${cat.id.toUpperCase().slice(0, 4)}-${(membershipId || 'GUEST').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-6) || 'MEMBER'}`}
            onClose={() => setCertificateCategoryId(null)}
          />
        );
      })()}

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="container mx-auto px-6">
          <p>© 2026 Maxim Vet Kenya.</p>
        </div>
      </footer>
    </div>
  );
}
