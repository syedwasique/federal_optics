import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Customer reviews                                                           */
/* Real Google reviews of "Federal Optical and Eye Clinic" (all 5 stars),     */
/* quoted word for word from the Google listing (checked 17 Nov 2026).       */
/* Overall listing rating at that time: 4.7 from 102 Google reviews.          */
/* -------------------------------------------------------------------------- */

type Review = { name: string; text: string };

const REVIEWS: Review[] = [
  {
    name: 'Ghalib Ismail',
    text: 'I’ve been going to Federal Optical since 2014–15, and honestly, I’ve never thought of going anywhere else. They’ve always been my first choice for the best rates, quality products, and excellent customer support by All staff including Imran Bhai.\n\nFor me, Federal Optical is simply my go-to optical shop. I’ve never felt the need to look elsewhere, and after all these years, I can confidently say that I wouldn’t choose any other shop. Highly recommended!',
  },
  {
    name: 'Furqan Gaba',
    text: 'Excellent quality of glasses, a good variety of frames, and very cooperative staff. Great service and a satisfying shopping experience. Highly recommended!',
  },
  {
    name: 'Muhammad Amin',
    text: 'I’m buying my and family members glasses and eye lens from federal optical since 20 years in reasonable prices.\nQuality also good 👍.',
  },
  {
    name: 'Faizan Marfani',
    text: 'I was recomended by some friend to go to federal optical and i must say great customer service and they satisfied me until my glasses were ok and yes witha smile all the staff is very friendly the owner Imran bhai is very humble and co-operative thanks to Abdul Rafay for your co-operation',
  },
  {
    name: 'Hafsa Umair',
    text: 'I highly recommend Federal Optical...\nGlasses Quality is outstanding....My experience is very amazing every time....\nVery Good service and Quality 👍🏻',
  },
  {
    name: 'Jamshaid Riaz',
    text: 'I have known them around 15 years. They are honest and provide quality products.',
  },
  {
    name: 'Farrukh Sheharyar',
    text: 'Modern and sleek designs are always available at Federal Optical and Eye Clinic.\n\nHighly recommended\n\nBest Value of Your Money',
  },
  {
    name: 'Malik M Umair',
    text: 'Imran bhai very nice and humble person. Always provide the best of his collection. Exceptional service highly recommended.',
  },
  {
    name: 'Sohail Ahmed',
    text: 'Reasonable charges with quality service\nDoctor and other staff all are very humble and supportive.',
  },
  {
    name: 'Muhammad Hasnain',
    text: 'A good staff with a good behavior. Today I have purchased eyeglasses from here and satisfied with their service and price.',
  },
];

const GOOGLE_RATING = 4.7;
const GOOGLE_REVIEW_COUNT = 102;
const GOOGLE_LISTING_URL = 'https://share.google/80M7EdXpRbqWWc9o6';
const AUTOPLAY_MS = 6000;

/** 3 cards per page on md+ screens, 1 on phones. */
function usePerPage() {
  const get = () => (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches ? 3 : 1);
  const [perPage, setPerPage] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setPerPage(mq.matches ? 3 : 1);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return perPage;
}

const Stars: React.FC = () => (
  <div className="flex gap-0.5 text-[#E2A93B]" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} aria-hidden />
    ))}
  </div>
);

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <figure
    data-review-card
    className="relative flex h-full flex-col rounded-2xl border border-[#E8E3D8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
  >
    <Quote className="absolute right-5 top-5 h-8 w-8 text-[#C5A880]/25" aria-hidden />
    <Stars />
    <blockquote className="mt-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-stone-700">
      {review.text}
    </blockquote>
    <figcaption className="mt-5 flex items-center gap-3 border-t border-[#E8E3D8] pt-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EFE8] font-heading text-sm font-semibold text-[#8C7048]">
        {review.name.charAt(0)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-stone-900">{review.name}</span>
        <span className="block text-[11px] text-stone-500">Google review</span>
      </span>
    </figcaption>
  </figure>
);

export const ReviewsCarousel: React.FC = () => {
  const perPage = usePerPage();
  const pageCount = Math.ceil(REVIEWS.length / perPage);
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const paused = useRef(false);
  const reduced = useRef(false);

  // Cards for a page; the last page wraps round to the start so every page shows a full row.
  const cardsFor = (p: number) =>
    Array.from({ length: perPage }, (_, i) => REVIEWS[(p * perPage + i) % REVIEWS.length]);

  const animateIn = useCallback(() => {
    const cards = gridRef.current?.querySelectorAll('[data-review-card]');
    if (!cards?.length) return;
    if (reduced.current) {
      gsap.fromTo(cards, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
      return;
    }
    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 28, scale: 0.97, filter: 'blur(4px)' },
      { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.12, ease: 'power3.out', clearProps: 'filter,transform' }
    );
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (busy.current) return;
      const target = ((next % pageCount) + pageCount) % pageCount;
      if (target === pageRef.current) return;
      const cards = gridRef.current?.querySelectorAll('[data-review-card]');
      const swap = () => {
        pageRef.current = target;
        setPage(target);
        busy.current = false;
      };
      if (!cards?.length) return swap();
      busy.current = true;
      gsap.to(cards, {
        autoAlpha: 0,
        y: reduced.current ? 0 : -16,
        duration: reduced.current ? 0.25 : 0.35,
        stagger: reduced.current ? 0 : 0.06,
        ease: 'power2.in',
        onComplete: swap,
      });
    },
    [pageCount]
  );

  // run the entrance animation whenever a new page is rendered
  useLayoutEffect(() => {
    animateIn();
  }, [page, perPage, animateIn]);

  // keep the page index valid when switching between 1 and 3 per page
  useEffect(() => {
    if (pageRef.current >= pageCount) {
      pageRef.current = 0;
      setPage(0);
    }
  }, [pageCount]);

  // autoplay (paused on hover/focus and when reduced motion is requested)
  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) return;
    const id = window.setInterval(() => {
      if (!paused.current && !document.hidden) goTo(pageRef.current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [goTo]);

  return (
    <div
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
      aria-roledescription="carousel"
      aria-label="Customer reviews from Google"
    >
      <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-3 md:min-h-[300px]" aria-live="polite">
        {cardsFor(page).map((r, i) => (
          <ReviewCard key={`${page}-${i}-${r.name}`} review={r} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <a
          href={GOOGLE_LISTING_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
        >
          <span className="font-heading text-lg font-semibold text-stone-900">{GOOGLE_RATING}</span>
          <Stars />
          <span>
            from {GOOGLE_REVIEW_COUNT} Google reviews <span className="underline underline-offset-2">Read all</span>
          </span>
        </a>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Show reviews ${i * perPage + 1}${perPage > 1 ? `–${Math.min((i + 1) * perPage, REVIEWS.length)}` : ''}`}
                aria-current={page === i}
                className="flex h-8 items-center px-0.5 cursor-pointer"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    page === i ? 'w-7 bg-[#C5A880]' : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goTo(pageRef.current - 1)}
              aria-label="Previous reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E3D8] bg-white text-stone-700 transition-colors hover:bg-[#F3EFE8] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goTo(pageRef.current + 1)}
              aria-label="Next reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E3D8] bg-white text-stone-700 transition-colors hover:bg-[#F3EFE8] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
