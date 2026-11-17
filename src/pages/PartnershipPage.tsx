import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import { SEO, getBreadcrumbSchema } from '../components/SEO';
import {
  Briefcase,
  Sparkles,
  Award,
  CheckCircle2,
  Building2,
  Share2,
  Send
} from 'lucide-react';

export const PartnershipPage: React.FC = () => {
  const { params } = useNavigation();
  const tabFromParams = params.subCategory === 'influencer' ? 'influencer' : 'franchise';
  const [activeTab, setActiveTab] = useState<'franchise' | 'influencer'>(tabFromParams);
  // follow footer/menu links that switch tab while this page is already open
  const [lastTabParam, setLastTabParam] = useState(tabFromParams);
  if (lastTabParam !== tabFromParams) {
    setLastTabParam(tabFromParams);
    setActiveTab(tabFromParams);
  }

  // Franchise form state
  const [franchiseForm, setFranchiseForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    location: '',
    experience: '',
    investmentCapacity: 'PKR 5 Million – 10 Million'
  });
  const [franchiseSubmitted, setFranchiseSubmitted] = useState(false);

  // Influencer form state
  const [influencerForm, setInfluencerForm] = useState({
    name: '',
    handle: '',
    platform: 'Instagram',
    followers: '10K – 50K',
    city: 'Karachi',
    phone: '',
    pitch: ''
  });
  const [influencerSubmitted, setInfluencerSubmitted] = useState(false);

  const handleFranchiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `🤝 *FEDERAL OPTICAL — FRANCHISE INQUIRY*\n\nName: ${franchiseForm.name}\nPhone: ${franchiseForm.phone}\nEmail: ${franchiseForm.email}\nCity: ${franchiseForm.city}\nProposed Location: ${franchiseForm.location}\nRetail Experience: ${franchiseForm.experience}\nInvestment Range: ${franchiseForm.investmentCapacity}`;
    const url = `https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setFranchiseSubmitted(true);
  };

  const handleInfluencerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `✨ *FEDERAL OPTICAL — INFLUENCER / AMBASSADOR APPLICATION*\n\nCreator Name: ${influencerForm.name}\nHandle: ${influencerForm.handle}\nPlatform: ${influencerForm.platform}\nFollower Tier: ${influencerForm.followers}\nCity: ${influencerForm.city}\nPhone/WhatsApp: ${influencerForm.phone}\nCollab Idea: ${influencerForm.pitch}`;
    const url = `https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setInfluencerSubmitted(true);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-24">
      <SEO
        title="Partnership & Franchise Opportunities — Collaborate with Federal Optical"
        description="Explore franchise partnerships and influencer collaborations with Federal Optical, Karachi's heritage optical brand since 1975."
        canonical="/partnership"
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Partnership', url: '/partnership' }
        ])}
      />
      {/* Hero */}
      <section data-theme="dark" className="bg-[#121316] text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Growth & Brand Collaborations</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold leading-tight">
            Partner with Federal Optical
          </h1>
          <p className="text-stone-300 text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
            Join Pakistan’s premier family optical heritage. Whether expanding clinical retail footprints or co-creating stylish eyewear stories, let us collaborate.
          </p>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex justify-center border-b border-[#E8E3D8]">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('franchise')}
              className={`pb-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
                activeTab === 'franchise'
                  ? 'border-[#C5A880] text-[#121316]'
                  : 'border-transparent text-stone-500 hover:text-black'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Franchise & Retail Inquiries</span>
            </button>
            <button
              onClick={() => setActiveTab('influencer')}
              className={`pb-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
                activeTab === 'influencer'
                  ? 'border-[#C5A880] text-[#121316]'
                  : 'border-transparent text-stone-500 hover:text-black'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <span>Creator & Influencer Program</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Franchise Inquiries */}
        {activeTab === 'franchise' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
                Franchise Opportunity
              </span>
              <h2 className="font-heading text-3xl font-semibold text-stone-900">
                Bring 50 Years of Optical Equity to Your City
              </h2>
              <p>
                Since 1975, Federal Optical has earned unmatched trust across multiple generations. We are selectively reviewing expressions of interest from seasoned retailers, healthcare professionals, and commercial property owners in major urban centers across Pakistan.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <Award className="w-4 h-4 text-[#C5A880]" />
                    <span>Turnkey Clinical Setup Blueprints</span>
                  </div>
                  <p className="text-stone-600 text-xs">
                    Access certified computerized refraction equipment recommendations, automated lens edging machines, and clinical room layout design.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                    <span>Direct Supply Chain & Verified Imports</span>
                  </div>
                  <p className="text-stone-600 text-xs">
                    Benefit from established vendor relationships for authentic Acuvue, Bausch & Lomb, Bella contact lenses and exclusive Italian acetate frames.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                    <span>Optometric & Glazing Training</span>
                  </div>
                  <p className="text-stone-600 text-xs">
                    Comprehensive training for dispensary sales staff, prescription readers, and laboratory edging technicians.
                  </p>
                </div>
              </div>
            </div>

            {/* Franchise Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3D8] shadow-lg space-y-5">
              <h3 className="font-heading text-2xl font-semibold text-stone-900">
                Franchise Expression of Interest
              </h3>
              <p className="text-xs text-stone-600">
                Submit your preliminary business details. Our executive team will review and schedule a confidential discussion.
              </p>

              {franchiseSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Inquiry Dispatched to Management Desk</p>
                  <p>Our team has received your details on WhatsApp and will follow up shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleFranchiseSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Full Name / Entity Name *</label>
                    <input
                      type="text"
                      required
                      value={franchiseForm.name}
                      onChange={e => setFranchiseForm({ ...franchiseForm, name: e.target.value })}
                      placeholder="e.g. Tariq Khan & Partners"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        value={franchiseForm.phone}
                        onChange={e => setFranchiseForm({ ...franchiseForm, phone: e.target.value })}
                        placeholder="0300-XXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={franchiseForm.email}
                        onChange={e => setFranchiseForm({ ...franchiseForm, email: e.target.value })}
                        placeholder="tariq@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Target City *</label>
                      <input
                        type="text"
                        required
                        value={franchiseForm.city}
                        onChange={e => setFranchiseForm({ ...franchiseForm, city: e.target.value })}
                        placeholder="e.g. Lahore / Islamabad / Faisalabad"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Proposed Location / Commercial Area</label>
                      <input
                        type="text"
                        value={franchiseForm.location}
                        onChange={e => setFranchiseForm({ ...franchiseForm, location: e.target.value })}
                        placeholder="e.g. Mall / Commercial Avenue"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Investment Capacity Tier</label>
                    <select
                      value={franchiseForm.investmentCapacity}
                      onChange={e => setFranchiseForm({ ...franchiseForm, investmentCapacity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    >
                      <option value="PKR 5 Million – 10 Million">PKR 5 Million – 10 Million</option>
                      <option value="PKR 10 Million – 20 Million">PKR 10 Million – 20 Million</option>
                      <option value="PKR 20 Million+">PKR 20 Million+</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#121316] hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#C5A880]" />
                    <span>Submit Franchise Inquiry via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Influencer & Ambassador Program */}
        {activeTab === 'influencer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
                Creator Collaborations
              </span>
              <h2 className="font-heading text-3xl font-semibold text-stone-900">
                Tell the Story of Timeless Eyewear
              </h2>
              <p>
                We collaborate with fashion influencers, doctors, stylists, photographers, and lifestyle storytellers who appreciate artisanal craftsmanship, authentic lens optics, and Karachi’s rich visual culture.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                    <span>Complimentary Bespoke Frames & Custom Tints</span>
                  </div>
                  <p className="text-stone-600 text-xs">
                    Receive hand-fitted frames from our atelier collections fitted with personalized photochromic tints or blue-light computerized shields.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <Share2 className="w-4 h-4 text-[#C5A880]" />
                    <span>Exclusive Follower Savings Codes</span>
                  </div>
                  <p className="text-stone-600 text-xs">
                    Offer your audience special perks for in-store eye exams and online WhatsApp delivery orders.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <Award className="w-4 h-4 text-[#C5A880]" />
                    <span>Campaign Shoots & In-Clinic VIP Experience</span>
                  </div>
                  <p className="text-stone-600 text-xs">
                    VIP styling appointments at our Karachi flagship store with private refraction consultations.
                  </p>
                </div>
              </div>
            </div>

            {/* Influencer Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3D8] shadow-lg space-y-5">
              <h3 className="font-heading text-2xl font-semibold text-stone-900">
                Ambassador Application Form
              </h3>
              <p className="text-xs text-stone-600">
                Share your social profile and collaboration ideas with our brand marketing team.
              </p>

              {influencerSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Application Sent to Marketing Team</p>
                  <p>Our PR team will inspect your profile and connect with you on WhatsApp.</p>
                </div>
              ) : (
                <form onSubmit={handleInfluencerSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={influencerForm.name}
                      onChange={e => setInfluencerForm({ ...influencerForm, name: e.target.value })}
                      placeholder="e.g. Mahnoor Baloch"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Instagram or TikTok Handle *</label>
                      <input
                        type="text"
                        required
                        value={influencerForm.handle}
                        onChange={e => setInfluencerForm({ ...influencerForm, handle: e.target.value })}
                        placeholder="@yourhandle"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Primary Platform</label>
                      <select
                        value={influencerForm.platform}
                        onChange={e => setInfluencerForm({ ...influencerForm, platform: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube">YouTube</option>
                        <option value="LinkedIn / Corporate">LinkedIn / Corporate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">Audience Size Tier</label>
                      <select
                        value={influencerForm.followers}
                        onChange={e => setInfluencerForm({ ...influencerForm, followers: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      >
                        <option value="5K – 20K (Micro-Creator)">5K – 20K (Micro-Creator)</option>
                        <option value="20K – 100K">20K – 100K</option>
                        <option value="100K – 500K">100K – 500K</option>
                        <option value="500K+">500K+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-stone-800 mb-1">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        value={influencerForm.phone}
                        onChange={e => setInfluencerForm({ ...influencerForm, phone: e.target.value })}
                        placeholder="0300-XXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-800 mb-1">Collaboration Ideas / Content Focus</label>
                    <textarea
                      rows={3}
                      value={influencerForm.pitch}
                      onChange={e => setInfluencerForm({ ...influencerForm, pitch: e.target.value })}
                      placeholder="e.g. Eyewear styling lookbook, blue-light computer lens review, wedding party color contact lens tutorial..."
                      className="w-full px-3.5 py-2 rounded-lg border border-[#E8E3D8] bg-[#FAF8F5]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#121316] hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                    <span>Apply for Ambassador Program via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PartnershipPage;
