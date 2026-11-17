import React, { useEffect } from 'react';
import { SEO, getBreadcrumbSchema } from '../components/SEO';
import { useNavigation } from '../context/NavigationContext';
import {
  Eye,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Laptop,
  BookOpen,
  Activity,
  ArrowRight
} from 'lucide-react';

export const VisionCarePage: React.FC = () => {
  const { openCategory, params } = useNavigation();

  // Menu links (Single Vision, Progressive, ...) pass a section key: scroll to that lens card
  const focus = params.subCategory;
  useEffect(() => {
    if (!focus) return;
    const t = window.setTimeout(() => {
      document.getElementById('lens-' + focus)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
    return () => window.clearTimeout(t);
  }, [focus]);

  const slugFor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('progressive')) return 'progressive';
    if (t.includes('single vision')) return 'single-vision';
    if (t.includes('anti-fatigue')) return 'anti-fatigue';
    if (t.includes('office')) return 'office';
    if (t.includes('myopia')) return 'myopia';
    if (t.includes('blue')) return 'blue-light';
    return undefined;
  };

  const LENS_TYPES = [
    {
      title: 'Blue-Light / Computerized Lenses',
      badge: 'Federal Clinic Signature',
      icon: Laptop,
      description:
        'Engineered specifically to shield your eyes from high-energy visible (HEV) 420nm blue wavelengths emitted by digital screens, smartphones, and LED office lights.',
      benefits: [
        'Reduces digital eye strain and end-of-day headaches',
        'Improves contrast clarity on laptop and mobile monitors',
        'Helps maintain healthy natural circadian sleep cycles'
      ]
    },
    {
      title: 'Precision Progressive Multi-Focal Lenses',
      badge: 'Master German Surfacing',
      icon: Eye,
      description:
        'Seamless three-zone vision without the unsightly bifocal line. Allows smooth, continuous focus from distant horizons down to intermediate computer monitors and smartphone reading.',
      benefits: [
        'Ultra-wide reading corridor with minimal peripheral swim',
        'Custom pantoscopic tilt and vertex distance optimization',
        'Natural head posture with zero neck fatigue'
      ]
    },
    {
      title: 'Single Vision Precision Lenses',
      badge: 'Everyday Clarity',
      icon: Sparkles,
      description:
        'Custom surfaced for either distance vision (myopia / driving) or reading vision (hyperopia / book reading). Multi-coated with double-sided anti-reflective shielding.',
      benefits: [
        'Crystal clear 1.56 or high-index 1.67 thin profiles',
        'Double-sided Anti-Reflective (AR) glare elimination',
        'Oleophobic smudge and oil repelling treatment'
      ]
    },
    {
      title: 'Anti-Fatigue Accommodation Lenses',
      badge: 'Modern Working Professionals',
      icon: Activity,
      description:
        'Single vision lenses with a subtle +0.50 to +0.80 power boost in the lower reading zone to relieve the ciliary muscle from constant near-focus contraction.',
      benefits: [
        'Ideal for professionals aged 20–40 on screens 8+ hours',
        'Prevents burning sensation and eye redness',
        'Eases the transition before full progressives are needed'
      ]
    },
    {
      title: 'Office & Room Intermediate Lenses',
      badge: 'Workspace Optimization',
      icon: BookOpen,
      description:
        'Designed specifically for indoor and desk environments, delivering razor-sharp vision across your keyboard, monitor, and colleagues across the conference desk.',
      benefits: [
        'Wider intermediate zone than standard progressive lenses',
        'Great depth of field up to 4 meters inside rooms',
        'Perfect for architects, accountants, and doctors'
      ]
    },
    {
      title: 'Myopia Management Lenses for Children',
      badge: 'Pediatric Vision Care',
      icon: ShieldCheck,
      description:
        'Specialized peripheral defocus lenses scientifically developed to slow down the progression of nearsightedness in growing children aged 6–16.',
      benefits: [
        'Slows axial eye elongation significantly',
        'Fitted into flexible impact-proof junior frames',
        'Monitored through regular Karachi clinic checkups'
      ]
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <SEO
        title="Ophthalmic Lenses & Vision Care in Pakistan — Blue Cut, Progressives & Coatings"
        description="Explore precision optical lens solutions in Pakistan. Custom digital progressives, blue cut screen protection, photochromic transitions, and anti-reflective lenses at Federal Optical Karachi."
        canonical="/vision-care"
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Vision Care', url: '/vision-care' }
        ])}
      />
      {/* Hero */}
      <section data-theme="dark" className="bg-[#121316] text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" />
            <span>Federal Optical Vision Care Guide</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold leading-tight">
            The Science of Ophthalmic Lenses
          </h1>
          <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
            The right frame gives you style; the right lens gives you clarity and health. Explore our comprehensive guide to lens technologies, coatings, and digital screen protection.
          </p>
        </div>
      </section>

      {/* Lens Types Grid */}
      <section className="site-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LENS_TYPES.map((lens, idx) => {
            const Icon = lens.icon;
            return (
              <div
                key={idx}
                id={slugFor(lens.title) ? 'lens-' + slugFor(lens.title) : undefined}
                className={`scroll-mt-28 bg-white rounded-3xl p-6 border shadow-xs hover:border-[#C5A880]/60 hover:shadow-lg transition-all flex flex-col justify-between ${focus && slugFor(lens.title) === focus ? 'border-[#C5A880] ring-2 ring-[#C5A880]/40' : 'border-[#E8E3D8]'}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] flex items-center justify-center text-[#8C7048]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#8C7048] border border-[#E8E3D8]">
                      {lens.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-stone-900 pt-1">
                    {lens.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {lens.description}
                  </p>

                  <div className="pt-2 border-t border-[#E8E3D8]/60 space-y-1.5 text-xs text-stone-700">
                    <span className="font-semibold text-[11px] text-stone-900 block uppercase tracking-wider">
                      Key Optical Benefits:
                    </span>
                    {lens.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[#E8E3D8]">
                  <button
                    onClick={() => openCategory('eyeglasses')}
                    className="w-full py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#121316] text-stone-800 hover:text-white text-xs font-semibold transition-all border border-[#E8E3D8] flex items-center justify-center gap-1.5"
                  >
                    <span>Choose Frames for this Lens</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Coatings Showcase */}
      <section className="site-container">
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#E8E3D8] space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
              Surface Chemistry
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
              Federal Multi-Coat Lens Shielding
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Every prescription lens prepared in our computerized optical laboratory is sealed with multi-layer vacuum deposition coatings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-[#E8E3D8] space-y-2">
              <h4 className="font-heading text-base font-semibold text-stone-900">
                Double-Sided Anti-Reflective (AR)
              </h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Eliminates reflection from front and back surfaces, maximizing light transmission to 99.6% for pure crystal vision and sharp night driving.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8E3D8] space-y-2">
              <h4 className="font-heading text-base font-semibold text-stone-900">
                Hydrophobic Water Repellent
              </h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Causes raindrops and coastal moisture to bead up and roll off instantly without streaking across your line of sight.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8E3D8] space-y-2">
              <h4 className="font-heading text-base font-semibold text-stone-900">
                Oleophobic Smudge Shield
              </h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Repels skin oils and fingerprint smudges, making cleaning effortless with just a single wipe of our microfiber cloth.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8E3D8] space-y-2">
              <h4 className="font-heading text-base font-semibold text-stone-900">
                Diamond Hard-Coat
              </h4>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Tough polysiloxane barrier providing scratch resistance against everyday dust, desk friction, and micro-particles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
