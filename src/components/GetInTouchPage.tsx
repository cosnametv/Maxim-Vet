import React, { useState, useEffect, FormEvent } from 'react';
import { 
  Mail, Phone, MapPin, Calendar, MessageSquare, 
  CheckCircle2, Send, Shield, User, ChevronRight 
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

  // Keep the form in sync when opened with a different tab/service selection.
  useEffect(() => {
    setActiveTab(initialTab);
    setServiceType(initialService);
  }, [initialTab, initialService]);

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
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
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
    <main id="get-in-touch-view" className="bg-emerald-50 min-h-screen">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600">
        <div className="container mx-auto px-6 py-8 md:py-12">
          <span className="text-[11px] md:text-xs font-bold tracking-widest text-emerald-100/80 uppercase">Get In Touch</span>
          <h1 className="font-serif text-2xl md:text-4xl font-medium text-white mt-1">
            How Can We Help You Grow?
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-emerald-50">
        <div className="container mx-auto px-6 py-3 flex items-center gap-2 text-xs font-semibold text-emerald-800/70">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onBack(); }}
            className="hover:text-emerald-700 transition"
          >
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-600/50" />
          <span className="text-emerald-900">Get In Touch</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pt-4 pb-12 md:pb-16">
        <div className="max-w-3xl mx-auto">

            {/* Unified Form Section */}
            <div className="bg-white p-6 md:p-10 rounded-[32px] border border-emerald-950/5 shadow-sm text-left">
              
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

                  <div className={`grid grid-cols-1 gap-4 ${activeTab === 'support' ? 'sm:grid-cols-2' : ''}`}>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-emerald-950">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                        <input
                          id="touch-email"
                          type="email"
                          required
                          placeholder="e.g., name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                        />
                      </div>
                    </div>

                    {activeTab === 'support' && (
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-emerald-950">Required Support Expert *</label>
                        <div className="relative">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none" />
                          <select
                            id="touch-service"
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value as 'vet' | 'soil' | 'agronomy' | 'delivery')}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none bg-white appearance-none"
                          >
                            <option value="vet">KVB Veterinary Doctor</option>
                            <option value="soil">Soil Testing Lab Tech</option>
                            <option value="agronomy">Crop Agronomist</option>
                            <option value="delivery">Cooperative Dispatch</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Conditional Fields for Support Desk Booking */}
                  {activeTab === 'support' && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">

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
    </main>
  );
}
