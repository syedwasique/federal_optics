import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import { SEO, getBreadcrumbSchema } from '../components/SEO';
import {
  Ruler,
  CreditCard,
  Glasses,
  CheckCircle2,
  ArrowRight,
  Info,
  ShieldCheck
} from 'lucide-react';

interface FaceShapeInfo {
  shape: string;
  description: string;
  recommended: string[];
  avoid: string[];
  exampleFrames: { name: string; category: string; shapeFilter: string }[];
}

const FACE_SHAPES: FaceShapeInfo[] = [
  {
    shape: 'Round Face',
    description: 'Equal width and length with soft, curved jawlines and fuller cheeks. Angular frames add definition and create contrast.',
    recommended: ['Rectangular & Square', 'Geometric Frames', 'Sculpted Cat-Eye', 'Wayfarer Profiles'],
    avoid: ['Small round wireframes', 'Rimless circular frames'],
    exampleFrames: [
      { name: 'Margot Sculpted Cat-Eye', category: 'eyeglasses', shapeFilter: 'cat-eye' },
      { name: 'Karachi Navigator Square', category: 'sunglasses', shapeFilter: 'square' }
    ]
  },
  {
    shape: 'Square Face',
    description: 'A broad forehead and a strong, angular jawline with proportional width and height. Curved and round frames soften strong jaw angles.',
    recommended: ['Archival Round', 'Oval Wireframes', 'Aviator Teardrop', 'Curved Browline'],
    avoid: ['Heavy boxy square frames', 'Sharp geometric hexagons'],
    exampleFrames: [
      { name: 'Heritage Round Titanium', category: 'eyeglasses', shapeFilter: 'round' },
      { name: 'Aviator Classic Teardrop', category: 'sunglasses', shapeFilter: 'aviator' }
    ]
  },
  {
    shape: 'Oval Face',
    description: 'Balanced proportions with high cheekbones and a gently narrowing chin. The most versatile facial profile.',
    recommended: ['Virtually Any Frame Shape', 'Modern Square', 'Subtle Cat-Eye', 'Aviator & Round'],
    avoid: ['Oversized frames that extend too far past temple width'],
    exampleFrames: [
      { name: 'AeroFlex TR90', category: 'eyeglasses', shapeFilter: 'square' },
      { name: 'Round Optical Frames', category: 'eyeglasses', shapeFilter: 'round' }
    ]
  },
  {
    shape: 'Heart Face',
    description: 'Wider forehead and cheekbones that taper into a narrow, pointed chin. Frames with wider bottoms balance forehead prominence.',
    recommended: ['Lightweight Round', 'Thin Metal Wireframes', 'Bottom-Heavy Rectangles', 'Oval Silhouettes'],
    avoid: ['Heavy embellished top browlines', 'Sharp heavy cat-eyes'],
    exampleFrames: [
      { name: 'Heritage Round Japanese Titanium', category: 'eyeglasses', shapeFilter: 'round' },
      { name: 'Geometric Optical Frames', category: 'eyeglasses', shapeFilter: 'geometric' }
    ]
  },
  {
    shape: 'Diamond Face',
    description: 'Broadest at the cheekbones with a narrow forehead and narrow jawline. Accentuates eye contour while balancing cheekbones.',
    recommended: ['Sculpted Cat-Eye', 'Curved Browline', 'Oval & Rimless', 'Soft Rectangular'],
    avoid: ['Narrow rectangular frames that over-accentuate cheekbone width'],
    exampleFrames: [
      { name: 'Margot Sculpted Cat-Eye', category: 'eyeglasses', shapeFilter: 'cat-eye' }
    ]
  }
];

