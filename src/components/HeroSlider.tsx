import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, Eye } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

/* -------------------------------------------------------------------------- */
/* Slide config                                                               */
/* Background images are composed from the project’s own product photography  */
/* by scratch/build_hero_images.py. Overlay strengths were checked with       */
/* scratch/check_hero_contrast.py (>= 4.5:1 subtext at 1024-1920px & mobile).  */
/* -------------------------------------------------------------------------- */

type HeroSlide = {
  key: string;
  eyebrow: string;
  /** Headline; the `highlight` word (if present) is set in brand gold. */
  headline: string;
  highlight?: string;
  subline: string;
  primaryCta: string;
  category: string;
  alt: string;
  /** object-position for the landscape (desktop) and portrait (mobile) crops */
  position: { desktop: string; mobile: string };
  /** Ken Burns zoom origin, kept on the subject so it never drifts out of frame */
  zoomOrigin: string;
  /** Overlay alphas: [left edge, text end, fade-out] desktop; [bottom, mid, fade] mobile */
  overlay: { desktop: [number, number]; mobile: [number, number] };
  /** Average tone of the image, shown while it loads so a transition never flashes blank */
  placeholder: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    key: 'eyeglasses',
    eyebrow: 'Eyeglasses',
    headline: "Find Frames You’ll Love Wearing",
    highlight: 'Love',
    subline: "Men’s, women’s, active and kids’ eyeglasses for everyday clarity and comfort.",
    primaryCta: 'Shop Eyeglasses',
    category: 'eyeglasses',
    alt: 'Square eyeglass frames with a brown-to-clear gradient on a soft grey studio background',
    position: { desktop: '78% 50%', mobile: '50% 0%' },
    zoomOrigin: '73% 50%',
    overlay: { desktop: [0.86, 0.66], mobile: [0.92, 0.8] },
    placeholder: '#c9cccb',
  },
  {
    key: 'sunglasses',
    eyebrow: 'Sunglasses',
    headline: 'Sunglasses for Every Outing',
    highlight: 'Outing',
    subline: "Men’s, women’s and active styles, from classic to bold.",
    primaryCta: 'Shop Sunglasses',
    category: 'sunglasses',
    alt: 'Translucent grey square sunglasses with brown gradient lenses on a light studio background',
    position: { desktop: '78% 50%', mobile: '50% 0%' },
    zoomOrigin: '73% 50%',
    overlay: { desktop: [0.86, 0.66], mobile: [0.92, 0.8] },
    placeholder: '#d4d5d4',
  },
  {
    key: 'clear-contacts',
    eyebrow: 'Clear Contact Lenses',
    headline: 'Clear Vision, Every Day',
    highlight: 'Clear',
    subline: 'Daily, monthly and yearly clear contact lenses from trusted brands.',
    primaryCta: 'Shop Clear Lenses',
    category: 'clear-contacts',
    alt: 'A hand lifting a clear soft contact lens from its blister pack',
    position: { desktop: '100% 50%', mobile: '50% 0%' },
    zoomOrigin: '80% 40%',
    overlay: { desktop: [0.84, 0.64], mobile: [0.9, 0.76] },
    placeholder: '#bfae9a',
  },
  {
    key: 'color-contacts',
    eyebrow: 'Color Contact Lenses',
    headline: 'A Touch of Color',
    highlight: 'Color',
    subline: 'Brown, grey, green and blue color lenses in daily to yearly options.',
    primaryCta: 'Shop Color Lenses',
    category: 'color-contacts',
    alt: 'Close-up of an eye wearing a natural hazel-green color contact lens',
    position: { desktop: '85% 50%', mobile: '50% 0%' },
    zoomOrigin: '76% 38%',
    overlay: { desktop: [0.84, 0.66], mobile: [0.9, 0.76] },
    placeholder: '#b89f88',
  },
];

/** Each slide holds for 3s, then crossfades to the next. */
const SLIDE_SECONDS = 3;
const FADE_SECONDS = 0.9;
const ZOOM_SCALE = 1.07;

