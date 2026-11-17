import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import { SEO, getBreadcrumbSchema } from '../components/SEO';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Lock,
  FileText,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

type PolicyTabKey = 'shipping' | 'refund' | 'prescription-guarantee' | 'privacy' | 'terms';

export const PolicyPage: React.FC = () => {
  const { params } = useNavigation();
  const [activeTab, setActiveTab] = useState<PolicyTabKey>('shipping');

  useEffect(() => {
    if (params.policyTab) {
      const tab = params.policyTab.toLowerCase();
      if (tab.includes('refund') || tab.includes('exchange')) setActiveTab('refund');
      else if (tab.includes('presc') || tab.includes('guarantee')) setActiveTab('prescription-guarantee');
      else if (tab.includes('privacy')) setActiveTab('privacy');
      else if (tab.includes('term')) setActiveTab('terms');
      else setActiveTab('shipping');
    }
  }, [params.policyTab]);

  const tabs: { key: PolicyTabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { key: 'refund', label: 'Refund & Exchanges', icon: RotateCcw },
    { key: 'prescription-guarantee', label: 'Prescription Guarantee', icon: ShieldCheck },
    { key: 'privacy', label: 'Privacy Policy', icon: Lock },
    { key: 'terms', label: 'Terms of Service', icon: FileText }
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-24">
      <SEO
        title="Client Policies & Guarantees — Shipping, Exchanges & Warranties"
        description="Review Federal Optical's client service policies: fast nationwide delivery in Pakistan, 7-day exchange window, 100% prescription accuracy guarantee, and privacy."
        canonical="/policies"
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Policies', url: '/policies' }
        ])}
      />
      {/* Hero */}
      <section data-theme="dark" className="bg-[#121316] text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Client Care & Standards</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold leading-tight">
            Policies & Client Guarantees
          </h1>
          <p className="text-stone-300 text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
            Clear, transparent terms regarding nationwide delivery, our 14-day prescription accuracy promise, exchange guidelines, and strict optical data privacy.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#E8E3D8] pb-4">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#121316] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-[#E8E3D8] hover:bg-[#F3EFE8]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A880]' : 'text-stone-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* POLICY CONTENT BOX */}
        <div className="bg-white rounded-3xl border border-[#E8E3D8] p-6 sm:p-10 shadow-sm text-stone-700 leading-relaxed text-xs sm:text-sm space-y-8">
          {/* TAB 1: SHIPPING & DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E8E3D8] pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7048]">
                  Delivery Timelines & Dispatch
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
                  Shipping Policy (Pakistan & Worldwide)
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Last Updated: January 2025 • Insured Courier Dispatch
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold text-stone-900">1. Karachi Metropolitan Deliveries</h3>
                <p>
                  For ready-to-wear sunglasses and in-stock contact lenses, delivery within Karachi typically takes <strong>24 to 48 hours</strong>. For prescription eyeglasses requiring custom CNC diamond edging and power calibration in our Karachi optical lab, dispatch takes <strong>2 to 4 working days</strong>.
                </p>
                <p>
                  Orders over PKR 5,000 qualify for complimentary standard delivery within Karachi city limits.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-3">2. Nationwide Pakistan Deliveries</h3>
                <p>
                  We partner with Pakistan’s most reliable courier networks (TCS, Leopard Couriers, and M&P) to service Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Gujranwala, Sialkot, and all other cities.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Standard nationwide transit time: <strong>3 to 5 business days</strong> after optical glazing.</li>
                  <li>Real-time SMS tracking number issued immediately upon shipment handover.</li>
                  <li>Cash on Delivery (COD) is available for ready-to-wear non-prescription eyewear and contact lenses nationwide.</li>
                </ul>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-3">3. International Worldwide Express</h3>
                <p>
                  Federal Optical has served the Pakistani overseas diaspora in the <strong>United States, United Kingdom, Canada, United Arab Emirates, and Saudi Arabia</strong> for over two decades.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dispatched via DHL Express Air Priority.</li>
                  <li>International transit time: <strong>5 to 8 business days</strong>.</li>
                  <li>International payments are accepted via Wire Transfer, Raast IBFT, and Visa/MasterCard.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: REFUND & EXCHANGES */}
          {activeTab === 'refund' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E8E3D8] pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7048]">
                  Satisfaction & Exchanges
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
                  Refund & Frame Exchange Policy
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  7-Day Frame Exchange Window • Transparent Terms
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold text-stone-900">1. 7-Day Frame Exchange Window</h3>
                <p>
                  If a purchased frame does not suit your aesthetic or facial fit, you may request an exchange within <strong>7 days of receipt</strong> for any other frame of equal or greater value.
                </p>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] text-xs space-y-1.5">
                  <div className="font-bold text-stone-900">Exchange Eligibility Criteria:</div>
                  <p>• Frame must be completely unworn, free from scratches, adjustments, or perfume scent.</p>
                  <p>• Must be returned in the original Federal Optical hard shell case with microfiber cloth intact.</p>
                  <p>• Return courier shipping for aesthetic exchanges is covered by the customer.</p>
                </div>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-3">2. Contact Lens Hygiene & Sterile Return Restrictions</h3>
                <p>
                  To comply with Sindh Healthcare Commission and international ophthalmic hygiene standards, contact lenses can only be exchanged if their factory outer box and internal blister seals are <strong>100% unopened and undamaged</strong>. Opened sterile blister packs cannot be returned or refunded under any circumstances due to corneal safety regulations.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-3">3. Custom Glazed Prescription Lenses</h3>
                <p>
                  Custom optical lenses edged to a customer’s specific spherical, cylindrical, and pupillary measurements cannot be returned for cash refund, as each lens is permanently calibrated to a single patient’s optical parameters. However, they are fully covered under our <strong>14-Day Prescription Accuracy Guarantee</strong> detailed in the next tab.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PRESCRIPTION ACCURACY GUARANTEE */}
          {activeTab === 'prescription-guarantee' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E8E3D8] pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7048]">
                  Optometric Assurance
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
                  14-Day Prescription Accuracy Guarantee
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Zero-Risk Adaptation Guarantee on High-Index & Progressive Lenses
                </p>
              </div>

              <div className="space-y-4">
                <p>
                  At Federal Optical, our family reputation has been built over 50 years on absolute visual accuracy. We know that transitioning to new progressive lenses, high-cylinder astigmatism corrections, or high-index ultra-thin lenses can occasionally require adaptation fine-tuning.
                </p>

                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Our 100% Adaptation Promise:</span>
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-900">
                    If within 14 days of receiving your prescription glasses you experience eye strain, distortion, or your ophthalmologist revises your prescription power, <strong>Federal Optical will re-examine your parameters and re-glaze your lenses free of charge.</strong>
                  </p>
                </div>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-3">What Is Covered:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Doctor prescription change (with revised prescription slip dated within 14 days).</li>
                  <li>Pupillary Distance (PD) or optical height (O.H.) recalibration.</li>
                  <li>Progressive corridor widening or non-tolerance adaptation adjustment.</li>
                  <li>Complimentary frame realignments and nose pad tension adjustments at our Karachi clinic.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E8E3D8] pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7048]">
                  Patient Confidentiality
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
                  Privacy Policy & Prescription Data Protection
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Patient Medical Data Integrity • No Third-Party Selling
                </p>
              </div>

              <div className="space-y-4">
                <p>
                  Federal Optical (“we”, “our”, or “us”) respects your privacy and is dedicated to protecting confidential medical and personal records shared with us during optical consultations and WhatsApp ordering.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-2">1. Information We Collect</h3>
                <p>
                  When you consult or order through our website or WhatsApp desk, we collect only the necessary information to craft your vision aids:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Prescription data (spherical power, cylinder, axis, add power, pupillary distance, doctor’s name).</li>
                  <li>Delivery information (recipient name, physical address, contact telephone).</li>
                  <li>Order history and frame sizing preferences.</li>
                </ul>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-2">2. Strict Confidentiality</h3>
                <p>
                  Your ophthalmic slips and clinical examination records are accessible only to our qualified optometrists and optical edging technicians. We do not sell, lease, or monetize your contact information with third-party marketing companies or advertising exchanges.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-2">3. WhatsApp Communications</h3>
                <p>
                  All WhatsApp conversations benefit from WhatsApp’s native end-to-end encryption. Order receipts and prescription photos are retained solely for the purpose of re-orders and clinical continuity.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E8E3D8] pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7048]">
                  Operating Terms
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
                  Terms of Service & Optical Guarantee
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Federal Optical Karachi • Commercial Terms
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold text-stone-900">1. WhatsApp-Integrated Ordering Model</h3>
                <p>
                  By browsing Federal Optical and initiating an order request through our WhatsApp order intake system, you acknowledge that orders are verified and confirmed by our optical staff before financial dispatch. Final pricing, lens customization options, and prescription verification occur collaboratively with our optometrist.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-2">2. Prescription Verification Responsibility</h3>
                <p>
                  Customers are responsible for providing current (under 24 months old) and accurate prescription slips from a licensed ophthalmologist or optometrist. Our staff will highlight any ambiguous numbers, but final parameters must reflect the prescribing physician’s directions.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-900 pt-2">3. 1-Year Manufacturing Defect Warranty</h3>
                <p>
                  Every handcrafted frame purchased from Federal Optical carries a <strong>1-year warranty against structural manufacturing defects</strong>, including hinge soldering failure, rivet displacement, or acetate delamination under normal intended use.
                </p>
              </div>
            </div>
          )}

          {/* Need clarification callout */}
          <div className="pt-6 border-t border-[#E8E3D8] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF8F5] p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-[#8C7048] shrink-0" />
              <div>
                <strong className="text-stone-900 text-xs sm:text-sm font-semibold">
                  Have an inquiry regarding an active return or exchange?
                </strong>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Our customer care desk is available on WhatsApp Mon–Sat (11:00 AM – 9:30 PM).
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hello Federal Optical! I have an inquiry regarding your policy / exchange procedure.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#121316] text-white text-xs font-semibold hover:bg-stone-800 transition-colors shrink-0 flex items-center gap-2"
            >
              <span>Contact Care Desk</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PolicyPage;
