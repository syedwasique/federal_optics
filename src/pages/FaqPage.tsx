import React, { useState } from 'react';
import { FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import { SEO, getBreadcrumbSchema } from '../components/SEO';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  // 1. WhatsApp Ordering
  {
    category: 'Ordering & Payment',
    question: 'How does ordering work through WhatsApp?',
    answer:
      'Browse our catalog and tap "Add to Bag" on any frames, lenses, or accessories. When you open your bag, click "Proceed to WhatsApp Order". This automatically compiles an itemized order slip with your selections, model numbers, and pricing. Our Karachi optical team verifies your prescription details, frame size, and delivery address before confirming your dispatch.'
  },
  {
    category: 'Ordering & Payment',
    question: 'What payment methods do you accept?',
    answer:
      'Within Pakistan, we accept Cash on Delivery (COD) for most ready-to-wear frames and standard lenses. For customized high-index prescription glazing, digital progressives, or international deliveries, we accept Direct Bank Transfer (IBFT), JazzCash, Raast, and Visa/MasterCard payments.'
  },
  {
    category: 'Ordering & Payment',
    question: 'Can I upload a picture of my doctor’s prescription slip?',
    answer:
      'Yes! In fact, we recommend it. Simply snap a clear photo of your ophthalmologist or optometrist prescription slip and send it directly in our WhatsApp chat. Our licensed optometrists will double-check spherical power (SPH), cylinder (CYL), axis, and pupillary distance (PD) before glazing your lenses.'
  },

  // 2. Shipping & Delivery
  {
    category: 'Shipping & Delivery',
    question: 'How fast is delivery within Karachi and across Pakistan?',
    answer:
      'For Karachi deliveries, in-stock non-prescription sunglasses and contact lenses are typically delivered within 24 to 48 hours. Custom prescription glazed eyeglasses take 2 to 4 working days for automated edging and calibration. Deliveries across Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, and other cities take 3 to 5 business days via tracked TCS/Leopard couriers.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'Do you deliver overseas to the USA, UK, or Canada?',
    answer:
      'Yes. For 20+ years, Federal Optical has served Pakistani expatriates and international clients worldwide. We ship worldwide via DHL Express with full end-to-end tracking. International delivery takes approximately 5 to 8 business days.'
  },

  // 3. Contact Lenses
  {
    category: 'Contact Lenses',
    question: 'Are your contact lenses 100% genuine and sealed?',
    answer:
      'Every contact lens package sold by Federal Optical is 100% genuine, factory-sealed in sterile blister packs directly from authorized international distributors (Acuvue, Bausch & Lomb, Alcon, Freshlook, Bella, Dahab). We strictly reject grey-market parallel imports.'
  },
  {
    category: 'Contact Lenses',
    question: 'Do you stock Toric lenses for astigmatism?',
    answer:
      'Yes, we specialize in Toric astigmatism correction across major daily and monthly disposable lines. Since toric lenses require exact cylinder and axis stabilization, our optometrists verify your corneal parameters before ordering.'
  },
  {
    category: 'Contact Lenses',
    question: 'How do I know which contact lens solution to use?',
    answer:
      'We supply multi-purpose sterile lens disinfection solutions suitable for soft hydrogel and silicone hydrogel lenses. You can add solutions, antimicrobial travel cases, and comfort rewinding drops directly from our Accessories collection.'
  },

  // 4. Frames & Lenses
  {
    category: 'Eyeglasses & Lenses',
    question: 'How do I know if a frame will fit my face?',
    answer:
      'Every frame in our catalog displays exact millimeter dimensions: Lens Width, Bridge Width, and Temple Arm Length (e.g. 52□18-140 mm). You can compare these with the numbers printed inside the temple arm of your existing comfortable glasses, or check our interactive Size Guide page.'
  },
  {
    category: 'Eyeglasses & Lenses',
    question: 'What is the difference between Blue-Light and Anti-Glare lenses?',
    answer:
      'Anti-Reflective (AR) lenses eliminate glare from overhead lighting and nighttime headlights. Blue-Light computerized shields go a step further by incorporating specialized monomer filters that block harmful 420nm high-energy blue rays emitted by LED monitors, smartphones, and laptops, reducing digital eye strain.'
  },
  {
    category: 'Eyeglasses & Lenses',
    question: 'Can you fit digital progressive lenses into any frame?',
    answer:
      'Progressive (no-line multifocal) lenses require a minimum frame vertical height (B-measurement of at least 28–30mm) to allow smooth progression between distance, computer, and reading zones. Our optical technicians will inspect your frame choice to ensure it has ample vertical corridor.'
  },

  // 5. Clinical Testing
  {
    category: 'Clinic & Eye Tests',
    question: 'Do I need an appointment for an eye test in your Karachi store?',
    answer:
      'Walk-ins are always welcome during operating hours (Mon–Sat: 11:00 AM – 9:30 PM). However, to avoid waiting during peak afternoon/evening hours, you can reserve a 20-minute computerized refraction slot through our Federal Care page or WhatsApp.'
  },
  {
    category: 'Clinic & Eye Tests',
    question: 'Do you offer on-site eye testing for companies or schools?',
    answer:
      'Yes! Under our Federal Care institutional program, we bring portable computerized autorefractors and diagnostic teams on-location to offices, banks, factories, and schools in Karachi for corporate wellness days.'
  },

  // 6. Returns & Guarantee
  {
    category: 'Exchanges & Guarantee',
    question: 'What is your frame exchange policy?',
    answer:
      'We offer a 7-day hassle-free frame exchange on unworn optical frames in their original condition and case. For prescription lenses that were custom edged to your unique power, we offer a 14-day Prescription Accuracy Guarantee — if your eyes do not adapt comfortably, our optometrists will re-evaluate and re-glaze your lenses free of charge.'
  }
];

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categories = ['All', 'Ordering & Payment', 'Shipping & Delivery', 'Contact Lenses', 'Eyeglasses & Lenses', 'Clinic & Eye Tests', 'Exchanges & Guarantee'];

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(prev => (prev === idx ? null : idx));
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-24">
      <SEO
        title="Frequently Asked Questions — Prescriptions, Sizing & Ordering"
        description="Find clear answers to questions on ordering glasses via WhatsApp, submitting prescription slips, frame sizing, and Karachi clinical eye testing at Federal Optical."
        canonical="/faq"
        schema={[
          faqSchema,
          getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'FAQ', url: '/faq' }
          ])
        ]}
      />
      {/* Header */}
      <section className="bg-[#121316] text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center & Knowledgebase</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-300 text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
            Everything you need to know about ordering via WhatsApp, frame sizing, prescription accuracy, and clinical eye testing in Karachi.
          </p>

          {/* Quick Search */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic (e.g. prescription, delivery, toric)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#121316] text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-[#E8E3D8] hover:bg-[#F3EFE8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8E3D8] overflow-hidden transition-all shadow-xs hover:border-[#C5A880]/50"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-stone-900 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <span className="w-2 h-2 rounded-full bg-[#C5A880] shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#8C7048]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#E8E3D8]/50 animate-fade-in bg-[#FAF8F5]/50">
                      <p>{faq.answer}</p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#8C7048] font-semibold uppercase tracking-wider">
                        <span>Category:</span>
                        <span>{faq.category}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E3D8] text-stone-500 text-sm">
              No answers found matching "{searchQuery}". Try searching for another keyword or reach out directly to our optician.
            </div>
          )}
        </div>

        {/* Still Need Help Banner */}
        <div className="mt-14 bg-[#121316] text-white rounded-3xl p-8 sm:p-10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
              Have a Specific Question?
            </span>
            <h3 className="font-heading text-2xl font-semibold">
              Consult Our Optometrist on WhatsApp
            </h3>
            <p className="text-xs text-stone-400 max-w-md">
              Send your prescription, ask about frame sizes, or get advice on progressive lens adaptations directly.
            </p>
          </div>
          <a
            href={`https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
              'Hello Federal Optical! I have a question about my glasses/lenses.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-full bg-[#C5A880] hover:bg-[#b09165] text-black font-semibold text-xs transition-all flex items-center gap-2 shrink-0 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
export default FaqPage;
