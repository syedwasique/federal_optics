import React, { useState, useEffect, useMemo } from 'react';
import { useCart, FEDERAL_OPTICAL_PHONE, FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { PRODUCTS } from '../data/products';
import { searchProducts } from '../utils/productSearch';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  MapPin,
  HelpCircle
} from 'lucide-react';

const DISPOSABILITY_ORDER = [
  { id: 'daily', label: 'Daily' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'three-month', label: '3-Month' },
  { id: 'six-month', label: '6-Month' },
  { id: 'yearly', label: 'Yearly' }
];

function disposabilityOptions(category: string) {
  return DISPOSABILITY_ORDER.filter(d => PRODUCTS.some(p => p.category === category && p.disposability === d.id));
}

export const Header: React.FC = () => {
  const { totalCount, setIsCartOpen } = useCart();
  const { currentView, navigateTo, openProduct, openCategory } = useNavigation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPanel, setDrawerPanel] = useState<
    | 'main'
    | 'clear-contacts'
    | 'clear-contacts-brands'
    | 'clear-contacts-disposability'
    | 'color-contacts'
    | 'color-contacts-collections'
    | 'color-contacts-brands'
    | 'color-contacts-colors'
    | 'color-contacts-disposability'
    | 'eyeglasses'
    | 'sunglasses'
    | 'federal-care'
  >('main');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically compute brands from product data (no hardcoded list)
  const clearContactBrands = useMemo(() => {
    const brands = new Set<string>();
    PRODUCTS.filter(p => p.category === 'clear-contacts').forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, []);

  const colorContactBrands = useMemo(() => {
    const brands = new Set<string>();
    PRODUCTS.filter(p => p.category === 'color-contacts').forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, []);

  // Only offer disposability links that actually have products behind them
  const clearDisposabilities = useMemo(() => disposabilityOptions('clear-contacts'), []);
  const colorDisposabilities = useMemo(() => disposabilityOptions('color-contacts'), []);
  const hasTintProducts = useMemo(() => PRODUCTS.some(p => p.category === 'tint-eyeglasses'), []);

  const colorContactCollections = useMemo(() => {
    const colls = new Set<string>();
    PRODUCTS.filter(p => p.category === 'color-contacts').forEach(p => {
      if (p.subCategory) colls.add(p.subCategory);
    });
    return Array.from(colls).sort();
  }, []);
  
  // Dynamic background detection state: true when over dark section, false when over light section
  const [isDarkBg, setIsDarkBg] = useState(
    ['home', 'about', 'federal-care', 'faq', 'stores', 'policies'].includes(currentView)
  );

  useEffect(() => {
    const updateHeaderTheme = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 15);

      // Probe element under center of the fixed header (y = 40px)
      const sampleX = Math.min(window.innerWidth / 2, 800);
      const sampleY = 40;
      const elements = document.elementsFromPoint(sampleX, sampleY);

      const underlying = elements.find(
        el =>
          !el.closest('header') &&
          !el.closest('[role="dialog"]') &&
          !el.classList.contains('pointer-events-none')
      );

      if (underlying) {
        // Check if underlying or any ancestor has dark theme declaration
        const darkAncestor = underlying.closest(
          '[data-theme="dark"], .bg-\\[\\#121316\\], .bg-\\[\\#1C1E24\\], footer, [data-dark-bg="true"]'
        );

        if (darkAncestor) {
          setIsDarkBg(true);
          return;
        }

        // Computed background color luminance check
        let el: HTMLElement | null = underlying as HTMLElement;
        let isDark = false;
        while (el && el !== document.body && el !== document.documentElement) {
          const bg = window.getComputedStyle(el).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
              const r = parseInt(match[1], 10);
              const g = parseInt(match[2], 10);
              const b = parseInt(match[3], 10);
              const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
              if (luminance < 0.4) {
                isDark = true;
              }
            }
            break;
          }
          el = el.parentElement;
        }
        setIsDarkBg(isDark);
      } else {
        // Fallback based on route
        const heroThreshold = currentView === 'home' ? window.innerHeight - 80 : 450;
        if (['home', 'about', 'federal-care'].includes(currentView) && scrollY < heroThreshold) {
          setIsDarkBg(true);
        } else {
          setIsDarkBg(false);
        }
      }
    };

    window.addEventListener('scroll', updateHeaderTheme, { passive: true });
    window.addEventListener('resize', updateHeaderTheme, { passive: true });
    updateHeaderTheme();

    const timer = setTimeout(updateHeaderTheme, 80);

    return () => {
      window.removeEventListener('scroll', updateHeaderTheme);
      window.removeEventListener('resize', updateHeaderTheme);
      clearTimeout(timer);
    };
  }, [currentView]);

  // Lock body scroll when drawer or search is open
  useEffect(() => {
    if (drawerOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen, searchOpen]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerPanel('main');
  };

  // Full-catalogue search (all words, any order, typo/synonym tolerant)
  const search = useMemo(() => searchProducts(PRODUCTS, searchQuery), [searchQuery]);
  const searchResults = search.results;
  const [activeResult, setActiveResult] = useState(0);
  const updateQuery = (q: string) => {
    setSearchQuery(q);
    setActiveResult(0);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const openSearchResult = (id: string) => {
    closeSearch();
    openProduct(id);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    } else if (e.key === 'ArrowDown' && searchResults.length) {
      e.preventDefault();
      setActiveResult(i => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp' && searchResults.length) {
      e.preventDefault();
      setActiveResult(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && searchResults[activeResult]) {
      e.preventDefault();
      openSearchResult(searchResults[activeResult].id);
    }
  };

  // keep the keyboard-highlighted result in view
  useEffect(() => {
    document.getElementById(`search-result-${activeResult}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeResult]);

  return (
    <>
      {/* ========================================================================= */}
      {/* MAIN NAVBAR ROW (Fixed across entire site, dynamic background adapt)       */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          isDarkBg
            ? isScrolled
              ? 'bg-[#121316]/90 backdrop-blur-md shadow-xl border-b border-white/15'
              : 'bg-black/25 backdrop-blur-xs border-b border-white/10'
            : isScrolled
              ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-md border-b border-[#E8E3D8]'
              : 'bg-[#FAF8F5] border-b border-[#E8E3D8]/60'
        }`}
      >
        <div className="site-container">
          {/* Logo group left, icons right; the nav links are positioned on their own
              at the exact centre of the bar, independent of the side groups’ widths. */}
          <div className="relative flex items-center justify-between h-20">
            {/* Left Side: Hamburger Icon (☰) + Federal Optical Logo */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <button
                onClick={() => setDrawerOpen(true)}
                className={`p-2 -ml-3 rounded-xl transition-all cursor-pointer group ${
                  isDarkBg
                    ? 'text-white hover:text-[#C5A880] hover:bg-white/10'
                    : 'text-stone-800 hover:text-black hover:bg-[#E8E3D8]/70'
                }`}
                aria-label="Open Navigation Drawer"
                title="Browse All Collections"
              >
                <Menu className="w-6 h-6 transition-transform group-hover:scale-105" />
              </button>

              <div
                onClick={() => navigateTo('home')}
                className="cursor-pointer flex items-center gap-3 shrink-0 py-1 group"
              >
                <img
                  src={isDarkBg ? '/assets/logos/logo_white_tm.png' : '/assets/logos/logo_charcoal_tm.png'}
                  alt="Federal Optical — Since 1975 Your Family Optician"
                  className="h-10 sm:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </div>

            {/* Center: Plain Text Links (Home, Our Story, Visit Us) - Desktop Only */}
            <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-7 lg:space-x-10">
              <button
                onClick={() => navigateTo('home')}
                className={`text-xs lg:text-[13px] font-semibold uppercase tracking-wider transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-[#C5A880] ${
                  isDarkBg ? 'text-stone-200 hover:text-white' : 'text-stone-700 hover:text-[#8C7048]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('about')}
                className={`text-xs lg:text-[13px] font-semibold uppercase tracking-wider transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-[#C5A880] ${
                  isDarkBg ? 'text-stone-200 hover:text-white' : 'text-stone-700 hover:text-[#8C7048]'
                }`}
              >
                Our Story
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className={`text-xs lg:text-[13px] font-semibold uppercase tracking-wider transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-[#C5A880] ${
                  isDarkBg ? 'text-stone-200 hover:text-white' : 'text-stone-700 hover:text-[#8C7048]'
                }`}
              >
                Visit Us
              </button>
            </nav>

            {/* Right Side: Icons Only (Search + Cart/Order Bag) */}
            <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  isDarkBg
                    ? 'text-stone-200 hover:text-white hover:bg-white/10'
                    : 'text-stone-700 hover:text-black hover:bg-[#E8E3D8]'
                }`}
                title="Search frames & lenses"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Bag / WhatsApp Order Aggregator Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2.5 rounded-full transition-all cursor-pointer shadow-sm group ${
                  isDarkBg
                    ? 'bg-white text-stone-900 hover:bg-[#C5A880] hover:text-black'
                    : 'bg-[#121316] text-white hover:bg-[#252830]'
                }`}
                title="View Bag"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C5A880] text-black text-[11px] font-bold flex items-center justify-center animate-scale-up shadow-xs">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. GABA OPTICAL STYLE SLIDE-IN CATEGORY DRAWER (From Left) */}
      {/* ========================================================================= */}
      <div
        className={`fixed inset-0 z-50 transition-visibility duration-300 ${
          drawerOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop Overlay */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeDrawer}
        />

        {/* Slide-In Navigation Panel */}
        <aside
          className={`relative w-full max-w-sm sm:max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 text-[#121316] transition-transform duration-300 ease-in-out ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Top Bar: Brand Logo + Close (✕) */}
          <div className="p-4 sm:p-5 border-b border-[#E8E3D8] flex items-center justify-between bg-white/50">
            <div
              onClick={() => {
                closeDrawer();
                navigateTo('home');
              }}
              className="cursor-pointer flex items-center gap-2"
            >
              <img
                src="/assets/logos/logo_charcoal_tm.png"
                alt="Federal Optical"
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-full text-stone-500 hover:text-black hover:bg-[#E8E3D8] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Quick Search Bar */}
          <div className="p-4 border-b border-[#E8E3D8] bg-[#F4EFE7]/50">
            <button
              onClick={() => {
                closeDrawer();
                setSearchOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E3D8] text-xs text-stone-400 hover:border-[#C5A880] hover:text-stone-700 transition-colors shadow-xs text-left"
            >
              <Search className="w-4 h-4 text-[#8C7048]" />
              <span>Search frames, sunglasses, lenses...</span>
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E8E3D8]/60">
            {/* Mobile Only: Quick Links (Home / Our Story / Visit Us) */}
            <div className="md:hidden p-3 bg-[#FAF8F5] grid grid-cols-3 gap-2 border-b border-[#E8E3D8]">
              <button
                onClick={() => {
                  closeDrawer();
                  navigateTo('home');
                }}
                className="py-2 px-3 rounded-lg text-xs font-semibold text-center text-stone-800 bg-white border border-[#E8E3D8] hover:bg-[#F3EFE8]"
              >
                Home
              </button>
              <button
                onClick={() => {
                  closeDrawer();
                  navigateTo('about');
                }}
                className="py-2 px-3 rounded-lg text-xs font-semibold text-center text-stone-800 bg-white border border-[#E8E3D8] hover:bg-[#F3EFE8]"
              >
                Our Story
              </button>
              <button
                onClick={() => {
                  closeDrawer();
                  navigateTo('contact');
                }}
                className="py-2 px-3 rounded-lg text-xs font-semibold text-center text-stone-800 bg-white border border-[#E8E3D8] hover:bg-[#F3EFE8]"
              >
                Visit Us
              </button>
            </div>
            {/* ================================================================= */}
            {/* DRAWER SUB-PANEL NAVIGATION (Depth Pattern A & Pattern B)         */}
            {/* ================================================================= */}
            <div className="py-2">
              {/* ------------------------------------------------------------- */}
              {/* LEVEL 0: MAIN DRAWER MENU                                     */}
              {/* ------------------------------------------------------------- */}
              {drawerPanel === 'main' && (
                <div className="animate-fade-in">
                  {/* 1. Clear Contact Lenses → */}
                  <button
                    onClick={() => setDrawerPanel('clear-contacts')}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold tracking-wide text-stone-900 hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>Clear Contact Lenses</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C5A880]/15 text-[#8C7048]">
                        Certified
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>

                  {/* 2. Color Contact Lenses → */}
                  <button
                    onClick={() => setDrawerPanel('color-contacts')}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold tracking-wide text-stone-900 hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>Color Contact Lenses</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C5A880]/15 text-[#8C7048]">
                        Cosmetic
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>

                  {/* 3. Eyeglasses → */}
                  <button
                    onClick={() => setDrawerPanel('eyeglasses')}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold tracking-wide text-stone-900 hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>Eyeglasses</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                        Prescription
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>

                  {/* 4. Sunglasses → */}
                  <button
                    onClick={() => setDrawerPanel('sunglasses')}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold tracking-wide text-stone-900 hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>Sunglasses</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                        Polarized & UV
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>

                  {/* 5. Federal Tints (Flat, no-panel link) - hidden until tint products exist */}
                  {hasTintProducts && (
                  <button
                    onClick={() => {
                      closeDrawer();
                      openCategory('tint-eyeglasses');
                    }}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold tracking-wide text-stone-900 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors text-left cursor-pointer"
                  >
                    <span>Federal Tints</span>
                    <span className="text-[10px] font-semibold text-stone-400">Photochromic</span>
                  </button>
                  )}

                  {/* 6. Glasses Care & Accessories (Flat, no-panel link) */}
                  <button
                    onClick={() => {
                      closeDrawer();
                      openCategory('accessories');
                    }}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold tracking-wide text-stone-900 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors text-left cursor-pointer"
                  >
                    <span>Glasses Care & Accessories</span>
                    <span className="text-[10px] font-semibold text-stone-400">Cases & Sprays</span>
                  </button>

                  {/* 8. Federal Care → */}
                  <button
                    onClick={() => setDrawerPanel('federal-care')}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold tracking-wide text-stone-900 hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>Federal Care</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C5A880]/20 text-[#8C7048]">
                        Eye Clinic
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>

                  {/* Quick Links Group */}
                  <div className="pt-3 pb-1 border-t border-[#E8E3D8]/70 px-5 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-1">
                      Assistance & Locations
                    </span>
                    <button
                      onClick={() => {
                        closeDrawer();
                        navigateTo('stores');
                      }}
                      className="w-full flex items-center justify-between py-2 text-xs font-semibold text-stone-700 hover:text-black transition-colors text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#8C7048]" />
                        <span>Our Stores (Karachi Flagship)</span>
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        navigateTo('faq');
                      }}
                      className="w-full flex items-center justify-between py-2 text-xs font-semibold text-stone-700 hover:text-black transition-colors text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-[#8C7048]" />
                        <span>Frequently Asked Questions (FAQs)</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* DEPTH PATTERN A: FLAT TERMINAL SUB-PANELS (NO ARROWS INSIDE)   */}
              {/* ------------------------------------------------------------- */}

              {/* Eyeglasses Sub-Panel */}
              {drawerPanel === 'eyeglasses' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('main')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Eyeglasses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('eyeglasses', "Men’s Eyeglasses");
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Men’s Eyeglasses
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('eyeglasses', "Women’s Eyeglasses");
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Women’s Eyeglasses
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('eyeglasses', "Active/Sports Eyeglasses");
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Active Eyeglasses
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('eyeglasses', "Teenage & Kids’ Eyeglasses");
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>Teenage & Kids’ Eyeglasses</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C5A880]/20 text-[#8C7048]">Ray-Ban</span>
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('eyeglasses');
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-bold text-[#8C7048] hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                    >
                      View all Eyeglasses
                    </button>
                  </div>
                </div>
              )}

              {/* Sunglasses Sub-Panel */}
              {drawerPanel === 'sunglasses' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('main')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Sunglasses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('sunglasses', "Men’s Sunglasses");
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Men’s Sunglasses
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('sunglasses', "Women’s Sunglasses");
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Women’s Sunglasses
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('sunglasses', "Active/Sports Sunglasses");
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Active Sunglasses
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('sunglasses');
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-bold text-[#8C7048] hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                    >
                      View all Sunglasses
                    </button>
                  </div>
                </div>
              )}

              {/* Federal Care Sub-Panel */}
              {drawerPanel === 'federal-care' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('main')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Federal Care</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <button
                      onClick={() => {
                        closeDrawer();
                        navigateTo('federal-care', { subCategory: 'on-site' });
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-semibold text-emerald-800 hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                    >
                      On-Site Eye Test
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        navigateTo('federal-care', { subCategory: 'clinic' });
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Computerized Eye Test / Book Appointment
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* DEPTH PATTERN B: CLEAR CONTACT LENSES (LEVEL 1 & LEVEL 2)      */}
              {/* ------------------------------------------------------------- */}

              {/* Clear Contacts: Level 1 */}
              {drawerPanel === 'clear-contacts' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('main')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Clear Contact Lenses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <button
                      onClick={() => setDrawerPanel('clear-contacts-brands')}
                      className="w-full flex items-center justify-between px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      <span>Shop by Brands</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button
                      onClick={() => setDrawerPanel('clear-contacts-disposability')}
                      className="w-full flex items-center justify-between px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      <span>Shop by Disposability</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('clear-contacts', 'Toric Astigmatism');
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Toric Lenses
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('accessories', 'Lens Care');
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Lens Care
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('clear-contacts');
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-bold text-[#8C7048] hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                    >
                      View all Clear Contact Lenses
                    </button>
                  </div>
                </div>
              )}

              {/* Clear Contacts Level 2: Brands (Flat List, NO arrows) */}
              {drawerPanel === 'clear-contacts-brands' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('clear-contacts')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Clear Contact Lenses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <span className="px-6 py-2 text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                      Shop by Brands
                    </span>
                    {clearContactBrands.map(b => (
                      <button
                        key={b}
                        onClick={() => {
                          closeDrawer();
                          openCategory('clear-contacts', undefined, { brand: b });
                        }}
                        className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Contacts Level 2: Disposability (Flat List, NO arrows) */}
              {drawerPanel === 'clear-contacts-disposability' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('clear-contacts')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Clear Contact Lenses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <span className="px-6 py-2 text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                      Shop by Disposability
                    </span>
                    {clearDisposabilities.map(disp => (
                      <button
                        key={disp.id}
                        onClick={() => {
                          closeDrawer();
                          openCategory('clear-contacts', undefined, { disposability: disp.id });
                        }}
                        className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                      >
                        {disp.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* DEPTH PATTERN B: COLOR CONTACT LENSES (LEVEL 1 & LEVEL 2)      */}
              {/* ------------------------------------------------------------- */}

              {/* Color Contacts: Level 1 */}
              {drawerPanel === 'color-contacts' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('main')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Color Contact Lenses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <button
                      onClick={() => setDrawerPanel('color-contacts-collections')}
                      className="w-full flex items-center justify-between px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      <span>Shop by Collection</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button
                      onClick={() => setDrawerPanel('color-contacts-brands')}
                      className="w-full flex items-center justify-between px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      <span>Shop by Brand</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button
                      onClick={() => setDrawerPanel('color-contacts-colors')}
                      className="w-full flex items-center justify-between px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      <span>Shop by Color</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button
                      onClick={() => setDrawerPanel('color-contacts-disposability')}
                      className="w-full flex items-center justify-between px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      <span>Shop by Disposability</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('accessories', 'Lens Care');
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                    >
                      Lens Care
                    </button>
                    <button
                      onClick={() => {
                        closeDrawer();
                        openCategory('color-contacts');
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-bold text-[#8C7048] hover:bg-[#F3EFE8]/70 transition-colors cursor-pointer"
                    >
                      View all Color Contact Lenses
                    </button>
                  </div>
                </div>
              )}

              {/* Color Contacts Level 2: Collections */}
              {drawerPanel === 'color-contacts-collections' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('color-contacts')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Color Contact Lenses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <span className="px-6 py-2 text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                      Shop by Collection
                    </span>
                    {colorContactCollections.map(coll => (
                      <button
                        key={coll}
                        onClick={() => {
                          closeDrawer();
                          openCategory('color-contacts', coll);
                        }}
                        className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                      >
                        {coll}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Contacts Level 2: Brands (Flat List, NO arrows) */}
              {drawerPanel === 'color-contacts-brands' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('color-contacts')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Color Contact Lenses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <span className="px-6 py-2 text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                      Shop by Brand
                    </span>
                    {colorContactBrands.map(b => (
                      <button
                        key={b}
                        onClick={() => {
                          closeDrawer();
                          openCategory('color-contacts', undefined, { brand: b });
                        }}
                        className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Contacts Level 2: Colors (Flat List, NO arrows) */}
              {drawerPanel === 'color-contacts-colors' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('color-contacts')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Color Contact Lenses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <span className="px-6 py-2 text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                      Shop by Color
                    </span>
                    {[
                      { id: 'Hazel', label: 'Brown / Pure Hazel' },
                      { id: 'Grey', label: 'Grey' },
                      { id: 'Green', label: 'Green' },
                      { id: 'Blue', label: 'Blue' },
                      { id: 'Violet', label: 'Violet' }
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          closeDrawer();
                          openCategory('color-contacts', undefined, { lensColor: c.id });
                        }}
                        className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Contacts Level 2: Disposability (Flat List, NO arrows) */}
              {drawerPanel === 'color-contacts-disposability' && (
                <div className="animate-fade-in">
                  <button
                    onClick={() => setDrawerPanel('color-contacts')}
                    className="w-full flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-[#E8E3D8] hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#8C7048]" />
                    <span>Color Contact Lenses</span>
                  </button>
                  <div className="py-2 divide-y divide-[#E8E3D8]/40">
                    <span className="px-6 py-2 text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                      Shop by Disposability
                    </span>
                    {colorDisposabilities.map(disp => (
                      <button
                        key={disp.id}
                        onClick={() => {
                          closeDrawer();
                          openCategory('color-contacts', undefined, { disposability: disp.id });
                        }}
                        className="w-full text-left px-6 py-3 text-xs font-medium text-stone-800 hover:bg-[#F3EFE8]/70 hover:text-[#8C7048] transition-colors cursor-pointer"
                      >
                        {disp.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer: Direct Consultation & Clinic Address */}
          <div className="p-4 sm:p-5 border-t border-[#E8E3D8] bg-[#F4EFE7]/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8C7048]" />
                <span>Karachi Eye Clinic & Store</span>
              </span>
              <span className="text-[11px] text-stone-400">Est. 1975</span>
            </div>

            <a
              href={`https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hello Federal Optical! I would like to inquire with your optometrist team.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Chat with Optometrist on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <a href={`tel:${FEDERAL_OPTICAL_PHONE}`} className="hover:text-black">
                Phone: {FEDERAL_OPTICAL_PHONE}
              </a>
              <a
                href="https://instagram.com/federaloptical"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black text-[#8C7048] font-medium"
              >
                @federaloptical
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* 4. SEARCH MODAL (Full catalog quick search) */}
      {/* ========================================================================= */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={closeSearch}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E8E3D8] p-5 text-[#121316]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-3">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-[#C5A880]" aria-hidden />
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={e => updateQuery(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder="Search frames, sunglasses, lenses, brands, colours..."
                  aria-label="Search products"
                  aria-controls="search-results"
                  aria-activedescendant={searchResults.length ? `search-result-${activeResult}` : undefined}
                  className="w-full bg-transparent text-stone-900 placeholder:text-stone-400 focus:outline-none text-sm md:text-base font-medium [&::-webkit-search-cancel-button]:hidden"
                />
              </div>
              <button
                onClick={closeSearch}
                className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-[#E8E3D8] ml-2"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions or Results */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto overscroll-contain" data-lenis-prevent>
              {searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <>
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400" aria-live="polite">
                      {search.approximate
                        ? `No exact match. Closest products (${search.total})`
                        : `${search.total} ${search.total === 1 ? 'product' : 'products'} found`}
                      {search.total > searchResults.length && ` · showing top ${searchResults.length}`}
                    </p>
                    <ul id="search-results" role="listbox" className="divide-y divide-[#E8E3D8]">
                      {searchResults.map((prod, idx) => (
                        <li
                          key={prod.id}
                          id={`search-result-${idx}`}
                          role="option"
                          aria-selected={idx === activeResult}
                          onClick={() => openSearchResult(prod.id)}
                          onMouseEnter={() => setActiveResult(idx)}
                          className={`py-3 flex items-center justify-between gap-3 px-3 rounded-lg cursor-pointer transition-colors ${
                            idx === activeResult ? 'bg-[#F3EFE8]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={prod.images[0]}
                              alt=""
                              loading="lazy"
                              className="w-12 h-12 shrink-0 object-cover rounded-md border border-[#E8E3D8] bg-white"
                            />
                            <div className="min-w-0">
                              <h4 className="font-sans font-semibold text-stone-900 text-sm leading-snug truncate">{prod.name}</h4>
                              <p className="font-sans text-[11px] text-stone-500 truncate">
                                {prod.subCategory} • {prod.brand}
                                {!prod.inStock && ' • Out of stock'}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 font-sans font-bold text-xs text-stone-900 tabular-nums lining-nums">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="text-center py-8 text-stone-500 text-sm" aria-live="polite">
                    No products found for "{searchQuery}". Try a brand, shape or colour, e.g. "Ray-Ban", "Aviator" or "Green lenses".
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['Ray-Ban', 'Aviator', 'Cat-Eye', 'Polarized Sunglasses', 'Kids Eyeglasses', 'Acuvue', 'Green Color Lenses', 'Lens Solution'].map(term => (
                      <button
                        key={term}
                        onClick={() => updateQuery(term)}
                        className="px-3 py-1.5 rounded-full bg-[#F3EFE8] text-stone-700 hover:bg-[#E8E3D8] hover:text-black transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
