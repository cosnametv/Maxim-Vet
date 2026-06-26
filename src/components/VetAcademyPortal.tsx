import { useState, FormEvent } from 'react';
import { 
  Stethoscope, ShieldCheck, FileText, Calculator, Award, ArrowLeft, 
  BookOpen, Plus, Search, Trash2, CheckCircle2, FlaskConical, ClipboardList
} from 'lucide-react';

interface VetAcademyPortalProps {
  onBack: () => void;
}

interface CaseReport {
  id: string;
  farmerName: string;
  county: string;
  livestockType: string;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  date: string;
}

export default function VetAcademyPortal({ onBack }: VetAcademyPortalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [kvbNumber, setKvbNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('Nairobi');
  const [loginError, setLoginError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  
  // Dashboard States
  const [activeTab, setActiveTab] = useState<'modules' | 'reports' | 'calculator'>('modules');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Case Reports States
  const [reports, setReports] = useState<CaseReport[]>([
    {
      id: 'rep-1',
      farmerName: 'John Kamau',
      county: 'Kiambu',
      livestockType: 'Dairy Cattle',
      symptoms: 'High fever, loss of appetite, drop in milk production, swollen lymph nodes.',
      diagnosis: 'East Coast Fever (ECF)',
      prescription: 'Butalex (Buparvaquone) injection and multi-vitamin support.',
      date: '2026-06-25'
    },
    {
      id: 'rep-2',
      farmerName: 'Grace Mutua',
      county: 'Machakos',
      livestockType: 'Goats',
      symptoms: 'Nasal discharge, coughing, heavy breathing.',
      diagnosis: 'Contagious Caprine Pleuropneumonia (CCPP)',
      prescription: 'Tylosin injection therapy and 14-day flock quarantine advisory.',
      date: '2026-06-22'
    }
  ]);
  
  const [newFarmerName, setNewFarmerName] = useState('');
  const [newCounty, setNewCounty] = useState('Nairobi');
  const [newLivestock, setNewLivestock] = useState('Dairy Cattle');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newPrescription, setNewPrescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dosage Calculator States
  const [animalWeight, setAnimalWeight] = useState(350); // kg
  const [medicationType, setMedicationType] = useState<'antibiotic' | 'dewormer' | 'antiinflammatory'>('antibiotic');
  const [dosageRate, setDosageRate] = useState(10); // mg per kg

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!kvbNumber.trim()) {
      setLoginError('Please enter a valid KVB registration number.');
      return;
    }
    const cleanKvb = kvbNumber.trim().toUpperCase();
    const isBVM = /^\d+$/.test(cleanKvb);
    const isVTA = /^VTA\d+$/.test(cleanKvb);
    const isVTB = /^VTB\d+$/.test(cleanKvb);
    const isVTC = /^VTC\d+$/.test(cleanKvb);

    if (!isBVM && !isVTA && !isVTB && !isVTC) {
      setLoginError('Invalid KVB format. Examples: BVM (e.g. 0123), VTA (e.g. VTA00123), VTB (e.g. VTB00123), VTC (e.g. VTC00123).');
      return;
    }

    if (password.length < 4) {
      setLoginError('Password must be at least 4 characters.');
      return;
    }
    // Simulate authentication
    setLoginError('');
    setIsLoggedIn(true);
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setLoginError('Please enter your full professional name.');
      return;
    }
    if (!phone.trim()) {
      setLoginError('Please enter your phone number.');
      return;
    }
    if (!emailAddress.trim() || !emailAddress.includes('@')) {
      setLoginError('Please enter a valid veterinary email address.');
      return;
    }
    if (!kvbNumber.trim()) {
      setLoginError('Please enter your KVB registration number.');
      return;
    }
    const cleanKvb = kvbNumber.trim().toUpperCase();
    const isBVM = /^\d+$/.test(cleanKvb);
    const isVTA = /^VTA\d+$/.test(cleanKvb);
    const isVTB = /^VTB\d+$/.test(cleanKvb);
    const isVTC = /^VTC\d+$/.test(cleanKvb);

    if (!isBVM && !isVTA && !isVTB && !isVTC) {
      setLoginError('Invalid KVB Registration Number format. Use BVM (e.g. 0123), VTA (e.g. VTA00123), VTB (e.g. VTB00123), or VTC (e.g. VTC00123).');
      return;
    }

    if (password.length < 4) {
      setLoginError('Security password must be at least 4 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLoginError('Passwords do not match.');
      return;
    }
    setLoginError('');
    setSuccessInfo(`Registration successful for Dr. ${fullName}! KVB number logged.`);
    setIsRegistering(false);
    // Keep the registration number ready for immediate login
    setTimeout(() => {
      setSuccessInfo('');
    }, 6000);
  };

  const handleAddReport = (e: FormEvent) => {
    e.preventDefault();
    if (!newFarmerName || !newSymptoms || !newDiagnosis || !newPrescription) {
      alert('Please fill in all clinical report fields.');
      return;
    }
    
    const newReport: CaseReport = {
      id: `rep-${Date.now()}`,
      farmerName: newFarmerName,
      county: newCounty,
      livestockType: newLivestock,
      symptoms: newSymptoms,
      diagnosis: newDiagnosis,
      prescription: newPrescription,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReports([newReport, ...reports]);
    setNewFarmerName('');
    setNewSymptoms('');
    setNewDiagnosis('');
    setNewPrescription('');
    setSuccessMsg('Clinical Case Report submitted and logged successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const calculatedDose = (animalWeight * dosageRate) / 1000; // grams/active ingredient

  // CPD Modules
  const CPD_MODULES = [
    {
      id: 'cpd-1',
      title: 'Advanced Ruminant Mastitis Management',
      code: 'KVB-CPD-2026-08',
      credits: 4,
      duration: '3 hours',
      difficulty: 'Intermediate',
      description: 'Reviewing clinical vs sub-clinical mastitis detection protocols using CMT kits, hygienic milking pathways, and targeted intramammary antibiotic infusions.'
    },
    {
      id: 'cpd-2',
      title: 'Acaricide Resistance and Vector Control Protocols',
      code: 'KVB-CPD-2026-11',
      credits: 5,
      duration: '4 hours',
      difficulty: 'Advanced',
      description: 'Empirical approaches to managing tick resistance in East Africa, rotation of organophosphates vs pyrethroids, and community spray schedule setups.'
    },
    {
      id: 'cpd-3',
      title: 'Vaccine Cold-Chain Maintenance in Semi-Arid Counties',
      code: 'KVB-CPD-2026-02',
      credits: 3,
      duration: '2 hours',
      difficulty: 'Foundational',
      description: 'Practical training on keeping Contagious Bovine Pleuropneumonia (CBPP) and Lumpy Skin Disease (LSD) vaccines stable at 2-8°C during field distribution.'
    }
  ];

  const filteredCPD = CPD_MODULES.filter(mod => 
    mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mod.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Branded Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            id="vet-portal-back-btn"
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
            <span className="font-serif text-sm font-bold tracking-tight">Maxim Vet Academy</span>
          </div>
        </div>
      </header>

      {!isLoggedIn ? (
        /* LOGIN / REGISTRATION SCREEN */
        <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-24">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-800">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                {isRegistering ? 'Register Vet Account' : 'Veterinarian Academy Portal'}
              </h1>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                {isRegistering 
                  ? 'Request practitioner academy login credentials for continuous professional development tracking.'
                  : 'Secure portal for licensed KVB (Kenya Veterinary Board) practitioners to complete CPD modules and log clinical case studies.'}
              </p>
            </div>

            {successInfo && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
                    Full Name (with Dr. prefix)
                  </label>
                  <input 
                    id="vet-register-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. David Mwangi"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Mobile Phone Number
                  </label>
                  <input 
                    id="vet-register-phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0722XXXXXX"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Official Email Address
                  </label>
                  <input 
                    id="vet-register-email"
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="practitioner@example.com"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    KVB Registration Number
                  </label>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Surgeons (BVM): e.g. 0123 (numeric only) | Technologists/Technicians: e.g. VTA00123, VTB00123, VTC00123
                  </p>
                  <input 
                    id="vet-register-kvb"
                    type="text"
                    required
                    value={kvbNumber}
                    onChange={(e) => setKvbNumber(e.target.value)}
                    placeholder="e.g. 0123 or VTA00123"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Primary Practice County
                  </label>
                  <select
                    id="vet-register-county"
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                  >
                    {['Nairobi', 'Kiambu', 'Nakuru', 'Machakos', 'Nyeri', 'Meru', 'Murang\'a'].map(co => (
                      <option key={co} value={co}>{co}</option>
                    ))}
                  </select>
                </div>

                {/* Password & Confirm Password on the same line */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Password
                    </label>
                    <input 
                      id="vet-register-pass"
                      type="password"
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
                    <input 
                      id="vet-register-confirm-pass"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                    />
                  </div>
                </div>

                <button
                  id="vet-register-submit"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer shadow-md"
                >
                  Register Academy Credentials
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
                    KVB Registration Number
                  </label>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Formats: BVM (e.g. 0123), VTA (e.g. VTA00123), VTB (e.g. VTB00123), VTC (e.g. VTC00123)
                  </p>
                  <input 
                    id="vet-login-kvb"
                    type="text"
                    value={kvbNumber}
                    onChange={(e) => setKvbNumber(e.target.value)}
                    placeholder="e.g. 0123 or VTA00123"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Security Passcode / Password
                  </label>
                  <input 
                    id="vet-login-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <button
                  id="vet-login-submit"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer shadow-md"
                >
                  Sign In to Veterinarian Portal
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
              <span>Registered with Kenya Veterinary Board & KEBS</span>
            </div>
          </div>
        </div>
      ) : (
        /* PORTAL DASHBOARD */
        <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Authorized KVB Doctor</span>
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold tracking-tight">
                Welcome Dr. Maxim Vet Associate
              </h2>
              <p className="text-xs text-emerald-100/80">
                Registration Number: <span className="font-mono text-emerald-300 font-bold">{kvbNumber.toUpperCase()}</span> | Nairobi County Field Desk
              </p>
            </div>
            
            <div className="flex items-center space-x-2 bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800">
              <Award className="w-6 h-6 text-amber-400" />
              <div className="text-left">
                <span className="text-[10px] text-emerald-300 block font-bold uppercase">CPD Progress</span>
                <span className="text-xs font-bold text-white">12 / 15 Annual Credits</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'modules' 
                  ? 'border-emerald-700 text-emerald-800 font-extrabold' 
                  : 'border-transparent text-slate-600 hover:text-emerald-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Certified CPD Modules</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'reports' 
                  ? 'border-emerald-700 text-emerald-800 font-extrabold' 
                  : 'border-transparent text-slate-600 hover:text-emerald-800'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Clinical Case Reports ({reports.length})</span>
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
              <span>Livestock Dosage Calculator</span>
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === 'modules' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-slate-900">Continuous Professional Development</h3>
                  <p className="text-xs text-slate-600">Complete these peer-reviewed modules to fulfill KVB yearly recertification benchmarks.</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search modules..."
                    className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* CPD Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCPD.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200">
                    <p className="text-slate-600 text-xs">No certified modules match your search criteria.</p>
                  </div>
                ) : (
                  filteredCPD.map((mod) => (
                    <div key={mod.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                            {mod.code}
                          </span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                            {mod.credits} CPD Credits
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-slate-900 leading-tight">
                          {mod.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {mod.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Duration: <strong>{mod.duration}</strong></span>
                        <button className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[10px] transition cursor-pointer">
                          Start Study
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Report Form */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 lg:col-span-1">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <Plus className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    Log Clinical Case Report
                  </h3>
                </div>

                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddReport} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Farmer Full Name</label>
                    <input
                      type="text"
                      value={newFarmerName}
                      onChange={(e) => setNewFarmerName(e.target.value)}
                      placeholder="e.g. David Mwangi"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">County</label>
                      <select
                        value={newCounty}
                        onChange={(e) => setNewCounty(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
                      >
                        {['Nairobi', 'Kiambu', 'Nakuru', 'Machakos', 'Nyeri', 'Meru', 'Murang\'a'].map(co => (
                          <option key={co} value={co}>{co}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Livestock Class</label>
                      <select
                        value={newLivestock}
                        onChange={(e) => setNewLivestock(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
                      >
                        {['Dairy Cattle', 'Goats/Caprines', 'Poultry Flock', 'Sheep/Ovine', 'Swine'].map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Observed Clinical Symptoms</label>
                    <textarea
                      value={newSymptoms}
                      onChange={(e) => setNewSymptoms(e.target.value)}
                      rows={2}
                      placeholder="List animal clinical signs..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Formal Diagnosis</label>
                    <input
                      type="text"
                      value={newDiagnosis}
                      onChange={(e) => setNewDiagnosis(e.target.value)}
                      placeholder="e.g. Tick-borne Anaplasmosis"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Prescription & Advice</label>
                    <textarea
                      value={newPrescription}
                      onChange={(e) => setNewPrescription(e.target.value)}
                      rows={2}
                      placeholder="Medication dosage, delivery route, and withdrawal time..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition cursor-pointer"
                  >
                    Submit Clinical Report
                  </button>
                </form>
              </div>

              {/* Reports List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-slate-900">Submitted Case Logs</h3>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-3 py-1 rounded-full font-bold">
                    {reports.length} Reports Logged
                  </span>
                </div>

                <div className="space-y-4">
                  {reports.map((rep) => (
                    <div key={rep.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm hover:border-emerald-600/30 transition">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{rep.farmerName}</h4>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Logged Date: {rep.date} | County: {rep.county}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
                            {rep.livestockType}
                          </span>
                          <button
                            onClick={() => handleDeleteReport(rep.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition"
                            aria-label="Delete Log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-bold text-slate-500 block uppercase text-[9px]">Symptoms</span>
                          <p className="text-slate-800 mt-0.5">{rep.symptoms}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500 block uppercase text-[9px]">Diagnosis</span>
                          <p className="text-emerald-950 font-bold mt-0.5">{rep.diagnosis}</p>
                        </div>
                        <div>
                          <span className="font-bold text-emerald-800 block uppercase text-[9px] font-sans">Prescribed Agrochemicals</span>
                          <p className="text-slate-800 mt-0.5 font-medium">{rep.prescription}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto shadow-sm space-y-6">
              <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                <Calculator className="w-8 h-8 text-emerald-700 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-slate-900">Veterinary Clinical Dosage Calculator</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Accurately compute active pharmaceutical ingredient (API) amounts required based on bovine or caprine weight parameters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Estimated Animal Weight (kg)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="20"
                        max="800"
                        step="10"
                        value={animalWeight}
                        onChange={(e) => setAnimalWeight(Number(e.target.value))}
                        className="w-full accent-emerald-700 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-sm bg-slate-100 px-3 py-1 rounded-lg shrink-0">
                        {animalWeight} kg
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Therapeutic Class</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: 'antibiotic', label: 'Antibiotic' },
                        { type: 'dewormer', label: 'Dewormer' },
                        { type: 'antiinflammatory', label: 'NSAID' },
                      ].map(med => (
                        <button
                          key={med.type}
                          onClick={() => {
                            setMedicationType(med.type as any);
                            setDosageRate(med.type === 'antibiotic' ? 10 : med.type === 'dewormer' ? 5 : 2);
                          }}
                          className={`py-2 rounded-xl font-bold border transition ${
                            medicationType === med.type
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {med.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Active API Rate (mg / kg body weight)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={dosageRate}
                        onChange={(e) => setDosageRate(Math.max(1, Number(e.target.value)))}
                        className="w-24 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-center font-mono font-bold"
                      />
                      <span className="text-slate-500">mg / kg</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-900/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                      Target Prescription Calculation
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-3xl font-black text-emerald-950 font-serif">
                        {calculatedDose.toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-emerald-900 font-sans">grams</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-emerald-100">
                      Required pure dose of active ingredient for a <strong>{animalWeight} kg</strong> animal at a therapeutic rate of <strong>{dosageRate} mg/kg</strong>.
                    </p>
                  </div>

                  <div className="space-y-2 bg-white rounded-xl p-3 border border-emerald-900/5 text-[10px] text-emerald-800 leading-normal">
                    <div className="flex items-center space-x-1.5">
                      <FlaskConical className="w-3.5 h-3.5" />
                      <strong>Maxim Vet Clinical Precaution:</strong>
                    </div>
                    <p>Always cross-check with manufacturers instructions before administering direct intravenous or subcutaneous injections. Track milk/meat withdrawal timelines strictly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer copyright */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="container mx-auto px-6">
          <p>© 2026 Maxim Vet Kenya.</p>
        </div>
      </footer>
    </div>
  );
}
