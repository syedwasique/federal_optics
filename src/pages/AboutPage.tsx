import React from 'react';
import { SEO } from '../components/SEO';
import { useNavigation } from '../context/NavigationContext';
import { FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import {
  Award,
  ShieldCheck,
  Heart,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { openCategory } = useNavigation();

  const TIMELINE_MILESTONES = [
    {
      year: '1975',
      title: 'The Founding in Karachi',
      description:
        'Federal Optical opens its original doors in Karachi as an independent neighborhood optician shop, committed to honest refraction, bespoke lens edging, and personalized family service.'
    },
    {
      year: '1988',
      title: 'Computerized Eye Clinic Launch',
      description:
        'Pioneering the transition from manual retinomancy to automated computerized refractor diagnostics in Karachi, ensuring accurate spherical, cylindrical, and axis measurements.'
    },
    {
      year: '2002',
      title: 'Japanese Titanium & Italian Acetate',
      description:
        'Federal Optical expands its curated retail catalog with hand-polished Mazzucchelli acetate and featherweight beta-titanium frames, matching European boutique optical standards.'
    },
    {
      year: '2015',
      title: 'Nationwide & Overseas Dispatch',
      description:
        'With thousands of Karachi families relocating to Lahore, Islamabad, or overseas (London, Toronto, Houston), Federal Optical initiates secure WhatsApp prescription verification and DHL dispatch.'
    },
    {
      year: '2025',
      title: 'Golden Jubilee — 50 Years of Trust',
      description:
        'Celebrating half a century of continuous service as "Your Family Optician Since 1975", outfitting 3 generations of visionaries with precision optics.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <SEO
        title="Our Story — 50 Years of Optical Heritage Since 1975"
        description="Learn about Federal Optical’s 50-year heritage in Karachi. Providing precision computerized eye tests, curated luxury eyewear, and family vision care since 1975."
        canonical="/about"
      />
      {/* Hero Header */}
      <section data-theme="dark" className="relative bg-[#121316] text-white pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Golden Jubilee • 1975 to 2025</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
            Half a Century of Trust, Vision, & Family Craftsmanship.
          </h1>

          <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Federal Optical was founded in 1975 in Karachi, Sindh. Not as an impersonal corporate chain, but as a family optician where every customer is known by name and treated with generational care.
          </p>
        </div>
      </section>

      {/* Heritage Narrative & Image */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-stone-700 leading-relaxed text-sm sm:text-base">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
              Our Karachi Origins
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900 leading-tight">
              From a Modest Karachi Shop to an Optical Institution
            </h2>
            <p>
              In 1975, when the optical trade in Pakistan relied largely on manual trail lenses and simple glass grinding, Federal Optical established its foundational principle: <strong>visual clarity cannot be compromised</strong>.
            </p>
            <p>
              Over the decades, as Karachi expanded and modernized, our boutique optical shop evolved into a computerized eye clinic equipped with high-precision digital automated refractor machines, while keeping the warmth of a family establishment intact.
            </p>
            <p>
              Today, customers whose parents brought them to Federal Optical in the 1980s now bring their own children and grandchildren to be fitted with flexible safe frames, digital blue-light shields, and German progressive lenses.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>100% Genuine Lenses</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <Heart className="w-4 h-4 text-[#C5A880]" />
                <span>Three Generations of Family Patrons</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-[#E8E3D8] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1000&auto=format&fit=crop"
                alt="Federal Optical Heritage Craft"
                className="w-full h-[450px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#121316] text-white p-6 rounded-2xl shadow-xl border border-white/10 hidden sm:block max-w-xs">
              <span className="font-heading text-2xl font-semibold text-[#C5A880] block">
                1975 — 2025
              </span>
              <p className="text-xs text-stone-400 mt-1">
                Celebrating 50 years of optical precision and authentic family care in Karachi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 50-Year Milestones Timeline */}
      <section className="bg-[#FAF8F5] py-16 border-y border-[#E8E3D8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
              Five Decades of Excellence
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
              The Federal Optical Journey
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              How a Karachi family optician grew into a trusted nationwide and international eyewear brand.
            </p>
          </div>

          <div className="relative border-l-2 border-[#C5A880]/40 ml-4 sm:ml-32 space-y-10">
            {TIMELINE_MILESTONES.map((item, index) => (
              <div key={index} className="relative pl-6 sm:pl-10 group">
                {/* Year Badge on left for desktop */}
                <div className="sm:absolute sm:-left-32 sm:text-right sm:w-24 top-0 font-heading text-xl sm:text-2xl font-semibold text-[#8C7048]">
                  {item.year}
                </div>

                {/* Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#FAF8F5] border-2 border-[#C5A880] group-hover:bg-[#C5A880] transition-colors" />

                <div className="bg-white rounded-2xl p-6 border border-[#E8E3D8] shadow-xs hover:border-[#C5A880]/60 transition-colors">
                  <h3 className="font-heading text-lg font-semibold text-stone-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global & Nationwide Reach */}
      <section className="site-container">
        <div className="bg-[#121316] rounded-3xl p-8 sm:p-14 text-white border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
              Overseas Patrons Welcome
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold leading-tight">
              Serving Pakistan & Overseas Diaspora in USA, UK, and Canada.
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Living abroad and looking for tailored frame bridges and optical prescription accuracy? You can easily order via our direct WhatsApp desk. We accept foreign prescriptions and dispatch via DHL express.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Federal Optical! I am an overseas customer inquiring about international shipping.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-full bg-[#C5A880] hover:bg-[#d6be9c] text-black font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>WhatsApp International Desk</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => openCategory('eyeglasses')}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all"
            >
              Browse Catalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
