import React from 'react';
import { SEO, getLocalBusinessSchema } from '../components/SEO';
import { useNavigation } from '../context/NavigationContext';
import { FEDERAL_OPTICAL_PHONE, FEDERAL_OPTICAL_PHONE_INTL } from '../context/CartContext';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Calendar,
  Truck,
  ShieldCheck,
  Eye,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const OurStoresPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="space-y-16 sm:space-y-20 pb-24">
      <SEO
        title="Visit Our Clinic & Store | Federal Optical Karachi"
        description="Visit Federal Optical in Karachi. Experience state-of-the-art computerized eye testing, personalized frame fitting, and browse over 500+ curated designer glasses."
        canonical="/stores"
        schema={getLocalBusinessSchema()}
      />
      {/* Hero */}
      <section data-theme="dark" className="bg-[#121316] text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Store Locator & Clinical Destination</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold leading-tight">
            Our Karachi Flagship Store & Clinic
          </h1>
          <p className="text-stone-300 text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
            Experience 50 years of optical craftsmanship in person. Visit our computerized diagnostic refraction suite and explore over 1,000 curated designer frames.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Store Profile Card */}
        <section className="bg-white rounded-3xl border border-[#E8E3D8] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Store Image Showcase */}
            <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1200&auto=format&fit=crop"
                alt="Federal Optical Store Interior"
                className="w-full h-full object-cover min-h-[340px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-bold text-[#C5A880] uppercase tracking-wider">
                  Flagship Store & Diagnostic Suite
                </span>
                <h3 className="font-heading text-2xl font-semibold">
                  Federal Optical Karachi
                </h3>
                <p className="text-xs text-stone-300">
                  Serving three generations of Karachi families since 1975
                </p>
              </div>
            </div>

            {/* Right: Key Details */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7048]">
                      Status Today
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-stone-900 text-sm">Open for Clinical Walk-ins</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E3D8] text-[11px] font-semibold text-stone-700">
                    Est. 1975
                  </span>
                </div>

                {/* Information List */}
                <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#8C7048] shrink-0 mt-1" />
                    <div>
                      <strong className="block text-stone-900 font-semibold">Store Address:</strong>
                      <p className="text-stone-600 mt-0.5 leading-relaxed">
                        Federal Optical — Computerized Eye Clinic & Eyewear Gallery <br />
                        Karachi, Sindh, Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#8C7048] shrink-0 mt-1" />
                    <div>
                      <strong className="block text-stone-900 font-semibold">Shop Hours:</strong>
                      <p className="text-stone-600 mt-0.5">
                        Monday – Saturday: <span className="font-semibold text-stone-900">11:00 AM – 9:30 PM</span> <br />
                        Sunday: <span className="text-stone-500">Closed (On-Call WhatsApp Support)</span>
                      </p>
                      <strong className="block text-stone-900 font-semibold mt-3">Eye Clinic Timings:</strong>
                      <p className="text-stone-600 mt-0.5">
                        Monday – Saturday: <span className="font-semibold text-stone-900">5:30 PM – 10:30 PM</span> <br />
                        Sunday: <span className="font-semibold text-stone-900">2:00 PM – 4:00 PM</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#8C7048] shrink-0 mt-1" />
                    <div>
                      <strong className="block text-stone-900 font-semibold">Direct Store Line:</strong>
                      <p className="text-stone-600 mt-0.5">
                        <a href={`tel:${FEDERAL_OPTICAL_PHONE}`} className="hover:text-black font-semibold text-stone-900 underline">
                          {FEDERAL_OPTICAL_PHONE}
                        </a>{' '}
                        / {FEDERAL_OPTICAL_PHONE_INTL}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 border-t border-[#E8E3D8] flex flex-col sm:flex-row gap-3">
                <a
                  href="https://maps.google.com/?q=Federal+Optical+Karachi"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#121316] hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Get Directions on Google Maps</span>
                </a>
                <button
                  onClick={() => navigateTo('federal-care')}
                  className="py-3 px-5 rounded-xl bg-[#C5A880] hover:bg-[#b09165] text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Eye Exam</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Amenities in Store */}
        <section className="bg-white rounded-3xl border border-[#E8E3D8] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
              In-Store Experience
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              What You Will Find at Our Karachi Clinic
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm max-w-2xl">
              Unlike ordinary optical stalls, our clinic combines Japanese computerized refraction instruments with comprehensive frame customization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A880]/20 flex items-center justify-center text-[#8C7048]">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Computerized Diagnostic Suite</h4>
              <p className="text-stone-600 text-xs leading-relaxed">
                Objective auto-refraction and digital pupillometry providing precision cylinder, axis, and power readings in minutes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A880]/20 flex items-center justify-center text-[#8C7048]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Same-Day Lens Glazing Lab</h4>
              <p className="text-stone-600 text-xs leading-relaxed">
                In-house CNC diamond edgers allow single-vision blue-light and anti-glare lenses to be prepared in under 90 minutes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A880]/20 flex items-center justify-center text-[#8C7048]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Sterile Contact Lens Station</h4>
              <p className="text-stone-600 text-xs leading-relaxed">
                Trial blister packs, sterile mirror vanity, corneal curvature fitting, and genuine solutions from Acuvue, Freshlook, and Bella.
              </p>
            </div>
          </div>
        </section>

        {/* Nationwide & International Dispatch Notice */}
        <section className="bg-gradient-to-br from-[#121316] to-[#1E2026] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              <span>Not in Karachi? We Ship Everywhere</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-semibold">
              Nationwide Delivery Across Pakistan & Worldwide
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Living in Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, or overseas in the USA, UK, or Canada? Order via WhatsApp by sharing your doctor’s slip. We glaze your lenses and ship with tracked couriers right to your doorstep.
            </p>
          </div>

          <button
            onClick={() => navigateTo('catalog')}
            className="px-6 py-3.5 rounded-full bg-[#C5A880] hover:bg-[#b09165] text-black font-semibold text-xs transition-colors shrink-0 flex items-center gap-2 shadow-md"
          >
            <span>Browse Complete Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </div>
  );
};
export default OurStoresPage;
