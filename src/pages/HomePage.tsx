import React from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useNavigation } from '../context/NavigationContext';
import { FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import { InstagramIcon } from '../components/Icons';
import { HeroSlider } from '../components/HeroSlider';
import { ReviewsCarousel } from '../components/ReviewsCarousel';
import { SEO, getLocalBusinessSchema } from '../components/SEO';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  ShieldCheck,
  CheckCircle2,
  Eye
} from 'lucide-react';

// Top 6 Category Tiles mirroring Gaba Optical
const TOP_CATEGORIES = [
  {
    title: "Men’s Eyeglasses",
    subtitle: 'Titanium & Classic Browline',
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=800&auto=format&fit=crop',
    category: 'eyeglasses',
    subCategory: "Men’s Eyeglasses"
  },
  {
    title: "Men’s Sunglasses",
    subtitle: 'Polarized Pilots & Navigators',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
    category: 'sunglasses',
    subCategory: "Men’s Sunglasses"
  },
  {
    title: "Women’s Eyeglasses",
    subtitle: 'Sculpted Cat-Eye & Acetate',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    category: 'eyeglasses',
    subCategory: "Women’s Eyeglasses"
  },
  {
    title: "Women’s Sunglasses",
    subtitle: 'Oversized UV400 & Gradients',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=800&auto=format&fit=crop',
    category: 'sunglasses',
    subCategory: "Women’s Sunglasses"
  },
  {
    title: 'Color Contact Lenses',
    subtitle: 'Bella & Optiano',
    image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374923/federal-optics/assets/images/color_contacts.jpg',
    category: 'color-contacts',
    subCategory: undefined
  },
  {
    title: 'Clear Contact Lenses',
    subtitle: 'Acuvue, Bausch & Lomb & more',
    image: 'https://res.cloudinary.com/tyrukjzt/image/upload/v1794374922/federal-optics/assets/images/clear_contacts.jpg',
    category: 'clear-contacts',
    subCategory: undefined
  }
];

