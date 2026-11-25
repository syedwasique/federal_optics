import React, { useState } from 'react';
import { SEO, getLocalBusinessSchema } from '../components/SEO';
import { FEDERAL_OPTICAL_PHONE, FEDERAL_OPTICAL_PHONE_INTL, FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import { InstagramIcon } from '../components/Icons';
import { CLINIC_HOURS, SHOP_HOURS } from '../data/hours';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Eye
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'Eyewear Frame Inquiry',
    message: ''
  });

  const [bookingState, setBookingState] = useState({
    name: '',
    phone: '',
    preferredDate: '',
    preferredTime: 'Afternoon (2:00 PM – 5:00 PM)',
    notes: ''
  });

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Federal Optical!\n\nName: ${formState.name}\nPhone: ${formState.phone}\nEmail: ${formState.email}\nTopic: ${formState.serviceType}\nMessage: ${formState.message}`;
    const url = `https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setContactSubmitted(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `👓 *COMPUTERIZED EYE TEST APPOINTMENT REQUEST*\n\nName: ${bookingState.name}\nPhone: ${bookingState.phone}\nPreferred Date: ${bookingState.preferredDate}\nPreferred Time Slot: ${bookingState.preferredTime}\nNotes: ${bookingState.notes || 'Routine prescription check'}`;
    const url = `https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setBookingSubmitted(true);
  };

  return (
    <div className="site-container py-10 md:py-16 space-y-16">
      <SEO
        title="Contact Us & Book Computerized Eye Test | Karachi"
        description="Contact Federal Optical in Karachi. Book your clinical computerized eye exam, order via WhatsApp, or get expert optometrist assistance. Serving Pakistan nationwide."
        canonical="/contact"
        schema={getLocalBusinessSchema()}
      />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
          Since 1975 • Karachi, Pakistan
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-semibold text-stone-900">
          Visit Our Store & Eye Clinic
        </h1>
        <p className="text-stone-600 text-xs sm:text-base leading-relaxed">
          Whether you want to try on our handcrafted frames in Karachi, book a computerized refraction exam, or order remotely via WhatsApp from anywhere in Pakistan or overseas.
        </p>
      </div>

      {/* Main Grid: Info + Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121316] text-white rounded-3xl p-8 space-y-6 border border-white/10 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider">
                Store Location & Inquiries
              </span>
              <h3 className="font-heading text-2xl font-semibold">Federal Optical</h3>
              <p className="text-xs text-stone-400">
                Your Family Optician Since 1975 • Computerized Eye Clinic
              </p>
            </div>

            <div className="space-y-4 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Karachi Flagship Clinic</p>
                  <p className="text-stone-400">Karachi, Sindh, Pakistan</p>
                  <p className="text-[11px] text-[#C5A880] mt-0.5">Complimentary parking available</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Telephone & WhatsApp</p>
                  <p>{FEDERAL_OPTICAL_PHONE} / {FEDERAL_OPTICAL_PHONE_INTL}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Official Email</p>
                  <p>federaloptical1975@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <InstagramIcon className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Instagram</p>
                  <a href="https://instagram.com/federaloptical" target="_blank" rel="noreferrer" className="text-[#C5A880] hover:underline">
                    @federaloptical
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Shop Hours</p>
                  <p>{SHOP_HOURS.weekdays}</p>
                  <p className="text-stone-400">Sunday: Closed</p>
                  <p className="font-semibold text-white mt-3">Eye Clinic Timings</p>
                  <p>{CLINIC_HOURS.weekdays}</p>
                  <p>{CLINIC_HOURS.sunday}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Clinic map simulation */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E3D8] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-900">
              <span>Karachi Optical Clinic Area</span>
              <span className="text-[#8C7048]">Serving All Karachi</span>
            </div>
            <div className="w-full h-44 rounded-2xl bg-stone-100 overflow-hidden relative flex items-center justify-center text-center p-4 border border-[#E8E3D8]">
              <div className="space-y-1">
                <MapPin className="w-8 h-8 text-[#C5A880] mx-auto animate-bounce" />
                <p className="font-heading text-sm font-semibold text-stone-800">Federal Optical Karachi</p>
                <p className="text-[11px] text-stone-500">Fast delivery across Clifton, DHA, PECHS, Gulshan, Nazimabad, and Bahria Town.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Appointment & Inquiry Tabs */}
        <div className="lg:col-span-7 space-y-8">
          {/* Card 1: Book Computerized Eye Test */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A880]/50 shadow-md space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C7048]">
              <Eye className="w-4 h-4 text-[#C5A880]" />
              <span>In-Store Supporting Service</span>
            </div>
            <div>
              <h3 className="font-heading text-2xl font-semibold text-stone-900">
                Book a Computerized Eye Test
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Schedule an automated refraction examination at our Karachi clinic. Appointments receive priority testing with zero waiting time.
              </p>
            </div>

            {bookingSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Appointment Request Forwarded</p>
                <p>We have opened WhatsApp to confirm your preferred slot with our clinic receptionist.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingState.name}
                      onChange={e => setBookingState({ ...bookingState, name: e.target.value })}
                      placeholder="e.g. Asad Rehman"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5] text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={bookingState.phone}
                      onChange={e => setBookingState({ ...bookingState, phone: e.target.value })}
                      placeholder="0300-XXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5] text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingState.preferredDate}
                      onChange={e => setBookingState({ ...bookingState, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5] text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Time Slot *</label>
                    <select
                      value={bookingState.preferredTime}
                      onChange={e => setBookingState({ ...bookingState, preferredTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5] text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                    >
                      <option value="Morning (11:30 AM – 2:00 PM)">Morning (11:30 AM – 2:00 PM)</option>
                      <option value="Afternoon (2:00 PM – 5:00 PM)">Afternoon (2:00 PM – 5:00 PM)</option>
                      <option value="Evening (5:00 PM – 8:30 PM)">Evening (5:00 PM – 8:30 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-800 mb-1">Notes / Previous History</label>
                  <input
                    type="text"
                    value={bookingState.notes}
                    onChange={e => setBookingState({ ...bookingState, notes: e.target.value })}
                    placeholder="e.g. Existing cylinder prescription, blurred distance vision"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5] text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[#121316] hover:bg-[#252830] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span>Request Eye Test Appointment via WhatsApp</span>
                </button>
              </form>
            )}
          </div>

          {/* Card 2: General Inquiries Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3D8] shadow-xs space-y-4">
            <h3 className="font-heading text-xl font-semibold text-stone-900">
              General Message or Overseas Order Inquiry
            </h3>

            {contactSubmitted ? (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-center text-xs text-stone-700">
                <p className="font-semibold text-stone-900">Inquiry Generated</p>
                <p className="text-[11px] text-stone-500">Opened in WhatsApp for immediate response.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={e => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={e => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="Phone #"
                      className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Inquiry Topic</label>
                    <select
                      value={formState.serviceType}
                      onChange={e => setFormState({ ...formState, serviceType: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    >
                      <option value="Eyewear Frame Inquiry">Frame Sizing / Fit</option>
                      <option value="Contact Lenses In-Stock">Contact Lenses Stock</option>
                      <option value="Overseas Shipping">Overseas Shipping (USA/UK/Canada)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-800 mb-1">Your Message</label>
                  <textarea
                    rows={3}
                    required
                    value={formState.message}
                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                    placeholder="How can our optical team assist you?"
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full border border-stone-800 hover:bg-stone-900 hover:text-white text-stone-900 font-semibold text-xs transition-colors inline-flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
