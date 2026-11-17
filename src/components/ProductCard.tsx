import React, { useState } from 'react';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { ShoppingBag, Check } from 'lucide-react';

const DISPOSABILITY_BADGE: Record<string, string> = {
  daily: 'Daily',
  monthly: 'Monthly',
  'three-month': '3-Month Wear',
  'six-month': '6-Month Wear',
  yearly: 'Yearly',
};

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart, triggerQuickOrder } = useCart();
  const { openProduct } = useNavigation();

  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const activeColor = product.availableColors[activeColorIndex] || product.availableColors[0];
  const selectedColor = activeColor?.name || 'Standard';
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerQuickOrder(product, selectedColor);
  };

  const nameParts = (() => {
    const delimiters = [' — ', ' \u2014 ', ' – ', ' - '];
    for (const delim of delimiters) {
      if (product.name.includes(delim)) {
        const parts = product.name.split(delim);
        return {
          title: parts[0].trim(),
          variant: parts.slice(1).join(' — ').trim()
        };
      }
    }
    return {
      title: product.name,
      variant: null
    };
  })();

  // Use the active color’s specific images if available, else fall back to product images
  const colorImages = (activeColor?.images && activeColor.images.length > 0)
    ? activeColor.images
    : product.images;

  // Filter out generic placeholders and instructional guides so hover only alternates between genuine product angles
  const genuineImages = (colorImages || []).filter(img => {
    if (!img) return false;
    const lower = img.toLowerCase();
    return !(
      lower.includes('transparent lense category') ||
      lower.includes('use this image') ||
      lower.includes('contact-lens-guides') ||
      lower.includes('guide-how-to') ||
      lower.includes('image used with every lense item')
    );
  });

  const primaryImage = genuineImages[0] || colorImages[0];
  const hasAlternateHover = genuineImages.length > 1;
  const hoverImage = hasAlternateHover ? genuineImages[1] : null;

  return (
    <div
      onClick={() => openProduct(product.id, selectedColor)}
      className={`@container group relative bg-white rounded-2xl border border-[#E8E3D8] hover:border-[#C5A880]/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer ${className}`}
    >
      {/* Frame Dimensions or Lens Disposability badge */}
      {product.measurements ? (
        <div className="absolute top-2 right-2 @[15rem]:top-3 @[15rem]:right-3 z-10">
          <span className="px-2 py-0.5 rounded bg-[#FAF8F5]/90 backdrop-blur-xs text-stone-600 text-[10px] font-medium border border-[#E8E3D8]">
            {product.frameSize || `${product.measurements.lensWidth}mm`}
          </span>
        </div>
      ) : (product.category === 'color-contacts' || product.category === 'clear-contacts') ? (
        <div className="absolute top-2 right-2 @[15rem]:top-3 @[15rem]:right-3 z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5]/95 backdrop-blur-xs text-[#8C7048] text-[10px] font-semibold border border-[#E8E3D8] shadow-xs">
            {DISPOSABILITY_BADGE[product.disposability ?? ''] ?? 'Contact Lens'}
          </span>
        </div>
      ) : null}

      {/* Product Image Stage */}
      <div className="relative aspect-square @[15rem]:aspect-4/3 w-full bg-[#FBF9F5] overflow-hidden flex items-center justify-center p-2 @[15rem]:p-3">
        {/* Angle 1: Primary View (Maintains smooth zoom animation on hover; only fades out when a genuine alternate angle exists) */}
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-contain transition-all duration-500 ease-out group-hover:scale-105 ${
            hasAlternateHover ? 'group-hover:opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Angle 2: 3/4 Perspective Angle (Shows dynamically upon hover ONLY when genuine alternate angle exists) */}
        {hasAlternateHover && hoverImage && (
          <img
            src={hoverImage}
            alt={`${product.name} alternate perspective angle`}
            className="absolute inset-0 w-full h-full object-contain p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-105 pointer-events-none"
            loading="lazy"
          />
        )}

        {/* Multi-angle indicator pill: only displayed if product has more than 1 genuine perspective angle */}
        {hasAlternateHover && (
          <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium tracking-wide">
              {genuineImages.length} {product.category === 'color-contacts' || product.category === 'clear-contacts' ? 'Views' : 'Angles'}
            </span>
          </div>
        )}

        {/* Quick actions overlay on desktop hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 rounded-full bg-[#121316]/90 hover:bg-[#121316] text-white text-xs font-semibold backdrop-blur-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppOrder}
            title="Order instantly via WhatsApp"
            className="p-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all shadow-md shrink-0"
          >
            <span className="text-[11px] font-bold px-1">WA</span>
          </button>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-3 @[15rem]:p-4 @[20rem]:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Brand & Subcategory */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[#8C7048] truncate">
              {product.brand}
            </span>
            <span className="hidden @[15rem]:inline text-[11px] text-stone-400 capitalize truncate max-w-[140px] text-right">
              {product.subCategory}
            </span>
          </div>

          {product.category === 'color-contacts' ? (
            <div className="@[15rem]:min-h-[68px]">
              {/* Collection Name */}
              <h3 
                className="font-sans text-[14px] @[15rem]:text-[15px] @[20rem]:text-[16px] font-bold text-stone-900 group-hover:text-[#8C7048] transition-colors leading-snug line-clamp-1"
                title={product.name}
              >
                {nameParts.title}
              </h3>

              {/* Highly Visible Shade Name Badge */}
              <div className="mt-2 flex items-center flex-wrap gap-1.5">
                <div className="inline-flex min-w-0 max-w-full items-center gap-1.5 @[15rem]:gap-2 px-2 @[15rem]:px-2.5 py-1 rounded-lg bg-[#FAF5EC] border border-[#DDD3C1] shadow-2xs">
                  {product.availableColors && product.availableColors.length > 0 && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-400 shrink-0 shadow-xs"
                      style={{ backgroundColor: product.availableColors[0].hex }}
                    />
                  )}
                  <span className="font-sans text-[12px] @[15rem]:text-[13px] font-bold text-stone-900 tracking-tight truncate">
                    <span className="hidden @[15rem]:inline">Shade: </span><span className="text-[#8C7048] font-extrabold">{nameParts.variant || product.availableColors?.[0]?.name}</span>
                  </span>
                </div>

                {product.lensColor && (
                  <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                    {product.lensColor}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Clean Sans Short Title (Wraps to 2 lines, avoids truncation collision) */}
              <h3 
                className="font-sans text-[14px] @[15rem]:text-[15px] @[20rem]:text-[16px] font-semibold text-stone-900 group-hover:text-[#8C7048] transition-colors leading-snug line-clamp-2 min-h-[2.5em]"
                title={product.name}
              >
                {nameParts.title}
              </h3>

              {/* Color variant swatches / label */}
              {product.availableColors && product.availableColors.length > 1 ? (
                <div className="mt-2.5 flex items-center justify-between gap-1 min-h-[22px]">
                  <div className="flex items-center gap-1.5">
                    {product.availableColors.slice(0, 5).map((color, idx) => {
                      const isActive = activeColorIndex === idx;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveColorIndex(idx);
                          }}
                          onMouseEnter={() => setActiveColorIndex(idx)}
                          className={`relative w-3.5 h-3.5 rounded-full border transition-all cursor-pointer after:absolute after:-inset-1.5 after:content-[''] ${
                            isActive
                              ? 'ring-2 ring-[#C5A880] ring-offset-1 scale-110 border-white shadow-xs'
                              : 'border-stone-300 opacity-75 hover:opacity-100 hover:scale-110'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                          aria-label={`Select ${color.name}`}
                        />
                      );
                    })}
                    {product.availableColors.length > 5 && (
                      <span className="text-[10px] text-stone-400 font-semibold ml-0.5">
                        +{product.availableColors.length - 5}
                      </span>
                    )}
                  </div>
                  <span className="hidden @[15rem]:inline font-sans text-[11px] text-stone-600 font-medium truncate max-w-[130px] text-right">
                    {activeColor?.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-2 min-h-[18px]">
                  {product.availableColors && product.availableColors.length > 0 && (
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                      style={{ backgroundColor: product.availableColors[0].hex }}
                    />
                  )}
                  <span className="font-sans text-[12px] text-stone-600 font-medium truncate">
                    {nameParts.variant || (product.availableColors && product.availableColors[0]?.name) || 'Standard Model'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing and Mobile Quick Add */}
        <div className="mt-3 @[15rem]:mt-4 pt-3 border-t border-[#E8E3D8]/60 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-sans font-semibold text-sm @[20rem]:text-base text-stone-900 tabular-nums lining-nums whitespace-nowrap">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-xs text-stone-400 line-through font-normal tabular-nums lining-nums whitespace-nowrap">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="hidden @[15rem]:block text-[10px] text-stone-500">
              COD & Karachi Pickup Available
            </span>
          </div>

          {/* Mobile direct add button */}
          <div className="sm:hidden flex shrink-0 items-center gap-1.5">
            <button
              onClick={handleQuickAdd}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#121316] text-white"
              aria-label="Add to bag"
            >
              {justAdded ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4 text-[#C5A880]" />}
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white text-[11px] font-bold"
              aria-label="Order via WhatsApp"
            >
              WA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