export const HomePage: React.FC = () => {
  const { navigateTo, openCategory } = useNavigation();

  // Filter rail products
  const womensEyeglasses = PRODUCTS.filter(p => p.category === 'eyeglasses' && (p.gender === 'women' || p.gender === 'unisex'));
  const mensEyeglasses = PRODUCTS.filter(p => p.category === 'eyeglasses' && (p.gender === 'men' || p.gender === 'unisex'));
  // same rule as the collection pages: gender-specific items plus unisex ones (labelled "Unisex")
  const womensSunglasses = PRODUCTS.filter(p => p.category === 'sunglasses' && (p.gender === 'women' || p.gender === 'unisex'));
  const mensSunglasses = PRODUCTS.filter(p => p.category === 'sunglasses' && (p.gender === 'men' || p.gender === 'unisex'));
  const activeEyeglasses = PRODUCTS.filter(p => p.subCategory.includes('Active') || p.brand.includes('Adidas') || p.brand.includes('Tom Famous'));
  const teenEyeglasses = PRODUCTS.filter(p => p.gender === 'kids' || p.subCategory.toLowerCase().includes('teen'));
  const tintEyeglasses = PRODUCTS.filter(p => p.category === 'tint-eyeglasses');
  const accessories = PRODUCTS.filter(p => p.category === 'accessories');

  // Scroll handler for horizontal rails
  const scrollRail = (railId: string, direction: 'left' | 'right') => {
    const el = document.getElementById(railId);
    if (!el) return;
    const distance = 360;
    el.scrollBy({ left: direction === 'left' ? -distance : distance, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <SEO
        title="Federal Optical — Computerized Eye Clinic & Designer Eyewear | Karachi, Pakistan"
        description="Karachi’s premier family opticians since 1975. Shop designer eyeglasses, sunglasses, and contact lenses online with easy WhatsApp ordering and delivery across Pakistan, or book your clinical computerized eye exam."
        canonical="/"
        schema={getLocalBusinessSchema()}
      />
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH KEN-BURNS TIMED CROSSFADE (100vh Full Viewport) */}
      {/* ========================================================================= */}
      <HeroSlider />

      {/* ========================================================================= */}
      {/* 2. TOP CATEGORIES TILE STRIP (1:1 Mirror of Gaba Optical’s 6 Tiles) */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
            Explore by Taxonomy
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#121316]">
            Top Eyewear Categories
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Handcrafted optical designs, polarized sunglasses, and certified contact lenses backed by 50 years of optical expertise.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {TOP_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => openCategory(cat.category, cat.subCategory)}
              className="group relative rounded-2xl overflow-hidden aspect-3/4 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E3D8]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-45% to-transparent transition-opacity" />
              <div className="absolute inset-x-3 bottom-4 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#E3CBA6] font-semibold block mb-0.5 line-clamp-2">
                  {cat.subtitle}
                </span>
                <h3 className="font-heading text-sm sm:text-base font-semibold leading-tight group-hover:text-[#C5A880] transition-colors">
                  {cat.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] text-stone-300 font-medium mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3 text-[#C5A880]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "SINCE 1975" HERITAGE STRIP */}
      {/* ========================================================================= */}
      <section className="bg-[#121316] text-white py-16 sm:py-20 relative overflow-hidden border-y border-white/10">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#C5A880]/5 blur-3xl pointer-events-none" />
        <div className="site-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4 flex flex-col items-start space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Golden Jubilee • 1975–2025</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Fifty Years of Family Trust & Vision.
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                Before modern chains and digital shops, Federal Optical opened its doors in 1975 in Karachi with a simple pledge: honest craftsmanship, impeccable refractive testing, and treating every patron like family.
              </p>
              <button
                onClick={() => navigateTo('about')}
                className="mt-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#C5A880] border border-[#C5A880]/40 text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Read the 1975 Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Heritage Pillars */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#C5A880]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880] mb-4">
                  <span className="font-heading text-xl font-semibold">50</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-1">
                  Half a Century in Karachi
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Generations of families—grandparents, parents, and children—have received their first spectacles and progressive fittings under our care.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#C5A880]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880] mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-1">
                  Computerized Eye Clinic
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  In-store computerized refractor testing that precisely measures astigmatism, pupillary distance (PD), and vertex distances for flawless vision.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#C5A880]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880] mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-1">
                  Nationwide & Global Reach
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Serving patrons across Pakistan (Lahore, Islamabad, Faisalabad) plus overseas Pakistani families in USA, UK, and Canada via WhatsApp dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED PRODUCT RAILS (Gaba Optical’s exact rail sequence) */}
      {/* ========================================================================= */}

      {/* RAIL 1: Women’s Eyeglasses */}
      <section className="site-container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7048]">
              Sculpted & Elegant
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              Women’s Eyeglasses
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollRail('rail-we', 'left')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRail('rail-we', 'right')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openCategory('eyeglasses', "Women’s Eyeglasses")}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#8C7048] hover:underline ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          id="rail-we"
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {womensEyeglasses.map(product => (
            <div key={product.id} className="w-[270px] sm:w-[310px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* RAIL 2: Men’s Eyeglasses */}
      <section className="site-container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7048]">
              Executive Titanium & Acetate
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              Men’s Eyeglasses
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollRail('rail-me', 'left')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRail('rail-me', 'right')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openCategory('eyeglasses', "Men’s Eyeglasses")}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#8C7048] hover:underline ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          id="rail-me"
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {mensEyeglasses.map(product => (
            <div key={product.id} className="w-[270px] sm:w-[310px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* RAIL 3: Women’s Sunglasses */}
      <section className="site-container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7048]">
              UV400 High Fashion
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              Women’s Sunglasses
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Scroll left"
              onClick={() => scrollRail('rail-ws', 'left')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollRail('rail-ws', 'right')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openCategory('sunglasses', "Women’s Sunglasses")}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#8C7048] hover:underline ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          id="rail-ws"
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {womensSunglasses.map(product => (
            <div key={product.id} className="w-[270px] sm:w-[310px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* RAIL 4: Men’s Sunglasses */}
      <section className="site-container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7048]">
              True HD Polarized Aviators
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              Men’s Sunglasses
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Scroll left"
              onClick={() => scrollRail('rail-ms', 'left')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollRail('rail-ms', 'right')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openCategory('sunglasses', "Men’s Sunglasses")}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#8C7048] hover:underline ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          id="rail-ms"
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {mensSunglasses.map(product => (
            <div key={product.id} className="w-[270px] sm:w-[310px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PROMO BANNER 1: Precision Vision & Blue-Light Shields */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div data-theme="dark" className="relative rounded-3xl overflow-hidden bg-[#1C1E24] text-white p-8 sm:p-12 lg:p-16 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" />
              <span>Blue-Light Lenses</span>
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-semibold leading-tight">
              Protect Your Vision From Modern Screens.
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Our computerized blue-light shield lenses block 420nm high-energy radiation from computers, tablets, and phones, reducing digital migraine, eye fatigue, and blurred evening vision.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => openCategory('eyeglasses')}
                className="px-6 py-3 rounded-full bg-[#C5A880] hover:bg-[#d6be9c] text-black font-semibold text-xs transition-colors"
              >
                Choose Any Frame to Fit
              </button>
            </div>
          </div>

          <div className="w-full lg:w-96 rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop"
              alt="Blue Light Lens Coating"
              className="w-full h-56 object-cover"
            />
          </div>
        </div>
      </section>

      {/* RAIL 5: Active Eyeglasses */}
      <section className="site-container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7048]">
              High Impact & TR90 Flex
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              Active / Sports Eyeglasses
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Scroll left"
              onClick={() => scrollRail('rail-ac', 'left')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollRail('rail-ac', 'right')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          id="rail-ac"
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {activeEyeglasses.map(product => (
            <div key={product.id} className="w-[270px] sm:w-[310px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* RAIL 5B: Teenage & Kids’ Eyeglasses */}
      {teenEyeglasses.length > 0 && (
        <section className="site-container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7048]">
                Ray-Ban Junior Sheet Acetate & Kids Flex
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
                Teenage & Kids’ Eyeglasses
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRail('rail-teen', 'left')}
                className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollRail('rail-teen', 'right')}
                className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openCategory('eyeglasses', "Teenage & Kids’ Eyeglasses")}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#8C7048] hover:underline ml-2"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            id="rail-teen"
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
          >
            {teenEyeglasses.map(product => (
              <div key={product.id} className="w-[270px] sm:w-[310px] shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RAIL 6: Tint Eyeglasses (Federal Tints) — hidden until real tint products exist */}
      {tintEyeglasses.length > 0 && (
      <section className="site-container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7048]">
              Federal Tints
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              Tint & Photochromic Eyeglasses
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Scroll left"
              onClick={() => scrollRail('rail-tn', 'left')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollRail('rail-tn', 'right')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          id="rail-tn"
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {tintEyeglasses.map(product => (
            <div key={product.id} className="w-[270px] sm:w-[310px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* PROMO BANNER 2: Federal Care / Computerized Eye Test (Modest, Well-Placed) */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#C5A880]/40 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/15 text-[#8C7048] text-xs font-semibold tracking-wider uppercase">
              <Eye className="w-3.5 h-3.5" />
              <span>In-Store Supporting Service</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-[#121316]">
              Federal Optical — Computerized Eye Clinic
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              While our primary business is retail eyewear, our in-house Karachi optometrists offer computerized automated refraction testing to ensure your spherical, cylindrical, and axis values are 100% accurate before fitting your frames.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-stone-700 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                Automated Refractometry
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                Digital Pupillary Distance (PD)
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                Comfort Trial Frames
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => navigateTo('federal-care')}
              className="px-6 py-3.5 rounded-full bg-[#121316] hover:bg-[#252830] text-white font-medium text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Book Appointment Slot</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
            <a
              href={`https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to book a computerized eye checkup at Federal Optical Karachi.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-full border border-[#C5A880] hover:bg-[#C5A880] hover:text-white text-[#8C7048] font-semibold text-xs sm:text-sm transition-all text-center"
            >
              Inquire via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* RAIL 7: Glasses Care & Accessories */}
      <section className="site-container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7048]">
              Maintenance & Precision Care
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              Glasses Care & Accessories
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Scroll left"
              onClick={() => scrollRail('rail-ac2', 'left')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollRail('rail-ac2', 'right')}
              className="p-2 rounded-full border border-[#E8E3D8] hover:bg-[#F3EFE8] text-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          id="rail-ac2"
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {accessories.map(product => (
            <div key={product.id} className="w-[270px] sm:w-[310px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TESTIMONIALS & TRUST STRIP */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
            Customer Stories
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
            Trusted by Generations Since 1975
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            What our customers say about us on Google.
          </p>
        </div>

        <ReviewsCarousel />
      </section>

      {/* ========================================================================= */}
      {/* 6. INSTAGRAM FEED TEASER STRIP */}
      {/* ========================================================================= */}
      <section className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C7048] mb-1">
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Follow Our Visual Journal</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              @federaloptical
            </h2>
          </div>
          <a
            href="https://instagram.com/federaloptical"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 hover:border-black text-stone-900 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <span>Follow on Instagram</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
              caption: 'Champagne titanium frames catch the sunset'
            },
            {
              image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=600&auto=format&fit=crop',
              caption: 'Crafted with Japanese titanium joints'
            },
            {
              image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=600&auto=format&fit=crop',
              caption: 'Margot Cat-Eye in warm Havana acetate'
            },
            {
              image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
              caption: 'Freshlook Pure Hazel natural lens fitting'
            }
          ].map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com/federaloptical"
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-2xl overflow-hidden aspect-square border border-[#E8E3D8] shadow-xs"
            >
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                <p className="text-white text-xs font-medium">{item.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
