import React, { useState, FormEvent } from 'react';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, MessageSquare, 
  CheckCircle2, Clock, Send, Shield, User, Building, Info 
} from 'lucide-react';

interface GetInTouchPageProps {
  onBack: () => void;
  initialTab?: 'inquiry' | 'support';
  initialService?: 'vet' | 'soil' | 'agronomy' | 'delivery';
}

export default function GetInTouchPage({ onBack, initialTab = 'inquiry', initialService = 'vet' }: GetInTouchPageProps) {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'support'>(initialTab);
  
  // Shared Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Support-specific States
  const [serviceType, setServiceType] = useState<'vet' | 'soil' | 'agronomy' | 'delivery'>(initialService);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  // Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validations
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    if (activeTab === 'support') {
      if (!date) {
        setErrorMsg('Please pick a preferred date for the consultation.');
        return;
      }
      if (!location.trim()) {
        setErrorMsg('Please enter your farm location.');
        return;
      }
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setSubmitSuccess(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setDate('');
    setLocation('');
  };

  return (
    <main id="get-in-touch-view" className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Back Navigation Bar */}
          <button
            id="get-touch-back-btn"
            onClick={onBack}
            className="group inline-flex items-center space-x-2 text-xs md:text-sm font-bold text-emerald-800 hover:text-emerald-600 mb-8 transition-colors bg-white px-4 py-2.5 rounded-full shadow-sm border border-emerald-900/5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Homepage</span>
          </button>

          {/* Page Headers */}
          <div className="text-left max-w-2xl mb-12 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1.5 rounded-full inline-block">
              Support Desk &amp; Contact Center
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold leading-tight text-emerald-950">
              How Can We Help You Grow?
            </h1>
            <p className="text-emerald-900/75 text-sm md:text-base leading-relaxed">
              Have a general inquiry about our PCPB-certified agrochemicals? Or do you need a licensed veterinary doctor to visit your farm? Choose the appropriate desk below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Office info & Guidelines */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Office Card */}
              <div className="bg-emerald-950 text-white p-8 rounded-[32px] border border-emerald-900 shadow-xl relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700/25 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="font-serif text-xl md:text-2xl font-medium text-emerald-300 mb-6">Nairobi Headquarters</h3>
                
                <div className="space-y-6 text-sm">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-200">Our Location</p>
                      <p className="text-xs text-emerald-100/75 mt-1">
                        Industrial Area Main Block, Commercial Street,<br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-200">Call/WhatsApp Desk</p>
                      <p className="text-xs text-emerald-100/75 mt-1">+254 712 345 678</p>
                      <p className="text-[10px] text-emerald-300/70 mt-0.5">Mon–Sat: 7:30 AM – 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-200">Email Correspondence</p>
                      <p className="text-xs text-emerald-100/75 mt-1">info@maximvet.co.ke</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-200">Soil Sampling Hours</p>
                      <p className="text-xs text-emerald-100/75 mt-1">Samples are accepted Monday to Friday: 8:00 AM – 4:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-emerald-900 flex justify-between items-center text-xs text-emerald-300/80">
                  <span>PCPB Licensed Agribusiness</span>
                  <span className="font-mono bg-emerald-900 px-2 py-1 rounded">Reg No: 0451</span>
                </div>
              </div>

              {/* Informational Guidelines Card */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-950/5 text-left space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>Important Farmer Notices</span>
                </h4>
                <ul className="space-y-3 text-xs text-emerald-900/80 leading-relaxed list-disc list-inside">
                  <li><strong>Veterinary Visits:</strong> KVB certified doctors carry medicine bags for direct diagnosis on bovine, caprine, or poultry flocks.</li>
                  <li><strong>Soil Sample Kits:</strong> Use dry paper bags to bring soil samples; do not pack wet soil in polythene bags as it alters nitrogen values.</li>
                  <li><strong>Delivery Tracking:</strong> Bulk orders &gt;15 bags qualify for free dispatch via county cooperative trucks.</li>
                </ul>
              </div>

            </div>

            {/* Right Column: Unified Form Section */}
            <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-[32px] border border-emerald-950/5 shadow-sm text-left">
              
              {!submitSuccess ? (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  
                  {/* Category Switcher Tabs */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Select Request Type
                    </label>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                      <button
                        id="tab-btn-inquiry"
                        type="button"
                        onClick={() => {
                          setActiveTab('inquiry');
                          setErrorMsg(null);
                        }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                          activeTab === 'inquiry'
                            ? 'bg-white text-emerald-950 shadow-sm'
                            : 'text-slate-600 hover:text-emerald-900'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>General Inquiry</span>
                      </button>

                      <button
                        id="tab-btn-support"
                        type="button"
                        onClick={() => {
                          setActiveTab('support');
                          setErrorMsg(null);
                        }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                          activeTab === 'support'
                            ? 'bg-white text-emerald-950 shadow-sm'
                            : 'text-slate-600 hover:text-emerald-900'
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Support Desk Booking</span>
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Shared Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-emerald-950">Your Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                        <input
                          id="touch-name"
                          type="text"
                          required
                          placeholder="e.g. Tina Maina"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-emerald-950">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                        <input
                          id="touch-phone"
                          type="tel"
                          required
                          placeholder="e.g., 0712345678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-emerald-950">Email Address (Optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                      <input
                        id="touch-email"
                        type="email"
                        placeholder="e.g., name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* Conditional Fields for Support Desk Booking */}
                  {activeTab === 'support' && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-emerald-950">Required Support Expert *</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'vet', label: 'KVB Veterinary Doctor' },
                            { id: 'soil', label: 'Soil Testing Lab Tech' },
                            { id: 'agronomy', label: 'Crop Agronomist' },
                            { id: 'delivery', label: 'Cooperative Dispatch' },
                          ].map((s) => (
                            <button
                              id={`touch-service-${s.id}`}
                              key={s.id}
                              type="button"
                              onClick={() => setServiceType(s.id as any)}
                              className={`py-2.5 px-3 rounded-xl text-[11px] font-bold transition border ${
                                serviceType === s.id
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-900/5 text-emerald-900'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-emerald-950">Preferred Session Date *</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                            <input
                              id="touch-date"
                              type="date"
                              required
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-emerald-950">Farm Location / County *</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                            <input
                              id="touch-location"
                              type="text"
                              required
                              placeholder="e.g. Kitale Town, Trans-Nzoia"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Message Body */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-emerald-950">
                      {activeTab === 'support' ? 'Symptoms, Herd Details, or Specific Inquiry' : 'Your Message / Inquiry Details *'}
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-emerald-600" />
                      <textarea
                        id="touch-message"
                        rows={4}
                        required={activeTab === 'inquiry'}
                        placeholder={activeTab === 'support' ? "Describe herd size, crop symptoms, or delivery bags required..." : "How can our technical agribusiness team assist you?"}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Certification Badge */}
                  <div className="p-3 bg-emerald-50 rounded-xl flex items-start space-x-2 border border-emerald-900/5 text-xs text-emerald-800">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      We protect your farmer data. Information collected here is only shared with certified Maxim Vet personnel to assist your agricultural needs.
                    </p>
                  </div>

                  <button
                    id="touch-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending details...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{activeTab === 'support' ? 'Book Support Session Appointment' : 'Send General Inquiry'}</span>
                      </>
                    )}
                  </button>

                </form>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-semibold text-emerald-950">Thank You, {name}!</h3>
                    <p className="text-emerald-800/80 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                      {activeTab === 'support' 
                        ? `Your expert support appointment booking for ${date} has been successfully recorded. An agribusiness doctor or tech will call you shortly.`
                        : 'Your inquiry has been successfully delivered. A service expert from our Nairobi block will reply to you within 24 business hours.'}
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-900/5 p-5 rounded-2xl text-left text-xs text-emerald-950 space-y-2 max-w-md mx-auto">
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Phone:</strong> {phone}</p>
                    {email && <p><strong>Email:</strong> {email}</p>}
                    {activeTab === 'support' && (
                      <>
                        <p><strong>Service:</strong> {serviceType.toUpperCase()} Consultation</p>
                        <p><strong>Location:</strong> {location}</p>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                    <button
                      id="touch-btn-success-new"
                      onClick={resetForm}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      New Request
                    </button>
                    <button
                      id="touch-btn-success-back"
                      onClick={onBack}
                      className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
