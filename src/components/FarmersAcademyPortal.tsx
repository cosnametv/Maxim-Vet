import { useState, FormEvent } from 'react';
import { 
  Sprout, Award, HelpCircle, ArrowLeft, BookOpen, Calculator, Calendar, 
  MapPin, CheckCircle, Wheat, ShoppingBag, Leaf, PhoneCall
} from 'lucide-react';

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
  const [selectedCounty, setSelectedCounty] = useState('Nakuru County');
  const [loginError, setLoginError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<'planting' | 'calculator' | 'workshops'>('planting');
  
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
      setLoginError('Please enter a valid cooperative membership ID or National ID.');
      return;
    }
    if (!phone.trim()) {
      setLoginError('Please enter your mobile phone number for verification.');
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

  return (
    <div className="min-h-screen bg-emerald-50/40 text-slate-900 font-sans flex flex-col">
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
                    {['Nakuru County', 'Kiambu County', 'Nairobi County', 'Meru County', 'Nyeri County'].map(co => (
                      <option key={co} value={co}>{co}</option>
                    ))}
                  </select>
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
                    Membership ID / National ID
                  </label>
                  <input 
                    id="farmer-login-id"
                    type="text"
                    value={membershipId}
                    onChange={(e) => setMembershipId(e.target.value)}
                    placeholder="e.g. M-10254 or ID Number"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mobile Phone Number
                  </label>
                  <input 
                    id="farmer-login-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0722XXXXXX"
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
                Habari Farmer, Welcome Back
              </h2>
              <p className="text-xs text-emerald-100/80">
                Cooperative ID: <span className="font-mono text-emerald-300 font-bold">{membershipId.toUpperCase()}</span> | Verified Nairobi Agronomy Circle
              </p>
            </div>
            
            <div className="flex items-center space-x-3 bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800">
              <Wheat className="w-6 h-6 text-emerald-300" />
              <div className="text-left">
                <span className="text-[10px] text-emerald-300 block font-bold uppercase">County Delivery Circle</span>
                <span className="text-xs font-bold text-white">Nairobi - Kiambu Border</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('planting')}
              className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'planting' 
                  ? 'border-emerald-700 text-emerald-800 font-extrabold' 
                  : 'border-transparent text-slate-600 hover:text-emerald-800'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>Certified Planting Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'calculator' 
                  ? 'border-emerald-700 text-emerald-800 font-extrabold' 
                  : 'border-transparent text-slate-600 hover:text-emerald-800'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Fertilizer Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('workshops')}
              className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'workshops' 
                  ? 'border-emerald-700 text-emerald-800 font-extrabold' 
                  : 'border-transparent text-slate-600 hover:text-emerald-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Agronomy Field Workshops</span>
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === 'planting' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-slate-900">Recommended Planting & Spray Cycles</h3>
                <p className="text-xs text-slate-600">Apply these verified, PCPB-certified agrochemical timelines to guarantee maximum grain size and disease resistance.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 hover:border-emerald-600/25 transition">
                  <div className="flex items-center space-x-2 text-emerald-800 font-serif font-bold text-base pb-3 border-b border-slate-100">
                    <Wheat className="w-5 h-5 text-emerald-700" />
                    <span>Phase 1: Seed Selection & Inoculation</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Always start with KEBS-approved hybrid seeds. Before planting, dress seeds with biological soil fungicides to protect the infant roots from damping-off disease. Plan seed row spacing: <strong>75cm x 25cm</strong> for Maize.
                  </p>
                  <div className="bg-emerald-50 rounded-xl p-3 flex items-start space-x-2.5 text-[11px] text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Pro Tip:</strong> Inoculating legumes with Rhizobium booster increases natural nitrogen absorption, cutting chemical costs by up to 25%!</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 hover:border-emerald-600/25 transition">
                  <div className="flex items-center space-x-2 text-emerald-800 font-serif font-bold text-base pb-3 border-b border-slate-100">
                    <Sprout className="w-5 h-5 text-emerald-700" />
                    <span>Phase 2: Post-Emergent Spraying & Weeding</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Apply selective herbicides within 2-3 weeks of germination to eliminate noxious wild grasses before they consume valuable fertilizer. Use high-density spray pumps with flat-fan nozzles for uniform field coverage.
                  </p>
                  <div className="bg-emerald-50 rounded-xl p-3 flex items-start space-x-2.5 text-[11px] text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Pro Tip:</strong> Spray early in the morning (6:00 AM – 9:00 AM) or late afternoon to prevent evaporation and heat stress on active plant leaves.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                <Calculator className="w-8 h-8 text-emerald-700 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-slate-900">Soil Nutrition & Fertilizer Calculator</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Enter your exact acreage and crop type to determine precisely how many bags of fertilizer are required for a high-density harvest.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                {/* Inputs */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Select Crop Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { code: 'maize', label: 'Maize / Grain' },
                        { code: 'potatoes', label: 'Irish Potatoes' },
                        { code: 'coffee', label: 'Cash Crop Coffee' },
                        { code: 'tomatoes', label: 'Tomatoes / Hort' },
                      ].map(crop => (
                        <button
                          key={crop.code}
                          onClick={() => setCropType(crop.code as any)}
                          className={`py-2.5 px-3 rounded-xl font-bold border transition text-left flex items-center space-x-1.5 ${
                            cropType === crop.code
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Wheat className="w-3.5 h-3.5 shrink-0" />
                          <span>{crop.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Farm Acreage (Acres)</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="1"
                        max="25"
                        step="1"
                        value={acreage}
                        onChange={(e) => setAcreage(Number(e.target.value))}
                        className="w-full accent-emerald-700 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-xl shrink-0">
                        {acreage} Acres
                      </span>
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-900/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                      Recommended Inputs Plan (50kg Bags)
                    </span>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white rounded-xl p-2.5 border border-emerald-900/5">
                        <span className="text-lg font-black text-emerald-950 block">{advice.dap}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold">DAP (Plant)</span>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 border border-emerald-900/5">
                        <span className="text-lg font-black text-emerald-950 block">{advice.npk}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold">NPK (Booster)</span>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 border border-emerald-900/5">
                        <span className="text-lg font-black text-emerald-950 block">{advice.can}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold">CAN (Dress)</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-emerald-100">
                      <strong>Agronomist Tip:</strong> {advice.tips}
                    </p>
                  </div>

                  {onBuyAgrochemicals && (
                    <button
                      onClick={onBuyAgrochemicals}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order Certified Inputs</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workshops' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-slate-900">Upcoming Cooperative Field Workshops</h3>
                <p className="text-xs text-slate-600">Join our certified agronomists and licensed veterinary teams for on-farm demonstrations, dosage tests, and disease diagnostic training.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {WORKSHOPS.map((ws) => (
                  <div key={ws.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition">
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{ws.county}</span>
                        </span>
                        <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                          Free Entry
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-bold text-slate-900 leading-snug">
                        {ws.title}
                      </h4>

                      <div className="space-y-1.5 pt-1 text-slate-600">
                        <p><strong>Venue:</strong> {ws.venue}</p>
                        <p><strong>Date:</strong> {ws.date}</p>
                        <p><strong>Time:</strong> {ws.time}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2 text-[10px] text-slate-500">
                      <p className="italic">Instructor: {ws.agronomist}</p>
                      <button className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition cursor-pointer flex items-center justify-center space-x-1">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>SMS Cooperative Invite</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="container mx-auto px-6">
          <p>© 2026 Maxim Vet Kenya.</p>
        </div>
      </footer>
    </div>
  );
}