const srcSet = (key: string, variant: 'desktop' | 'mobile') =>
  (variant === 'desktop' ? [1024, 1440, 1920] : [600, 900])
    .map(w => `/assets/hero/hero-${key}-${variant}-${w}.webp ${w}w`)
    .join(', ');

const ink = (a: number) => `rgba(10,10,10,${a})`;

/** Directional scrim: darkest behind the text, clear over the subject. The stops
 *  follow the shared container (--container-left, see index.css), so the dark zone
 *  always covers the whole ~620px text column wherever the container sits. */
const TEXT_END = 'calc(var(--container-left) + 640px)';
const desktopOverlay = ([a0, a1]: [number, number]) =>
  `linear-gradient(90deg, ${ink(a0)} 0px, ${ink(a1)} ${TEXT_END}, ${ink(a1 / 2)} calc(${TEXT_END} + 200px), ${ink(0)} calc(${TEXT_END} + 440px))`;
const mobileOverlay = ([a0, a1]: [number, number]) =>
  `linear-gradient(0deg, ${ink(a0)} 0%, ${ink(a1)} 45%, ${ink(0)} 75%)`;

const renderHeadline = (s: HeroSlide) => {
  if (!s.highlight) return s.headline;
  const i = s.headline.indexOf(s.highlight);
  if (i < 0) return s.headline;
  return (
    <>
      {s.headline.slice(0, i)}
      <span className="text-[#D6BE9C]">{s.highlight}</span>
      {s.headline.slice(i + s.highlight.length)}
    </>
  );
};

