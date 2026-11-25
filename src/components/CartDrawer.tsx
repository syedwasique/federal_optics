import React, { useSyncExternalStore } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, FileImage } from 'lucide-react';
import { describePowerShort } from '../utils/powerFormat';
import { AdvancePaymentNotice } from './AdvancePaymentNotice';
import { getCard, getCardsVersion, subscribeCards } from '../utils/prescriptionCards';

export const CartDrawer: React.FC = () => {
  // re-render when a prescription photo is added or wiped
  useSyncExternalStore(subscribeCards, getCardsVersion);
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalCount,
    triggerCheckoutCart
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E8E3D8] shadow-2xl flex flex-col justify-between text-[#121316]">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E3D8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
              <h2 className="font-heading text-xl font-semibold text-[#121316]">
                Shopping Bag ({totalCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-stone-500 hover:text-black hover:bg-[#E8E3D8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping banner */}
          <div className="px-5 py-3 bg-[#F3EFE8] border-b border-[#E8E3D8] text-xs">
            {remainingForFree > 0 ? (
              <p className="text-stone-700">
                Add <span className="font-semibold text-stone-900">Rs. {remainingForFree.toLocaleString()}</span> more to unlock <span className="font-semibold text-[#8C7048]">Free Shipping across Pakistan</span>!
              </p>
            ) : (
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <span>✓</span> You have unlocked Free Nationwide Shipping!
              </p>
            )}
            <div className="w-full bg-[#E8E3D8] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#C5A880] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items + checkout: on phones they scroll together so the items are never squeezed;
              from sm up the checkout stays pinned at the bottom as before */}
          <div className="flex-1 min-h-0 flex flex-col max-sm:overflow-y-auto">
          {/* Cart Items List */}
          <div className="flex-1 sm:overflow-y-auto p-5 space-y-4 divide-y divide-[#E8E3D8]">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F3EFE8] flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl text-stone-800">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our handcrafted eyeglasses, polarized sunglasses, and certified contact lenses.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#121316] text-white text-xs font-medium hover:bg-stone-800 transition-colors"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const basePrice = item.selectedPack ? item.selectedPack.price : item.product.price;
                const itemUnitPrice = basePrice + (item.selectedLens ? item.selectedLens.price : 0);
                const itemLineTotal = itemUnitPrice * item.quantity;

                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg border border-[#E8E3D8] shrink-0 bg-white"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm text-stone-900 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors ml-2"
                            title="Remove"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          SKU: {item.product.sku} • Color: {item.selectedColor}
                        </p>
                        {item.selectedPack && (
                          <div className="inline-block mt-1 mr-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                            {item.selectedPack.name}
                          </div>
                        )}
                        {item.powerSelection && (
                          <div className="inline-block mt-1 mr-1 px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-medium">
                            {describePowerShort(item.powerSelection)}
                          </div>
                        )}
                        {item.prescriptionCard && (() => {
                          const card = getCard(item.prescriptionCard.id);
                          return (
                            <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                              {card ? (
                                <img src={card.url} alt="Prescription card" className="w-8 h-8 rounded object-cover border border-[#E8E3D8]" />
                              ) : (
                                <span className="flex w-8 h-8 items-center justify-center rounded bg-[#F3EFE8] text-[#8C7048]"><FileImage className="w-4 h-4" /></span>
                              )}
                              <span className="text-stone-600">
                                {card ? 'Prescription card attached' : 'Prescription card: please send the photo in the WhatsApp chat'}
                              </span>
                            </div>
                          );
                        })()}
                        {item.selectedLens && (
                          <div className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                            item.selectedLens.id === 'custom-tech-whatsapp'
                              ? 'bg-[#25D366]/15 text-[#1b8a43]'
                              : 'bg-[#C5A880]/15 text-[#8C7048]'
                          }`}>
                            {item.selectedLens.name} {item.selectedLens.price > 0 ? `(+Rs. ${item.selectedLens.price.toLocaleString()})` : '(Specify on WhatsApp)'}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#E8E3D8] rounded-full bg-white px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="p-1 text-stone-600 hover:text-black"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="p-1 text-stone-600 hover:text-black"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="ml-auto text-right">
                          <span className="whitespace-nowrap font-sans text-xs font-bold text-stone-900 tabular-nums lining-nums">
                            Rs. {itemLineTotal.toLocaleString()}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-stone-500 tabular-nums lining-nums">
                              (Rs. {itemUnitPrice.toLocaleString()} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E8E3D8] bg-[#F3EFE8]/70 space-y-3">
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-stone-600 font-medium">Subtotal</span>
                <span className="font-sans text-lg sm:text-xl font-bold text-stone-900 tabular-nums lining-nums">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <AdvancePaymentNotice total={subtotal} />

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  triggerCheckoutCart();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-[#121316] hover:bg-[#22252c] text-white font-medium text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-black/10 transition-all cursor-pointer group"
              >
                <span>Order Bag via WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>100% Genuine Lenses • Karachi Optical Clinic Since 1975</span>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