export const SizeGuidePage: React.FC = () => {
  const { openCategory } = useNavigation();
  const [selectedShape, setSelectedShape] = useState<string>('Round Face');

  const activeFace = FACE_SHAPES.find(f => f.shape === selectedShape) || FACE_SHAPES[0];

  return (
    <div className="space-y-16 sm:space-y-20 pb-24">
      <SEO
        title="Eyewear Frame Size & Measurement Guide — Find Your Perfect Fit"
        description="Learn how to read frame millimeter dimensions (lens, bridge, temple), use the credit card test, and match frame shapes to your face profile at Federal Optical."
        canonical="/size-guide"
        schema={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Size Guide', url: '/size-guide' }
        ])}
      />
      {/* Hero */}
      <section data-theme="dark" className="bg-[#121316] text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
            <Ruler className="w-3.5 h-3.5" />
            <span>Optometric Fitting & Size Guide</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold leading-tight">
            Find Your Perfect Frame Fit
          </h1>
          <p className="text-stone-300 text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
            Discover how to decode millimeter frame measurements, test your size with a standard card, and choose the most flattering silhouette for your face shape.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* SECTION 1: How to Read Eyewear Dimensions */}
        <section className="bg-white rounded-3xl border border-[#E8E3D8] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
              Deciphering Frame Geometry
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              How to Read Frame Numbers (e.g. 52 □ 18 - 140)
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Look inside the temple arm of your existing comfortable pair of glasses. You will find three key numbers printed in millimeters, separated by a small square or dash.
            </p>
          </div>

          {/* Interactive Visual Breakdown */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D8] p-6 sm:p-8">
            <div className="text-center pb-6">
              <div className="inline-flex items-center gap-2 font-mono text-2xl sm:text-4xl font-bold text-stone-900 bg-white px-6 py-3 rounded-xl border border-[#E8E3D8] shadow-xs">
                <span className="text-[#8C7048]">52</span>
                <span className="text-stone-400">□</span>
                <span className="text-emerald-700">18</span>
                <span className="text-stone-400">-</span>
                <span className="text-sky-700">140</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-2">
                All optical measurements are recorded in millimeters (mm)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E8E3D8]">
              {/* Lens Width */}
              <div className="space-y-2 p-4 rounded-xl bg-white border border-[#E8E3D8]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8C7048]/15 text-[#8C7048] flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm">Lens Width (e.g. 52mm)</h4>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  The horizontal diameter of each lens at its widest point.
                </p>
                <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                  <span className="font-semibold text-stone-800">• Small:</span> 48–50mm <br />
                  <span className="font-semibold text-stone-800">• Medium:</span> 51–54mm <br />
                  <span className="font-semibold text-stone-800">• Wide:</span> 55mm+
                </div>
              </div>

              {/* Bridge Width */}
              <div className="space-y-2 p-4 rounded-xl bg-white border border-[#E8E3D8]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm">Bridge Width (e.g. 18mm)</h4>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  The distance between the two lenses over the bridge of your nose.
                </p>
                <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                  <span className="font-semibold text-stone-800">• Narrow Bridge:</span> 15–16mm <br />
                  <span className="font-semibold text-stone-800">• Medium Bridge:</span> 17–19mm <br />
                  <span className="font-semibold text-stone-800">• Wide Bridge:</span> 20–22mm
                </div>
              </div>

              {/* Temple Arm Length */}
              <div className="space-y-2 p-4 rounded-xl bg-white border border-[#E8E3D8]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm">Temple Length (e.g. 140mm)</h4>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  The length of the frame arms from hinge screw to tip behind your ear.
                </p>
                <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                  <span className="font-semibold text-stone-800">• Standard Women:</span> 135–140mm <br />
                  <span className="font-semibold text-stone-800">• Standard Men:</span> 140–145mm <br />
                  <span className="font-semibold text-stone-800">• Extended Fit:</span> 150mm
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: The Credit Card Sizing Hack */}
        <section className="bg-gradient-to-br from-[#121316] to-[#252830] text-white rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5" />
                <span>No Ruler Required</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-semibold">
                The Standard Card Sizing Method
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Standard bank cards, CNIC, or driving licenses have a universal width (85.6mm) that mirrors standard optical facial proportion. Stand in front of a mirror and place one edge along the vertical center of your nose bridge:
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C5A880] mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">Card extends past outer corner of your eye:</strong>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      You have a petite or narrow face profile. Choose <span className="text-[#C5A880]">Small frames (lens width ≤ 50mm)</span>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C5A880] mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">Card ends exactly at outer corner of your eye:</strong>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      You have an average facial width. Choose <span className="text-[#C5A880]">Medium / Standard frames (51–54mm)</span>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C5A880] mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">Card does not reach outer corner of your eye:</strong>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      You have a broad or wide face profile. Choose <span className="text-[#C5A880]">Wide / Oversized frames (55mm+)</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 rounded-2xl p-6 border border-white/15 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#C5A880]/20 border border-[#C5A880] flex items-center justify-center mx-auto text-[#C5A880]">
                <Glasses className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-lg font-semibold text-white">
                Unsure About Your Exact Dimensions?
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Take a quick selfie holding a card against your cheek, or send a photo of the inside arm of your current frames directly to our optometrist on WhatsApp.
              </p>
              <a
                href={`https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  'Hello Federal Optical! I would like help verifying my frame size and measurements.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full bg-[#C5A880] hover:bg-[#b09165] text-black font-semibold text-xs transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Ask Optometrist on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 3: Face Shape to Frame Shape Guide */}
        <section className="bg-white rounded-3xl border border-[#E8E3D8] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
              Aesthetic Harmony
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
              Face Shape & Frame Recommendations
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm max-w-2xl">
              The universal rule of optical styling is contrast: frames should gently counter-balance facial geometry rather than duplicating it.
            </p>
          </div>

          {/* Shape Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {FACE_SHAPES.map(f => (
              <button
                key={f.shape}
                onClick={() => setSelectedShape(f.shape)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedShape === f.shape
                    ? 'bg-[#121316] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-700 border border-[#E8E3D8] hover:bg-[#F3EFE8]'
                }`}
              >
                {f.shape}
              </button>
            ))}
          </div>

          {/* Active Shape Detail Card */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D8] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h3 className="font-heading text-2xl font-semibold text-stone-900">
                  {activeFace.shape}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  {activeFace.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Flattering Shapes</span>
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1">
                    {activeFace.recommended.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                    <Info className="w-4 h-4 text-rose-600" />
                    <span>Approach with Caution</span>
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1">
                    {activeFace.avoid.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommended Collection CTA */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E8E3D8] shadow-xs space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7048] block">
                Featured Frame Styles for {activeFace.shape}
              </span>
              <div className="space-y-2">
                {activeFace.exampleFrames.map((frame, idx) => (
                  <button
                    key={idx}
                    onClick={() => openCategory(frame.category, undefined, { filterShape: frame.shapeFilter })}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE8] border border-[#E8E3D8] text-xs font-semibold text-stone-900 transition-colors text-left"
                  >
                    <span>{frame.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8C7048]" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => openCategory('eyeglasses')}
                className="w-full py-2.5 rounded-full bg-[#121316] text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Browse All Eyeglasses
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 4: Optical Fit Checklist */}
        <section className="bg-white rounded-3xl border border-[#E8E3D8] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
              Clinical Checklist
            </span>
            <h3 className="font-heading text-2xl font-semibold text-stone-900">
              4 Signs Your Glasses Fit Perfectly
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              <h5 className="font-bold text-stone-900 text-xs">Centered Pupils</h5>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Your eyes should sit horizontally centered inside each lens cell, in the upper 40% vertical corridor.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              <h5 className="font-bold text-stone-900 text-xs">Bridge Comfort</h5>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                The bridge rests comfortably on your nose without slipping down or leaving red pinch indentations.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              <h5 className="font-bold text-stone-900 text-xs">Cheek Clearance</h5>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                When you smile broadly, the lower frame rims must not lift up off your nose or touch your cheekbones.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3D8] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              <h5 className="font-bold text-stone-900 text-xs">Temple Curve</h5>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Temple arms hook softly behind the ears with gentle 45-degree angle curvature without temple headache pressure.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default SizeGuidePage;
