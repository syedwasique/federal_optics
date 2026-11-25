import React, { useState, useEffect } from 'react';
import { getProductById, PRODUCTS, LENS_PACKAGE_OPTIONS, takesLensPackage } from '../data/products';
import type { LensPackageOption, ProductPackOption } from '../data/products';
import { useCart, FEDERAL_OPTICAL_PHONE } from '../context/CartContext';
import type { ContactLensPowerSelection } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { ProductCard } from '../components/ProductCard';
import { GlassesPowerCard, DEFAULT_GLASSES_RX, glassesRxToSelection } from '../components/GlassesPowerCard';
import type { GlassesRx } from '../components/GlassesPowerCard';
import { PrescriptionCardUpload } from '../components/PrescriptionCardUpload';
import type { PrescriptionCardRef } from '../utils/prescriptionCards';
import { SEO, getProductSchema, getBreadcrumbSchema } from '../components/SEO';
import { ProductImageZoomModal } from '../components/ProductImageZoomModal';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  MessageSquare,
  Plus,
  Minus,
  ChevronRight,
  Ruler,
  Eye,
  CheckCircle2,
  Sparkles,
  ZoomIn
} from 'lucide-react';

// Standard contact lens optical powers:
// 0.25 steps up to +/-6.00D, 0.50 steps after +/-6.00D up to +/-10.00D
const MINUS_POWERS: string[] = [];
for (let p = 0.50; p <= 6.001; p += 0.25) {
  MINUS_POWERS.push(`-${p.toFixed(2)}`);
}
for (let p = 6.50; p <= 10.001; p += 0.50) {
  MINUS_POWERS.push(`-${p.toFixed(2)}`);
}

const PLUS_POWERS: string[] = [];
for (let p = 0.50; p <= 6.001; p += 0.25) {
  PLUS_POWERS.push(`+${p.toFixed(2)}`);
}
for (let p = 6.50; p <= 10.001; p += 0.50) {
  PLUS_POWERS.push(`+${p.toFixed(2)}`);
}

const CATEGORY_LABELS: Record<string, string> = {
  eyeglasses: 'Eyeglasses',
  sunglasses: 'Sunglasses',
  'tint-eyeglasses': 'Federal Tints',
  'clear-contacts': 'Clear Contacts',
  'color-contacts': 'Color Contacts',
  accessories: 'Accessories',
};

const TORIC_CYLINDERS = ['-0.75', '-1.25', '-1.75', '-2.25', '-2.75', '-3.25', '-3.75'];
const TORIC_AXES = ['10°', '20°', '30°', '40°', '50°', '60°', '70°', '80°', '90°', '100°', '110°', '120°', '130°', '140°', '150°', '160°', '170°', '180°'];

