import { useState, FormEvent } from 'react';
import { Booking } from '../types';
import { X, Calendar, User, Phone, Mail, MapPin, MessageSquare, CheckCircle, Shield, ShieldAlert } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: 'vet' | 'soil' | 'agronomy' | 'delivery';
}

export default function BookingModal({ isOpen, onClose, initialService = 'vet' }: BookingModalProps) {
  const [serviceType, setServiceType] = useState<'vet' | 'soil' | 'agronomy' | 'delivery'>(initialService);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormErrors(null);

    // Basic Validation
    if (!name.trim()) {
      setFormErrors('Please provide your name.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setFormErrors('Please provide a valid Kenyan phone number.');
      return;
    }
    if (!date) {
      setFormErrors('Please select a preferred date for the appointment.');
      return;
    }
    if (!location.trim()) {
      setFormErrors('Please enter your farm location details.');
      return;
    }

    setIsSubmitting(true);
    // Simulate submission to backend / agronomists
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1800);
  };

  const resetAll = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setEmail('');
    setDate('');
    setLocation('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/45 backdrop-blur-md flex items-center justify-center p-4">
      {/* Background layer */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Main container */}
      <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative border border-emerald-900/10">
        
        {/* Header close button */}
        <button
          id="booking-modal-close"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Box */}
        <div className="p-8">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Farming Consultation Desk
                </span>
                <h3 className="font-serif text-2xl font-medium text-emerald-950">Book Expert Support</h3>
                <p className="text-emerald-800/80 text-xs leading-relaxed">
                  Fill out this booking form to schedule a site collection, soil sampling, or livestock clinical visit.
                </p>
              </div>

              {formErrors && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formErrors}</span>
                </div>
              )}

              {/* Service Select */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-emerald-950">Required Service *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'vet', label: 'Vet Visit' },
                    { id: 'soil', label: 'Soil Testing' },
                    { id: 'agronomy', label: 'Crop Guide' },
                    { id: 'delivery', label: 'Farm Delivery' },
                  ].map((s) => (
                    <button
                      id={`booking-service-btn-${s.id}`}
                      key={s.id}
                      type="button"
                      onClick={() => setServiceType(s.id as any)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
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

              {/* Name Field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-emerald-950">Farmer Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    id="booking-name"
                    type="text"
                    required
                    placeholder="e.g. Tina Maina"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-emerald-950">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      placeholder="e.g., 0712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-emerald-950">Preferred Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <input
                      id="booking-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Location Detail */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-emerald-950">Farm Location &amp; Nearest Town *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    id="booking-location"
                    type="text"
                    required
                    placeholder="e.g., Kitale, near the cooperative office"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Symptoms / Notes */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-emerald-950">Farming Notes / Symptoms / Questions</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-3 w-4 h-4 text-emerald-600" />
                  <textarea
                    id="booking-message"
                    rows={3}
                    placeholder="Describe symptoms, soil crops, or special needs..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-900/15 text-xs focus:border-emerald-600 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Safety & Compliance note */}
              <div className="p-3 bg-emerald-50 rounded-xl flex items-start space-x-2 border border-emerald-900/5">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  All consultations are carried out by fully qualified, PCPB &amp; KVB certified veterinary doctors and agricultural specialists.
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  id="booking-btn-cancel"
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 border border-emerald-900/10 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition"
                >
                  Cancel
                </button>
                <button
                  id="booking-btn-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Scheduling session...</span>
                    </>
                  ) : (
                    <span>Confirm Booking Appointment</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-2xl font-semibold text-emerald-950">Appointment Scheduled!</h4>
                <p className="text-emerald-800/80 text-xs px-2 leading-relaxed">
                  Hello <strong>{name}</strong>, your expert farming consultation request for <strong>{date}</strong> has been received!
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-900/5 p-4 rounded-2xl text-left space-y-2.5 text-xs text-emerald-950">
                <p><strong>Service Type:</strong> {serviceType === 'vet' ? 'Certified Veterinarian On-Farm Clinical' : serviceType === 'soil' ? 'Soil Nutrient collection' : serviceType === 'agronomy' ? 'Crop Planning & Disease Guidance' : 'Farm Delivery Coordination'}</p>
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>Farm Location:</strong> {location}</p>
                {message.trim() && <p className="italic text-emerald-800">"{message}"</p>}
              </div>

              <div className="p-3 bg-yellow-50 rounded-xl text-[10px] text-yellow-900 leading-relaxed border border-yellow-200">
                <strong>Notification:</strong> A licensed agronomist/vet doctor will call you within 1 to 2 business hours to validate coordinates and establish your visit.
              </div>

              <button
                id="booking-btn-success-close"
                onClick={resetAll}
                className="w-full btn bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-2xl transition shadow-sm"
              >
                Close Desk
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
