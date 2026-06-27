import { useState, FormEvent } from 'react';
import { 
  Stethoscope, ShieldCheck, FileText, Award, ArrowLeft, 
  BookOpen, Plus, Search, Trash2, CheckCircle2, ClipboardList, CalendarPlus
} from 'lucide-react';
import PasswordInput from './PasswordInput';
import Toast, { ToastData, ToastType } from './Toast';
import { KENYA_COUNTIES } from '../data';
import { useContent } from '../store/contentStore';
import { EnrollmentRecord } from '../types';

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
  const { cpdModules: CPD_MODULES, enrollments, setEnrollments } = useContent();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [kvbNumber, setKvbNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('Nairobi County');
  const [loginError, setLoginError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (type: ToastType, message: string) =>
    setToast({ id: Date.now(), type, message });
  
  // Dashboard States
  const [activeTab, setActiveTab] = useState<'modules' | 'reports' | 'bookings'>('modules');
  const [searchQuery, setSearchQuery] = useState('');

  // CPD enrollment / payment
  // Fallback day rate used only if a module has no rate configured.
  const CPD_FEE_PER_DAY = 500;
  const CPD_PAYBILL = '400200';
  const CPD_ACCOUNT = 'MAXIMVET-CPD';
  const [enrollModuleId, setEnrollModuleId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [enrollPhone, setEnrollPhone] = useState('');
  const [mpesaRef, setMpesaRef] = useState('');
  
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
  const [newCounty, setNewCounty] = useState('Nairobi County');
  const [newLivestock, setNewLivestock] = useState('Dairy Cattle');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newPrescription, setNewPrescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
      showToast('error', 'Please fill in all clinical report fields.');
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
    showToast('success', 'Clinical Case Report submitted and logged successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const filteredCPD = CPD_MODULES.filter(mod => 
    mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mod.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Every individual session day for a module (inclusive of from/to dates)
  const getModuleDates = (mod: { fromDate: string; toDate: string }) => {
    const from = new Date(mod.fromDate);
    const to = new Date(mod.toDate);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return [] as string[];
    const dates: string[] = [];
    const cur = new Date(from);
    while (cur <= to) {
      dates.push(
        cur.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      );
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const enrollModule = CPD_MODULES.find((m) => m.id === enrollModuleId) ?? null;
  const activeEnrollment = enrollModuleId ? enrollments[enrollModuleId] ?? null : null;

  const getBookingStatus = (dates: string[]): 'Expired' | 'Upcoming' | 'Ongoing' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const times = dates.map((d) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x.getTime();
    });
    const first = Math.min(...times);
    const last = Math.max(...times);
    if (last < today.getTime()) return 'Expired';
    if (first > today.getTime()) return 'Upcoming';
    return 'Ongoing';
  };

  // Bookings sorted from earliest (expired) to latest (upcoming)
  const sortedBookings = Object.values(enrollments)
    .map((rec) => ({
      record: rec,
      module: CPD_MODULES.find((m) => m.id === rec.moduleId)!,
      status: getBookingStatus(rec.dates),
      firstTime: Math.min(...rec.dates.map((d) => new Date(d).getTime())),
    }))
    .filter((b) => b.module)
    .sort((a, b) => a.firstTime - b.firstTime);

  const openEnrollment = (moduleId: string) => {
    setEnrollModuleId(moduleId);
    setSelectedDates([]);
    setEnrollPhone('');
    setMpesaRef('');
  };

  const toggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const handleEnroll = (e: FormEvent) => {
    e.preventDefault();
    if (!enrollModule) return;
    if (selectedDates.length === 0) {
      showToast('error', 'Please select at least one day to attend.');
      return;
    }
    if (!mpesaRef.trim()) {
      showToast('error', 'Please enter your M-Pesa transaction code.');
      return;
    }
    const allDates = getModuleDates(enrollModule);
    // Keep the chosen days in chronological order
    const orderedDates = allDates.filter((d) => selectedDates.includes(d));
    const record: EnrollmentRecord = {
      moduleId: enrollModule.id,
      dates: orderedDates,
      amount: orderedDates.length * (enrollModule.ratePerDay ?? CPD_FEE_PER_DAY),
      phone: enrollPhone,
      reference: mpesaRef.trim().toUpperCase(),
      submittedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
      verified: false,
      memberName: fullName || undefined,
      kvb: kvbNumber ? kvbNumber.trim().toUpperCase() : undefined,
    };
    setEnrollments((prev) => ({ ...prev, [enrollModule.id]: record }));
    showToast(
      'success',
      'Booking submitted. Your M-Pesa reference is pending admin verification.'
    );
  };

  // Build a downloadable .ics calendar for the booked session days
  const addToCalendar = (record: EnrollmentRecord) => {
    const mod = CPD_MODULES.find((m) => m.id === record.moduleId);
    if (!mod) return;
    const durationHours = (() => {
      const m = mod.duration.match(/\d+/);
      return m ? parseInt(m[0], 10) : 1;
    })();
    const pad = (n: number) => String(n).padStart(2, '0');
    const fmt = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
    const dtstamp = fmt(new Date());

    const events = record.dates.map((label, i) => {
      const start = new Date(label);
      start.setHours(9, 0, 0, 0); // sessions start 9:00 AM
      const end = new Date(start);
      end.setHours(start.getHours() + durationHours);
      return [
        'BEGIN:VEVENT',
        `UID:${mod.id}-${i}-${Date.now()}@maximvet`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${fmt(start)}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:${esc(mod.title)}`,
        `DESCRIPTION:${esc(`CPD Module ${mod.code} · Ksh ${mod.ratePerDay ?? CPD_FEE_PER_DAY}/day · Payment Ref: ${record.reference}`)}`,
        'END:VEVENT',
      ].join('\r\n');
    });

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Maxim Vet Academy//CPD//EN',
      'CALSCALE:GREGORIAN',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mod.code}-cpd-schedule.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'Calendar file downloaded. Open it to add the sessions to your calendar.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Toast toast={toast} onClose={() => setToast(null)} />

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
                    {KENYA_COUNTIES.map(co => (
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
                    <PasswordInput
                      id="vet-register-pass"
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
                      id="vet-register-confirm-pass"
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
                    Enter your password
                  </label>
                  <PasswordInput
                    id="vet-login-pass"
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
          {enrollModule ? (
            /* CPD ENROLLMENT / PAYMENT PAGE */
            <div className="max-w-3xl mx-auto space-y-6">
              <button
                onClick={() => setEnrollModuleId(null)}
                className="group inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 hover:text-emerald-600 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Modules</span>
              </button>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                      {enrollModule.code}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                      Ksh {enrollModule.ratePerDay ?? CPD_FEE_PER_DAY} / day
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 leading-snug">{enrollModule.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{enrollModule.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-slate-400">From</p>
                      <p className="font-bold text-slate-700">{enrollModule.fromDate}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-slate-400">To</p>
                      <p className="font-bold text-slate-700">{enrollModule.toDate}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Session</p>
                      <p className="font-bold text-slate-700">{enrollModule.duration} per day</p>
                    </div>
                  </div>
                </div>

                {activeEnrollment ? (
                  /* ENROLLED — PAYMENT & MEETING DETAILS */
                  <div className="border-t border-slate-100 pt-6 space-y-5">
                    {activeEnrollment.verified ? (
                      <div className="flex items-center space-x-2 text-emerald-700">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-bold">Verified — you are enrolled in this module.</span>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800">
                        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold">
                          Pending verification. Your booking is reserved and will be confirmed once an admin verifies your M-Pesa transaction code.
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Payment details */}
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Payment Details</p>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Amount</span><span className="font-bold text-emerald-800">Ksh {activeEnrollment.amount}</span></div>
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Days Booked</span><span className="font-bold text-slate-700">{activeEnrollment.dates.length} day{activeEnrollment.dates.length > 1 ? 's' : ''}</span></div>
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Rate</span><span className="font-bold text-slate-700">Ksh {enrollModule.ratePerDay ?? CPD_FEE_PER_DAY}/day</span></div>
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Paying No.</span><span className="font-mono font-bold text-slate-700">{activeEnrollment.phone || '—'}</span></div>
                          <div className="flex justify-between gap-3"><span className="text-slate-500">M-Pesa Code</span><span className="font-mono font-bold text-slate-700">{activeEnrollment.reference}</span></div>
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Status</span><span className={`font-bold ${activeEnrollment.verified ? 'text-emerald-700' : 'text-amber-700'}`}>{activeEnrollment.verified ? 'Verified' : 'Pending Verification'}</span></div>
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Submitted</span><span className="font-bold text-slate-700 text-right">{activeEnrollment.submittedAt}</span></div>
                        </div>
                      </div>

                      {/* Meeting details */}
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Meeting Details</p>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Module</span><span className="font-mono font-bold text-slate-700 text-right">{enrollModule.code}</span></div>
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Full Range</span><span className="font-bold text-slate-700 text-right">{enrollModule.fromDate} – {enrollModule.toDate}</span></div>
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Session</span><span className="font-bold text-slate-700">{enrollModule.duration} per day</span></div>
                          <div className="flex justify-between gap-3"><span className="text-slate-500">Rate</span><span className="font-bold text-slate-700">Ksh {enrollModule.ratePerDay ?? CPD_FEE_PER_DAY} / day</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Selected days */}
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Days You Selected to Attend</p>
                      <div className="flex flex-wrap gap-2">
                        {activeEnrollment.dates.map((d) => (
                          <span key={d} className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{d}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => addToCalendar(activeEnrollment)}
                        className="flex-1 inline-flex items-center justify-center space-x-2 py-3 bg-white border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold transition cursor-pointer"
                      >
                        <CalendarPlus className="w-4 h-4" />
                        <span>Add to Calendar</span>
                      </button>
                      <button
                        onClick={() => setEnrollModuleId(null)}
                        className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEnroll} className="border-t border-slate-100 pt-6 space-y-5">
                    {/* Specific-day selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">
                        Select the day(s) you will attend
                        <span className="font-normal text-slate-500"> · Ksh {enrollModule.ratePerDay ?? CPD_FEE_PER_DAY} per day</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {getModuleDates(enrollModule).map((d) => {
                          const checked = selectedDates.includes(d);
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => toggleDate(d)}
                              className={`py-3 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center space-x-2 text-left ${
                                checked
                                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                                {checked && <CheckCircle2 className="w-3 h-3" />}
                              </span>
                              <span>{d}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <button type="button" onClick={() => setSelectedDates(getModuleDates(enrollModule))} className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer">Select all days</button>
                        <button type="button" onClick={() => setSelectedDates([])} className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer">Clear</button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">Amount to Pay</p>
                        <p className="text-xs text-slate-600">
                          {selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''} × Ksh {enrollModule.ratePerDay ?? CPD_FEE_PER_DAY}
                        </p>
                      </div>
                      <span className="font-serif text-2xl font-black text-emerald-950">
                        Ksh {selectedDates.length * (enrollModule.ratePerDay ?? CPD_FEE_PER_DAY)}
                      </span>
                    </div>

                    {/* Manual M-Pesa payment instructions */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">How to Pay (M-Pesa)</p>
                      <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                        <li>Go to M-Pesa &gt; Lipa na M-Pesa &gt; Pay Bill.</li>
                        <li>Business Number: <strong className="font-mono text-slate-800">{CPD_PAYBILL}</strong></li>
                        <li>Account Number: <strong className="font-mono text-slate-800">{CPD_ACCOUNT}</strong></li>
                        <li>Amount: <strong className="text-slate-800">Ksh {selectedDates.length * (enrollModule.ratePerDay ?? CPD_FEE_PER_DAY)}</strong></li>
                        <li>Enter your PIN and confirm. Copy the M-Pesa code from the SMS.</li>
                      </ol>
                    </div>

                    {/* Reference + phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="cpd-mpesa-ref" className="text-[11px] font-bold text-slate-700 block">
                          M-Pesa Transaction Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="cpd-mpesa-ref"
                          type="text"
                          required
                          value={mpesaRef}
                          onChange={(e) => setMpesaRef(e.target.value)}
                          placeholder="e.g. SLJ7XK9P2Q"
                          className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white font-mono uppercase"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="cpd-mpesa-phone" className="text-[11px] font-bold text-slate-700 block">
                          Paying Phone Number
                        </label>
                        <input
                          id="cpd-mpesa-phone"
                          type="tel"
                          value={enrollPhone}
                          onChange={(e) => setEnrollPhone(e.target.value)}
                          placeholder="e.g. 0722XXXXXX"
                          className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={selectedDates.length === 0}
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-70 text-white rounded-xl font-bold transition flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span>Submit for Verification</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      Your booking is confirmed once an admin verifies your M-Pesa transaction code.
                    </p>
                  </form>
                )}
              </div>
            </div>
          ) : (
          <>
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
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'bookings' 
                  ? 'border-emerald-700 text-emerald-800 font-extrabold' 
                  : 'border-transparent text-slate-600 hover:text-emerald-800'
              }`}
            >
              <CalendarPlus className="w-4 h-4" />
              <span>My Bookings ({sortedBookings.length})</span>
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
                            Ksh {mod.ratePerDay ?? CPD_FEE_PER_DAY} / day
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-slate-900 leading-tight">
                          {mod.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {mod.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-500">
                        <div className="space-y-1">
                          <p>From: <strong className="text-slate-700">{mod.fromDate}</strong></p>
                          <p>To: <strong className="text-slate-700">{mod.toDate}</strong></p>
                          <p>Duration: <strong className="text-slate-700">{mod.duration} per session</strong></p>
                        </div>
                        <button
                          onClick={() => openEnrollment(mod.id)}
                          className="w-full px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[10px] transition cursor-pointer"
                        >
                          {enrollments[mod.id] ? 'Enrolled · View Details' : 'Start Study'}
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
                        {KENYA_COUNTIES.map(co => (
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

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-slate-900">My CPD Bookings</h3>
                <p className="text-xs text-slate-600">Your enrolled sessions, ordered from past (expired) to upcoming.</p>
              </div>

              {sortedBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                  <CalendarPlus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600 text-xs">You have no bookings yet. Enroll in a CPD module to see it here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedBookings.map(({ record, module, status }) => {
                    const statusStyle =
                      status === 'Expired'
                        ? 'text-slate-600 bg-slate-100'
                        : status === 'Ongoing'
                        ? 'text-amber-800 bg-amber-100'
                        : 'text-emerald-700 bg-emerald-100';
                    return (
                      <div key={record.moduleId} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 hover:shadow-md transition">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                                {module.code}
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyle}`}>
                                {status}
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${record.verified ? 'text-emerald-700 bg-emerald-100' : 'text-amber-800 bg-amber-100'}`}>
                                {record.verified ? 'Verified' : 'Pending Verification'}
                              </span>
                            </div>
                            <h4 className="font-serif text-base font-bold text-slate-900">{module.title}</h4>
                            <p className="text-[11px] text-slate-500">
                              {module.fromDate} – {module.toDate} · {module.duration} per day
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Amount</p>
                            <p className="font-serif text-lg font-black text-emerald-950">Ksh {record.amount}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Booked Days ({record.dates.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {record.dates.map((d) => (
                              <span key={d} className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{d}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100 text-xs">
                          <span className="flex-1 text-slate-500">
                            M-Pesa: <span className="font-mono font-bold text-slate-700">{record.reference}</span> · Submitted {record.submittedAt}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => addToCalendar(record)}
                              className="inline-flex items-center space-x-1.5 px-3 py-2 border border-emerald-700 text-emerald-800 hover:bg-emerald-50 rounded-lg font-bold text-[11px] transition cursor-pointer"
                            >
                              <CalendarPlus className="w-3.5 h-3.5" />
                              <span>Add to Calendar</span>
                            </button>
                            <button
                              onClick={() => setEnrollModuleId(record.moduleId)}
                              className="inline-flex items-center px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] transition cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          </>
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