export const HeroSlider: React.FC = () => {
  const { navigateTo, openCategory } = useNavigation();
  const [active, setActive] = useState(0);
  // Slides 2-4 render their <picture> only after the first image has painted,
  // so they never compete with the LCP image but are ready long before slide 2.
  const [loadRest, setLoadRest] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const activeRef = useRef(0);
  const timerRef = useRef<gsap.core.Tween | null>(null);
  const zoomRef = useRef<gsap.core.Tween | null>(null);
  const fadeRef = useRef<gsap.core.Timeline | null>(null);
  const pausedRef = useRef(false);
  /** Autoplay pauses while any reason is present (hover, focus, offscreen, hidden tab). */
  const pauseReasons = useRef(new Set<string>());
  const reducedRef = useRef(false);

  const reveal = (index: number, delay: number) => {
    const items = textRefs.current[index]?.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!items) return;
    gsap.killTweensOf(items);
    if (reducedRef.current) {
      gsap.fromTo(items, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.5, delay, ease: 'power1.out' });
    } else {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay, stagger: 0.09, ease: 'power3.out' }
      );
    }
  };

  const startZoom = (index: number) => {
    zoomRef.current?.kill();
    const el = mediaRefs.current[index];
    if (!el) return;
    if (reducedRef.current) {
      gsap.set(el, { scale: 1 });
      return;
    }
    zoomRef.current = gsap.fromTo(
      el,
      { scale: 1 },
      { scale: ZOOM_SCALE, duration: SLIDE_SECONDS + FADE_SECONDS + 1, ease: 'none' }
    );
  };

  const goTo = useCallback((next: number) => {
    const prev = activeRef.current;
    if (next === prev) return;
    activeRef.current = next;
    setActive(next);

    const prevSlide = slideRefs.current[prev];
    const nextSlide = slideRefs.current[next];
    const prevText = textRefs.current[prev];
    if (!prevSlide || !nextSlide) return;

    fadeRef.current?.progress(1).kill();
    const fade = reducedRef.current ? 0.6 : FADE_SECONDS;

    // hide incoming text before the slide becomes visible, so nothing flashes
    const nextItems = textRefs.current[next]?.querySelectorAll('[data-reveal]');
    if (nextItems) gsap.set(nextItems, { autoAlpha: 0 });

    gsap.set(nextSlide, { zIndex: 2 });
    gsap.set(prevSlide, { zIndex: 1 });
    startZoom(next);

    fadeRef.current = gsap
      .timeline({
        onComplete: () => {
          gsap.set(prevSlide, { autoAlpha: 0, zIndex: 0 });
          const prevMedia = mediaRefs.current[prev];
          if (prevMedia) gsap.set(prevMedia, { scale: 1 });
        },
      })
      .to(prevText, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, 0)
      .fromTo(nextSlide, { autoAlpha: 0 }, { autoAlpha: 1, duration: fade, ease: 'power2.inOut' }, 0)
      .set(prevText, { autoAlpha: 1 }); // restore container; its items stay hidden until revealed again

    reveal(next, reducedRef.current ? 0.2 : 0.45);
    startTimer(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** The active dot’s fill bar doubles as the autoplay timer. */
  const startTimer = (index: number) => {
    timerRef.current?.kill();
    progressRefs.current.forEach(el => el && gsap.set(el, { scaleX: 0 }));
    const bar = progressRefs.current[index];
    if (!bar) return;
    timerRef.current = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: SLIDE_SECONDS,
        ease: 'none',
        paused: pausedRef.current,
        onComplete: () => goTo((activeRef.current + 1) % HERO_SLIDES.length),
      }
    );
  };

  const setPaused = (reason: string, on: boolean) => {
    if (on) pauseReasons.current.add(reason);
    else pauseReasons.current.delete(reason);
    const paused = pauseReasons.current.size > 0;
    if (paused === pausedRef.current) return;
    pausedRef.current = paused;
    if (paused) {
      timerRef.current?.pause();
      zoomRef.current?.pause();
    } else {
      timerRef.current?.resume();
      zoomRef.current?.resume();
    }
  };

  // Initial state + first reveal
  useLayoutEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    slideRefs.current.forEach((el, i) => el && gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 0 }));
    reveal(0, 0.15);
    startZoom(0);
    startTimer(0);

    // Pause when the hero is off-screen or the tab is hidden
    const onVisibility = () => setPaused('hidden', document.hidden);
    const io = new IntersectionObserver(([entry]) => setPaused('offscreen', !entry.isIntersecting));
    if (rootRef.current) io.observe(rootRef.current);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      timerRef.current?.kill();
      zoomRef.current?.kill();
      fadeRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback in case the first image is cached and onLoad fired before hydration
  useEffect(() => {
    const t = window.setTimeout(() => setLoadRest(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  const onFirstImageLoad = () => {
    // wait for the frame after paint, then let the other three start loading
    requestAnimationFrame(() => requestAnimationFrame(() => setLoadRest(true)));
  };

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      aria-roledescription="carousel"
      aria-label="Shop by category"
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[#121316]"
      // Autoplay keeps running under the mouse (the hero fills the screen, so a
      // hover pause would stop it almost always). It only pauses while a keyboard
      // user is tabbed into the slide controls, so focus never sticks after a click.
      onFocusCapture={e => {
        if ((e.target as HTMLElement).matches?.(':focus-visible')) setPaused('focus', true);
      }}
      onBlurCapture={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused('focus', false);
      }}
    >
      <h1 className="sr-only">Federal Optical: eyeglasses, sunglasses and contact lenses</h1>

      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === active;
        const showImage = index === 0 || loadRest;
        return (
          <div
            key={slide.key}
            ref={el => { slideRefs.current[index] = el; }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${HERO_SLIDES.length}: ${slide.eyebrow}`}
            aria-hidden={!isActive}
            inert={!isActive}
            className="absolute inset-0 invisible"
            style={{ backgroundColor: slide.placeholder }}
          >
            {/* Image layer (Ken Burns target) */}
            <div
              ref={el => { mediaRefs.current[index] = el; }}
              className="absolute inset-0 will-change-transform"
              style={{ transformOrigin: slide.zoomOrigin }}
            >
              {showImage && (
                <picture>
                  <source
                    media="(orientation: portrait)"
                    type="image/webp"
                    srcSet={srcSet(slide.key, 'mobile')}
                    sizes="100vw"
                  />
                  <img
                    src={`/assets/hero/hero-${slide.key}-desktop-1920.webp`}
                    srcSet={srcSet(slide.key, 'desktop')}
                    sizes="100vw"
                    width={1920}
                    height={1080}
                    alt={slide.alt}
                    loading="eager"
                    decoding={index === 0 ? 'sync' : 'async'}
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    onLoad={index === 0 ? onFirstImageLoad : undefined}
                    className="hero-img absolute inset-0 h-full w-full object-cover"
                    style={
                      {
                        '--pos-d': slide.position.desktop,
                        '--pos-m': slide.position.mobile,
                      } as React.CSSProperties
                    }
                  />
                </picture>
              )}
            </div>

            {/* Directional scrim: dark behind the text, clear over the subject */}
            <div
              className="hero-scrim absolute inset-0 pointer-events-none"
              style={
                {
                  '--scrim-d': desktopOverlay(slide.overlay.desktop),
                  '--scrim-m': mobileOverlay(slide.overlay.mobile),
                } as React.CSSProperties
              }
            />
            {/* Top scrim keeps the white header legible; bottom fade seats the dots */}
            <div className="absolute inset-x-0 top-0 h-[200px] pointer-events-none bg-gradient-to-b from-[rgba(10,10,10,0.5)] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none bg-gradient-to-t from-[rgba(10,10,10,0.35)] to-transparent" />

            {/* Text */}
            <div className="absolute inset-0 flex items-end pb-[calc(8rem+env(safe-area-inset-bottom))] landscape:items-center landscape:pb-0 landscape:pt-20">
              <div className="site-container">
                <div ref={el => { textRefs.current[index] = el; }} className="text-white max-w-[min(620px,100%)] landscape:max-w-[min(620px,50vw)]">
                  <p
                    data-reveal
                    className="invisible flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-[#D6BE9C] mb-4 sm:mb-5"
                  >
                    <span aria-hidden className="h-px w-7 bg-[#C5A880]" />
                    {slide.eyebrow}
                  </p>

                  <h2
                    data-reveal
                    className="invisible font-heading font-medium text-white text-[clamp(2.25rem,4.6vw,4.75rem)] leading-[1.06] tracking-[-0.02em] text-balance"
                  >
                    {renderHeadline(slide)}
                  </h2>

                  <p
                    data-reveal
                    className="invisible mt-5 sm:mt-6 max-w-[30rem] text-lg sm:text-xl leading-[1.6] text-white/85 text-balance"
                  >
                    {slide.subline}
                  </p>

                  <div data-reveal className="invisible mt-8 sm:mt-9 flex flex-col min-[480px]:flex-row min-[480px]:flex-wrap items-stretch min-[480px]:items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => openCategory(slide.category)}
                      className="group inline-flex h-[52px] sm:h-14 items-center justify-center gap-2 rounded-full border border-transparent bg-[#C5A880] px-6 sm:px-7 font-heading text-[15px] font-medium text-[#121316] transition-colors hover:bg-[#D6BE9C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                    >
                      <span>{slide.primaryCta}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </button>
                    <button
                      onClick={() => navigateTo('federal-care')}
                      className="inline-flex h-[52px] sm:h-14 items-center justify-center gap-2 rounded-full border border-white/60 px-6 sm:px-7 font-heading text-[15px] font-medium text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                    >
                      <Eye className="h-4 w-4" aria-hidden />
                      <span>Book Eye Test</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide dots: centred, clear of the floating WhatsApp button (bottom-left) */}
      <div className="absolute bottom-[calc(2rem+env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 items-center">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.key}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}: ${slide.eyebrow}`}
            aria-current={active === idx}
            className="group flex h-8 items-center px-1.5 cursor-pointer"
          >
            <span
              className={`relative block h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                active === idx ? 'w-10 bg-white/35' : 'w-2.5 bg-white/50 group-hover:bg-white/80'
              }`}
            >
              <span
                ref={el => { progressRefs.current[idx] = el; }}
                className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[#C5A880]"
              />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
