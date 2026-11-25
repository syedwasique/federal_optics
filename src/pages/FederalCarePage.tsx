import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import { SEO, getLocalBusinessSchema, getBreadcrumbSchema } from '../components/SEO';
import { CLINIC_HOURS, CLINIC_SLOTS } from '../data/hours';
import {
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Users,
  Eye,
  Send
} from 'lucide-react';

export const FederalCarePage: React.FC = () => {
  const { params } = useNavigation();
  const [activeTab, setActiveTab] = useState<'clinic' | 'on-site'>('clinic');

  useEffect(() => {
    if (params.subCategory) {
      const sub = params.subCategory.toLowerCase();
      if (sub.includes('on-site') || sub.includes('onsite')) {
        setActiveTab('on-site');
      } else if (sub.includes('clinic') || sub.includes('store') || sub.includes('book')) {
        setActiveTab('clinic');
      }
    }
  }, [params.subCategory]);

  // In-store booking form
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: CLINIC_SLOTS[0],
    purpose: 'Routine Computerized Refraction Test'
  });
  const [isBooked, setIsBooked] = useState(false);

  // On-site visit request form
  const [onSiteForm, setOnSiteForm] = useState({
    organization: '',
    contactPerson: '',
    phone: '',
    location: '',
    estimatedPeople: '10 – 25 Persons',
    preferredDate: '',
    notes: ''
  });
  const [isOnSiteRequested, setIsOnSiteRequested] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `👓 *FEDERAL OPTICAL — IN-STORE EYE APPOINTMENT*\n\nName: ${bookingForm.name}\nPhone: ${bookingForm.phone}\nDate: ${bookingForm.date}\nTime Slot: ${bookingForm.timeSlot}\nPurpose: ${bookingForm.purpose}`;
    const url = `https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsBooked(true);
  };

  const handleOnSiteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `🚐 *FEDERAL OPTICAL — ON-SITE EYE TEST REQUEST*\n\nOrganization/Client: ${onSiteForm.organization}\nContact Person: ${onSiteForm.contactPerson}\nPhone/WhatsApp: ${onSiteForm.phone}\nLocation/Address: ${onSiteForm.location}\nEstimated Headcount: ${onSiteForm.estimatedPeople}\nPreferred Date: ${onSiteForm.preferredDate}\nSpecial Requirements: ${onSiteForm.notes || 'None'}`;
    const url = `https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOnSiteRequested(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <SEO
        title="Federal Care — In-Store & On-Site Computerized Eye Tests"
        description="Book a computerized eye refraction test at our Karachi clinic, or arrange an on-site eye test with Federal Optical."
        canonical="/federal-care"
        schema={[
          getLocalBusinessSchema(),
          getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Federal Care', url: '/federal-care' }
          ])
        ]}
      />
      {/* Hero */}
      <section data-theme="dark" className="bg-[#121316] text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Federal Care • Clinical & Community Services</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold leading-tight">
            Comprehensive Eyecare for Karachi & Beyond
          </h1>
          <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
            In addition to our extensive retail frame collections, Federal Optical provides computerized eye refraction exams at our Karachi clinic and on-site eye tests at your location.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="site-container">
        <div className="-mx-[var(--gutter)] px-[var(--gutter)] sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar border-b border-[#E8E3D8] mb-12" data-lenis-prevent>
          <div className="flex w-max sm:w-auto sm:justify-center gap-2 sm:gap-4 mx-auto">
            <button
              onClick={() => setActiveTab('clinic')}
              className={`pb-4 px-3 sm:px-4 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                activeTab === 'clinic'
                  ? 'border-[#C5A880] text-[#121316]'
                  : 'border-transparent text-stone-500 hover:text-black'
              }`}
            >
              In-Store Eye Test
            </button>
            <button
              onClick={() => setActiveTab('on-site')}
              className={`pb-4 px-3 sm:px-4 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'on-site'
                  ? 'border-[#C5A880] text-[#121316]'
                  : 'border-transparent text-stone-500 hover:text-black'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
              <span>On-Site Eye Test</span>
            </button>
          </div>
        </div>

        {/* TAB 1: In-Store Eye Test */}
        {activeTab === 'clinic' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
                Computerized Eye Clinic
              </span>
              <h2 className="font-heading text-3xl font-semibold text-stone-900">
                Precision Automated Refraction Testing
              </h2>
              <p>
                Our Karachi store features a dedicated clinical diagnostic testing room. While many shops guess power based on old glasses, our optometrists carry out a multi-step objective and subjective evaluation.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3D8]">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Automated Refractometry</h4>
                    <p className="text-stone-600 text-xs mt-0.5">
                      Fast, painless digital infrared ray measurement calculating your spherical power and astigmatic cylinder within seconds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3D8]">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Digital Pupillary Distance (PD)</h4>
                    <p className="text-stone-600 text-xs mt-0.5">
                      Ensures the optical center of your lenses aligns with your exact line of sight, preventing eye strain and swimming sensations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3D8]">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Subjective Trial Frame Walking Test</h4>
                    <p className="text-stone-600 text-xs mt-0.5">
                      You wear trial lenses around our shop to verify comfort, depth perception, and reading naturalness before lenses are cut.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A880]/40 shadow-xl space-y-5">
              <h3 className="font-heading text-2xl font-semibold text-stone-900">
                Book Your In-Store Eye Exam
              </h3>
              <p className="text-xs text-stone-600">
                Reserve an appointment to bypass waiting times. Routine examinations take approximately 15 minutes.
              </p>

              {isBooked ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Appointment Booking Sent to WhatsApp</p>
                  <p>Our receptionist will verify the slot with you immediately on WhatsApp.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                      placeholder="e.g. Farooq Sattar"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        value={bookingForm.phone}
                        onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        placeholder="0300-XXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Time Slot *</label>
                    <select
                      value={bookingForm.timeSlot}
                      onChange={e => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    >
                      {CLINIC_SLOTS.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[11px] text-stone-500">
                      Eye clinic timings: {CLINIC_HOURS.weekdays} · {CLINIC_HOURS.sunday}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#121316] hover:bg-[#252830] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#C5A880]" />
                    <span>Confirm Slot on WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: On-Site Eye Test (NEW: Distinct from in-store) */}
        {activeTab === 'on-site' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
                Mobile Diagnostic Service
              </span>
              <h2 className="font-heading text-3xl font-semibold text-stone-900">
                On-Site Clinical Eye Tests at Your Location
              </h2>
              <p>
                Cannot visit our Karachi store? Federal Optical’s certified optometric teams travel on-location to private residences, corporate headquarters, diplomatic missions, and retirement facilities across Karachi.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3D8]">
                  <Eye className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Portable Digital Auto-Refractors</h4>
                    <p className="text-stone-600 text-xs mt-0.5">
                      We bring hospital-grade portable handheld refractometers and illuminated visual acuity charts directly into your boardroom or living lounge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3D8]">
                  <Users className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Curated Frame Trunk Show</h4>
                    <p className="text-stone-600 text-xs mt-0.5">
                      Alongside clinical testing, our dispensing opticians bring 150+ selected designer frames for you and your team to try on in natural lighting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E3D8]">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Direct Glazing & Delivery</h4>
                    <p className="text-stone-600 text-xs mt-0.5">
                      Prescriptions are glazed in our Karachi laboratory and hand-delivered directly back to your address within 48 to 72 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* On-Site Request Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A880]/40 shadow-xl space-y-5">
              <h3 className="font-heading text-2xl font-semibold text-stone-900">
                Request an On-Location Eye Test Visit
              </h3>
              <p className="text-xs text-stone-600">
                Available for corporate offices, family estates, senior care homes, and institutional groups in Karachi.
              </p>

              {isOnSiteRequested ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">On-Site Request Forwarded to Clinical Desk</p>
                  <p>Our chief optometrist will contact you to coordinate dates and equipment setup.</p>
                </div>
              ) : (
                <form onSubmit={handleOnSiteRequest} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Company / Organization / Family Name *</label>
                    <input
                      type="text"
                      required
                      value={onSiteForm.organization}
                      onChange={e => setOnSiteForm({ ...onSiteForm, organization: e.target.value })}
                      placeholder="e.g. Standard Chartered Bank / Private Residence"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Contact Person *</label>
                      <input
                        type="text"
                        required
                        value={onSiteForm.contactPerson}
                        onChange={e => setOnSiteForm({ ...onSiteForm, contactPerson: e.target.value })}
                        placeholder="e.g. Asad Rizvi"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        value={onSiteForm.phone}
                        onChange={e => setOnSiteForm({ ...onSiteForm, phone: e.target.value })}
                        placeholder="0300-XXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Location / Area in Karachi *</label>
                      <input
                        type="text"
                        required
                        value={onSiteForm.location}
                        onChange={e => setOnSiteForm({ ...onSiteForm, location: e.target.value })}
                        placeholder="e.g. Clifton / DHA / I.I. Chundrigar"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Estimated People to Test</label>
                      <select
                        value={onSiteForm.estimatedPeople}
                        onChange={e => setOnSiteForm({ ...onSiteForm, estimatedPeople: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      >
                        <option value="1 – 5 Persons (Executive/Private)">1 – 5 Persons (Executive / Private)</option>
                        <option value="5 – 15 Persons">5 – 15 Persons</option>
                        <option value="15 – 50 Persons (Corporate)">15 – 50 Persons (Corporate)</option>
                        <option value="50+ Persons (Large Campus)">50+ Persons (Large Campus)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={onSiteForm.preferredDate}
                      onChange={e => setOnSiteForm({ ...onSiteForm, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#121316] hover:bg-[#252830] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#C5A880]" />
                    <span>Send On-Site Request to WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
export default FederalCarePage;