export const ProductDetailPage: React.FC = () => {
  const { params, navigateTo } = useNavigation();
  const { addToCart, triggerQuickOrder } = useCart();

  const product = getProductById(params.productId || '') || PRODUCTS[0];

  // Resolve initial color based on navigation params or URL variant matching
  const matchedVariantByUrl = product.availableColors?.find(c => 
    c.id?.toLowerCase() === params.productId?.toLowerCase() ||
    c.sku?.toLowerCase() === params.productId?.toLowerCase()
  );
  const initialColor = params.color || matchedVariantByUrl?.name || product.availableColors[0]?.name || 'Standard';

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [selectedLens, setSelectedLens] = useState<LensPackageOption>(
    LENS_PACKAGE_OPTIONS[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Multi-pack / Quantity selection (e.g. 1 pair, 2 pairs, 3 pairs, 120ml, 350ml)
  const [selectedPack, setSelectedPack] = useState<ProductPackOption | undefined>(
    product.packOptions?.[0]
  );

  // Contact Lens Power Selection state (for both clear and color contacts)
  const isContactLens = product.category === 'clear-contacts' || product.category === 'color-contacts';
  const [hasPower, setHasPower] = useState<boolean>(product.category === 'clear-contacts');
  const [samePower, setSamePower] = useState<boolean>(true);
  const [rightPower, setRightPower] = useState<string>('-2.00');
  const [leftPower, setLeftPower] = useState<string>('-2.00');
  const [toricCyl, setToricCyl] = useState<string>('-0.75');
  const [toricAxis, setToricAxis] = useState<string>('180°');
  const [customRxNotes, setCustomRxNotes] = useState<string>('');

  // Eyeglasses / sunglasses power card + optional prescription card photo
  const isGlasses = product.category === 'eyeglasses' || product.category === 'sunglasses' || product.category === 'tint-eyeglasses';
  const [glassesRx, setGlassesRx] = useState<GlassesRx>(DEFAULT_GLASSES_RX);
  const [rxCard, setRxCard] = useState<PrescriptionCardRef | null>(null);

  // Reset variant states when switching product
  useEffect(() => {
    const matched = product.availableColors?.find(c => 
      c.id?.toLowerCase() === params.productId?.toLowerCase() ||
      c.sku?.toLowerCase() === params.productId?.toLowerCase()
    );
    setSelectedColor(params.color || matched?.name || product.availableColors[0]?.name || 'Standard');
    setActiveImageIndex(0);
    setSelectedPack(product.packOptions?.[0]);
    setSelectedLens(LENS_PACKAGE_OPTIONS[0]);
    setHasPower(product.category === 'clear-contacts');
    setQuantity(1);
    setSamePower(true);
    setRightPower('-2.00');
    setLeftPower('-2.00');
    setCustomRxNotes('');
    setGlassesRx(DEFAULT_GLASSES_RX);
    setRxCard(null);
  }, [product.id, params.productId, params.color, product.category, product.packOptions]);

  // Active color variant & active gallery images (loads all angles specific to the selected color)
  const activeColorVariant = product.availableColors?.find(c => c.name === selectedColor) || product.availableColors?.[0];
  const activeGalleryImages = (activeColorVariant?.images && activeColorVariant.images.length > 0)
    ? activeColorVariant.images
    : product.images;

  // Handle right eye change when synced
  const handleRightPowerChange = (val: string) => {
    setRightPower(val);
    if (samePower) {
      setLeftPower(val);
    }
  };

  // Construct active power selection object
  const powerSelection: ContactLensPowerSelection | undefined = isGlasses
    ? glassesRxToSelection(glassesRx)
    : isContactLens
    ? {
        kind: 'contacts',
        hasPower,
        rightEyePower: hasPower ? rightPower : '0.00',
        leftEyePower: hasPower ? (samePower ? rightPower : leftPower) : '0.00',
        cylinder: (hasPower && product.isToric) ? toricCyl : undefined,
        axis: (hasPower && product.isToric) ? toricAxis : undefined,
        samePower,
        prescriptionNotes: customRxNotes.trim() ? customRxNotes.trim() : undefined
      }
    : undefined;

  // Calculate pricing based on selected pack option if present
  const basePrice = selectedPack ? selectedPack.price : product.price;
  // Lens technology (blue cut etc.) is only offered on eyeglasses & tints, never on sunglasses or contacts
  const lensForOrder = takesLensPackage(product) ? selectedLens : undefined;
  const lensPrice = lensForOrder ? lensForOrder.price : 0;
  const totalPrice = (basePrice + lensPrice) * quantity;

  // Related products
  const relatedProducts = PRODUCTS.filter(
    p => p.id !== product.id && (p.category === product.category || p.gender === product.gender)
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, lensForOrder, quantity, selectedPack, powerSelection, rxCard ?? undefined);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleQuickWhatsApp = () => {
    triggerQuickOrder(product, selectedColor, lensForOrder, selectedPack, powerSelection, rxCard ?? undefined, quantity);
  };

  return (
    <div className="site-container py-8 md:py-12">
      <SEO
        title={`${product.name}${selectedColor ? ` — ${selectedColor}` : ''} (${product.brand || 'Federal Optical'}) Price in Pakistan`}
        description={`Buy authentic ${product.name} by ${product.brand || 'Federal Optical'} at Federal Optical. ${product.price ? `₨ ${product.price.toLocaleString()} PKR. ` : ''}100% genuine frames, computerized prescription lens fitting, and fast nationwide delivery across Pakistan.`}
        canonical={`/product/${product.id}`}
        image={activeGalleryImages[0] || product.images[0]}
        type="product"
        schema={[
          getProductSchema(product, selectedColor),
          getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: CATEGORY_LABELS[product.category] ?? product.category, url: `/catalog/${product.category}` },
            { name: product.name, url: `/product/${product.id}` }
          ])
        ]}
      />
      {/* Breadcrumbs */}
      <nav className="flex min-w-0 items-center gap-2 text-xs text-stone-500 mb-6 whitespace-nowrap">
        <button onClick={() => navigateTo('home')} className="hover:text-black shrink-0">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
        <button
          onClick={() => navigateTo('catalog', { category: product.category })}
          className="hover:text-black shrink-0"
        >
          {CATEGORY_LABELS[product.category] ?? product.category}
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
        <span className="min-w-0 text-stone-900 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* LEFT: Image Gallery (Sticky on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image Stage (Interactive Zoom & Drag Inspection) */}
          <div
            onClick={() => setIsZoomModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsZoomModalOpen(true);
              }
            }}
            aria-label="Click to open interactive zoom and inspect fine details"
            className="group relative aspect-4/3 sm:aspect-16/11 w-full bg-white rounded-3xl overflow-hidden border border-[#E8E3D8] hover:border-[#C5A880]/80 shadow-sm hover:shadow-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-in transition-all duration-300"
          >
            {/* Top-Right Tap/Click to Zoom Badge */}
            <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 group-hover:bg-stone-900 text-white text-xs font-medium shadow-md backdrop-blur-xs transition-all duration-200 group-hover:scale-105 pointer-events-none">
              <ZoomIn className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Click to Zoom & Inspect</span>
              <span className="sm:hidden">Tap to Zoom</span>
            </div>

            <img
              src={activeGalleryImages[activeImageIndex] || activeGalleryImages[0]}
              alt={`${product.name} — ${selectedColor}`}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {activeGalleryImages.length > 1 && (
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-xs font-medium pointer-events-none">
                {(() => {
                  const activeImg = activeGalleryImages[activeImageIndex] || '';
                  if (activeImg.includes('how-to-wear')) return 'Guide: How to Wear';
                  if (activeImg.includes('how-to-remove')) return 'Guide: How to Remove';
                  if (activeImg.includes('how-to-clean')) return 'Guide: How to Clean';
                  if (product.category === 'clear-contacts') {
                    const clearBadges = ['Pack & Bottle View', 'Packaging Details', 'Alternate Angle'];
                    return clearBadges[activeImageIndex] || `View ${activeImageIndex + 1}`;
                  }
                  if (product.category === 'color-contacts') {
                    const contactBadges = ['Wearer Look', 'Iris Texture & Swatch', 'Alternate Look'];
                    return contactBadges[activeImageIndex] || `View ${activeImageIndex + 1}`;
                  }
                  const badges = [
                    'Angle 1: Front',
                    'Angle 2: 3/4 Perspective',
                    'Angle 3: Side Profile',
                    'Angle 4: Inside Specs',
                    'Angle 5: Folded Profile',
                    'Angle 6: Alternate View'
                  ];
                  return badges[activeImageIndex] || `Angle ${activeImageIndex + 1}`;
                })()}
              </div>
            )}
          </div>

          {/* Thumbnail Strip with Angle Tags */}
          {activeGalleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
              {activeGalleryImages.map((img, idx) => {
                let angleLabel = `Angle ${idx + 1}`;
                if (img.includes('how-to-wear')) {
                  angleLabel = 'How to Wear';
                } else if (img.includes('how-to-remove')) {
                  angleLabel = 'How to Remove';
                } else if (img.includes('how-to-clean')) {
                  angleLabel = 'How to Clean';
                } else if (product.category === 'clear-contacts') {
                  const clearLabels = ['Pack View', 'Pack Details', 'Alternate Angle'];
                  angleLabel = clearLabels[idx] || `View ${idx + 1}`;
                } else if (product.category === 'color-contacts') {
                  const contactLabels = ['Wearer Look', 'Iris Texture', 'Look 2'];
                  angleLabel = contactLabels[idx] || `View ${idx + 1}`;
                } else {
                  const labels = [
                    'Front View',
                    '3/4 Angle',
                    'Side Profile',
                    'Inside Specs',
                    'Folded Profile',
                    'Alternate View'
                  ];
                  angleLabel = labels[idx] || `Angle ${idx + 1}`;
                }
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`rounded-2xl overflow-hidden border-2 transition-all p-1.5 bg-white shrink-0 flex flex-col items-center gap-1 min-w-[90px] ${
                      activeImageIndex === idx
                        ? 'border-[#C5A880] shadow-md ring-2 ring-[#C5A880]/20 scale-102'
                        : 'border-[#E8E3D8] opacity-75 hover:opacity-100 hover:border-stone-400'
                    }`}
                  >
                    <div className="w-18 h-14 overflow-hidden rounded-lg bg-[#FAF8F5] flex items-center justify-center">
                      <img
                        src={img}
                        alt={`${product.name} ${selectedColor} ${angleLabel}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-stone-700 tracking-tight">
                      {angleLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Frame Measurements Specs Box (if eyeglasses or sunglasses) */}
          {product.measurements && (
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D8] p-5 space-y-3 mt-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C7048]">
                <Ruler className="w-4 h-4 text-[#C5A880]" />
                <span>Optical Frame Architecture & Measurements</span>
              </div>
              <div className={`grid ${product.measurements.frameWeight ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-2 sm:gap-3 text-center text-xs pt-1`}>
                <div className="bg-white rounded-xl p-3 border border-[#E8E3D8]">
                  <span className="text-[10px] text-stone-500 block">Lens Width</span>
                  <span className="font-bold text-sm text-stone-900 tabular-nums lining-nums">{product.measurements.lensWidth} mm</span>
                </div>
                <div className="bg-white rounded-xl p-3 border border-[#E8E3D8]">
                  <span className="text-[10px] text-stone-500 block">Bridge Width</span>
                  <span className="font-bold text-sm text-stone-900 tabular-nums lining-nums">{product.measurements.bridgeWidth} mm</span>
                </div>
                <div className="bg-white rounded-xl p-3 border border-[#E8E3D8]">
                  <span className="text-[10px] text-stone-500 block">Temple Length</span>
                  <span className="font-bold text-sm text-stone-900 tabular-nums lining-nums">{product.measurements.templeLength} mm</span>
                </div>
                {product.measurements.frameWeight && (
                  <div className="bg-white rounded-xl p-3 border border-[#E8E3D8]">
                    <span className="text-[10px] text-stone-500 block">Total Weight</span>
                    <span className="font-bold text-sm text-stone-900 tabular-nums lining-nums">{product.measurements.frameWeight}</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-stone-500 text-center">
                Need customized fitting advice? Message our optometrists on WhatsApp ({FEDERAL_OPTICAL_PHONE}).
              </p>
            </div>
          )}

          {/* Contact Lens Technical & Ocular Parameters Box (clear lenses only: the client asked
              for it to be removed from colour contact lenses) */}
          {product.category === 'clear-contacts' && (
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D8] p-5 space-y-3 mt-6">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#8C7048]">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#C5A880]" />
                  <span>Certified Ocular Specifications</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Safety Approved
                </span>
              </div>
              {/* only the specs this lens actually has (no made-up defaults) */}
              {(() => {
                const specs = [
                  { label: 'Base Curve', value: product.lensBaseCurve },
                  { label: 'Diameter', value: product.lensDiameter },
                  { label: 'Water Content', value: product.lensWaterContent },
                  { label: 'Wear Cycle', value: product.disposability?.replace('-', ' '), capitalize: true },
                ].filter(s => s.value);
                if (!specs.length) return null;
                return (
                  <div className={`grid ${specs.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : specs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-3 text-center text-xs pt-1`}>
                    {specs.map(s => (
                      <div key={s.label} className="bg-white rounded-xl p-3 border border-[#E8E3D8]">
                        <span className="text-[10px] text-stone-500 block">{s.label}</span>
                        <span className={`font-bold text-sm text-stone-900 tabular-nums lining-nums ${s.capitalize ? 'capitalize' : ''}`}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
              {product.lensPowerRange && (
                <div className="p-3 bg-white rounded-xl border border-[#E8E3D8] text-xs">
                  <span className="text-stone-500 block text-[10px] mb-0.5 uppercase tracking-wider font-semibold">Available Power Range:</span>
                  <span className="font-semibold text-stone-900">{product.lensPowerRange}</span>
                </div>
              )}
              <div className="p-3 bg-white rounded-xl border border-[#E8E3D8] flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">Package Contents:</span>
                <span className="font-semibold text-stone-900">
                  {selectedPack ? selectedPack.name : (product.category === 'clear-contacts' ? 'Sterile Contact Lenses + Sterile Storage Case' : '2 Sterile Lenses (1 Pair) + Sterile Case Included')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 text-center">
                Available in Plano (Zero Power) or Prescription correction. WhatsApp our clinic at {FEDERAL_OPTICAL_PHONE}.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: Product Details & Purchase Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header info */}
          <div className="border-b border-[#E8E3D8] pb-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#8C7048] uppercase tracking-wider">
                {product.brand} • {product.sku}
              </span>
              <span className="text-stone-500 font-medium capitalize">
                {product.subCategory}
              </span>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl lg:text-[30px] font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
              {product.description}
            </p>

            {/* Price display */}
            <div className="pt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-sans text-2xl sm:text-3xl font-bold text-stone-950 tabular-nums lining-nums whitespace-nowrap">
                Rs. {totalPrice.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-sm text-stone-400 line-through font-normal tabular-nums lining-nums whitespace-nowrap">
                  Rs. {((selectedPack ? selectedPack.price : product.originalPrice) * quantity).toLocaleString()}
                </span>
              )}
              {lensForOrder && lensPrice > 0 && (
                <span className="text-xs text-[#8C7048] font-medium">
                  (Includes {lensForOrder.name})
                </span>
              )}
              {selectedPack && (
                <span className="text-xs text-stone-500 font-medium">
                  • {selectedPack.name}
                </span>
              )}
            </div>
          </div>

          {/* Multi-Pack / Quantity / Size Option Selector */}
          {product.packOptions && product.packOptions.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Select Packaging / Quantity Option</span>
                </span>
                <span className="text-[11px] text-[#8C7048] font-semibold">
                  Multi-Buy Value Pricing
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.packOptions.map(pack => {
                  const isPackSelected = selectedPack?.id === pack.id;
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => setSelectedPack(pack)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isPackSelected
                          ? 'border-[#C5A880] bg-[#FAF8F5] ring-2 ring-[#C5A880]/20 shadow-xs'
                          : 'border-[#E8E3D8] bg-white hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isPackSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                          {pack.name}
                        </span>
                        {pack.savingsBadge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            {pack.savingsBadge}
                          </span>
                        )}
                      </div>
                      <span className="font-sans text-sm font-bold text-stone-950 mt-1 tabular-nums lining-nums">
                        Rs. {pack.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Product Color Selection */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-2.5 py-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">
                  {product.category === 'color-contacts' ? 'Lens Shade / Tone:' : 'Frame / Shade Color:'}
                  <span className="ml-2 font-bold text-[#8C7048]">{selectedColor}</span>
                </span>
                {product.availableColors.length > 1 && (
                  <span className="text-[11px] font-semibold text-stone-500 bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E8E3D8]">
                    {product.availableColors.length} Colors Available
                  </span>
                )}
              </div>

              {/* Swatch options */}
              {product.availableColors.length > 1 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.availableColors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => {
                          setSelectedColor(color.name);
                          setActiveImageIndex(0);
                        }}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#C5A880] bg-[#FAF8F5] ring-2 ring-[#C5A880]/20 shadow-xs'
                            : 'border-[#E8E3D8] bg-white hover:border-stone-400 hover:bg-[#FAF8F5]/50'
                        }`}
                        title={color.name}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0 shadow-2xs transition-transform group-hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className={`font-medium ${isSelected ? 'text-stone-900 font-bold' : 'text-stone-700'}`}>
                          {color.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] ml-0.5 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E3D8]">
                  <span
                    className="w-3 h-3 rounded-full border border-stone-300"
                    style={{ backgroundColor: product.availableColors[0].hex }}
                  />
                  <span className="text-stone-800 font-semibold">{product.availableColors[0].name}</span>
                </div>
              )}
            </div>
          )}

          {/* Lens Packages (for eyeglasses & tints) */}
          {takesLensPackage(product) && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-900 uppercase tracking-wider">
                  Select Lens Technology (Optional)
                </span>
              </div>

              <div className="space-y-2">
                {LENS_PACKAGE_OPTIONS.map(opt => {
                  const isSelected = selectedLens.id === opt.id;
                  const isCustomWhatsApp = opt.id === 'custom-tech-whatsapp';
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedLens(opt)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                        isSelected
                          ? isCustomWhatsApp
                            ? 'border-[#25D366] bg-[#FAFDF7] ring-2 ring-[#25D366]/20 shadow-xs'
                            : 'border-[#C5A880] bg-[#FAF8F5] ring-2 ring-[#C5A880]/20 shadow-xs'
                          : 'border-[#E8E3D8] bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 font-semibold">
                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                          <input
                            type="radio"
                            name="lens-option"
                            checked={isSelected}
                            onChange={() => setSelectedLens(opt)}
                            className={isCustomWhatsApp ? "accent-[#25D366]" : "accent-[#C5A880]"}
                          />
                          <span className="text-stone-900">{opt.name}</span>
                          {opt.badge && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isCustomWhatsApp
                                ? 'bg-[#25D366]/15 text-[#1b8a43] border border-[#25D366]/30'
                                : 'bg-[#C5A880]/20 text-[#8C7048]'
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <span className={`shrink-0 whitespace-nowrap ${isCustomWhatsApp ? 'text-[#1b8a43] font-bold text-[11px]' : 'text-stone-900'}`}>
                          {isCustomWhatsApp ? 'Mention on WhatsApp' : `+Rs. ${opt.price.toLocaleString()}`}
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px] mt-1 pl-5">
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contact Lens Visual Correction & Power Card */}
          {isContactLens && (
            <div className="space-y-3.5 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#C5A880]" />
                  <span>Ophthalmic Power Specification</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Optometrist Verified
                </span>
              </div>

              {/* Mode Toggle: With Power vs Without Power (Plano) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setHasPower(false)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    !hasPower
                      ? 'border-[#C5A880] bg-[#FAF8F5] ring-2 ring-[#C5A880]/20 shadow-xs'
                      : 'border-[#E8E3D8] bg-white hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">
                      {product.category === 'color-contacts' ? 'Cosmetic Plano' : 'Plano (0.00)'}
                    </span>
                    {!hasPower && <span className="w-2 h-2 rounded-full bg-[#8C7048]" />}
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Zero Power (No Prescription)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setHasPower(true)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    hasPower
                      ? 'border-[#C5A880] bg-[#FAF8F5] ring-2 ring-[#C5A880]/20 shadow-xs'
                      : 'border-[#E8E3D8] bg-white hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Prescription Power</span>
                    {hasPower && <span className="w-2 h-2 rounded-full bg-[#8C7048]" />}
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    {product.isToric ? 'Sphere + Cylinder (Toric)' : '-0.50D to +/-10.00D'}
                  </span>
                </button>
              </div>

              {/* If Has Power: The Interactive Power Card */}
              {hasPower ? (
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#C5A880]/40 p-4 space-y-3.5 shadow-xs">
                  {/* Same Power Sync Checkbox */}
                  <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-2.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={samePower}
                        onChange={e => {
                          setSamePower(e.target.checked);
                          if (e.target.checked) setLeftPower(rightPower);
                        }}
                        className="accent-[#C5A880] rounded"
                      />
                      <span>Same power for both eyes (OD = OS)</span>
                    </label>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                      Diopter (D)
                    </span>
                  </div>

                  {/* Eyes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Right Eye (OD) */}
                    <div className="bg-white p-3 rounded-xl border border-[#E8E3D8] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                          Right Eye (OD)
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">Oculus Dexter</span>
                      </div>
                      <select
                        value={rightPower}
                        onChange={e => handleRightPowerChange(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs font-semibold rounded-lg border border-[#E8E3D8] bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                      >
                        <optgroup label="Myopia (Minus Powers: 0.25 steps to -6.00, 0.50 steps to -10.00)">
                          {MINUS_POWERS.map(p => (
                            <option key={`r-${p}`} value={p}>{p} D</option>
                          ))}
                        </optgroup>
                        <optgroup label="Hyperopia / Reading (Plus Powers)">
                          {PLUS_POWERS.map(p => (
                            <option key={`r-${p}`} value={p}>{p} D</option>
                          ))}
                        </optgroup>
                        <optgroup label="Plano">
                          <option value="0.00">0.00 D (Plano)</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Left Eye (OS) */}
                    <div className="bg-white p-3 rounded-xl border border-[#E8E3D8] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#8C7048]" />
                          Left Eye (OS)
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">Oculus Sinister</span>
                      </div>
                      <select
                        value={samePower ? rightPower : leftPower}
                        disabled={samePower}
                        onChange={e => setLeftPower(e.target.value)}
                        className={`w-full px-2.5 py-2 text-xs font-semibold rounded-lg border border-[#E8E3D8] text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880] ${
                          samePower ? 'bg-stone-50 opacity-80 cursor-not-allowed' : 'bg-white'
                        }`}
                      >
                        <optgroup label="Myopia (Minus Powers: 0.25 steps to -6.00, 0.50 steps to -10.00)">
                          {MINUS_POWERS.map(p => (
                            <option key={`l-${p}`} value={p}>{p} D</option>
                          ))}
                        </optgroup>
                        <optgroup label="Hyperopia / Reading (Plus Powers)">
                          {PLUS_POWERS.map(p => (
                            <option key={`l-${p}`} value={p}>{p} D</option>
                          ))}
                        </optgroup>
                        <optgroup label="Plano">
                          <option value="0.00">0.00 D (Plano)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Toric Fields if isToric */}
                  {product.isToric && (
                    <div className="bg-white p-3 rounded-xl border border-[#E8E3D8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          Astigmatism Toric Parameters
                        </span>
                        <span className="text-[10px] text-[#8C7048] font-semibold">
                          Cylinder & Axis
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-stone-500 mb-1">Cylinder (CYL)</label>
                          <select
                            value={toricCyl}
                            onChange={e => setToricCyl(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs font-medium rounded-lg border border-[#E8E3D8] bg-white text-stone-900"
                          >
                            {TORIC_CYLINDERS.map(c => (
                              <option key={c} value={c}>{c} D</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 mb-1">Axis (AXIS)</label>
                          <select
                            value={toricAxis}
                            onChange={e => setToricAxis(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs font-medium rounded-lg border border-[#E8E3D8] bg-white text-stone-900"
                          >
                            {TORIC_AXES.map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Prescription Notes */}
                  <div className="bg-white p-2.5 rounded-xl border border-[#E8E3D8]">
                    <input
                      type="text"
                      value={customRxNotes}
                      onChange={e => setCustomRxNotes(e.target.value)}
                      placeholder="Doctor Rx notes, Axis or hospital prescription (Optional)"
                      className="w-full text-xs text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
                    />
                  </div>

                  {/* Verification Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs pt-1 px-1 text-stone-700">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-stone-900">Configured:</span>
                      <span className="whitespace-nowrap">OD: <strong>{rightPower}</strong> | OS: <strong>{samePower ? rightPower : leftPower}</strong></span>
                      {product.isToric && <span> | Cyl: <strong>{toricCyl}</strong> Axis: <strong>{toricAxis}</strong></span>}
                    </div>
                    <span className="text-[10px] text-stone-500">Includes Sterile Solution Pack</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Plano (0.00 Zero Power) selected. Pure cosmetic wear with zero distortion.</span>
                </div>
              )}
            </div>
          )}

          {/* Eyeglasses & Sunglasses Power Card */}
          {isGlasses && (
            <GlassesPowerCard category={product.category} value={glassesRx} onChange={setGlassesRx} />
          )}

          {/* Upload Your Prescription Card (right after the power card) */}
          {(isGlasses || isContactLens) && (
            <PrescriptionCardUpload value={rxCard} onChange={setRxCard} />
          )}

          {/* Features list */}
          {product.features && product.features.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-2">
                Craftsmanship & Key Features
              </span>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C5A880] font-bold text-sm leading-none">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#E8E3D8] rounded-full bg-white px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-stone-500 hover:text-black cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-stone-500 hover:text-black cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-full bg-[#121316] hover:bg-[#22252c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                <span>{addedAnimation ? '✓ Added to Bag' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Quick Order */}
            <button
              onClick={handleQuickWhatsApp}
              className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Instant Order via WhatsApp (Rs. {totalPrice.toLocaleString()})</span>
            </button>
          </div>

          {/* Trust assurances */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E8E3D8] text-[11px] text-stone-600">
            <div className="flex flex-col items-center text-center gap-1 p-2 bg-[#F3EFE8]/50 rounded-xl">
              <Truck className="w-4 h-4 text-[#C5A880]" />
              <span className="font-semibold text-stone-900">Free Delivery</span>
              <span className="text-[10px] text-stone-500">Across Pakistan</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1 p-2 bg-[#F3EFE8]/50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span className="font-semibold text-stone-900">1975 Heritage</span>
              <span className="text-[10px] text-stone-500">Karachi Opticians</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1 p-2 bg-[#F3EFE8]/50 rounded-xl">
              <RotateCcw className="w-4 h-4 text-[#C5A880]" />
              <span className="font-semibold text-stone-900">Exchange</span>
              <span className="text-[10px] text-stone-500">7-Day Fit Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RELATED PRODUCTS */}
      {/* ========================================================================= */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E8E3D8]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C7048]">
                Curated Recommendations
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900">
                You May Also Admire
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Interactive Image Zoom & Drag Inspection Modal */}
      <ProductImageZoomModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        images={activeGalleryImages}
        currentIndex={activeImageIndex}
        onIndexChange={setActiveImageIndex}
        productName={product.name}
        selectedColor={selectedColor}
        category={product.category}
      />
    </div>
  );
};

export default ProductDetailPage;
